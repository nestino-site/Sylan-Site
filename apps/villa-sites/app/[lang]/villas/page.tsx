import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Villas",
};

// Villas index — static shell for scaffold.
// Will be replaced by DB-driven content in Step 3.
const VILLAS = [
  {
    slug: "badem",
    name: "Villa Badem",
    tagline: "3 bedrooms · private pool · sleeps 6",
    capacity: 6,
    bedrooms: 3,
  },
  {
    slug: "defne",
    name: "Villa Defne",
    tagline: "5 bedrooms · private pool · sleeps 10",
    capacity: 10,
    bedrooms: 5,
  },
  {
    slug: "incir",
    name: "Villa İncir",
    tagline: "3 bedrooms · private pool · sleeps 6",
    capacity: 6,
    bedrooms: 3,
  },
] as const;

type Props = { params: Promise<{ lang: string }> };

export default async function VillasPage({ params }: Props) {
  const { lang } = await params;

  return (
    <div className="pt-24 section-y">
      <div className="content-wrapper">
        <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-4">
          Our Villas
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-12 max-w-2xl">
          Three independent villas, each with a private pool and garden, designed for
          families and groups seeking privacy in the mountains above Antalya.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VILLAS.map((villa) => (
            <Link
              key={villa.slug}
              href={`/${lang}/villas/${villa.slug}`}
              className="group rounded-lg overflow-hidden border border-[var(--color-border)] hover:border-[var(--accent-500)] transition-colors bg-[var(--color-surface)]"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-[var(--color-border)] flex items-center justify-center">
                <span className="text-[var(--color-text-muted)] text-sm">{villa.name}</span>
              </div>
              <div className="p-4">
                <h2 className="font-serif font-semibold text-lg text-[var(--color-text-primary)] mb-1">
                  {villa.name}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">{villa.tagline}</p>
                <span
                  className="inline-block mt-3 text-sm font-medium transition-colors"
                  style={{ color: "var(--accent-500)" }}
                >
                  View villa →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}