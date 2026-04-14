"use client";

import { useState } from "react";
import Image from "next/image";
import type { Lang } from "../lib/i18n";
import { CONTACT_SIDE_IMAGE } from "../lib/silyan-images";
import { WHATSAPP_BRAND_GREEN } from "../lib/whatsapp-brand";

type Props = {
  lang: Lang;
  pathPrefix: string;
  phone: string;
  siteSlug: string;
  labels: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phoneLabel: string;
    villa: string;
    villaAny: string;
    villaBadem: string;
    villaDefne: string;
    villaIncir: string;
    arrival: string;
    departure: string;
    guests: string;
    message: string;
    submit: string;
    trust: string;
    waCta: string;
    success: string;
    error: string;
    demoNotice: string;
  };
};

const inputCls = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200 focus:border-[var(--accent-400)] focus:ring-2 focus:ring-[var(--ring-accent)] focus:outline-none";

export default function ContactInquiryForm({ lang, pathPrefix, phone, siteSlug, labels }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [villa, setVilla] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "demo">("idle");

  const digits = phone.replace(/\D/g, "");
  const waHref = digits ? `https://wa.me/${digits}` : "#";
  const pagePath = `${pathPrefix || ""}/${lang}/contact`.replace(/\/+/g, "/") || `/${lang}/contact`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const villaLine =
      villa === "badem" ? "Villa Badem"
        : villa === "defne" ? "Villa Defne"
          : villa === "incir" ? "Villa İncir"
            : labels.villaAny;
    const composedMessage = [
      `Villa: ${villaLine}`,
      arrival ? `Arrival: ${arrival}` : "",
      departure ? `Departure: ${departure}` : "",
      guests ? `Guests: ${guests}` : "",
      message ? `Note: ${message}` : "",
    ].filter(Boolean).join(" | ");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-nestino-slug": siteSlug },
        body: JSON.stringify({
          language_code: lang,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phoneInput.trim() || undefined,
          message: composedMessage || undefined,
          metadata_json: { page_path: pagePath, villa_preference: villa || undefined },
        }),
      });

      if (res.status === 503) { setStatus("demo"); return; }
      if (!res.ok) { setStatus("error"); return; }
      setStatus("success");
      setName(""); setEmail(""); setPhoneInput(""); setVilla("");
      setArrival(""); setDeparture(""); setGuests(""); setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Side image — hidden on mobile */}
      <div className="hidden lg:block relative aspect-[4/3] rounded-xl overflow-hidden shadow-[var(--shadow-lg)] order-1">
        <Image src={CONTACT_SIDE_IMAGE} alt="" fill className="object-cover" sizes="50vw" />
      </div>

      <div className="order-1 lg:order-2">
        <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-2">{labels.title}</h1>
        <p className="text-base text-[var(--color-text-secondary)] mb-6 leading-relaxed">{labels.subtitle}</p>

        {/* WhatsApp alternative — prominent on mobile */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border border-[#25D366]/35 bg-[rgba(37,211,102,0.09)] mb-6 transition-colors duration-200 hover:border-[#25D366]/55 active:scale-[0.98]"
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full text-white shrink-0"
            style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{labels.waCta}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{phone}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ms-auto text-[var(--color-text-muted)]" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </a>

        {status === "success" && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--accent-400)]/30 bg-[var(--accent-muted)] text-sm text-[var(--color-text-primary)]">
            {labels.success}
          </div>
        )}
        {status === "error" && (
          <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-900">
            {labels.error}
          </div>
        )}
        {status === "demo" && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-secondary)]">
            {labels.demoNotice}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="inq-name" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.name} *</label>
            <input id="inq-name" name="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="inq-email" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.email} *</label>
            <input id="inq-email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="inq-phone" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.phoneLabel}</label>
            <input id="inq-phone" name="phone" type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className={inputCls} autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="inq-villa" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.villa}</label>
            <select id="inq-villa" name="villa" value={villa} onChange={(e) => setVilla(e.target.value)} className={inputCls}>
              <option value="">{labels.villaAny}</option>
              <option value="badem">{labels.villaBadem}</option>
              <option value="defne">{labels.villaDefne}</option>
              <option value="incir">{labels.villaIncir}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inq-arrival" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.arrival}</label>
              <input id="inq-arrival" name="arrival" type="date" value={arrival} onChange={(e) => setArrival(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="inq-departure" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.departure}</label>
              <input id="inq-departure" name="departure" type="date" value={departure} onChange={(e) => setDeparture(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label htmlFor="inq-guests" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.guests}</label>
            <input id="inq-guests" name="guests" type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className={inputCls} inputMode="numeric" />
          </div>
          <div>
            <label htmlFor="inq-message" className="block text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5">{labels.message}</label>
            <textarea id="inq-message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={inputCls} />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-medium text-white disabled:opacity-60 transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.97]"
            style={{ backgroundColor: "var(--accent-500)" }}
          >
            {status === "loading" ? "..." : labels.submit}
          </button>
        </form>

        <p className="mt-4 text-xs text-[var(--color-text-muted)] leading-relaxed">{labels.trust}</p>
      </div>
    </div>
  );
}
