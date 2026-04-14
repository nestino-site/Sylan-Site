import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";
import { HERO_POSTER, SITE_LOGO } from "../lib/silyan-images";
import { buildSilyanFaqPageJsonLdEntities } from "../lib/silyan-faq-data";

import Hero from "../components/silyan/hero";
import StatBar from "../components/silyan/stat-bar";
import TheStay from "../components/silyan/the-stay";
import VillaCards from "../components/silyan/villa-cards";
import LocationTeaser from "../components/silyan/location-teaser";
import PricingOverview from "../components/silyan/pricing-overview";
import Reviews from "../components/silyan/reviews";
import FAQ from "../components/silyan/faq";
import CtaBand from "../components/silyan/cta-band";

type HomeParams = { lang: string; siteSlug?: string };

type HomeProps = {
  params: Promise<HomeParams>;
  pathPrefix: string;
};

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  tr: "tr_TR",
  ar: "ar_SA",
  ru: "ru_RU",
};

const META: Record<string, { title: string; description: string; openGraphTitle: string }> = {
  en: {
    title: "Nature villas with private pools — Hisarçandır above Antalya",
    openGraphTitle: "Silyan Villas — Pine hills, private pools, 11 villas near Antalya",
    description:
      "Eleven architect-designed private pool villas in pine-clad hills above Konyaaltı, Hisarçandır — a calm nature retreat away from city noise, 8 km to the Mediterranean, 22 km to Antalya Airport (AYT). 4–10 guests per villa. Family-run; book by inquiry or WhatsApp.",
  },
  tr: {
    title: "Doğa içinde özel havuzlu villalar — Antalya üzerinde Hisarçandır",
    openGraphTitle: "Silyan Villas — Çam ormanı, özel havuz, Antalya yakınında 11 villa",
    description:
      "Hisarçandır'da Konyaaltı tepelerinde mimarlığı özenle işlenmiş on bir özel havuzlu tatil villası — şehir gürültüsünden uzak doğa kaçamağı; denize 8 km, AYT'ye 22 km. Villada 4–10 kişi. Aile işletmesi; talep veya WhatsApp.",
  },
  ar: {
    title: "فيلات طبيعة بمسابح خاصة — هيسارتشاندير فوق أنطاليا",
    openGraphTitle: "سيليان فيلاز — غابة صنوبر، مسابح خاصة، 11 فيلا قرب أنطاليا",
    description:
      "أحد عشر فيلا عطلات بمسابح خاصة على تلال الصنوبر فوق كونيالتي في هيسارتشاندير — ملاذ هادئ في الطبيعة بعيدًا عن ضجيج المدينة، 8 كم للبحر و22 كم لمطار أنطاليا. 4–10 ضيوف لكل فيلا. تشغيل عائلي؛ احجز بالطلب أو واتساب.",
  },
  ru: {
    title: "Виллы в природе с частными бассейнами — Хисарчандыре над Анталией",
    openGraphTitle: "Silyan Villas — Сосны, частные бассейны, 11 вилл у Анталии",
    description:
      "Одиннадцать продуманных архитекторами вилл с частными бассейнами на сосновых склонах над Конъяалты в Хисарчандыре — спокойный отдых вдали от городского шума, 8 км до моря, 22 км до аэропорта AYT. 4–10 гостей на виллу. Семейное управление; бронирование по запросу или в WhatsApp.",
  },
};

export async function generateVillaHomeMetadata({
  params,
  pathPrefix,
}: HomeProps): Promise<Metadata> {
  const { lang, siteSlug: slugFromParams } = await params;
  const meta = META[lang] ?? META.en!;

  const h = await headers();
  const host = h.get("host");
  const origin = resolveRequestOrigin(host);
  const pagePath = villaPath(pathPrefix, `/${lang}`);
  const canonical = `${origin.origin}${pagePath}`;

  const siteSlug = slugFromParams ?? h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const activeLangs = ctx ? getActiveLangs(ctx) : ["en"];
  const languages: Record<string, string> = Object.fromEntries(
    activeLangs.map((l) => [l, `${origin.origin}${villaPath(pathPrefix, `/${l}`)}`])
  );
  const defaultLang = ctx?.site.defaultLanguage ?? "en";
  if (activeLangs.includes(defaultLang)) {
    languages["x-default"] = `${origin.origin}${villaPath(pathPrefix, `/${defaultLang}`)}`;
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      title: meta.openGraphTitle,
      description: meta.description,
      url: canonical,
      type: "website",
      siteName: "Silyan Villas",
      locale: OG_LOCALE[lang] ?? "en_US",
      images: [
        {
          url: HERO_POSTER,
          width: 1200,
          height: 630,
          alt: "Silyan Villas — private pool villas in pine hills, Hisarçandır near Antalya, Turkey",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.openGraphTitle,
      description: meta.description,
      images: [HERO_POSTER],
    },
  };
}

function buildJsonLd(hostHeader: string | null, lang: string, pathPrefix: string) {
  const origin = resolveRequestOrigin(hostHeader);
  const base = `${origin.origin}${pathPrefix}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "@id": `${base}/${lang}/#lodging`,
      name: "Silyan Villas",
      url: `${base}/${lang}/`,
      description:
        "Eleven independent private-pool villas in pine-clad hills above Konyaaltı, Hisarçandır, Antalya — nature-led retreat 8 km from the Mediterranean, modern comfortable homes designed with architects.",
      telephone: "+905316960953",
      email: "info@silyanvillas.com",
      sameAs: ["https://www.instagram.com/silyanvillalari/"],
      image: HERO_POSTER,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hisarçandır Mah. Çandır Cad. No:182",
        addressLocality: "Konyaaltı",
        addressRegion: "Antalya",
        postalCode: "07070",
        addressCountry: "TR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 36.823,
        longitude: 30.5378,
      },
      numberOfAccommodationUnits: 11,
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Private Pool", value: true },
        { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Private Parking", value: true },
        { "@type": "LocationFeatureSpecification", name: "Mountain View", value: true },
      ],
      inLanguage: lang,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Silyan Villas",
      url: `${base}/${lang}/`,
      inLanguage: lang,
      publisher: {
        "@type": "Organization",
        name: "Silyan Villas",
        logo: { "@type": "ImageObject", url: SITE_LOGO },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: buildSilyanFaqPageJsonLdEntities(lang),
    },
  ];
}

export default async function VillaHomePage({ params, pathPrefix }: HomeProps) {
  const { lang } = await params;
  const safeLang: Lang = isLang(lang) ? lang : "en";

  const h = await headers();
  const slug = h.get("x-nestino-slug") ?? "";

  const ctx = slug ? await getSiteBySubdomain(slug) : null;
  const phone = ctx?.tenant.ownerPhone ?? "+905316960953";

  const jsonLd = buildJsonLd(h.get("host"), safeLang, pathPrefix);

  return (
    <>
      <Script
        id="jsonld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero lang={safeLang} phone={phone} pathPrefix={pathPrefix} />
      <StatBar lang={safeLang} />
      <TheStay lang={safeLang} />
      <VillaCards lang={safeLang} pathPrefix={pathPrefix} />
      <LocationTeaser lang={safeLang} pathPrefix={pathPrefix} />
      <PricingOverview lang={safeLang} pathPrefix={pathPrefix} />
      <Reviews lang={safeLang} />
      <FAQ lang={safeLang} />
      <CtaBand lang={safeLang} phone={phone} pathPrefix={pathPrefix} />
    </>
  );
}
