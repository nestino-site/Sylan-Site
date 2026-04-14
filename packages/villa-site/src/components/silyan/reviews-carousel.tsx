"use client";

import { type ReactNode } from "react";

type Props = {
  scrollHint: string;
  /** Accessible name for the scrollable review list */
  regionLabel: string;
  children: ReactNode;
};

export default function ReviewsCarousel({ scrollHint, regionLabel, children }: Props) {
  return (
    <div className="-mx-4 md:-mx-6">
      <p className="mb-3 flex items-center justify-center gap-2 px-4 text-center text-[13px] font-medium leading-snug text-[var(--color-text-secondary)] md:mb-4 md:justify-between md:px-6 md:text-start md:text-sm">
        <span className="inline-flex items-center gap-2 text-balance">
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] motion-safe:animate-pulse"
            aria-hidden="true"
          >
            ⇄
          </span>
          <span>{scrollHint}</span>
        </span>
      </p>

      <div
        className="snap-carousel snap-carousel--reviews px-4 pb-1 md:px-6"
        role="region"
        aria-label={regionLabel}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
