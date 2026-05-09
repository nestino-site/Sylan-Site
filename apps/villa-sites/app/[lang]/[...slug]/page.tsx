import type { Metadata } from "next";
import { cache } from "react";
import sanitizeHtml from "sanitize-html";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { resolveSiteContext } from "@nestino/villa-site/lib/tenant";
import {
  effectiveSiteIdForPublishedContent,
  fetchPublishedBySlug,
  isPublishedPageStatus,
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
  const host = h.get("host") ?? "";
  const headerSlug = h.get("x-nestino-slug");
  const ctx = await resolveSiteContext(host, headerSlug);

  const envSiteId = process.env.NESTINO_SITE_ID?.trim();
  /** Prefer env site id for Nestino API (must match CMS); DB tenant id can diverge in misconfigured deploys. */
  const siteIdForNestino =
    envSiteId ??
    (ctx ? effectiveSiteIdForPublishedContent(ctx.site.id) : null);
  if (!siteIdForNestino) return null;

  return {
    safeLang,
    slugValue,
    siteId: siteIdForNestino,
  };
}

/** Published pages load from Nestino on each render; the publish webhook only revalidates ISR cache. */
const loadPublishedRecord = cache(async function loadPublishedRecord(
  siteId: string,
  lang: SupportedPublishedLang,
  slug: string
) {
  const baseUrl = process.env.NESTINO_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;

  const fromBackend = await fetchPublishedBySlug(baseUrl, siteId, slug, lang);
  if (!fromBackend || fromBackend.siteId !== siteId) return null;

  return fromBackend;
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
  if (!record || !isPublishedPageStatus(record.status)) notFound();

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
