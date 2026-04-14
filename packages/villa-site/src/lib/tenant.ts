import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured, sites, tenants, siteLanguages } from "@nestino/db";

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

// Returns only languages with status = 'active'
export function getActiveLangs(ctx: SiteContext): string[] {
  return ctx.languages
    .filter((l) => l.status === "active")
    .sort((a, b) => a.tier - b.tier)
    .map((l) => l.languageCode);
}