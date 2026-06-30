"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNavigation, secondaryNavigation } from "@/content/site";
import { ButtonLink } from "@/components/button-link";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [...primaryNavigation, ...secondaryNavigation];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-site items-center justify-between rounded-full border border-beige/80 bg-ivory/82 px-4 py-3 shadow-soft backdrop-blur-2xl md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Nestino home">
          <span className="grid size-9 place-items-center rounded-full bg-charcoal text-sm font-semibold text-ivory">
            N
          </span>
          <span className="font-display text-2xl font-semibold tracking-[-0.04em] text-charcoal">
            Nestino
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname === item.href
                  ? "bg-sand text-charcoal"
                  : "text-stone hover:bg-white hover:text-charcoal"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/pricing" className="text-sm font-medium text-stone hover:text-charcoal">
            Pricing
          </Link>
          <ButtonLink href="/contact" className="px-5 py-2.5">
            Contact
          </ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-full border border-beige px-4 py-2 text-sm font-semibold text-charcoal lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-3 max-w-site rounded-[28px] border border-beige bg-ivory/95 p-4 shadow-card backdrop-blur-2xl lg:hidden"
        >
          <nav className="grid gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 ${
                  pathname === item.href
                    ? "bg-sand text-charcoal"
                    : "text-stone hover:bg-white hover:text-charcoal"
                }`}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs leading-5 text-stone">{item.description}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
