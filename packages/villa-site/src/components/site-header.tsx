"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { LANG_FLAGS, LANG_LABELS, isLang, type Lang } from "../lib/i18n";
import { villaPath } from "../lib/villa-path";

type Props = {
  siteName: string;
  lang: Lang;
  activeLangs: string[];
  phone?: string;
  pathPrefix?: string;
  logoSrc?: string;
};

const NAV_LINKS = [
  { labelKey: "Villas", href: "/villas" },
  { labelKey: "Guides", href: "/guides" },
  { labelKey: "Location", href: "/location" },
  { labelKey: "About", href: "/about" },
  { labelKey: "Contact", href: "/contact" },
] as const;

const NAV_LABELS: Record<string, Record<string, string>> = {
  en: { Villas: "Villas", Guides: "Guides", Location: "Location", About: "About", Contact: "Contact" },
  tr: { Villas: "Villalar", Guides: "Rehberler", Location: "Konum", About: "Hakkımızda", Contact: "İletişim" },
  ar: { Villas: "الفيلات", Guides: "أدلة", Location: "الموقع", About: "من نحن", Contact: "اتصل بنا" },
  ru: { Villas: "Виллы", Guides: "Гиды", Location: "Расположение", About: "О нас", Contact: "Контакты" },
  de: { Villas: "Villen", Guides: "Guides", Location: "Lage", About: "Über uns", Contact: "Kontakt" },
};

function navLabel(lang: string, key: string): string {
  return NAV_LABELS[lang]?.[key] ?? NAV_LABELS["en"]?.[key] ?? key;
}

export default function SiteHeader({
  siteName,
  lang,
  activeLangs,
  phone,
  pathPrefix = "",
  logoSrc,
}: Props) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <header
        style={{ zIndex: "var(--z-sticky-header)" }}
        className={`fixed inset-x-0 top-0 transition-all duration-500 ease-smooth ${
          isScrolled
            ? "max-md:bg-[var(--color-surface)]/90 max-md:backdrop-blur-xl max-md:shadow-[var(--shadow-sm)] max-md:border-b max-md:border-[var(--color-border)] md:border-b md:border-white/20 md:bg-white/[0.96] md:shadow-[0_1px_0_rgba(0,0,0,0.04)] md:backdrop-blur-2xl md:backdrop-saturate-150"
            : "bg-transparent md:border-b md:border-white/20 md:bg-white/[0.96] md:shadow-[0_1px_0_rgba(0,0,0,0.04)] md:backdrop-blur-2xl md:backdrop-saturate-150"
        }`}
      >
        <div className="content-wrapper flex items-center justify-between h-14 md:h-16">
          <Link
            href={villaPath(pathPrefix, `/${lang}`)}
            className={
              logoSrc
                ? "inline-flex items-center shrink-0 hover:scale-[1.02] transition-transform duration-300"
                : "font-serif font-semibold text-lg tracking-tight hover:text-[var(--accent-500)] transition-colors duration-300"
            }
            style={!logoSrc ? { color: isScrolled ? "var(--color-text-primary)" : "var(--color-text-primary)" } : undefined}
          >
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={siteName}
                width={250}
                height={53}
                className="h-7 md:h-9 w-auto max-w-[min(180px,50vw)] object-contain object-start"
                sizes="(max-width: 768px) 50vw, 200px"
                priority
              />
            ) : (
              siteName
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map(({ labelKey, href }) => (
              <Link
                key={href}
                href={villaPath(pathPrefix, `/${lang}${href}`)}
                className="relative text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-300 after:absolute after:bottom-[-4px] after:start-0 after:h-[1.5px] after:w-0 after:bg-[var(--accent-500)] after:transition-all after:duration-300 hover:after:w-full"
              >
                {navLabel(lang, labelKey)}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {activeLangs.length > 1 && (
              <div className="flex items-center gap-1">
                {activeLangs.map((l) => (
                  <Link
                    key={l}
                    href={villaPath(pathPrefix, `/${l}`)}
                    className={`inline-flex items-center justify-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors duration-200 ${
                      l === lang
                        ? "text-[var(--accent-500)] bg-[var(--accent-muted)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                    aria-label={LANG_LABELS[l as Lang] ?? l}
                  >
                    {isLang(l) ? (
                      <span className="text-sm leading-none" aria-hidden>
                        {LANG_FLAGS[l]}
                      </span>
                    ) : null}
                    <span>{l.toUpperCase().slice(0, 2)}</span>
                  </Link>
                ))}
              </div>
            )}
            <a
              href="https://www.instagram.com/silyanvillalari/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 -me-1"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <div className="relative w-5 h-4">
              <span
                className="absolute left-0 block w-full h-[1.5px] bg-current transition-all duration-300 ease-smooth"
                style={{
                  color: "var(--color-text-primary)",
                  top: drawerOpen ? "7px" : "0",
                  transform: drawerOpen ? "rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-0 top-[7px] block w-full h-[1.5px] bg-current transition-opacity duration-200"
                style={{
                  color: "var(--color-text-primary)",
                  opacity: drawerOpen ? 0 : 1,
                }}
              />
              <span
                className="absolute left-0 block w-full h-[1.5px] bg-current transition-all duration-300 ease-smooth"
                style={{
                  color: "var(--color-text-primary)",
                  top: drawerOpen ? "7px" : "14px",
                  transform: drawerOpen ? "rotate(-45deg)" : "none",
                }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
          style={{ zIndex: "var(--z-drawer-backdrop)" }}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed top-0 end-0 bottom-0 w-[min(320px,85vw)] bg-[var(--color-surface)] md:hidden flex flex-col transition-transform duration-350 ease-smooth safe-bottom ${
          drawerOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
        style={{ zIndex: "var(--z-drawer)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="h-14 flex items-center justify-end rtl:justify-start px-4 border-b border-[var(--color-border)]">
          <button
            onClick={closeDrawer}
            className="flex items-center justify-center w-10 h-10"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ labelKey, href }) => (
              <Link
                key={href}
                href={villaPath(pathPrefix, `/${lang}${href}`)}
                className="flex items-center h-14 text-lg font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border)]/50 transition-colors duration-200 active:text-[var(--accent-500)]"
                onClick={closeDrawer}
              >
                {navLabel(lang, labelKey)}
              </Link>
            ))}
          </div>

          {activeLangs.length > 1 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                {lang === "tr" ? "Dil" : lang === "ar" ? "اللغة" : lang === "ru" ? "Язык" : "Language"}
              </p>
              <div className="flex flex-wrap gap-2">
                {activeLangs.map((l) => (
                  <Link
                    key={l}
                    href={villaPath(pathPrefix, `/${l}`)}
                    className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md border transition-colors duration-200 ${
                      l === lang
                        ? "border-[var(--accent-500)] text-[var(--accent-500)] bg-[var(--accent-muted)]"
                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                    }`}
                    onClick={closeDrawer}
                  >
                    {isLang(l) ? (
                      <span className="text-base leading-none shrink-0" aria-hidden>
                        {LANG_FLAGS[l]}
                      </span>
                    ) : null}
                    <span>{LANG_LABELS[l as Lang] ?? l}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="px-6 py-5 border-t border-[var(--color-border)] flex flex-col gap-3">
          <a
            href="https://www.instagram.com/silyanvillalari/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-md text-base font-medium text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors duration-200 active:scale-[0.97]"
            onClick={closeDrawer}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
