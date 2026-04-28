import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "private-family-villas-in-antalya";
const PILLAR_SLUG = "villas-in-antalya-with-private-pool";
const META_TITLE = "Best Private Family Villas in Antalya | Safe & Secluded | Villa Silyan";
const META_DESCRIPTION =
  "Book the perfect family retreat in Antalya. Discover spacious villas with gated pools, child-safe amenities, and 24/7 security. Direct booking for best rates.";
const HERO_IMAGE = "/silyan-family/antalya-villa-family-pool-dining.png";
const HERO_ALT =
  "Private luxury family villa in Antalya with secure gated pool and outdoor dining.";
const DIRECT_BOOKING_URL = "https://villasilyan.com/all-villas";

type Props = {
  params: Promise<{ lang: string; siteSlug?: string }>;
  pathPrefix?: string;
};

const peaceOfMindItems = [
  "Gated and secure pool access",
  "Child-friendly interior design with no sharp corners or fragile decor",
  "Baby cots and high chairs available upon request",
  "24/7 security and gated community entrance",
  "Private garden for safe outdoor play",
] as const;

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
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

function Section({
  eyebrow,
  title,
  children,
  tinted = false,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      className={
        tinted
          ? "rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8"
          : ""
      }
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-500)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </div>
    </section>
  );
}

