import { ButtonLink } from "@/components/button-link";

type CtaSectionProps = {
  eyebrow?: string;
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export function CtaSection({
  eyebrow = "Begin the conversation",
  title = "Build the hospitality network your guests already expect.",
  text = "Nestino connects operations, identity, demand, lifestyle partners, analytics, and APIs into one calm enterprise platform.",
  primaryLabel = "Contact Nestino",
  primaryHref = "/contact",
}: CtaSectionProps) {
  return (
    <section className="bg-ivory py-24 md:py-36">
      <div className="content-grid">
        <div className="relative overflow-hidden rounded-[40px] border border-beige bg-sand p-8 shadow-soft md:p-16">
          <div className="absolute inset-0 bg-ivory-radial" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <p className="eyebrow mb-8">{eyebrow}</p>
            <h2 className="font-display text-display font-semibold text-charcoal">
              {title}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone">
              {text}
            </p>
            <div className="mt-10">
              <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
