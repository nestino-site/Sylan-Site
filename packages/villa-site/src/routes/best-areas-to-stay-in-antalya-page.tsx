import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "best-areas-to-stay-in-antalya";
const PILLAR_SLUG = "villas-in-antalya-with-private-pool";
const META_TITLE = "Best Areas to Stay in Antalya: A Luxury Villa Rental Guide 2026";
const META_DESCRIPTION =
  "Discover the perfect location for your Antalya getaway. Comparing Kalkan, Kaş, Belek, and the City Center for luxury villa rentals. Local tips and insights.";

const HERO_IMAGE = "/silyan-areas/antalya-coast-hero.png";
const CITY_MARINA_IMAGE = "/silyan-areas/antalya-city-marina.png";
const REGIONS_COLLAGE_IMAGE = "/silyan-areas/best-areas-antalya-collage.png";

type Props = {
  params: Promise<{ lang: string; siteSlug?: string }>;
  pathPrefix?: string;
};

type Region = {
  id: string;
  title: string;
  summary: string;
  proTip: string;
  localAnchor: string;
  insight: string;
  alt: string;
  imagePosition: string;
};

const regions: Region[] = [
  {
    id: "kalkan",
    title: "Exploring Kalkan: A Haven for Secluded Luxury",
    summary:
      "Kalkan is a picturesque town known for its tranquil atmosphere and dramatic coastline. Villas here are often perched on hillsides, giving guests panoramic Mediterranean views and a sense of retreat above the water. The narrow streets are lined with boutique shops and local restaurants, ideal for slow evenings after a pool day.",
    proTip: "Visit the local Thursday market for fresh produce and artisanal goods.",
    localAnchor: "Kalkan Marina, a short 10-minute drive, is ideal for dining and boat tours.",
    insight:
      "Kalkan rewards travelers who want quiet and views, but its hilly terrain can be challenging for guests with mobility needs. If easy walking is important, choose a villa with direct parking and minimal stairs.",
    alt: "Luxury villas on Kalkan hillsides overlooking the Mediterranean Sea",
    imagePosition: "25% 25%",
  },
  {
    id: "kas",
    title: "Kaş: The Perfect Blend of History and Modern Comfort",
    summary:
      "Kaş combines ancient ruins, a lively harbor, independent shops, and excellent dining. It is especially loved by diving enthusiasts, with local operators running trips to reefs, wrecks, and clear-water coves. For guests who like culture with a relaxed coastal rhythm, Kaş is one of Antalya's most characterful bases.",
    proTip: "For a quieter experience, visit the ancient amphitheater at sunset.",
    localAnchor:
      "The town center is usually a short walk from central villas, with easy access to shops and cafes.",
    insight:
      "Kaş can feel lively in peak season, especially on weekends. The charm is real, but light sleepers should look for villas set slightly above or outside the busiest streets.",
    alt: "Historic streets and coastal villas in Kaş Antalya for luxury stays",
    imagePosition: "75% 25%",
  },
  {
    id: "belek",
    title: "Belek: Golf Courses and Family-Friendly Villas",
    summary:
      "Belek is known for world-class golf courses, wide resort beaches, and family-friendly villas with larger gardens. It works well for groups who want an easy holiday rhythm: golf in the morning, beach time in the afternoon, and a private pool waiting at home.",
    proTip: "Book tee times in advance, especially during the high season.",
    localAnchor: "Kadriye Beach is a short 15-minute drive and works well for a family day out.",
    insight:
      "Belek is convenient and polished, but it can be busy during school holidays. Plan beach clubs, theme parks, and golf starts early in the day to avoid the heaviest crowds.",
    alt: "Family-friendly Belek villa with private pool near golf courses and beach",
    imagePosition: "25% 75%",
  },
  {
    id: "city-center",
    title: "Antalya City Center: Vibrant Life and Easy Beach Access",
    summary:
      "Staying close to Antalya City Center gives you the best of both worlds: restaurants, shopping, Kaleiçi, marina walks, and quick access to beaches such as Konyaaltı and Lara. A villa here is best for travelers who want convenience without giving up private outdoor space.",
    proTip: "Visit the Old Town, Kaleiçi, for a compact dose of Antalya history and culture.",
    localAnchor:
      "The city tram offers convenient access to key attractions and can reduce the need for car rentals.",
    insight:
      "The center is naturally more energetic, so noise can be part of the trade-off. In return, you gain easy restaurants, beach access, and less time spent driving.",
    alt: "Antalya City Center villa near Kaleiçi, marina, and Konyaaltı Beach",
    imagePosition: "75% 75%",
  },
];

