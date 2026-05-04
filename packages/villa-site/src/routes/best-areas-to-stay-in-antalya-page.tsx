import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { headers } from "next/headers";

import { isLang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const PAGE_SLUG = "best-areas-to-stay-in-antalya";
const PILLAR_SLUG = "villas-in-antalya-with-private-pool";
const HERO_IMAGE = "/silyan-areas/antalya-coast-hero.png";
const CITY_MARINA_IMAGE = "/silyan-areas/antalya-city-marina.png";
const REGIONS_COLLAGE_IMAGE = "/silyan-areas/best-areas-antalya-collage.png";

type Region = {
  id: string;
  shortLabel: string;
  title: string;
  summary: string;
  proTip: string;
  localAnchor: string;
  insight: string;
  quadrant: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

type LangCopy = {
  meta: {
    title: string;
    description: string;
    heroAlt: string;
    jsonLdHeadline: string;
  };
  heroEyebrow: string;
  h1: string;
  heroSubtitle: string;
  intro: string;
  whyTitle: string;
  whyBody: string;
  compFeature: string;
  compHotel: string;
  compRows: [string, string, string][];
  neighborhoodLabel: string;
  fourAreasTitle: string;
  fourAreasBody: string;
  figcaption: string;
  quadrantLabels: [string, string][];
  inReferenceImage: string;
  quadrantPositions: Record<string, string>;
  proTipLabel: string;
  localAnchorLabel: string;
  insightTitle: string;
  considerationsTitle: string;
  considerations: string[];
  beachTitle: string;
  beachBody: string;
  beachAlt: string;
  expertiseTitle: string;
  expertiseBody: string;
  pillarSectionTitle: string;
  pillarSectionBody: string;
  visitPillarBtn: string;
  viewVillasBtn: string;
  ctaTitle: string;
  ctaBody: string;
  ctaBtn: string;
  sidebarTitle: string;
  sidebarBody: string;
  sidebarBtn: string;
  jumpTo: string;
  collageAlt: string;
  regions: Region[];
};

const COPY: Record<string, LangCopy> = {
  en: {
    meta: {
      title: "Best Areas to Stay in Antalya: A Luxury Villa Rental Guide 2026",
      description:
        "Discover the perfect location for your Antalya getaway. Comparing Kalkan, Ka\u015f, Belek, and the City Center for luxury villa rentals. Local tips and insights.",
      heroAlt: "Aerial view of Antalya coastline for choosing the best area to stay",
      jsonLdHeadline: "Discover the Best Areas to Stay in Antalya for Luxurious Villa Rentals",
    },
    heroEyebrow: "Luxury villa rental guide 2026",
    h1: "Discover the Best Areas to Stay in Antalya for Luxurious Villa Rentals",
    heroSubtitle:
      "Compare Kalkan, Ka\u015f, Belek, and Antalya City Center so your villa setting matches the way you want to travel.",
    intro:
      "Antalya\u2019s allure lies in its variety. Some areas feel secluded and coastal; others are historic, family-focused, or connected to city life. Villa Silyan gives you a calm private base for your Mediterranean adventure, with the flexibility to explore the region at your own pace.",
    whyTitle: "Why Choose a Villa Over a 5-Star Hotel in Antalya",
    whyBody:
      "Choosing a villa rental at Villa Silyan gives you privacy that is hard to preserve in a busy hotel. Swim in your own pool at sunset, prepare meals from local market ingredients, and enjoy generous indoor and outdoor space without lobby queues, fixed dining hours, or crowded shared facilities.",
    compFeature: "Feature",
    compHotel: "5-Star Hotel",
    compRows: [
      ["Privacy", "Complete", "Limited"],
      ["Pool", "Private", "Shared"],
      ["Dining", "Self-catering", "Fixed hours"],
      ["Space", "Spacious", "Compact"],
    ],
    neighborhoodLabel: "Neighborhood chapter",
    fourAreasTitle: "Four areas, one quick visual",
    fourAreasBody:
      "The image below is a single reference collage. Each quadrant captures a different coastal personality, so you can scan the look and feel first, then read the deeper notes for each place in the sections that follow.",
    figcaption: "Top: hillside Kalkan and historic Ka\u015f \u00b7 Bottom: family-friendly Belek and central Antalya",
    quadrantLabels: [
      ["top-left", "Kalkan \u2014 secluded, views"],
      ["top-right", "Ka\u015f \u2014 history, harbor"],
      ["bottom-left", "Belek \u2014 golf & beach"],
      ["bottom-right", "City center \u2014 energy & access"],
    ],
    inReferenceImage: "in the reference image above",
    quadrantPositions: {
      "top-left": "Top left",
      "top-right": "Top right",
      "bottom-left": "Bottom left",
      "bottom-right": "Bottom right",
    },
    proTipLabel: "Pro Tip",
    localAnchorLabel: "Local Anchor",
    insightTitle: "Real-World Insight",
    considerationsTitle: "Top 5 Considerations When Choosing Your Antalya Villa Location",
    considerations: [
      "Privacy needs: decide how much seclusion you want day to day.",
      "Proximity to attractions: choose between historic sites, beaches, golf, or nature.",
      "Family requirements: look for gardens, bedrooms, pool safety, and easy parking.",
      "Activity preferences: match the area to diving, golfing, cultural exploring, or beach time.",
      "Seasonal crowds: peak holidays can change the feel of each neighborhood.",
    ],
    beachTitle: "Proximity to Antalya\u2019s Pristine Beaches: A Key Factor",
    beachBody:
      "Antalya\u2019s beaches are a major draw, and choosing a villa with easy beach access can shape the whole stay. Whether you prefer the golden sands of Lara Beach, the pebbled shoreline of Konyaalt\u0131, or day trips toward Kaputa\u015f, a well placed villa makes spontaneous swims and sunset plans much easier.",
    beachAlt: "Antalya marina and coastline near luxury villa rental areas",
    expertiseTitle: "Local Expertise: Navigating Antalya\u2019s Diverse Neighborhoods",
    expertiseBody:
      "Villa Silyan\u2019s local knowledge helps match your group with the right base, whether your priority is privacy, beach access, family convenience, or effortless access to Antalya\u2019s restaurants and historic center.",
    pillarSectionTitle: "Continue to the Private Pool Villa Guide",
    pillarSectionBody:
      "For more detail on our luxurious villas with private pools, visit our Pillar Page.",
    visitPillarBtn: "Visit our Pillar Page",
    viewVillasBtn: "View Villa Silyan rentals",
    ctaTitle: "Ready to Book Your Dream Villa?",
    ctaBody:
      "Contact Villa Silyan for personalized assistance, direct rates, and exclusive offers tailored to your travel dates.",
    ctaBtn: "Contact us today",
    sidebarTitle: "Need help choosing?",
    sidebarBody:
      "Tell us your group size, dates, and preferred pace. We\u2019ll point you toward the right Villa Silyan option.",
    sidebarBtn: "Get local advice",
    jumpTo: "Jump to",
    collageAlt:
      "Four Antalya area styles: Kalkan hillside villas with sea views, historic Ka\u015f streets, Belek beach and golf, and Antalya city center near Kalei\u00e7i",
    regions: [
      {
        id: "kalkan",
        shortLabel: "Kalkan",
        title: "Exploring Kalkan: A Haven for Secluded Luxury",
        summary:
          "Kalkan is a picturesque town known for its tranquil atmosphere and dramatic coastline. Villas here are often perched on hillsides, giving guests panoramic Mediterranean views and a sense of retreat above the water. The narrow streets are lined with boutique shops and local restaurants, ideal for slow evenings after a pool day.",
        proTip: "Visit the local Thursday market for fresh produce and artisanal goods.",
        localAnchor: "Kalkan Marina, a short 10-minute drive, is ideal for dining and boat tours.",
        insight:
          "Kalkan rewards travelers who want quiet and views, but its hilly terrain can be challenging for guests with mobility needs. If easy walking is important, choose a villa with direct parking and minimal stairs.",
        quadrant: "top-left",
      },
      {
        id: "kas",
        shortLabel: "Ka\u015f",
        title: "Ka\u015f: The Perfect Blend of History and Modern Comfort",
        summary:
          "Ka\u015f combines ancient ruins, a lively harbor, independent shops, and excellent dining. It is especially loved by diving enthusiasts, with local operators running trips to reefs, wrecks, and clear-water coves. For guests who like culture with a relaxed coastal rhythm, Ka\u015f is one of Antalya\u2019s most characterful bases.",
        proTip: "For a quieter experience, visit the ancient amphitheater at sunset.",
        localAnchor:
          "The town center is usually a short walk from central villas, with easy access to shops and cafes.",
        insight:
          "Ka\u015f can feel lively in peak season, especially on weekends. The charm is real, but light sleepers should look for villas set slightly above or outside the busiest streets.",
        quadrant: "top-right",
      },
      {
        id: "belek",
        shortLabel: "Belek",
        title: "Belek: Golf Courses and Family-Friendly Villas",
        summary:
          "Belek is known for world-class golf courses, wide resort beaches, and family-friendly villas with larger gardens. It works well for groups who want an easy holiday rhythm: golf in the morning, beach time in the afternoon, and a private pool waiting at home.",
        proTip: "Book tee times in advance, especially during the high season.",
        localAnchor: "Kadriye Beach is a short 15-minute drive and works well for a family day out.",
        insight:
          "Belek is convenient and polished, but it can be busy during school holidays. Plan beach clubs, theme parks, and golf starts early in the day to avoid the heaviest crowds.",
        quadrant: "bottom-left",
      },
      {
        id: "city-center",
        shortLabel: "Antalya City Center",
        title: "Antalya City Center: Vibrant Life and Easy Beach Access",
        summary:
          "Staying close to Antalya City Center gives you the best of both worlds: restaurants, shopping, Kalei\u00e7i, marina walks, and quick access to beaches such as Konyaalt\u0131 and Lara. A villa here is best for travelers who want convenience without giving up private outdoor space.",
        proTip: "Visit the Old Town, Kalei\u00e7i, for a compact dose of Antalya history and culture.",
        localAnchor:
          "The city tram offers convenient access to key attractions and can reduce the need for car rentals.",
        insight:
          "The center is naturally more energetic, so noise can be part of the trade-off. In return, you gain easy restaurants, beach access, and less time spent driving.",
        quadrant: "bottom-right",
      },
    ],
  },

  tr: {
    meta: {
      title: "Antalya\u2019da Kal\u0131nacak En \u0130yi B\u00f6lgeler: L\u00fcks Villa Kiralama Rehberi 2026",
      description:
        "Antalya tatili i\u00e7in ideal konumu ke\u015ffedin. Kalkan, Ka\u015f, Belek ve \u015eehir Merkezi aras\u0131nda l\u00fcks villa kiralamas\u0131 kar\u015f\u0131la\u015ft\u0131rmas\u0131. Yerel ipucular\u0131 ve g\u00f6r\u00fc\u015fler.",
      heroAlt: "Kal\u0131nacak en iyi b\u00f6lgeyi belirlemek i\u00e7in Antalya sahil hava g\u00f6r\u00fcnt\u00fcs\u00fc",
      jsonLdHeadline:
        "Antalya\u2019da L\u00fcks Villa Kiralamas\u0131 \u0130\u00e7in En \u0130yi B\u00f6lgeleri Ke\u015ffedin",
    },
    heroEyebrow: "L\u00fcks villa kiralama rehberi 2026",
    h1: "Antalya\u2019da L\u00fcks Villa Kiralamas\u0131 \u0130\u00e7in En \u0130yi B\u00f6lgeleri Ke\u015ffedin",
    heroSubtitle:
      "Kalkan, Ka\u015f, Belek ve Antalya \u015eehir Merkezi\u2019ni kar\u015f\u0131la\u015ft\u0131rarak seyahat tarz\u0131n\u0131za en uygun villa ortam\u0131n\u0131 bulun.",
    intro:
      "Antalya\u2019n\u0131n cazibesi \u00e7e\u015fitlili\u011findedir. Baz\u0131 b\u00f6lgeler sessiz ve k\u0131y\u0131sal hissettirirken, di\u011ferleri tarihi, aile odakl\u0131 veya \u015fehir ya\u015fam\u0131na ba\u011fl\u0131d\u0131r. Villa Silyan, size Akdeniz maceran\u0131z i\u00e7in sakin ve \u00f6zel bir \u00fcss\u00fc sunarken, b\u00f6lgeyi kendi h\u0131z\u0131n\u0131zda ke\u015ffetmenize olanak tan\u0131r.",
    whyTitle: "Antalya\u2019da 5 Y\u0131ld\u0131zl\u0131 Otel Yerine Neden Villa Se\u00e7melisiniz?",
    whyBody:
      "Villa Silyan\u2019da villa kiralamak, kalabal\u0131k bir otelde korumas\u0131 zor olan gizlili\u011fi size sunar. Gün bat\u0131m\u0131nda kendi havuzunuzda y\u00fcz\u00fcn, yerel pazar malzemeleriyle yemek haz\u0131rlay\u0131n ve lobi kuyruklar\u0131, belirli yemek saatleri ya da kalabal\u0131k ortak tesisler olmadan geni\u015f i\u00e7 ve d\u0131\u015f mekanlar\u0131n keyfini \u00e7\u0131kar\u0131n.",
    compFeature: "\u00d6zellik",
    compHotel: "5 Y\u0131ld\u0131zl\u0131 Otel",
    compRows: [
      ["Gizlilik", "Tam", "S\u0131n\u0131rl\u0131"],
      ["Havuz", "\u00d6zel", "Ortak"],
      ["Yemek", "Kendi kendine catering", "Belirli saatler"],
      ["Mekan", "Geni\u015f", "Kompakt"],
    ],
    neighborhoodLabel: "Semt b\u00f6l\u00fcm\u00fc",
    fourAreasTitle: "D\u00f6rt b\u00f6lge, tek h\u0131zl\u0131 g\u00f6rsel",
    fourAreasBody:
      "A\u015fa\u011f\u0131daki g\u00f6rsel tek bir referans kolaj\u0131d\u0131r. Her k\u00f6\u015fe farkl\u0131 bir k\u0131y\u0131 ki\u015fili\u011fini yans\u0131t\u0131r; \u00f6nce g\u00f6r\u00fcn\u00fcm\u00fc taray\u0131n, sonra a\u015fa\u011f\u0131daki b\u00f6l\u00fcmlerde her yer i\u00e7in daha ayr\u0131nt\u0131l\u0131 notlar\u0131 okuyun.",
    figcaption:
      "\u00dcst: tepe etekli Kalkan ve tarihi Ka\u015f \u00b7 Alt: aile dostu Belek ve merkezi Antalya",
    quadrantLabels: [
      ["top-left", "Kalkan \u2014 sessiz, manzaral\u0131"],
      ["top-right", "Ka\u015f \u2014 tarih, liman"],
      ["bottom-left", "Belek \u2014 golf & plaj"],
      ["bottom-right", "\u015eehir merkezi \u2014 canl\u0131l\u0131k & eri\u015fim"],
    ],
    inReferenceImage: "yukar\u0131daki referans g\u00f6rselde",
    quadrantPositions: {
      "top-left": "Sol \u00fcst",
      "top-right": "Sa\u011f \u00fcst",
      "bottom-left": "Sol alt",
      "bottom-right": "Sa\u011f alt",
    },
    proTipLabel: "\u0130puc\u0131",
    localAnchorLabel: "Yerel Referans",
    insightTitle: "Ger\u00e7ek D\u00fcnya G\u00f6r\u00fc\u015f\u00fc",
    considerationsTitle: "Antalya Villa Konumunuzu Se\u00e7erken Dikkat Edilecek 5 \u00d6nemli Husus",
    considerations: [
      "Gizlilik ihtiyac\u0131: g\u00fcnl\u00fck ne kadar tecrit istedi\u011finize karar verin.",
      "Cazibe merkezlerine yak\u0131nl\u0131k: tarihi alanlar, plajlar, golf veya do\u011fa aras\u0131nda se\u00e7im yap\u0131n.",
      "Aile gereksinimleri: bah\u00e7eler, yatak odas\u0131 say\u0131s\u0131, havuz g\u00fcvenli\u011fi ve kolay park yeri aray\u0131n.",
      "Aktivite tercihleri: b\u00f6lgeyi dalg\u0131\u00e7l\u0131k, golf, k\u00fclt\u00fcrel ke\u015fif veya plaj zaman\u0131na g\u00f6re se\u00e7in.",
      "Sezonluk kalabal\u0131k: bayram tatilleri her semtin havas\u0131n\u0131 de\u011fi\u015ftirebilir.",
    ],
    beachTitle: "Antalya\u2019n\u0131n Tertemiz Plajlar\u0131na Yak\u0131nl\u0131k: \u00d6nemli Bir Fakt\u00f6r",
    beachBody:
      "Antalya\u2019n\u0131n plajlar\u0131 b\u00fcy\u00fck bir \u00e7ekim g\u00fcc\u00fcd\u00fcr; kolay plaj eri\u015fimine sahip bir villa se\u00e7mek t\u00fcm konaklamay\u0131 \u015fekillendirebilir. Lara Plaj\u0131\u2019n\u0131n alt\u0131n kumlar\u0131n\u0131 ya da Konyaalt\u0131\u2019n\u0131n \u00e7ak\u0131ll\u0131 k\u0131y\u0131s\u0131n\u0131 tercih edin, do\u011fru konumdaki bir villa ani y\u00fcz\u00fcleri ve gün bat\u0131m\u0131 planlar\u0131n\u0131 \u00e7ok daha kolay k\u0131lar.",
    beachAlt: "L\u00fcks villa kiralama b\u00f6lgeleri yak\u0131n\u0131nda Antalya marina ve sahili",
    expertiseTitle: "Yerel Uzmanl\u0131k: Antalya\u2019n\u0131n \u00c7e\u015fitli Semtlerinde Rehberlik",
    expertiseBody:
      "Villa Silyan\u2019\u0131n yerel bilgisi, grubunuzu do\u011fru \u00fcsse e\u015fle\u015ftirmenize yard\u0131mc\u0131 olur; \u00f6ncelik gizlilik, plaj eri\u015fimi, aile kolayl\u0131\u011f\u0131 veya Antalya\u2019n\u0131n restoranlar\u0131na ve tarihi merkezine kolay eri\u015fim olsun.",
    pillarSectionTitle: "\u00d6zel Havuzlu Villa Rehberine Devam Edin",
    pillarSectionBody:
      "\u00d6zel havuzlu l\u00fcks villalar\u0131m\u0131z hakk\u0131nda daha fazla ayr\u0131nt\u0131 i\u00e7in Pillar Sayfam\u0131z\u0131 ziyaret edin.",
    visitPillarBtn: "Pillar Sayfam\u0131z\u0131 Ziyaret Edin",
    viewVillasBtn: "Villa Silyan kiralama se\u00e7eneklerini g\u00f6r\u00fcnt\u00fcle",
    ctaTitle: "Hayalinizdeki Villaya Haz\u0131r M\u0131s\u0131n\u0131z?",
    ctaBody:
      "Ki\u015fisel yard\u0131m, do\u011frudan fiyatlar ve seyahat tarihlerinize \u00f6zel teklifler i\u00e7in Villa Silyan\u2019la iletiime ge\u00e7in.",
    ctaBtn: "Bugün bizimle ileti\u015fime ge\u00e7in",
    sidebarTitle: "Se\u00e7im yapmakta yard\u0131m\u0131 m\u0131 istiyorsunuz?",
    sidebarBody:
      "Grup b\u00fcyükl\u00fc\u011f\u00fcn\u00fcz\u00fc, tarihlerinizi ve tercih etti\u011finiz tempoyu s\u00f6yleyin. Sizi do\u011fru Villa Silyan se\u00e7ene\u011fine y\u00f6nlendirelim.",
    sidebarBtn: "Yerel tavsiye al\u0131n",
    jumpTo: "B\u00f6l\u00fcme git",
    collageAlt:
      "D\u00f6rt Antalya b\u00f6lgesi stili: Kalkan tepelerinde deniz manzaral\u0131 villalar, tarihi Ka\u015f sokaklar\u0131, Belek plaj\u0131 ve golfu, Kalei\u00e7i yak\u0131n\u0131nda Antalya \u015fehir merkezi",
    regions: [
      {
        id: "kalkan",
        shortLabel: "Kalkan",
        title: "Kalkan\u2019\u0131 Ke\u015ffedin: Tecrit Edilmi\u015f L\u00fckse Bir S\u0131\u011f\u0131nak",
        summary:
          "Kalkan, sakin atmosferi ve \u00e7arp\u0131c\u0131 k\u0131y\u0131 \u015feridiyle tan\u0131nan \u015firince bir kasabad\u0131r. Buradaki villalar s\u0131kl\u0131kla yamaclarda konumlan\u0131r; misafirlere panoramik Akdeniz manzaras\u0131 ve suyun \u00fczerinde bir kamp\u0131 hissi sunar. Dar sokaklar butik d\u00fckkânlar ve yerel restoranlarla s\u0131ralanm\u0131\u015ft\u0131r; havuz g\u00fcn\u00fcn\u00fcn ard\u0131ndan yava\u015f ak\u015famlar i\u00e7in idealdir.",
        proTip: "Taze \u00fcr\u00fcnler ve el yapimi \u00fcr\u00fcnler i\u00e7in Per\u015fembe pazar\u0131n\u0131 ziyaret edin.",
        localAnchor:
          "Yakla\u015f\u0131k 10 dakikal\u0131k mesafedeki Kalkan Marinas\u0131, yemek ve tekne turlar\u0131 i\u00e7in idealdir.",
        insight:
          "Kalkan, sessiz ve manzaral\u0131 bir ortam isteyen gezginleri \u00f6d\u00fcllendiriyor; ancak engebeli arazi, hareket k\u0131s\u0131tl\u0131l\u0131\u011f\u0131 olan misafirler i\u00e7in zorlu olabilir. Kolay y\u00fcr\u00fcy\u00fc\u015f \u00f6nemliyse do\u011frudan park yeri ve en az merdiven olan bir villa se\u00e7in.",
        quadrant: "top-left",
      },
      {
        id: "kas",
        shortLabel: "Ka\u015f",
        title: "Ka\u015f: Tarih ve Modern Konfor\u0131n Mükemmel Bulu\u015fmas\u0131",
        summary:
          "Ka\u015f, antik kal\u0131nt\u0131lar\u0131, canl\u0131 liman\u0131, ba\u011f\u0131ms\u0131z d\u00fckkânlar\u0131 ve m\u00fckemmel yemekleriyle \u00f6ne \u00e7\u0131kar. \u00d6zellikle dalgı\u00e7lar taraf\u0131ndan sevilir; yerel operatörler resifler, bat\u0131klar ve berrak su ko\u00e7aka\u011faz\u0131larına turlar d\u00fczenler. K\u00fclt\u00fcrel ve sakin bir k\u0131y\u0131 ritmi arayanlar i\u00e7in Ka\u015f, Antalya\u2019n\u0131n en karakterli \u00fcslerinden biridir.",
        proTip: "Daha sakin bir deneyim i\u00e7in g\u00fcn bat\u0131m\u0131nda antik amfitiyatroyu ziyaret edin.",
        localAnchor:
          "Kasaba merkezi genellikle merkezi villalardan k\u0131sa bir y\u00fcr\u00fcy\u00fc\u015f mesafesinde; d\u00fckkânlara ve kafelere kolay eri\u015fim vard\u0131r.",
        insight:
          "Ka\u015f, \u00f6zellikle hafta sonlar\u0131 yaz sezonunda canl\u0131 hissedebilir. Cazibe ger\u00e7ektir; ancak hafif uyuyanlar en i\u015flek sokaklar\u0131n biraz \u00fczerinde ya da d\u0131\u015f\u0131nda konumlanan villalar\u0131 aramal\u0131d\u0131r.",
        quadrant: "top-right",
      },
      {
        id: "belek",
        shortLabel: "Belek",
        title: "Belek: Golf Sahas\u0131 ve Aile Dostu Villalar",
        summary:
          "Belek, d\u00fcnya standartlar\u0131ndaki golf sahas\u0131, geni\u015f tatil plajlar\u0131 ve daha b\u00fcy\u00fck bah\u00e7eli aile dostu villalarla tan\u0131n\u0131r. Rahat bir tatil ritmi isteyen gruplar i\u00e7in idealdir: sabah golf, \u00f6\u011fleden sonra plaj ve evde \u00f6zel havuz.",
        proTip: "\u00d6zellikle yaz mevsiminde tee saatlerini \u00f6nceden ay\u0131rt\u0131n.",
        localAnchor:
          "Kadriye Plaj\u0131 yakla\u015f\u0131k 15 dakikal\u0131k mesafededir ve aile g\u00fcn\u00fc i\u00e7in uygundur.",
        insight:
          "Belek pratik ve cilal\u0131d\u0131r; ancak okul tatillerinde kalabal\u0131k olabilir. En yo\u011fun kalabal\u0131klardan ka\u00e7\u0131nmak i\u00e7in plaj kl\u00fcpleri, tema parklar\u0131 ve golf ba\u015flang\u0131\u00e7lar\u0131n\u0131 g\u00fcn\u00fcn erken saatinde planlayan.",
        quadrant: "bottom-left",
      },
      {
        id: "city-center",
        shortLabel: "Antalya \u015eehir Merkezi",
        title: "Antalya \u015eehir Merkezi: Canl\u0131 Ya\u015fam ve Kolay Plaj Eri\u015fimi",
        summary:
          "Antalya \u015eehir Merkezi\u2019ne yak\u0131n kalmak size ikisini birden sunar: restoranlar, al\u0131\u015fveri\u015f, Kalei\u00e7i, marina y\u00fcr\u00fcy\u00fc\u015fleri ve Konyaalt\u0131 ile Lara gibi plajlara h\u0131zl\u0131 eri\u015fim. Burada bir villa, \u00f6zel d\u0131\u015f mekan alan\u0131ndan ödün vermeden kolayl\u0131k isteyen gezginler i\u00e7in idealdir.",
        proTip:
          "Antalya tarih ve k\u00fclt\u00fcr\u00fcn\u00fcn yo\u011fun bir dozu i\u00e7in Eski\u015fehir Kalei\u00e7i\u2019ni ziyaret edin.",
        localAnchor:
          "Kentsel tramvay, \u00f6nemli cazibe merkezlerine ula\u015f\u0131m\u0131 kolayla\u015ft\u0131r\u0131r ve ara\u00e7 kiralama ihtiyac\u0131n\u0131 azaltabilir.",
        insight:
          "Merkez do\u011fas\u0131 gere\u011fi daha hareketlidir; g\u00fcr\u00fclt\u00fc de\u011fi\u015f toku\u015fun bir par\u00e7as\u0131 olabilir. Buna kar\u015f\u0131l\u0131k kolay restoran eri\u015fimi, plaj yak\u0131nl\u0131\u011f\u0131 ve daha az s\u00fcr\u00fc\u015f s\u00fcresi elde edersiniz.",
        quadrant: "bottom-right",
      },
    ],
  },

  ar: {
    meta: {
      title:
        "\u0623\u0641\u0636\u0644 \u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627: \u062f\u0644\u064a\u0644 \u062a\u0623\u062c\u064a\u0631 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0641\u0627\u062e\u0631\u0629 2026",
      description:
        "\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u062b\u0627\u0644\u064a \u0644\u0625\u062c\u0627\u0632\u062a\u0643 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627. \u0645\u0642\u0627\u0631\u0646\u0629 \u0643\u0644\u0643\u0627\u0646 \u0648\u0643\u0627\u0634 \u0648\u0628\u064a\u0644\u064a\u0643 \u0648\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0644\u062a\u0623\u062c\u064a\u0631 \u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629. \u0646\u0635\u0627\u0626\u062d \u0648\u0631\u0624\u0649 \u0645\u062d\u0644\u064a\u0629.",
      heroAlt:
        "\u0635\u0648\u0631\u0629 \u062c\u0648\u064a\u0629 \u0644\u0633\u0627\u062d\u0644 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0623\u0641\u0636\u0644 \u0645\u0646\u0637\u0642\u0629 \u0644\u0644\u0625\u0642\u0627\u0645\u0629",
      jsonLdHeadline:
        "\u0627\u0643\u062a\u0634\u0641 \u0623\u0641\u0636\u0644 \u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0644\u062a\u0623\u062c\u064a\u0631 \u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629",
    },
    heroEyebrow: "\u062f\u0644\u064a\u0644 \u062a\u0623\u062c\u064a\u0631 \u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629 2026",
    h1: "\u0627\u0643\u062a\u0634\u0641 \u0623\u0641\u0636\u0644 \u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0644\u062a\u0623\u062c\u064a\u0631 \u0641\u064a\u0644\u0627\u062a \u0641\u0627\u062e\u0631\u0629",
    heroSubtitle:
      "\u0642\u0627\u0631\u0646 \u0628\u064a\u0646 \u0643\u0644\u0643\u0627\u0646 \u0648\u0643\u0627\u0634 \u0648\u0628\u064a\u0644\u064a\u0643 \u0648\u0645\u0631\u0643\u0632 \u0645\u062f\u064a\u0646\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0644\u062a\u062c\u062f \u0645\u0627 \u064a\u0646\u0627\u0633\u0628 \u0623\u0633\u0644\u0648\u0628 \u0633\u0641\u0631\u0643.",
    intro:
      "\u062a\u0643\u0645\u0646 \u062c\u0627\u0630\u0628\u064a\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0641\u064a \u062a\u0646\u0648\u0639\u0647\u0627. \u0628\u0639\u0636 \u0627\u0644\u0645\u0646\u0627\u0637\u0642 \u0633\u0627\u062d\u0644\u064a\u0629 \u0645\u0646\u0639\u0632\u0644\u0629\u060c \u0648\u0623\u062e\u0631\u0649 \u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0623\u0648 \u0639\u0627\u0626\u0644\u064a\u0629. \u064a\u0648\u0641\u0631 Villa Silyan \u0642\u0627\u0639\u062f\u0629 \u062e\u0627\u0635\u0629 \u0647\u0627\u062f\u0626\u0629 \u0644\u0645\u063a\u0627\u0645\u0631\u062a\u0643 \u0627\u0644\u0645\u062a\u0648\u0633\u0637\u064a\u0629\u060c \u0645\u0639 \u0645\u0631\u0648\u0646\u0629 \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0628\u0648\u062a\u064a\u0631\u062a\u0643 \u0627\u0644\u062e\u0627\u0635\u0629.",
    whyTitle:
      "\u0644\u0645\u0627\u0630\u0627 \u062a\u062e\u062a\u0627\u0631 \u0641\u064a\u0644\u0627 \u0628\u062f\u0644\u0627\u064b \u0645\u0646 \u0641\u0646\u062f\u0642 \u062e\u0645\u0633 \u0646\u062c\u0648\u0645 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627\u061f",
    whyBody:
      "\u062a\u0623\u062c\u064a\u0631 \u0641\u064a\u0644\u0627 \u0641\u064a Villa Silyan \u064a\u0645\u0646\u062d\u0643 \u062e\u0635\u0648\u0635\u064a\u0629 \u064a\u0635\u0639\u0628 \u0627\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u064a\u0647\u0627 \u0641\u064a \u0641\u0646\u062f\u0642 \u0645\u0632\u062f\u062d\u0645. \u0627\u0633\u0628\u062d \u0641\u064a \u0645\u0633\u0628\u062d\u0643 \u0639\u0646\u062f \u0627\u0644\u063a\u0631\u0648\u0628\u060c \u062d\u0636\u0651\u0631 \u0648\u062c\u0628\u0627\u062a\u0643 \u0628\u0645\u0643\u0648\u0646\u0627\u062a \u0627\u0644\u0633\u0648\u0642 \u0627\u0644\u0645\u062d\u0644\u064a\u0629\u060c \u0648\u0627\u0633\u062a\u0645\u062a\u0639 \u0628\u0645\u0633\u0627\u062d\u0627\u062a \u062f\u0627\u062e\u0644\u064a\u0629 \u0648\u062e\u0627\u0631\u062c\u064a\u0629 \u0641\u0633\u064a\u062d\u0629.",
    compFeature: "\u0627\u0644\u0645\u064a\u0632\u0629",
    compHotel: "\u0641\u0646\u062f\u0642 \u062e\u0645\u0633 \u0646\u062c\u0648\u0645",
    compRows: [
      ["\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629", "\u062a\u0627\u0645\u0629", "\u0645\u062d\u062f\u0648\u062f\u0629"],
      ["\u0627\u0644\u0645\u0633\u0628\u062d", "\u062e\u0627\u0635", "\u0645\u0634\u062a\u0631\u0643"],
      ["\u0627\u0644\u0637\u0639\u0627\u0645", "\u0637\u0647\u064a \u0630\u0627\u062a\u064a", "\u0633\u0627\u0639\u0627\u062a \u0645\u062d\u062f\u062f\u0629"],
      ["\u0627\u0644\u0645\u0633\u0627\u062d\u0629", "\u0641\u0633\u064a\u062d\u0629", "\u0645\u062d\u062f\u0648\u062f\u0629"],
    ],
    neighborhoodLabel: "\u0641\u0635\u0644 \u0627\u0644\u062d\u064a",
    fourAreasTitle: "\u0623\u0631\u0628\u0639\u0629 \u0645\u0646\u0627\u0637\u0642\u060c \u0635\u0648\u0631\u0629 \u0648\u0627\u062d\u062f\u0629",
    fourAreasBody:
      "\u0627\u0644\u0635\u0648\u0631\u0629 \u0623\u062f\u0646\u0627\u0647 \u0643\u0648\u0644\u0627\u062c \u0645\u0631\u062c\u0639\u064a \u0648\u0627\u062d\u062f. \u0643\u0644 \u0631\u0628\u0639 \u064a\u0639\u0643\u0633 \u0634\u062e\u0635\u064a\u0629 \u0633\u0627\u062d\u0644\u064a\u0629 \u0645\u062e\u062a\u0644\u0641\u0629\u060c \u062a\u0635\u0641\u062d \u0627\u0644\u0645\u0638\u0647\u0631 \u0648\u0627\u0644\u0625\u062d\u0633\u0627\u0633 \u0623\u0648\u0644\u0627\u064b\u060c \u062b\u0645 \u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0644\u0627\u062d\u0638\u0627\u062a \u0627\u0644\u062a\u0641\u0635\u064a\u0644\u064a\u0629 \u0644\u0643\u0644 \u0645\u0643\u0627\u0646.",
    figcaption:
      "\u0623\u0639\u0644\u0649: \u0643\u0644\u0643\u0627\u0646 \u0627\u0644\u062c\u0628\u0644\u064a\u0629 \u0648\u0643\u0627\u0634 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u00b7 \u0623\u0633\u0641\u0644: \u0628\u064a\u0644\u064a\u0643 \u0627\u0644\u0639\u0627\u0626\u0644\u064a\u0629 \u0648\u0645\u0631\u0643\u0632 \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    quadrantLabels: [
      ["top-left", "\u0643\u0644\u0643\u0627\u0646 \u2014 \u0645\u0646\u0639\u0632\u0644\u0629\u060c \u0625\u0637\u0644\u0627\u0644\u0627\u062a"],
      ["top-right", "\u0643\u0627\u0634 \u2014 \u062a\u0627\u0631\u064a\u062e\u060c \u0645\u064a\u0646\u0627\u0621"],
      ["bottom-left", "\u0628\u064a\u0644\u064a\u0643 \u2014 \u063a\u0648\u0644\u0641 \u0648\u0634\u0627\u0637\u0626"],
      ["bottom-right", "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u2014 \u062d\u064a\u0648\u064a\u0629 \u0648\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644"],
    ],
    inReferenceImage: "\u0641\u064a \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0631\u062c\u0639\u064a\u0629 \u0623\u0639\u0644\u0627\u0647",
    quadrantPositions: {
      "top-left": "\u0623\u0639\u0644\u0649 \u064a\u0633\u0627\u0631",
      "top-right": "\u0623\u0639\u0644\u0649 \u064a\u0645\u064a\u0646",
      "bottom-left": "\u0623\u0633\u0641\u0644 \u064a\u0633\u0627\u0631",
      "bottom-right": "\u0623\u0633\u0641\u0644 \u064a\u0645\u064a\u0646",
    },
    proTipLabel: "\u0646\u0635\u064a\u062d\u0629",
    localAnchorLabel: "\u0645\u0631\u062c\u0639 \u0645\u062d\u0644\u064a",
    insightTitle: "\u0631\u0624\u064a\u0629 \u0648\u0627\u0642\u0639\u064a\u0629",
    considerationsTitle:
      "\u0623\u0647\u0645 5 \u0627\u0639\u062a\u0628\u0627\u0631\u0627\u062a \u0639\u0646\u062f \u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0648\u0642\u0639 \u0641\u064a\u0644\u062a\u0643 \u0641\u064a \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    considerations: [
      "\u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629: \u062d\u062f\u062f \u0645\u0642\u062f\u0627\u0631 \u0627\u0644\u0639\u0632\u0644\u0629 \u0627\u0644\u062a\u064a \u062a\u0631\u064a\u062f\u0647\u0627 \u064a\u0648\u0645\u064a\u0627\u064b.",
      "\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0627\u0644\u0645\u0639\u0627\u0644\u0645: \u0627\u062e\u062a\u0631 \u0628\u064a\u0646 \u0627\u0644\u0645\u0648\u0627\u0642\u0639 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0648\u0627\u0644\u0634\u0648\u0627\u0637\u0626 \u0648\u0627\u0644\u063a\u0648\u0644\u0641 \u0648\u0627\u0644\u0637\u0628\u064a\u0639\u0629.",
      "\u0645\u062a\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0639\u0627\u0626\u0644\u0629: \u0627\u0628\u062d\u062b \u0639\u0646 \u062d\u062f\u0627\u0626\u0642 \u0648\u063a\u0631\u0641 \u0646\u0648\u0645 \u0648\u0623\u0645\u0627\u0646 \u0627\u0644\u0645\u0633\u0628\u062d \u0648\u0645\u0648\u0627\u0642\u0641.",
      "\u062a\u0641\u0636\u064a\u0644\u0627\u062a \u0627\u0644\u0623\u0646\u0634\u0637\u0629: \u0637\u0627\u0628\u0642 \u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u063a\u0637\u0633 \u0623\u0648 \u0627\u0644\u063a\u0648\u0644\u0641 \u0623\u0648 \u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0623\u0648 \u0648\u0642\u062a \u0627\u0644\u0634\u0627\u0637\u0626.",
      "\u0627\u0644\u0627\u0632\u062f\u062d\u0627\u0645 \u0627\u0644\u0645\u0648\u0633\u0645\u064a: \u0642\u062f \u062a\u063a\u064a\u0631 \u0625\u062c\u0627\u0632\u0627\u062a \u0627\u0644\u0630\u0631\u0648\u0629 \u0637\u0627\u0628\u0639 \u0643\u0644 \u062d\u064a.",
    ],
    beachTitle:
      "\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0634\u0648\u0627\u0637\u0626 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0627\u0644\u0646\u0642\u064a\u0629: \u0639\u0627\u0645\u0644 \u0623\u0633\u0627\u0633\u064a",
    beachBody:
      "\u0634\u0648\u0627\u0637\u0626 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u062c\u0630\u0628 \u0643\u0628\u064a\u0631\u060c \u0648\u0627\u062e\u062a\u064a\u0627\u0631 \u0641\u064a\u0644\u0627 \u0628\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0634\u0627\u0637\u0626 \u0642\u062f \u064a\u0634\u0643\u0644 \u0643\u0627\u0645\u0644 \u0625\u0642\u0627\u0645\u062a\u0643. \u0633\u0648\u0627\u0621 \u0641\u0636\u0644\u062a \u0631\u0645\u0627\u0644 \u0634\u0627\u0637\u0626 \u0644\u0627\u0631\u0627 \u0627\u0644\u0630\u0647\u0628\u064a\u0629 \u0623\u0648 \u0634\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a\u060c \u0641\u064a\u0644\u0627 \u062c\u064a\u062f\u0629 \u0627\u0644\u0645\u0648\u0642\u0639 \u062a\u064a\u0633\u0631 \u0627\u0644\u0633\u0628\u0627\u062d\u0629 \u0627\u0644\u0639\u0641\u0648\u064a\u0629 \u0648\u062e\u0637\u0637 \u063a\u0631\u0648\u0628 \u0627\u0644\u0634\u0645\u0633.",
    beachAlt:
      "\u0645\u064a\u0646\u0627\u0621 \u0648\u0633\u0627\u062d\u0644 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0645\u0646\u0627\u0637\u0642 \u062a\u0623\u062c\u064a\u0631 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0641\u0627\u062e\u0631\u0629",
    expertiseTitle:
      "\u062e\u0628\u0631\u0629 \u0645\u062d\u0644\u064a\u0629: \u0627\u0644\u062a\u0646\u0642\u0644 \u0641\u064a \u0623\u062d\u064a\u0627\u0621 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0627\u0644\u0645\u062a\u0646\u0648\u0639\u0629",
    expertiseBody:
      "\u062a\u0633\u0627\u0639\u062f \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0645\u062d\u0644\u064a\u0629 \u0644\u0640 Villa Silyan \u0641\u064a \u0645\u0637\u0627\u0628\u0642\u0629 \u0645\u062c\u0645\u0648\u0639\u062a\u0643 \u0645\u0639 \u0627\u0644\u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0635\u062d\u064a\u062d\u0629\u060c \u0633\u0648\u0627\u0621 \u0643\u0627\u0646\u062a \u0627\u0644\u0623\u0648\u0644\u0648\u064a\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0623\u0648 \u0627\u0644\u0634\u0627\u0637\u0626 \u0623\u0648 \u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0645\u0631\u0643\u0632 \u0623\u0646\u0637\u0627\u0644\u064a\u0627.",
    pillarSectionTitle:
      "\u0627\u0646\u062a\u0642\u0644 \u0625\u0644\u0649 \u062f\u0644\u064a\u0644 \u0641\u064a\u0644\u0627 \u0627\u0644\u0645\u0633\u0628\u062d \u0627\u0644\u062e\u0627\u0635",
    pillarSectionBody:
      "\u0644\u0645\u0632\u064a\u062f \u0645\u0646 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u062d\u0648\u0644 \u0641\u064a\u0644\u0627\u062a\u0646\u0627 \u0627\u0644\u0641\u0627\u062e\u0631\u0629 \u0630\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0628\u062d \u0627\u0644\u062e\u0627\u0635\u0629\u060c \u0632\u0631 \u0635\u0641\u062d\u062a\u0646\u0627 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629.",
    visitPillarBtn: "\u0632\u0631 \u0635\u0641\u062d\u062a\u0646\u0627 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
    viewVillasBtn: "\u0639\u0631\u0636 \u0641\u064a\u0644\u0627\u062a Villa Silyan",
    ctaTitle: "\u0647\u0644 \u0623\u0646\u062a \u0645\u0633\u062a\u0639\u062f \u0644\u062d\u062c\u0632 \u0641\u064a\u0644\u0627 \u0623\u062d\u0644\u0627\u0645\u0643\u061f",
    ctaBody:
      "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 Villa Silyan \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0645\u0633\u0627\u0639\u062f\u0629 \u0634\u062e\u0635\u064a\u0629 \u0648\u0623\u0633\u0639\u0627\u0631 \u0645\u0628\u0627\u0634\u0631\u0629 \u0648\u0639\u0631\u0648\u0636 \u062d\u0635\u0631\u064a\u0629 \u062a\u0646\u0627\u0633\u0628 \u062a\u0648\u0627\u0631\u064a\u062e \u0633\u0641\u0631\u0643.",
    ctaBtn: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0627\u0644\u064a\u0648\u0645",
    sidebarTitle: "\u062a\u062d\u062a\u0627\u062c \u0645\u0633\u0627\u0639\u062f\u0629 \u0641\u064a \u0627\u0644\u0627\u062e\u062a\u064a\u0627\u0631\u061f",
    sidebarBody:
      "\u0623\u062e\u0628\u0631\u0646\u0627 \u0628\u062d\u062c\u0645 \u0645\u062c\u0645\u0648\u0639\u062a\u0643 \u0648\u062a\u0648\u0627\u0631\u064a\u062e\u0643 \u0648\u0648\u062a\u064a\u0631\u062a\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629. \u0633\u0646\u062f\u0644\u0643 \u0625\u0644\u0649 \u062e\u064a\u0627\u0631 Villa Silyan \u0627\u0644\u0645\u0646\u0627\u0633\u0628.",
    sidebarBtn: "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0646\u0635\u064a\u062d\u0629 \u0645\u062d\u0644\u064a\u0629",
    jumpTo: "\u0627\u0646\u062a\u0642\u0644 \u0625\u0644\u0649",
    collageAlt:
      "\u0623\u0631\u0628\u0639\u0629 \u0623\u0633\u0627\u0644\u064a\u0628 \u0644\u0645\u0646\u0627\u0637\u0642 \u0623\u0646\u0637\u0627\u0644\u064a\u0627: \u0641\u064a\u0644\u0627\u062a \u0643\u0644\u0643\u0627\u0646 \u0627\u0644\u062c\u0628\u0644\u064a\u0629\u060c \u0634\u0648\u0627\u0631\u0639 \u0643\u0627\u0634 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629\u060c \u0634\u0627\u0637\u0626 \u0628\u064a\u0644\u064a\u0643 \u0648\u0645\u0631\u0643\u0632 \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
    regions: [
      {
        id: "kalkan",
        shortLabel: "\u0643\u0644\u0643\u0627\u0646",
        title:
          "\u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0643\u0644\u0643\u0627\u0646: \u0645\u0644\u0627\u0630 \u0627\u0644\u0641\u062e\u0627\u0645\u0629 \u0627\u0644\u0645\u0646\u0639\u0632\u0644\u0629",
        summary:
          "\u0643\u0644\u0643\u0627\u0646 \u0628\u0644\u062f\u0629 \u062e\u0644\u0627\u0628\u0629 \u062a\u062a\u0645\u064a\u0632 \u0628\u0623\u062c\u0648\u0627\u0626\u0647\u0627 \u0627\u0644\u0647\u0627\u062f\u0626\u0629 \u0648\u0633\u0627\u062d\u0644\u0647\u0627 \u0627\u0644\u062f\u0631\u0627\u0645\u064a. \u063a\u0627\u0644\u0628\u0627\u064b \u0645\u0627 \u062a\u062a\u0631\u0628\u0639 \u0641\u064a\u0644\u0627\u062a\u0647\u0627 \u0627\u0644\u062a\u0644\u0627\u0644\u060c \u0645\u0645\u0627 \u064a\u0645\u0646\u062d \u0627\u0644\u0636\u064a\u0648\u0641 \u0645\u0646\u0638\u0648\u0631\u0627\u064b \u0628\u0627\u0646\u0648\u0631\u0627\u0645\u064a\u0627\u064b \u0639\u0644\u0649 \u0627\u0644\u0628\u062d\u0631 \u0627\u0644\u0645\u062a\u0648\u0633\u0637. \u0627\u0644\u0634\u0648\u0627\u0631\u0639 \u0627\u0644\u0636\u064a\u0642\u0629 \u0645\u0632\u062f\u062d\u0645\u0629 \u0628\u0627\u0644\u0645\u062d\u0644\u0627\u062a \u0648\u0627\u0644\u0645\u0637\u0627\u0639\u0645 \u0627\u0644\u0645\u062d\u0644\u064a\u0629.",
        proTip:
          "\u0632\u0631 \u0633\u0648\u0642 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u0645\u062d\u0644\u064a \u0644\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0627\u0644\u0637\u0627\u0632\u062c\u0629 \u0648\u0627\u0644\u062d\u0631\u0641\u064a\u0629.",
        localAnchor:
          "\u0645\u064a\u0646\u0627\u0621 \u0643\u0644\u0643\u0627\u0646\u060c \u0639\u0644\u0649 \u0628\u0639\u062f 10 \u062f\u0642\u0627\u0626\u0642\u060c \u0645\u062b\u0627\u0644\u064a \u0644\u0644\u0637\u0639\u0627\u0645 \u0648\u062c\u0648\u0644\u0627\u062a \u0627\u0644\u0642\u0648\u0627\u0631\u0628.",
        insight:
          "\u0643\u0644\u0643\u0627\u0646 \u062a\u0643\u0627\u0641\u0626 \u0645\u0646 \u064a\u0631\u064a\u062f \u0647\u062f\u0648\u0621 \u0648\u0625\u0637\u0644\u0627\u0644\u0627\u062a\u060c \u0644\u0643\u0646 \u062a\u0636\u0627\u0631\u064a\u0633\u0647\u0627 \u0642\u062f \u062a\u0643\u0648\u0646 \u0635\u0639\u0628\u0629 \u0644\u0630\u0648\u064a \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a \u0627\u0644\u062e\u0627\u0635\u0629.",
        quadrant: "top-left",
      },
      {
        id: "kas",
        shortLabel: "\u0643\u0627\u0634",
        title:
          "\u0643\u0627\u0634: \u0627\u0644\u0645\u0632\u064a\u062c \u0627\u0644\u0645\u062b\u0627\u0644\u064a \u0628\u064a\u0646 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0648\u0627\u0644\u0631\u0627\u062d\u0629 \u0627\u0644\u0639\u0635\u0631\u064a\u0629",
        summary:
          "\u062a\u062c\u0645\u0639 \u0643\u0627\u0634 \u0627\u0644\u0622\u062b\u0627\u0631 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0648\u0645\u064a\u0646\u0627\u0621\u064b \u062d\u064a\u0648\u064a\u0627\u064b \u0648\u0645\u062d\u0644\u0627\u062a \u0645\u0633\u062a\u0642\u0644\u0629 \u0648\u0637\u0639\u0627\u0645\u0627\u064b \u0645\u0645\u062a\u0627\u0632\u0627\u064b. \u064a\u062d\u0628\u0647\u0627 \u0628\u0634\u0643\u0644 \u062e\u0627\u0635 \u0647\u0648\u0627\u0629 \u0627\u0644\u063a\u0637\u0633\u060c \u0648\u062a\u0646\u0638\u0645 \u0645\u0634\u063a\u0644\u0627\u062a \u0645\u062d\u0644\u064a\u0629 \u0631\u062d\u0644\u0627\u062a \u0625\u0644\u0649 \u0627\u0644\u0634\u0639\u0627\u0628 \u0648\u0627\u0644\u062d\u0637\u0627\u0645.",
        proTip:
          "\u0644\u062a\u062c\u0631\u0628\u0629 \u0623\u0647\u062f\u0623\u060c \u0632\u0631 \u0627\u0644\u0645\u062f\u0631\u0651\u062c \u0627\u0644\u0642\u062f\u064a\u0645 \u0639\u0646\u062f \u0627\u0644\u063a\u0631\u0648\u0628.",
        localAnchor:
          "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0639\u0627\u062f\u0629\u064b \u0639\u0644\u0649 \u0628\u0639\u062f \u0645\u0634\u064a \u0642\u0635\u064a\u0631 \u0645\u0646 \u0627\u0644\u0641\u064a\u0644\u0627\u062a \u0627\u0644\u0645\u0631\u0643\u0632\u064a\u0629.",
        insight:
          "\u062a\u0628\u062f\u0648 \u0643\u0627\u0634 \u062d\u064a\u0648\u064a\u0629 \u0641\u064a \u0627\u0644\u0630\u0631\u0648\u0629. \u0627\u0644\u062c\u0627\u0630\u0628\u064a\u0629 \u062d\u0642\u064a\u0642\u064a\u0629\u060c \u0644\u0643\u0646 \u062e\u0641\u064a\u0641\u064a \u0627\u0644\u0646\u0648\u0645 \u064a\u0628\u062d\u062b\u0648\u0646 \u0639\u0646 \u0641\u064a\u0644\u0627\u062a \u0628\u0639\u064a\u062f\u0629 \u0642\u0644\u064a\u0644\u0627\u064b \u0639\u0646 \u0627\u0644\u0634\u0648\u0627\u0631\u0639 \u0627\u0644\u0645\u0632\u062f\u062d\u0645\u0629.",
        quadrant: "top-right",
      },
      {
        id: "belek",
        shortLabel: "\u0628\u064a\u0644\u064a\u0643",
        title: "\u0628\u064a\u0644\u064a\u0643: \u0645\u0644\u0627\u0639\u0628 \u0627\u0644\u063a\u0648\u0644\u0641 \u0648\u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629",
        summary:
          "\u062a\u0634\u062a\u0647\u0631 \u0628\u064a\u0644\u064a\u0643 \u0628\u0645\u0644\u0627\u0639\u0628 \u063a\u0648\u0644\u0641 \u0639\u0627\u0644\u0645\u064a\u0629\u060c \u0634\u0648\u0627\u0637\u0626 \u0645\u0646\u062a\u062c\u0639\u064a\u0629 \u0648\u0627\u0633\u0639\u0629\u060c \u0648\u0641\u064a\u0644\u0627\u062a \u0639\u0627\u0626\u0644\u064a\u0629 \u0628\u062d\u062f\u0627\u0626\u0642 \u0641\u0633\u064a\u062d\u0629. \u0645\u062b\u0627\u0644\u064a\u0629 \u0644\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a: \u063a\u0648\u0644\u0641 \u0635\u0628\u0627\u062d\u0627\u064b\u060c \u0634\u0627\u0637\u0626 \u0628\u0639\u062f \u0627\u0644\u0638\u0647\u0631\u060c \u0645\u0633\u0628\u062d \u062e\u0627\u0635 \u0645\u0633\u0627\u0621\u064b.",
        proTip: "\u0627\u062d\u062c\u0632 \u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u062a\u064a \u0645\u0633\u0628\u0642\u0627\u064b \u062e\u0627\u0635\u0629 \u0641\u064a \u0627\u0644\u0645\u0648\u0633\u0645 \u0627\u0644\u0645\u0631\u062a\u0641\u0639.",
        localAnchor:
          "\u0634\u0627\u0637\u0626 \u0643\u0627\u062f\u0631\u064a\u0629 \u0639\u0644\u0649 \u0628\u0639\u062f 15 \u062f\u0642\u064a\u0642\u0629\u060c \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0639\u0627\u0626\u0644\u0627\u062a.",
        insight:
          "\u0628\u064a\u0644\u064a\u0643 \u0645\u0631\u064a\u062d\u0629 \u0648\u0645\u062a\u0637\u0648\u0631\u0629\u060c \u0644\u0643\u0646\u0647\u0627 \u0642\u062f \u062a\u0632\u062f\u062d\u0645 \u062e\u0644\u0627\u0644 \u0627\u0644\u0639\u0637\u0644. \u062e\u0637\u0637 \u0645\u0628\u0643\u0631\u0627\u064b \u0644\u062a\u062c\u0646\u0628 \u0623\u0643\u062b\u0631 \u0627\u0644\u0623\u0648\u0642\u0627\u062a \u0627\u0632\u062f\u062d\u0627\u0645\u0627\u064b.",
        quadrant: "bottom-left",
      },
      {
        id: "city-center",
        shortLabel: "\u0645\u0631\u0643\u0632 \u0645\u062f\u064a\u0646\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627",
        title:
          "\u0645\u0631\u0643\u0632 \u0645\u062f\u064a\u0646\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627: \u062d\u064a\u0627\u0629 \u0646\u0627\u0628\u0636\u0629 \u0648\u0633\u0647\u0648\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0634\u0627\u0637\u0626",
        summary:
          "\u0627\u0644\u0625\u0642\u0627\u0645\u0629 \u0628\u0627\u0644\u0642\u0631\u0628 \u0645\u0646 \u0645\u0631\u0643\u0632 \u0645\u062f\u064a\u0646\u0629 \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u064a\u0645\u0646\u062d\u0643 \u0627\u0644\u0623\u0641\u0636\u0644 \u0645\u0646 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0646: \u0645\u0637\u0627\u0639\u0645 \u0648\u062a\u0633\u0648\u0642 \u0648\u0643\u0627\u0644\u064a\u062a\u0634\u064a \u0648\u0627\u0644\u0648\u0635\u0648\u0644 \u0627\u0644\u0633\u0631\u064a\u0639 \u0625\u0644\u0649 \u0634\u0648\u0627\u0637\u0626 \u0643\u0648\u0646\u064a\u0627\u0644\u062a\u064a \u0648\u0644\u0627\u0631\u0627.",
        proTip:
          "\u0632\u0631 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0627\u0644\u0642\u062f\u064a\u0645\u0629 \u0643\u0627\u0644\u064a\u062a\u0634\u064a \u0644\u062c\u0631\u0639\u0629 \u0633\u0631\u064a\u0639\u0629 \u0645\u0646 \u062a\u0627\u0631\u064a\u062e \u0623\u0646\u0637\u0627\u0644\u064a\u0627 \u0648\u062b\u0642\u0627\u0641\u062a\u0647\u0627.",
        localAnchor:
          "\u062a\u0631\u0627\u0645 \u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u064a\u0648\u0641\u0631 \u0648\u0635\u0648\u0644\u0627\u064b \u0645\u0631\u064a\u062d\u0627\u064b \u0625\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u0644\u0645 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629.",
        insight:
          "\u0627\u0644\u0645\u0631\u0643\u0632 \u0623\u0643\u062b\u0631 \u062d\u064a\u0648\u064a\u0629 \u0628\u0637\u0628\u064a\u0639\u062a\u0647\u060c \u0645\u0645\u0627 \u064a\u0639\u0646\u064a \u0623\u0646 \u0627\u0644\u0636\u062c\u064a\u062c \u0642\u062f \u064a\u0643\u0648\u0646 \u062c\u0632\u0621\u0627\u064b \u0645\u0646 \u0627\u0644\u062a\u0628\u0627\u062f\u0644. \u0641\u064a \u0627\u0644\u0645\u0642\u0627\u0628\u0644 \u0645\u0637\u0627\u0639\u0645 \u0633\u0647\u0644\u0629 \u0627\u0644\u0648\u0635\u0648\u0644 \u0648\u0642\u0631\u0628 \u0627\u0644\u0634\u0627\u0637\u0626.",
        quadrant: "bottom-right",
      },
    ],
  },

  ru: {
    meta: {
      title:
        "\u041b\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0439\u043e\u043d\u044b \u0434\u043b\u044f \u043f\u0440\u043e\u0436\u0438\u0432\u0430\u043d\u0438\u044f \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435: \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e 2026",
      description:
        "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u043c\u0435\u0441\u0442\u043e \u0434\u043b\u044f \u043e\u0442\u0434\u044b\u0445\u0430 \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435. \u0421\u0440\u0430\u0432\u043d\u0438\u0442\u0435 \u041a\u0430\u043b\u043a\u0430\u043d, \u041a\u0430\u0448, \u0411\u0435\u043b\u0435\u043a \u0438 \u0446\u0435\u043d\u0442\u0440 \u0433\u043e\u0440\u043e\u0434\u0430 \u0434\u043b\u044f \u0430\u0440\u0435\u043d\u0434\u044b \u0432\u0438\u043b\u043b\u044b. \u041c\u0435\u0441\u0442\u043d\u044b\u0435 \u0441\u043e\u0432\u0435\u0442\u044b.",
      heroAlt:
        "\u0410\u044d\u0440\u043e\u0444\u043e\u0442\u043e \u043f\u043e\u0431\u0435\u0440\u0435\u0436\u044c\u044f \u0410\u043d\u0442\u0430\u043b\u044c\u0438 \u2014 \u0432\u044b\u0431\u043e\u0440 \u043b\u0443\u0447\u0448\u0435\u0433\u043e \u0440\u0430\u0439\u043e\u043d\u0430 \u0434\u043b\u044f \u043e\u0442\u0434\u044b\u0445\u0430",
      jsonLdHeadline:
        "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043b\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0439\u043e\u043d\u044b \u0434\u043b\u044f \u0430\u0440\u0435\u043d\u0434\u044b \u0432\u0438\u043b\u043b\u044b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    },
    heroEyebrow: "\u0420\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u043e \u043f\u043e \u0430\u0440\u0435\u043d\u0434\u0435 \u0432\u0438\u043b\u043b 2026",
    h1: "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u043b\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0439\u043e\u043d\u044b \u0434\u043b\u044f \u0430\u0440\u0435\u043d\u0434\u044b \u0440\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0445 \u0432\u0438\u043b\u043b \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435",
    heroSubtitle:
      "\u0421\u0440\u0430\u0432\u043d\u0438\u0442\u0435 \u041a\u0430\u043b\u043a\u0430\u043d, \u041a\u0430\u0448, \u0411\u0435\u043b\u0435\u043a \u0438 \u0446\u0435\u043d\u0442\u0440 \u0410\u043d\u0442\u0430\u043b\u044c\u0438, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0439\u0442\u0438 \u0432\u0438\u043b\u043b\u0443, \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0443\u044e \u0432\u0430\u0448\u0435\u043c\u0443 \u0441\u0442\u0438\u043b\u044e \u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044f.",
    intro:
      "\u041f\u0440\u0438\u0432\u043b\u0435\u043a\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0410\u043d\u0442\u0430\u043b\u044c\u0438 \u2014 \u0432 \u0435\u0451 \u0440\u0430\u0437\u043d\u043e\u043e\u0431\u0440\u0430\u0437\u0438\u0438. \u041e\u0434\u043d\u0438 \u0440\u0430\u0439\u043e\u043d\u044b \u0443\u044e\u0442\u043d\u044b \u0438 \u043f\u0440\u0438\u0431\u0440\u0435\u0436\u043d\u044b\u0435, \u0434\u0440\u0443\u0433\u0438\u0435 \u2014 \u0438\u0441\u0442\u043e\u0440\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0438\u043b\u0438 \u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u043d\u0430 \u0441\u0435\u043c\u044c\u044e. Villa Silyan \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u0443\u044e \u0447\u0430\u0441\u0442\u043d\u0443\u044e \u0431\u0430\u0437\u0443 \u0441 \u0433\u0438\u0431\u043a\u0438\u043c \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435\u043c.",
    whyTitle:
      "\u041f\u043e\u0447\u0435\u043c\u0443 \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0438\u043b\u043b\u0443, \u0430 \u043d\u0435 5-\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u044b\u0439 \u043e\u0442\u0435\u043b\u044c \u0432 \u0410\u043d\u0442\u0430\u043b\u044c\u0435?",
    whyBody:
      "\u0410\u0440\u0435\u043d\u0434\u0430 \u0432\u0438\u043b\u043b\u044b \u0432 Villa Silyan \u0434\u0430\u0451\u0442 \u0432\u0430\u043c \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c, \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u0441\u043b\u043e\u0436\u043d\u043e \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0432 \u043e\u0436\u0438\u0432\u043b\u0451\u043d\u043d\u043e\u043c \u043e\u0442\u0435\u043b\u0435. \u041f\u043b\u0430\u0432\u0430\u0439\u0442\u0435 \u0432 \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u043c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0435 \u043d\u0430 \u0437\u0430\u043a\u0430\u0442\u0435, \u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435 \u0435\u0434\u0443 \u0438\u0437 \u043c\u0435\u0441\u0442\u043d\u044b\u0445 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u043e\u0432 \u0438 \u043d\u0430\u0441\u043b\u0430\u0436\u0434\u0430\u0439\u0442\u0435\u0441\u044c \u043f\u0440\u043e\u0441\u0442\u0440\u043e\u0441\u0442\u044c\u044e.",
    compFeature: "\u0425\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0430",
    compHotel: "5-\u0437\u0432\u0451\u0437\u0434\u043e\u0447\u043d\u044b\u0439 \u043e\u0442\u0435\u043b\u044c",
    compRows: [
      ["\u041f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u044c", "\u041f\u043e\u043b\u043d\u0430\u044f", "\u041e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u043d\u0430\u044f"],
      ["\u0411\u0430\u0441\u0441\u0435\u0439\u043d", "\u0427\u0430\u0441\u0442\u043d\u044b\u0439", "\u041e\u0431\u0449\u0438\u0439"],
      ["\u041f\u0438\u0442\u0430\u043d\u0438\u0435", "\u0421\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0435", "\u0424\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0435 \u0440\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435"],
      ["\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e", "\u041f\u0440\u043e\u0441\u0442\u043e\u0440\u043d\u043e\u0435", "\u041a\u043e\u043c\u043f\u0430\u043a\u0442\u043d\u043e\u0435"],
    ],
    neighborhoodLabel: "\u0413\u043b\u0430\u0432\u0430 \u043e \u0440\u0430\u0439\u043e\u043d\u0435",
    fourAreasTitle: "\u0427\u0435\u0442\u044b\u0440\u0435 \u0440\u0430\u0439\u043e\u043d\u0430, \u043e\u0434\u043d\u0430 \u043a\u043e\u043b\u043b\u0430\u0436-\u043a\u0430\u0440\u0442\u0438\u043d\u043a\u0430",
    fourAreasBody:
      "\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043d\u0438\u0436\u0435 \u2014 \u044d\u0442\u043e \u043e\u0434\u043d\u0430 \u043a\u043e\u043b\u043b\u0430\u0436-\u0430\u043f\u043f\u0435\u043b\u043b\u044f\u0446\u0438\u044f. \u041a\u0430\u0436\u0434\u044b\u0439 \u043a\u0432\u0430\u0434\u0440\u0430\u043d\u0442 \u043e\u0442\u0440\u0430\u0436\u0430\u0435\u0442 \u0440\u0430\u0437\u043d\u044b\u0439 \u043f\u0440\u0438\u0431\u0440\u0435\u0436\u043d\u044b\u0439 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440 \u2014 \u0441\u043d\u0430\u0447\u0430\u043b\u0430 \u043e\u0446\u0435\u043d\u0438\u0442\u0435 \u0432\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434, \u0437\u0430\u0442\u0435\u043c \u043f\u0440\u043e\u0447\u0442\u0438\u0442\u0435 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u044b\u0435 \u0437\u0430\u043c\u0435\u0442\u043a\u0438.",
    figcaption:
      "\u0412\u0432\u0435\u0440\u0445\u0443: \u0445\u043e\u043b\u043c\u0438\u0441\u0442\u044b\u0439 \u041a\u0430\u043b\u043a\u0430\u043d \u0438 \u0438\u0441\u0442\u043e\u0440\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u041a\u0430\u0448 \u00b7 \u0412\u043d\u0438\u0437\u0443: \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0439 \u0411\u0435\u043b\u0435\u043a \u0438 \u0446\u0435\u043d\u0442\u0440 \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
    quadrantLabels: [
      ["top-left", "\u041a\u0430\u043b\u043a\u0430\u043d \u2014 \u0443\u0435\u0434\u0438\u043d\u0451\u043d\u043d\u044b\u0439, \u0432\u0438\u0434\u044b"],
      ["top-right", "\u041a\u0430\u0448 \u2014 \u0438\u0441\u0442\u043e\u0440\u0438\u044f, \u043f\u043e\u0440\u0442"],
      ["bottom-left", "\u0411\u0435\u043b\u0435\u043a \u2014 \u0433\u043e\u043b\u044c\u0444 \u0438 \u043f\u043b\u044f\u0436"],
      ["bottom-right", "\u0426\u0435\u043d\u0442\u0440 \u2014 \u044d\u043d\u0435\u0440\u0433\u0438\u044f \u0438 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u044c"],
    ],
    inReferenceImage: "\u043d\u0430 \u0440\u0435\u0444\u0435\u0440\u0435\u043d\u0441\u043d\u043e\u043c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0438 \u0432\u044b\u0448\u0435",
    quadrantPositions: {
      "top-left": "\u0412\u0432\u0435\u0440\u0445\u0443 \u0441\u043b\u0435\u0432\u0430",
      "top-right": "\u0412\u0432\u0435\u0440\u0445\u0443 \u0441\u043f\u0440\u0430\u0432\u0430",
      "bottom-left": "\u0412\u043d\u0438\u0437\u0443 \u0441\u043b\u0435\u0432\u0430",
      "bottom-right": "\u0412\u043d\u0438\u0437\u0443 \u0441\u043f\u0440\u0430\u0432\u0430",
    },
    proTipLabel: "\u0421\u043e\u0432\u0435\u0442",
    localAnchorLabel: "\u041c\u0435\u0441\u0442\u043d\u044b\u0439 \u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440",
    insightTitle: "\u041c\u043d\u0435\u043d\u0438\u0435 \u0438\u0437 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438",
    considerationsTitle:
      "\u0422\u043e\u043f-5 \u0444\u0430\u043a\u0442\u043e\u0440\u043e\u0432 \u043f\u0440\u0438 \u0432\u044b\u0431\u043e\u0440\u0435 \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0432\u0438\u043b\u043b\u044b",
    considerations: [
      "\u041f\u043e\u0442\u0440\u0435\u0431\u043d\u043e\u0441\u0442\u044c \u0432 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438: \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0438\u0442\u0435, \u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0443\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u044f \u0432\u0430\u043c \u043d\u0443\u0436\u043d\u043e.",
      "\u0411\u043b\u0438\u0437\u043e\u0441\u0442\u044c \u0434\u043e \u0434\u043e\u0441\u0442\u043e\u043f\u0440\u0438\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u0435\u0439: \u0438\u0441\u0442\u043e\u0440\u0438\u044f, \u043f\u043b\u044f\u0436\u0438, \u0433\u043e\u043b\u044c\u0444 \u0438\u043b\u0438 \u043f\u0440\u0438\u0440\u043e\u0434\u0430.",
      "\u0422\u0440\u0435\u0431\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u0435\u043c\u044c\u0438: \u0441\u0430\u0434\u044b, \u0441\u043f\u0430\u043b\u044c\u043d\u0438, \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u044c \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430 \u0438 \u043f\u0430\u0440\u043a\u043e\u0432\u043a\u0430.",
      "\u041f\u0440\u0435\u0434\u043f\u043e\u0447\u0442\u0435\u043d\u0438\u044f \u0432 \u0434\u043e\u0441\u0443\u0433\u0435: \u043f\u043e\u0434\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u0440\u0430\u0439\u043e\u043d \u0434\u043b\u044f \u0434\u0430\u0439\u0432\u0438\u043d\u0433\u0430, \u0433\u043e\u043b\u044c\u0444\u0430, \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b \u0438\u043b\u0438 \u043f\u043b\u044f\u0436\u0430.",
      "\u0421\u0435\u0437\u043e\u043d\u043d\u044b\u0435 \u0442\u043e\u043b\u043f\u044b: \u043f\u0438\u043a\u043e\u0432\u044b\u0435 \u043f\u0440\u0430\u0437\u0434\u043d\u0438\u043a\u0438 \u043c\u0435\u043d\u044f\u044e\u0442 \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0443 \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0440\u0430\u0439\u043e\u043d\u0430.",
    ],
    beachTitle:
      "\u0411\u043b\u0438\u0437\u043e\u0441\u0442\u044c \u043a \u043f\u043b\u044f\u0436\u0430\u043c \u0410\u043d\u0442\u0430\u043b\u044c\u0438: \u043a\u043b\u044e\u0447\u0435\u0432\u043e\u0439 \u0444\u0430\u043a\u0442\u043e\u0440",
    beachBody:
      "\u041f\u043b\u044f\u0436\u0438 \u0410\u043d\u0442\u0430\u043b\u044c\u0438 \u2014 \u0441\u0435\u0440\u044c\u0451\u0437\u043d\u044b\u0439 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442. \u0412\u0438\u043b\u043b\u0430 \u0432\u0431\u043b\u0438\u0437\u0438 \u043e\u0442 \u043f\u043b\u044f\u0436\u0430 \u0434\u0435\u043b\u0430\u0435\u0442 \u0441\u043f\u043e\u043d\u0442\u0430\u043d\u043d\u044b\u0435 \u043f\u043e\u0445\u043e\u0434\u044b \u043a \u0432\u043e\u0434\u0435 \u0438 \u043f\u043b\u0430\u043d\u044b \u043d\u0430 \u0437\u0430\u043a\u0430\u0442 \u043c\u043d\u043e\u0433\u043e \u043f\u0440\u043e\u0449\u0435 \u2014 \u0431\u0443\u0434\u044c \u0442\u043e \u0437\u043e\u043b\u043e\u0442\u0438\u0441\u0442\u044b\u0439 \u043f\u043b\u044f\u0436 \u041b\u0430\u0440\u0430 \u0438\u043b\u0438 \u0433\u0430\u043b\u0435\u0447\u043d\u044b\u0439 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b.",
    beachAlt:
      "\u041c\u0430\u0440\u0438\u043d\u0430 \u0438 \u043f\u043e\u0431\u0435\u0440\u0435\u0436\u044c\u0435 \u0410\u043d\u0442\u0430\u043b\u044c\u0438 \u0440\u044f\u0434\u043e\u043c \u0441 \u0440\u0430\u0439\u043e\u043d\u0430\u043c\u0438 \u0430\u0440\u0435\u043d\u0434\u044b \u0432\u0438\u043b\u043b",
    expertiseTitle:
      "\u041c\u0435\u0441\u0442\u043d\u0430\u044f \u044d\u043a\u0441\u043f\u0435\u0440\u0442\u0438\u0437\u0430: \u043e\u0440\u0438\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u043f\u043e \u0440\u0430\u0439\u043e\u043d\u0430\u043c \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
    expertiseBody:
      "\u041b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0437\u043d\u0430\u043d\u0438\u044f Villa Silyan \u043f\u043e\u043c\u043e\u0433\u0443\u0442 \u043f\u043e\u0434\u043e\u0431\u0440\u0430\u0442\u044c \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u0443\u044e \u0431\u0430\u0437\u0443 \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0439 \u0433\u0440\u0443\u043f\u043f\u044b, \u0431\u0443\u0434\u044c \u0442\u043e \u043f\u0440\u0438\u043e\u0440\u0438\u0442\u0435\u0442 \u0432 \u043f\u0440\u0438\u0432\u0430\u0442\u043d\u043e\u0441\u0442\u0438, \u0434\u043e\u0441\u0442\u0443\u043f\u0435 \u043a \u043f\u043b\u044f\u0436\u0443 \u0438\u043b\u0438 \u0443\u0434\u043e\u0431\u0441\u0442\u0432\u0435 \u0434\u043b\u044f \u0441\u0435\u043c\u044c\u0438.",
    pillarSectionTitle:
      "\u041f\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043a \u0440\u0443\u043a\u043e\u0432\u043e\u0434\u0441\u0442\u0432\u0443 \u043f\u043e \u0432\u0438\u043b\u043b\u0430\u043c \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438",
    pillarSectionBody:
      "\u0414\u043b\u044f \u0431\u043e\u043b\u0435\u0435 \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0439 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438 \u043e \u043d\u0430\u0448\u0438\u0445 \u0440\u043e\u0441\u043a\u043e\u0448\u043d\u044b\u0445 \u0432\u0438\u043b\u043b\u0430\u0445 \u0441 \u0447\u0430\u0441\u0442\u043d\u044b\u043c\u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u0430\u043c\u0438 \u043f\u043e\u0441\u0435\u0442\u0438\u0442\u0435 \u043d\u0430\u0448\u0443 \u0433\u043b\u0430\u0432\u043d\u0443\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443.",
    visitPillarBtn: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443",
    viewVillasBtn: "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0438\u043b\u043b\u044b Villa Silyan",
    ctaTitle:
      "\u0413\u043e\u0442\u043e\u0432\u044b \u0437\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0438\u043b\u043b\u0443 \u043c\u0435\u0447\u0442\u044b?",
    ctaBody:
      "\u0421\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 Villa Silyan \u0434\u043b\u044f \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0439 \u043f\u043e\u043c\u043e\u0449\u0438, \u043f\u0440\u044f\u043c\u044b\u0445 \u0446\u0435\u043d \u0438 \u044d\u043a\u0441\u043a\u043b\u044e\u0437\u0438\u0432\u043d\u044b\u0445 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0439.",
    ctaBtn: "\u0421\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 \u043d\u0430\u043c\u0438 \u0441\u0435\u0433\u043e\u0434\u043d\u044f",
    sidebarTitle: "\u041d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c \u0441 \u0432\u044b\u0431\u043e\u0440\u043e\u043c?",
    sidebarBody:
      "\u0420\u0430\u0441\u0441\u043a\u0430\u0436\u0438\u0442\u0435 \u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0435 \u0433\u0440\u0443\u043f\u043f\u044b\u060c \u0434\u0430\u0442\u0430\u0445 \u0438 \u0436\u0435\u043b\u0430\u0435\u043c\u043e\u043c \u0442\u0435\u043c\u043f\u0435. \u041c\u044b \u043f\u043e\u0434\u0431\u0435\u0440\u0451\u043c \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043d\u0442 Villa Silyan.",
    sidebarBtn: "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043c\u0435\u0441\u0442\u043d\u044b\u0439 \u0441\u043e\u0432\u0435\u0442",
    jumpTo: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a",
    collageAlt:
      "\u0427\u0435\u0442\u044b\u0440\u0435 \u0440\u0430\u0439\u043e\u043d\u0430 \u0410\u043d\u0442\u0430\u043b\u044c\u0438: \u0432\u0438\u043b\u043b\u044b \u041a\u0430\u043b\u043a\u0430\u043d\u0430, \u0443\u043b\u0438\u0446\u044b \u041a\u0430\u0448\u0430, \u043f\u043b\u044f\u0436 \u0411\u0435\u043b\u0435\u043a\u0430, \u0446\u0435\u043d\u0442\u0440 \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
    regions: [
      {
        id: "kalkan",
        shortLabel: "\u041a\u0430\u043b\u043a\u0430\u043d",
        title:
          "\u0418\u0441\u0441\u043b\u0435\u0434\u0443\u0439\u0442\u0435 \u041a\u0430\u043b\u043a\u0430\u043d: \u0443\u0435\u0434\u0438\u043d\u0451\u043d\u043d\u0430\u044f \u0440\u043e\u0441\u043a\u043e\u0448\u044c",
        summary:
          "\u041a\u0430\u043b\u043a\u0430\u043d \u2014 \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u043d\u044b\u0439 \u0433\u043e\u0440\u043e\u0434\u043e\u043a \u0441 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e\u0439 \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u043e\u0439. \u0412\u0438\u043b\u043b\u044b \u0447\u0430\u0441\u0442\u043e \u0440\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u044b \u043d\u0430 \u0445\u043e\u043b\u043c\u0430\u0445 \u0441 \u043f\u0430\u043d\u043e\u0440\u0430\u043c\u043d\u044b\u043c\u0438 \u0432\u0438\u0434\u0430\u043c\u0438 \u043d\u0430 \u0421\u0440\u0435\u0434\u0438\u0437\u0435\u043c\u043d\u043e\u0435 \u043c\u043e\u0440\u0435. \u0423\u0437\u043a\u0438\u0435 \u0443\u043b\u043e\u0447\u043a\u0438 \u0432\u044b\u043c\u043e\u0449\u0435\u043d\u044b \u0431\u0443\u0442\u0438\u043a\u0430\u043c\u0438 \u0438 \u043c\u0435\u0441\u0442\u043d\u044b\u043c\u0438 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0430\u043c\u0438.",
        proTip:
          "\u041f\u043e\u0441\u0435\u0442\u0438\u0442\u0435 \u043c\u0435\u0441\u0442\u043d\u044b\u0439 \u0440\u044b\u043d\u043e\u043a \u0432 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u0437\u0430 \u0441\u0432\u0435\u0436\u0438\u043c\u0438 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u0430\u043c\u0438 \u0438 \u0440\u0435\u043c\u0435\u0441\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0442\u043e\u0432\u0430\u0440\u0430\u043c\u0438.",
        localAnchor:
          "\u041c\u0430\u0440\u0438\u043d\u0430 \u041a\u0430\u043b\u043a\u0430\u043d\u0430, \u0432 10 \u043c\u0438\u043d\u0443\u0442\u0430\u0445 \u0435\u0437\u0434\u044b, \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u0430 \u0434\u043b\u044f \u0443\u0436\u0438\u043d\u0430 \u0438 \u043f\u0440\u043e\u0433\u0443\u043b\u043e\u043a \u043d\u0430 \u043b\u043e\u0434\u043a\u0435.",
        insight:
          "\u041a\u0430\u043b\u043a\u0430\u043d \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0434\u043b\u044f \u0442\u0435\u0445, \u043a\u0442\u043e \u0445\u043e\u0447\u0435\u0442 \u0442\u0438\u0448\u0438\u043d\u044b \u0438 \u0432\u0438\u0434\u043e\u0432, \u043d\u043e \u0440\u0435\u043b\u044c\u0435\u0444\u043d\u0430\u044f \u043c\u0435\u0441\u0442\u043d\u043e\u0441\u0442\u044c \u043c\u043e\u0436\u0435\u0442 \u0437\u0430\u0442\u0440\u0443\u0434\u043d\u0438\u0442\u044c \u043f\u0435\u0440\u0435\u0434\u0432\u0438\u0436\u0435\u043d\u0438\u0435.",
        quadrant: "top-left",
      },
      {
        id: "kas",
        shortLabel: "\u041a\u0430\u0448",
        title:
          "\u041a\u0430\u0448: \u0438\u0434\u0435\u0430\u043b\u044c\u043d\u043e\u0435 \u0441\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u0435 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0438 \u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0433\u043e \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u0430",
        summary:
          "\u041a\u0430\u0448 \u0441\u043e\u0447\u0435\u0442\u0430\u0435\u0442 \u0430\u043d\u0442\u0438\u0447\u043d\u044b\u0435 \u0440\u0443\u0438\u043d\u044b, \u043e\u0436\u0438\u0432\u043b\u0451\u043d\u043d\u044b\u0439 \u043f\u043e\u0440\u0442, \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u044b\u0435 \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u044b \u0438 \u043e\u0442\u043b\u0438\u0447\u043d\u0443\u044e \u0435\u0434\u0443. \u041e\u0441\u043e\u0431\u0435\u043d\u043d\u043e \u043b\u044e\u0431\u0438\u043c \u0434\u0430\u0439\u0432\u0435\u0440\u0430\u043c\u0438: \u043c\u0435\u0441\u0442\u043d\u044b\u0435 \u043e\u043f\u0435\u0440\u0430\u0442\u043e\u0440\u044b \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u0443\u044e\u0442 \u043f\u043e\u0433\u0440\u0443\u0436\u0435\u043d\u0438\u044f \u043a \u0440\u0438\u0444\u0430\u043c \u0438 \u0437\u0430\u0442\u043e\u043d\u0443\u0432\u0448\u0438\u043c \u043a\u043e\u0440\u0430\u0431\u043b\u044f\u043c.",
        proTip:
          "\u0414\u043b\u044f \u0431\u043e\u043b\u0435\u0435 \u0441\u043f\u043e\u043a\u043e\u0439\u043d\u043e\u0433\u043e \u043e\u043f\u044b\u0442\u0430 \u043f\u043e\u0441\u0435\u0442\u0438\u0442\u0435 \u0430\u043d\u0442\u0438\u0447\u043d\u044b\u0439 \u0430\u043c\u0444\u0438\u0442\u0435\u0430\u0442\u0440 \u043d\u0430 \u0437\u0430\u043a\u0430\u0442\u0435.",
        localAnchor:
          "\u0426\u0435\u043d\u0442\u0440 \u0433\u043e\u0440\u043e\u0434\u0430 \u043e\u0431\u044b\u0447\u043d\u043e \u043d\u0430 \u043d\u0435\u0431\u043e\u043b\u044c\u0448\u043e\u043c \u0440\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0438 \u0445\u043e\u0434\u044c\u0431\u044b \u043e\u0442 \u0432\u0438\u043b\u043b.",
        insight:
          "\u041a\u0430\u0448 \u0436\u0438\u0432\u043e\u0439 \u0432 \u043f\u0438\u043a \u0441\u0435\u0437\u043e\u043d\u0430. \u0427\u0430\u0440\u043c \u0435\u0441\u0442\u044c, \u043d\u043e \u0447\u0443\u0442\u043a\u043e \u0441\u043f\u044f\u0449\u0438\u043c \u043b\u0443\u0447\u0448\u0435 \u0438\u0441\u043a\u0430\u0442\u044c \u0432\u0438\u043b\u043b\u044b \u0432\u044b\u0448\u0435 \u0438\u043b\u0438 \u0432\u0434\u0430\u043b\u0438 \u043e\u0442 \u0441\u0430\u043c\u044b\u0445 \u043e\u0436\u0438\u0432\u043b\u0451\u043d\u043d\u044b\u0445 \u0443\u043b\u0438\u0446.",
        quadrant: "top-right",
      },
      {
        id: "belek",
        shortLabel: "\u0411\u0435\u043b\u0435\u043a",
        title:
          "\u0411\u0435\u043b\u0435\u043a: \u0433\u043e\u043b\u044c\u0444-\u043a\u0443\u0440\u043e\u0440\u0442\u044b \u0438 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u0435 \u0432\u0438\u043b\u043b\u044b",
        summary:
          "\u0411\u0435\u043b\u0435\u043a \u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043d \u0433\u043e\u043b\u044c\u0444-\u043a\u043e\u0440\u0442\u0430\u043c\u0438 \u043c\u0438\u0440\u043e\u0432\u043e\u0433\u043e \u0443\u0440\u043e\u0432\u043d\u044f, \u043f\u043b\u044f\u0436\u0430\u043c\u0438 \u043a\u0443\u0440\u043e\u0440\u0442\u043e\u0432 \u0438 \u0441\u0435\u043c\u0435\u0439\u043d\u044b\u043c\u0438 \u0432\u0438\u043b\u043b\u0430\u043c\u0438 \u0441 \u0431\u043e\u043b\u044c\u0448\u0438\u043c\u0438 \u0441\u0430\u0434\u0430\u043c\u0438. \u0418\u0434\u0435\u0430\u043b\u044c\u043d\u043e \u0434\u043b\u044f \u0433\u0440\u0443\u043f\u043f: \u0433\u043e\u043b\u044c\u0444 \u0443\u0442\u0440\u043e\u043c, \u043f\u043b\u044f\u0436 \u0434\u043d\u0451\u043c, \u0447\u0430\u0441\u0442\u043d\u044b\u0439 \u0431\u0430\u0441\u0441\u0435\u0439\u043d \u0432\u0435\u0447\u0435\u0440\u043e\u043c.",
        proTip: "\u0411\u0440\u043e\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0435\u043c\u044f \u0442\u0438 \u0437\u0430\u0440\u0430\u043d\u0435\u0435, \u043e\u0441\u043e\u0431\u0435\u043d\u043d\u043e \u0432 \u0432\u044b\u0441\u043e\u043a\u0438\u0439 \u0441\u0435\u0437\u043e\u043d.",
        localAnchor:
          "\u041f\u043b\u044f\u0436 \u041a\u0430\u0434\u0440\u0438\u0435 \u2014 15 \u043c\u0438\u043d\u0443\u0442 \u0435\u0437\u0434\u044b, \u0445\u043e\u0440\u043e\u0448 \u0434\u043b\u044f \u0441\u0435\u043c\u0435\u0439\u043d\u043e\u0433\u043e \u0434\u043d\u044f.",
        insight:
          "\u0411\u0435\u043b\u0435\u043a \u0443\u0434\u043e\u0431\u0435\u043d \u0438 \u0443\u0445\u043e\u0436\u0435\u043d, \u043d\u043e \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u043c\u043d\u043e\u0433\u043e\u043b\u044e\u0434\u043d\u044b\u043c \u0432 \u043f\u0438\u043a. \u041f\u043b\u0430\u043d\u0438\u0440\u0443\u0439\u0442\u0435 \u043f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u0435 \u043f\u043b\u044f\u0436\u0435\u0439 \u0438 \u0433\u043e\u043b\u044c\u0444 \u043d\u0430 \u0440\u0430\u043d\u043d\u0435\u0435 \u0443\u0442\u0440\u043e.",
        quadrant: "bottom-left",
      },
      {
        id: "city-center",
        shortLabel: "\u0426\u0435\u043d\u0442\u0440 \u0410\u043d\u0442\u0430\u043b\u044c\u0438",
        title:
          "\u0426\u0435\u043d\u0442\u0440 \u0410\u043d\u0442\u0430\u043b\u044c\u0438: \u044f\u0440\u043a\u0430\u044f \u0436\u0438\u0437\u043d\u044c \u0438 \u0443\u0434\u043e\u0431\u043d\u044b\u0439 \u0432\u044b\u0445\u043e\u0434 \u043d\u0430 \u043f\u043b\u044f\u0436",
        summary:
          "\u041f\u0440\u043e\u0436\u0438\u0432\u0430\u043d\u0438\u0435 \u0440\u044f\u0434\u043e\u043c \u0441 \u0446\u0435\u043d\u0442\u0440\u043e\u043c \u0434\u0430\u0451\u0442 \u043b\u0443\u0447\u0448\u0435\u0435 \u0438\u0437 \u0434\u0432\u0443\u0445 \u043c\u0438\u0440\u043e\u0432: \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u044b, \u043c\u0430\u0433\u0430\u0437\u0438\u043d\u044b, \u0421\u0442\u0430\u0440\u044b\u0439 \u0433\u043e\u0440\u043e\u0434 \u041a\u0430\u043b\u0435\u0438\u0447\u0438 \u0438 \u0431\u044b\u0441\u0442\u0440\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u043f\u043b\u044f\u0436\u0430\u043c \u041b\u0430\u0440\u0430 \u0438 \u041a\u043e\u043d\u044c\u044f\u0430\u043b\u0442\u044b.",
        proTip:
          "\u041f\u043e\u0441\u0435\u0442\u0438\u0442\u0435 \u0421\u0442\u0430\u0440\u044b\u0439 \u0433\u043e\u0440\u043e\u0434 \u041a\u0430\u043b\u0435\u0438\u0447\u0438 \u2014 \u044d\u043a\u0441\u043f\u0440\u0435\u0441\u0441-\u043f\u043e\u0433\u0440\u0443\u0436\u0435\u043d\u0438\u0435 \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u0410\u043d\u0442\u0430\u043b\u044c\u0438.",
        localAnchor:
          "\u0413\u043e\u0440\u043e\u0434\u0441\u043a\u043e\u0439 \u0442\u0440\u0430\u043c\u0432\u0430\u0439 \u0434\u0430\u0451\u0442 \u0443\u0434\u043e\u0431\u043d\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0434\u043e\u0441\u0442\u043e\u043f\u0440\u0438\u043c\u0435\u0447\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044f\u043c.",
        insight:
          "\u0426\u0435\u043d\u0442\u0440 \u0435\u0441\u0442\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e \u0431\u043e\u043b\u0435\u0435 \u0448\u0443\u043c\u043d\u044b\u0439. \u0417\u0430\u0442\u043e \u0432\u044b \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442\u0435 \u043b\u0451\u0433\u043a\u0438\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043a \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0430\u043c, \u043f\u043b\u044f\u0436\u0430\u043c \u0438 \u043c\u0435\u043d\u044c\u0448\u0435 \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u0437\u0430 \u0440\u0443\u043b\u0451\u043c.",
        quadrant: "bottom-right",
      },
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

function InsightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 border-l-4 border-[var(--accent-500)] bg-[#f8f9fa] p-5 text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]">
      <div className="flex gap-4">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--accent-500)]"
          aria-label="User trust insight"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l7 3v5c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6l7-3z" />
            <path d="M8.5 12l2.2 2.2 4.8-5" />
          </svg>
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
            {children}
          </h3>
        </div>
      </div>
    </div>
  );
}

function ProTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 inline-flex max-w-full items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--accent-muted)] px-4 py-3 shadow-[var(--shadow-sm)]">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-500)] text-white"
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1115.5 14.5c-.9.7-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.8-1.5-2.5z" />
        </svg>
      </span>
      <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
        <strong>{label}:</strong> {children}
      </p>
    </div>
  );
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

