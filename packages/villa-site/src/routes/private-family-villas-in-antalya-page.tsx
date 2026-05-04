import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { isLang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "private-family-villas-in-antalya";
const PILLAR_SLUG = "villas-in-antalya-with-private-pool";
const HERO_IMAGE = "/silyan-family/antalya-villa-family-pool-dining.png";
const DIRECT_BOOKING_URL = "https://villasilyan.com/all-villas";

type LangCopy = {
  meta: {
    title: string;
    description: string;
    heroAlt: string;
    jsonLdHeadline: string;
  };
  eyebrow: string;
  checkAvailability: string;
  checkAvailabilityCta: string;
  h1: string;
  subtitle: string;
  figcaption: string;
  heroStats: [string, string][];
  whyTitle: string;
  whyBody1: string;
  whyLinkText: string;
  whyBody2: string;
  childSafeTitle: string;
  childSafeBody1: string;
  childSafeBody2: string;
  kitchenTitle: string;
  kitchenBody1: string;
  kitchenBody2: string;
  privacyTitle: string;
  privacyBody: string;
  indoorOutdoorTitle: string;
  indoorOutdoorBody: string;
  indoorLabel: string;
  indoorText: string;
  outdoorLabel: string;
  outdoorText: string;
  comparisonTitle: string;
  compAspect: string;
  comp5Star: string;
  compRows: [string, string, string][];
  localTipsTitle: string;
  localTipsIntro: string;
  localTips: { label: string; text: string }[];
  drivingTitle: string;
  drivingBody1: string;
  drivingBody2: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  peaceEyebrow: string;
  peaceTitle: string;
  peaceItems: string[];
  quickFactsTitle: string;
  quickFacts: { label: string; value: string }[];
};

const COPY: Record<string, LangCopy> = {
  en: {
    meta: {
      title: "Best Private Family Villas in Antalya | Safe & Secluded | Villa Silyan",
      description:
        "Book the perfect family retreat in Antalya. Discover spacious villas with gated pools, child-safe amenities, and 24/7 security. Direct booking for best rates.",
      heroAlt: "Private luxury family villa in Antalya with secure gated pool and outdoor dining.",
      jsonLdHeadline: "Best Private Family Villas in Antalya",
    },
    eyebrow: "Private family villas in Antalya",
    checkAvailability: "Check Family Villa Availability",
    checkAvailabilityCta: "Check Family Villa Availability - Summer 2026",
    h1: "Explore Private Family Villas in Antalya: Safe, Spacious, and Fully Equipped",
    subtitle:
      "Planning a family getaway means balancing privacy, comfort, location, and the small safety details that help parents truly relax. Villa Silyan offers private family villas in Antalya with secure pool areas, generous indoor-outdoor space, and the freedom to keep your family\u2019s routine intact.",
    figcaption: "A private pool, shaded outdoor dining, and room for children to enjoy the day safely.",
    heroStats: [
      ["Best for", "Families seeking privacy, pool time, and hotel-level comfort"],
      ["Nearby beaches", "Lara Beach 15-20 mins, Konyaalt\u0131 Beach about 20 mins"],
      ["Booking route", "Direct booking for best rates and availability"],
    ],
    whyTitle: "Why Choose Villa Silyan for Your Family Retreat?",
    whyBody1:
      "Choosing a villa instead of a hotel gives families a calmer, more flexible base. You avoid crowded lobbies, shared pool schedules, and the pressure to shape each day around hotel services. At Villa Silyan, your family has a secluded setting with space to swim, nap, cook, dine, and unwind privately.",
    whyLinkText: "villas in Antalya with private pool",
    whyBody2:
      "explains how private pool villas compare with hotel stays across privacy, location, and guest experience.",
    childSafeTitle: "Child-Safe Spaces: Peace of Mind for Parents",
    childSafeBody1:
      "Safety is central to a successful family holiday. Villa Silyan\u2019s private villa setting is designed around secure outdoor living, with gated pool access, private gardens, and a gated community entrance that helps parents relax without constantly negotiating shared hotel spaces.",
    childSafeBody2:
      "Children can enjoy the garden and terrace while adults stay close by, making the villa feel like a private family home rather than a busy resort.",
    kitchenTitle: "Fully Equipped Kitchens: Cook with Ease and Comfort",
    kitchenBody1:
      "Each villa includes a fully equipped kitchen with modern appliances, practical utensils, and generous preparation space for breakfasts, snacks, and family dinners.",
    kitchenBody2:
      "Avoid the stress of hotel buffet queues and restrictive meal times. At Villa Silyan, you can maintain your family\u2019s routine, preparing healthy meals for picky eaters or infants in your own gourmet kitchen.",
    privacyTitle: "Gated Privacy: Your Own Secluded Paradise",
    privacyBody:
      "Villa Silyan prioritizes privacy with gated properties and calm outdoor spaces. Your family can swim, dine outside, or enjoy a quiet evening without the interruptions that come with shared hotel pools, corridors, and public lounges.",
    indoorOutdoorTitle: "Spacious Indoor-Outdoor Living Areas for Family Fun",
    indoorOutdoorBody:
      "The villas blend comfortable interiors with terraces, gardens, and alfresco dining areas. Children have space to play, adults have room to gather, and the whole family can move naturally between indoor comfort and outdoor Mediterranean living.",
    indoorLabel: "Indoor",
    indoorText: "spacious living rooms with comfortable seating for slow mornings and family movie nights.",
    outdoorLabel: "Outdoor",
    outdoorText: "private gardens, terraces, and dining areas for safe play and relaxed meals.",
    comparisonTitle: "Villa Silyan vs Antalya 5-Star Hotels",
    compAspect: "Aspect",
    comp5Star: "5-Star Hotel",
    compRows: [
      ["Privacy", "Exclusive", "Shared"],
      ["Space", "Ample indoor and outdoor areas", "Limited to rooms and shared facilities"],
      ["Kitchen", "Full gourmet kitchen", "Minimal or unavailable"],
      ["Family routine", "Flexible meals, naps, and pool time", "Often shaped by hotel schedules"],
    ],
    localTipsTitle: "Local Tips: Exploring Antalya with Your Family",
    localTipsIntro:
      "Antalya is rich with family-friendly activities, from the historic streets of Kaleici to the natural beauty of Duden Waterfalls. Plan active outings early in the day, then return to your private pool for cooler afternoon downtime.",
    localTips: [
      { label: "Kaleici", text: "wander the old town streets early in the morning to avoid crowds." },
      { label: "Duden Waterfalls", text: "about a 20-minute drive, ideal for photos and a relaxed family stop." },
      { label: "Antalya Aquarium", text: "around 15 minutes by car and a strong rainy day option for children." },
    ],
    drivingTitle: "Driving Distances: Antalya Beaches That Work for Families",
    drivingBody1:
      "Villa Silyan\u2019s Antalya location makes the city\u2019s best family beach days easy to plan. Lara Beach is usually 15-20 minutes away, while Konyaalti Beach is about 20 minutes by car, depending on traffic and season.",
    drivingBody2:
      "Kaputas Beach should be treated as an exotic full-day road trip rather than a quick beach stop. From Antalya City, the journey is closer to three hours each way, so it is best reserved for families who want a scenic coastal drive and a full day out.",
    ctaEyebrow: "Summer 2026 family stays",
    ctaTitle: "Secure your private Antalya family retreat",
    ctaBody:
      "Experience luxury, privacy, and family-friendly amenities at Villa Silyan. Book directly for the clearest availability and best direct rates.",
    peaceEyebrow: "Parent\u2019s Peace of Mind",
    peaceTitle: "Family safety essentials, already considered",
    peaceItems: [
      "Gated and secure pool access",
      "Child-friendly interior design with no sharp corners or fragile decor",
      "Baby cots and high chairs available upon request",
      "24/7 security and gated community entrance",
      "Private garden for safe outdoor play",
    ],
    quickFactsTitle: "Quick Facts",
    quickFacts: [
      { label: "Primary beaches", value: "Lara Beach and Konyaalti Beach" },
      { label: "Best for", value: "Families who want privacy, space, and secure pool time" },
      { label: "Full-day idea", value: "Kaputas Beach as a scenic road trip" },
    ],
  },

  tr: {
    meta: {
      title: "Antalya\u2019da En \u0130yi \u00d6zel Aile Villalar\u0131 | G\u00fcvenli & Sessiz | Villa Silyan",
      description:
        "Antalya\u2019da m\u00fckemmel aile tatilini planlay\u0131n. Kilitli havuzlu, \u00e7ocuk dostu olanakl\u0131 ve 7/24 g\u00fcvenlikli geni\u015f villalar\u0131 ke\u015ffedin. En iyi fiyatlar i\u00e7in do\u011frudan rezervasyon yap\u0131n.",
      heroAlt:
        "Antalya\u2019da kilitli havuzlu ve a\u00e7\u0131k hava yemek alanlı \u00f6zel l\u00fcks aile villas\u0131.",
      jsonLdHeadline: "Antalya\u2019da En \u0130yi \u00d6zel Aile Villalar\u0131",
    },
    eyebrow: "Antalya\u2019da \u00f6zel aile villalar\u0131",
    checkAvailability: "Aile Villas\u0131 M\u00fcs\u00e4itli\u011fini Kontrol Et",
    checkAvailabilityCta: "Aile Villas\u0131 M\u00fcs\u00e4itli\u011fini Kontrol Et \u2013 Yaz 2026",
    h1: "Antalya\u2019da \u00d6zel Aile Villalar\u0131n\u0131 Ke\u015ffedin: G\u00fcvenli, Geni\u015f ve Tam Donan\u0131ml\u0131",
    subtitle:
      "Bir aile tatili planlamak gizlilik, konfor, konum ve ebeveynlerin ger\u00e7ekten rahatlayas\u0131n\u0131 sa\u011flayan k\u00fc\u00e7\u00fck g\u00fcvenlik detaylar\u0131n\u0131 dengelemeyi gerektirir. Villa Silyan, Antalya\u2019da g\u00fcvenli havuz alanlar\u0131, geni\u015f i\u00e7 ve d\u0131\u015f mekan alanlar\u0131 ve ailenizin rutinini s\u00fcrd\u00fcrme \u00f6zg\u00fcrl\u00fc\u011f\u00fc ile \u00f6zel aile villalar\u0131 sunar.",
    figcaption:
      "\u00d6zel havuz, g\u00f6lgeli a\u00e7\u0131k hava yemek alan\u0131 ve \u00e7ocuklar\u0131n g\u00fcnlerini g\u00fcvenle ge\u00e7irebilecekleri alan.",
    heroStats: [
      ["En uygun", "Gizlilik, havuz vakti ve otel d\u00fczeyinde konfor isteyen aileler"],
      ["Yak\u0131n plajlar", "Lara Plaj\u0131 15-20 dk, Konyaalt\u0131 Plaj\u0131 yakla\u015f\u0131k 20 dk"],
      ["Rezervasyon yolu", "En iyi fiyat ve m\u00fcs\u00e4itlik i\u00e7in do\u011frudan rezervasyon"],
    ],
    whyTitle: "Aile Tatili \u0130\u00e7in Neden Villa Silyan?",
    whyBody1:
      "Otel yerine villa se\u00e7mek ailelere daha sakin ve esnek bir \u00fcss\u00fc sunar. Kalabal\u0131k lobiler, ortak havuz programlar\u0131 ve her g\u00fcn\u00fcn\u00fcz\u00fc otel hizmetlerine g\u00f6re d\u00fczenlemek zorunda kalmaktan kurtulurusunuz. Villa Silyan\u2019da aileniz, y\u00fczmek, uyuklamak, yemek pi\u015firmek ve dinlenmek i\u00e7in gizli bir ortamda \u00f6zel alan\u0131na sahip olur.",
    whyLinkText: "Antalya\u2019da \u00f6zel havuzlu villalar",
    whyBody2:
      "ana rehberimiz, \u00f6zel havuzlu villalar\u0131n otel konaklamalar\u0131yla gizlilik, konum ve misafir deneyimi a\u00e7\u0131s\u0131ndan nas\u0131l kar\u015f\u0131la\u015ft\u0131\u011f\u0131n\u0131 a\u00e7\u0131klamaktad\u0131r.",
    childSafeTitle: "\u00c7ocuk G\u00fcvenli\u011fi: Ebeveynler \u0130\u00e7in Huzur",
    childSafeBody1:
      "G\u00fcvenlik, ba\u015far\u0131l\u0131 bir aile tatilinin merkezindedir. Villa Silyan\u2019\u0131n \u00f6zel villa ortam\u0131, kilitli havuz giri\u015fi, \u00f6zel bah\u00e7eler ve kap\u0131l\u0131 site giri\u015fi ile g\u00fcvenli d\u0131\u015f mekan ya\u015fam\u0131 etraf\u0131nda tasarlanm\u0131\u015ft\u0131r; bu da ebeveynlerin ortak otel alanlar\u0131nda s\u00fcrekli \u00f6nlem almak zorunda kalmadan rahatlamalar\u0131n\u0131 sa\u011flar.",
    childSafeBody2:
      "\u00c7ocuklar bah\u00e7e ve terastan yararlan\u0131rken yeti\u015fkinler yak\u0131nda bulunabilir; bu da villayı kalabal\u0131k bir tatil k\u00f6y\u00fc yerine \u00f6zel bir aile yuvası gibi hissettirir.",
    kitchenTitle: "Tam Donan\u0131ml\u0131 Mutfaklar: Kolayl\u0131kla P\u0131\u015firme",
    kitchenBody1:
      "Her villa, sabah kahvalt\u0131lar\u0131, atl\u0131\u015ftirmal\u0131klar ve aile yemekleri i\u00e7in modern cihazlar, pratik mutfak ger\u00e7ekleri ve geni\u015f haz\u0131rl\u0131k alan\u0131yla tam donan\u0131ml\u0131 bir mutfa\u011fa sahiptir.",
    kitchenBody2:
      "Otel b\u00fcfe kuyruklar\u0131n\u0131n ve k\u0131s\u0131tlay\u0131c\u0131 yemek saatlerinin stresinden uzak kal\u0131n. Villa Silyan\u2019da kendi gurme mutfa\u011f\u0131n\u0131zda se\u00e7ici yiyenlere ya da bebeklere sa\u011fl\u0131kl\u0131 \u00f6\u011f\u00fcnler haz\u0131rlayarak ailenizin rutinini koruyabilirsiniz.",
    privacyTitle: "Kap\u0131l\u0131 Gizlilik: Kendi Sakin Cennetiniz",
    privacyBody:
      "Villa Silyan, kap\u0131l\u0131 m\u00fclkler ve sakin d\u0131\u015f mekanlarla gizlili\u011fe \u00f6nem verir. Aileniz, ortak otel havuzlar\u0131, koridorlar ve ortak salonlardan gelen rahats\u0131zl\u0131klar olmadan y\u00fcz\u00fcm yap\u0131p, d\u0131\u015far\u0131da yemek yiyip ya da sakin bir ak\u015fam ge\u00e7irebilir.",
    indoorOutdoorTitle: "Aile E\u011flencesi \u0130\u00e7in Geni\u015f \u0130\u00e7-D\u0131\u015f Mekan Ya\u015fam Alanlar\u0131",
    indoorOutdoorBody:
      "Villalar, konforlu i\u00e7 mekanlar\u0131 teraslar, bah\u00e7eler ve a\u00e7\u0131k hava yemek alanlar\u0131yla harmanlıyor. \u00c7ocuklar oynamak i\u00e7in alana, yeti\u015fkinler bir araya gelmek i\u00e7in yere sahipken t\u00fcm aile, i\u00e7 mekan konforu ile d\u0131\u015f mekan Akdeniz ya\u015fam\u0131 aras\u0131nda do\u011fal bir ge\u00e7i\u015f yapabilir.",
    indoorLabel: "\u0130\u00e7 Mekan",
    indoorText:
      "yava\u015f sabahlar ve aile film geceleri i\u00e7in rahat oturma gruplar\u0131yla geni\u015f oturma odalar\u0131.",
    outdoorLabel: "D\u0131\u015f Mekan",
    outdoorText:
      "g\u00fcvenli oyun ve keyifli yemekler i\u00e7in \u00f6zel bah\u00e7eler, teraslar ve yemek alanlar\u0131.",
    comparisonTitle: "Villa Silyan - Antalya 5 Y\u0131ld\u0131zl\u0131 Otel Kar\u015f\u0131la\u015ft\u0131rmas\u0131",
    compAspect: "\u00d6zellik",
    comp5Star: "5 Y\u0131ld\u0131zl\u0131 Otel",
    compRows: [
      ["Gizlilik", "\u00d6zel", "Ortak"],
      ["Mekan", "Geni\u015f i\u00e7 ve d\u0131\u015f mekan alanlar\u0131", "Oda ve ortak tesislerle s\u0131n\u0131rl\u0131"],
      ["Mutfak", "Tam gurme mutfak", "Minimal ya da yok"],
      ["Aile rutini", "Esnek \u00f6\u011f\u00fcnler, \u015fekerleme ve havuz vakti", "Genellikle otel programlar\u0131na g\u00f6re"],
    ],
    localTipsTitle: "Yerel \u0130pu\u00e7lar\u0131: Ailenizle Antalya\u2019y\u0131 Ke\u015ffedin",
    localTipsIntro:
      "Antalya, Kalei\u00e7i\u2019nin tarihi sokaklar\u0131ndan D\u00fcden \u015eelaleleri\u2019nin do\u011fal g\u00fczelli\u011fine kadar pek \u00e7ok aile dostu etkinlikle doludur. Aktif gezileri g\u00fcn\u00fcn erken saatlerinde planlayın, sonra serin bir \u00f6\u011fleden sonra dinlenmesi i\u00e7in \u00f6zel havuzunuza d\u00f6n\u00fcn.",
    localTips: [
      { label: "Kalei\u00e7i", text: "kalabal\u0131ktan ka\u00e7\u0131nmak i\u00e7in tarihi soka\u011f\u0131 sabah erken saatlerinde gezdirin." },
      { label: "D\u00fcden \u015eelaleleri", text: "yakla\u015f\u0131k 20 dakikal\u0131k mesafede, foto\u011fraf ve rahat bir aile molas\u0131 i\u00e7in ideal." },
      { label: "Antalya Akvaryumu", text: "yakla\u015f\u0131k 15 dakikal\u0131k uzakl\u0131kta ve ya\u011fmurlu g\u00fcnler i\u00e7in \u00e7ocuklara y\u00f6nelik m\u00fckemmel bir se\u00e7enek." },
    ],
    drivingTitle: "S\u00fcr\u00fc\u015f Mesafeleri: Aileler \u0130\u00e7in Antalya Plajlar\u0131",
    drivingBody1:
      "Villa Silyan\u2019\u0131n Antalya konumu, \u015fehrin en iyi aile plaj g\u00fcnlerini kolayca planlamay\u0131 sa\u011flar. Lara Plaj\u0131 genellikle 15-20 dakika uzakl\u0131kta, Konyaalt\u0131 Plaj\u0131 ise trafik ve mevsime ba\u011fl\u0131 olarak yakla\u015f\u0131k 20 dakika arabay\u0131la ula\u015f\u0131labilir.",
    drivingBody2:
      "Kaputas Plaj\u0131, h\u0131zl\u0131 bir plaj dura\u011f\u0131ndan ziyade egzotik bir tam g\u00fcnl\u00fck yol gezisi olarak planlanmal\u0131d\u0131r. Antalya\u2019dan gidi\u015f 3 saate yak\u0131n s\u00fcrd\u00fc\u011f\u00fcnden, sahil manzaras\u0131n\u0131 ve tam bir g\u00fcnl\u00fck gezi isteyen aileler i\u00e7in saklanmal\u0131d\u0131r.",
    ctaEyebrow: "Yaz 2026 aile tatilleri",
    ctaTitle: "\u00d6zel Antalya Aile Tatilini Garantileyin",
    ctaBody:
      "Villa Silyan\u2019da l\u00fcks, gizlilik ve aile dostu olanaklarla tatil yap\u0131n. En net m\u00fcs\u00e4itlik ve en iyi do\u011frudan fiyatlar i\u00e7in do\u011frudan rezervasyon yap\u0131n.",
    peaceEyebrow: "Ebeveyn Huzuru",
    peaceTitle: "Aile g\u00fcvenlik esaslar\u0131, zaten d\u00fc\u015f\u00fcn\u00fcld\u00fc",
    peaceItems: [
      "Kilitli ve g\u00fcvenli havuz giri\u015fi",
      "\u00c7ocuk dostu i\u00e7 mekan tasar\u0131m\u0131: keskin k\u00f6\u015fe veya k\u0131r\u0131lgan dekor yok",
      "Talep \u00fczerine bebe\u011f karyola ve mama sandalyesi mevcuttur",
      "7/24 g\u00fcvenlik ve kap\u0131l\u0131 site giri\u015fi",
      "G\u00fcvenli d\u0131\u015f mekan oyunu i\u00e7in \u00f6zel bah\u00e7e",
    ],
    quickFactsTitle: "H\u0131zl\u0131 Bilgiler",
    quickFacts: [
      { label: "Ba\u015fl\u0131ca plajlar", value: "Lara Plaj\u0131 ve Konyaalt\u0131 Plaj\u0131" },
      { label: "En uygun", value: "Gizlilik, alan ve g\u00fcvenli havuz vakti isteyen aileler" },
      { label: "Tam g\u00fcnl\u00fck fikir", value: "Manzaral\u0131 bir karayolu gezisi olarak Kaputas Plaj\u0131" },
    ],
  },

  ar: {
    meta: {
      title:
        "\u0623\u0641\u0636\u0644 \u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 | \u0622\u0645\u0646\u0629 \u0648\u0647\u0627\u062f\u0626\u0629 | Villa Silyan",
      description:
        "\u0627\u062d\u062c\u0632 \u0645\u0644\u0627\u0630\u0623\u0643 \u0627\u0644\u0639\u0627\u0626\u0644\u064a \u0627\u0644\u0645\u062b\u0627\u0644\u064a \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627. \u0641\u064a\u0644\u0627\u062a \u0641\u0633\u064a\u062d\u0629 \u0645\u0639 \u0645\u0633\u0627\u0628\u062d \u0645\u0624\u0645\u0646\u0629\u060c \u0645\u0631\u0627\u0641\u0642 \u0622\u0645\u0646\u0629 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0648\u062d\u0631\u0627\u0633\u0629 24/7. \u0627\u062d\u062c\u0632 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631.",
      heroAlt:
        "\u0641\u064a\u0644\u0627 \u0639\u0627\u0626\u0644\u064a\u0629 \u0641\u0627\u062e\u0631\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0628\u062d \u0645\u0624\u0645\u0646 \u0648\u0637\u0639\u0627\u0645 \u0641\u064a \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0637\u0644\u0642.",
      jsonLdHeadline:
        "\u0623\u0641\u0636\u0644 \u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    },
    eyebrow:
      "\u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    checkAvailability:
      "\u062a\u062d\u0642\u0642 \u0645\u0646 \u062a\u0648\u0641\u0631 \u0641\u064a\u0644\u0627 \u0639\u0627\u0626\u0644\u064a\u0629",
    checkAvailabilityCta:
      "\u062a\u062d\u0642\u0642 \u0645\u0646 \u062a\u0648\u0641\u0631 \u0641\u064a\u0644\u0627 \u0639\u0627\u0626\u0644\u064a\u0629 \u2013 \u0635\u064a\u0641 2026",
    h1: "\u0627\u0633\u062a\u0643\u0634\u0641 \u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627: \u0622\u0645\u0646\u0629 \u0648\u0641\u0633\u064a\u062d\u0629 \u0648\u0645\u062c\u0647\u0632\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644",
    subtitle:
      "\u062a\u062e\u0637\u064a\u0637 \u0631\u062d\u0644\u0629 \u0639\u0627\u0626\u0644\u064a\u0629 \u064a\u0639\u0646\u064a \u062a\u062d\u0642\u064a\u0642 \u0627\u0644\u062a\u0648\u0627\u0632\u0646 \u0628\u064a\u0646 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0631\u0627\u062d\u0629 \u0648\u0627\u0644\u0645\u0648\u0642\u0639 \u0648\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u062a\u064a \u062a\u0633\u0627\u0639\u062f \u0627\u0644\u0623\u0647\u0644 \u0639\u0644\u0649 \u0627\u0644\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u062d\u0642\u0627\u064b. \u064a\u0648\u0641\u0631 Villa Silyan \u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0627\u0628\u062d \u0622\u0645\u0646\u0629 \u0648\u0645\u0633\u0627\u062d\u0627\u062a \u062f\u0627\u062e\u0644\u064a\u0629 \u0648\u062e\u0627\u0631\u062c\u064a\u0629 \u0641\u0633\u064a\u062d\u0629.",
    figcaption:
      "\u0645\u0633\u0628\u062d \u062e\u0627\u0635 \u0648\u0637\u0639\u0627\u0645 \u0641\u064a \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0637\u0644\u0642 \u0648\u0645\u0633\u0627\u062d\u0629 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0644\u0644\u0627\u0633\u062a\u0645\u062a\u0627\u0639 \u0628\u0627\u0644\u064a\u0648\u0645 \u0628\u0623\u0645\u0627\u0646.",
    heroStats: [
      ["\u0627\u0644\u0623\u0641\u0636\u0644 \u0644\u0640", "\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0628\u0627\u062d\u062b\u0629 \u0639\u0646 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0648\u0642\u062a \u0627\u0644\u0645\u0633\u0628\u062d \u0648\u0631\u0627\u062d\u0629 \u0645\u0633\u062a\u0648\u0649 \u0641\u0646\u062f\u0642\u064a"],
      ["\u0627\u0644\u0634\u0648\u0627\u0637\u0626 \u0627\u0644\u0642\u0631\u064a\u0628\u0629", "\u0634\u0627\u0637\u0626 \u0644\u0627\u0631\u0627 15-20 \u062f\u0642\u064a\u0642\u0629\u060c \u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a \u0646\u062d\u0648 20 \u062f\u0642\u064a\u0642\u0629"],
      ["\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u062d\u062c\u0632", "\u062d\u062c\u0632 \u0645\u0628\u0627\u0634\u0631 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u062a\u0648\u0641\u0631"],
    ],
    whyTitle:
      "\u0644\u0645\u0627\u0630\u0627 \u062a\u062e\u062a\u0627\u0631 Villa Silyan \u0644\u0631\u062d\u0644\u062a\u0643 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629\u061f",
    whyBody1:
      "\u0627\u062e\u062a\u064a\u0627\u0631 \u0641\u064a\u0644\u0627 \u0628\u062f\u0644\u0627\u064b \u0645\u0646 \u0641\u0646\u062f\u0642 \u064a\u0645\u0646\u062d \u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0642\u0627\u0639\u062f\u0629 \u0623\u0647\u062f\u0623 \u0648\u0623\u0643\u062b\u0631 \u0645\u0631\u0648\u0646\u0629. \u062a\u062a\u062c\u0646\u0628 \u0627\u0644\u0628\u0647\u0648\u0627\u062a \u0627\u0644\u0645\u0632\u062f\u062d\u0645\u0629 \u0648\u062c\u062f\u0627\u0648\u0644 \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u0645\u0634\u062a\u0631\u0643 \u0648\u0636\u063a\u0637 \u062a\u0634\u0643\u064a\u0644 \u0643\u0644 \u064a\u0648\u0645 \u062d\u0648\u0644 \u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0641\u0646\u062f\u0642. \u0641\u064a Villa Silyan\u060c \u0644\u0639\u0627\u0626\u0644\u062a\u0643 \u0628\u064a\u0626\u0629 \u0645\u0646\u0639\u0632\u0644\u0629 \u0628\u0645\u0633\u0627\u062d\u0629 \u0644\u0644\u0633\u0628\u0627\u062d\u0629 \u0648\u0627\u0644\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u0648\u0627\u0644\u0637\u0647\u064a \u0648\u0627\u0644\u062a\u0631\u0641\u064a\u0647 \u0628\u062e\u0635\u0648\u0635\u064a\u0629.",
    whyLinkText:
      "\u0641\u064a\u0644\u0627\u062a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0630\u0627\u062a \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u062e\u0627\u0635",
    whyBody2:
      "\u062f\u0644\u064a\u0644\u0646\u0627 \u0627\u0644\u0631\u0626\u064a\u0633\u064a \u064a\u0634\u0631\u062d \u0643\u064a\u0641 \u062a\u062a\u0645\u064a\u0632 \u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u062e\u0627\u0635 \u0639\u0646 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0627\u0644\u0641\u0646\u062f\u0642\u064a\u0629 \u0645\u0646 \u062d\u064a\u062b \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0645\u0648\u0642\u0639 \u0648\u062a\u062c\u0631\u0628\u0629 \u0627\u0644\u0636\u064a\u0641.",
    childSafeTitle:
      "\u0645\u0633\u0627\u062d\u0627\u062a \u0622\u0645\u0646\u0629 \u0644\u0644\u0623\u0637\u0641\u0627\u0644: \u0631\u0627\u062d\u0629 \u0628\u0627\u0644 \u0627\u0644\u0648\u0627\u0644\u062f\u064a\u0646",
    childSafeBody1:
      "\u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0647\u064a \u0645\u062d\u0648\u0631 \u0625\u062c\u0627\u0632\u0629 \u0639\u0627\u0626\u0644\u064a\u0629 \u0646\u0627\u062c\u062d\u0629. \u0628\u064a\u0626\u0629 Villa Silyan \u0645\u0635\u0645\u0645\u0629 \u062d\u0648\u0644 \u0627\u0644\u062d\u064a\u0627\u0629 \u0627\u0644\u062e\u0627\u0631\u062c\u064a\u0629 \u0627\u0644\u0622\u0645\u0646\u0629\u060c \u0645\u0639 \u0645\u062f\u062e\u0644 \u0645\u0633\u0628\u062d \u0645\u0624\u0645\u0646\u060c \u062d\u062f\u0627\u0626\u0642 \u062e\u0627\u0635\u0629\u060c \u0648\u0628\u0648\u0627\u0628\u0629 \u0645\u062c\u0645\u0639 \u0633\u0643\u0646\u064a \u0645\u062d\u0645\u064a\u0629 \u062a\u0633\u0627\u0639\u062f \u0627\u0644\u0648\u0627\u0644\u062f\u064a\u0646 \u0639\u0644\u0649 \u0627\u0644\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u062f\u0648\u0646 \u0627\u0644\u062a\u0639\u0627\u0645\u0644 \u0627\u0644\u0645\u0633\u062a\u0645\u0631 \u0645\u0639 \u0627\u0644\u0645\u0631\u0627\u0641\u0642 \u0627\u0644\u0641\u0646\u062f\u0642\u064a\u0629 \u0627\u0644\u0645\u0634\u062a\u0631\u0643\u0629.",
    childSafeBody2:
      "\u064a\u0645\u0643\u0646 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0627\u0644\u0627\u0633\u062a\u0645\u062a\u0627\u0639 \u0628\u0627\u0644\u062d\u062f\u064a\u0642\u0629 \u0648\u0627\u0644\u062a\u0631\u0627\u0633 \u0628\u064a\u0646\u0645\u0627 \u064a\u0628\u0642\u0649 \u0627\u0644\u0628\u0627\u0644\u063a\u0648\u0646 \u0642\u0631\u064a\u0628\u064a\u0646\u060c \u0645\u0645\u0627 \u064a\u062c\u0639\u0644 \u0627\u0644\u0641\u064a\u0644\u0627 \u062a\u0628\u062f\u0648 \u0643\u0645\u0646\u0632\u0644 \u0639\u0627\u0626\u0644\u064a \u062e\u0627\u0635 \u0644\u0627 \u0645\u0646\u062a\u062c\u0639 \u0633\u064a\u0627\u062d\u064a\u0627\u064b \u0635\u0627\u062e\u0628\u0627\u064b.",
    kitchenTitle:
      "\u0645\u0637\u0627\u0628\u062e \u0645\u062c\u0647\u0632\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644: \u0637\u0647\u064a \u0628\u0631\u0627\u062d\u0629 \u0648\u064a\u0633\u0631",
    kitchenBody1:
      "\u062a\u062d\u062a\u0648\u064a \u0643\u0644 \u0641\u064a\u0644\u0627 \u0639\u0644\u0649 \u0645\u0637\u0628\u062e \u0645\u062c\u0647\u0632 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0628\u0623\u062c\u0647\u0632\u0629 \u062d\u062f\u064a\u062b\u0629 \u0648\u0623\u062f\u0648\u0627\u062a \u0639\u0645\u0644\u064a\u0629 \u0648\u0645\u0633\u0627\u062d\u0629 \u062a\u062d\u0636\u064a\u0631 \u0648\u0627\u0633\u0639\u0629 \u0644\u0644\u0641\u0637\u0648\u0631 \u0648\u0627\u0644\u0648\u062c\u0628\u0627\u062a \u0627\u0644\u062e\u0641\u064a\u0641\u0629 \u0648\u0639\u0634\u0627\u0621 \u0627\u0644\u0639\u0627\u0626\u0644\u0629.",
    kitchenBody2:
      "\u062a\u062c\u0646\u0628 \u0636\u063a\u0637 \u0637\u0648\u0627\u0628\u064a\u0631 \u0628\u0648\u0641\u064a\u0647 \u0627\u0644\u0641\u0646\u062f\u0642 \u0648\u0623\u0648\u0642\u0627\u062a \u0627\u0644\u0648\u062c\u0628\u0627\u062a \u0627\u0644\u0645\u0642\u064a\u062f\u0629. \u0641\u064a Villa Silyan\u060c \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0631\u0648\u062a\u064a\u0646 \u0639\u0627\u0626\u0644\u062a\u0643 \u0648\u062a\u062d\u0636\u064a\u0631 \u0648\u062c\u0628\u0627\u062a \u0635\u062d\u064a\u0629 \u0641\u064a \u0645\u0637\u0628\u062e\u0643 \u0627\u0644\u063a\u0648\u0631\u0645\u064a\u0647.",
    privacyTitle:
      "\u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u062d\u0645\u064a\u0629: \u062c\u0646\u062a\u0643 \u0627\u0644\u0645\u0646\u0639\u0632\u0644\u0629 \u0627\u0644\u062e\u0627\u0635\u0629",
    privacyBody:
      "\u064a\u0639\u0637\u064a Villa Silyan \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629 \u0644\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u0639 \u0639\u0642\u0627\u0631\u0627\u062a \u0645\u0624\u0645\u0646\u0629 \u0648\u0645\u0633\u0627\u062d\u0627\u062a \u062e\u0627\u0631\u062c\u064a\u0629 \u0647\u0627\u062f\u0626\u0629. \u064a\u0645\u0643\u0646 \u0644\u0639\u0627\u0626\u0644\u062a\u0643 \u0627\u0644\u0633\u0628\u0627\u062d\u0629 \u0648\u062a\u0646\u0627\u0648\u0644 \u0627\u0644\u0637\u0639\u0627\u0645 \u062e\u0627\u0631\u062c\u0627\u064b \u0623\u0648 \u0642\u0636\u0627\u0621 \u0623\u0645\u0633\u064a\u0629 \u0647\u0627\u062f\u0626\u0629 \u062f\u0648\u0646 \u0627\u0644\u0645\u0642\u0627\u0637\u0639\u0627\u062a.",
    indoorOutdoorTitle:
      "\u0645\u0633\u0627\u062d\u0627\u062a \u0645\u0639\u064a\u0634\u064a\u0629 \u062f\u0627\u062e\u0644\u064a\u0629 \u0648\u062e\u0627\u0631\u062c\u064a\u0629 \u0641\u0633\u064a\u062d\u0629 \u0644\u0644\u0645\u062a\u0639\u0629 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629",
    indoorOutdoorBody:
      "\u062a\u0645\u0632\u062c \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0628\u064a\u0646 \u0627\u0644\u062f\u0627\u062e\u0644 \u0627\u0644\u0645\u0631\u064a\u062d \u0648\u0627\u0644\u062a\u0631\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u062d\u062f\u0627\u0626\u0642 \u0648\u0627\u0644\u0637\u0639\u0627\u0645 \u0641\u064a \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0637\u0644\u0642. \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0645\u0633\u0627\u062d\u0629 \u0644\u0644\u0644\u0639\u0628 \u0648\u0644\u0644\u0628\u0627\u0644\u063a\u064a\u0646 \u0645\u0643\u0627\u0646 \u0644\u0644\u062a\u062c\u0645\u0639\u060c \u0648\u064a\u0645\u0643\u0646 \u0644\u0644\u0639\u0627\u0626\u0644\u0629 \u0628\u0623\u0643\u0645\u0644\u0647\u0627 \u0627\u0644\u062a\u0646\u0642\u0644 \u0628\u0633\u0644\u0627\u0633\u0629 \u0628\u064a\u0646 \u0631\u0627\u062d\u0629 \u0627\u0644\u062f\u0627\u062e\u0644 \u0648\u062d\u064a\u0627\u0629 \u0627\u0644\u0628\u062d\u0631 \u0627\u0644\u0645\u062a\u0648\u0633\u0637 \u0641\u064a \u0627\u0644\u062e\u0627\u0631\u062c.",
    indoorLabel: "\u062f\u0627\u062e\u0644\u064a",
    indoorText:
      "\u063a\u0631\u0641 \u0645\u0639\u064a\u0634\u0629 \u0641\u0633\u064a\u062d\u0629 \u0628\u0645\u0642\u0627\u0639\u062f \u0645\u0631\u064a\u062d\u0629 \u0644\u0644\u0635\u0628\u0627\u062d\u0627\u062a \u0627\u0644\u0647\u0627\u062f\u0626\u0629 \u0648\u0633\u0647\u0631\u0627\u062a \u0623\u0641\u0644\u0627\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629.",
    outdoorLabel: "\u062e\u0627\u0631\u062c\u064a",
    outdoorText:
      "\u062d\u062f\u0627\u0626\u0642 \u062e\u0627\u0635\u0629 \u0648\u062a\u0631\u0627\u0633\u0627\u062a \u0648\u0645\u0646\u0627\u0637\u0642 \u0637\u0639\u0627\u0645 \u0644\u0644\u0644\u0639\u0628 \u0627\u0644\u0622\u0645\u0646 \u0648\u0627\u0644\u0648\u062c\u0628\u0627\u062a \u0627\u0644\u0645\u0631\u064a\u062d\u0629.",
    comparisonTitle:
      "Villa Silyan \u0645\u0642\u0627\u0628\u0644 \u0641\u0646\u0627\u062f\u0642 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0630\u0627\u062a \u0627\u0644\u062e\u0645\u0633 \u0646\u062c\u0648\u0645",
    compAspect: "\u0627\u0644\u062c\u0627\u0646\u0628",
    comp5Star: "\u0641\u0646\u062f\u0642 \u062e\u0645\u0633 \u0646\u062c\u0648\u0645",
    compRows: [
      ["\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629", "\u062d\u0635\u0631\u064a\u0629", "\u0645\u0634\u062a\u0631\u0643\u0629"],
      ["\u0627\u0644\u0645\u0633\u0627\u062d\u0629", "\u0645\u0633\u0627\u062d\u0627\u062a \u062f\u0627\u062e\u0644\u064a\u0629 \u0648\u062e\u0627\u0631\u062c\u064a\u0629 \u0648\u0627\u0633\u0639\u0629", "\u0645\u062d\u062f\u0648\u062f\u0629 \u0628\u0627\u0644\u063a\u0631\u0641 \u0648\u0627\u0644\u0645\u0631\u0627\u0641\u0642 \u0627\u0644\u0645\u0634\u062a\u0631\u0643\u0629"],
      ["\u0627\u0644\u0645\u0637\u0628\u062e", "\u0645\u0637\u0628\u062e \u063a\u0648\u0631\u0645\u064a\u0647 \u0645\u062a\u0643\u0627\u0645\u0644", "\u0645\u062a\u0627\u062d \u0628\u062d\u062f\u0651 \u0623\u062f\u0646\u0649 \u0623\u0648 \u063a\u064a\u0631 \u0645\u062a\u0627\u062d"],
      ["\u0631\u0648\u062a\u064a\u0646 \u0627\u0644\u0639\u0627\u0626\u0644\u0629", "\u0648\u062c\u0628\u0627\u062a \u0648\u0642\u064a\u0644\u0648\u0644\u0629 \u0648\u0648\u0642\u062a \u0645\u0633\u0628\u062d \u0645\u0631\u0646\u0629", "\u063a\u0627\u0644\u0628\u0627\u064b \u0645\u0642\u064a\u062f\u0629 \u0628\u062c\u062f\u0627\u0648\u0644 \u0627\u0644\u0641\u0646\u062f\u0642"],
    ],
    localTipsTitle:
      "\u0646\u0635\u0627\u0626\u062d \u0645\u062d\u0644\u064a\u0629: \u0627\u0633\u062a\u0643\u0634\u0641 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0639\u0627\u0626\u0644\u062a\u0643",
    localTipsIntro:
      "\u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u063a\u0646\u064a\u0629 \u0628\u0627\u0644\u0623\u0646\u0634\u0637\u0629 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629\u060c \u0645\u0646 \u0634\u0648\u0627\u0631\u0639 \u0643\u0627\u0644\u064a\u062a\u0634\u064a \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0625\u0644\u0649 \u062c\u0645\u0627\u0644 \u0634\u0644\u0627\u0644\u0627\u062a \u062f\u0648\u062f\u0646 \u0627\u0644\u0637\u0628\u064a\u0639\u064a. \u062e\u0637\u0637 \u0644\u0644\u0646\u0634\u0627\u0637 \u0641\u064a \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u064a\u0648\u0645\u060c \u062b\u0645 \u0639\u062f \u0625\u0644\u0649 \u0645\u0633\u0628\u062d\u0643 \u0627\u0644\u062e\u0627\u0635 \u0644\u0644\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u0628\u0639\u062f \u0627\u0644\u0638\u0647\u0631.",
    localTips: [
      { label: "\u0643\u0627\u0644\u064a\u062a\u0634\u064a", text: "\u062a\u062c\u0648\u0644 \u0641\u064a \u0634\u0648\u0627\u0631\u0639 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0641\u064a \u0648\u0642\u062a \u0645\u0628\u0643\u0631 \u0645\u0646 \u0627\u0644\u0635\u0628\u0627\u062d \u0644\u062a\u062c\u0646\u0628 \u0627\u0644\u0627\u0632\u062f\u062d\u0627\u0645." },
      { label: "\u0634\u0644\u0627\u0644\u0627\u062a \u062f\u0648\u062f\u0646", text: "\u0639\u0644\u0649 \u0628\u0639\u062f \u0646\u062d\u0648 20 \u062f\u0642\u064a\u0642\u0629\u060c \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u062a\u0635\u0648\u064a\u0631 \u0648\u0627\u0644\u062a\u0648\u0642\u0641 \u0627\u0644\u0639\u0627\u0626\u0644\u064a \u0627\u0644\u0645\u0631\u064a\u062d." },
      { label: "\u0623\u0643\u0648\u0627\u0631\u064a\u0648\u0645 \u0623\u0646\u0637\u0627\u0644\u064a\u0627", text: "\u0646\u062d\u0648 15 \u062f\u0642\u064a\u0642\u0629 \u0628\u0627\u0644\u0633\u064a\u0627\u0631\u0629\u060c \u062e\u064a\u0627\u0631 \u0642\u0648\u064a \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0641\u064a \u0627\u0644\u0623\u064a\u0627\u0645 \u0627\u0644\u0645\u0645\u0637\u0631\u0629." },
    ],
    drivingTitle:
      "\u0645\u0633\u0627\u0641\u0627\u062a \u0627\u0644\u0642\u064a\u0627\u062f\u0629: \u0634\u0648\u0627\u0637\u0626 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u0644\u0639\u0627\u0626\u0644\u0627\u062a",
    drivingBody1:
      "\u0645\u0648\u0642\u0639 Villa Silyan \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u064a\u062c\u0639\u0644 \u062a\u062e\u0637\u064a\u0637 \u0623\u0641\u0636\u0644 \u0623\u064a\u0627\u0645 \u0627\u0644\u0634\u0627\u0637\u0626 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629 \u0623\u0645\u0631\u0627\u064b \u0633\u0647\u0644\u0627\u064b. \u0634\u0627\u0637\u0626 \u0644\u0627\u0631\u0627 \u0639\u0627\u062f\u0629\u064b \u0639\u0644\u0649 15-20 \u062f\u0642\u064a\u0642\u0629\u060c \u0648\u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a \u0646\u062d\u0648 20 \u062f\u0642\u064a\u0642\u0629 \u0628\u0627\u0644\u0633\u064a\u0627\u0631\u0629 \u062d\u0633\u0628 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0627\u0644\u0645\u0648\u0633\u0645.",
    drivingBody2:
      "\u064a\u0646\u0628\u063a\u064a \u0627\u0644\u062a\u0639\u0627\u0645\u0644 \u0645\u0639 \u0634\u0627\u0637\u0626 \u0643\u0627\u0628\u0648\u062a\u0627\u0634 \u0643\u0631\u062d\u0644\u0629 \u0628\u0631\u064a\u0629 \u0644\u064a\u0648\u0645 \u0643\u0627\u0645\u0644 \u0644\u0627 \u0643\u062a\u0648\u0642\u0641 \u0633\u0631\u064a\u0639. \u0645\u0646 \u0645\u062f\u064a\u0646\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627\u060c \u062a\u0633\u062a\u063a\u0631\u0642 \u0627\u0644\u0631\u062d\u0644\u0629 \u0646\u062d\u0648 3 \u0633\u0627\u0639\u0627\u062a \u0641\u064a \u0643\u0644 \u0627\u062a\u062c\u0627\u0647\u060c \u0644\u0630\u0627 \u0647\u064a \u0623\u0641\u0636\u0644 \u0644\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0631\u0627\u063a\u0628\u0629 \u0641\u064a \u0631\u062d\u0644\u0629 \u0633\u0627\u062d\u0644\u064a\u0629 \u062e\u0644\u0627\u0628\u0629.",
    ctaEyebrow: "\u0625\u0642\u0627\u0645\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u0635\u064a\u0641 2026",
    ctaTitle:
      "\u0627\u062d\u062c\u0632 \u0645\u0644\u0627\u0630\u0623\u0643 \u0627\u0644\u0639\u0627\u0626\u0644\u064a \u0627\u0644\u062e\u0627\u0635 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    ctaBody:
      "\u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u0627\u0644\u0641\u062e\u0627\u0645\u0629 \u0648\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0645\u0631\u0627\u0641\u0642 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629 \u0641\u064a Villa Silyan. \u0627\u062d\u062c\u0632 \u0645\u0628\u0627\u0634\u0631\u0629\u064b \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u062a\u0648\u0641\u0631 \u0648\u0623\u0641\u0636\u0644 \u0623\u0633\u0639\u0627\u0631 \u0645\u0628\u0627\u0634\u0631\u0629.",
    peaceEyebrow: "\u0631\u0627\u062d\u0629 \u0628\u0627\u0644 \u0627\u0644\u0648\u0627\u0644\u062f\u064a\u0646",
    peaceTitle:
      "\u0623\u0633\u0627\u0633\u064a\u0627\u062a \u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0639\u0627\u0626\u0644\u0629\u060c \u062a\u0645\u062a \u0645\u0631\u0627\u0639\u0627\u062a\u0647\u0627 \u0645\u0633\u0628\u0642\u0627\u064b",
    peaceItems: [
      "\u0645\u062f\u062e\u0644 \u0645\u0633\u0628\u062d \u0645\u0624\u0645\u0646 \u0648\u0622\u0645\u0646",
      "\u062a\u0635\u0645\u064a\u0645 \u062f\u0627\u062e\u0644\u064a \u0645\u0644\u0627\u0626\u0645 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u062f\u0648\u0646 \u0632\u0648\u0627\u064a\u0627 \u062d\u0627\u062f\u0629 \u0623\u0648 \u062f\u064a\u0643\u0648\u0631 \u0647\u0634 ",
      "\u0633\u0631\u0627\u0626\u0631 \u0623\u0637\u0641\u0627\u0644 \u0648\u0643\u0631\u0627\u0633\u064a \u0623\u0643\u0644 \u0645\u062a\u0627\u062d\u0629 \u0639\u0646\u062f \u0627\u0644\u0637\u0644\u0628",
      "\u062d\u0631\u0627\u0633\u0629 24/7 \u0648\u0628\u0648\u0627\u0628\u0629 \u0645\u062c\u0645\u0639 \u0633\u0643\u0646\u064a \u0645\u062d\u0645\u064a\u0629",
      "\u062d\u062f\u064a\u0642\u0629 \u062e\u0627\u0635\u0629 \u0644\u0644\u0644\u0639\u0628 \u0627\u0644\u062e\u0627\u0631\u062c\u064a \u0627\u0644\u0622\u0645\u0646",
    ],
    quickFactsTitle: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
    quickFacts: [
      { label: "\u0627\u0644\u0634\u0648\u0627\u0637\u0626 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629", value: "\u0634\u0627\u0637\u0626 \u0644\u0627\u0631\u0627 \u0648\u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a" },
      { label: "\u0627\u0644\u0623\u0641\u0636\u0644 \u0644\u0640", value: "\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0631\u0627\u063a\u0628\u0629 \u0641\u064a \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0648\u0627\u0644\u0645\u0633\u0627\u062d\u0629 \u0648\u0648\u0642\u062a \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u0622\u0645\u0646" },
      { label: "\u0641\u0643\u0631\u0629 \u0644\u064a\u0648\u0645 \u0643\u0627\u0645\u0644", value: "\u0634\u0627\u0637\u0626 \u0643\u0627\u0628\u0648\u062a\u0627\u0634 \u0643\u0631\u062d\u0644\u0629 \u0637\u0631\u064a\u0642 \u062e\u0644\u0627\u0628\u0629" },
    ],
  },

  ru: {
    meta: {
      title:
        "\u041b\u0443\u0447\u0448\u0438\u0435 \u0447\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 | \u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0435 \u0438 \u0443\u044e\u0442\u043d\u044b\u0435 | Villa Silyan",
      description:
        "\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435. \u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0441 \u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438, \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u043c\u0438 \u0434\u043b\u044f \u0434\u0435\u0442\u0435\u0439 \u0443\u0434\u043e\u0431\u0441\u0442\u0432\u0430\u043c\u0438 \u0438 \u043a\u0440\u0443\u0433\u043b\u043e\u0441\u0443\u0442\u043e\u0447\u043d\u043e\u0439 \u043e\u0445\u0440\u0430\u043d\u043e\u0439. \u041f\u0440\u044f\u043c\u043e\u0435 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u043e \u043b\u0443\u0447\u0448\u0438\u043c \u0446\u0435\u043d\u0430\u043c.",
      heroAlt:
        "\u0427\u0430\u0441\u0442\u043d\u0430\u044f \u0440\u043e\u0441\u043a\u043e\u0448\u043d\u0430\u044f \u0441\u0435\u043c\u0435\u0439\u043d\u0430\u044f \u0432\u0438\u043b\u043b\u0430 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c \u0438 \u043e\u0431\u0435\u0434\u043e\u043c \u043d\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u043e\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435.",
      jsonLdHeadline:
        "\u041b\u0443\u0447\u0448\u0438\u0435 \u0447\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    },
    eyebrow:
      "\u0427\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    checkAvailability:
      "\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u044c \u0432\u0438\u043b\u043b\u044b",
    checkAvailabilityCta:
      "\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u044c \u2014 \u041b\u0435\u0442\u043e 2026",
    h1: "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0447\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435: \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0435, \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0438 \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e \u043e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u043d\u044b\u0435",
    subtitle:
      "\u041f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0433\u043e \u043e\u0442\u0434\u044b\u0445\u0430 \u043e\u0437\u043d\u0430\u0447\u0430\u0435\u0442 \u0431\u0430\u043b\u0430\u043d\u0441 \u043c\u0435\u0436\u0434\u0443 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c\u044e, \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u043e\u043c, \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c \u0438 \u043c\u0435\u043b\u043a\u0438\u043c\u0438 \u0434\u0435\u0442\u0430\u043b\u044f\u043c\u0438 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438. Villa Silyan \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0441 \u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438 \u0438 \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u043c\u0438 \u0437\u043e\u043d\u0430\u043c\u0438.",
    figcaption:
      "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d, \u043e\u0431\u0435\u0434 \u043f\u043e\u0434 \u0442\u0435\u043d\u044c\u044e \u0438 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u0434\u0435\u0442\u0435\u0439.",
    heroStats: [
      ["\u041b\u0443\u0447\u0448\u0435 \u0432\u0441\u0435\u0433\u043e \u0434\u043b\u044f", "\u0421\u0435\u043c\u0435\u0439, \u0436\u0435\u043b\u0430\u044e\u0449\u0438\u0445 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438, \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430 \u0438 \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u0430 \u0443\u0440\u043e\u0432\u043d\u044f \u043e\u0442\u0435\u043b\u044f"],
      ["\u0411\u043b\u0438\u0436\u0430\u0439\u0448\u0438\u0435 \u043f\u043b\u044f\u0436\u0438", "\u041f\u043b\u044f\u0436 \u041b\u0430\u0440\u0430 15-20 \u043c\u0438\u043d., \u043f\u043b\u044f\u0436 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b \u043e\u043a. 20 \u043c\u0438\u043d."],
      ["\u0421\u043f\u043e\u0441\u043e\u0431 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f", "\u041f\u0440\u044f\u043c\u043e\u0435 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0434\u043b\u044f \u043b\u0443\u0447\u0448\u0438\u0445 \u0446\u0435\u043d \u0438 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u0438"],
    ],
    whyTitle:
      "\u041f\u043e\u0447\u0435\u043c\u0443 \u0432\u044b\u0431\u0440\u0430\u0442\u044c Villa Silyan \u0434\u043b\u044f \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0433\u043e \u043e\u0442\u0434\u044b\u0445\u0430?",
    whyBody1:
      "\u0412\u044b\u0431\u043e\u0440 \u0432\u0438\u043b\u043b\u044b \u0432\u043c\u0435\u0441\u0442\u043e \u043e\u0442\u0435\u043b\u044f \u0434\u0430\u0451\u0442 \u0441\u0435\u043c\u044c\u044f\u043c \u0431\u043e\u043b\u0435\u0435 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u0443\u044e \u0438 \u0433\u0438\u0431\u043a\u0443\u044e \u0431\u0430\u0437\u0443. \u0412\u044b \u0438\u0437\u0431\u0435\u0433\u0430\u0435\u0442\u0435 \u043f\u0435\u0440\u0435\u043f\u043e\u043b\u043d\u0435\u043d\u043d\u044b\u0445 \u0445\u043e\u043b\u043b\u043e\u0432, \u0433\u0440\u0430\u0444\u0438\u043a\u043e\u0432 \u043e\u0431\u0449\u0435\u0433\u043e \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430 \u0438 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e\u0441\u0442\u0438 \u043f\u043e\u0434\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0442\u044c \u0432\u0435\u0441\u044c \u0434\u0435\u043d\u044c \u043f\u043e\u0434 \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u043e\u0442\u0435\u043b\u044f. \u0412 Villa Silyan \u0432\u0430\u0448\u0430 \u0441\u0435\u043c\u044c\u044f \u043f\u043e\u043b\u0443\u0447\u0438\u0442 \u0443\u0435\u0434\u0438\u043d\u0451\u043d\u043d\u043e\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u043f\u043b\u0430\u0432\u0430\u043d\u0438\u044f, \u043e\u0442\u0434\u044b\u0445\u0430 \u0438 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0433\u043e \u0434\u043e\u0441\u0443\u0433\u0430.",
    whyLinkText:
      "\u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c",
    whyBody2:
      "\u2014 \u043d\u0430\u0448 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u043f\u0443\u0442\u0435\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c \u043e\u0431\u044a\u044f\u0441\u043d\u044f\u0435\u0442, \u043a\u0430\u043a \u0432\u0438\u043b\u043b\u044b \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438 \u0432\u044b\u0433\u043e\u0434\u043d\u043e \u043e\u0442\u043b\u0438\u0447\u0430\u044e\u0442\u0441\u044f \u043e\u0442 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0447\u043d\u043e\u0433\u043e \u043f\u0440\u043e\u0436\u0438\u0432\u0430\u043d\u0438\u044f.",
    childSafeTitle:
      "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430 \u0434\u043b\u044f \u0434\u0435\u0442\u0435\u0439: \u0441\u043f\u043e\u043a\u043e\u0439\u0441\u0442\u0432\u0438\u0435 \u0434\u043b\u044f \u0440\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
    childSafeBody1:
      "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c \u2014 \u043a\u043b\u044e\u0447\u0435\u0432\u043e\u0439 \u044d\u043b\u0435\u043c\u0435\u043d\u0442 \u0443\u0441\u043f\u0435\u0448\u043d\u043e\u0433\u043e \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0433\u043e \u043e\u0442\u0434\u044b\u0445\u0430. \u0412\u0438\u043b\u043b\u044b Villa Silyan \u0441\u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0432\u043e\u043a\u0440\u0443\u0433 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0433\u043e \u043e\u0442\u0434\u044b\u0445\u0430 \u043d\u0430 \u0441\u0432\u0435\u0436\u0435\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435: \u0432\u0445\u043e\u0434 \u043d\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044e \u0447\u0435\u0440\u0435\u0437 \u0448\u043b\u0430\u0433\u0431\u0430\u0443\u043c, \u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u0430\u0434 \u0438 \u0432\u044a\u0435\u0437\u0434 \u0432 \u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u0439 \u043f\u043e\u0441\u0451\u043b\u043e\u043a.",
    childSafeBody2:
      "\u0414\u0435\u0442\u0438 \u043c\u043e\u0433\u0443\u0442 \u0438\u0433\u0440\u0430\u0442\u044c \u0432 \u0441\u0430\u0434\u0443 \u0438 \u043d\u0430 \u0442\u0435\u0440\u0440\u0430\u0441\u0435, \u043f\u043e\u043a\u0430 \u0432\u0437\u0440\u043e\u0441\u043b\u044b\u0435 \u043d\u0430\u0445\u043e\u0434\u044f\u0442\u0441\u044f \u0440\u044f\u0434\u043e\u043c, \u0447\u0442\u043e \u0434\u0435\u043b\u0430\u0435\u0442 \u0432\u0438\u043b\u043b\u0443 \u043f\u043e\u0445\u043e\u0436\u0435\u0439 \u043d\u0430 \u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u0434\u043e\u043c, \u0430 \u043d\u0435 \u043d\u0430 \u043e\u0436\u0438\u0432\u043b\u0451\u043d\u043d\u044b\u0439 \u043a\u0443\u0440\u043e\u0440\u0442.",
    kitchenTitle:
      "\u041f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e \u043e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u043a\u0443\u0445\u043d\u0438: \u0433\u043e\u0442\u043e\u0432\u0438\u0442\u044c \u043b\u0435\u0433\u043a\u043e \u0438 \u0443\u0434\u043e\u0431\u043d\u043e",
    kitchenBody1:
      "\u041a\u0430\u0436\u0434\u0430\u044f \u0432\u0438\u043b\u043b\u0430 \u043e\u0441\u043d\u0430\u0449\u0435\u043d\u0430 \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e \u043e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u043a\u0443\u0445\u043d\u0435\u0439 \u0441 \u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 \u0442\u0435\u0445\u043d\u0438\u043a\u043e\u0439, \u043f\u0440\u0430\u043a\u0442\u0438\u0447\u043d\u044b\u043c\u0438 \u043f\u0440\u0438\u0431\u043e\u0440\u0430\u043c\u0438 \u0438 \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u043c\u0438 \u0440\u0430\u0431\u043e\u0447\u0438\u043c\u0438 \u043f\u043e\u0432\u0435\u0440\u0445\u043d\u043e\u0441\u0442\u044f\u043c\u0438.",
    kitchenBody2:
      "\u0417\u0430\u0431\u0443\u0434\u044c\u0442\u0435 \u043e \u043e\u0447\u0435\u0440\u0435\u0434\u044f\u0445 \u043d\u0430 \u0448\u0432\u0435\u0434\u0441\u043a\u043e\u043c \u0441\u0442\u043e\u043b\u0435 \u0438 \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043d\u044b\u0445 \u0432\u0440\u0435\u043c\u0435\u043d\u0430\u0445 \u043f\u0438\u0442\u0430\u043d\u0438\u044f. \u0412 Villa Silyan \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u0442\u044c \u043f\u0440\u0438\u0432\u044b\u0447\u043d\u044b\u0439 \u0440\u0430\u0441\u043f\u043e\u0440\u044f\u0434\u043e\u043a \u0434\u043d\u044f \u0432\u0441\u0435\u0439 \u0441\u0435\u043c\u044c\u0438, \u0433\u043e\u0442\u043e\u0432\u044f \u0437\u0434\u043e\u0440\u043e\u0432\u0443\u044e \u0435\u0434\u0443 \u0432 \u0441\u0432\u043e\u0435\u0439 \u043a\u0443\u0445\u043d\u0435 \u0433\u0443\u0440\u043c\u0430\u043d\u0430.",
    privacyTitle:
      "\u041e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u0430\u044f \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f: \u0432\u0430\u0448 \u0443\u044e\u0442\u043d\u044b\u0439 \u0440\u0430\u0439",
    privacyBody:
      "Villa Silyan \u0443\u0434\u0435\u043b\u044f\u0435\u0442 \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438 \u0441 \u0437\u0430\u043a\u0440\u044b\u0442\u044b\u043c\u0438 \u0432\u044a\u0435\u0437\u0434\u0430\u043c\u0438 \u0438 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u044b\u043c\u0438 \u0437\u043e\u043d\u0430\u043c\u0438. \u0412\u0430\u0448\u0430 \u0441\u0435\u043c\u044c\u044f \u043c\u043e\u0436\u0435\u0442 \u043f\u043b\u0430\u0432\u0430\u0442\u044c, \u0443\u0436\u0438\u043d\u0430\u0442\u044c \u043d\u0430 \u0441\u0432\u0435\u0436\u0435\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435 \u0438\u043b\u0438 \u043f\u0440\u043e\u0432\u043e\u0434\u0438\u0442\u044c \u0442\u0438\u0445\u0438\u0439 \u0432\u0435\u0447\u0435\u0440 \u0431\u0435\u0437 \u043f\u043e\u043c\u0435\u0445.",
    indoorOutdoorTitle:
      "\u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u044f \u0434\u043b\u044f \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0433\u043e \u043e\u0442\u0434\u044b\u0445\u0430",
    indoorOutdoorBody:
      "\u0412\u0438\u043b\u043b\u044b \u0441\u043e\u0447\u0435\u0442\u0430\u044e\u0442 \u0443\u044e\u0442\u043d\u044b\u0435 \u0438\u043d\u0442\u0435\u0440\u044c\u0435\u0440\u044b \u0441 \u0442\u0435\u0440\u0440\u0430\u0441\u0430\u043c\u0438, \u0441\u0430\u0434\u0430\u043c\u0438 \u0438 \u043e\u0431\u0435\u0434\u0435\u043d\u043d\u044b\u043c\u0438 \u0437\u043e\u043d\u0430\u043c\u0438 \u043f\u043e\u0434 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u043d\u0435\u0431\u043e\u043c. \u0414\u0435\u0442\u0438 \u0438\u0433\u0440\u0430\u044e\u0442, \u0432\u0437\u0440\u043e\u0441\u043b\u044b\u0435 \u043e\u0442\u0434\u044b\u0445\u0430\u044e\u0442, \u0432\u0441\u044f \u0441\u0435\u043c\u044c\u044f \u0441\u0432\u043e\u0431\u043e\u0434\u043d\u043e \u0447\u0435\u0440\u0435\u0434\u0443\u0435\u0442\u0441\u044f \u043c\u0435\u0436\u0434\u0443 \u0434\u043e\u043c\u0430\u0448\u043d\u0438\u043c \u0443\u044e\u0442\u043e\u043c \u0438 \u0441\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u043c\u043e\u0440\u0441\u043a\u043e\u0439 \u0436\u0438\u0437\u043d\u044c\u044e \u043d\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u043e\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435.",
    indoorLabel: "\u0412\u043d\u0443\u0442\u0440\u0438",
    indoorText:
      "\u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0433\u043e\u0441\u0442\u0438\u043d\u044b\u0435 \u0441 \u0443\u0434\u043e\u0431\u043d\u044b\u043c\u0438 \u0434\u0438\u0432\u0430\u043d\u0430\u043c\u0438 \u0434\u043b\u044f \u043d\u0435\u0441\u043f\u0435\u0448\u043d\u044b\u0445 \u0443\u0442\u0440 \u0438 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0445 \u043a\u0438\u043d\u043e\u0432\u0435\u0447\u0435\u0440\u043e\u0432.",
    outdoorLabel: "\u0421\u043d\u0430\u0440\u0443\u0436\u0438",
    outdoorText:
      "\u0447\u0430\u0441\u0442\u043d\u044b\u0435 \u0441\u0430\u0434\u044b, \u0442\u0435\u0440\u0440\u0430\u0441\u044b \u0438 \u043e\u0431\u0435\u0434\u0435\u043d\u043d\u044b\u0435 \u0437\u043e\u043d\u044b \u0434\u043b\u044f \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0445 \u0438\u0433\u0440 \u0438 \u0440\u0430\u0441\u0441\u043b\u0430\u0431\u043b\u0435\u043d\u043d\u044b\u0445 \u0443\u0436\u0438\u043d\u043e\u0432.",
    comparisonTitle:
      "Villa Silyan \u043f\u0440\u043e\u0442\u0438\u0432 5-\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u044b\u0445 \u043e\u0442\u0435\u043b\u0435\u0439 \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
    compAspect: "\u0410\u0441\u043f\u0435\u043a\u0442",
    comp5Star:
      "5-\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u044b\u0439 \u043e\u0442\u0435\u043b\u044c",
    compRows: [
      [
        "\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c",
        "\u0418\u0441\u043a\u043b\u044e\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f",
        "\u041e\u0431\u0449\u0430\u044f",
      ],
      [
        "\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e",
        "\u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0437\u043e\u043d\u044b \u0432\u043d\u0443\u0442\u0440\u0438 \u0438 \u0441\u043d\u0430\u0440\u0443\u0436\u0438",
        "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043e \u043d\u043e\u043c\u0435\u0440\u0430\u043c\u0438 \u0438 \u043e\u0431\u0449\u0438\u043c\u0438 \u0437\u043e\u043d\u0430\u043c\u0438",
      ],
      [
        "\u041a\u0443\u0445\u043d\u044f",
        "\u041f\u043e\u043b\u043d\u0430\u044f \u043a\u0443\u0445\u043d\u044f \u0433\u0443\u0440\u043c\u0430\u043d\u0430",
        "\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u0430\u044f \u0438\u043b\u0438 \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442",
      ],
      [
        "\u0420\u0430\u0441\u043f\u043e\u0440\u044f\u0434\u043e\u043a \u0441\u0435\u043c\u044c\u0438",
        "\u0413\u0438\u0431\u043a\u043e\u0435 \u043f\u0438\u0442\u0430\u043d\u0438\u0435, \u0434\u043d\u0435\u0432\u043d\u043e\u0439 \u0441\u043e\u043d \u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d",
        "\u0427\u0430\u0441\u0442\u043e \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u044f\u0435\u0442\u0441\u044f \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435\u043c \u043e\u0442\u0435\u043b\u044f",
      ],
    ],
    localTipsTitle:
      "\u041c\u0435\u0441\u0442\u043d\u044b\u0435 \u0441\u043e\u0432\u0435\u0442\u044b: \u0438\u0441\u0441\u043b\u0435\u0434\u0443\u0439\u0442\u0435 \u0410\u043d\u0442\u0430\u043b\u044c\u044e \u0441 \u0441\u0435\u043c\u044c\u0451\u0439",
    localTipsIntro:
      "\u0410\u043d\u0442\u0430\u043b\u044c\u044f \u0431\u043e\u0433\u0430\u0442\u0430 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u043c\u0438 \u0440\u0430\u0437\u0432\u043b\u0435\u0447\u0435\u043d\u0438\u044f\u043c\u0438: \u0438\u0441\u0442\u043e\u0440\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0421\u0442\u0430\u0440\u044b\u0439 \u0433\u043e\u0440\u043e\u0434 \u041a\u0430\u043b\u0435\u0438\u0447\u0438 \u0438 \u0432\u043e\u0434\u043e\u043f\u0430\u0434\u044b \u0414\u044e\u0434\u0435\u043d. \u041f\u043b\u0430\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435 \u043f\u0440\u043e\u0433\u0443\u043b\u043a\u0438 \u0443\u0442\u0440\u043e\u043c\u060c \u0430 \u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u0443\u0434\u043d\u044f \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0442\u0435\u0441\u044c \u043a \u0447\u0430\u0441\u0442\u043d\u043e\u043c\u0443 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0443.",
    localTips: [
      { label: "\u041a\u0430\u043b\u0435\u0438\u0447\u0438", text: "\u043f\u0440\u043e\u0433\u0443\u043b\u044f\u0439\u0442\u0435\u0441\u044c \u043f\u043e \u0443\u043b\u043e\u0447\u043a\u0430\u043c \u0421\u0442\u0430\u0440\u043e\u0433\u043e \u0433\u043e\u0440\u043e\u0434\u0430 \u0440\u0430\u043d\u043e \u0443\u0442\u0440\u043e\u043c, \u0447\u0442\u043e\u0431\u044b \u0438\u0437\u0431\u0435\u0436\u0430\u0442\u044c \u0442\u043e\u043b\u043f\u044b." },
      { label: "\u0412\u043e\u0434\u043e\u043f\u0430\u0434\u044b \u0414\u044e\u0434\u0435\u043d", text: "\u043e\u043a\u043e\u043b\u043e 20 \u043c\u0438\u043d\u0443\u0442 \u0435\u0437\u0434\u044b, \u043e\u0442\u043b\u0438\u0447\u043d\u043e \u0434\u043b\u044f \u0444\u043e\u0442\u043e\u0441\u0435\u0441\u0441\u0438\u0439 \u0438 \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0439 \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438." },
      { label: "\u0410\u043a\u0432\u0430\u0440\u0438\u0443\u043c \u0410\u043d\u0442\u0430\u043b\u044c\u0438", text: "\u043e\u043a\u043e\u043b\u043e 15 \u043c\u0438\u043d\u0443\u0442 \u043d\u0430 \u043c\u0430\u0448\u0438\u043d\u0435, \u043e\u0442\u043b\u0438\u0447\u043d\u044b\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442 \u0434\u043b\u044f \u0434\u0435\u0442\u0435\u0439 \u0432 \u0434\u043e\u0436\u0434\u043b\u0438\u0432\u044b\u0439 \u0434\u0435\u043d\u044c." },
    ],
    drivingTitle:
      "\u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u044f \u0434\u043e \u043f\u043b\u044f\u0436\u0435\u0439 \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
    drivingBody1:
      "\u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435 Villa Silyan \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0443\u043f\u0440\u043e\u0449\u0430\u0435\u0442 \u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043b\u0443\u0447\u0448\u0438\u0445 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0445 \u043f\u043e\u0435\u0437\u0434\u043e\u043a \u043d\u0430 \u043f\u043b\u044f\u0436. \u041f\u043b\u044f\u0436 \u041b\u0430\u0440\u0430 \u2014 \u043e\u0431\u044b\u0447\u043d\u043e 15-20 \u043c\u0438\u043d\u0443\u0442, \u043f\u043b\u044f\u0436 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b \u2014 \u043e\u043a\u043e\u043b\u043e 20 \u043c\u0438\u043d\u0443\u0442.",
    drivingBody2:
      "\u041f\u043b\u044f\u0436 \u041a\u0430\u043f\u0443\u0442\u0430\u0448 \u043b\u0443\u0447\u0448\u0435 \u0440\u0430\u0441\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044c \u043a\u0430\u043a \u044d\u043a\u0437\u043e\u0442\u0438\u0447\u0435\u0441\u043a\u0443\u044e \u043f\u043e\u0435\u0437\u0434\u043a\u0443 \u043d\u0430 \u0446\u0435\u043b\u044b\u0439 \u0434\u0435\u043d\u044c: \u0434\u043e\u0440\u043e\u0433\u0430 \u0437\u0430\u043d\u0438\u043c\u0430\u0435\u0442 \u043e\u043a\u043e\u043b\u043e 3 \u0447\u0430\u0441\u043e\u0432 \u0432 \u043e\u0434\u043d\u0443 \u0441\u0442\u043e\u0440\u043e\u043d\u0443.",
    ctaEyebrow:
      "\u0421\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445 \u043b\u0435\u0442\u043e 2026",
    ctaTitle:
      "\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    ctaBody:
      "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u0435 \u0440\u043e\u0441\u043a\u043e\u0448\u044c, \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c \u0438 \u0443\u0434\u043e\u0431\u0441\u0442\u0432\u0430 \u0434\u043b\u044f \u0441\u0435\u043c\u044c\u0438 \u0432 Villa Silyan. \u0411\u0440\u043e\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0434\u043b\u044f \u043b\u0443\u0447\u0448\u0435\u0439 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u0438 \u0438 \u043d\u0430\u0438\u043b\u0443\u0447\u0448\u0438\u0445 \u043f\u0440\u044f\u043c\u044b\u0445 \u0446\u0435\u043d.",
    peaceEyebrow:
      "\u0421\u043f\u043e\u043a\u043e\u0439\u0441\u0442\u0432\u0438\u0435 \u0440\u043e\u0434\u0438\u0442\u0435\u043b\u0435\u0439",
    peaceTitle:
      "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c \u0441\u0435\u043c\u044c\u0438: \u0432\u0441\u0451 \u0443\u0436\u0435 \u043f\u0440\u0435\u0434\u0443\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043e",
    peaceItems: [
      "\u041e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u0439 \u0432\u0445\u043e\u0434 \u0432 \u0431\u0430\u0441\u0441\u0435\u0439\u043d",
      "\u0414\u0435\u0442\u0441\u043a\u0438\u0439 \u0434\u0438\u0437\u0430\u0439\u043d: \u043d\u0438\u043a\u0430\u043a\u0438\u0445 \u043e\u0441\u0442\u0440\u044b\u0445 \u0443\u0433\u043b\u043e\u0432 \u0438 \u0445\u0440\u0443\u043f\u043a\u043e\u0433\u043e \u0434\u0435\u043a\u043e\u0440\u0430",
      "\u041a\u0440\u043e\u0432\u0430\u0442\u043a\u0438 \u0434\u043b\u044f \u043c\u043b\u0430\u0434\u0435\u043d\u0446\u0435\u0432 \u0438 \u0441\u0442\u0443\u043b\u0447\u0438\u043a\u0438 \u043f\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0443",
      "\u041e\u0445\u0440\u0430\u043d\u0430 24/7 \u0438 \u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c\u044b\u0439 \u0432\u044a\u0435\u0437\u0434 \u0432 \u043f\u043e\u0441\u0451\u043b\u043e\u043a",
      "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0441\u0430\u0434 \u0434\u043b\u044f \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0445 \u0438\u0433\u0440 \u043d\u0430 \u0441\u0432\u0435\u0436\u0435\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435",
    ],
    quickFactsTitle:
      "\u041a\u0440\u0430\u0442\u043a\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
    quickFacts: [
      { label: "\u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435 \u043f\u043b\u044f\u0436\u0438", value: "\u041f\u043b\u044f\u0436 \u041b\u0430\u0440\u0430 \u0438 \u043f\u043b\u044f\u0436 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b" },
      { label: "\u041b\u0443\u0447\u0448\u0435 \u0432\u0441\u0435\u0433\u043e \u0434\u043b\u044f", value: "\u0421\u0435\u043c\u0435\u0439, \u0436\u0435\u043b\u0430\u044e\u0449\u0438\u0445 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438, \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u0430 \u0438 \u0447\u0430\u0441\u0442\u043d\u043e\u0433\u043e \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430" },
      { label: "\u0418\u0434\u0435\u044f \u0434\u043b\u044f \u0446\u0435\u043b\u043e\u0433\u043e \u0434\u043d\u044f", value: "\u041f\u043b\u044f\u0436 \u041a\u0430\u043f\u0443\u0442\u0430\u0448 \u2014 \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u043d\u0430\u044f \u043f\u043e\u0435\u0437\u0434\u043a\u0430" },
    ],
  },
};

type Props = {
  params: Promise<{ lang: string; siteSlug?: string }>;
  pathPrefix?: string;
};

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-500)] text-white"
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </span>
  );
}

