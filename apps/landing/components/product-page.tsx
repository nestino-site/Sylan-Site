import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { CtaSection } from "@/components/cta-section";
import { SectionShell } from "@/components/section-shell";
import { PageVisual } from "@/components/visuals";
import { pageContent } from "@/content/site";

type ProductPageProps = {
  slug: keyof typeof pageContent;
};

export function ProductPage({ slug }: ProductPageProps) {
  const content = pageContent[slug];

  if (!content) {
    notFound();
  }

  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="absolute inset-0 bg-ivory-radial" aria-hidden="true" />
        <div className="content-grid relative">
          <div className="grid items-end gap-12 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="eyebrow mb-8">{content.eyebrow}</p>
              <h1 className="font-display text-display font-semibold text-charcoal">
                {content.title}
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-stone">
                {content.intro}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href={content.ctaHref}>{content.ctaLabel}</ButtonLink>
                <ButtonLink href="/platform" variant="secondary">
                  View platform
                </ButtonLink>
              </div>
            </div>
            <PageVisual type={content.visual} />
          </div>
        </div>
      </section>

      <SectionShell
        eyebrow="Inside the system"
        title="Designed around how premium hospitality actually operates."
        intro="Each layer is built to preserve individuality while connecting the intelligence that makes the network stronger."
        className="bg-white"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {content.sections.map((section) => (
            <article key={section.title} className="luxury-card p-8 md:p-10">
              <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-charcoal">
                {section.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-stone">{section.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {section.points.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-beige bg-ivory px-4 py-2 text-sm text-stone"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <CtaSection
        eyebrow={content.eyebrow}
        title={`Bring ${content.eyebrow.toLowerCase()} into the Nestino network.`}
        primaryLabel={content.ctaLabel}
        primaryHref={content.ctaHref}
      />
    </main>
  );
}
