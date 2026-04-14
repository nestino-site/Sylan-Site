import type { Metadata } from "next";
import { headers } from "next/headers";

import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { villaPath } from "../lib/villa-path";

type Props = { params: Promise<{ lang: string; siteSlug?: string }>; pathPrefix: string };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Privacy — Silyan Villas", description: "How we handle personal data when you use this property site and contact us." },
  tr: { title: "Gizlilik — Silyan Villas", description: "Bu mülk sitesini kullandığınızda ve bizimle iletişime geçtiğinizde kişisel verilerin işlenmesi." },
  ar: { title: "الخصوصية — سيليان فيلاز", description: "كيف نتعامل مع البيانات الشخصية." },
  ru: { title: "Конфиденциальность — Silyan Villas", description: "Как мы обрабатываем персональные данные." },
};

const COPY: Record<string, { h1: string; intro: string; sections: { h: string; p: string }[] }> = {
  en: {
    h1: "Privacy policy",
    intro:
      "This page describes how Silyan Villas and Nestino process information when you browse this website, use our inquiry form, or message us on WhatsApp. For the full Nestino platform policy, see nestino.ai.",
    sections: [
      {
        h: "What we collect",
        p: "When you submit an inquiry, we store the details you provide (name, email, phone if given, travel dates, message) so we can respond. Technical logs (IP, user agent) may be retained for security and rate limiting.",
      },
      {
        h: "How we use it",
        p: "We use your data only to handle your booking request, improve our service, and meet legal obligations. We do not sell your personal information.",
      },
      {
        h: "Third parties",
        p: "We may use trusted providers (e.g. email delivery, analytics) under strict agreements. WhatsApp is operated by Meta; their terms apply when you use that channel.",
      },
      {
        h: "Your rights",
        p: "Depending on your jurisdiction, you may have rights to access, correct, or delete your data. Contact us using the details on the Contact page.",
      },
    ],
  },
  tr: {
    h1: "Gizlilik politikası",
    intro:
      "Bu sayfa, bu web sitesini gezdiğinizde, rezervasyon formunu kullandığınızda veya WhatsApp üzerinden yazdığınızda bilgilerinizin nasıl işlendiğini açıklar.",
    sections: [
      { h: "Toplanan veriler", p: "Rezervasyon talebi gönderdiğinizde sağladığınız bilgileri saklarız. Güvenlik için teknik günlükler tutulabilir." },
      { h: "Kullanım amacı", p: "Verilerinizi yalnızca talebinize yanıt vermek ve yasal yükümlülükleri yerine getirmek için kullanırız. Kişisel verilerinizi satmayız." },
      { h: "Üçüncü taraflar", p: "E-posta veya analitik gibi hizmetler güvenilir sağlayıcılar aracılığıyla sunulabilir. WhatsApp Meta tarafından işletilir." },
      { h: "Haklarınız", p: "Yürürlükteki mevzuata göre erişim, düzeltme veya silme talep edebilirsiniz. İletişim sayfasındaki bilgilerden bize ulaşın." },
    ],
  },
  ar: {
    h1: "سياسة الخصوصية",
    intro: "توضح هذه الصفحة كيفية معالجة المعلومات عند تصفحك الموقع أو إرسال استفسار أو مراسلتنا عبر واتساب.",
    sections: [
      { h: "ما نجمعه", p: "عند إرسال استفسار نخزن البيانات التي تقدمها للرد. قد تُحتفظ سجلات تقنية لأغراض الأمان." },
      { h: "كيف نستخدمها", p: "نستخدم بياناتك فقط للرد على طلبك والالتزام القانوني. لا نبيع معلوماتك الشخصية." },
      { h: "أطراف ثالثة", p: "قد نستخدم مزودي خدمات موثوقين. واتساب تديره ميتا." },
      { h: "حقوقك", p: "قد يحق لك الوصول أو التصحيح أو الحذف حسب القانون. تواصل عبر صفحة الاتصال." },
    ],
  },
  ru: {
    h1: "Политика конфиденциальности",
    intro: "Здесь описано, как обрабатываются данные при использовании сайта, формы запроса и WhatsApp.",
    sections: [
      { h: "Что собираем", p: "При отправке запроса сохраняем указанные вами данные для ответа. Технические логи — для безопасности." },
      { h: "Как используем", p: "Только для обработки запроса и по закону. Не продаём персональные данные." },
      { h: "Третьи стороны", p: "Надёжные поставщики (почта, аналитика). WhatsApp — сервис Meta." },
      { h: "Ваши права", p: "В зависимости от региона — доступ, исправление, удаление. Свяжитесь через страницу Контакты." },
    ],
  },
};

export async function generatePrivacyMetadata({ params, pathPrefix }: Props): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang] ?? META.en!;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const path = villaPath(pathPrefix, `/${lang}/privacy`);
  const canonical = `${origin.origin}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: meta.title, description: meta.description, url: canonical, type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params, pathPrefix }: Props) {
  const { lang } = await params;
  const safeLang: Lang = isLang(lang) ? lang : "en";
  const c = COPY[safeLang] ?? COPY.en!;

  return (
    <div className="pt-24 pb-16 section-y">
      <div className="content-wrapper max-w-3xl">
        <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-6">{c.h1}</h1>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-10">{c.intro}</p>
        <div className="space-y-8">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-3">{s.h}</h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-[var(--color-text-muted)]">
          {safeLang === "tr" ? (
            <>
              Nestino platform politikası için{" "}
              <a href="https://nestino.ai" className="underline hover:text-[var(--accent-500)]">
                nestino.ai
              </a>
              .
            </>
          ) : safeLang === "ar" ? (
            <>
              سياسة منصة Nestino:{" "}
              <a href="https://nestino.ai" className="underline hover:text-[var(--accent-500)]">
                nestino.ai
              </a>
            </>
          ) : safeLang === "ru" ? (
            <>
              Политика платформы Nestino:{" "}
              <a href="https://nestino.ai" className="underline hover:text-[var(--accent-500)]">
                nestino.ai
              </a>
            </>
          ) : (
            <>
              Full Nestino platform policy:{" "}
              <a href="https://nestino.ai" className="underline hover:text-[var(--accent-500)]">
                nestino.ai
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
