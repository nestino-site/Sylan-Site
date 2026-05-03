import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import { getDb, isDatabaseConfigured, contentPages, contentVersions } from "@nestino/db";
import {
  resolveSiteContext,
  getActiveLangs,
  type SiteContext,
} from "@nestino/villa-site/lib/tenant";

import { getPublicSiteOrigin } from "@/lib/public-site-url";

/** ISO date hints for crawlers (sitemap changefreq). */
export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

/**
 * One logical URL path across all active locales (hreflang group).
 * `postLangPath` is the segment(s) after /<lang>/ ; empty = homepage.
 */
export type SitemapPageEntry = {
  postLangPath: string;
  langs: string[];
  lastModified: Date;
  priority: number;
  changefreq: SitemapChangeFreq;
};

export type SitemapCollectResult = {
  base: string;
  pages: SitemapPageEntry[];
};

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

function normalizePostLangPath(slug: string): string {
  return slug.replace(/^\/+/, "").trim();
}

function mergePage(a: SitemapPageEntry, b: SitemapPageEntry): SitemapPageEntry {
  const lastModified = a.lastModified > b.lastModified ? a.lastModified : b.lastModified;
  const priority = Math.max(a.priority, b.priority);
  const changefreq = a.priority >= b.priority ? a.changefreq : b.changefreq;
  return {
    postLangPath: a.postLangPath,
    langs: a.langs,
    lastModified,
    priority,
    changefreq,
  };
}

function addToMap(map: Map<string, SitemapPageEntry>, page: SitemapPageEntry): void {
  const key = page.postLangPath;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, { ...page });
    return;
  }
  map.set(key, mergePage(existing, page));
}

function buildCorePages(langs: string[], now: Date): SitemapPageEntry[] {
  const commonLangs = [...langs];
  const out: SitemapPageEntry[] = [
    {
      postLangPath: "",
      langs: commonLangs,
      lastModified: now,
      priority: 1,
      changefreq: "daily",
    },
    {
      postLangPath: "guides",
      langs: commonLangs,
      lastModified: now,
      priority: 0.85,
      changefreq: "weekly",
    },
  ];

  for (const path of STATIC_SEO_PATHS) {
    out.push({
      postLangPath: normalizePostLangPath(path),
      langs: commonLangs,
      lastModified: now,
      priority: 0.9,
      changefreq: "weekly",
    });
  }

  return out;
}

function pagesFromMap(map: Map<string, SitemapPageEntry>): SitemapPageEntry[] {
  return [...map.values()].sort((a, b) =>
    a.postLangPath.localeCompare(b.postLangPath, "en")
  );
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
 * Collects grouped pages for /sitemap.xml. Used by the Route Handler (not MetadataRoute)
 * so Vercel always receives real XML with entries — Next's built-in sitemap serializer
 * has produced empty urlsets for some deployments.
 */
export async function collectSitemapUrls(): Promise<SitemapCollectResult> {
  const h = await headers();
  const { siteUrl: base, hostForTenant } = await getPublicSiteOrigin();

  const ctx = await resolveSiteContext(hostForTenant, h.get("x-nestino-slug"));
  const langs = pickLangs(ctx);
  const now = new Date();

  const map = new Map<string, SitemapPageEntry>();
  for (const p of buildCorePages(langs, now)) {
    addToMap(map, p);
  }

  if (!ctx || !isDatabaseConfigured()) {
    const pages =
      map.size > 0 ? pagesFromMap(map) : corePagesFromEnvFallbackMap(new Date());
    return { base, pages };
  }

  try {
    const db = getDb();

    const cmsPages = await db
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

    for (const page of cmsPages) {
      const postLangPath = normalizePostLangPath(page.slug ?? "");
      if (!postLangPath) continue;

      addToMap(map, {
        postLangPath,
        langs,
        lastModified: page.publishedAt ?? now,
        priority: 0.8,
        changefreq: "weekly",
      });
    }
  } catch {
    // keep core urls
  }

  const pages = map.size > 0 ? pagesFromMap(map) : corePagesFromEnvFallbackMap(now);
  return { base, pages };
}

function corePagesFromEnvFallbackMap(now: Date): SitemapPageEntry[] {
  const base = fallbackBaseFromEnv();
  if (!base) {
    return [
      {
        postLangPath: "",
        langs: ["en"],
        lastModified: now,
        priority: 1,
        changefreq: "daily",
      },
    ];
  }
  return buildCorePages([...FALLBACK_LANGS], now);
}

/** Same URL set as collectSitemapUrls core when request context fails — keeps robots/sitemap consistent. */
export function buildEmergencyEntriesFromEnv(): SitemapCollectResult {
  const now = new Date();
  const base = fallbackBaseFromEnv() ?? "http://localhost";
  const pages = corePagesFromEnvFallbackMap(now);
  return { base, pages };
}

/** Public origin + path after /<lang>/ → absolute URL (homepage uses trailing slash). */
export function buildSitemapLoc(base: string, lang: string, postLangPath: string): string {
  const root = base.replace(/\/$/, "");
  const segment = postLangPath.trim().replace(/^\/+/, "");
  if (!segment) return `${root}/${lang}/`;
  return `${root}/${lang}/${segment}`;
}

/** Prefer English for x-default when available (common GEO default). */
export function pickXDefaultLang(langs: string[]): string {
  const uniq = [...new Set(langs)];
  if (uniq.includes("en")) return "en";
  return uniq[0] ?? "en";
}
