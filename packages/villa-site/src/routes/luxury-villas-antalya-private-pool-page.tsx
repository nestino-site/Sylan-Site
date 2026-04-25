import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "luxury-villas-in-antalya-private-pool";
const META_TITLE = "Luxury Villas in Antalya with Private Pool | Villa Silyan";
const META_DESCRIPTION =
  "Luxury Villas in Antalya with Private Pool at Villa Silyan: private infinity pools, gourmet kitchens, concierge service, and direct booking benefits.";

const HERO_IMAGE = "/silyan-pillar/private-infinity-pool-villa-silyan-antalya.png";
const INFINITY_POOL_IMAGE = "/silyan-pillar/villa-silyan-private-pool-garden.png";
const LIFESTYLE_IMAGE = "/silyan-pillar/luxury-villa-antalya-pool-lifestyle.png";

const featuredVillas = [
  {
    slug: "defne",
    name: "Villa Defne",
    detail: "5 bedrooms, private pool, ideal for extended families",
  },
  {
    slug: "portakal",
    name: "Villa Portakal",
    detail: "5 bedrooms, generous garden, made for group stays",
  },
  {
    slug: "mandalina",
    name: "Villa Mandalina",
    detail: "3 bedrooms, mountain backdrop, close to Konyaaltı",
  },
] as const;

type Props = {
  params: Promise<{ lang: string; siteSlug?: string }>;
  pathPrefix?: string;
};

function anchorClassName(): string {
  return "font-medium text-[var(--accent-500)] underline decoration-[var(--accent-300)] underline-offset-4 hover:text-[var(--accent-600)]";
}

