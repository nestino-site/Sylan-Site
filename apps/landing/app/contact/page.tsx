import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { SectionShell } from "@/components/section-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Nestino",
  description:
    "Contact Nestino for enterprise hospitality operating system conversations, Curina partnerships, technology integrations, and strategic inquiries.",
  path: "/contact",
});

const contactPaths = [
  {
    title: "Enterprise operators",
    text: "Hotel groups and premium property owners exploring connected operations, guest identity, direct demand, analytics, and APIs.",
  },
  {
    title: "Curina partners",
    text: "Restaurants, cafes, gyms, wellness centers, cultural venues, tourism providers, and lifestyle brands joining the network.",
  },
  {
    title: "Strategic partners",
    text: "Technology, integration, investor, and ecosystem conversations around the future hospitality network.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="absolute inset-0 bg-ivory-radial" aria-hidden="true" />
        <div className="content-grid relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow mb-8">Contact</p>
              <h1 className="font-display text-display font-semibold text-charcoal">
                Start the enterprise hospitality conversation.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-stone">
                Tell us whether you are exploring Nestino as an operator, Curina
                partner, technology partner, investor, or strategic collaborator.
              </p>
            </div>
            <Suspense fallback={<div className="luxury-card min-h-[520px]" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <SectionShell
        eyebrow="Inquiry Paths"
        title="Designed for serious conversations, not form spam."
        intro="Nestino is built around high-context enterprise relationships. Choose the path that matches your role in the network."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {contactPaths.map((path) => (
            <article key={path.title} className="luxury-card p-8">
              <h2 className="font-display text-4xl font-semibold tracking-[-0.04em] text-charcoal">
                {path.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-stone">{path.text}</p>
            </article>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}
