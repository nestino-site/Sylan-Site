"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lang } from "../../lib/i18n";
import { getSilyanFaqItems, SILYAN_FAQ_SECTION_LABEL } from "../../lib/silyan-faq-data";
import AnimateOnScroll from "../animate-on-scroll";

export default function FAQ({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = getSilyanFaqItems(lang);
  const label = SILYAN_FAQ_SECTION_LABEL[lang] ?? SILYAN_FAQ_SECTION_LABEL.en!;

  return (
    <section
      className="section-y bg-[var(--color-surface)] content-lazy"
      aria-labelledby="silyan-faq-heading"
    >
      <div className="content-wrapper">
        <AnimateOnScroll variant="fade-up">
          <h2
            id="silyan-faq-heading"
            className="font-serif font-semibold text-h2 text-[var(--color-text-primary)] mb-8"
          >
            {label}
          </h2>
        </AnimateOnScroll>

        <div className="max-w-2xl space-y-2">
          {items.map((item, i) => {
            const isOpen = open === i;
            const qId = `silyan-faq-q-${i}`;
            const aId = `silyan-faq-a-${i}`;
            return (
              <AnimateOnScroll key={i} variant="fade-up" delay={i * 0.03}>
                <div
                  className={`border rounded-xl overflow-hidden transition-colors duration-300 ${
                    isOpen
                      ? "border-[var(--accent-400)]/50 bg-[var(--color-bg)]"
                      : "border-[var(--color-border)]"
                  }`}
                >
                  <button
                    id={qId}
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start text-base font-medium text-[var(--color-text-primary)] transition-colors duration-200 min-h-[var(--tap-target)]"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={aId}
                  >
                    <span>{item.q}</span>
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="flex-shrink-0 text-[var(--color-text-muted)]"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden="true"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </motion.svg>
                  </button>

                  <div id={aId} role="region" aria-labelledby={qId} hidden={!isOpen}>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-base text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]/50">
                            <div className="pt-4">{item.a}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
