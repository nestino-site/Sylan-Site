"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Lang } from "../../lib/i18n";
import { villaPath } from "../../lib/villa-path";
import { WHATSAPP_BRAND_GREEN } from "../../lib/whatsapp-brand";
import { HERO_VIDEO, HERO_POSTER } from "../../lib/silyan-images";

/** Skip first / last N seconds on every play (incl. first) and when looping. */
const HERO_LOOP_TRIM_SEC = 13;

type Props = {
  lang: Lang;
  phone: string;
  pathPrefix?: string;
};

type HeroCopy = {
  kicker: string;
  /** Short nature-led line under the kicker (SEO + tone) */
  ribbon: string;
  headline: string;
  subhead: string;
  cta1: string;
  cta2: string;
  /** Poster / hero still — locale-specific for image SEO and accessibility */
  heroImageAlt: string;
  /** Short factual phrases aligned with on-page JSON-LD (desktop strip) */
  facts: string[];
  /** Accessible name for the facts list */
  factsSummary: string;
  /** Internal link anchor to /location */
  locationLink: string;
};

const HERO_COPY: Record<string, HeroCopy> = {
  en: {
    kicker: "Hisarçandır · Antalya",
    ribbon: "Immersed in nature — above the rush of the city",
    headline: "Eleven private villas in the mountains above Antalya",
    subhead:
      "Each villa has its own pool among pine-cooled hills — a quiet base away from city noise. The Mediterranean is 8 km away; Antalya centre and AYT airport stay within an easy drive when you want them.",
    cta1: "Explore Villas",
    cta2: "WhatsApp",
    heroImageAlt:
      "Private pool and pine-covered hills at Silyan Villas — Hisarçandır, Konyaaltı, Antalya, Turkey",
    facts: ["11 independent villas", "Private pool each", "8 km to the sea", "22 km to AYT airport"],
    factsSummary: "Key facts about Silyan Villas",
    locationLink: "Distances & neighbourhood",
  },
  tr: {
    kicker: "Hisarçandır · Antalya",
    ribbon: "Doğanın içinde — şehrin gürültüsünden uzakta",
    headline: "Antalya'nın doğasında on bir özel villa",
    subhead:
      "Her villa çam serinliğindeki yamaçlarda kendi havuzuyla sessiz bir kaçış sunar; şehir gürültüsünden uzak. Akdeniz 8 km, merkez ve AYT havalimanı istediğinizde kısa sürüş mesafesinde.",
    cta1: "Villaları Keşfet",
    cta2: "WhatsApp",
    heroImageAlt:
      "Silyan Villas'ta özel havuz ve çam ormanlı yamaç — Hisarçandır, Konyaaltı, Antalya, Türkiye",
    facts: ["11 bağımsız villa", "Her villa özel havuz", "Denize 8 km", "AYT havalimanına 22 km"],
    factsSummary: "Silyan Villas hakkında öne çıkan bilgiler",
    locationLink: "Mesafeler ve mahalle",
  },
  ar: {
    kicker: "هيسارتشاندير · أنطاليا",
    ribbon: "في أحضان الطبيعة — بعيدًا عن صخب المدينة",
    headline: "أحد عشر فيلا خاصة في جبال أنطاليا",
    subhead:
      "لكل فيلا مسبحها الخاص بين تلال الصنوبر والهواء الجبلي — ملاذ هادئ بعيدًا عن ضجيج المدينة. البحر الأبيض المتوسط على بعد 8 كم، ووسط أنطاليا والمطار ضمن سهولة الوصول.",
    cta1: "استكشف الفيلات",
    cta2: "واتساب",
    heroImageAlt:
      "مسبح خاص ومنحدرات مغطاة بالأشجار في سيليان فيلاز — هيسارتشاندير، كونيالتي، أنطاليا، تركيا",
    facts: ["11 فيلا مستقلة", "مسبح خاص لكل فيلا", "8 كم إلى البحر", "22 كم إلى مطار AYT"],
    factsSummary: "حقائق رئيسية عن سيليان فيلاز",
    locationLink: "المسافات والحي",
  },
  ru: {
    kicker: "Хисарчандыре · Анталия",
    ribbon: "В атмосфере природы — вдали от городской суеты",
    headline: "Одиннадцать частных вилл в горах над Анталией",
    subhead:
      "У каждой виллы свой бассейн среди сосновых склонов — тихая база вдали от городского шума. До Средиземного моря 8 км; центр Анталии и аэропорт AYT — в комфортной доступности по дороге.",
    cta1: "Смотреть виллы",
    cta2: "WhatsApp",
    heroImageAlt:
      "Частный бассейн и лесистый склон в Silyan Villas — Хисарчандыре, Коньяалты, Анталия, Турция",
    facts: ["11 отдельных вилл", "Свой бассейн в каждой", "8 км до моря", "22 км до аэропорта AYT"],
    factsSummary: "Кратко о Silyan Villas",
    locationLink: "Расстояния и район",
  },
};

