import Link from "next/link";
import { primaryNavigation, secondaryNavigation } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-beige bg-charcoal text-ivory">
      <div className="content-grid py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Nestino home">
              <span className="grid size-10 place-items-center rounded-full bg-ivory text-sm font-semibold text-charcoal">
                N
              </span>
              <span className="font-display text-3xl font-semibold tracking-[-0.05em]">
                Nestino
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-ivory/66">
              The enterprise hospitality operating system connecting property operations,
              guest identity, Curina lifestyle partners, autonomous demand, analytics, and APIs.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-champagne">
              Platform
            </h2>
            <ul className="mt-5 grid gap-3 text-sm text-ivory/70">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-champagne">
              Company
            </h2>
            <ul className="mt-5 grid gap-3 text-sm text-ivory/70">
              {secondaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/54 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nestino. All rights reserved.</p>
          <p>Built for independent luxury hospitality networks.</p>
        </div>
      </div>
    </footer>
  );
}
