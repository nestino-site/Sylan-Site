import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import { getDb, isDatabaseConfigured, contentPages, contentVersions } from "@nestino/db";
import {
  resolveSiteContext,
  getActiveLangs,
  type SiteContext,
} from "@nestino/villa-site/lib/tenant";

import { getPublicSiteOrigin } from "@/lib/public-site-url";

export type SitemapUrlEntry = { url: string; lastModified?: Date };

const STATIC_SEO_PATHS = [
  "/villas-in-antalya-with-private-pool",
  "/best-areas-to-stay-in-antalya",
  "/private-family-villas-in-antalya",
] as const;

const FALLBACK_LANGS = ["en", "tr", "ar", "ru"] as const;

function pickLangs(ctx: SiteContext | null): string[] {
  if (!ctx) return [...FALLBACK_LANGS];
  const fromDb = getActiveLangs(ctx);
  return fromDb.length > 0 ? fromDb : [...FALLBACK_LANGS];
}

function buildCoreUrls(base: string, langs: string[]): SitemapUrlEntry[] {
  const entries: SitemapUrlEntry[] = [];
  const now = new Date();

  for (const lang of langs) {
    entries.push({ url: `${base}/${lang}/`, lastModified: now });
    entries.push({ url: `${base}/${lang}/guides`, lastModified: now });
  }

  for (const lang of langs) {
    for (const path of STATIC_SEO_PATHS) {
      entries.push({ url: `${base}/${lang}${path}`, lastModified: now });
    }
  }

  return entries;
}

function fallbackBaseFromEnv(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return null;
}

/**
 * Collects all URLs for /sitemap.xml. Used by the Route Handler (not MetadataRoute)
 * so Vercel always receives real XML with entries — Next's built-in sitemap serializer
 * has produced empty urlsets for some deployments.
 */
export async function collectSitemapUrls(): Promise<SitemapUrlEntry[]> {
  const h = await headers();
  const { siteUrl: base, hostForTenant } = await getPublicSiteOrigin();

  const ctx = await resolveSiteContext(hostForTenant, h.get("x-nestino-slug"));
  const langs = pickLangs(ctx);

  let entries = buildCoreUrls(base, langs);

  if (!ctx || !isDatabaseConfigured()) {
    return entries.length > 0 ? entries : coreFromEnvFallback();
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
        });
      }
    }
  } catch {
    // keep core urls
  }

  return entries.length > 0 ? entries : coreFromEnvFallback();
}

function coreFromEnvFallback(): SitemapUrlEntry[] {
  const base = fallbackBaseFromEnv();
  if (!base) {
    return [{ url: "https://localhost/en/", lastModified: new Date() }];
  }
  return buildCoreUrls(base, [...FALLBACK_LANGS]);
}

/** Same URL set as collectSitemapUrls core when request context fails — keeps robots/sitemap consistent. */
export function buildEmergencyEntriesFromEnv(): SitemapUrlEntry[] {
  return coreFromEnvFallback();
}
