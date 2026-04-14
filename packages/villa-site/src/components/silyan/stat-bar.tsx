"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "../../lib/i18n";

type Props = { lang: Lang };

const STATS: { value: number; suffix: string; icon: React.ReactNode }[] = [
  {
    value: 11,
    suffix: "",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    value: 10,
    suffix: "",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    value: 11,
    suffix: "",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7" />
        <path d="M7 19c1.5-2 3.5-3 5-3s3.5 1 5 3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    value: 8,
    suffix: " km",
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 20l6-10 4 6 3-4 5 8H3z" />
      </svg>
    ),
  },
];

const STAT_LABELS: Record<string, string[]> = {
  en: ["Private villas", "Max guests", "Private pools", "To the sea"],
  tr: ["Özel villa", "Maks misafir", "Özel havuz", "Denize uzaklık"],
  ar: ["فيلات خاصة", "أقصى عدد ضيوف", "مسابح خاصة", "إلى البحر"],
  ru: ["Частных вилл", "Макс. гостей", "Частных бассейнов", "До моря"],
};

const STAT_SECTION_TITLE: Record<string, string> = {
  en: "Property highlights",
  tr: "Öne çıkan bilgiler",
  ar: "أبرز المعلومات",
  ru: "Ключевые факты",
};

function useCountUp(target: number, inView: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, target, duration]);

  return count;
}

function StatItem({
  stat,
  label,
  index,
  inView,
}: {
  stat: (typeof STATS)[number];
  label: string;
  index: number;
  inView: boolean;
}) {
  const count = useCountUp(stat.value, inView);
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <li
      className="flex flex-col items-center gap-2.5 py-6 px-4 text-center transition-opacity duration-500"
      style={{
        opacity: inView || prefersReducedMotion ? 1 : 0,
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
      }}
    >
      <span style={{ color: "var(--gold-accent)" }}>{stat.icon}</span>
      <span className="text-xl font-serif font-semibold text-[var(--color-text-primary)] tabular-nums">
        {inView ? count : stat.value}
        {stat.suffix}
      </span>
      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
    </li>
  );
}

export default function StatBar({ lang }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const labels = STAT_LABELS[lang] ?? STAT_LABELS.en!;
  const sectionTitle = STAT_SECTION_TITLE[lang] ?? STAT_SECTION_TITLE.en!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="border-y border-[var(--color-border)]"
      style={{ backgroundColor: "var(--accent-muted)" }}
      aria-labelledby="stat-bar-heading"
    >
      <div className="content-wrapper">
        <h2 id="stat-bar-heading" className="sr-only">
          {sectionTitle}
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--color-border)]/50">
          {STATS.map((stat, i) => (
            <StatItem
              key={i}
              stat={stat}
              label={labels[i]!}
              index={i}
              inView={inView}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
