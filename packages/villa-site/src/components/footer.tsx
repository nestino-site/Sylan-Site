import Link from "next/link";
import { LANG_FLAGS, LANG_LABELS, isLang, type Lang } from "../lib/i18n";
import { villaPath } from "../lib/villa-path";
import { WHATSAPP_BRAND_GREEN } from "../lib/whatsapp-brand";

type Props = {
  siteName: string;
  locationLabel: string;
  phone: string;
  lang: Lang;
  activeLangs: string[];
  pathPrefix?: string;
};

const NAV_ITEMS: Record<
  string,
  { villas: string; guides: string; location: string; about: string; contact: string }
> = {
  en: { villas: "Villas", guides: "Guides", location: "Location", about: "About", contact: "Contact" },
  tr: { villas: "Villalar", guides: "Rehberler", location: "Konum", about: "Hakkımızda", contact: "İletişim" },
  ar: { villas: "الفيلات", guides: "أدلة", location: "الموقع", about: "من نحن", contact: "اتصل بنا" },
  ru: { villas: "Виллы", guides: "Гиды", location: "Расположение", about: "О нас", contact: "Контакты" },
};

const FOOTER_LABELS: Record<string, { explore: string; language: string; privacy: string }> = {
  en: { explore: "Explore", language: "Language", privacy: "Privacy Policy" },
  tr: { explore: "Keşfet", language: "Dil", privacy: "Gizlilik Politikası" },
  ar: { explore: "استكشف", language: "اللغة", privacy: "سياسة الخصوصية" },
  ru: { explore: "Обзор", language: "Язык", privacy: "Политика конфиденциальности" },
};

export default function Footer({
  siteName,
  locationLabel,
  phone,
  lang,
  activeLangs,
  pathPrefix = "",
}: Props) {
  const nav = NAV_ITEMS[lang] ?? NAV_ITEMS.en!;
  const labels = FOOTER_LABELS[lang] ?? FOOTER_LABELS.en!;

  const links = [
    { label: nav.villas, href: villaPath(pathPrefix, `/${lang}/villas`) },
    { label: nav.guides, href: villaPath(pathPrefix, `/${lang}/guides`) },
    { label: nav.location, href: villaPath(pathPrefix, `/${lang}/location`) },
    { label: nav.about, href: villaPath(pathPrefix, `/${lang}/about`) },
    { label: nav.contact, href: villaPath(pathPrefix, `/${lang}/contact`) },
  ];

  const digits = phone?.replace(/\D/g, "");
  const whatsappHref = digits ? `https://wa.me/${digits}` : "#";

  return (
    <footer
      id="site-footer"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface)] safe-bottom"
    >
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)]/30 to-transparent" />

      <div
        className="content-wrapper"
        style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand + contact */}
          <div>
            <p className="font-serif font-semibold text-lg text-[var(--color-text-primary)] mb-1">
              {siteName}
            </p>
            <p className="font-serif italic text-sm text-[var(--color-text-muted)] mb-4">
              {lang === "tr"
                ? "Dağlar ile deniz arasında"
                : lang === "ar"
                  ? "بين الجبل والبحر"
                  : lang === "ru"
                    ? "Между горой и морем"
                    : "Between the mountains & the sea"}
            </p>
            {locationLabel && (
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                {locationLabel}
              </p>
            )}
            {/* Stack vertically: in md:3-col layout the first column is narrow; a row of 3 CTAs overflows. */}
            <div className="flex flex-col gap-2 w-full min-w-0">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="flex w-full min-w-0 items-center justify-center gap-2 h-11 px-4 rounded-md border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--accent-500)] transition-colors duration-200 active:scale-[0.97]"
                >
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span className="min-w-0 truncate">{phone}</span>
                </a>
              ) : null}
              {digits ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 h-11 px-4 rounded-md text-sm font-medium text-white transition-colors duration-200 active:scale-[0.97]"
                  style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              ) : null}
              <a
                href="https://www.instagram.com/silyanvillalari/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 h-11 px-4 rounded-md border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--accent-500)] transition-colors duration-200 active:scale-[0.97]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
              {labels.explore}
            </p>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Languages + legal */}
          <div>
            {activeLangs.length > 1 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                  {labels.language}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {activeLangs.map((l) => (
                    <Link
                      key={l}
                      href={villaPath(pathPrefix, `/${l}`)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-colors duration-200 ${
                        l === lang
                          ? "border-[var(--accent-500)] text-[var(--accent-500)] bg-[var(--accent-muted)]"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]"
                      }`}
                    >
                      {isLang(l) ? (
                        <span className="text-sm leading-none shrink-0" aria-hidden>
                          {LANG_FLAGS[l]}
                        </span>
                      ) : null}
                      <span>{LANG_LABELS[l as Lang] ?? l}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
            <Link
              href={villaPath(pathPrefix, `/${lang}/privacy`)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-200"
            >
              {labels.privacy}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            &copy; {new Date().getFullYear()} {siteName}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Powered by{" "}
            <a
              href="https://nestino.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent-500)] transition-colors duration-200"
            >
              Nestino
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
