import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionShell({
  eyebrow,
  title,
  intro,
  children,
  className = "",
  id,
}: SectionShellProps) {
  return (
    <section id={id} className={`py-24 md:py-36 ${className}`}>
      <div className="content-grid">
        {(eyebrow || title || intro) && (
          <div className="mb-14 max-w-4xl md:mb-20">
            {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
            {title && (
              <h2 className="font-display text-section font-semibold text-charcoal">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone md:text-xl">
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