const considerations = [
  "Privacy needs: decide how much seclusion you want day to day.",
  "Proximity to attractions: choose between historic sites, beaches, golf, or nature.",
  "Family requirements: look for gardens, bedrooms, pool safety, and easy parking.",
  "Activity preferences: match the area to diving, golfing, cultural exploring, or beach time.",
  "Seasonal crowds: peak holidays can change the feel of each neighborhood.",
] as const;

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 border-l-4 border-[var(--accent-500)] bg-[#f8f9fa] p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex gap-4">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--accent-500)]"
          aria-label="User trust insight"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l7 3v5c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6l7-3z" />
            <path d="M8.5 12l2.2 2.2 4.8-5" />
          </svg>
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
            Real-World Insight
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 inline-flex max-w-full items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--accent-muted)] px-4 py-3 shadow-[var(--shadow-sm)]">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-500)] text-white"
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1115.5 14.5c-.9.7-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.8-1.5-2.5z" />
        </svg>
      </span>
      <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
        <strong>Pro Tip:</strong> {children}
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-500)] text-white"
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}

export async function generateBestAreasToStayInAntalyaMetadata({
  params,
  pathPrefix = "",
}: Props): Promise<Metadata> {
  const p = await params;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const pagePath = villaPath(pathPrefix, `/${p.lang}/${PAGE_SLUG}`);
  const canonical = `${origin.origin}${pagePath}`;

  const siteSlug = p.siteSlug ?? h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const activeLangs = ctx ? getActiveLangs(ctx) : ["en"];
  const languages: Record<string, string> = Object.fromEntries(
    activeLangs.map((lang) => [
      lang,
      `${origin.origin}${villaPath(pathPrefix, `/${lang}/${PAGE_SLUG}`)}`,
    ]),
  );
  const defaultLang = ctx?.site.defaultLanguage ?? "en";
  if (activeLangs.includes(defaultLang)) {
    languages["x-default"] = `${origin.origin}${villaPath(pathPrefix, `/${defaultLang}/${PAGE_SLUG}`)}`;
  }

  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: { canonical, languages },
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: canonical,
      type: "article",
      siteName: "Villa Silyan",
      images: [
        {
          url: HERO_IMAGE,
          width: 1024,
          height: 443,
          alt: "Aerial view of Antalya coastline for a luxury villa rental guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [HERO_IMAGE],
    },
  };
}

export default async function BestAreasToStayInAntalyaPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const contactHref = pagePath("/contact");
  const villasHref = pagePath("/villas");
  const pillarHref = pagePath(`/${PILLAR_SLUG}`);

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Discover the Best Areas to Stay in Antalya for Luxurious Villa Rentals",
    description: META_DESCRIPTION,
    image: [`${origin}${HERO_IMAGE}`, `${origin}${CITY_MARINA_IMAGE}`, `${origin}${REGIONS_COLLAGE_IMAGE}`],
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  return (
    <>
      <Script
        id="jsonld-best-areas-to-stay-in-antalya"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <div className="bg-[var(--color-bg)] pt-20 pb-20">
        <article>
          <section className="content-wrapper">
            <div className="relative mx-auto overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/11] min-h-[420px] md:aspect-[16/7]">
                <Image
                  src={HERO_IMAGE}
                  alt="Aerial view of Antalya coastline for choosing the best area to stay"
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                    Luxury villa rental guide 2026
                  </p>
                  <h1 className="max-w-4xl font-serif text-h1 font-semibold leading-tight text-white">
                    Discover the Best Areas to Stay in Antalya for Luxurious Villa Rentals
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                    Compare Kalkan, Kaş, Belek, and Antalya City Center so your villa setting matches
                    the way you want to travel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="content-wrapper mt-12">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-14">
                <section>
                  <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
                    Antalya&apos;s allure lies in its variety. Some areas feel secluded and coastal;
                    others are historic, family-focused, or connected to city life. Villa Silyan gives
                    you a calm private base for your Mediterranean adventure, with the flexibility to
                    explore the region at your own pace.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Why Choose a Villa Over a 5-Star Hotel in Antalya
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Choosing a villa rental at Villa Silyan gives you privacy that is hard to preserve
                    in a busy hotel. Swim in your own pool at sunset, prepare meals from local market
                    ingredients, and enjoy generous indoor and outdoor space without lobby queues,
                    fixed dining hours, or crowded shared facilities.
                  </p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                    <div className="overflow-x-auto">
                      <table className="min-w-[560px] w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              Feature
                            </th>
                            <th className="border-b border-[var(--color-border)] bg-[var(--accent-muted)] px-5 py-4 font-semibold">
                              Villa Silyan
                            </th>
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              5-Star Hotel
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[var(--color-text-secondary)]">
                          {[
                            ["Privacy", "Complete", "Limited"],
                            ["Pool", "Private", "Shared"],
                            ["Dining", "Self-catering", "Fixed hours"],
                            ["Space", "Spacious", "Compact"],
                          ].map(([feature, villa, hotel]) => (
                            <tr key={feature} className="border-b border-[var(--color-border)] last:border-b-0">
                              <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">
                                {feature}
                              </td>
                              <td className="bg-[var(--accent-muted)] px-5 py-4 font-medium text-[var(--color-text-primary)]">
                                {villa}
                              </td>
                              <td className="px-5 py-4">{hotel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  {regions.map((region) => (
                    <a
                      key={region.id}
                      href={`#${region.id}`}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent-400)] hover:shadow-[var(--shadow-glow)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                        Neighborhood chapter
                      </p>
                      <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                        {region.title.split(":")[0]}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {region.summary.slice(0, 118)}...
                      </p>
                    </a>
                  ))}
                </section>

                {regions.map((region) => (
                  <section
                    key={region.id}
                    id={region.id}
                    className="scroll-mt-24 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-8"
                  >
                    <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                      {region.title}
                    </h2>
                    <figure className="relative mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={REGIONS_COLLAGE_IMAGE}
                          alt={region.alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 760px"
                          className="object-cover"
                          style={{ objectPosition: region.imagePosition }}
                        />
                      </div>
                    </figure>
                    <p className="mt-5 leading-relaxed text-[var(--color-text-secondary)]">
                      {region.summary}
                    </p>
                    <ProTip>{region.proTip}</ProTip>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      <strong className="text-[var(--color-text-primary)]">Local Anchor:</strong>{" "}
                      {region.localAnchor}
                    </p>
                    <InsightBox>{region.insight}</InsightBox>
                  </section>
                ))}

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Top 5 Considerations When Choosing Your Antalya Villa Location
                  </h2>
                  <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-7">
                    <div className="grid gap-4">
                      {considerations.map((item) => (
                        <div key={item} className="flex gap-3 rounded-2xl bg-[var(--color-bg)] p-4">
                          <CheckIcon />
                          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Proximity to Antalya&apos;s Pristine Beaches: A Key Factor
                  </h2>
                  <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_42%] md:items-center">
                    <p className="leading-relaxed text-[var(--color-text-secondary)]">
                      Antalya&apos;s beaches are a major draw, and choosing a villa with easy beach
                      access can shape the whole stay. Whether you prefer the golden sands of Lara
                      Beach, the pebbled shoreline of Konyaaltı, or day trips toward Kaputaş, a well
                      placed villa makes spontaneous swims and sunset plans much easier.
                    </p>
                    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <Image
                        src={CITY_MARINA_IMAGE}
                        alt="Antalya marina and coastline near luxury villa rental areas"
                        width={900}
                        height={540}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Local Expertise: Navigating Antalya&apos;s Diverse Neighborhoods
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Villa Silyan&apos;s local knowledge helps match your group with the right base,
                    whether your priority is privacy, beach access, family convenience, or effortless
                    access to Antalya&apos;s restaurants and historic center.
                  </p>
                </section>

                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-sm)] md:p-9">
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Continue to the Private Pool Villa Guide
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    For more detail on our luxurious villas with private pools, visit our Pillar Page.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={pillarHref}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      Visit our Pillar Page
                    </Link>
                    <Link
                      href={villasHref}
                      className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--accent-500)]"
                    >
                      View Villa Silyan rentals
                    </Link>
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl bg-[var(--color-text-primary)] p-8 text-white md:p-10">
                  <h2 className="font-serif text-h2 font-semibold">
                    Ready to Book Your Dream Villa?
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
                    Contact Villa Silyan for personalized assistance, direct rates, and exclusive
                    offers tailored to your travel dates.
                  </p>
                  <Link
                    href={contactHref}
                    className="mt-7 inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Contact us today
                  </Link>
                </section>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                  <p className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    Need help choosing?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Tell us your group size, dates, and preferred pace. We&apos;ll point you toward the
                    right Villa Silyan option.
                  </p>
                  <Link
                    href={contactHref}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Get local advice
                  </Link>
                  <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                      Jump to
                    </p>
                    <div className="mt-3 grid gap-2">
                      {regions.map((region) => (
                        <a
                          key={region.id}
                          href={`#${region.id}`}
                          className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--accent-500)]"
                        >
                          {region.title.split(":")[0]}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