function fact(label: string, value: string) {
  return { label, value };
}

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateLuxuryVillasAntalyaPrivatePoolMetadata({
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
          height: 683,
          alt: "Private infinity pool at Villa Silyan Antalya",
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

export default async function LuxuryVillasAntalyaPrivatePoolPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const contactHref = pagePath("/contact");
  const villasHref = pagePath("/villas");
  const locationHref = pagePath("/location");
  const internalLink = anchorClassName();

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Luxury Villas in Antalya with Private Pools: Experience Ultimate Privacy and Comfort",
    description: META_DESCRIPTION,
    image: [`${origin}${HERO_IMAGE}`, `${origin}${INFINITY_POOL_IMAGE}`],
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  const quickFacts = [
    fact("Location", "Antalya, Turkey: Belek, Lara, Konyaaltı"),
    fact("Core benefits", "Absolute privacy, infinity pools, concierge service, smart home comfort"),
    fact("Best sunset swim", "6:30 PM to 7:30 PM"),
    fact("Drive to Belek", "Approximately 30 minutes"),
    fact("Drive to Konyaaltı Beach", "Under 20 minutes"),
    fact("Booking advantage", "Direct rates and exclusive offers"),
  ];

  return (
    <>
      <Script
        id="jsonld-luxury-villas-antalya-private-pool"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <div className="bg-[var(--color-bg)] pt-24 pb-20">
        <article className="content-wrapper">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-500)]">
                Antalya private pool villas
              </p>
              <Link
                href={contactHref}
                className="hidden rounded-full bg-[var(--accent-500)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:brightness-110 md:inline-flex"
              >
                Book Now
              </Link>
            </div>

            <header className="max-w-4xl">
              <h1 className="font-serif text-h1 font-semibold leading-tight text-[var(--color-text-primary)]">
                Luxury Villas in Antalya with Private Pools: Experience Ultimate Privacy and Comfort
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                Villa Silyan gives you the space of a private home, the polish of a boutique stay,
                and the rare pleasure of a pool that belongs only to you.
              </p>
            </header>

            <figure className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/10] md:aspect-[16/8]">
                <Image
                  src={HERO_IMAGE}
                  alt="Private infinity pool at Villa Silyan Antalya"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1120px"
                  className="object-cover"
                />
              </div>
            </figure>

            <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:hidden">
              <Link
                href={contactHref}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Book Now
              </Link>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-14">
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Why Choose Villa Silyan for Your Antalya Getaway?
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Villa Silyan offers a calm alternative to the busy rhythm of a five-star hotel.
                    Here, luxury villas with private pools create a secluded base for slow mornings,
                    long swims, and relaxed evenings outdoors. Wake to the quiet of the Mediterranean
                    coast, enjoy your own pool, and cook or host at your own pace in a fully equipped
                    gourmet kitchen.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Unmatched Privacy: Enjoy Your Own Secluded Paradise
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Privacy is built into the Villa Silyan experience. High walls, generous gardens,
                    and carefully planned landscaping help each villa feel like its own quiet retreat.
                    Whether you are lounging by the pool or dining al fresco, you can relax without
                    the interruptions that often come with shared hotel spaces.
                  </p>
                  <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--accent-muted)] p-5">
                    <div className="flex gap-4">
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: "var(--accent-500)" }}
                        aria-hidden="true"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      </span>
                      <p className="leading-relaxed text-[var(--color-text-primary)]">
                        <strong>Pro Tip:</strong> For a magical moment, take a sunset swim between
                        6:30 PM and 7:30 PM, when the Mediterranean sky softens into warm evening
                        color.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_42%] md:items-center">
                    <div>
                      <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                        Infinity Pools with Stunning Mediterranean Views
                      </h2>
                      <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                        The pools at Villa Silyan are more than a place to cool off. They create a
                        private vantage point over the hills and toward the Mediterranean horizon.
                        Each pool is carefully maintained, peaceful, and exclusively yours throughout
                        your stay.
                      </p>
                    </div>
                    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <Image
                        src={INFINITY_POOL_IMAGE}
                        alt="Private pool and garden at Villa Silyan near Antalya"
                        width={900}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Smart Home Technology for Effortless Living
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Modern comfort is woven into the villa experience. Lighting, temperature, and
                    entertainment systems are designed to feel intuitive, so your stay stays easy
                    from the first evening to the last morning.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Concierge Services: Personalized Experiences Await
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    The concierge team can help shape each day around the way you like to travel:
                    a private chef, a yacht tour, an airport transfer, or a day trip to ancient Perge.
                    The result is a stay that feels personal rather than packaged.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Hotel vs. Private Villa: The Luxury of Space and Freedom
                  </h2>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                    <div className="overflow-x-auto">
                      <table className="min-w-[680px] w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              Feature
                            </th>
                            <th className="border-b border-[var(--color-border)] bg-[var(--accent-muted)] px-5 py-4 font-semibold text-[var(--color-text-primary)]">
                              Villa Silyan
                            </th>
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              5-Star Hotel in Antalya
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[var(--color-text-secondary)]">
                          {[
                            ["Privacy", "Complete seclusion", "Shared spaces"],
                            ["Pool", "Private infinity pool", "Shared hotel pool"],
                            ["Space", "Spacious living areas", "Limited room space"],
                            ["Personalization", "Tailored concierge services", "Standard hotel services"],
                            ["Dining", "Self-catering gourmet kitchens", "Hotel restaurants"],
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

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Explore Antalya: From Belek&apos;s Golf Courses to Konyaaltı&apos;s Beaches
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <a href={`${locationHref}#antalya`} className={internalLink}>
                      Antalya
                    </a>{" "}
                    is full of coastal days, mountain air, historic sites, and easy day trips. Tee
                    off at the world-class golf courses in{" "}
                    <a href={`${locationHref}#belek`} className={internalLink}>
                      Belek
                    </a>{" "}
                    or spend the afternoon by the water at{" "}
                    <a href={`${locationHref}#konyaalti`} className={internalLink}>
                      Konyaaltı
                    </a>{" "}
                    Beach. From Villa Silyan, Belek is about a 30-minute drive, while Konyaaltı
                    Beach can be reached in under 20 minutes.
                  </p>
                </section>

                <section>
                  <div className="grid gap-8 md:grid-cols-[42%_minmax(0,1fr)] md:items-center">
                    <figure className="order-2 overflow-hidden rounded-2xl border border-[var(--color-border)] md:order-1">
                      <Image
                        src={LIFESTYLE_IMAGE}
                        alt="Outdoor self-catering lifestyle at Villa Silyan Antalya"
                        width={900}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                    <div className="order-1 md:order-2">
                      <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                        Self-Catering Made Easy: Gourmet Kitchens at Your Disposal
                      </h2>
                      <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                        Every villa is prepared for self-catering comfort, whether you are making a
                        family breakfast, a relaxed lunch after the pool, or a romantic dinner for
                        two. This freedom is one of the biggest advantages over hotel dining, where
                        meal times and menus can shape your day for you.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    A Few Villas to Start With
                  </h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {featuredVillas.map((villa) => (
                      <Link
                        key={villa.slug}
                        href={pagePath(`/villas/${villa.slug}`)}
                        className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent-400)] hover:shadow-[var(--shadow-glow)]"
                      >
                        <h3 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                          {villa.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                          {villa.detail}
                        </p>
                        <span className="mt-4 inline-flex text-sm font-medium text-[var(--accent-500)] transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          View villa
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    Booking Your Stay: Direct Rates and Exclusive Offers
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    Booking directly through Villa Silyan helps you access the best available rates,
                    current villa availability, and exclusive offers that may not appear on third-party
                    platforms. Secure your slice of privacy and start planning your Antalya escape.
                  </p>
                </section>

                <section>
                  <h3 className="font-serif text-h3 font-semibold text-[var(--color-text-primary)]">
                    Quick Facts
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickFacts.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl bg-[var(--color-text-primary)] p-8 text-white md:p-10">
                  <div className="max-w-2xl">
                    <h2 className="font-serif text-h2 font-semibold">
                      Begin Your Private Antalya Stay
                    </h2>
                    <p className="mt-4 leading-relaxed text-white/80">
                      Begin your luxurious and tranquil stay at Villa Silyan, where every detail is
                      designed to give you more space, more privacy, and more time together.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={contactHref}
                        className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                      >
                        Book Now
                      </Link>
                      <Link
                        href={villasHref}
                        className="inline-flex items-center justify-center rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Browse all villas
                      </Link>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                  <p className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    Ready for a private pool stay?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    Check direct availability and get the best route into Villa Silyan&apos;s current offers.
                  </p>
                  <Link
                    href={contactHref}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={villasHref}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--accent-500)]"
                  >
                    Compare villas
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