export async function generateBestAreasToStayInAntalyaMetadata({
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
          height: 443,
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

export default async function BestAreasToStayInAntalyaPage({
  params,
  pathPrefix = "",
}: Props) {
  const { lang } = await params;
  const safeLang = isLang(lang) ? lang : "en";
  const c = (COPY[safeLang] ?? COPY.en) as LangCopy;

  const pagePath = (path: string) => villaPath(pathPrefix, `/${lang}${path}`);
  const contactHref = pagePath("/contact");
  const villasHref = pagePath("/villas");
  const pillarHref = pagePath(`/${PILLAR_SLUG}`);

  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host")).origin;
  const articleUrl = `${origin}${pagePath(`/${PAGE_SLUG}`)}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.meta.jsonLdHeadline,
    description: c.meta.description,
    image: [`${origin}${HERO_IMAGE}`, `${origin}${CITY_MARINA_IMAGE}`, `${origin}${REGIONS_COLLAGE_IMAGE}`],
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
    publisher: {
      "@type": "Organization",
      name: "Villa Silyan",
    },
  };

  return (
    <>
      <Script
        id="jsonld-best-areas-to-stay-in-antalya"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptPayload(articleLd) }}
      />
      <div className="bg-[var(--color-bg)] pt-20 pb-20">
        <article>
          <section className="content-wrapper">
            <div className="relative mx-auto overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
              <div className="relative aspect-[16/11] min-h-[420px] md:aspect-[16/7]">
                <Image
                  src={HERO_IMAGE}
                  alt={c.meta.heroAlt}
                  fill
                  loading="lazy"
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                    {c.heroEyebrow}
                  </p>
                  <h1 className="max-w-4xl font-serif text-h1 font-semibold leading-tight text-white">
                    {c.h1}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                    {c.heroSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="content-wrapper mt-12">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-14">
                <section>
                  <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
                    {c.intro}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.whyTitle}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                    {c.whyBody}
                  </p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
                    <div className="overflow-x-auto">
                      <table className="min-w-[560px] w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              {c.compFeature}
                            </th>
                            <th className="border-b border-[var(--color-border)] bg-[var(--accent-muted)] px-5 py-4 font-semibold">
                              Villa Silyan
                            </th>
                            <th className="border-b border-[var(--color-border)] px-5 py-4 font-semibold">
                              {c.compHotel}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-[var(--color-text-secondary)]">
                          {c.compRows.map(([feature, villa, hotel]) => (
                            <tr key={feature} className="border-b border-[var(--color-border)] last:border-b-0">
                              <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{feature}</td>
                              <td className="bg-[var(--accent-muted)] px-5 py-4 font-medium text-[var(--color-text-primary)]">{villa}</td>
                              <td className="px-5 py-4">{hotel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2">
                  {c.regions.map((region) => (
                    <a
                      key={region.id}
                      href={`#${region.id}`}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent-400)] hover:shadow-[var(--shadow-glow)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                        {c.neighborhoodLabel}
                      </p>
                      <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                        {region.shortLabel}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {region.summary.slice(0, 118)}...
                      </p>
                    </a>
                  ))}
                </section>

                <section
                  className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-8"
                  aria-labelledby="four-areas-heading"
                >
                  <h2 id="four-areas-heading" className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.fourAreasTitle}
                  </h2>
                  <p className="mt-4 max-w-3xl leading-relaxed text-[var(--color-text-secondary)]">
                    {c.fourAreasBody}
                  </p>
                  <figure className="mt-6">
                    <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                      <Image
                        src={REGIONS_COLLAGE_IMAGE}
                        alt={c.collageAlt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 48rem"
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
                      {c.figcaption}
                    </figcaption>
                    <div className="mt-4 grid max-w-3xl grid-cols-2 gap-3 sm:mx-auto">
                      {(c.quadrantLabels as [string, string][]).map(([key, label]) => {
                        const r = c.regions.find((x) => x.quadrant === key);
                        return (
                          <div
                            key={key}
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-center text-xs font-medium text-[var(--color-text-primary)] sm:text-sm"
                          >
                            {r ? (
                              <a href={`#${r.id}`} className="text-[var(--color-text-primary)] hover:text-[var(--accent-500)]">
                                {label}
                              </a>
                            ) : (
                              label
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </figure>
                </section>

                {c.regions.map((region) => (
                  <section
                    key={region.id}
                    id={region.id}
                    className="scroll-mt-24 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-8"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                      {region.shortLabel} ·{" "}
                      {c.quadrantPositions[region.quadrant]}{" "}
                      {c.inReferenceImage}
                    </p>
                    <h2 className="mt-2 font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                      {region.title}
                    </h2>
                    <p className="mt-5 leading-relaxed text-[var(--color-text-secondary)]">
                      {region.summary}
                    </p>
                    <ProTip label={c.proTipLabel}>{region.proTip}</ProTip>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      <strong className="text-[var(--color-text-primary)]">{c.localAnchorLabel}:</strong>{" "}
                      {region.localAnchor}
                    </p>
                    <InsightBox>
                      {c.insightTitle}
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {region.insight}
                      </p>
                    </InsightBox>
                  </section>
                ))}

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.considerationsTitle}
                  </h2>
                  <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] md:p-7">
                    <div className="grid gap-4">
                      {c.considerations.map((item) => (
                        <div key={item} className="flex gap-3 rounded-2xl bg-[var(--color-bg)] p-4">
                          <CheckIcon />
                          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.beachTitle}
                  </h2>
                  <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_42%] md:items-center">
                    <p className="leading-relaxed text-[var(--color-text-secondary)]">{c.beachBody}</p>
                    <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                      <Image
                        src={CITY_MARINA_IMAGE}
                        alt={c.beachAlt}
                        width={900}
                        height={540}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="h-full w-full object-cover"
                      />
                    </figure>
                  </div>
                </section>

                <section>
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.expertiseTitle}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">{c.expertiseBody}</p>
                </section>

                <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-sm)] md:p-9">
                  <h2 className="font-serif text-h2 font-semibold text-[var(--color-text-primary)]">
                    {c.pillarSectionTitle}
                  </h2>
                  <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">{c.pillarSectionBody}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={pillarHref}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      {c.visitPillarBtn}
                    </Link>
                    <Link
                      href={villasHref}
                      className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--accent-500)]"
                    >
                      {c.viewVillasBtn}
                    </Link>
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl bg-[var(--color-text-primary)] p-8 text-white md:p-10">
                  <h2 className="font-serif text-h2 font-semibold">{c.ctaTitle}</h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/80">{c.ctaBody}</p>
                  <Link
                    href={contactHref}
                    className="mt-7 inline-flex items-center justify-center rounded-xl bg-[var(--accent-500)] px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    {c.ctaBtn}
                  </Link>
                </section>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
                  <p className="font-serif text-xl font-semibold text-[var(--color-text-primary)]">
                    {c.sidebarTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {c.sidebarBody}
                  </p>
                  <Link
                    href={contactHref}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent-500)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    {c.sidebarBtn}
                  </Link>
                  <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-500)]">
                      {c.jumpTo}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {c.regions.map((region) => (
                        <a
                          key={region.id}
                          href={`#${region.id}`}
                          className="text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--accent-500)]"
                        >
                          {region.shortLabel}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
