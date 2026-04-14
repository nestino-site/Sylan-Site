import Image from "next/image";
import Link from "next/link";
import type { Lang } from "../../lib/i18n";
import { villaPath } from "../../lib/villa-path";
import { VILLA_IMAGES } from "../../lib/silyan-images";
import AnimateOnScroll from "../animate-on-scroll";

type Props = { lang: Lang; pathPrefix?: string };

const VILLAS = [
  {
    slug: "portakal",
    name: "Villa Portakal",
    hook: {
      en: "5 bedrooms · private pool · sleeps 10",
      tr: "5 yatak odası · özel havuz · 10 kişilik",
      ar: "5 غرف نوم · مسبح خاص · 10 أشخاص",
      ru: "5 спален · частный бассейн · до 10 гостей",
    },
  },
  {
    slug: "incir",
    name: "Villa İncir",
    hook: {
      en: "3 bedrooms · private pool · sleeps 6",
      tr: "3 yatak odası · özel havuz · 6 kişilik",
      ar: "3 غرف نوم · مسبح خاص · 6 أشخاص",
      ru: "3 спальни · частный бассейн · до 6 гостей",
    },
  },
  {
    slug: "defne",
    name: "Villa Defne",
    hook: {
      en: "5 bedrooms · private pool · sleeps 10",
      tr: "5 yatak odası · özel havuz · 10 kişilik",
      ar: "5 غرف نوم · مسبح خاص · 10 أشخاص",
      ru: "5 спален · частный бассейн · до 10 гостей",
    },
  },
] as const;

const SECTION_TITLE: Record<string, { heading: string; sub: string; showAll: string }> = {
  en: {
    heading: "Our Villas",
    sub: "Eleven villas, each with a private pool and garden.",
    showAll: "View all",
  },
  tr: {
    heading: "Villalarımız",
    sub: "On bir villa; her birinde özel havuz ve bahçe.",
    showAll: "Tümünü gör",
  },
  ar: {
    heading: "فيلاتنا",
    sub: "إحدى عشرة فيلا، لكل منها مسبح وحديقة خاصة.",
    showAll: "عرض الكل",
  },
  ru: {
    heading: "Наши виллы",
    sub: "Одиннадцать вилл, у каждой свой бассейн и сад.",
    showAll: "Все виллы",
  },
};

function VillaCard({
  villa,
  lang,
  pathPrefix,
}: {
  villa: (typeof VILLAS)[number];
  lang: string;
  pathPrefix: string;
}) {
  const hook = villa.hook[lang as keyof typeof villa.hook] ?? villa.hook.en;
  const imgSrc = VILLA_IMAGES[villa.slug]?.card;

  return (
    <Link
      href={villaPath(pathPrefix, `/${lang}/villas/${villa.slug}`)}
      className="group block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--accent-400)]/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-border)]">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={villa.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-text-muted)]">{villa.name}</div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold text-[var(--color-text-primary)]">{villa.name}</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{hook}</p>
        </div>
        <span
          className="mt-0.5 shrink-0 text-[var(--accent-500)] transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" className="rtl:rotate-180">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function VillaCards({ lang, pathPrefix = "" }: Props) {
  const titles = SECTION_TITLE[lang] ?? SECTION_TITLE.en!;

  return (
    <section
      className="section-y bg-[var(--color-surface)] content-lazy"
      aria-labelledby="villa-cards-heading"
    >
      <div className="content-wrapper">
        <AnimateOnScroll variant="fade-up">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="max-w-lg">
              <h2
                id="villa-cards-heading"
                className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]"
              >
                {titles.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">{titles.sub}</p>
            </div>
            <Link
              href={villaPath(pathPrefix, `/${lang}/villas`)}
              className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[var(--accent-500)] underline-offset-4 transition-opacity hover:opacity-80 sm:shrink-0 sm:self-auto sm:pb-1"
            >
              {titles.showAll}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {VILLAS.map((villa) => (
              <VillaCard key={villa.slug} villa={villa} lang={lang} pathPrefix={pathPrefix} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
