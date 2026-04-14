import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import BlockRenderer from "../components/block-renderer";
import type { BodyJson } from "@nestino/db";
import {
  getPublishedPage,
  listPublishedGuides,
  listPublishedLocalesForSlug,
} from "../lib/content";
import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

export type GuidesParams = { lang: string; siteSlug?: string; slug?: string[] };

type Props = { params: Promise<GuidesParams>; pathPrefix: string };

const HUB_META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Guides — Silyan Villas",
    description: "Practical notes on Antalya, the neighborhood, and planning a stay in the hills above Konyaaltı.",
  },
  tr: {
    title: "Rehberler — Silyan Villas",
    description: "Antalya, mahalle ve Konyaaltı üzerindeki tepelerde konaklama hakkında notlar.",
  },
  ar: {
    title: "أدلة — سيليان فيلاز",
    description: "ملاحظات عملية عن أنطاليا والحي وتخطيط الإقامة.",
  },
  ru: {
    title: "Гиды — Silyan Villas",
    description: "Заметки об Анталии, районе и планировании отдыха в горах над Конъяалты.",
  },
};

const HUB_COPY: Record<
  string,
  {
    kicker: string;
    h1: string;
    emptyTitle: string;
    emptyBody: string;
    read: string;
    related: string;
    faq: string;
  }
> = {
  en: {
    kicker: "Guides",
    h1: "Guides & stories",
    emptyTitle: "Stories coming soon",
    emptyBody: "We are preparing guides on the area, seasons, and how to plan your stay.",
    read: "Read",
    related: "More guides",
    faq: "FAQ",
  },
  tr: {
    kicker: "Rehberler",
    h1: "Rehberler ve notlar",
    emptyTitle: "Hikâyeler çok yakında",
    emptyBody: "Bölge, mevsimler ve konaklama planı üzerine rehberler hazırlıyoruz.",
    read: "Oku",
    related: "Diğer rehberler",
    faq: "SSS",
  },
  ar: {
    kicker: "أدلة",
    h1: "أدلة وقصص",
    emptyTitle: "قصص قريبًا",
    emptyBody: "نعمل على أدلة عن المنطقة والمواسم وتخطيط الإقامة.",
    read: "اقرأ",
    related: "المزيد من الأدلة",
    faq: "الأسئلة الشائعة",
  },
  ru: {
    kicker: "Гиды",
    h1: "Гиды и заметки",
    emptyTitle: "Скоро здесь появятся материалы",
    emptyBody: "Готовим заметки о регионе, сезонах и планировании отдыха.",
    read: "Читать",
    related: "Ещё гиды",
    faq: "Вопросы и ответы",
  },
};

const CRUMB: Record<string, { home: string; guides: string }> = {
  en: { home: "Home", guides: "Guides" },
  tr: { home: "Ana sayfa", guides: "Rehberler" },
  ar: { home: "الرئيسية", guides: "أدلة" },
  ru: { home: "Главная", guides: "Гиды" },
};

async function resolveSiteSlug(p: GuidesParams): Promise<string> {
  if (p.siteSlug) return p.siteSlug;
  const h = await headers();
  return h.get("x-nestino-slug") ?? "";
}

function dbGuideSlug(segments: string[] | undefined): string | null {
  if (!segments?.length) return null;
  return `guides/${segments.join("/")}`;
}

function segmentsFromDbSlug(slug: string): string[] {
  if (!slug.startsWith("guides/")) return [];
  return slug.slice("guides/".length).split("/").filter(Boolean);
}

function firstImageSrc(body: BodyJson): string | null {
  for (const b of body.blocks) {
    if (b.type === "image") return b.src;
  }
  return null;
}

