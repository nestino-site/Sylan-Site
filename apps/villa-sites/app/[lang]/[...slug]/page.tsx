import type { Metadata } from "next";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteBySubdomain } from "@nestino/villa-site/lib/tenant";
import {
  effectiveSiteIdForPublishedContent,
  fetchPublishedBySlug,
  getPublishedRecordBySlug,
  normalizeSlug,
  upsertPublishedRecord,
  type SupportedPublishedLang,
} from "@/lib/nestino-published-content";

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
  const siteSlug = h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  if (!ctx) return null;

  return {
    safeLang,
    slugValue,
    siteId: effectiveSiteIdForPublishedContent(ctx.site.id),
  };
}

const resolvePublishedRecord = cache(async function resolvePublishedRecord(
  siteId: string,
  lang: SupportedPublishedLang,
  slug: string
) {
  const fromStore = await getPublishedRecordBySlug(siteId, lang, slug);
  if (fromStore) return fromStore;

  const baseUrl = process.env.NESTINO_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;

  const fromBackend = await fetchPublishedBySlug(baseUrl, slug, lang);
  if (!fromBackend) return null;
  if (fromBackend.siteId !== siteId) return null;

  await upsertPublishedRecord(fromBackend);
  return fromBackend;
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolved = await resolveContext(props);
  if (!resolved) return { robots: { index: false, follow: false } };

  const record = await resolvePublishedRecord(
    resolved.siteId,
    resolved.safeLang,
    resolved.slugValue
  );
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

  const record = await resolvePublishedRecord(
    resolved.siteId,
    resolved.safeLang,
    resolved.slugValue
  );
  if (!record || record.status.toLowerCase() !== "published") notFound();

  return (
    <main className="pt-24 pb-16 section-y">
      <article className="content-wrapper max-w-3xl">
        <header className="mb-8">
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)]">
            {record.title}
          </h1>
        </header>
        <section
          className="prose-villa"
          dangerouslySetInnerHTML={{ __html: record.finalContent }}
        />
      </article>
    </main>
  );
}
