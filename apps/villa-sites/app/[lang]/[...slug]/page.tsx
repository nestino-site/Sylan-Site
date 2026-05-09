import type { Metadata } from "next";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteBySubdomain } from "@nestino/villa-site/lib/tenant";
import {
  effectiveSiteIdForPublishedContent,
  getPublishedRecordBySlug,
  normalizeSlug,
  type SupportedPublishedLang,
} from "@/lib/nestino-published-content";

export const revalidate = 60;
export const runtime = "nodejs";

/** Safe subset for Nestino-provided HTML (defense in depth). */
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "figure",
    "figcaption",
    "article",
    "section",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height", "loading", "class"],
    a: ["href", "name", "target", "rel", "class"],
    p: ["class"],
    div: ["class"],
    span: ["class"],
  },
};

type Props = {
  params: Promise<{ lang: string; slug: string[] }>;
};

function toSupportedLang(raw: string): SupportedPublishedLang | null {
  if (raw === "en" || raw === "ar") return raw;
  return null;
}

async function resolveContext(props: Props) {
  const { lang, slug } = await props.params;
  const safeLang = toSupportedLang(lang);
  if (!safeLang) return null;

  const slugValue = normalizeSlug((slug ?? []).join("/"));
  if (!slugValue) return null;

  const h = await headers();
  const siteSlug = h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  if (!ctx) return null;

  return {
    safeLang,
    slugValue,
    siteId: effectiveSiteIdForPublishedContent(ctx.site.id),
  };
}

/** Published pages are loaded from the store populated by the Nestino webhook (no unverified slug-query APIs). */
const loadPublishedRecord = cache(async function loadPublishedRecord(
  siteId: string,
  lang: SupportedPublishedLang,
  slug: string
) {
  return getPublishedRecordBySlug(siteId, lang, slug);
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolved = await resolveContext(props);
  if (!resolved) return { robots: { index: false, follow: false } };

  const record = await loadPublishedRecord(resolved.siteId, resolved.safeLang, resolved.slugValue);
  if (!record) return { robots: { index: false, follow: false } };

  const canonical = `/${resolved.safeLang}/${resolved.slugValue}`;
  return {
    title: record.metaTitle ?? record.title,
    description: record.metaDescription ?? undefined,
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

export default async function Page(props: Props) {
  const resolved = await resolveContext(props);
  if (!resolved) notFound();

  const record = await loadPublishedRecord(resolved.siteId, resolved.safeLang, resolved.slugValue);
  if (!record || record.status.toLowerCase() !== "published") notFound();

  const safeHtml = sanitizeHtml(record.finalContent, SANITIZE_OPTS);

  return (
    <main className="pt-24 pb-16 section-y">
      <article className="content-wrapper max-w-3xl">
        <header className="mb-8">
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)]">
            {record.title}
          </h1>
          {record.publishedAt && (
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              <time dateTime={record.publishedAt}>
                {new Intl.DateTimeFormat(resolved.safeLang, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(record.publishedAt))}
              </time>
            </p>
          )}
        </header>
        <section className="prose-villa" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </article>
    </main>
  );
}
