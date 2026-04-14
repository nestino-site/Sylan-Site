import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";
import { WHATSAPP_BRAND_GREEN } from "../lib/whatsapp-brand";

const LAT = 36.823;
const LNG = 30.5378;
const MAP_EMBED = `https://maps.google.com/maps?q=${LAT},${LNG}&z=14&output=embed`;
const MAPS_LINK = `https://www.google.com/maps?q=${LAT},${LNG}`;

type Props = { params: Promise<{ lang: string; siteSlug?: string }>; pathPrefix: string };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Location — Silyan Villas", description: "Silyan Villas in Hisarçandır, Konyaaltı — 22 km from Antalya Airport, 12 km from the city centre, 8 km from Konyaaltı Beach." },
  tr: { title: "Konum — Silyan Villas", description: "Hisarçandır, Konyaaltı'daki Silyan Villas — Antalya Havalimanı'na 22 km, şehir merkezine 12 km, Konyaaltı Sahili'ne 8 km." },
  ar: { title: "الموقع — سيليان فيلاز", description: "سيليان فيلاز في هيسارتشاندير، كونيالتي — 22 كم من مطار أنطاليا." },
  ru: { title: "Расположение — Silyan Villas", description: "Silyan Villas в Хисарчандыре, Конъяалты — 22 км от аэропорта Анталии." },
};

const COPY: Record<string, { label: string; h1: string; lead: string; p1: string; p2: string; highlightsTitle: string; highlights: string[]; seasonalTitle: string; seasonalBody: string; cta: string; ctaSub: string; openMaps: string }> = {
  en: { label: "Location", h1: "Between the mountains and the sea", lead: "Forested hillside above Konyaaltı — minutes from the sea, the airport, and Antalya's old town.", p1: "Hisarçandır is one of Konyaaltı's most peaceful neighborhoods — elevated above the coastal plain, surrounded by pine and oak forest, with a microclimate that runs 3–5°C cooler than the beach in summer. The drive into Antalya takes about 20 minutes. Konyaaltı Beach is 8 km. The airport is 22 km, making arrivals and departures straightforward.", p2: "Silyan Villas is within easy reach of Kaleiçi old town, the Düden waterfalls, and the marina — but you won't hear the city from the garden.", highlightsTitle: "What to do in Antalya", highlights: ["Beach days on Konyaaltı's long pebble shore", "Evening walks in Kaleiçi and the marina", "Boat trips and coastal viewpoints", "Düden waterfalls and green parks", "Local markets and regional cuisine"], seasonalTitle: "When to visit", seasonalBody: "Spring and autumn offer mild weather ideal for hiking and sightseeing. Summer is warm at the coast but often a few degrees cooler in the hills. Winter is quiet and mild — perfect if you prefer space and calm.", cta: "Questions about getting here?", ctaSub: "Message us on WhatsApp — we reply within a few hours.", openMaps: "Open in Google Maps" },
  tr: { label: "Konum", h1: "Dağ ile deniz arasında", lead: "Konyaaltı'nın üzerindeki ormanlık yamaçlar — denize, havalimanına ve tarihi merkeze dakikalar uzaklıkta.", p1: "Hisarçandır, Konyaaltı'nın en sakin mahallelerinden biridir — sahil ovasının üzerinde, çam ve meşe ormanıyla çevrili; yazın sahilden 3–5°C daha serin bir mikroiklim sunar. Antalya merkeze arabayla yaklaşık 20 dakika. Konyaaltı Sahili 8 km, havalimanı 22 km.", p2: "Kaleiçi, Düden şelaleleri ve marinaya kolayca ulaşabilirsiniz — bahçeden şehir gürültüsünü duymazsınız.", highlightsTitle: "Antalya'da neler yapılır?", highlights: ["Konyaaltı sahilinde deniz keyfi", "Kaleiçi ve marina akşam yürüyüşleri", "Tekne turları ve kıyı manzaraları", "Düden şelaleleri ve yeşil alanlar", "Yerel pazarlar ve bölgesel mutfak"], seasonalTitle: "Ne zaman gelinir?", seasonalBody: "İlkbahar ve sonbahar yürüyüş ve geziler için ideal ılıman hava sunar. Yaz sahilde sıcaktır; tepelerde genelde biraz daha serindir. Kış sakin ve ılımandır.", cta: "Yol tarifi veya ulaşım hakkında soru mu var?", ctaSub: "WhatsApp'tan yazın — birkaç saat içinde yanıt veriyoruz.", openMaps: "Google Maps'te aç" },
  ar: { label: "الموقع", h1: "بين الجبل والبحر", lead: "تلة مشجرة فوق كونيالتي — قريبة من البحر والمطار والمدينة القديمة.", p1: "هيسارتشاندير من أهدوء أحياء كونيالتي — مرتفعة فوق السهل الساحلي، محاطة بغابات الصنوبر والبلوط، مع مناخ دقيق أبرد بدرجات من الشاطئ في الصيف.", p2: "يسهل الوصول من سيليان فيلاز إلى كاليتشي وشلالات دودين والمارينا — دون سماع ضجيج المدينة من الحديقة.", highlightsTitle: "ماذا تفعل في أنطاليا", highlights: ["أيام الشاطئ في كونيالتي", "المشي المسائي في كاليتشي والمارينا", "رحلات بحرية ومناظر ساحلية", "شلالات دودين والحدائق", "الأسواق المحلية والمأكولات"], seasonalTitle: "أفضل وقت للزيارة", seasonalBody: "الربيع والخريف مناسبان للتنزه. الصيف دافئ على الساحل وأبرد قليلاً في التلال. الشتاء هادئ ومعتدل.", cta: "أسئلة عن الوصول؟", ctaSub: "راسلنا على واتساب — نرد خلال ساعات.", openMaps: "افتح في خرائط جوجل" },
  ru: { label: "Расположение", h1: "Между горой и морем", lead: "Лесистый склон над Конъяалты — недалеко от моря, аэропорта и старого города.", p1: "Хисарчандыре — один из самых тихих районов Конъяалты: над прибрежной равниной, в сосново-дубовом лесу; летом здесь на 3–5°C прохладнее, чем на пляже. До центра Анталии около 20 минут, до пляжа Конъяалты 8 км, до аэропорта 22 км.", p2: "До Калеичи, водопадов Дюден и марины — короткая поездка, но из сада город не слышен.", highlightsTitle: "Чем заняться в Анталии", highlights: ["Пляжные дни в Конъяалты", "Вечерние прогулки в Калеичи и на марине", "Морские прогулки и смотровые площадки", "Водопады Дюден и парки", "Рынки и местная кухня"], seasonalTitle: "Когда ехать", seasonalBody: "Весна и осень — мягкая погода для прогулок. Летом на побережье жарче, в горах прохладнее. Зима спокойная и тёплая.", cta: "Вопросы о дороге?", ctaSub: "Напишите в WhatsApp — ответим за несколько часов.", openMaps: "Открыть в Google Maps" },
};

