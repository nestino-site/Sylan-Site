import type { Metadata } from "next";
import { cache } from "react";
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
import { buildContentExcerpt, renderPublishedMarkdown } from "@/lib/markdown-content";

export const revalidate = 60;
export const runtime = "nodejs";

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
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
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
    origin: host ? `${proto}://${host}` : "https://www.villasilyan.com",
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
  const canonicalUrl = `${resolved.origin}${canonical}`;
  const description = record.metaDescription ?? buildContentExcerpt(record.finalContent);
  const title = record.metaTitle ?? record.title;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: "Villa Silyan",
      locale: resolved.safeLang === "ar" ? "ar_AR" : "en_US",
      publishedTime: record.publishedAt ?? undefined,
      modifiedTime: new Date(record.updatedAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export default async function Page(props: Props) {
  const resolved = await resolveContext(props);
  if (!resolved) notFound();

  const record = await loadPublishedRecord(resolved.siteId, resolved.safeLang, resolved.slugValue);
  if (!record || !isPublishedPageStatus(record.status)) notFound();

  const safeHtml = renderPublishedMarkdown(record.finalContent);
  const description = record.metaDescription ?? buildContentExcerpt(record.finalContent);
  const canonicalPath = `/${resolved.safeLang}/${resolved.slugValue}`;
  const canonicalUrl = `${resolved.origin}${canonicalPath}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: record.title,
    description,
    inLanguage: resolved.safeLang,
    datePublished: record.publishedAt ?? undefined,
    dateModified: new Date(record.updatedAt).toISOString(),
    mainEntityOfPage: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
      url: resolved.origin,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${resolved.origin}/${resolved.safeLang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: record.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="pt-24 pb-16 cms-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />
      <article className="content-wrapper cms-article">
        <header className="cms-hero">
          <p className="cms-kicker">Villa Silyan Guide</p>
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)]">
            {record.title}
          </h1>
          {description && <p className="cms-description">{description}</p>}
          {record.publishedAt && (
            <p className="cms-date">
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
