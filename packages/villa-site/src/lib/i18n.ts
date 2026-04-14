// All BCP-47 language codes the platform may serve across any property.
// Middleware validates path segments against this list.
// Per-site active languages are stored in site_languages (DB).
export const ALL_SUPPORTED_LANGS = [
  "en",
  "tr",
  "ar",
  "ru",
  "de",
  "fr",
  "zh-Hans",
  "ko",
  "ja",
  "it",
  "nl",
  "es",
  "ms",
  "pt",
] as const;

export type Lang = (typeof ALL_SUPPORTED_LANGS)[number];

export function isLang(value: string): value is Lang {
  return (ALL_SUPPORTED_LANGS as readonly string[]).includes(value);
}

// Maps BCP-47 code → HTML lang attribute value
export function htmlLang(lang: Lang): string {
  const map: Partial<Record<Lang, string>> = {
    "zh-Hans": "zh-Hans",
  };
  return map[lang] ?? lang;
}

// Languages that render right-to-left
const RTL_LANGS: ReadonlySet<Lang> = new Set<Lang>(["ar"]);

export function isRtl(lang: Lang): boolean {
  return RTL_LANGS.has(lang);
}

// Human-readable label per language (used in language switcher UI)
export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
  de: "Deutsch",
  fr: "Français",
  "zh-Hans": "中文",
  ko: "한국어",
  ja: "日本語",
  it: "Italiano",
  nl: "Nederlands",
  es: "Español",
  ms: "Melayu",
  pt: "Português",
};

/** Emoji flags for language switcher UI. */
export const LANG_FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  ar: "🇸🇦",
  ru: "🇷🇺",
  de: "🇩🇪",
  fr: "🇫🇷",
  "zh-Hans": "🇨🇳",
  ko: "🇰🇷",
  ja: "🇯🇵",
  it: "🇮🇹",
  nl: "🇳🇱",
  es: "🇪🇸",
  ms: "🇲🇾",
  pt: "🇵🇹",
};

// Build hreflang alternate URLs for a given page across active languages
export function buildHreflangAlternates(
  host: string,
  slug: string, // without lang prefix, e.g. 'villas/badem' or '' for home
  activeLanguages: string[],
  defaultLang: string
): { hreflang: string; href: string }[] {
  const protocol = host.includes("localhost") ? "http" : "https";
  const base = `${protocol}://${host}`;
  const pagePath = slug ? `/${slug}` : "";

  const alternates = activeLanguages.map((lang) => ({
    hreflang: lang,
    href: `${base}/${lang}${pagePath}`,
  }));

  // x-default → default language
  alternates.push({
    hreflang: "x-default",
    href: `${base}/${defaultLang}${pagePath}`,
  });

  return alternates;
}