import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { VILLA_IMAGES } from "../lib/silyan-images";
import { resolveRequestOrigin } from "../lib/site-origin";
import { getActiveLangs, getSiteBySubdomain } from "../lib/tenant";
import { villaPath } from "../lib/villa-path";

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  tr: "tr_TR",
  ar: "ar_SA",
  ru: "ru_RU",
};

function truncateDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const i = cut.lastIndexOf(" ");
  return `${(i > 90 ? cut.slice(0, i) : cut).trimEnd()}…`;
}
import { WHATSAPP_BRAND_GREEN } from "../lib/whatsapp-brand";
import GallerySection from "./villa-detail-gallery";

type VillaData = {
  slug: string;
  name: string;
  bedrooms: number;
  baths: number;
  maxGuests: number;
  desc: Record<string, string>;
  whatsappMsg: Record<string, string>;
};

const VILLAS: Record<string, VillaData> = {
  badem: { slug: "badem", name: "Villa Badem", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Named after the almond tree, Villa Badem is a sun-filled three-bedroom retreat designed for families or small groups of up to six. A private pool and shaded garden give you room to settle in — morning swims before the heat, evenings outdoors with the mountain air cooling things down. Every bedroom has its own bathroom. The kitchen is fully equipped for self-catering or light cooking. Antalya is 12 km away when you're ready for it.", tr: "Bademden adını alan Villa Badem, aileler veya altı kişiye kadar küçük gruplar için tasarlanmış, güneş dolu üç yatak odalı bir tatil evidir. Özel havuz ve gölgeli bahçe, sabah yüzmeleri ve dağ havasının serinlettiği akşam keyifleri için ideal bir alan sunar. Her yatak odasının kendi banyosu vardır. Mutfak kendi yemeklerinizi pişirmeniz için tam donanımlıdır.", ar: "سميت على اسم شجرة اللوز، فيلا بادم هي ملاذ مشمس من ثلاث غرف نوم مصمم للعائلات أو المجموعات الصغيرة حتى ستة أشخاص. مسبح خاص وحديقة مظللة يوفران مساحة مريحة — سباحة صباحية قبل الحرارة، وأمسيات في الهواء الطلق مع نسيم الجبل المنعش.", ru: "Названная в честь миндального дерева, вилла Бадем — это залитый солнцем трёхспальный отдых для семей или небольших компаний до шести человек. Частный бассейн и тенистый сад дают пространство для комфортного отдыха — утренние заплывы до жары, вечера на свежем горном воздухе." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Badem at Silyan Villas.", tr: "Merhaba, Villa Badem hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا بادم.", ru: "Здравствуйте, хочу узнать о бронировании виллы Бадем." } },
  defne: { slug: "defne", name: "Villa Defne", bedrooms: 5, baths: 5, maxGuests: 10, desc: { en: "Villa Defne sleeps up to ten guests across five en-suite bedrooms — ideal for extended families, two-family trips, or larger groups who want privacy without sacrificing proximity. The private pool and garden face the mountain ridge. Antalya Airport is 22 km; Konyaaltı Beach is 8.", tr: "Villa Defne, beş suit yatak odasıyla on misafir kapasitelidir. Geniş aileler, iki aile grupları veya mahremiyet isteyen büyük gruplar için idealdir. Özel havuz ve bahçe dağ sırasına bakar.", ar: "فيلا دفني تتسع لعشرة ضيوف في خمس غرف نوم مع حمام خاص — مثالية للعائلات الممتدة أو المجموعات الكبيرة. المسبح الخاص والحديقة يطلان على سلسلة الجبال.", ru: "Вилла Дефне вмещает до десяти гостей в пяти спальнях с собственными ванными — идеальна для больших семей или групп. Частный бассейн и сад с видом на горный хребет." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Defne at Silyan Villas.", tr: "Merhaba, Villa Defne hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا دفني.", ru: "Здравствуйте, хочу узнать о бронировании виллы Дефне." } },
  hurma: { slug: "hurma", name: "Villa Hurma", bedrooms: 2, baths: 1, maxGuests: 4, desc: { en: "Villa Hurma — named after the date palm — is a cosy two-bedroom retreat for couples or small families of up to four. One shared bathroom, a private pool, and a quiet garden where the mountains frame every evening. Compact yet fully equipped, it's the most intimate option at Silyan.", tr: "Toplamda 2 adet odası bulunan villamızda 1 adet banyo mevcut olup, maksimum 4 kişilik konaklama imkanıyla çekirdek aileler ve küçük arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz ve bahçe ile huzurlu bir konaklama sizi bekliyor.", ar: "فيلا حرمة — سميت على اسم شجرة النخيل — ملاذ مريح من غرفتي نوم للأزواج أو العائلات الصغيرة حتى أربعة أشخاص. حمام مشترك واحد، مسبح خاص، وحديقة هادئة تحيط بها الجبال.", ru: "Вилла Хурма — названная в честь финиковой пальмы — уютный двухспальный отдых для пар или небольших семей до четырёх человек. Одна общая ванная, частный бассейн и тихий сад с горными видами." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Hurma at Silyan Villas.", tr: "Merhaba, Villa Hurma hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا حرمة.", ru: "Здравствуйте, хочу узнать о бронировании виллы Хурма." } },
  incir: { slug: "incir", name: "Villa İncir", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Villa İncir — named for the fig tree — mirrors Badem in layout: three bedrooms, each with its own bathroom, sleeping six. A quiet villa for a couple of families or a group of friends who want their own space, their own pool, and a stretch of mountain calm before the day begins.", tr: "İncir ağacından adını alan Villa İncir, Badem ile aynı yerleşime sahiptir: üç yatak odası, her birinin kendi banyosu var, altı kişi kapasiteli. Kendi alanını, kendi havuzunu ve günün başlangıcından önce dağ huzurunu isteyen aileler veya arkadaş grupları için sessiz bir villa.", ar: "فيلا إنجير — سميت على اسم شجرة التين — تتشابه مع بادم في التصميم: ثلاث غرف نوم، لكل منها حمام خاص، تتسع لستة أشخاص. فيلا هادئة لعائلتين أو مجموعة أصدقاء يريدون مساحتهم الخاصة.", ru: "Вилла Инджир — названная в честь смоковницы — зеркально повторяет планировку Бадем: три спальни с собственными ванными, вместимость шесть человек. Тихая вилла для семей или друзей, желающих собственного пространства." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa İncir at Silyan Villas.", tr: "Merhaba, Villa İncir hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا إنجير.", ru: "Здравствуйте, хочу узнать о бронировании виллы Инджир." } },
  kayisi: { slug: "kayisi", name: "Villa Kayısı", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Named after the apricot tree, Villa Kayısı is a three-bedroom villa with en-suite bathrooms throughout, sleeping up to six. A private pool and garden provide the perfect setting for families and friend groups looking for comfort and privacy in the mountains above Antalya.", tr: "Toplamda 3 adet odası bulunan villamızın her odasında banyo mevcut olup, maksimum 6 kişilik konaklama imkanıyla standart aileler ve arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz ve bahçe ile doğanın içinde huzurlu bir konaklama.", ar: "سميت على اسم شجرة المشمش، فيلا كايسي هي فيلا من ثلاث غرف نوم مع حمام خاص في كل غرفة، تتسع لستة أشخاص. مسبح خاص وحديقة توفران الإطار المثالي للعائلات ومجموعات الأصدقاء.", ru: "Названная в честь абрикосового дерева, вилла Кайысы — трёхспальная вилла с собственными ванными в каждой комнате, вместимостью до шести человек. Частный бассейн и сад создают идеальные условия для семей и компаний друзей." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Kayısı at Silyan Villas.", tr: "Merhaba, Villa Kayısı hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا كايسي.", ru: "Здравствуйте, хочу узнать о бронировании виллы Кайысы." } },
  limon: { slug: "limon", name: "Villa Limon", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Villa Limon — named for the lemon tree — offers three en-suite bedrooms for up to six guests. A private pool, a lush garden, and mountain views set the scene for a relaxed stay. Fully equipped kitchen, parking on site, and Antalya's coast a short drive away.", tr: "Toplamda 3 adet odası bulunan villamızın her odasında banyo mevcut olup, maksimum 6 kişilik konaklama imkanıyla standart aileler ve arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz, bahçe ve dağ manzarasıyla huzurlu bir konaklama.", ar: "فيلا ليمون — سميت على اسم شجرة الليمون — توفر ثلاث غرف نوم مع حمام خاص لستة ضيوف. مسبح خاص وحديقة خضراء وإطلالة جبلية لإقامة هادئة ومريحة.", ru: "Вилла Лимон — названная в честь лимонного дерева — предлагает три спальни с собственными ванными для шести гостей. Частный бассейн, зелёный сад и горные виды создают атмосферу спокойного отдыха." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Limon at Silyan Villas.", tr: "Merhaba, Villa Limon hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا ليمون.", ru: "Здравствуйте, хочу узнать о бронировании виллы Лимон." } },
  mandalina: { slug: "mandalina", name: "Villa Mandalina", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Villa Mandalina — named after the mandarin tree — is a three-bedroom villa with en-suite bathrooms, sleeping six. A private pool and garden sit against a mountain backdrop. Everything you need for a self-contained holiday: full kitchen, parking, and Konyaaltı Beach within easy reach.", tr: "Toplamda 3 adet odası bulunan villamızın her odasında banyo mevcut olup, maksimum 6 kişilik konaklama imkanıyla standart aileler ve arkadaş grupları için mükemmel bir tatil deneyimi sunar. Dağ manzarasına karşı özel havuz ve bahçe ile unutulmaz bir konaklama.", ar: "فيلا ماندالينا — سميت على اسم شجرة اليوسفي — فيلا من ثلاث غرف نوم مع حمام خاص، تتسع لستة أشخاص. مسبح خاص وحديقة أمام خلفية جبلية رائعة.", ru: "Вилла Мандалина — названная в честь мандаринового дерева — трёхспальная вилла с собственными ванными, вместимостью шесть человек. Частный бассейн и сад на фоне горного пейзажа." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Mandalina at Silyan Villas.", tr: "Merhaba, Villa Mandalina hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا ماندالينا.", ru: "Здравствуйте, хочу узнать о бронировании виллы Мандалина." } },
  portakal: { slug: "portakal", name: "Villa Portakal", bedrooms: 5, baths: 5, maxGuests: 10, desc: { en: "Villa Portakal — named after the orange tree — is a spacious five-bedroom villa with en-suite bathrooms in every room, sleeping up to ten. Ideal for large families or multi-family holidays, it offers a private pool, generous garden, and mountain views. Fully equipped for self-catering with private parking on site.", tr: "Toplamda 5 adet odası bulunan villamızın her odasında banyo mevcut olup, maksimum 10 kişilik konaklama imkanıyla geniş aileler için mükemmel bir tatil deneyimi sunar. Özel havuz, geniş bahçe ve dağ manzarası ile unutulmaz bir konaklama.", ar: "فيلا بورتاكال — سميت على اسم شجرة البرتقال — فيلا فسيحة من خمس غرف نوم مع حمام خاص في كل غرفة، تتسع لعشرة أشخاص. مثالية للعائلات الكبيرة مع مسبح خاص وحديقة واسعة وإطلالة جبلية.", ru: "Вилла Портакал — названная в честь апельсинового дерева — просторная пятиспальная вилла с собственными ванными в каждой комнате, вместимостью до десяти человек. Идеальна для больших семей с частным бассейном, просторным садом и горными видами." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Portakal at Silyan Villas.", tr: "Merhaba, Villa Portakal hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا بورتاكال.", ru: "Здравствуйте, хочу узнать о бронировании виллы Портакал." } },
  turunc: { slug: "turunc", name: "Villa Turunç", bedrooms: 3, baths: 3, maxGuests: 6, desc: { en: "Villa Turunç — named for the bitter orange — is a three-bedroom villa with en-suite bathrooms, sleeping up to six guests. A private pool and garden with mountain views make it a peaceful base for families or friend groups. Full kitchen, private parking, and easy access to the coast.", tr: "Toplamda 3 adet odası bulunan villamızın her odasında banyo mevcut olup, maksimum 6 kişilik konaklama imkanıyla standart aileler ve arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz ve dağ manzaralı bahçe ile huzurlu bir tatil.", ar: "فيلا تورونج — سميت على اسم البرتقال المر — فيلا من ثلاث غرف نوم مع حمام خاص، تتسع لستة ضيوف. مسبح خاص وحديقة بإطلالة جبلية لإقامة هادئة.", ru: "Вилла Турунч — названная в честь горького апельсина — трёхспальная вилла с собственными ванными, вместимостью до шести гостей. Частный бассейн и сад с горными видами для спокойного отдыха." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Turunç at Silyan Villas.", tr: "Merhaba, Villa Turunç hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا تورونج.", ru: "Здравствуйте, хочу узнать о бронировании виллы Турунч." } },
  uzum: { slug: "uzum", name: "Villa Üzüm", bedrooms: 2, baths: 1, maxGuests: 4, desc: { en: "Villa Üzüm — named after the grape vine — is a compact two-bedroom villa with one shared bathroom, sleeping up to four. Perfect for couples or a small family looking for an affordable, private escape with its own pool and garden surrounded by nature.", tr: "Toplamda 2 adet odası bulunan villamızda 1 adet banyo mevcut olup, maksimum 4 kişilik konaklama imkanıyla çekirdek aileler ve küçük arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz ve doğayla iç içe bahçe ile huzurlu bir kaçamak.", ar: "فيلا أوزوم — سميت على اسم شجرة العنب — فيلا مريحة من غرفتي نوم مع حمام مشترك واحد، تتسع لأربعة أشخاص. مثالية للأزواج أو العائلات الصغيرة مع مسبح خاص وحديقة محاطة بالطبيعة.", ru: "Вилла Юзюм — названная в честь виноградной лозы — компактная двухспальная вилла с одной общей ванной, вместимостью до четырёх человек. Идеальна для пар или небольших семей с частным бассейном и садом среди природы." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Üzüm at Silyan Villas.", tr: "Merhaba, Villa Üzüm hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا أوزوم.", ru: "Здравствуйте, хочу узнать о бронировании виллы Юзюм." } },
  zeytin: { slug: "zeytin", name: "Villa Zeytin", bedrooms: 2, baths: 1, maxGuests: 4, desc: { en: "Villa Zeytin — named for the olive tree — is an intimate two-bedroom villa with one bathroom, sleeping up to four. A private pool and garden offer quiet seclusion for couples or a small family. Simple, well-equipped, and close to nature.", tr: "Toplamda 2 adet odası bulunan villamızda 1 adet banyo mevcut olup, maksimum 4 kişilik konaklama imkanıyla çekirdek aileler ve küçük arkadaş grupları için mükemmel bir tatil deneyimi sunar. Özel havuz ve bahçe ile doğayla iç içe sakin bir konaklama.", ar: "فيلا زيتين — سميت على اسم شجرة الزيتون — فيلا حميمة من غرفتي نوم مع حمام واحد، تتسع لأربعة أشخاص. مسبح خاص وحديقة توفران عزلة هادئة للأزواج أو العائلات الصغيرة.", ru: "Вилла Зейтин — названная в честь оливкового дерева — уютная двухспальная вилла с одной ванной, вместимостью до четырёх человек. Частный бассейн и сад для тихого уединения пар или небольших семей." }, whatsappMsg: { en: "Hello, I'm interested in booking Villa Zeytin at Silyan Villas.", tr: "Merhaba, Villa Zeytin hakkında bilgi almak istiyorum.", ar: "مرحباً، أريد الاستفسار عن حجز فيلا زيتين.", ru: "Здравствуйте, хочу узнать о бронировании виллы Зейтин." } },
};

const AMENITIES = [
  "wifi", "kitchen", "dishwasher", "washer", "oven", "microwave",
  "tv", "iron", "hairdryer", "tea_coffee", "pool", "garden", "parking",
] as const;

const AMENITY_LABELS: Record<string, Record<string, string>> = {
  en: { wifi: "Free WiFi", kitchen: "Full Kitchen", dishwasher: "Dishwasher", washer: "Washing Machine", oven: "Oven", microwave: "Microwave", tv: "Satellite TV", iron: "Iron", hairdryer: "Hair Dryer", tea_coffee: "Tea/Coffee Maker", pool: "Private Pool", garden: "Private Garden", parking: "Private Parking" },
  tr: { wifi: "Ücretsiz WiFi", kitchen: "Tam Donanımlı Mutfak", dishwasher: "Bulaşık Makinesi", washer: "Çamaşır Makinesi", oven: "Fırın", microwave: "Mikrodalga", tv: "Uydu TV", iron: "Ütü", hairdryer: "Saç Kurutma", tea_coffee: "Çay/Kahve Makinesi", pool: "Özel Havuz", garden: "Özel Bahçe", parking: "Özel Otopark" },
  ar: { wifi: "واي فاي مجاني", kitchen: "مطبخ كامل", dishwasher: "غسالة أطباق", washer: "غسالة ملابس", oven: "فرن", microwave: "ميكروويف", tv: "تلفزيون فضائي", iron: "مكواة", hairdryer: "مجفف شعر", tea_coffee: "صانعة شاي/قهوة", pool: "مسبح خاص", garden: "حديقة خاصة", parking: "موقف سيارات خاص" },
  ru: { wifi: "Бесплатный WiFi", kitchen: "Полная кухня", dishwasher: "Посудомоечная машина", washer: "Стиральная машина", oven: "Духовка", microwave: "Микроволновая печь", tv: "Спутниковое ТВ", iron: "Утюг", hairdryer: "Фен", tea_coffee: "Чайник/кофеварка", pool: "Частный бассейн", garden: "Частный сад", parking: "Частная парковка" },
};

const AMENITY_SVG: Record<string, React.ReactNode> = {
  wifi: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12.55a11 11 0 0114 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" /></svg>,
  kitchen: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>,
  dishwasher: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 8h18" /><circle cx="12" cy="15" r="3" /></svg>,
  washer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="1" width="18" height="22" rx="2" /><circle cx="12" cy="14" r="5" /><path d="M8 6h.01M12 6h.01" /></svg>,
  oven: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 10h18M8 6h.01M12 6h.01M16 6h.01" /></svg>,
  microwave: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="15" rx="2" /><path d="M18 4v15M6 12h4" /></svg>,
  tv: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  iron: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 18h16l-4-8H4v8z" /><path d="M4 14h8" /></svg>,
  hairdryer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="6" /><path d="M16 10h6M10 16v6" /></svg>,
  tea_coffee: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8h1a4 4 0 010 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8zM6 2v3M10 2v3M14 2v3" /></svg>,
  pool: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" /><path d="M2 16c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0 3.5 1.5 5 0" /><path d="M8 4v8M16 4v8" /></svg>,
  garden: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22V8M5 12s-2-4 0-7c2.5 1 4 4 7 4M19 12s2-4 0-7c-2.5 1-4 4-7 4" /></svg>,
  parking: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 010 6H9" /></svg>,
};

const LABELS: Record<string, Record<string, string>> = {
  en: { specs: "Specifications", bedrooms: "Bedrooms", bathrooms: "Bathrooms", maxGuests: "Max Guests", pool: "Pool", views: "Views", parking: "Parking", amenities: "Amenities", houseRules: "House Rules", checkIn: "Check-in", checkOut: "Check-out", minStay: "Minimum stay", noSmoking: "No smoking", noPets: "No pets", cta: "Contact us on WhatsApp", whatsapp: "Message on WhatsApp", otherVillas: "Other villas", gallery: "Gallery", private: "Private, in-garden", mountain: "Mountain & garden", privateParking: "Private, on-site" },
  tr: { specs: "Özellikler", bedrooms: "Yatak Odaları", bathrooms: "Banyolar", maxGuests: "Maks. Misafir", pool: "Havuz", views: "Manzara", parking: "Otopark", amenities: "Olanaklar", houseRules: "Ev Kuralları", checkIn: "Giriş", checkOut: "Çıkış", minStay: "Minimum konaklama", noSmoking: "Sigara içilmez", noPets: "Evcil hayvan yok", cta: "WhatsApp ile iletişim", whatsapp: "WhatsApp ile mesaj", otherVillas: "Diğer villalar", gallery: "Galeri", private: "Özel, bahçe içinde", mountain: "Dağ ve bahçe", privateParking: "Özel, yerleşke içinde" },
  ar: { specs: "المواصفات", bedrooms: "غرف النوم", bathrooms: "الحمامات", maxGuests: "أقصى عدد ضيوف", pool: "المسبح", views: "الإطلالة", parking: "الموقف", amenities: "المرافق", houseRules: "قواعد المنزل", checkIn: "تسجيل الدخول", checkOut: "تسجيل الخروج", minStay: "الحد الأدنى للإقامة", noSmoking: "ممنوع التدخين", noPets: "ممنوع الحيوانات الأليفة", cta: "تواصل معنا عبر واتساب", whatsapp: "أرسل رسالة واتساب", otherVillas: "فيلات أخرى", gallery: "معرض الصور", private: "خاص، في الحديقة", mountain: "جبل وحديقة", privateParking: "خاص، في الموقع" },
  ru: { specs: "Характеристики", bedrooms: "Спальни", bathrooms: "Ванные", maxGuests: "Макс. гостей", pool: "Бассейн", views: "Виды", parking: "Парковка", amenities: "Удобства", houseRules: "Правила дома", checkIn: "Заезд", checkOut: "Выезд", minStay: "Мин. проживание", noSmoking: "Не курить", noPets: "Без животных", cta: "Свяжитесь через WhatsApp", whatsapp: "Написать в WhatsApp", otherVillas: "Другие виллы", gallery: "Галерея", private: "Частный, в саду", mountain: "Горы и сад", privateParking: "Частная, на территории" },
};

type Props = {
  params: Promise<{ lang: string; slug: string; siteSlug?: string }>;
  pathPrefix?: string;
};

export async function generateVillaDetailMetadata({
  params,
  pathPrefix = "",
}: Props): Promise<Metadata> {
  const p = await params;
  const { slug, lang } = p;
  const villa = VILLAS[slug];
  if (!villa) {
    return { title: "Villa", robots: { index: false, follow: false } };
  }

  const desc = villa.desc[lang] ?? villa.desc.en!;
  const description = truncateDescription(desc);
  const h = await headers();
  const host = h.get("host");
  const origin = resolveRequestOrigin(host);
  const pagePath = villaPath(pathPrefix, `/${lang}/villas/${slug}`);
  const canonical = `${origin.origin}${pagePath}`;

  const siteSlug = p.siteSlug ?? h.get("x-nestino-slug") ?? "";
  const ctx = siteSlug ? await getSiteBySubdomain(siteSlug) : null;
  const activeLangs = ctx ? getActiveLangs(ctx) : ["en"];
  const languages: Record<string, string> = Object.fromEntries(
    activeLangs.map((l) => [l, `${origin.origin}${villaPath(pathPrefix, `/${l}/villas/${slug}`)}`])
  );
  const defaultLang = ctx?.site.defaultLanguage ?? "en";
  if (activeLangs.includes(defaultLang)) {
    languages["x-default"] = `${origin.origin}${villaPath(pathPrefix, `/${defaultLang}/villas/${slug}`)}`;
  }

  const card = VILLA_IMAGES[slug]?.card;
  const ogImages = card
    ? [{ url: card, width: 1200, height: 800, alt: `${villa.name} — private pool villa, Silyan Villas` }]
    : undefined;

  return {
    title: villa.name,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: `${villa.name} — Silyan Villas`,
      description,
      url: canonical,
      type: "website",
      siteName: "Silyan Villas",
      locale: OG_LOCALE[lang] ?? "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: villa.name,
      description,
      ...(card ? { images: [card] } : {}),
    },
  };
}

export default async function VillaDetailPage({ params, pathPrefix = "" }: { params: { lang: string; slug: string }; pathPrefix?: string }) {
  const { lang, slug } = params;
  const villa = VILLAS[slug];
  if (!villa) { notFound(); }

  const images = VILLA_IMAGES[slug];
  const l = (LABELS[lang] ?? LABELS.en) as Record<string, string>;
  const amenityLabels = (AMENITY_LABELS[lang] ?? AMENITY_LABELS.en) as Record<string, string>;
  const desc = villa.desc[lang] ?? villa.desc.en!;
  const waMsg = villa.whatsappMsg[lang] ?? villa.whatsappMsg.en!;
  const waHref = `https://wa.me/905316960953?text=${encodeURIComponent(waMsg)}`;
  const otherVillas = Object.values(VILLAS).filter((v) => v.slug !== slug);

  return (
    <div className="pb-16">
      {/* Full-bleed hero image */}
      {images && (
        <div className="relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden">
          <Image
            src={images.card}
            alt={villa.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)" }}
          />
          <div className="absolute bottom-0 inset-x-0 content-wrapper pb-6 sm:pb-8">
            <h1 className="text-white font-serif font-semibold drop-shadow-lg" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: "1.1" }}>
              {villa.name}
            </h1>
          </div>
        </div>
      )}

      {!images && (
        <div className="pt-24 content-wrapper">
          <h1 className="font-serif font-semibold text-h1 text-[var(--color-text-primary)] mb-6">
            {villa.name}
          </h1>
        </div>
      )}

      {/* Quick specs strip */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]" style={{ scrollMarginTop: "56px" }}>
        <div className="content-wrapper">
          <div className="flex gap-6 overflow-x-auto py-4 scrollbar-none snap-x snap-mandatory" style={{ scrollPaddingInline: "var(--space-4)" }}>
            {[
              { label: l.bedrooms!, value: `${villa.bedrooms}`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7" /><path d="M21 11H3V7a2 2 0 012-2h14a2 2 0 012 2v4z" /></svg> },
              { label: l.bathrooms!, value: `${villa.baths}`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1zM6 12V5a2 2 0 012-2h1" /></svg> },
              { label: l.maxGuests!, value: `${villa.maxGuests}`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
              { label: l.pool!, value: l.private!, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /></svg> },
              { label: l.views!, value: l.mountain!, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 20l6-10 4 6 3-4 5 8H3z" /></svg> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-2.5 shrink-0 snap-start">
                <span style={{ color: "var(--accent-500)" }}>{icon}</span>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-wrapper pt-8">
        {/* Description with drop-cap */}
        <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-3xl mb-10 first-letter:text-4xl first-letter:font-serif first-letter:font-semibold first-letter:float-start first-letter:me-2 first-letter:mt-1 first-letter:text-[var(--accent-500)]">
          {desc}
        </p>

        {/* Gallery */}
        {images && (
          <GallerySection images={images} villaName={villa.name} galleryLabel={l.gallery ?? "Gallery"} />
        )}

        {/* Amenities */}
        <div className="mb-10" id="amenities">
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-4">
            {l.amenities}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AMENITIES.map((key) => (
              <div key={key} className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--accent-400)]/50">
                <span className="text-[var(--color-text-muted)]">{AMENITY_SVG[key]}</span>
                <span className="text-sm text-[var(--color-text-primary)]">{amenityLabels[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* House rules */}
        <div className="mb-10" id="rules">
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-4">
            {l.houseRules}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: l.checkIn!, value: "15:00" },
              { label: l.checkOut!, value: "12:00" },
              { label: l.minStay!, value: lang === "tr" ? "2 gece" : lang === "ar" ? "ليلتان" : lang === "ru" ? "2 ночи" : "2 nights" },
              { label: l.noSmoking!, value: "---" },
              { label: l.noPets!, value: "---" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{value === "---" ? "✕" : value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-xl p-6 md:p-8 mb-10 text-center shadow-[var(--shadow-glow)]"
          style={{ backgroundColor: "var(--accent-muted)" }}
          id="contact"
        >
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-4">
            {l.cta}
          </h2>
          <div className="flex justify-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium text-white transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.97] w-full sm:w-auto max-w-md"
              style={{ backgroundColor: WHATSAPP_BRAND_GREEN }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {l.whatsapp}
            </a>
          </div>
        </div>

        {/* Related villas - carousel on mobile */}
        <div id="other-villas">
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-5">
            {l.otherVillas}
          </h2>
          <div className="snap-carousel sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 sm:overflow-visible">
            {otherVillas.map((v) => {
              const img = VILLA_IMAGES[v.slug]?.card;
              return (
                <Link
                  key={v.slug}
                  href={villaPath(pathPrefix, `/${lang}/villas/${v.slug}`)}
                  className="group rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--accent-400)] hover:shadow-[var(--shadow-md)] transition-all duration-500 bg-[var(--color-surface)] w-[70vw] sm:w-auto shrink-0 sm:shrink active:scale-[0.98]"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-[var(--color-border)]">
                    {img && (
                      <Image
                        src={img}
                        alt={v.name}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-semibold text-base text-[var(--color-text-primary)]">{v.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {v.bedrooms} {(l.bedrooms ?? "bedrooms").toLowerCase()} &middot; {v.maxGuests} {(l.maxGuests ?? "guests").toLowerCase()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