const ROWS = [
  { key: "ayt", dist: "22 km", driveEn: "~25–30 min", driveTr: "~25–30 dk", driveAr: "~25–30 د", driveRu: "~25–30 мин" },
  { key: "city", dist: "12 km", driveEn: "~20 min", driveTr: "~20 dk", driveAr: "~20 د", driveRu: "~20 мин" },
  { key: "beach", dist: "8 km", driveEn: "~15 min", driveTr: "~15 dk", driveAr: "~15 د", driveRu: "~15 мин" },
  { key: "kaleici", dist: "~15 km", driveEn: "~20 min", driveTr: "~20 dk", driveAr: "~20 د", driveRu: "~20 мин" },
  { key: "duden", dist: "~10 km", driveEn: "~15 min", driveTr: "~15 dk", driveAr: "~15 د", driveRu: "~15 мин" },
  { key: "lara", dist: "~25 km", driveEn: "~30 min", driveTr: "~30 dk", driveAr: "~30 د", driveRu: "~30 мин" },
] as const;

const ROW_LABELS: Record<string, Record<string, string>> = {
  ayt: { en: "Antalya Airport (AYT)", tr: "Antalya Havalimanı (AYT)", ar: "مطار أنطاليا", ru: "Аэропорт Анталии (AYT)" },
  city: { en: "Antalya city centre", tr: "Antalya şehir merkezi", ar: "مركز أنطاليا", ru: "Центр Анталии" },
  beach: { en: "Konyaaltı Beach", tr: "Konyaaltı Sahili", ar: "شاطئ كونيالتي", ru: "Пляж Конъяалты" },
  kaleici: { en: "Kaleiçi Old Town", tr: "Kaleiçi Eski Kent", ar: "المدينة القديمة كاليتشي", ru: "Старый город Калеичи" },
  duden: { en: "Düden Waterfalls", tr: "Düden Şelaleleri", ar: "شلالات دودين", ru: "Водопады Дюден" },
  lara: { en: "Lara Beach", tr: "Lara Sahili", ar: "شاطئ لارا", ru: "Пляж Лара" },
};

const ICON_SVG_PROPS = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true as const };

