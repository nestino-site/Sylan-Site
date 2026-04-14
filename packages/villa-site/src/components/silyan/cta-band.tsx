"use client";

import Link from "next/link";
import type { Lang } from "../../lib/i18n";
import { villaPath } from "../../lib/villa-path";
import { WHATSAPP_BRAND_GREEN } from "../../lib/whatsapp-brand";
import AnimateOnScroll from "../animate-on-scroll";

type Props = { lang: Lang; phone: string; pathPrefix?: string };

const COPY: Record<string, { headline: string; body: string; cta1: string; cta2: string }> = {
  en: {
    headline: "Ready to book your stay?",
    body: "Send us a message on WhatsApp or fill in the inquiry form — we reply within a few hours.",
    cta1: "Send WhatsApp message",
    cta2: "Fill inquiry form",
  },
  tr: {
    headline: "Rezervasyonunuzu yapmaya hazır mısınız?",
    body: "WhatsApp'tan mesaj gönderin ya da rezervasyon formunu doldurun — birkaç saat içinde yanıt veriyoruz.",
    cta1: "WhatsApp mesajı gönder",
    cta2: "Rezervasyon formu",
  },
  ar: {
    headline: "هل أنت مستعد لحجز إقامتك؟",
    body: "أرسل لنا رسالة عبر واتساب أو املأ نموذج الاستفسار — نرد خلال ساعات قليلة.",
    cta1: "أرسل رسالة واتساب",
    cta2: "نموذج الاستفسار",
  },
  ru: {
    headline: "Готовы забронировать отдых?",
    body: "Напишите нам в WhatsApp или заполните форму запроса — мы ответим в течение нескольких часов.",
    cta1: "Написать в WhatsApp",
    cta2: "Заполнить форму",
  },
};

export default function CtaBand({ lang, phone, pathPrefix = "" }: Props) {
  const c = COPY[lang] ?? COPY.en!;
  const digits = phone.replace(/\D/g, "");
  const waHref = digits ? `https://wa.me/${digits}` : "#";

  return (
    <section className="relative overflow-hidden content-lazy" aria-labelledby="cta-band-heading">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, var(--accent-muted) 0%, var(--color-bg) 50%, var(--accent-muted) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative section-y">
        <div className="content-wrapper text-center">
          {/* Decorative gold line */}
          <div
            className="mx-auto mb-6"
            style={{ width: "40px", height: "1.5px", backgroundColor: "var(--gold-accent)", opacity: 0.5 }}
            aria-hidden="true"
          />

          <AnimateOnScroll variant="fade-up">
            <h2
              id="cta-band-heading"
              className="font-serif font-semibold text-[var(--color-text-primary)] mb-3"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: "1.15" }}
            >
              {c.headline}
            </h2>
            <p className="text-base text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto leading-relaxed">
              {c.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* WhatsApp first on mobile */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium text-white transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.97] w-full sm:w-auto"
                style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {c.cta1}
              </a>
              <Link
                href={villaPath(pathPrefix, `/${lang}/contact`)}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-medium border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--accent-500)] hover:text-[var(--accent-500)] transition-all duration-300 bg-[var(--color-surface)] active:scale-[0.97] w-full sm:w-auto"
              >
                {c.cta2}
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Decorative gold line */}
          <div
            className="mx-auto mt-6"
            style={{ width: "40px", height: "1.5px", backgroundColor: "var(--gold-accent)", opacity: 0.5 }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
