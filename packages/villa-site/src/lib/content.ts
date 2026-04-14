import { unstable_cache } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import {
  getDb,
  isDatabaseConfigured,
  contentPages,
  contentVersions,
  type BodyJson,
} from "@nestino/db";

// Public guide URLs use /{lang}/guides/... ; DB `content_pages.slug` MUST match
// `guides/<segment>(/<segment>)*` (e.g. guides/best-time-canggu) — same string the
// catch-all route builds via `guides/${params.slug?.join("/") ?? ""}` for articles.

export type PublishedVersion = {
  id: string;
  pageId: string;
  languageCode: string;
  version: number;
  title: string;
  bodyJson: BodyJson;
  metaTitle: string | null;
  metaDescription: string | null;
  schemaJson: Record<string, unknown> | Record<string, unknown>[] | null;
  publishedAt: Date | null;
};

export type PageWithVersion = {
  page: {
    id: string;
    siteId: string;
    slug: string;
    pageType: string;
  };
  version: PublishedVersion;
};

// Load the current published content version for a page by slug + language.
// Returns null if no published version exists for that lang (caller should
// try the site's default language or show a 404).
export const getPublishedPage = unstable_cache(
  async (
    siteId: string,
    slug: string,
    languageCode: string
  ): Promise<PageWithVersion | null> => {
    if (!isDatabaseConfigured()) return null;

    const db = getDb();

    const rows = await db
      .select({
        page: {
          id: contentPages.id,
          siteId: contentPages.siteId,
          slug: contentPages.slug,
          pageType: contentPages.pageType,
        },
        version: {
          id: contentVersions.id,
          pageId: contentVersions.pageId,
          languageCode: contentVersions.languageCode,
          version: contentVersions.version,
          title: contentVersions.title,
          bodyJson: contentVersions.bodyJson,
          metaTitle: contentVersions.metaTitle,
          metaDescription: contentVersions.metaDescription,
          schemaJson: contentVersions.schemaJson,
          publishedAt: contentVersions.publishedAt,
        },
      })
      .from(contentPages)
      .innerJoin(
        contentVersions,
        and(
          eq(contentVersions.pageId, contentPages.id),
          eq(contentVersions.isCurrent, true),
          eq(contentVersions.status, "published"),
          eq(contentVersions.languageCode, languageCode)
        )
      )
      .where(
        and(eq(contentPages.siteId, siteId), eq(contentPages.slug, slug))
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    return {
      page: row.page,
      version: row.version as PageWithVersion["version"],
    };
  },
  ["published-page"],
  { revalidate: 60, tags: ["content"] }
);

export type PublishedGuideListItem = {
  slug: string;
  title: string;
  publishedAt: Date | null;
  excerpt: string | null;
};

function excerptFromVersion(
  metaDescription: string | null,
  bodyJson: BodyJson
): string | null {
  const trimmed = metaDescription?.trim();
  if (trimmed) return trimmed.length > 280 ? `${trimmed.slice(0, 277)}…` : trimmed;
  const firstPara = bodyJson.blocks.find(
    (b): b is { type: "paragraph"; text: string } => b.type === "paragraph"
  );
  const t = firstPara?.text?.trim() ?? "";
  if (!t) return null;
  return t.length > 220 ? `${t.slice(0, 217)}…` : t;
}

/** Published `guide` pages for a site + language (hub listing). */
export const listPublishedGuides = unstable_cache(
  async (
    siteId: string,
    languageCode: string
  ): Promise<PublishedGuideListItem[]> => {
    if (!isDatabaseConfigured()) return [];

    const db = getDb();

    const rows = await db
      .select({
        slug: contentPages.slug,
        title: contentVersions.title,
        publishedAt: contentVersions.publishedAt,
        metaDescription: contentVersions.metaDescription,
        bodyJson: contentVersions.bodyJson,
      })
      .from(contentPages)
      .innerJoin(
        contentVersions,
        and(
          eq(contentVersions.pageId, contentPages.id),
          eq(contentVersions.isCurrent, true),
          eq(contentVersions.status, "published"),
          eq(contentVersions.languageCode, languageCode)
        )
      )
      .where(
        and(
          eq(contentPages.siteId, siteId),
          eq(contentPages.status, "active"),
          eq(contentPages.pageType, "guide")
        )
      )
      .orderBy(desc(contentVersions.publishedAt));

    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      publishedAt: r.publishedAt,
      excerpt: excerptFromVersion(r.metaDescription, r.bodyJson as BodyJson),
    }));
  },
  ["published-guides"],
  { revalidate: 60, tags: ["content"] }
);

/** Language codes that have a current published version for this page slug (hreflang). */
export const listPublishedLocalesForSlug = unstable_cache(
  async (siteId: string, slug: string): Promise<string[]> => {
    if (!isDatabaseConfigured()) return [];

    const db = getDb();

    const rows = await db
      .select({ languageCode: contentVersions.languageCode })
      .from(contentPages)
      .innerJoin(
        contentVersions,
        and(
          eq(contentVersions.pageId, contentPages.id),
          eq(contentVersions.isCurrent, true),
          eq(contentVersions.status, "published")
        )
      )
      .where(
        and(
          eq(contentPages.siteId, siteId),
          eq(contentPages.slug, slug),
          eq(contentPages.status, "active")
        )
      );

    return [...new Set(rows.map((r) => r.languageCode))];
  },
  ["published-locales-for-slug"],
  { revalidate: 60, tags: ["content"] }
);