function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setMatches(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return matches;
}

export default function Hero({ lang, phone, pathPrefix = "" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarse = useMediaQuery("(pointer: coarse)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /** Do not fade the hero content layer: `opacity` on a parent breaks `backdrop-filter` (frosted panel “pops”). */
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const enableParallax = Boolean(!prefersReducedMotion && isCoarse === false);

  useEffect(() => {
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [prefersReducedMotion]);

  /**
   * Muted autoplay + trim: first frame never shows 0…HERO_LOOP_TRIM_SEC — we seek first,
   * then play after `seeked` (with timeout fallback). Loop skips first/last trim window.
   */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    let trimFallbackTimer: number | undefined;
    let metaApplied = false;

    const ensureMuted = () => {
      v.defaultMuted = true;
      v.muted = true;
    };

    const startPlay = () => {
      ensureMuted();
      void v.play().catch(() => {});
    };

    const onMeta = () => {
      ensureMuted();
      const d = v.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      if (metaApplied) return;
      metaApplied = true;

      if (d <= HERO_LOOP_TRIM_SEC * 2 + 0.5) {
        v.loop = true;
        startPlay();
        return;
      }
      v.loop = false;

      let started = false;
      const startOnce = () => {
        if (started) return;
        started = true;
        if (trimFallbackTimer !== undefined) {
          window.clearTimeout(trimFallbackTimer);
          trimFallbackTimer = undefined;
        }
        startPlay();
      };

      trimFallbackTimer = window.setTimeout(startOnce, 280);
      v.addEventListener(
        "seeked",
        () => {
          if (trimFallbackTimer !== undefined) {
            window.clearTimeout(trimFallbackTimer);
            trimFallbackTimer = undefined;
          }
          startOnce();
        },
        { once: true },
      );
      v.currentTime = HERO_LOOP_TRIM_SEC;
    };

    const onTime = () => {
      ensureMuted();
      const d = v.duration;
      if (!Number.isFinite(d) || d <= HERO_LOOP_TRIM_SEC * 2 + 0.5) return;
      if (v.currentTime >= d - HERO_LOOP_TRIM_SEC - 0.04) {
        v.currentTime = HERO_LOOP_TRIM_SEC;
        startPlay();
      }
    };

    const onEnded = () => {
      const d = v.duration;
      if (!Number.isFinite(d) || d <= HERO_LOOP_TRIM_SEC * 2 + 0.5) return;
      v.currentTime = HERO_LOOP_TRIM_SEC;
      startPlay();
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    if (v.readyState >= 1) queueMicrotask(onMeta);

    return () => {
      if (trimFallbackTimer !== undefined) window.clearTimeout(trimFallbackTimer);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [prefersReducedMotion]);

  const copy = HERO_COPY[lang] ?? HERO_COPY.en!;
  const digits = phone.replace(/\D/g, "");
  const waHref = digits ? `https://wa.me/${digits}` : "#";

  const ctaBase =
    "inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 sm:px-7 rounded-xl text-[15px] sm:text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(min(108.8svh,100svh)-4rem)] flex-col overflow-hidden sm:min-h-[min(82svh,880px)]"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      {/* ── Media layer ── */}
      <motion.div
        className="absolute inset-0"
        style={enableParallax ? { scale: mediaScale } : undefined}
      >
        {prefersReducedMotion ? (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 top-[-10%] h-[110%]">
              <Image
                src={HERO_POSTER}
                alt={copy.heroImageAlt}
                fill
                priority
                quality={80}
                sizes="100vw"
                className="object-cover object-[center_52%]"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            {/*
              Desktop: ~10% top crop via taller-than-viewport frame.
              Mobile: wider than viewport so object-cover favors a more horizontal slice.
            */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              className="absolute left-1/2 top-0 h-full w-[128%] max-w-none -translate-x-1/2 object-cover object-center sm:inset-x-0 sm:top-[-10%] sm:h-[110%] sm:w-full sm:max-w-full sm:translate-x-0 sm:object-[center_52%]"
              aria-hidden="true"
            >
              <source src={HERO_VIDEO} type="video/webm" />
            </video>
          </div>
        )}
      </motion.div>

      {/* ── Overlays (simplified — image breathes) ── */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        {/* Top gradient: header legibility */}
        <div
          className="absolute inset-x-0 top-0 h-32 sm:h-40"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,13,10,0.55), transparent)",
          }}
        />
        {/* Desktop: subtle vignette for depth */}
        <div
          className="hidden sm:block absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, transparent 0%, rgba(5,4,3,0.22) 100%)",
          }}
        />
      </div>

      {/* ── Film-grain texture ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* ── Spacer: media shows through this transparent area ── */}
      <div className="relative z-10 flex-1" />

      {/* ── Content zone (no scroll opacity — keeps desktop frosted panel stable) ── */}
      <div className="relative z-10 w-full">
        {/* Mobile: long soft blend from hero media into the solid content band */}
        <div
          className="h-44 sm:hidden"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(15,13,10,0.12) 22%, rgba(15,13,10,0.38) 48%, rgba(15,13,10,0.72) 76%, #0f0d0a 100%)",
          }}
        />

        {/* Mobile: solid dark bg. Desktop: transparent (frosted panel handles readability) */}
        <div className="bg-[#0f0d0a] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:bg-transparent sm:pb-[5.5rem] md:pb-24">
          <div className="content-wrapper">
            {/* Desktop: frosted glass panel, start-aligned. Mobile: content flows naturally */}
            <div className="sm:max-w-[36rem] sm:rounded-2xl sm:border sm:border-white/[0.12] sm:bg-black/35 sm:p-8 sm:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] sm:backdrop-blur-[20px] md:max-w-[38rem] md:p-10">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/72 sm:text-xs sm:tracking-[0.34em]">
                {copy.kicker}
              </p>
              <p className="mb-4 max-w-[34rem] text-[13px] font-medium leading-snug text-white/95 sm:mb-5 sm:text-sm sm:leading-relaxed">
                {copy.ribbon}
              </p>

              <h1
                id="hero-heading"
                className="mb-4 font-serif text-balance font-semibold text-white sm:mb-5"
                style={{
                  fontSize: "clamp(1.75rem, 0.9rem + 4.5vw, 3.25rem)",
                  lineHeight: "1.08",
                  letterSpacing: "-0.02em",
                }}
              >
                {copy.headline}
              </h1>

              <ul
                className="mb-5 hidden max-w-[36rem] list-none flex-wrap gap-x-0 gap-y-1.5 ps-0 sm:mb-6 sm:flex"
                aria-label={copy.factsSummary}
              >
                {copy.facts.map((fact, i) => (
                  <li
                    key={fact}
                    className="inline-flex items-center text-[11px] font-semibold leading-snug text-white/[0.92] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] sm:text-xs"
                  >
                    {i > 0 ? <span className="mx-2 text-white/40 select-none" aria-hidden>·</span> : null}
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-7 max-w-[34rem] text-pretty text-[15px] leading-relaxed text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)] sm:mb-8 sm:text-base sm:leading-[1.65] sm:drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)]">
                {copy.subhead}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3.5">
                <Link
                  href={villaPath(pathPrefix, `/${lang}/villas`)}
                  className={`${ctaBase} w-full text-white hover:shadow-[var(--shadow-glow)] hover:brightness-[1.07] sm:w-auto`}
                  style={{ backgroundColor: "var(--accent-500)" }}
                >
                  {copy.cta1}
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ctaBase} w-full border-0 text-white hover:brightness-110 hover:shadow-[0_14px_40px_rgba(37,211,102,0.35)] sm:w-auto`}
                  style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="opacity-95" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {copy.cta2}
                </a>
              </div>

              <div className="mt-6 hidden sm:block">
                <Link
                  href={villaPath(pathPrefix, `/${lang}/location`)}
                  className="text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white/95 hover:underline"
                >
                  {copy.locationLink}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
