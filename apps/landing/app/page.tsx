import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { CtaSection } from "@/components/cta-section";
import { Reveal } from "@/components/motion/reveal";
import { SectionShell } from "@/components/section-shell";
import {
  CaseStudyJourney,
  CurinaCityVisual,
  DashboardVisual,
  EngineLoopVisual,
  FragmentationVisual,
  GuestIdentityVisual,
  HeroVisual,
  NetworkEffectVisual,
  PropertyModules,
  SolutionNetwork,
  TechnologyStackVisual,
} from "@/components/visuals";
import { productPillars } from "@/content/site";
import { softwareApplicationJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Nestino | The Operating System for Connected Hospitality",
  description:
    "Nestino connects luxury hotels, guest identity, Curina lifestyle partners, autonomous demand, executive analytics, and enterprise APIs.",
});

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd()) }}
      />

      <section className="relative min-h-dvh overflow-hidden px-4 pb-20 pt-36 md:px-8 md:pt-44">
        <div className="absolute inset-0 bg-ivory-radial" aria-hidden="true" />
        <div className="content-grid relative">
          <div className="grid min-h-[calc(100dvh-12rem)] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div>
                <p className="eyebrow mb-8">Enterprise Hospitality Operating System</p>
                <h1 className="font-display text-hero font-semibold text-charcoal">
                  The future operating system for hospitality.
                </h1>
                <p className="mt-8 max-w-2xl text-xl leading-9 text-stone">
                  Nestino connects property operations, guest identity, direct demand,
                  Curina lifestyle partners, executive analytics, and enterprise APIs
                  into one intelligent hospitality network.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <ButtonLink href="/contact">Start an enterprise conversation</ButtonLink>
                  <ButtonLink href="/platform" variant="secondary">
                    Explore the platform
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <HeroVisual />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionShell
        id="problem"
        eyebrow="The Problem"
        title="Premium hospitality is fragmented by default."
        intro="Independent hotels have distinctive brands, but their systems rarely speak the same language. Guest data duplicates, OTA value leaks away, and intelligence is lost between tools."
        className="bg-white"
      >
        <FragmentationVisual />
      </SectionShell>

      <SectionShell
        eyebrow="The Solution"
        title="Nestino connects the ecosystem without standardizing the soul of each property."
        intro="Hotels, guests, lifestyle partners, demand signals, analytics, and APIs become one intelligent network."
      >
        <SolutionNetwork />
      </SectionShell>

      <SectionShell
        eyebrow="Property OS"
        title="Every operational module becomes part of one architecture."
        intro="PMS, housekeeping, POS, maintenance, CRM, booking, revenue, payments, inventory, and AI operate as connected layers."
        className="bg-sand/70"
      >
        <PropertyModules />
      </SectionShell>

      <SectionShell
        eyebrow="Guest Identity"
        title="One guest. One profile. Many experiences."
        intro="Every stay, meal, wellness visit, cafe moment, retail interaction, and event can enrich a single consent-aware identity."
        className="bg-white"
      >
        <GuestIdentityVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Curina Lifestyle Network"
        title="The city around the hotel becomes connected."
        intro="Restaurants, cafes, gyms, wellness centers, art spaces, coworking venues, tourism providers, and lifestyle brands join the guest journey."
      >
        <CurinaCityVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Autonomous Demand Engine"
        title="Nestino is not just a website layer. It keeps improving demand."
        intro="The engine continuously learns where direct demand can grow and what needs to change across classic search, AI discovery, on-site experience, and off-site trust."
        className="bg-white"
      >
        <EngineLoopVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Executive Intelligence"
        title="Leadership sees revenue, guests, demand, and partner movement in one place."
        intro="Dashboards are designed as decision surfaces, not data dumps."
      >
        <DashboardVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Network Effect"
        title="Every connected property makes the network more intelligent."
        intro="More hotels create more guest signals. Better AI improves personalization. More direct bookings create stronger economics. More partners join."
        className="bg-sand/70"
      >
        <NetworkEffectVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Technology"
        title="A premium interface on top of enterprise-grade architecture."
        intro="Cloud services, APIs, data, AI, analytics, and security layers assemble into a platform that can extend with hotel groups and strategic partners."
        className="bg-white"
      >
        <TechnologyStackVisual />
      </SectionShell>

      <SectionShell
        eyebrow="Case Journey"
        title="A single guest journey becomes a richer network signal."
        intro="The guest moves through fitness, booking, dining, wellness, checkout, and Curina return. The profile grows more useful at every step."
      >
        <CaseStudyJourney />
      </SectionShell>

      <SectionShell
        eyebrow="Platform Modules"
        title="The core solutions work together as one operating model."
        intro="Each pillar is valuable alone. Together, they create the connected hospitality network."
        className="bg-white"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productPillars.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="luxury-card group p-7 transition hover:-translate-y-1 hover:border-champagne"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
                {pillar.kicker}
              </p>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] text-charcoal">
                {pillar.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone">{pillar.description}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {pillar.points.slice(0, 4).map((point) => (
                  <span
                    key={point}
                    className="rounded-full bg-sand px-3 py-1.5 text-xs text-stone"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <CtaSection
        eyebrow="The next hospitality network"
        title="Independent luxury does not need to stay disconnected."
        text="Nestino gives premium hospitality brands a connected operating system while preserving the individuality that makes each property worth choosing."
      />
    </main>
  );
}
