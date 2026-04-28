import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import { getDb, isDatabaseConfigured, contentPages, contentVersions } from "@nestino/db";
import {
  resolveSiteContext,
  getActiveLangs,
  type SiteContext,
} from "@nestino/villa-site/lib/tenant";

const STATIC_SEO_PATHS = [
  "/villas-in-antalya-with-private-pool",
  "/best-areas-to-stay-in-antalya",
  "/private-family-villas-in-antalya",
] as const;

/** When DB is offline or site_languages is empty — matches typical Silyan deploy. */
const FALLBACK_LANGS = ["en", "tr", "ar", "ru"] as const;

function pickLangs(ctx: SiteContext | null): string[] {
  if (!ctx) return [...FALLBACK_LANGS];
  const fromDb = getActiveLangs(ctx);
  return fromDb.length > 0 ? fromDb : [...FALLBACK_LANGS];
}

/** Core URLs every villa site should expose (home, guides, static SEO paths). */
function buildCoreEntries(base: string, langs: string[]): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const lang of langs) {
    entries.push({
      url: `${base}/${lang}/`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(langs.map((l) => [l, `${base}/${l}/`])),
      },
    });
    entries.push({
      url: `${base}/${lang}/guides`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(langs.map((l) => [l, `${base}/${l}/guides`])),
      },
    });
  }

  for (const lang of langs) {
    for (const path of STATIC_SEO_PATHS) {
      entries.push({
        url: `${base}/${lang}${path}`,
        lastModified: now,
        alternates: {
          languages: Object.fromEntries(langs.map((l) => [l, `${base}/${l}${path}`])),
        },
      });
    }
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") ?? "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const base = `${protocol}://${host}`;

  const ctx = await resolveSiteContext(host, h.get("x-nestino-slug"));
  const langs = pickLangs(ctx);

  let entries = buildCoreEntries(base, langs);

  if (!ctx || !isDatabaseConfigured()) {
    return entries;
  }

  try {
    const db = getDb();

    const pages = await db
      .selectDistinctOn([contentPages.slug], {
        slug: contentPages.slug,
        publishedAt: contentVersions.publishedAt,
      })
      .from(contentPages)
      .innerJoin(
        contentVersions,
        and(
          eq(contentVersions.pageId, contentPages.id),
          eq(contentVersions.isCurrent, true),
          eq(contentVersions.status, "published")
        )
      )
      .where(eq(contentPages.siteId, ctx.site.id))
      .orderBy(asc(contentPages.slug));

    for (const page of pages) {
      for (const lang of langs) {
        const pagePath = page.slug ? `/${page.slug}` : "";
        entries.push({
          url: `${base}/${lang}${pagePath}`,
          lastModified: page.publishedAt ?? new Date(),
          alternates: {
            languages: Object.fromEntries(
              langs.map((l) => [l, `${base}/${l}${pagePath}`])
            ),
          },
        });
      }
    }
  } catch {
    // DB errors — keep core entries only
  }

  return entries;
}
