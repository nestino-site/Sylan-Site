import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { isLang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "villas-in-antalya-with-private-pool";
const HERO_IMAGE = "/silyan-pillar/private-infinity-pool-villa-silyan-antalya.png";
const INFINITY_POOL_IMAGE = "/silyan-pillar/villa-silyan-private-pool-garden.png";
const LIFESTYLE_IMAGE = "/silyan-pillar/luxury-villa-antalya-pool-lifestyle.png";

type LangCopy = {
  meta: {
    title: string;
    description: string;
    heroAlt: string;
    jsonLdHeadline: string;
  };
  eyebrow: string;
  h1: string;
  subtitle: string;
  heroAlt: string;
  bookNow: string;
  why: { title: string; body: string };
  privacy: { title: string; body: string; proTip: string };
  pools: { title: string; body: string; imgAlt: string };
  smartHome: { title: string; body: string };
  concierge: { title: string; body: string };
  comparison: {
    title: string;
    featureHeader: string;
    hotelHeader: string;
    rows: [string, string, string][];
  };
  explore: {
    title: string;
    antalyaLabel: string;
    afterAntalya: string;
    belekLabel: string;
    afterBelek: string;
    konyaaltiLabel: string;
    afterKonyaalti: string;
  };
  selfCatering: { title: string; body: string; imgAlt: string };
  featured: {
    title: string;
    villas: { slug: string; detail: string }[];
    viewLabel: string;
  };
  booking: { title: string; body: string };
  quickFacts: { title: string; facts: { label: string; value: string }[] };
  cta: { title: string; body: string; browseVillas: string };
  sidebar: { title: string; body: string; compareVillas: string };
};

const COPY: Record<string, LangCopy> = {
  en: {
    meta: {
      title: "Luxury Villas in Antalya with Private Pool | Villa Silyan",
      description:
        "Luxury Villas in Antalya with Private Pool at Villa Silyan: private infinity pools, gourmet kitchens, concierge service, and direct booking benefits.",
      heroAlt: "Private infinity pool at Villa Silyan Antalya",
      jsonLdHeadline:
        "Luxury Villas in Antalya with Private Pools: Experience Ultimate Privacy and Comfort",
    },
    eyebrow: "Antalya private pool villas",
    h1: "Luxury Villas in Antalya with Private Pools: Experience Ultimate Privacy and Comfort",
    subtitle:
      "Villa Silyan gives you the space of a private home, the polish of a boutique stay, and the rare pleasure of a pool that belongs only to you.",
    heroAlt: "Private infinity pool at Villa Silyan Antalya",
    bookNow: "Book Now",
    why: {
      title: "Why Choose Villa Silyan for Your Antalya Getaway?",
      body: "Villa Silyan offers a calm alternative to the busy rhythm of a five-star hotel. Here, luxury villas with private pools create a secluded base for slow mornings, long swims, and relaxed evenings outdoors. Wake to the quiet of the Mediterranean coast, enjoy your own pool, and cook or host at your own pace in a fully equipped gourmet kitchen.",
    },
    privacy: {
      title: "Unmatched Privacy: Enjoy Your Own Secluded Paradise",
      body: "Privacy is built into the Villa Silyan experience. High walls, generous gardens, and carefully planned landscaping help each villa feel like its own quiet retreat. Whether you are lounging by the pool or dining al fresco, you can relax without the interruptions that often come with shared hotel spaces.",
      proTip:
        "For a magical moment, take a sunset swim between 6:30 PM and 7:30 PM, when the Mediterranean sky softens into warm evening color.",
    },
    pools: {
      title: "Infinity Pools with Stunning Mediterranean Views",
      body: "The pools at Villa Silyan are more than a place to cool off. They create a private vantage point over the hills and toward the Mediterranean horizon. Each pool is carefully maintained, peaceful, and exclusively yours throughout your stay.",
      imgAlt: "Private pool and garden at Villa Silyan near Antalya",
    },
    smartHome: {
      title: "Smart Home Technology for Effortless Living",
      body: "Modern comfort is woven into the villa experience. Lighting, temperature, and entertainment systems are designed to feel intuitive, so your stay stays easy from the first evening to the last morning.",
    },
    concierge: {
      title: "Concierge Services: Personalized Experiences Await",
      body: "The concierge team can help shape each day around the way you like to travel: a private chef, a yacht tour, an airport transfer, or a day trip to ancient Perge. The result is a stay that feels personal rather than packaged.",
    },
    comparison: {
      title: "Hotel vs. Private Villa: The Luxury of Space and Freedom",
      featureHeader: "Feature",
      hotelHeader: "5-Star Hotel in Antalya",
      rows: [
        ["Privacy", "Complete seclusion", "Shared spaces"],
        ["Pool", "Private infinity pool", "Shared hotel pool"],
        ["Space", "Spacious living areas", "Limited room space"],
        ["Personalization", "Tailored concierge services", "Standard hotel services"],
        ["Dining", "Self-catering gourmet kitchens", "Hotel restaurants"],
      ],
    },
    explore: {
      title: "Explore Antalya: From Belek\u2019s Golf Courses to Konyaalt\u0131\u2019s Beaches",
      antalyaLabel: "Antalya",
      afterAntalya:
        " is full of coastal days, mountain air, historic sites, and easy day trips. Tee off at the world-class golf courses in\u00a0",
      belekLabel: "Belek",
      afterBelek: "\u00a0or spend the afternoon by the water at\u00a0",
      konyaaltiLabel: "Konyaalt\u0131",
      afterKonyaalti:
        "\u00a0Beach. From Villa Silyan, Belek is about a 30-minute drive, while Konyaalt\u0131 Beach can be reached in under 20 minutes.",
    },
    selfCatering: {
      title: "Self-Catering Made Easy: Gourmet Kitchens at Your Disposal",
      body: "Every villa is prepared for self-catering comfort, whether you are making a family breakfast, a relaxed lunch after the pool, or a romantic dinner for two. This freedom is one of the biggest advantages over hotel dining, where meal times and menus can shape your day for you.",
      imgAlt: "Outdoor self-catering lifestyle at Villa Silyan Antalya",
    },
    featured: {
      title: "A Few Villas to Start With",
      villas: [
        { slug: "defne", detail: "5 bedrooms, private pool, ideal for extended families" },
        { slug: "portakal", detail: "5 bedrooms, generous garden, made for group stays" },
        { slug: "mandalina", detail: "3 bedrooms, mountain backdrop, close to Konyaalt\u0131" },
      ],
      viewLabel: "View villa",
    },
    booking: {
      title: "Booking Your Stay: Direct Rates and Exclusive Offers",
      body: "Booking directly through Villa Silyan helps you access the best available rates, current villa availability, and exclusive offers that may not appear on third-party platforms. Secure your slice of privacy and start planning your Antalya escape.",
    },
    quickFacts: {
      title: "Quick Facts",
      facts: [
        { label: "Location", value: "Antalya, Turkey: Belek, Lara, Konyaalt\u0131" },
        {
          label: "Core benefits",
          value: "Absolute privacy, infinity pools, concierge service, smart home comfort",
        },
        { label: "Best sunset swim", value: "6:30 PM to 7:30 PM" },
        { label: "Drive to Belek", value: "Approximately 30 minutes" },
        { label: "Drive to Konyaalt\u0131 Beach", value: "Under 20 minutes" },
        { label: "Booking advantage", value: "Direct rates and exclusive offers" },
      ],
    },
    cta: {
      title: "Begin Your Private Antalya Stay",
      body: "Begin your luxurious and tranquil stay at Villa Silyan, where every detail is designed to give you more space, more privacy, and more time together.",
      browseVillas: "Browse all villas",
    },
    sidebar: {
      title: "Ready for a private pool stay?",
      body: "Check direct availability and get the best route into Villa Silyan\u2019s current offers.",
      compareVillas: "Compare villas",
    },
  },

  tr: {
    meta: {
      title: "Antalya\u2019da \u00d6zel Havuzlu L\u00fcks Villalar | Villa Silyan",
      description:
        "Antalya\u2019da \u00f6zel sonsuzluk havuzlu l\u00fcks villalar. Villa Silyan ile tam gizlilik, gurme mutfak ve konsiyerj hizmeti. En iyi fiyatlar i\u00e7in do\u011frudan rezervasyon yap\u0131n.",
      heroAlt: "Villa Silyan Antalya\u2019da \u00f6zel sonsuzluk havuzu",
      jsonLdHeadline:
        "Antalya\u2019da \u00d6zel Havuzlu L\u00fcks Villalar: E\u015fsiz Gizlilik ve Konfor",
    },
    eyebrow: "Antalya \u00f6zel havuzlu villalar",
    h1: "Antalya\u2019da \u00d6zel Havuzlu L\u00fcks Villalar: E\u015fsiz Gizlilik ve Konfor",
    subtitle:
      "Villa Silyan, size \u00f6zel bir evin ferahlı\u011f\u0131n\u0131, butik bir konaklama yerine has zarafeti ve yaln\u0131zca size ait bir havuzun nadir zevkini sunar.",
    heroAlt: "Villa Silyan Antalya\u2019da \u00f6zel sonsuzluk havuzu",
    bookNow: "Rezervasyon Yap",
    why: {
      title: "Antalya Tatili \u0130\u00e7in Neden Villa Silyan?",
      body: "Villa Silyan, be\u015f y\u0131ld\u0131zl\u0131 bir otelin yo\u011fun temposuna sakin bir alternatif sunar. \u00d6zel havuzlu l\u00fcks villalar, sessiz sabahlar, uzun y\u00fcz\u00fc\u015fler ve huzurlu ak\u015famlar i\u00e7in ideal bir s\u0131\u011f\u0131nak olu\u015fturur. Akdeniz k\u0131y\u0131s\u0131n\u0131n dinginli\u011finde uyan\u0131n, kendi havuzunuzun keyfini \u00e7\u0131kar\u0131n ve tam donan\u0131ml\u0131 gurme mutfa\u011f\u0131n\u0131zda istedi\u011finiz ritimde yemek pi\u015firin ya da misafir a\u011f\u0131rlay\u0131n.",
    },
    privacy: {
      title: "Benzersiz Gizlilik: Kendi Sakin Cennetinizi Ke\u015ffedin",
      body: "Gizlilik, Villa Silyan deneyiminin ayr\u0131lmaz bir par\u00e7as\u0131d\u0131r. Y\u00fcksek duvarlar, geni\u015f bah\u00e7eler ve \u00f6zenle tasarlanm\u0131\u015f peyzaj, her villayı sakin bir dinlenme k\u00f6\u015fesine d\u00f6n\u00fc\u015ft\u00fcr\u00fcr. Havuz ba\u015f\u0131nda uzanırken ya da a\u00e7\u0131k havada yemek yerken, ortak otel alanlar\u0131n\u0131n getirdi\u011fi rahats\u0131zl\u0131klardan uzak kal\u0131rs\u0131n\u0131z.",
      proTip:
        "B\u00fcy\u00fcl\u00fc bir an i\u00e7in, Akdeniz g\u00f6ky\u00fcz\u00fcn\u00fcn s\u0131cak ak\u015fam renklerine b\u00fcr\u00fcnd\u00fc\u011f\u00fc 18:30 ile 19:30 aras\u0131nda g\u00fcn bat\u0131m\u0131 y\u00fcz\u00fc\u015f\u00fc yap\u0131n.",
    },
    pools: {
      title: "Muhte\u015fem Akdeniz Manzaral\u0131 Sonsuzluk Havuzlar\u0131",
      body: "Villa Silyan\u2019daki havuzlar yaln\u0131zca serinlemek i\u00e7in bir yer de\u011fildir. Tepelerin \u00f6tesinde Akdeniz ufkuna a\u00e7\u0131lan \u00f6zel bir bak\u0131\u015f noktas\u0131 olu\u015ftururlar. Her havuz titizlikle bak\u0131l\u0131r, huzurludur ve konaklama s\u00fcresince yaln\u0131zca size aittir.",
      imgAlt: "Antalya yak\u0131nlar\u0131nda Villa Silyan\u2019\u0131n \u00f6zel havuzu ve bah\u00e7esi",
    },
    smartHome: {
      title: "Ak\u0131ll\u0131 Ev Teknolojisiyle Kolay Ya\u015fam",
      body: "Modern konfor, villa deneyimine sinmi\u015ftir. Ayd\u0131nlatma, \u0131s\u0131 ve e\u011flence sistemleri sezgisel bi\u00e7imde tasarlanm\u0131\u015ft\u0131r; b\u00f6ylece ilk ak\u015famdan son sabaha kadar konaklamanz\u0131z rahat ge\u00e7er.",
    },
    concierge: {
      title: "Konsiyerj Hizmetleri: Ki\u015fisel Deneyimler Sizi Bekliyor",
      body: "Konsiyerj ekibi, her g\u00fcn\u00fc sizin seyahat tarz\u0131n\u0131za g\u00f6re \u015fekillendirmenize yard\u0131mc\u0131 olur: \u00f6zel a\u015f\u00e7\u0131, yat turu, havaliman\u0131 transferi ya da antik Perge\u2019ye g\u00fcn\u00fcbirlik gezi. Sonu\u00e7, paket tatil de\u011fil, ki\u015fisel bir konaklama deneyimidir.",
    },
    comparison: {
      title: "Otel mi, \u00d6zel Villa m\u0131? Mekan ve \u00d6zg\u00fcrl\u00fc\u011f\u00fcn L\u00fcks\u00fc",
      featureHeader: "\u00d6zellik",
      hotelHeader: "Antalya 5 Y\u0131ld\u0131zl\u0131 Otel",
      rows: [
        ["Gizlilik", "Tam izolasyon", "Ortak alanlar"],
        ["Havuz", "\u00d6zel sonsuzluk havuzu", "Ortak otel havuzu"],
        ["Mekan", "Geni\u015f ya\u015fam alanlar\u0131", "S\u0131n\u0131rl\u0131 oda alan\u0131"],
        ["Ki\u015fisellik", "\u00d6zel konsiyerj hizmetleri", "Standart otel hizmetleri"],
        ["Yemek", "Kendi kendine catering gurme mutfaklar\u0131", "Otel restoranlar\u0131"],
      ],
    },
    explore: {
      title:
        "Antalya\u2019y\u0131 Ke\u015ffedin: Belek Golf Sahalar\u0131ndan Konyaalt\u0131 Plajlar\u0131na",
      antalyaLabel: "Antalya",
      afterAntalya:
        " sahil g\u00fcnleri, da\u011f havas\u0131, tarihi alanlar ve kolay g\u00fcn\u00fcbirlik gezilerle doludur. D\u00fcnyaca \u00fcnl\u00fc golf sahalar\u0131nda\u00a0",
      belekLabel: "Belek",
      afterBelek: "\u2019te tee vuru\u015fu yap\u0131n ya da \u00f6\u011fleden sonray\u0131\u00a0",
      konyaaltiLabel: "Konyaalt\u0131",
      afterKonyaalti:
        "\u00a0sahilinde ge\u00e7irin. Villa Silyan\u2019dan Belek yakla\u015f\u0131k 30 dakika, Konyaalt\u0131 Plaj\u0131 ise 20 dakikadan az s\u00fcrede ula\u015f\u0131labilir.",
    },
    selfCatering: {
      title: "Kendi Kendine Catering Kolayla\u015ft\u0131: Gurme Mutfaklar Emrinizde",
      body: "Her villa, sabah kahvalt\u0131s\u0131, havuz sonras\u0131 rahat \u00f6\u011fle yeme\u011fi veya ikili romantik ak\u015fam yeme\u011fi i\u00e7in kendi kendine catering konforuna haz\u0131rd\u0131r. Bu \u00f6zg\u00fcrl\u00fck, yemek saatlerinin ve men\u00fclerin g\u00fcn\u00fcn\u00fcz\u00fc bi\u00e7imlendirdi\u011fi otel restoranlar\u0131na k\u0131yasla en b\u00fcy\u00fck avantajlardan biridir.",
      imgAlt: "Villa Silyan Antalya\u2019da a\u00e7\u0131k havada kendi kendine catering ya\u015fam\u0131",
    },
    featured: {
      title: "Ba\u015flamak \u0130\u00e7in Birka\u00e7 Villa",
      villas: [
        {
          slug: "defne",
          detail: "5 yatak odas\u0131, \u00f6zel havuz, geni\u015f aileler i\u00e7in ideal",
        },
        {
          slug: "portakal",
          detail:
            "5 yatak odas\u0131, geni\u015f bah\u00e7e, grup konaklamalar\u0131 i\u00e7in bi\u00e7ilmi\u015f kaftan",
        },
        {
          slug: "mandalina",
          detail: "3 yatak odas\u0131, da\u011f manzaras\u0131, Konyaalt\u0131 yak\u0131n\u0131",
        },
      ],
      viewLabel: "Villay\u0131 incele",
    },
    booking: {
      title: "Rezervasyonunuz: Do\u011frudan Fiyatlar ve \u00d6zel Teklifler",
      body: "Villa Silyan \u00fczerinden do\u011frudan rezervasyon yaparak en uygun fiyatlara, g\u00fcncel m\u00fcs\u00e4itlik bilgilerine ve \u00fc\u00e7\u00fcnc\u00fc taraf platformlarda bulunmayan \u00f6zel tekliflere eri\u015febilirsiniz. Gizlili\u011finizin tad\u0131n\u0131 \u00e7\u0131kar\u0131n ve Antalya ka\u00e7aman\u0131z\u0131 planlamaya ba\u015flay\u0131n.",
    },
    quickFacts: {
      title: "H\u0131zl\u0131 Bilgiler",
      facts: [
        { label: "Konum", value: "Antalya, T\u00fcrkiye: Belek, Lara, Konyaalt\u0131" },
        {
          label: "Temel avantajlar",
          value: "Tam gizlilik, sonsuzluk havuzlar\u0131, konsiyerj, ak\u0131ll\u0131 ev konforu",
        },
        { label: "En iyi g\u00fcn bat\u0131m\u0131 y\u00fcz\u00fc\u015f\u00fc", value: "18:30 \u2013 19:30" },
        { label: "Belek\u2019e mesafe", value: "Yakla\u015f\u0131k 30 dakika" },
        {
          label: "Konyaalt\u0131 Plaj\u0131\u2019na mesafe",
          value: "20 dakikadan az",
        },
        {
          label: "Rezervasyon avantaj\u0131",
          value: "Do\u011frudan fiyatlar ve \u00f6zel teklifler",
        },
      ],
    },
    cta: {
      title: "\u00d6zel Antalya Konaklamanz\u0131za Ba\u015flay\u0131n",
      body: "Her detay\u0131n size daha fazla alan, daha fazla gizlilik ve birlikte daha fazla vakit sunmak i\u00e7in tasarland\u0131\u011f\u0131 Villa Silyan\u2019da l\u00fcks ve huzurlu konaklamaz\u0131n\u0131za ba\u015flay\u0131n.",
      browseVillas: "T\u00fcm villaları g\u00f6zden ge\u00e7ir",
    },
    sidebar: {
      title: "\u00d6zel havuzlu tatile haz\u0131r m\u0131s\u0131n\u0131z?",
      body: "M\u00fcs\u00e4itli\u011fi do\u011frudan kontrol edin ve Villa Silyan\u2019\u0131n g\u00fcncel tekliflerine en iyi yolu bulun.",
      compareVillas: "Villalar\u0131 kar\u015f\u0131la\u015ft\u0131r",
    },
  },

  ar: {
    meta: {
      title: "\u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0628\u062d \u062e\u0627\u0635 | Villa Silyan",
      description:
        "\u0627\u0643\u062a\u0634\u0641 \u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0627\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a\u0629 \u062e\u0627\u0635\u0629. Villa Silyan \u064a\u0648\u0641\u0631 \u062e\u0635\u0648\u0635\u064a\u0629 \u062a\u0627\u0645\u0629 \u0648\u0645\u0637\u0628\u062e \u063a\u0648\u0631\u0645\u064a\u0647 \u0648\u062e\u062f\u0645\u0629 \u0643\u0648\u0646\u0633\u064a\u0631\u062c \u0634\u062e\u0635\u064a\u0629. \u0627\u062d\u062c\u0632 \u0645\u0628\u0627\u0634\u0631\u0629 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631.",
      heroAlt:
        "\u0645\u0633\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a \u062e\u0627\u0635 \u0641\u064a Villa Silyan \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
      jsonLdHeadline:
        "\u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0627\u0628\u062d \u062e\u0627\u0635\u0629: \u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u0637\u0644\u0642\u0629 \u0648\u0631\u0627\u062d\u0629 \u0644\u0627 \u0645\u062b\u064a\u0644 \u0644\u0647\u0627",
    },
    eyebrow:
      "\u0641\u064a\u0644\u0627\u062a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0630\u0627\u062a \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u062e\u0627\u0635",
    h1: "\u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0645\u0639 \u0645\u0633\u0627\u0628\u062d \u062e\u0627\u0635\u0629: \u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u0637\u0644\u0642\u0629 \u0648\u0631\u0627\u062d\u0629 \u0644\u0627 \u0645\u062b\u064a\u0644 \u0644\u0647\u0627",
    subtitle:
      "\u064a\u0645\u0646\u062d\u0643 Villa Silyan \u0645\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0646\u0632\u0644 \u0627\u0644\u062e\u0627\u0635 \u0648\u0623\u0646\u0627\u0642\u0629 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0627\u0644\u0641\u0646\u062f\u0642\u064a\u0629 \u0627\u0644\u0631\u0627\u0642\u064a\u0629 \u0648\u0627\u0644\u0645\u062a\u0639\u0629 \u0627\u0644\u0646\u0627\u062f\u0631\u0629 \u0644\u0645\u0633\u0628\u062d \u064a\u062e\u0635\u0643 \u0648\u062d\u062f\u0643.",
    heroAlt:
      "\u0645\u0633\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a \u062e\u0627\u0635 \u0641\u064a Villa Silyan \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    bookNow:
      "\u0627\u062d\u062c\u0632 \u0627\u0644\u0622\u0646",
    why: {
      title:
        "\u0644\u0645\u0627\u0630\u0627 \u062a\u062e\u062a\u0627\u0631 Villa Silyan \u0644\u0625\u062c\u0627\u0632\u062a\u0643 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627\u061f",
      body: "\u064a\u0642\u062f\u0645 Villa Silyan \u0628\u062f\u064a\u0644\u0627\u064b \u0647\u0627\u062f\u0626\u0627\u064b \u0639\u0646 \u0627\u0644\u0625\u064a\u0642\u0627\u0639 \u0627\u0644\u0645\u0632\u062f\u062d\u0645 \u0644\u0641\u0646\u0627\u062f\u0642 \u0627\u0644\u062e\u0645\u0633 \u0646\u062c\u0648\u0645. \u062a\u0648\u0641\u0631 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0641\u0627\u062e\u0631\u0629 \u0630\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0628\u062d \u0627\u0644\u062e\u0627\u0635\u0629 \u0642\u0627\u0639\u062f\u0629 \u0645\u0646\u0639\u0632\u0644\u0629 \u0644\u0644\u0635\u0628\u0627\u062d\u0627\u062a \u0627\u0644\u0647\u0627\u062f\u0626\u0629 \u0648\u0627\u0644\u0633\u0628\u0627\u062d\u0629 \u0627\u0644\u0637\u0648\u064a\u0644\u0629 \u0648\u0627\u0644\u0623\u0645\u0633\u064a\u0627\u062a \u0627\u0644\u0645\u0631\u064a\u062d\u0629. \u0627\u0633\u062a\u064a\u0642\u0638 \u0639\u0644\u0649 \u0647\u062f\u0648\u0621 \u0627\u0644\u0633\u0627\u062d\u0644 \u0627\u0644\u0645\u062a\u0648\u0633\u0637\u064a\u060c \u0648\u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u0645\u0633\u0628\u062d\u0643 \u0627\u0644\u062e\u0627\u0635\u060c \u0648\u0623\u0639\u062f\u0651 \u0627\u0644\u0637\u0639\u0627\u0645 \u0623\u0648 \u0627\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u0636\u064a\u0648\u0641 \u0628\u0648\u062a\u064a\u0631\u062a\u0643 \u0641\u064a \u0645\u0637\u0628\u062e \u063a\u0648\u0631\u0645\u064a\u0647 \u0645\u062a\u0643\u0627\u0645\u0644.",
    },
    privacy: {
      title:
        "\u062e\u0635\u0648\u0635\u064a\u0629 \u0644\u0627 \u0645\u062b\u064a\u0644 \u0644\u0647\u0627: \u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u062c\u0646\u062a\u0643 \u0627\u0644\u0645\u0646\u0639\u0632\u0644\u0629",
      body: "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u062a\u062c\u0630\u0631\u0629 \u0641\u064a \u062a\u062c\u0631\u0628\u0629 Villa Silyan. \u0627\u0644\u062c\u062f\u0631\u0627\u0646 \u0627\u0644\u0639\u0627\u0644\u064a\u0629 \u0648\u0627\u0644\u062d\u062f\u0627\u0626\u0642 \u0627\u0644\u0648\u0627\u0633\u0639\u0629 \u0648\u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u0645\u0646\u0627\u0638\u0631 \u0627\u0644\u062f\u0642\u064a\u0642 \u062a\u062c\u0639\u0644 \u0643\u0644 \u0641\u064a\u0644\u0627 \u0645\u0644\u0627\u0630\u0627\u064b \u0647\u0627\u062f\u0626\u0627\u064b. \u0633\u0648\u0627\u0621 \u0643\u0646\u062a \u062a\u0633\u062a\u0631\u062e\u064a \u0628\u062c\u0627\u0646\u0628 \u0627\u0644\u0645\u0633\u0628\u062d \u0623\u0648 \u062a\u062a\u0646\u0627\u0648\u0644 \u0627\u0644\u0639\u0634\u0627\u0621 \u0641\u064a \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0637\u0644\u0642\u060c \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0627\u0633\u062a\u0631\u062e\u0627\u0621 \u062f\u0648\u0646 \u0623\u064a \u0645\u0642\u0627\u0637\u0639\u0627\u062a.",
      proTip:
        "\u0644\u062d\u0638\u0629 \u0633\u062d\u0631\u064a\u0629: \u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u0633\u0628\u0627\u062d\u0629 \u063a\u0631\u0648\u0628 \u0627\u0644\u0634\u0645\u0633 \u0628\u064a\u0646 \u0627\u0644\u0633\u0627\u0639\u0629 18:30 \u0648 19:30\u060c \u062d\u064a\u0646 \u064a\u062a\u062d\u0648\u0644 \u0633\u0645\u0627\u0621 \u0627\u0644\u0628\u062d\u0631 \u0627\u0644\u0645\u062a\u0648\u0633\u0637 \u0625\u0644\u0649 \u062f\u0641\u0621 \u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u0645\u0633\u0627\u0621.",
    },
    pools: {
      title:
        "\u0645\u0633\u0627\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a\u0629 \u0628\u0625\u0637\u0644\u0627\u0644\u0627\u062a \u0645\u062a\u0648\u0633\u0637\u064a\u0629 \u062e\u0644\u0627\u0628\u0629",
      body: "\u0645\u0633\u0627\u0628\u062d Villa Silyan \u0644\u064a\u0633\u062a \u0645\u062c\u0631\u062f \u0645\u0643\u0627\u0646 \u0644\u0644\u062a\u0628\u0631\u064a\u062f. \u062a\u0648\u0641\u0631 \u0646\u0642\u0637\u0629 \u0645\u0634\u0627\u0647\u062f\u0629 \u062e\u0627\u0635\u0629 \u0641\u0648\u0642 \u0627\u0644\u062a\u0644\u0627\u0644 \u0646\u062d\u0648 \u0623\u0641\u0642 \u0627\u0644\u0628\u062d\u0631 \u0627\u0644\u0645\u062a\u0648\u0633\u0637. \u0643\u0644 \u0645\u0633\u0628\u062d \u0645\u064f\u0635\u0627\u0646 \u0628\u0639\u0646\u0627\u064a\u0629\u060c \u0647\u0627\u062f\u0626\u060c \u0648\u064a\u062e\u0635\u0643 \u0648\u062d\u062f\u0643 \u0637\u0648\u0627\u0644 \u0641\u062a\u0631\u0629 \u0625\u0642\u0627\u0645\u062a\u0643.",
      imgAlt:
        "\u0645\u0633\u0628\u062d \u062e\u0627\u0635 \u0648\u062d\u062f\u064a\u0642\u0629 \u0641\u064a Villa Silyan \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    },
    smartHome: {
      title: "\u062a\u0642\u0646\u064a\u0629 \u0627\u0644\u0645\u0646\u0632\u0644 \u0627\u0644\u0630\u0643\u064a \u0644\u062d\u064a\u0627\u0629 \u0633\u0647\u0644\u0629",
      body: "\u0627\u0644\u0631\u0627\u062d\u0629 \u0627\u0644\u0639\u0635\u0631\u064a\u0629 \u0645\u0646\u0633\u0648\u062c\u0629 \u0641\u064a \u062a\u062c\u0631\u0628\u0629 \u0627\u0644\u0641\u064a\u0644\u0627. \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u0625\u0636\u0627\u0621\u0629 \u0648\u062f\u0631\u062c\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u0629 \u0648\u0627\u0644\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0631\u0641\u064a\u0647\u064a\u0629 \u0645\u0635\u0645\u0645\u0629 \u0644\u062a\u0643\u0648\u0646 \u0633\u0647\u0644\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645\u060c \u062d\u062a\u0649 \u062a\u0638\u0644 \u0625\u0642\u0627\u0645\u062a\u0643 \u0645\u0631\u064a\u062d\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u0627\u0621 \u0627\u0644\u0623\u0648\u0644 \u062d\u062a\u0649 \u0627\u0644\u0635\u0628\u0627\u062d \u0627\u0644\u0623\u062e\u064a\u0631.",
    },
    concierge: {
      title:
        "\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0643\u0648\u0646\u0633\u064a\u0631\u062c: \u062a\u062c\u0627\u0631\u0628 \u0645\u062e\u0635\u0635\u0629 \u062a\u0646\u062a\u0638\u0631\u0643",
      body: "\u064a\u0645\u0643\u0646 \u0644\u0641\u0631\u064a\u0642 \u0627\u0644\u0643\u0648\u0646\u0633\u064a\u0631\u062c \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0641\u064a \u062a\u0634\u0643\u064a\u0644 \u0643\u0644 \u064a\u0648\u0645 \u0648\u0641\u0642 \u0623\u0633\u0644\u0648\u0628 \u0633\u0641\u0631\u0643: \u0637\u0627\u0647\u064d \u062e\u0627\u0635\u060c \u062c\u0648\u0644\u0629 \u064a\u062e\u062a\u060c \u0646\u0642\u0644 \u0645\u0646 \u0627\u0644\u0645\u0637\u0627\u0631\u060c \u0623\u0648 \u0631\u062d\u0644\u0629 \u064a\u0648\u0645\u064a\u0629 \u0625\u0644\u0649 \u0628\u064a\u0631\u062c\u064a \u0627\u0644\u0623\u062b\u0631\u064a\u0629. \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0625\u0642\u0627\u0645\u0629 \u0634\u062e\u0635\u064a\u0629 \u0644\u0627 \u0628\u0627\u0642\u0629 \u0633\u064a\u0627\u062d\u064a\u0629.",
    },
    comparison: {
      title:
        "\u0627\u0644\u0641\u0646\u062f\u0642 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0641\u064a\u0644\u0627 \u0627\u0644\u062e\u0627\u0635\u0629: \u0631\u0641\u0627\u0647\u064a\u0629 \u0627\u0644\u0645\u0633\u0627\u062d\u0629 \u0648\u0627\u0644\u062d\u0631\u064a\u0629",
      featureHeader: "\u0627\u0644\u0645\u064a\u0632\u0629",
      hotelHeader:
        "\u0641\u0646\u062f\u0642 \u062e\u0645\u0633 \u0646\u062c\u0648\u0645 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
      rows: [
        [
          "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629",
          "\u0639\u0632\u0644\u0629 \u062a\u0627\u0645\u0629",
          "\u0645\u0631\u0627\u0641\u0642 \u0645\u0634\u062a\u0631\u0643\u0629",
        ],
        [
          "\u0627\u0644\u0645\u0633\u0628\u062d",
          "\u0645\u0633\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a \u062e\u0627\u0635",
          "\u0645\u0633\u0628\u062d \u0641\u0646\u062f\u0642\u064a \u0645\u0634\u062a\u0631\u0643",
        ],
        [
          "\u0627\u0644\u0645\u0633\u0627\u062d\u0629",
          "\u0645\u0646\u0627\u0637\u0642 \u0645\u0639\u064a\u0634\u064a\u0629 \u0641\u0633\u064a\u062d\u0629",
          "\u0645\u0633\u0627\u062d\u0629 \u063a\u0631\u0641\u0629 \u0645\u062d\u062f\u0648\u062f\u0629",
        ],
        [
          "\u0627\u0644\u062a\u062e\u0635\u064a\u0635",
          "\u062e\u062f\u0645\u0627\u062a \u0643\u0648\u0646\u0633\u064a\u0631\u062c \u0645\u062e\u0635\u0635\u0629",
          "\u062e\u062f\u0645\u0627\u062a \u0641\u0646\u062f\u0642\u064a\u0629 \u0642\u064a\u0627\u0633\u064a\u0629",
        ],
        [
          "\u0627\u0644\u0637\u0639\u0627\u0645",
          "\u0645\u0637\u0627\u0628\u062e \u063a\u0648\u0631\u0645\u064a\u0647 \u0644\u0644\u0637\u0647\u064a \u0627\u0644\u0630\u0627\u062a\u064a",
          "\u0645\u0637\u0627\u0639\u0645 \u0641\u0646\u062f\u0642\u064a\u0629",
        ],
      ],
    },
    explore: {
      title:
        "\u0627\u0633\u062a\u0643\u0634\u0641 \u0623\u0646\u0637\u0627\u0644\u064a\u0627: \u0645\u0646 \u0645\u0644\u0627\u0639\u0628 \u063a\u0648\u0644\u0641 \u0628\u064a\u0644\u064a\u0643 \u0625\u0644\u0649 \u0634\u0648\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a",
      antalyaLabel: "\u0623\u0646\u0637\u0627\u0644\u064a\u0627",
      afterAntalya:
        " \u0645\u0644\u064a\u0626\u0629 \u0628\u0623\u064a\u0627\u0645 \u0627\u0644\u0634\u0627\u0637\u0626 \u0648\u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u062c\u0628\u0644\u064a \u0648\u0627\u0644\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0648\u0627\u0644\u0631\u062d\u0644\u0627\u062a \u0627\u0644\u064a\u0648\u0645\u064a\u0629 \u0627\u0644\u0633\u0647\u0644\u0629. \u0627\u0644\u0639\u0628 \u0627\u0644\u063a\u0648\u0644\u0641 \u0639\u0644\u0649 \u0645\u0644\u0627\u0639\u0628 \u0645\u0633\u062a\u0648\u0649 \u0639\u0627\u0644\u0645\u064a \u0641\u064a\u00a0",
      belekLabel: "\u0628\u064a\u0644\u064a\u0643",
      afterBelek:
        "\u00a0\u0623\u0648 \u0627\u0642\u0636\u0650 \u0628\u0639\u062f \u0627\u0644\u0638\u0647\u0631 \u0628\u062c\u0627\u0646\u0628 \u0627\u0644\u0645\u064a\u0627\u0647 \u0639\u0644\u0649 \u0634\u0627\u0637\u0626\u00a0",
      konyaaltiLabel: "\u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a",
      afterKonyaalti:
        ". \u0645\u0646 Villa Silyan\u060c \u062a\u0628\u0639\u062f \u0628\u064a\u0644\u064a\u0643 \u0646\u062d\u0648 30 \u062f\u0642\u064a\u0642\u0629\u060c \u0648\u064a\u0645\u0643\u0646 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a \u0641\u064a \u0623\u0642\u0644 \u0645\u0646 20 \u062f\u0642\u064a\u0642\u0629.",
    },
    selfCatering: {
      title:
        "\u0627\u0644\u0637\u0647\u064a \u0627\u0644\u0630\u0627\u062a\u064a \u0623\u0635\u0628\u062d \u0633\u0647\u0644\u0627\u064b: \u0645\u0637\u0627\u0628\u062e \u063a\u0648\u0631\u0645\u064a\u0647 \u0641\u064a \u062e\u062f\u0645\u062a\u0643",
      body: "\u0643\u0644 \u0641\u064a\u0644\u0627 \u062c\u0627\u0647\u0632\u0629 \u0644\u0631\u0627\u062d\u0629 \u0627\u0644\u0637\u0647\u064a \u0627\u0644\u0630\u0627\u062a\u064a\u060c \u0633\u0648\u0627\u0621 \u0643\u0646\u062a \u062a\u062d\u0636\u0631 \u0641\u0637\u0648\u0631 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0623\u0648 \u063a\u062f\u0627\u0621\u064b \u0645\u0631\u064a\u062d\u064b\u0627 \u0628\u0639\u062f \u0627\u0644\u0633\u0628\u0627\u062d\u0629 \u0623\u0648 \u0639\u0634\u0627\u0621\u064b \u0631\u0648\u0645\u0627\u0646\u0633\u064a\u064b\u0627 \u0644\u0634\u062e\u0635\u064a\u0646. \u0647\u0630\u0647 \u0627\u0644\u062d\u0631\u064a\u0629 \u0645\u0646 \u0623\u0643\u0628\u0631 \u0645\u064a\u0632\u0627\u062a\u0643 \u0645\u0642\u0627\u0631\u0646\u0629\u064b \u0628\u0627\u0644\u0637\u0639\u0627\u0645 \u0627\u0644\u0641\u0646\u062f\u0642\u064a.",
      imgAlt:
        "\u0623\u0633\u0644\u0648\u0628 \u062d\u064a\u0627\u0629 \u0627\u0644\u0637\u0647\u064a \u0627\u0644\u0630\u0627\u062a\u064a \u0641\u064a \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u0637\u0644\u0642 \u0641\u064a Villa Silyan \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    },
    featured: {
      title: "\u0628\u0639\u0636 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0644\u062a\u0628\u062f\u0623 \u0628\u0647\u0627",
      villas: [
        {
          slug: "defne",
          detail:
            "5 \u063a\u0631\u0641 \u0646\u0648\u0645\u060c \u0645\u0633\u0628\u062d \u062e\u0627\u0635\u060c \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0645\u0645\u062a\u062f\u0629",
        },
        {
          slug: "portakal",
          detail:
            "5 \u063a\u0631\u0641 \u0646\u0648\u0645\u060c \u062d\u062f\u064a\u0642\u0629 \u0648\u0627\u0633\u0639\u0629\u060c \u0645\u0635\u0645\u0645\u0629 \u0644\u0644\u0625\u0642\u0627\u0645\u0627\u062a \u0627\u0644\u062c\u0645\u0627\u0639\u064a\u0629",
        },
        {
          slug: "mandalina",
          detail:
            "3 \u063a\u0631\u0641 \u0646\u0648\u0645\u060c \u062e\u0644\u0641\u064a\u0629 \u062c\u0628\u0644\u064a\u0629\u060c \u0642\u0631\u064a\u0628\u0629 \u0645\u0646 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a",
        },
      ],
      viewLabel: "\u0639\u0631\u0636 \u0627\u0644\u0641\u064a\u0644\u0627",
    },
    booking: {
      title:
        "\u0627\u062d\u062c\u0632 \u0625\u0642\u0627\u0645\u062a\u0643: \u0623\u0633\u0639\u0627\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u0639\u0631\u0648\u0636 \u062d\u0635\u0631\u064a\u0629",
      body: "\u0627\u0644\u062d\u062c\u0632 \u0645\u0628\u0627\u0634\u0631\u0629\u064b \u0639\u0628\u0631 Villa Silyan \u064a\u062a\u064a\u062d \u0644\u0643 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0645\u062a\u0627\u062d\u0629 \u0648\u0627\u0644\u0639\u0631\u0648\u0636 \u0627\u0644\u062d\u0635\u0631\u064a\u0629 \u063a\u064a\u0631 \u0627\u0644\u0645\u062a\u0648\u0641\u0631\u0629 \u0639\u0644\u0649 \u0645\u0646\u0635\u0627\u062a \u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u062b\u0627\u0644\u062b. \u0623\u0645\u0651\u0646 \u062e\u0635\u0648\u0635\u064a\u062a\u0643 \u0648\u0627\u0628\u062f\u0623 \u062a\u062e\u0637\u064a\u0637 \u0647\u0631\u0648\u0628\u0643 \u0625\u0644\u0649 \u0623\u0646\u0637\u0627\u0644\u064a\u0627.",
    },
    quickFacts: {
      title: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
      facts: [
        {
          label: "\u0627\u0644\u0645\u0648\u0642\u0639",
          value:
            "\u0623\u0646\u0637\u0627\u0644\u064a\u0627\u060c \u062a\u0631\u0643\u064a\u0627: \u0628\u064a\u0644\u064a\u0643\u060c \u0644\u0627\u0631\u0627\u060c \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a",
        },
        {
          label: "\u0627\u0644\u0645\u0632\u0627\u064a\u0627 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629",
          value:
            "\u062e\u0635\u0648\u0635\u064a\u0629 \u0645\u0637\u0644\u0642\u0629\u060c \u0645\u0633\u0627\u0628\u062d \u0644\u0627\u0646\u0647\u0627\u0626\u064a\u0629\u060c \u0643\u0648\u0646\u0633\u064a\u0631\u062c\u060c \u0631\u0627\u062d\u0629 \u0627\u0644\u0645\u0646\u0632\u0644 \u0627\u0644\u0630\u0643\u064a",
        },
        {
          label: "\u0623\u0641\u0636\u0644 \u0648\u0642\u062a \u0644\u0644\u0633\u0628\u0627\u062d\u0629 \u0639\u0646\u062f \u0627\u0644\u063a\u0631\u0648\u0628",
          value: "18:30 \u2013 19:30",
        },
        {
          label: "\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0625\u0644\u0649 \u0628\u064a\u0644\u064a\u0643",
          value: "\u0646\u062d\u0648 30 \u062f\u0642\u064a\u0642\u0629",
        },
        {
          label: "\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0625\u0644\u0649 \u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a",
          value: "\u0623\u0642\u0644 \u0645\u0646 20 \u062f\u0642\u064a\u0642\u0629",
        },
        {
          label: "\u0645\u064a\u0632\u0629 \u0627\u0644\u062d\u062c\u0632",
          value:
            "\u0623\u0633\u0639\u0627\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u0639\u0631\u0648\u0636 \u062d\u0635\u0631\u064a\u0629",
        },
      ],
    },
    cta: {
      title:
        "\u0627\u0628\u062f\u0623 \u0625\u0642\u0627\u0645\u062a\u0643 \u0627\u0644\u062e\u0627\u0635\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
      body: "\u0627\u0628\u062f\u0623 \u0625\u0642\u0627\u0645\u062a\u0643 \u0627\u0644\u0641\u0627\u062e\u0631\u0629 \u0648\u0627\u0644\u0647\u0627\u062f\u0626\u0629 \u0641\u064a Villa Silyan\u060c \u062d\u064a\u062b \u0643\u0644 \u062a\u0641\u0635\u064a\u0644 \u0645\u0635\u0645\u0645 \u0644\u0645\u0646\u062d\u0643 \u0645\u0633\u0627\u062d\u0629 \u0623\u0643\u0628\u0631 \u0648\u062e\u0635\u0648\u0635\u064a\u0629 \u0623\u0643\u062b\u0631 \u0648\u0648\u0642\u062a\u064b\u0627 \u0623\u0637\u0648\u0644 \u0645\u0639\u064b\u0627.",
      browseVillas:
        "\u062a\u0635\u0641\u062d \u062c\u0645\u064a\u0639 \u0627\u0644\u0641\u064a\u0644\u0627\u062a",
    },
    sidebar: {
      title:
        "\u0647\u0644 \u0623\u0646\u062a \u0645\u0633\u062a\u0639\u062f \u0644\u0625\u0642\u0627\u0645\u0629 \u0641\u064a \u0645\u0633\u0628\u062d \u062e\u0627\u0635\u061f",
      body: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u062a\u0648\u0641\u0631 \u0645\u0628\u0627\u0634\u0631\u0629\u064b \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0623\u0641\u0636\u0644 \u0639\u0631\u0648\u0636 Villa Silyan \u0627\u0644\u062d\u0627\u0644\u064a\u0629.",
      compareVillas:
        "\u0642\u0627\u0631\u0646 \u0627\u0644\u0641\u064a\u0644\u0627\u062a",
    },
  },

  ru: {
    meta: {
      title:
        "\u0420\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c | Villa Silyan",
      description:
        "\u0410\u0440\u0435\u043d\u0434\u0443\u0439\u0442\u0435 \u0440\u043e\u0441\u043a\u043e\u0448\u043d\u0443\u044e \u0432\u0438\u043b\u043b\u0443 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c \u0438\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c. Villa Silyan \u2014 \u043f\u043e\u043b\u043d\u0430\u044f \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c, \u043a\u0443\u0445\u043d\u044f \u0433\u0443\u0440\u043c\u0430\u043d\u0430 \u0438 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0441\u044c\u0435\u0440\u0436-\u0441\u0435\u0440\u0432\u0438\u0441. \u041b\u0443\u0447\u0448\u0438\u0435 \u0446\u0435\u043d\u044b \u043f\u0440\u0438 \u043f\u0440\u044f\u043c\u043e\u043c \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0438.",
      heroAlt:
        "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0438\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d \u0432\u0438\u043b\u043b\u044b Villa Silyan \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
      jsonLdHeadline:
        "\u0420\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438: \u043d\u0435\u043f\u043e\u0432\u0442\u043e\u0440\u0438\u043c\u0430\u044f \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u0444\u043e\u0440\u0442",
    },
    eyebrow:
      "\u0412\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c",
    h1: "\u0420\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c: \u043d\u0435\u043f\u043e\u0432\u0442\u043e\u0440\u0438\u043c\u0430\u044f \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c \u0438 \u043a\u043e\u043c\u0444\u043e\u0440\u0442",
    subtitle:
      "Villa Silyan \u0434\u0430\u0451\u0442 \u0432\u0430\u043c \u043f\u0440\u043e\u0441\u0442\u043e\u0440 \u0447\u0430\u0441\u0442\u043d\u043e\u0433\u043e \u0434\u043e\u043c\u0430, \u0438\u0437\u044b\u0441\u043a\u0430\u043d\u043d\u043e\u0441\u0442\u044c \u0431\u0443\u0442\u0438\u043a-\u043e\u0442\u0435\u043b\u044f \u0438 \u0440\u0435\u0434\u043a\u043e\u0435 \u0443\u0434\u043e\u0432\u043e\u043b\u044c\u0441\u0442\u0432\u0438\u0435 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430, \u043f\u0440\u0438\u043d\u0430\u0434\u043b\u0435\u0436\u0430\u0449\u0435\u0433\u043e \u0442\u043e\u043b\u044c\u043a\u043e \u0432\u0430\u043c.",
    heroAlt:
      "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0438\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d \u0432\u0438\u043b\u043b\u044b Villa Silyan \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    bookNow: "\u0417\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
    why: {
      title:
        "\u041f\u043e\u0447\u0435\u043c\u0443 \u0432\u044b\u0431\u0440\u0430\u0442\u044c Villa Silyan \u0434\u043b\u044f \u043e\u0442\u0434\u044b\u0445\u0430 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435?",
      body: "Villa Silyan \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u0442 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u0443\u044e \u0430\u043b\u044c\u0442\u0435\u0440\u043d\u0430\u0442\u0438\u0432\u0443 \u043d\u0430\u0441\u044b\u0449\u0435\u043d\u043d\u043e\u043c\u0443 \u0440\u0438\u0442\u043c\u0443 \u043f\u044f\u0442\u0438\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u043e\u0433\u043e \u043e\u0442\u0435\u043b\u044f. \u0420\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438 \u0441\u043e\u0437\u0434\u0430\u044e\u0442 \u0443\u0435\u0434\u0438\u043d\u0451\u043d\u043d\u0443\u044e \u0431\u0430\u0437\u0443 \u0434\u043b\u044f \u043d\u0435\u0441\u043f\u0435\u0448\u043d\u044b\u0445 \u0443\u0442\u0440 \u0438 \u0434\u043e\u043b\u0433\u0438\u0445 \u0437\u0430\u043f\u043b\u044b\u0432\u043e\u0432. \u041f\u0440\u043e\u0441\u044b\u043f\u0430\u0439\u0442\u0435\u0441\u044c \u0432 \u0442\u0438\u0448\u0438\u043d\u0435 \u0441\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u043c\u043e\u0440\u0441\u043a\u043e\u0433\u043e \u043f\u043e\u0431\u0435\u0440\u0435\u0436\u044c\u044f, \u043d\u0430\u0441\u043b\u0430\u0436\u0434\u0430\u0439\u0442\u0435\u0441\u044c \u0441\u0432\u043e\u0438\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c \u0438 \u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435 \u0435\u0434\u0443 \u0432 \u0441\u0432\u043e\u0451\u043c \u0442\u0435\u043c\u043f\u0435 \u043d\u0430 \u043f\u043e\u043b\u043d\u043e\u0441\u0442\u044c\u044e \u043e\u0431\u043e\u0440\u0443\u0434\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u043a\u0443\u0445\u043d\u0435 \u0433\u0443\u0440\u043c\u0430\u043d\u0430.",
    },
    privacy: {
      title:
        "\u041d\u0435\u043f\u0440\u0435\u0432\u0437\u043e\u0439\u0434\u0451\u043d\u043d\u0430\u044f \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c: \u0432\u0430\u0448 \u043b\u0438\u0447\u043d\u044b\u0439 \u0442\u0438\u0445\u0438\u0439 \u0440\u0430\u0439",
      body: "\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c \u2014 \u043d\u0435\u043e\u0442\u044a\u0435\u043c\u043b\u0435\u043c\u0430\u044f \u0447\u0430\u0441\u0442\u044c \u043e\u043f\u044b\u0442\u0430 Villa Silyan. \u0412\u044b\u0441\u043e\u043a\u0438\u0435 \u0441\u0442\u0435\u043d\u044b, \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0441\u0430\u0434\u044b \u0438 \u043f\u0440\u043e\u0434\u0443\u043c\u0430\u043d\u043d\u043e\u0435 \u043e\u0437\u0435\u043b\u0435\u043d\u0435\u043d\u0438\u0435 \u043f\u0440\u0435\u0432\u0440\u0430\u0449\u0430\u044e\u0442 \u043a\u0430\u0436\u0434\u0443\u044e \u0432\u0438\u043b\u043b\u0443 \u0432 \u0442\u0438\u0445\u043e\u0435 \u0443\u0431\u0435\u0436\u0438\u0449\u0435. \u041e\u0442\u0434\u044b\u0445\u0430\u0435\u0442\u0435 \u043b\u0438 \u0432\u044b \u0443 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430 \u0438\u043b\u0438 \u0443\u0436\u0438\u043d\u0430\u0435\u0442\u0435 \u043d\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u043e\u043c \u0432\u043e\u0437\u0434\u0443\u0445\u0435 \u2014 \u0432\u0430\u0441 \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u043e\u0431\u0435\u0441\u043f\u043e\u043a\u043e\u0438\u0442.",
      proTip:
        "\u0412\u043e\u043b\u0448\u0435\u0431\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442: \u0437\u0430\u043f\u043b\u044b\u0432\u0430\u0439\u0442\u0435 \u043d\u0430 \u0437\u0430\u043a\u0430\u0442\u0435 \u0441 18:30 \u0434\u043e 19:30, \u043a\u043e\u0433\u0434\u0430 \u043d\u0435\u0431\u043e \u0421\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u043c\u043e\u0440\u044c\u044f \u043e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0432 \u0442\u0451\u043f\u043b\u044b\u0435 \u0432\u0435\u0447\u0435\u0440\u043d\u0438\u0435 \u0442\u043e\u043d\u0430.",
    },
    pools: {
      title:
        "\u0418\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d\u044b \u0441 \u0443\u0434\u0438\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u043c \u0432\u0438\u0434\u043e\u043c \u043d\u0430 \u0421\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u043c\u043e\u0440\u044c\u0435",
      body: "\u0411\u0430\u0441\u0441\u0435\u0439\u043d\u044b Villa Silyan \u2014 \u044d\u0442\u043e \u043d\u0435 \u043f\u0440\u043e\u0441\u0442\u043e \u043c\u0435\u0441\u0442\u043e \u0434\u043b\u044f \u043a\u0443\u043f\u0430\u043d\u0438\u044f. \u041e\u043d\u0438 \u0441\u043e\u0437\u0434\u0430\u044e\u0442 \u043b\u0438\u0447\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0443 \u043e\u0431\u0437\u043e\u0440\u0430 \u043d\u0430\u0434 \u0445\u043e\u043b\u043c\u0430\u043c\u0438 \u0432 \u0441\u0442\u043e\u0440\u043e\u043d\u0443 \u0441\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u043c\u043e\u0440\u0441\u043a\u043e\u0433\u043e \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430. \u041a\u0430\u0436\u0434\u044b\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d \u0442\u0449\u0430\u0442\u0435\u043b\u044c\u043d\u043e \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044f, \u043d\u0430\u043f\u043e\u043b\u043d\u0435\u043d \u043f\u043e\u043a\u043e\u0435\u043c \u0438 \u043d\u0430 \u0432\u0441\u0451 \u0432\u0440\u0435\u043c\u044f \u043f\u0440\u0435\u0431\u044b\u0432\u0430\u043d\u0438\u044f \u043f\u0440\u0438\u043d\u0430\u0434\u043b\u0435\u0436\u0438\u0442 \u0438\u0441\u043a\u043b\u044e\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e \u0432\u0430\u043c.",
      imgAlt:
        "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d \u0438 \u0441\u0430\u0434 \u0432\u0438\u043b\u043b\u044b Villa Silyan \u0440\u044f\u0434\u043e\u043c \u0441 \u0410\u043d\u0442\u0430\u043b\u044c\u0435\u0439",
    },
    smartHome: {
      title:
        "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438 \u0443\u043c\u043d\u043e\u0433\u043e \u0434\u043e\u043c\u0430 \u0434\u043b\u044f \u0431\u0435\u0437\u0437\u0430\u0431\u043e\u0442\u043d\u043e\u0439 \u0436\u0438\u0437\u043d\u0438",
      body: "\u0421\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439 \u043a\u043e\u043c\u0444\u043e\u0440\u0442 \u043e\u0440\u0433\u0430\u043d\u0438\u0447\u043d\u043e \u0432\u043f\u0438\u0441\u0430\u043d \u0432 \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0443 \u0432\u0438\u043b\u043b\u044b. \u0421\u0438\u0441\u0442\u0435\u043c\u044b \u043e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u044f, \u043a\u043b\u0438\u043c\u0430\u0442-\u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044c \u0438 \u0440\u0430\u0437\u0432\u043b\u0435\u0447\u0435\u043d\u0438\u044f \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u044b \u0442\u0430\u043a, \u0447\u0442\u043e\u0431\u044b \u0431\u044b\u0442\u044c \u0438\u043d\u0442\u0443\u0438\u0442\u0438\u0432\u043d\u044b\u043c\u0438, \u0447\u0442\u043e\u0431\u044b \u0432\u0430\u0448 \u043e\u0442\u0434\u044b\u0445 \u043e\u0441\u0442\u0430\u0432\u0430\u043b\u0441\u044f \u043b\u0435\u0433\u043a\u0438\u043c \u0441 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0432\u0435\u0447\u0435\u0440\u0430 \u0434\u043e \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0435\u0433\u043e \u0443\u0442\u0440\u0430.",
    },
    concierge: {
      title:
        "\u041a\u043e\u043d\u0441\u044c\u0435\u0440\u0436-\u0441\u0435\u0440\u0432\u0438\u0441: \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u043e\u043f\u044b\u0442 \u0436\u0434\u0451\u0442 \u0432\u0430\u0441",
      body: "\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043a\u043e\u043d\u0441\u044c\u0435\u0440\u0436\u0435\u0439 \u043f\u043e\u043c\u043e\u0436\u0435\u0442 \u0432\u044b\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043a\u0430\u0436\u0434\u044b\u0439 \u0434\u0435\u043d\u044c \u043f\u043e\u0434 \u0432\u0430\u0448 \u0441\u0442\u0438\u043b\u044c \u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044f: \u043b\u0438\u0447\u043d\u044b\u0439 \u0448\u0435\u0444-\u043f\u043e\u0432\u0430\u0440, \u044f\u0445\u0442\u0435\u043d\u043d\u0430\u044f \u043f\u0440\u043e\u0433\u0443\u043b\u043a\u0430, \u0442\u0440\u0430\u043d\u0441\u0444\u0435\u0440 \u0438\u0437 \u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442\u0430 \u0438\u043b\u0438 \u043e\u0434\u043d\u043e\u0434\u043d\u0435\u0432\u043d\u0430\u044f \u043f\u043e\u0435\u0437\u0434\u043a\u0430 \u0432 \u0430\u043d\u0442\u0438\u0447\u043d\u044b\u0439 \u041f\u0435\u0440\u0433\u0435. \u0412 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0435 \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 \u043b\u0438\u0447\u043d\u044b\u0439, \u0430 \u043d\u0435 \u043f\u0430\u043a\u0435\u0442\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445.",
    },
    comparison: {
      title:
        "\u041e\u0442\u0435\u043b\u044c \u0438\u043b\u0438 \u0447\u0430\u0441\u0442\u043d\u0430\u044f \u0432\u0438\u043b\u043b\u0430: \u0440\u043e\u0441\u043a\u043e\u0448\u044c \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430 \u0438 \u0441\u0432\u043e\u0431\u043e\u0434\u044b",
      featureHeader: "\u0425\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0430",
      hotelHeader:
        "5-\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u044b\u0439 \u043e\u0442\u0435\u043b\u044c \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
      rows: [
        [
          "\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c",
          "\u041f\u043e\u043b\u043d\u043e\u0435 \u0443\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435",
          "\u041e\u0431\u0449\u0438\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430",
        ],
        [
          "\u0411\u0430\u0441\u0441\u0435\u0439\u043d",
          "\u0427\u0430\u0441\u0442\u043d\u044b\u0439 \u0438\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d",
          "\u041e\u0431\u0449\u0438\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d \u043e\u0442\u0435\u043b\u044f",
        ],
        [
          "\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e",
          "\u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0435 \u0436\u0438\u043b\u044b\u0435 \u0437\u043e\u043d\u044b",
          "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043d\u0430\u044f \u043f\u043b\u043e\u0449\u0430\u0434\u044c \u043d\u043e\u043c\u0435\u0440\u0430",
        ],
        [
          "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
          "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0441\u044c\u0435\u0440\u0436-\u0441\u0435\u0440\u0432\u0438\u0441",
          "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0447\u043d\u044b\u0435 \u0443\u0441\u043b\u0443\u0433\u0438",
        ],
        [
          "\u041f\u0438\u0442\u0430\u043d\u0438\u0435",
          "\u041a\u0443\u0445\u043d\u044f \u0433\u0443\u0440\u043c\u0430\u043d\u0430 \u0434\u043b\u044f \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0440\u0438\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
          "\u0420\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u044b \u043e\u0442\u0435\u043b\u044f",
        ],
      ],
    },
    explore: {
      title:
        "\u0418\u0441\u0441\u043b\u0435\u0434\u0443\u0439\u0442\u0435 \u0410\u043d\u0442\u0430\u043b\u044c\u044e: \u043e\u0442 \u0433\u043e\u043b\u044c\u0444-\u043a\u0443\u0440\u043e\u0440\u0442\u043e\u0432 \u0411\u0435\u043b\u0435\u043a\u0430 \u0434\u043e \u043f\u043b\u044f\u0436\u0435\u0439 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b",
      antalyaLabel: "\u0410\u043d\u0442\u0430\u043b\u044c\u044f",
      afterAntalya:
        " \u043f\u043e\u043b\u043d\u0430 \u043f\u0440\u0438\u0431\u0440\u0435\u0436\u043d\u044b\u0445 \u0434\u043d\u0435\u0439, \u0433\u043e\u0440\u043d\u043e\u0433\u043e \u0432\u043e\u0437\u0434\u0443\u0445\u0430, \u0438\u0441\u0442\u043e\u0440\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0434\u043e\u0441\u0442\u043e\u043f\u0440\u0438\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u0435\u0439 \u0438 \u043b\u0451\u0433\u043a\u0438\u0445 \u043e\u0434\u043d\u043e\u0434\u043d\u0435\u0432\u043d\u044b\u0445 \u043f\u043e\u0435\u0437\u0434\u043e\u043a. \u0421\u044b\u0433\u0440\u0430\u0439\u0442\u0435 \u0432 \u0433\u043e\u043b\u044c\u0444 \u043c\u0438\u0440\u043e\u0432\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f \u0432\u00a0",
      belekLabel: "\u0411\u0435\u043b\u0435\u043a\u0435",
      afterBelek:
        "\u00a0\u0438\u043b\u0438 \u043f\u0440\u043e\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0435\u043d\u044c \u0443 \u0432\u043e\u0434\u044b \u043d\u0430 \u043f\u043b\u044f\u0436\u0435\u00a0",
      konyaaltiLabel: "\u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b",
      afterKonyaalti:
        ". \u041e\u0442 Villa Silyan \u0434\u043e \u0411\u0435\u043b\u0435\u043a\u0430 \u043e\u043a\u043e\u043b\u043e 30 \u043c\u0438\u043d\u0443\u0442, \u0434\u043e \u043f\u043b\u044f\u0436\u0430 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b \u2014 \u043c\u0435\u043d\u0435\u0435 20 \u043c\u0438\u043d\u0443\u0442.",
    },
    selfCatering: {
      title:
        "\u0421\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0435 \u043f\u0438\u0442\u0430\u043d\u0438\u0435 \u0441\u0442\u0430\u043b\u043e \u043f\u0440\u043e\u0449\u0435: \u043a\u0443\u0445\u043d\u044f \u0433\u0443\u0440\u043c\u0430\u043d\u0430 \u043a \u0432\u0430\u0448\u0438\u043c \u0443\u0441\u043b\u0443\u0433\u0430\u043c",
      body: "\u041a\u0430\u0436\u0434\u0430\u044f \u0432\u0438\u043b\u043b\u0430 \u0433\u043e\u0442\u043e\u0432\u0430 \u043a \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u043c\u0443 \u043f\u0438\u0442\u0430\u043d\u0438\u044e: \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u0437\u0430\u0432\u0442\u0440\u0430\u043a, \u043b\u0451\u0433\u043a\u0438\u0439 \u043e\u0431\u0435\u0434 \u043f\u043e\u0441\u043b\u0435 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430 \u0438\u043b\u0438 \u0440\u043e\u043c\u0430\u043d\u0442\u0438\u0447\u043d\u044b\u0439 \u0443\u0436\u0438\u043d \u043d\u0430 \u0434\u0432\u043e\u0438\u0445. \u042d\u0442\u0430 \u0441\u0432\u043e\u0431\u043e\u0434\u0430 \u2014 \u043e\u0434\u043d\u043e \u0438\u0437 \u0433\u043b\u0430\u0432\u043d\u044b\u0445 \u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432 \u043f\u0435\u0440\u0435\u0434 \u043f\u0438\u0442\u0430\u043d\u0438\u0435\u043c \u0432 \u043e\u0442\u0435\u043b\u0435, \u0433\u0434\u0435 \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0438 \u043c\u0435\u043d\u044e \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0442 \u0432\u0430\u0448\u0438\u043c \u0434\u043d\u0451\u043c.",
      imgAlt:
        "\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0441\u0442\u0438\u043b\u044c \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0438\u0442\u0430\u043d\u0438\u044f \u043d\u0430 \u0432\u0438\u043b\u043b\u0435 Villa Silyan \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    },
    featured: {
      title:
        "\u041d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0432\u0438\u043b\u043b \u0434\u043b\u044f \u043d\u0430\u0447\u0430\u043b\u0430",
      villas: [
        {
          slug: "defne",
          detail:
            "5 \u0441\u043f\u0430\u043b\u0435\u043d\u044c, \u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d, \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e \u0434\u043b\u044f \u0431\u043e\u043b\u044c\u0448\u043e\u0439 \u0441\u0435\u043c\u044c\u0438",
        },
        {
          slug: "portakal",
          detail:
            "5 \u0441\u043f\u0430\u043b\u0435\u043d\u044c, \u043f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u044b\u0439 \u0441\u0430\u0434, \u0434\u043b\u044f \u0433\u0440\u0443\u043f\u043f\u043e\u0432\u044b\u0445 \u043f\u043e\u0435\u0437\u0434\u043e\u043a",
        },
        {
          slug: "mandalina",
          detail:
            "3 \u0441\u043f\u0430\u043b\u044c\u043d\u0438, \u0433\u043e\u0440\u043d\u044b\u0439 \u043f\u0435\u0439\u0437\u0430\u0436, \u0440\u044f\u0434\u043e\u043c \u0441 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b",
        },
      ],
      viewLabel:
        "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0438\u043b\u043b\u0443",
    },
    booking: {
      title:
        "\u0411\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435: \u043f\u0440\u044f\u043c\u044b\u0435 \u0446\u0435\u043d\u044b \u0438 \u044d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u043d\u044b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
      body: "\u041f\u0440\u044f\u043c\u043e\u0435 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 Villa Silyan \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u043b\u0443\u0447\u0448\u0438\u043c \u0446\u0435\u043d\u0430\u043c, \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u043e\u0439 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u0438 \u0432\u0438\u043b\u043b \u0438 \u044d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u043d\u044b\u043c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u043c, \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043d\u0435\u0442 \u043d\u0430 \u0441\u0442\u043e\u0440\u043e\u043d\u043d\u0438\u0445 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430\u0445. \u041e\u0431\u0435\u0441\u043f\u0435\u0447\u044c\u0442\u0435 \u0441\u0435\u0431\u0435 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445 \u0438 \u043d\u0430\u0447\u043d\u0438\u0442\u0435 \u043f\u043b\u0430\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043f\u043e\u0435\u0437\u0434\u043a\u0443 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u044e.",
    },
    quickFacts: {
      title:
        "\u041a\u0440\u0430\u0442\u043a\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
      facts: [
        {
          label: "\u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435",
          value:
            "\u0410\u043d\u0442\u0430\u043b\u044c\u044f, \u0422\u0443\u0440\u0446\u0438\u044f: \u0411\u0435\u043b\u0435\u043a, \u041b\u0430\u0440\u0430, \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b",
        },
        {
          label:
            "\u041a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430",
          value:
            "\u041f\u043e\u043b\u043d\u0430\u044f \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c, \u0438\u043d\u0444\u0438\u043d\u0438\u0442\u0438-\u0431\u0430\u0441\u0441\u0435\u0439\u043d\u044b, \u043a\u043e\u043d\u0441\u044c\u0435\u0440\u0436, \u0443\u043c\u043d\u044b\u0439 \u0434\u043e\u043c",
        },
        {
          label:
            "\u041b\u0443\u0447\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f \u0434\u043b\u044f \u0437\u0430\u043a\u0430\u0442\u0430",
          value: "18:30 \u2014 19:30",
        },
        {
          label: "\u0414\u043e \u0411\u0435\u043b\u0435\u043a\u0430",
          value: "\u041e\u043a\u043e\u043b\u043e 30 \u043c\u0438\u043d\u0443\u0442",
        },
        {
          label:
            "\u0414\u043e \u043f\u043b\u044f\u0436\u0430 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b",
          value: "\u041c\u0435\u043d\u0435\u0435 20 \u043c\u0438\u043d\u0443\u0442",
        },
        {
          label:
            "\u041f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u043e \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
          value:
            "\u041f\u0440\u044f\u043c\u044b\u0435 \u0446\u0435\u043d\u044b \u0438 \u044d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u043d\u044b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
        },
      ],
    },
    cta: {
      title:
        "\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0441\u0432\u043e\u0439 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u044b\u0439 \u043e\u0442\u0434\u044b\u0445 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
      body: "\u041d\u0430\u0447\u043d\u0438\u0442\u0435 \u0440\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0439 \u0438 \u0443\u043c\u0438\u0440\u043e\u0442\u0432\u043e\u0440\u044f\u044e\u0449\u0438\u0439 \u043e\u0442\u0434\u044b\u0445 \u0432 Villa Silyan, \u0433\u0434\u0435 \u043a\u0430\u0436\u0434\u0430\u044f \u0434\u0435\u0442\u0430\u043b\u044c \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0430\u043d\u0430, \u0447\u0442\u043e\u0431\u044b \u0434\u0430\u0442\u044c \u0432\u0430\u043c \u0431\u043e\u043b\u044c\u0448\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430, \u0431\u043e\u043b\u044c\u0448\u0435 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438 \u0438 \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u0432\u043c\u0435\u0441\u0442\u0435.",
      browseVillas:
        "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0441\u0435 \u0432\u0438\u043b\u043b\u044b",
    },
    sidebar: {
      title:
        "\u0413\u043e\u0442\u043e\u0432\u044b \u043a \u043e\u0442\u0434\u044b\u0445\u0443 \u0443 \u0447\u0430\u0441\u0442\u043d\u043e\u0433\u043e \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430?",
      body: "\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043d\u0430\u043b\u0438\u0447\u0438\u0435 \u043c\u0435\u0441\u0442 \u043d\u0430\u043f\u0440\u044f\u043c\u0443\u044e \u0438 \u043d\u0430\u0439\u0434\u0438\u0442\u0435 \u043b\u0443\u0447\u0448\u0438\u0439 \u043f\u0443\u0442\u044c \u043a \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f\u043c Villa Silyan.",
      compareVillas:
        "\u0421\u0440\u0430\u0432\u043d\u0438\u0442\u044c \u0432\u0438\u043b\u043b\u044b",
    },
  },
};

type Props = {
  params: Promise<{ lang: string; siteSlug?: string }>;
  pathPrefix?: string;
};

function anchorClassName(): string {
  return "font-medium text-[var(--accent-500)] underline decoration-[var(--accent-300)] underline-offset-4 hover:text-[var(--accent-600)]";
}

function jsonLdScriptPayload(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateLuxuryVillasAntalyaPrivatePoolMetadata({
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
          height: 683,
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

export default async function LuxuryVillasAntalyaPrivatePoolPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const safeLang = isLang(lang) ? lang : "en";
  const c = (COPY[safeLang] ?? COPY.en) as LangCopy;

  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const contactHref = pagePath("/contact");
  const villasHref = pagePath("/villas");
  const locationHref = pagePath("/location");
  const internalLink = anchorClassName();

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.meta.jsonLdHeadline,
    description: c.meta.description,
    image: [`${origin}${HERO_IMAGE}`, `${origin}${INFINITY_POOL_IMAGE}`],
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  return (
    <>
      <Script
        id="jsonld-luxury-villas-antalya-private-pool"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <div className="bg-[var(--color-bg)] pt-24 pb-20">
        <article className="content-wrapper">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-500)]">
                {c.eyebrow}
              </p>
              <Link
                href={contactHref}
                className="hidden rounded-full bg-[var(--accent-500)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:brightness-110 md:inline-flex"
              >
                {c.bookNow}
              </Link>
            </div>

            <header className="max-w-4xl">
              <h1 className="font-serif text-h1 font-semibold leading-tight text-[var(--color-text-primary)]">
                {c.h1}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
                {c.subtitle}
              </p>
            </header>

            <figure className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/10] md:aspect-[16/8]">
                <Image
                  src={HERO_IMAGE}
                  alt={c.heroAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1120px"
                  className="object-cover"
                />
              </div>
            </figure>

            <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:hidden">
              <Link
                href={contactHref}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {c.bookNow}
              </Link>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-14">
                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.why.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.why.body}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.privacy.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.privacy.body}
                  </p>
                  <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--accent-muted)] p-5">
                    <div className="flex gap-4">
                      <span
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: "var(--accent-500)" }}
                        aria-hidden="true"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                          <circle cx="12" cy="12" r="4" />
                        </svg>
                      </span>
                      <p className="leading-relaxed text-[var(--color-text-primary)]">
                        <strong>Pro Tip:</strong> {c.privacy.proTip}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_42%] md:items-center">
                    <div>
                      <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                        {c.pools.title}
                      </h2>
                      <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                        {c.pools.body}
                      </p>
                    </div>
                    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <Image
                        src={INFINITY_POOL_IMAGE}
                        alt={c.pools.imgAlt}
                        width={900}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.smartHome.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.smartHome.body}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.concierge.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.concierge.body}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.comparison.title}
                  </h2>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                    <div className="overflow-x-auto">
                      <table className="min-w-[680px] w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              {c.comparison.featureHeader}
                            </th>
                            <th className="border-b border-[var(--color-border)] bg-[var(--accent-muted)] px-5 py-4 font-semibold text-[var(--color-text-primary)]">
                              Villa Silyan
                            </th>
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              {c.comparison.hotelHeader}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[var(--color-text-secondary)]">
                          {c.comparison.rows.map(([feature, villa, hotel]) => (
                            <tr key={feature} className="border-b border-[var(--color-border)] last:border-b-0">
                              <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">
                                {feature}
                              </td>
                              <td className="bg-[var(--accent-muted)] px-5 py-4 font-medium text-[var(--color-text-primary)]">
                                {villa}
                              </td>
                              <td className="px-5 py-4">{hotel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.explore.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    <a href={`${locationHref}#antalya`} className={internalLink}>
                      {c.explore.antalyaLabel}
                    </a>
                    {c.explore.afterAntalya}
                    <a href={`${locationHref}#belek`} className={internalLink}>
                      {c.explore.belekLabel}
                    </a>
                    {c.explore.afterBelek}
                    <a href={`${locationHref}#konyaalti`} className={internalLink}>
                      {c.explore.konyaaltiLabel}
                    </a>
                    {c.explore.afterKonyaalti}
                  </p>
                </section>

                <section>
                  <div className="grid gap-8 md:grid-cols-[42%_minmax(0,1fr)] md:items-center">
                    <figure className="order-2 overflow-hidden rounded-2xl border border-[var(--color-border)] md:order-1">
                      <Image
                        src={LIFESTYLE_IMAGE}
                        alt={c.selfCatering.imgAlt}
                        width={900}
                        height={600}
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                    <div className="order-1 md:order-2">
                      <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                        {c.selfCatering.title}
                      </h2>
                      <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                        {c.selfCatering.body}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.featured.title}
                  </h2>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {c.featured.villas.map((villa) => (
                      <Link
                        key={villa.slug}
                        href={pagePath(`/villas/${villa.slug}`)}
                        className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent-400)] hover:shadow-[var(--shadow-glow)]"
                      >
                        <h3 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                          Villa {villa.slug.charAt(0).toUpperCase() + villa.slug.slice(1)}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                          {villa.detail}
                        </p>
                        <span className="mt-4 inline-flex text-sm font-medium text-[var(--accent-500)] transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          {c.featured.viewLabel}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.booking.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.booking.body}
                  </p>
                </section>

                <section>
                  <h3 className="font-serif text-h3 font-semibold text-[var(--color-text-primary)]">
                    {c.quickFacts.title}
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {c.quickFacts.facts.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-primary)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl bg-[var(--color-text-primary)] p-8 text-white md:p-10">
                  <div className="max-w-2xl">
                    <h2 className="font-serif text-h2 font-semibold">
                      {c.cta.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-white/80">
                      {c.cta.body}
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={contactHref}
                        className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                      >
                        {c.bookNow}
                      </Link>
                      <Link
                        href={villasHref}
                        className="inline-flex items-center justify-center rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {c.cta.browseVillas}
                      </Link>
                    </div>
                  </div>
                </section>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                  <p className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    {c.sidebar.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {c.sidebar.body}
                  </p>
                  <Link
                    href={contactHref}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    {c.bookNow}
                  </Link>
                  <Link
                    href={villasHref}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--accent-500)]"
                  >
                    {c.sidebar.compareVillas}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
