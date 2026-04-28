import { unstable_cache } from "next/cache";
import { and, eq, isNotNull, or, sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured, sites, tenants, siteLanguages } from "@nestino/db";

import { resolveSlug } from "./slug";

/** Hostnames to match against `sites.custom_domain` (apex ↔ www). */
function customDomainLookupVariants(hostname: string): string[] {
  const h = hostname.toLowerCase();
  const set = new Set<string>([h]);
  if (h.startsWith("www.")) {
    set.add(h.slice(4));
  } else if (h.includes(".") && h !== "localhost") {
    set.add(`www.${h}`);
  }
  return [...set];
}

export type SiteLanguageRow = {
  languageCode: string;
  tier: number;
  status: string;
};

export type SiteContext = {
  site: {
    id: string;
    tenantId: string;
    subdomain: string;
    status: string;
    defaultLanguage: string;
    theme: string;
    accentHex: string | null;
    robotsTemplate: string | null;
    gscVerificationToken: string | null;
    cmsApiKeyHash: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    destination: string;
    locationLabel: string | null;
    ownerPhone: string | null;
    writingStyle: string | null;
  };
  languages: SiteLanguageRow[];
};

// ---------------------------------------------------------------------------
// Offline fallback when DATABASE_URL is not set.
// - In development: any slug gets the Silyan demo context so UI is testable.
// - In production: only `silyan` resolves without Postgres (other slugs need a DB row).
// ---------------------------------------------------------------------------
const DEV_FALLBACK_CTX: SiteContext = {
  site: {
    id: "00000000-0000-0000-0000-000000000001",
    tenantId: "00000000-0000-0000-0000-000000000002",
    subdomain: "silyan",
    status: "demo",
    defaultLanguage: "en",
    theme: "light",
    accentHex: "#7D6B52",
    robotsTemplate: null,
    gscVerificationToken: null,
    cmsApiKeyHash: "dev-hash",
  },
  tenant: {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Silyan Villas",
    slug: "silyan",
    destination: "antalya",
    locationLabel: "Hisarçandır, Konyaaltı, Antalya, Turkey",
    ownerPhone: "+905316960953",
    writingStyle: "warm minimalist",
  },
  languages: [
    { languageCode: "en", tier: 1, status: "active" },
    { languageCode: "tr", tier: 1, status: "active" },
    { languageCode: "ar", tier: 1, status: "active" },
    { languageCode: "ru", tier: 1, status: "active" },
  ],
};

// Resolves a site by subdomain (from x-nestino-slug middleware header).
// Cached per slug for 60 seconds; invalidate with revalidateTag('site:{id}').
export const getSiteBySubdomain = unstable_cache(
  async (subdomain: string): Promise<SiteContext | null> => {
    if (!isDatabaseConfigured()) {
      if (process.env.NODE_ENV === "development") {
        return DEV_FALLBACK_CTX;
      }
      if (subdomain === DEV_FALLBACK_CTX.site.subdomain) {
        return DEV_FALLBACK_CTX;
      }
      return null;
    }

    try {
      const db = getDb();

      const rows = await db
        .select({
          site: {
            id: sites.id,
            tenantId: sites.tenantId,
            subdomain: sites.subdomain,
            status: sites.status,
            defaultLanguage: sites.defaultLanguage,
            theme: sites.theme,
            accentHex: sites.accentHex,
            robotsTemplate: sites.robotsTemplate,
            gscVerificationToken: sites.gscVerificationToken,
            cmsApiKeyHash: sites.cmsApiKeyHash,
          },
          tenant: {
            id: tenants.id,
            name: tenants.name,
            slug: tenants.slug,
            destination: tenants.destination,
            locationLabel: tenants.locationLabel,
            ownerPhone: tenants.ownerPhone,
            writingStyle: tenants.writingStyle,
          },
        })
        .from(sites)
        .innerJoin(tenants, eq(sites.tenantId, tenants.id))
        .where(eq(sites.subdomain, subdomain))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      const langs = await db
        .select({
          languageCode: siteLanguages.languageCode,
          tier: siteLanguages.tier,
          status: siteLanguages.status,
        })
        .from(siteLanguages)
        .where(eq(siteLanguages.siteId, row.site.id));

      return {
        site: row.site,
        tenant: row.tenant,
        languages: langs,
      };
    } catch {
      // Bad DATABASE_URL, cold start timeouts, SSL, etc. — avoid 500 for the demo slug.
      if (subdomain === DEV_FALLBACK_CTX.site.subdomain) {
        return DEV_FALLBACK_CTX;
      }
      return null;
    }
  },
  ["site-by-subdomain"],
  { revalidate: 60, tags: ["sites"] }
);

/**
 * Resolves tenant context from the Host header: custom domain first (DB), then
 * subdomain routing via {@link resolveSlug}. Use when middleware did not set
 * `x-nestino-slug` (e.g. /robots.txt, /sitemap.xml) or when subdomain slug does
 * not match DB (`www` vs real tenant).
 */
export const getSiteByHost = unstable_cache(
  async (hostHeader: string): Promise<SiteContext | null> => {
    const hostname = (hostHeader.split(":")[0] ?? "").toLowerCase();

    if (hostname && isDatabaseConfigured()) {
      try {
        const db = getDb();
        const variants = customDomainLookupVariants(hostname);

        const rows = await db
          .select({
            site: {
              id: sites.id,
              tenantId: sites.tenantId,
              subdomain: sites.subdomain,
              status: sites.status,
              defaultLanguage: sites.defaultLanguage,
              theme: sites.theme,
              accentHex: sites.accentHex,
              robotsTemplate: sites.robotsTemplate,
              gscVerificationToken: sites.gscVerificationToken,
              cmsApiKeyHash: sites.cmsApiKeyHash,
            },
            tenant: {
              id: tenants.id,
              name: tenants.name,
              slug: tenants.slug,
              destination: tenants.destination,
              locationLabel: tenants.locationLabel,
              ownerPhone: tenants.ownerPhone,
              writingStyle: tenants.writingStyle,
            },
          })
          .from(sites)
          .innerJoin(tenants, eq(sites.tenantId, tenants.id))
          .where(
            and(
              isNotNull(sites.customDomain),
              or(
                ...variants.map((v) => sql`lower(${sites.customDomain}) = ${v}`)
              )
            )
          )
          .limit(1);

        const row = rows[0];
        if (row) {
          const langs = await db
            .select({
              languageCode: siteLanguages.languageCode,
              tier: siteLanguages.tier,
              status: siteLanguages.status,
            })
            .from(siteLanguages)
            .where(eq(siteLanguages.siteId, row.site.id));

          return {
            site: row.site,
            tenant: row.tenant,
            languages: langs,
          };
        }
      } catch {
        // fall through to subdomain
      }
    }

    const slug = resolveSlug(hostHeader);
    return getSiteBySubdomain(slug);
  },
  ["site-by-host"],
  { revalidate: 60, tags: ["sites"] }
);

export async function resolveSiteContext(
  hostHeader: string,
  headerSlug: string | null
): Promise<SiteContext | null> {
  const slug = (headerSlug ?? "").trim();
  if (slug) {
    const byHeader = await getSiteBySubdomain(slug);
    if (byHeader) return byHeader;
  }
  return getSiteByHost(hostHeader);
}

// Returns only languages with status = 'active'
export function getActiveLangs(ctx: SiteContext): string[] {
  return ctx.languages
    .filter((l) => l.status === "active")
    .sort((a, b) => a.tier - b.tier)
    .map((l) => l.languageCode);
}