export async function generatePrivateFamilyVillasInAntalyaMetadata({
  params,
  pathPrefix = "",
}: Props): Promise<Metadata> {
  const p = await params;
  const safeLang = isLang(p.lang) ? p.lang : "en";
  const m = ((COPY[safeLang] ?? COPY.en) as LangCopy).meta;

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const pagePath = villaPath(pathPrefix, `/${p.lang}/${PAGE_SLUG}`);
  const canonical = `${origin.origin}${pagePath}`;

  const siteSlug = p.siteSlug ?? h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const activeLangs = ctx ? getActiveLangs(ctx) : ["en"];
  const languages: Record<string, string> = Object.fromEntries(
    activeLangs.map((lang) => [
      lang,
      `${origin.origin}${villaPath(pathPrefix, `/${lang}/${PAGE_SLUG}`)}`,
    ]),
  );
  const defaultLang = ctx?.site.defaultLanguage ?? "en";
  if (activeLangs.includes(defaultLang)) {
    languages["x-default"] = `${origin.origin}${villaPath(pathPrefix, `/${defaultLang}/${PAGE_SLUG}`)}`;
  }

  return {
    title: m.title,
    description: m.description,
    alternates: { canonical, languages },
    openGraph: {
      title: m.title,
      description: m.description,
      url: canonical,
      type: "article",
      siteName: "Villa Silyan",
      images: [
        {
          url: HERO_IMAGE,
          width: 1024,
          height: 576,
          alt: m.heroAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [HERO_IMAGE],
    },
  };
}

export default async function PrivateFamilyVillasInAntalyaPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const safeLang = isLang(lang) ? lang : "en";
  const c = (COPY[safeLang] ?? COPY.en) as LangCopy;

  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const pillarHref = pagePath(`/${PILLAR_SLUG}`);

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const heroImageUrl = `${origin}${HERO_IMAGE}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.meta.jsonLdHeadline,
    description: c.meta.description,
    image: [heroImageUrl],
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
    author: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: c.meta.jsonLdHeadline,
    description: c.meta.description,
    image: [heroImageUrl],
    brand: {
      "@type": "Brand",
      name: "Villa Silyan",
    },
    category: "Vacation rental villa",
    url: articleUrl,
    offers: {
      "@type": "Offer",
      url: DIRECT_BOOKING_URL,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Script
        id="jsonld-private-family-villas-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <Script
        id="jsonld-private-family-villas-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(productLd) }}
      />

      <div className="bg-[var(--color-bg)] pt-24 pb-20">
        <article className="content-wrapper">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-500)]">
                {c.eyebrow}
              </p>
              <a
                href={DIRECT_BOOKING_URL}
                className="hidden rounded-full bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-600)] md:inline-flex"
              >
                {c.checkAvailability}
              </a>
            </div>

            <header className="max-w-4xl">
              <h1 className="font-serif text-h1 font-semibold leading-tight text-[var(--color-text-primary)]">
                {c.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                {c.subtitle}
              </p>
            </header>

            <figure className="relative mt-8 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/10] md:aspect-[16/8]">
                <Image
                  src={HERO_IMAGE}
                  alt={c.meta.heroAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1120px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                {c.figcaption}
              </figcaption>
            </figure>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {c.heroStats.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-500)]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-14">
                {/* Why */}
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.whyTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.whyBody1}</p>
                    <p>
                      {safeLang === "ru" ? (
                        <>
                          <Link
                            href={pillarHref}
                            className="font-medium text-[var(--accent-500)] underline decoration-[var(--accent-300)] underline-offset-4 hover:text-[var(--accent-600)]"
                          >
                            {c.whyLinkText}
                          </Link>{" "}
                          {c.whyBody2}
                        </>
                      ) : (
                        <>
                          {safeLang === "ar"
                            ? c.whyBody2 + " "
                            : "For families comparing Antalya accommodation options, our main guide to "}
                          <Link
                            href={pillarHref}
                            className="font-medium text-[var(--accent-500)] underline decoration-[var(--accent-300)] underline-offset-4 hover:text-[var(--accent-600)]"
                          >
                            {c.whyLinkText}
                          </Link>{" "}
                          {safeLang === "en"
                            ? c.whyBody2
                            : safeLang === "ar"
                              ? ""
                              : c.whyBody2}
                        </>
                      )}
                    </p>
                  </div>
                </section>

                {/* Child Safe */}
                <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.childSafeTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.childSafeBody1}</p>
                    <p>{c.childSafeBody2}</p>
                  </div>
                </section>

                {/* Kitchen */}
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.kitchenTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.kitchenBody1}</p>
                    <p>{c.kitchenBody2}</p>
                  </div>
                </section>

                {/* Privacy */}
                <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.privacyTitle}
                  </h2>
                  <div className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.privacyBody}</p>
                  </div>
                </section>

                {/* Indoor-Outdoor */}
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.indoorOutdoorTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.indoorOutdoorBody}</p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      <li className="rounded-2xl bg-white/70 p-4 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                        <strong>{c.indoorLabel}:</strong> {c.indoorText}
                      </li>
                      <li className="rounded-2xl bg-white/70 p-4 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
                        <strong>{c.outdoorLabel}:</strong> {c.outdoorText}
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Comparison */}
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.comparisonTitle}
                  </h2>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                    <table className="w-full border-collapse bg-[var(--color-surface)] text-left text-sm">
                      <thead className="bg-[var(--accent-muted)] text-[var(--color-text-primary)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">{c.compAspect}</th>
                          <th className="px-4 py-3 font-semibold">Villa Silyan</th>
                          <th className="px-4 py-3 font-semibold">{c.comp5Star}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {c.compRows.map(([aspect, villa, hotel]) => (
                          <tr key={aspect}>
                            <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{aspect}</td>
                            <td className="px-4 py-3">{villa}</td>
                            <td className="px-4 py-3">{hotel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Local Tips */}
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.localTipsTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.localTipsIntro}</p>
                    <ul className="space-y-3">
                      {c.localTips.map((tip) => (
                        <li key={tip.label}>
                          <strong>{tip.label}:</strong> {tip.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Driving */}
                <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.drivingTitle}
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <p>{c.drivingBody1}</p>
                    <p>{c.drivingBody2}</p>
                  </div>
                </section>

                {/* CTA */}
                <div className="rounded-[2rem] bg-[var(--color-text-primary)] p-8 text-white shadow-[var(--shadow-lg)] md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-300)]">
                    {c.ctaEyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold">
                    {c.ctaTitle}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
                    {c.ctaBody}
                  </p>
                  <a
                    href={DIRECT_BOOKING_URL}
                    className="mt-7 inline-flex rounded-full bg-[var(--accent-500)] px-7 py-4 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:brightness-110"
                  >
                    {c.checkAvailabilityCta}
                  </a>
                </div>
              </div>

              <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                {/* Peace of Mind Checklist */}
                <aside className="rounded-[2rem] border border-[var(--accent-300)] bg-[var(--accent-muted)] p-6 shadow-[var(--shadow-md)] md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-600)]">
                    {c.peaceEyebrow}
                  </p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--color-text-primary)]">
                    {c.peaceTitle}
                  </h2>
                  <ul className="mt-6 space-y-4">
                    {c.peaceItems.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-primary)]">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* Quick Facts */}
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
                  <h2 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    {c.quickFactsTitle}
                  </h2>
                  <dl className="mt-5 space-y-4 text-sm">
                    {c.quickFacts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="font-semibold text-[var(--color-text-primary)]">{fact.label}</dt>
                        <dd className="mt-1 text-[var(--color-text-secondary)]">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
