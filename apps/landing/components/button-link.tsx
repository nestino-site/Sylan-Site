import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-charcoal text-ivory shadow-gold hover:bg-olive hover:text-white",
  secondary:
    "border border-beige bg-white/70 text-charcoal hover:border-champagne hover:bg-white",
  ghost:
    "text-charcoal underline decoration-champagne/40 underline-offset-8 hover:decoration-champagne",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-[-0.01em] transition duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