function PeaceOfMindChecklist() {
  return (
    <aside className="rounded-[2rem] border border-[var(--accent-300)] bg-[var(--accent-muted)] p-6 shadow-[var(--shadow-md)] md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-600)]">
        Parent&apos;s Peace of Mind
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--color-text-primary)]">
        Family safety essentials, already considered
      </h2>
      <ul className="mt-6 space-y-4">
        {peaceOfMindItems.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export async function generatePrivateFamilyVillasInAntalyaMetadata({
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
          height: 576,
          alt: HERO_ALT,
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

export default async function PrivateFamilyVillasInAntalyaPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const pillarHref = pagePath(`/${PILLAR_SLUG}`);

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const heroImageUrl = `${origin}${HERO_IMAGE}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Private Family Villas in Antalya",
    description: META_DESCRIPTION,
    image: [heroImageUrl],
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
    author: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Private Family Villas in Antalya by Villa Silyan",
    description: META_DESCRIPTION,
    image: [heroImageUrl],
    brand: {
      "@type": "Brand",
      name: "Villa Silyan",
    },
    category: "Vacation rental villa",
    url: articleUrl,
    offers: {
      "@type": "Offer",
      url: DIRECT_BOOKING_URL,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Script
        id="jsonld-private-family-villas-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <Script
        id="jsonld-private-family-villas-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(productLd) }}
      />

      <div className="bg-[var(--color-bg)] pt-24 pb-20">
        <article className="content-wrapper">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-500)]">
                Private family villas in Antalya
              </p>
              <a
                href={DIRECT_BOOKING_URL}
                className="hidden rounded-full bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-600)] md:inline-flex"
              >
                Check Family Villa Availability
              </a>
            </div>

            <header className="max-w-4xl">
              <h1 className="font-serif text-h1 font-semibold leading-tight text-[var(--color-text-primary)]">
                Explore Private Family Villas in Antalya: Safe, Spacious, and Fully Equipped
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                Planning a family getaway means balancing privacy, comfort, location, and the small
                safety details that help parents truly relax. Villa Silyan offers private family
                villas in Antalya with secure pool areas, generous indoor-outdoor space, and the
                freedom to keep your family&apos;s routine intact.
              </p>
            </header>

            <figure className="relative mt-8 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/10] md:aspect-[16/8]">
                <Image
                  src={HERO_IMAGE}
                  alt={HERO_ALT}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1120px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                A private pool, shaded outdoor dining, and room for children to enjoy the day safely.
              </figcaption>
            </figure>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                ["Best for", "Families seeking privacy, pool time, and hotel-level comfort"],
                ["Nearby beaches", "Lara Beach 15-20 mins, Konyaaltı Beach about 20 mins"],
                ["Booking route", "Direct booking for best rates and availability"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-500)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-14">
                <Section title="Why Choose Villa Silyan for Your Family Retreat?">
                  <p>
                    Choosing a villa instead of a hotel gives families a calmer, more flexible base.
                    You avoid crowded lobbies, shared pool schedules, and the pressure to shape each
                    day around hotel services. At Villa Silyan, your family has a secluded setting
                    with space to swim, nap, cook, dine, and unwind privately.
                  </p>
                  <p>
                    For families comparing Antalya accommodation options, our main guide to{" "}
                    <Link
                      href={pillarHref}
                      className="font-medium text-[var(--accent-500)] underline decoration-[var(--accent-300)] underline-offset-4 hover:text-[var(--accent-600)]"
                    >
                      villas in Antalya with private pool
                    </Link>{" "}
                    explains how private pool villas compare with hotel stays across privacy,
                    location, and guest experience.
                  </p>
                </Section>

                <Section title="Child-Safe Spaces: Peace of Mind for Parents" tinted>
                  <p>
                    Safety is central to a successful family holiday. Villa Silyan&apos;s private
                    villa setting is designed around secure outdoor living, with gated pool access,
                    private gardens, and a gated community entrance that helps parents relax without
                    constantly negotiating shared hotel spaces.
                  </p>
                  <p>
                    Children can enjoy the garden and terrace while adults stay close by, making the
                    villa feel like a private family home rather than a busy resort.
                  </p>
                </Section>

                <Section title="Fully Equipped Kitchens: Cook with Ease and Comfort">
                  <p>
                    Each villa includes a fully equipped kitchen with modern appliances, practical
                    utensils, and generous preparation space for breakfasts, snacks, and family
                    dinners.
                  </p>
                  <p>
                    Avoid the stress of hotel buffet queues and restrictive meal times. At Villa
                    Silyan, you can maintain your family&apos;s routine, preparing healthy meals for
                    picky eaters or infants in your own gourmet kitchen.
                  </p>
                </Section>

                <Section title="Gated Privacy: Your Own Secluded Paradise" tinted>
                  <p>
                    Villa Silyan prioritizes privacy with gated properties and calm outdoor spaces.
                    Your family can swim, dine outside, or enjoy a quiet evening without the
                    interruptions that come with shared hotel pools, corridors, and public lounges.
                  </p>
                </Section>

                <Section title="Spacious Indoor-Outdoor Living Areas for Family Fun">
                  <p>
                    The villas blend comfortable interiors with terraces, gardens, and alfresco dining
                    areas. Children have space to play, adults have room to gather, and the whole
                    family can move naturally between indoor comfort and outdoor Mediterranean living.
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    <li className="rounded-2xl bg-white/70 p-4 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                      <strong>Indoor:</strong> spacious living rooms with comfortable seating for slow
                      mornings and family movie nights.
                    </li>
                    <li className="rounded-2xl bg-white/70 p-4 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                      <strong>Outdoor:</strong> private gardens, terraces, and dining areas for safe
                      play and relaxed meals.
                    </li>
                  </ul>
                </Section>

                <Section title="Villa Silyan vs Antalya 5-Star Hotels">
                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    <table className="w-full border-collapse bg-[var(--color-surface)] text-left text-sm">
                      <thead className="bg-[var(--accent-muted)] text-[var(--color-text-primary)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Aspect</th>
                          <th className="px-4 py-3 font-semibold">Villa Silyan</th>
                          <th className="px-4 py-3 font-semibold">5-Star Hotel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-secondary)]">
                        <tr>
                          <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">Privacy</td>
                          <td className="px-4 py-3">Exclusive</td>
                          <td className="px-4 py-3">Shared</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">Space</td>
                          <td className="px-4 py-3">Ample indoor and outdoor areas</td>
                          <td className="px-4 py-3">Limited to rooms and shared facilities</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">Kitchen</td>
                          <td className="px-4 py-3">Full gourmet kitchen</td>
                          <td className="px-4 py-3">Minimal or unavailable</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">Family routine</td>
                          <td className="px-4 py-3">Flexible meals, naps, and pool time</td>
                          <td className="px-4 py-3">Often shaped by hotel schedules</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Section>

                <Section title="Local Tips: Exploring Antalya with Your Family">
                  <p>
                    Antalya is rich with family-friendly activities, from the historic streets of
                    Kaleici to the natural beauty of Duden Waterfalls. Plan active outings early in
                    the day, then return to your private pool for cooler afternoon downtime.
                  </p>
                  <ul className="space-y-3">
                    <li>
                      <strong>Kaleici:</strong> wander the old town streets early in the morning to
                      avoid crowds.
                    </li>
                    <li>
                      <strong>Duden Waterfalls:</strong> about a 20-minute drive, ideal for photos
                      and a relaxed family stop.
                    </li>
                    <li>
                      <strong>Antalya Aquarium:</strong> around 15 minutes by car and a strong rainy
                      day option for children.
                    </li>
                  </ul>
                </Section>

                <Section title="Driving Distances: Antalya Beaches That Work for Families" tinted>
                  <p>
                    Villa Silyan&apos;s Antalya location makes the city&apos;s best family beach days
                    easy to plan. Lara Beach is usually 15-20 minutes away, while Konyaalti Beach is
                    about 20 minutes by car, depending on traffic and season.
                  </p>
                  <p>
                    Kaputas Beach should be treated as an exotic full-day road trip rather than a
                    quick beach stop. From Antalya City, the journey is closer to three hours each
                    way, so it is best reserved for families who want a scenic coastal drive and a
                    full day out.
                  </p>
                </Section>

                <div className="rounded-[2rem] bg-[var(--color-text-primary)] p-8 text-white shadow-[var(--shadow-lg)] md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-300)]">
                    Summer 2026 family stays
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold">
                    Secure your private Antalya family retreat
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
                    Experience luxury, privacy, and family-friendly amenities at Villa Silyan. Book
                    directly for the clearest availability and best direct rates.
                  </p>
                  <a
                    href={DIRECT_BOOKING_URL}
                    className="mt-7 inline-flex rounded-full bg-[var(--accent-500)] px-7 py-4 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:brightness-110"
                  >
                    Check Family Villa Availability - Summer 2026
                  </a>
                </div>
              </div>

              <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                <PeaceOfMindChecklist />
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
                  <h2 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    Quick Facts
                  </h2>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div>
                      <dt className="font-semibold text-[var(--color-text-primary)]">Primary beaches</dt>
                      <dd className="mt-1 text-[var(--color-text-secondary)]">
                        Lara Beach and Konyaalti Beach
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--color-text-primary)]">Best for</dt>
                      <dd className="mt-1 text-[var(--color-text-secondary)]">
                        Families who want privacy, space, and secure pool time
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--color-text-primary)]">Full-day idea</dt>
                      <dd className="mt-1 text-[var(--color-text-secondary)]">
                        Kaputas Beach as a scenic road trip
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