function partitionFaq(body: BodyJson): { main: BodyJson; faq: BodyJson } {
  const v = body.version ?? 1;
  const faqBlocks = body.blocks.filter((b) => b.type === "faq");
  const mainBlocks = body.blocks.filter((b) => b.type !== "faq");
  return {
    main: { version: v, blocks: mainBlocks },
    faq: { version: v, blocks: faqBlocks },
  };
}

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateGuidesCatchAllMetadata({
  params,
  pathPrefix,
}: Props): Promise<Metadata> {
  const p = await params;
  const lang = p.lang;
  const siteSlug = await resolveSiteSlug(p);
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const segments = p.slug ?? [];

  if (!ctx) {
    return { title: "Guides" };
  }

  const hubPath = villaPath(pathPrefix, `/${lang}/guides`);

  if (segments.length === 0) {
    const meta = HUB_META[lang] ?? HUB_META.en!;
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: `${origin.origin}${hubPath}` },
      openGraph: { title: meta.title, description: meta.description, url: `${origin.origin}${hubPath}` },
    };
  }

  const pageSlug = dbGuideSlug(segments);
  if (!pageSlug) {
    return { title: "Guides", robots: { index: false } };
  }

  const data = await getPublishedPage(ctx.site.id, pageSlug, lang);
  if (!data) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const v = data.version;
  const title = v.metaTitle?.trim() || v.title;
  const description = v.metaDescription ?? undefined;
  const canonicalPath = villaPath(pathPrefix, `/${lang}/guides/${segments.join("/")}`);
  const canonical = `${origin.origin}${canonicalPath}`;

  const locales = await listPublishedLocalesForSlug(ctx.site.id, pageSlug);
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${origin.origin}${villaPath(pathPrefix, `/${l}/guides/${segments.join("/")}`)}`;
  }

  return {
    title,
    description,
    alternates: { canonical, languages: Object.keys(languages).length ? languages : undefined },
    openGraph: { title, description, url: canonical },
  };
}

export default async function GuidesCatchAllPage({ params, pathPrefix }: Props) {
  const p = await params;
  const safeLang: Lang = isLang(p.lang) ? p.lang : "en";
  const siteSlug = await resolveSiteSlug(p);
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  if (!ctx) notFound();

  const hub = HUB_COPY[safeLang] ?? HUB_COPY.en!;
  const crumb = CRUMB[safeLang] ?? CRUMB.en!;

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const segments = p.slug ?? [];

  if (segments.length === 0) {
    const guides = await listPublishedGuides(ctx.site.id, safeLang);
    return (
      <div className="pt-24 pb-16 section-y">
        <div className="content-wrapper max-w-5xl">
          <nav className="text-xs text-[var(--color-text-muted)] mb-4" aria-label="Breadcrumb">
            <Link href={villaPath(pathPrefix, `/${safeLang}`)} className="hover:text-[var(--accent-500)]">
              {crumb.home}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-text-secondary)]">{crumb.guides}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--accent-500)" }}>
            {hub.kicker}
          </p>
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-4">{hub.h1}</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mb-10">
            {(HUB_META[safeLang] ?? HUB_META.en!).description}
          </p>

          {guides.length === 0 ? (
            <div className="rounded-lg border border-[var(--color-border)] p-10 text-center bg-[var(--color-surface)]">
              <p className="font-serif font-semibold text-lg text-[var(--color-text-primary)] mb-2">{hub.emptyTitle}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{hub.emptyBody}</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((g) => {
                const rest = segmentsFromDbSlug(g.slug);
                const href = villaPath(pathPrefix, `/${safeLang}/guides/${rest.join("/")}`);
                return (
                  <li
                    key={g.slug}
                    className="rounded-lg border border-[var(--color-border)] p-6 bg-[var(--color-surface)] shadow-[var(--shadow-sm)] flex flex-col"
                  >
                    <p className="text-xs text-[var(--color-text-muted)] mb-2">
                      {g.publishedAt
                        ? new Intl.DateTimeFormat(safeLang === "tr" ? "tr" : safeLang, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(g.publishedAt)
                        : ""}
                    </p>
                    <h2 className="font-serif font-semibold text-xl text-[var(--color-text-primary)] mb-2">{g.title}</h2>
                    {g.excerpt && <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex-1">{g.excerpt}</p>}
                    <Link href={href} className="text-sm font-medium mt-auto" style={{ color: "var(--accent-500)" }}>
                      {hub.read} →
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const pageSlug = dbGuideSlug(segments);
  if (!pageSlug) notFound();

  const data = await getPublishedPage(ctx.site.id, pageSlug, safeLang);
  if (!data) notFound();

  const { version, page } = data;
  const { main, faq } = partitionFaq(version.bodyJson as BodyJson);
  const hero = firstImageSrc(version.bodyJson as BodyJson);
  const allGuides = await listPublishedGuides(ctx.site.id, safeLang);
  const related = allGuides.filter((g) => g.slug !== page.slug).slice(0, 3);

  const canonicalPath = villaPath(pathPrefix, `/${safeLang}/guides/${segments.join("/")}`);
  const articleUrl = `${origin.origin}${canonicalPath}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumb.home, item: `${origin.origin}${villaPath(pathPrefix, `/${safeLang}`)}` },
      {
        "@type": "ListItem",
        position: 2,
        name: crumb.guides,
        item: `${origin.origin}${villaPath(pathPrefix, `/${safeLang}/guides`)}`,
      },
      { "@type": "ListItem", position: 3, name: version.title, item: articleUrl },
    ],
  };

  const schema = version.schemaJson;
  let ldPayload: unknown = breadcrumbLd;
  if (schema) {
    const raw = JSON.stringify(schema);
    if (!/<\/script/i.test(raw)) {
      ldPayload = Array.isArray(schema) ? [...schema, breadcrumbLd] : [schema, breadcrumbLd];
    }
  }

  return (
    <div className="pt-24 pb-16 section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(ldPayload) }} />
      <div className="content-wrapper max-w-3xl">
        <nav className="text-xs text-[var(--color-text-muted)] mb-6" aria-label="Breadcrumb">
          <Link href={villaPath(pathPrefix, `/${safeLang}`)} className="hover:text-[var(--accent-500)]">
            {crumb.home}
          </Link>
          <span className="mx-2">/</span>
          <Link href={villaPath(pathPrefix, `/${safeLang}/guides`)} className="hover:text-[var(--accent-500)]">
            {crumb.guides}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-text-secondary)]">{version.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-4">{version.title}</h1>
          {version.publishedAt && (
            <p className="text-sm text-[var(--color-text-muted)]">
              {new Intl.DateTimeFormat(safeLang === "tr" ? "tr" : safeLang, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(version.publishedAt)}
            </p>
          )}
        </header>

        {hero && (
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-10 border border-[var(--color-border)]">
            <Image
              src={hero}
              alt={version.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <article className="prose-villa">
          <BlockRenderer body={main} siteId={ctx.site.id} pageId={page.id} />
          {faq.blocks.length > 0 && (
            <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
              <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-4">{hub.faq}</h2>
              <BlockRenderer body={faq} siteId={ctx.site.id} pageId={page.id} />
            </section>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[var(--color-border)]">
            <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-6">{hub.related}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((g) => {
                const rest = segmentsFromDbSlug(g.slug);
                const href = villaPath(pathPrefix, `/${safeLang}/guides/${rest.join("/")}`);
                return (
                  <li key={g.slug}>
                    <Link
                      href={href}
                      className="block rounded-md border border-[var(--color-border)] p-4 h-full hover:border-[var(--accent-500)] transition-colors"
                    >
                      <p className="font-medium text-sm text-[var(--color-text-primary)] line-clamp-2">{g.title}</p>
                      {g.excerpt && <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">{g.excerpt}</p>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