/** Destination + distance row icons (stroke matches villa-site patterns). */
const ROW_ICONS: Record<(typeof ROWS)[number]["key"], ReactNode> = {
  ayt: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M17.8 19.2 16 11l3.5-3.5c1.5-1.5 2-3.5 1.5-4.5s-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  ),
  city: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18" />
      <path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2" />
      <path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </svg>
  ),
  beach: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 0 2.5 2 5 2c1.3 0 1.9-.5 2.5-1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 0 2.5 2 5 2c1.3 0 1.9-.5 2.5-1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 0 2.5 2 5 2c1.3 0 1.9-.5 2.5-1" />
    </svg>
  ),
  kaleici: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M3 21h18" />
      <path d="M6 21V10l6-6 6 6v11" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 13h.01M12 13h.01M15 13h.01" />
    </svg>
  ),
  duden: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M7 16.3c2.2 2 4.8 1.2 4.8-1.8 0-2.3-1.6-5.6-4.8-9.5-3.2 3.9-4.8 7.2-4.8 9.5 0 3 2.6 3.8 4.8 1.8z" />
      <path d="M14.8 15.6c1.4 1.2 3.1.7 3.1-1.2 0-1.5-.9-3.5-3.1-6-2.2 2.5-3.1 4.5-3.1 6 0 1.9 1.7 2.4 3.1 1.2z" />
    </svg>
  ),
  lara: (
    <svg {...ICON_SVG_PROPS}>
      <path d="M22 12a10 10 0 10-20 0Z" />
      <path d="M12 12v8a2 2 0 004 0" />
      <path d="M12 2v1" />
    </svg>
  ),
};

function RouteDistanceIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="shrink-0 opacity-85" aria-hidden>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a2.5 2.5 0 002-4.5L18 5" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="shrink-0 opacity-70" aria-hidden>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 8H6L4.5 11.1C3.7 11.3 3 12.1 3 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function driveForLang(lang: string, row: (typeof ROWS)[number]): string {
  if (lang === "tr") return row.driveTr;
  if (lang === "ar") return row.driveAr;
  if (lang === "ru") return row.driveRu;
  return row.driveEn;
}

export async function generateLocationMetadata({ params, pathPrefix }: Props): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang] ?? META.en!;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const path = villaPath(pathPrefix, `/${lang}/location`);
  const canonical = `${origin.origin}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: meta.title, description: meta.description, url: canonical, type: "website" },
  };
}

export default async function LocationPage({ params, pathPrefix }: Props) {
  const { lang } = await params;
  const safeLang: Lang = isLang(lang) ? lang : "en";
  const c = COPY[safeLang] ?? COPY.en!;
  const h = await headers();
  const slug = h.get("x-nestino-slug") ?? "";
  const ctx = slug ? await getSiteBySubdomain(slug) : null;
  const phone = ctx?.tenant.ownerPhone ?? "+905316960953";
  const digits = phone.replace(/\D/g, "");
  const waHref = digits ? `https://wa.me/${digits}` : "#";

  return (
    <div className="pt-20 pb-16">
      <div className="section-y">
        <div className="content-wrapper max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--accent-500)" }}>{c.label}</p>
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-4">{c.h1}</h1>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">{c.lead}</p>

          {/* Map — taller on mobile */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-lg)] mb-4 aspect-[4/3] md:aspect-[21/9]">
            <iframe
              title="Silyan Villas map"
              src={MAP_EMBED}
              className="w-full h-full min-h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mb-10 sm:hidden">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] active:scale-[0.97] transition-transform"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {c.openMaps}
            </a>
          </div>

          <div className="space-y-6 mb-10">
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{c.p1}</p>
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{c.p2}</p>
          </div>

          {/* Distance cards instead of table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center gap-3 sm:gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                  aria-hidden
                >
                  {ROW_ICONS[row.key]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{ROW_LABELS[row.key]?.[safeLang] ?? ROW_LABELS[row.key]?.en}</p>
                  <p className="text-xs text-[var(--color-text-muted)] inline-flex items-center gap-1.5">
                    <CarIcon />
                    {driveForLang(safeLang, row)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" style={{ color: "var(--accent-500)" }}>
                  <RouteDistanceIcon />
                  <span className="text-sm font-semibold tabular-nums">{row.dist}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights — horizontal scroll on mobile */}
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-4">{c.highlightsTitle}</h2>
          <div className="snap-carousel sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 sm:overflow-visible mb-10">
            {c.highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] w-[75vw] sm:w-auto shrink-0 sm:shrink">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "var(--accent-500)" }} />
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </div>
            ))}
          </div>

          {/* Seasonal info */}
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] mb-10">
            <h3 className="font-serif font-semibold text-lg text-[var(--color-text-primary)] mb-2">{c.seasonalTitle}</h3>
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">{c.seasonalBody}</p>
          </div>

          {/* CTA band */}
          <div className="text-center p-8 rounded-xl shadow-[var(--shadow-glow)]" style={{ backgroundColor: "var(--accent-muted)" }}>
            <p className="font-serif font-semibold text-lg text-[var(--color-text-primary)] mb-2">{c.cta}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5">{c.ctaSub}</p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium text-white transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
