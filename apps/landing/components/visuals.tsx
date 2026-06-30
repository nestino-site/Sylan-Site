"use client";

import { motion, useReducedMotion } from "framer-motion";
import { engineLoop, guestJourney, operatingModules, productPillars } from "@/content/site";

const slowTransition = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

function useMotionEnabled() {
  return !useReducedMotion();
}

export function HeroVisual() {
  const shouldAnimate = useMotionEnabled();

  return (
    <div className="relative min-h-[580px] overflow-hidden rounded-[44px] border border-beige bg-sand shadow-card">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),rgba(239,232,219,0.1)_38%,rgba(75,91,78,0.12)_100%)]" />
      <div className="absolute inset-x-10 top-10 h-48 rounded-[36px] bg-[linear-gradient(135deg,rgba(75,91,78,0.78),rgba(38,38,38,0.88)),linear-gradient(90deg,#EFE8DB,#FFFFFF)] shadow-soft" />
      <div className="absolute left-12 top-20 h-44 w-48 rounded-t-full bg-white/70 shadow-soft" />
      <div className="absolute right-12 top-28 h-36 w-64 rounded-[32px] bg-white/62 shadow-soft" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(248,246,241,0),rgba(248,246,241,0.98))]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 580" aria-hidden="true">
        <motion.path
          d="M110 375 C220 230 305 420 382 284 C468 132 566 280 654 132"
          fill="none"
          stroke="#C8A96A"
          strokeWidth="1.4"
          strokeDasharray="1"
          pathLength="1"
          initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 2.4, delay: 0.7, ease: "easeInOut" }}
        />
        {[110, 282, 382, 530, 654].map((x, index) => (
          <motion.circle
            key={x}
            cx={x}
            cy={[375, 328, 284, 216, 132][index]}
            r="6"
            fill="#C8A96A"
            initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
            animate={shouldAnimate ? { scale: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay: 1 + index * 0.18 }}
          />
        ))}
      </svg>

      <motion.div
        className="absolute bottom-10 left-6 right-6 rounded-[32px] border border-white/70 bg-white/72 p-5 shadow-card backdrop-blur-xl md:left-16 md:right-16"
        initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={{ ...slowTransition, delay: 1.2 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-beige pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Executive network view</p>
            <p className="mt-1 text-lg font-semibold text-charcoal">Connected hospitality graph</p>
          </div>
          <p className="font-mono text-2xl text-olive">+31%</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["Direct demand", "Guest identity", "Curina lift"].map((label, index) => (
            <div key={label} className="rounded-2xl bg-ivory p-4">
              <p className="font-mono text-xl text-charcoal">{["74", "18k", "42"][index]}</p>
              <p className="mt-1 text-xs text-stone">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function FragmentationVisual() {
  return (
    <div className="grid gap-5 md:grid-cols-5">
      {["Hotel A", "Hotel B", "Hotel C", "Hotel D", "Hotel E"].map((hotel, index) => (
        <motion.div
          key={hotel}
          className="luxury-card relative min-h-56 overflow-hidden p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...slowTransition, delay: index * 0.08 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-charcoal">{hotel}</span>
            <span className="size-2 rounded-full bg-stone/40" />
          </div>
          {["PMS", "CRM", "OTA", "Guest"].map((item) => (
            <div key={item} className="mb-3 rounded-2xl border border-beige bg-ivory px-3 py-2 text-xs text-stone">
              {item} silo
            </div>
          ))}
          <motion.div
            className="absolute -bottom-8 left-1/2 size-20 rounded-full bg-champagne/20 blur-2xl"
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function SolutionNetwork() {
  const nodes = ["Hotels", "Guests", "Curina", "Demand", "Analytics", "APIs"];

  return (
    <div className="luxury-card relative overflow-hidden p-8 md:p-12">
      <div className="absolute inset-0 soft-grid opacity-60" />
      <div className="relative grid gap-6 md:grid-cols-3">
        {nodes.map((node, index) => (
          <motion.div
            key={node}
            className="rounded-[28px] border border-beige bg-white/86 p-6 shadow-soft"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...slowTransition, delay: index * 0.08 }}
          >
            <span className="font-mono text-xs text-champagne">0{index + 1}</span>
            <h3 className="mt-4 text-xl font-semibold text-charcoal">{node}</h3>
            <p className="mt-2 text-sm leading-6 text-stone">
              Connected signal layer
            </p>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-8 h-px bg-gold-line" />
    </div>
  );
}

export function PropertyModules() {
  return (
    <div className="luxury-card relative overflow-hidden p-8 md:p-12">
      <div className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/40 bg-sand/60" />
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {operatingModules.map((module, index) => (
          <motion.div
            key={module}
            className="group rounded-3xl border border-beige bg-white/82 p-5 shadow-soft transition hover:-translate-y-1 hover:border-champagne"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...slowTransition, delay: index * 0.04 }}
          >
            <div className="mb-8 size-10 rounded-full bg-sand transition group-hover:bg-champagne/24" />
            <h3 className="text-sm font-semibold text-charcoal">{module}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GuestIdentityVisual() {
  return (
    <div className="luxury-card overflow-hidden p-8 md:p-12">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[32px] bg-charcoal p-6 text-ivory shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-champagne">Unified profile</p>
          <h3 className="mt-8 font-display text-5xl font-semibold tracking-[-0.05em]">
            One guest.
          </h3>
          <p className="mt-4 text-sm leading-7 text-ivory/68">
            Preference memory, stay history, lifestyle signals, loyalty context, and direct intent.
          </p>
          <div className="mt-8 grid gap-3">
            {["Ocean room", "Late checkout", "Pilates", "Plant-forward dining"].map((item) => (
              <span key={item} className="rounded-full border border-ivory/10 bg-white/8 px-4 py-2 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {guestJourney.map((step, index) => (
            <motion.div
              key={step}
              className="rounded-3xl border border-beige bg-ivory p-5"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...slowTransition, delay: index * 0.05 }}
            >
              <div className="mb-6 h-1 rounded-full bg-gold-line" />
              <p className="font-semibold text-charcoal">{step}</p>
              <p className="mt-2 text-sm text-stone">Profile signal enriched</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CurinaCityVisual() {
  const buildings = ["Cafe", "Gym", "Restaurant", "Gallery", "Wellness", "Hotel", "Cowork", "Events"];

  return (
    <div className="luxury-card relative overflow-hidden p-8 md:p-12">
      <div className="absolute inset-x-0 bottom-0 h-28 bg-sand" />
      <div className="relative grid min-h-80 grid-cols-4 items-end gap-4 md:grid-cols-8">
        {buildings.map((building, index) => (
          <motion.div
            key={building}
            className="rounded-t-[28px] border border-beige bg-white/88 p-3 text-center shadow-soft"
            style={{ minHeight: `${120 + (index % 4) * 28}px` }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...slowTransition, delay: index * 0.06 }}
          >
            <div className="mx-auto mb-4 size-8 rounded-full bg-champagne/24" />
            <p className="text-xs font-semibold text-charcoal">{building}</p>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-8 grid gap-3 md:grid-cols-4">
        {["Offers appear", "Points accumulate", "Profile updates", "Recommendations improve"].map((item) => (
          <div key={item} className="rounded-full border border-beige bg-ivory px-4 py-3 text-center text-sm text-stone">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EngineLoopVisual() {
  return (
    <div className="luxury-card p-8 md:p-12">
      <div className="grid gap-4 md:grid-cols-6">
        {engineLoop.map((item, index) => (
          <motion.div
            key={item}
            className="relative rounded-[28px] border border-beige bg-white p-5 text-center shadow-soft"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...slowTransition, delay: index * 0.06 }}
          >
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-sand font-mono text-sm text-olive">
              {index + 1}
            </span>
            <h3 className="mt-5 text-sm font-semibold text-charcoal">{item}</h3>
            {index < engineLoop.length - 1 && (
              <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-champagne md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function DashboardVisual() {
  const metrics = [
    ["Revenue", "+18.4%"],
    ["Occupancy", "82%"],
    ["RevPAR", "+12.7%"],
    ["Guest LTV", "+31%"],
  ];

  return (
    <div className="luxury-card overflow-hidden p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between border-b border-beige pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Executive dashboard</p>
          <h3 className="mt-2 text-2xl font-semibold text-charcoal">Network performance</h3>
        </div>
        <span className="rounded-full bg-sand px-4 py-2 text-xs font-semibold text-olive">Live view</span>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-ivory p-5">
            <p className="text-sm text-stone">{label}</p>
            <p className="mt-3 font-mono text-3xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 h-48 rounded-[28px] bg-sand p-6">
        <svg viewBox="0 0 620 160" className="h-full w-full" aria-hidden="true">
          <path d="M0 118 C90 92 110 128 184 88 C260 46 302 86 360 58 C438 20 504 62 620 28" fill="none" stroke="#4B5B4E" strokeWidth="3" />
          <path d="M0 135 C110 116 150 142 230 108 C292 82 360 116 430 82 C506 48 552 76 620 52" fill="none" stroke="#C8A96A" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}

export function NetworkEffectVisual() {
  const items = ["More hotels", "More guests", "More data", "Better AI", "Personalization", "Direct bookings", "Higher revenue"];

  return (
    <div className="luxury-card p-8 md:p-12">
      <div className="grid gap-4 md:grid-cols-7">
        {items.map((item, index) => (
          <div key={item} className="relative rounded-full border border-beige bg-white px-4 py-5 text-center text-sm font-semibold text-charcoal shadow-soft">
            {item}
            {index < items.length - 1 && (
              <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-champagne md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechnologyStackVisual() {
  const layers = ["Cloud layer", "API Gateway", "Data Lake", "AI Engine", "Analytics", "Security"];

  return (
    <div className="luxury-card p-8 md:p-12">
      <div className="grid gap-4">
        {layers.map((layer, index) => (
          <motion.div
            key={layer}
            className="flex items-center justify-between rounded-[28px] border border-beige bg-white/86 px-6 py-5 shadow-soft"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...slowTransition, delay: index * 0.06 }}
          >
            <span className="font-semibold text-charcoal">{layer}</span>
            <span className="font-mono text-sm text-champagne">L{index + 1}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyJourney() {
  const steps = ["UGym", "Profile sync", "Weekend booking", "Restaurant", "Spa", "Checkout", "Curina return", "Personalized offer"];

  return (
    <div className="luxury-card p-8 md:p-12">
      <div className="grid gap-4 md:grid-cols-8">
        {steps.map((step, index) => (
          <div key={step} className="rounded-3xl border border-beige bg-ivory p-4 text-center">
            <span className="mx-auto mb-4 grid size-9 place-items-center rounded-full bg-champagne/20 font-mono text-xs text-olive">
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-charcoal">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageVisual({ type }: { type: string }) {
  if (type === "property") return <PropertyModules />;
  if (type === "identity") return <GuestIdentityVisual />;
  if (type === "curina" || type === "partners") return <CurinaCityVisual />;
  if (type === "analytics" || type === "pricing") return <DashboardVisual />;
  if (type === "technology") return <TechnologyStackVisual />;
  if (type === "about") return <SolutionNetwork />;

  return (
    <div className="luxury-card p-8 md:p-12">
      <div className="grid gap-4 md:grid-cols-3">
        {productPillars.slice(0, 6).map((pillar) => (
          <div key={pillar.title} className="rounded-[28px] border border-beige bg-ivory p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-champagne">{pillar.kicker}</p>
            <h3 className="mt-4 text-xl font-semibold text-charcoal">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone">{pillar.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
