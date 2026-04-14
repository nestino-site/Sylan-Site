import type { Metadata } from "next";
import { headers } from "next/headers";

import ContactInquiryForm from "../components/contact-inquiry-form";
import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

type Props = { params: Promise<{ lang: string; siteSlug?: string }>; pathPrefix: string };

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Contact — Silyan Villas",
    description: "Send a stay inquiry or message us on WhatsApp. Direct booking with the hosts in Hisarçandır, Antalya.",
  },
  tr: {
    title: "İletişim — Silyan Villas",
    description: "Konaklama talebi gönderin veya WhatsApp ile yazın. Hisarçandır, Antalya'da doğrudan ev sahipleriyle rezervasyon.",
  },
  ar: {
    title: "اتصل بنا — سيليان فيلاز",
    description: "أرسل استفسار إقامة أو راسلنا عبر واتساب. حجز مباشر مع المضيفين في هيسارتشاندير، أنطاليا.",
  },
  ru: {
    title: "Контакты — Silyan Villas",
    description: "Отправьте запрос на проживание или напишите в WhatsApp. Прямое бронирование с хозяевами в Хисарчандыре, Анталия.",
  },
};

const FORM_LABELS: Record<
  string,
  {
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
  }
> = {
  en: {
    title: "Plan your stay",
    subtitle: "Tell us your dates and villa preference. We reply within a few hours.",
    name: "Name",
    email: "Email",
    phoneLabel: "Phone (optional)",
    villa: "Villa preference",
    villaAny: "Any villa",
    villaBadem: "Villa Badem",
    villaDefne: "Villa Defne",
    villaIncir: "Villa İncir",
    arrival: "Arrival",
    departure: "Departure",
    guests: "Guests",
    message: "Message",
    submit: "Send inquiry",
    trust: "We never share your details. Inquiry only — no payment on this form.",
    waCta: "Prefer WhatsApp?",
    success: "Thank you — we received your inquiry and will reply shortly.",
    error: "Something went wrong. Please try again or use WhatsApp.",
    demoNotice:
      "Online inquiries are paused on this demo (database not connected). Please use WhatsApp or call — we are happy to help.",
  },
  tr: {
    title: "Konaklamanızı planlayın",
    subtitle: "Tarihlerinizi ve villa tercihinizi yazın. Birkaç saat içinde dönüş yapıyoruz.",
    name: "Ad",
    email: "E-posta",
    phoneLabel: "Telefon (isteğe bağlı)",
    villa: "Villa tercihi",
    villaAny: "Fark etmez",
    villaBadem: "Villa Badem",
    villaDefne: "Villa Defne",
    villaIncir: "Villa İncir",
    arrival: "Giriş",
    departure: "Çıkış",
    guests: "Misafir sayısı",
    message: "Mesaj",
    submit: "Talep gönder",
    trust: "Bilgilerinizi paylaşmıyoruz. Sadece talep — bu formda ödeme yok.",
    waCta: "WhatsApp tercih ediyorsanız",
    success: "Teşekkürler — talebinizi aldık, kısa sürede döneceğiz.",
    error: "Bir sorun oluştu. Lütfen tekrar deneyin veya WhatsApp kullanın.",
    demoNotice:
      "Bu demoda çevrimiçi talepler kapalı (veritabanı yok). Lütfen WhatsApp veya telefon ile iletişime geçin.",
  },
  ar: {
    title: "خطط لإقامتك",
    subtitle: "أخبرنا بالتواريخ وتفضيل الفيلا. نرد خلال ساعات قليلة.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phoneLabel: "الهاتف (اختياري)",
    villa: "تفضيل الفيلا",
    villaAny: "أي فيلا",
    villaBadem: "فيلا بادم",
    villaDefne: "فيلا دفنة",
    villaIncir: "فيلا إنجير",
    arrival: "الوصول",
    departure: "المغادرة",
    guests: "الضيوف",
    message: "الرسالة",
    submit: "إرسال الطلب",
    trust: "لا نشارك بياناتك. استفسار فقط — لا دفع في هذا النموذج.",
    waCta: "تفضّل واتساب؟",
    success: "شكرًا — استلمنا طلبك وسنرد قريبًا.",
    error: "حدث خطأ. حاول مرة أخرى أو استخدم واتساب.",
    demoNotice:
      "الطلبات عبر الموقع غير متاحة في هذا العرض (قاعدة البيانات غير متصلة). راسلنا عبر واتساب أو اتصل بنا.",
  },
  ru: {
    title: "Спланируйте отдых",
    subtitle: "Укажите даты и предпочтение по вилле. Отвечаем в течение нескольких часов.",
    name: "Имя",
    email: "Email",
    phoneLabel: "Телефон (необязательно)",
    villa: "Вилла",
    villaAny: "Любая вилла",
    villaBadem: "Villa Badem",
    villaDefne: "Villa Defne",
    villaIncir: "Villa İncir",
    arrival: "Заезд",
    departure: "Выезд",
    guests: "Гости",
    message: "Сообщение",
    submit: "Отправить запрос",
    trust: "Мы не передаём ваши данные. Только запрос — оплаты в форме нет.",
    waCta: "Удобнее WhatsApp?",
    success: "Спасибо — мы получили запрос и скоро ответим.",
    error: "Что-то пошло не так. Попробуйте снова или напишите в WhatsApp.",
    demoNotice:
      "Онлайн-заявки недоступны в этом демо (нет базы данных). Напишите в WhatsApp или позвоните.",
  },
};

async function resolveSiteSlug(params: { lang: string; siteSlug?: string }): Promise<string> {
  if (params.siteSlug) return params.siteSlug;
  const h = await headers();
  return h.get("x-nestino-slug") ?? "";
}

export async function generateContactMetadata({ params, pathPrefix }: Props): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang] ?? META.en!;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const path = villaPath(pathPrefix, `/${lang}/contact`);
  const canonical = `${origin.origin}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: { title: meta.title, description: meta.description, url: canonical, type: "website" },
  };
}

export default async function ContactPage({ params, pathPrefix }: Props) {
  const p = await params;
  const safeLang: Lang = isLang(p.lang) ? p.lang : "en";
  const siteSlug = await resolveSiteSlug(p);
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const phone = ctx?.tenant.ownerPhone ?? "+905316960953";
  const labels = FORM_LABELS[safeLang] ?? FORM_LABELS.en!;

  return (
    <div className="pt-24 pb-16 section-y">
      <div className="content-wrapper max-w-5xl">
        <ContactInquiryForm
          lang={safeLang}
          pathPrefix={pathPrefix}
          phone={phone}
          siteSlug={siteSlug || "silyan"}
          labels={labels}
        />
      </div>
    </div>
  );
}
