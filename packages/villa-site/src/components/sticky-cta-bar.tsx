"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang } from "../lib/i18n";
import { WHATSAPP_BRAND_GREEN } from "../lib/whatsapp-brand";

type Props = {
  phone: string;
  lang: Lang;
  /** Property / brand name inserted into the prefilled WhatsApp message */
  siteName: string;
};

const CTA_LABELS: Partial<Record<string, { cta: string }>> = {
  en: { cta: "Check availability" },
  tr: { cta: "Müsaitliği kontrol et" },
  ar: { cta: "تحقق من التوفر" },
  ru: { cta: "Проверить наличие" },
  de: { cta: "Verfügbarkeit prüfen" },
  fr: { cta: "Vérifier les disponibilités" },
  es: { cta: "Consultar disponibilidad" },
  it: { cta: "Verifica disponibilità" },
  nl: { cta: "Beschikbaarheid controleren" },
  pt: { cta: "Verificar disponibilidade" },
  ja: { cta: "空室状況を確認" },
  ko: { cta: "예약 가능 여부 문의" },
  "zh-Hans": { cta: "查询可订日期" },
};

/** Pre-filled WhatsApp text per language; `n` = property / site name. */
function prefillMessage(lang: Lang, siteName: string): string {
  const n = siteName.trim() || "Villa";
  const en = `Hello — I'd like to check availability and rates at ${n}. Could you please advise?`;
  const messages: Partial<Record<Lang, string>> = {
    en,
    tr: `Merhaba — ${n} için müsaitlik ve fiyat bilgisi almak istiyorum. Yardımcı olabilir misiniz?`,
    ar: `مرحباً — أود الاستفسار عن التوفر والأسعار في ${n}. هل يمكنكم مساعدتي؟`,
    ru: `Здравствуйте — хочу уточнить наличие и стоимость проживания в ${n}. Подскажите, пожалуйста?`,
    de: `Hallo — ich möchte Verfügbarkeit und Preise bei ${n} erfragen. Können Sie mir bitte helfen?`,
    fr: `Bonjour — je souhaite connaître les disponibilités et les tarifs pour ${n}. Pourriez-vous m’aider ?`,
    es: `Hola — me gustaría consultar disponibilidad y tarifas en ${n}. ¿Podrían ayudarme?`,
    it: `Salve — vorrei informazioni su disponibilità e tariffe per ${n}. Potete aiutarmi?`,
    nl: `Hallo — ik wil graag de beschikbaarheid en prijzen van ${n} weten. Kunt u me helpen?`,
    pt: `Olá — gostaria de saber disponibilidade e preços em ${n}. Podem ajudar-me?`,
    ja: `こんにちは。${n}の空室状況と料金について教えてください。`,
    ko: `안녕하세요. ${n} 예약 가능 여부와 요금을 문의드립니다.`,
    "zh-Hans": `您好，我想咨询 ${n} 的空房和价格，请协助，谢谢。`,
  };
  return messages[lang] ?? en;
}

function whatsappHref(phoneDigits: string, message: string): string {
  if (!phoneDigits) return "#";
  const text = encodeURIComponent(message);
  return `https://wa.me/${phoneDigits}?text=${text}`;
}

const SCROLL_REVEAL_PX = 300;

export default function StickyCtaBar({ phone, lang, siteName }: Props) {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > SCROLL_REVEAL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.getElementById("site-footer");
    if (!footer) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setFooterInView(entry?.isIntersecting ?? false);
      },
      { root: null, threshold: 0, rootMargin: "0px" },
    );
    io.observe(footer);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const visible = scrolledEnough && !footerInView;

  const labels = CTA_LABELS[lang] ?? CTA_LABELS.en!;
  const digits = phone.replace(/\D/g, "");
  const prefill = useMemo(() => prefillMessage(lang, siteName), [lang, siteName]);
  const href = useMemo(() => whatsappHref(digits, prefill), [digits, prefill]);

  const onCtaClick = () => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).posthog) {
      (window as unknown as { posthog: { capture: (e: string, p?: Record<string, string>) => void } }).posthog.capture(
        "whatsapp_click",
        { source: "sticky_cta_availability", lang },
      );
    }
  };

  return (
    <div
      style={{
        zIndex: "var(--z-sticky-cta)",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      className="fixed inset-x-0 bottom-0 bg-[var(--color-surface)]/90 backdrop-blur-xl border-t border-[var(--color-border)] shadow-[var(--shadow-lg)] px-4 py-3 md:hidden transition-transform duration-400 ease-smooth"
      aria-label="Quick actions"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCtaClick}
        className="flex w-full max-w-md mx-auto items-center justify-center gap-2.5 rounded-xl py-3.5 px-5 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] hover:brightness-110 hover:shadow-[var(--shadow-glow)]"
        style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="shrink-0 opacity-95" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {labels.cta}
      </a>
    </div>
  );
}
