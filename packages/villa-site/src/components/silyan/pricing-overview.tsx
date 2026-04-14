"use client";

import Link from "next/link";
import type { Lang } from "../../lib/i18n";
import { villaPath } from "../../lib/villa-path";
import AnimateOnScroll from "../animate-on-scroll";

type Props = { lang: Lang; pathPrefix?: string };

type CopyBlock = {
  headline: string;
  note: string;
  cta: string;
  low: string;
  mid: string;
  high: string;
  lowSeason: string;
  midSeason: string;
  highSeason: string;
  starting: string;
  popular: string;
};

const COPY: Record<Lang, CopyBlock> = {
  en: {
    headline: "Rates",
    note:
      "Prices vary by villa size, season, and length of stay. For the lowest rate, book directly with us on WhatsApp — third‑party sites usually include commission, so messaging us is typically cheaper. We confirm exact availability and pricing and reply within a few hours.",
    cta: "Request rates",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Low season",
    midSeason: "Mid season",
    highSeason: "High season",
    starting: "from / night",
    popular: "Popular",
  },
  tr: {
    headline: "Fiyatlar",
    note:
      "Fiyatlar villa büyüklüğüne, sezona ve konaklama süresine göre değişir. En uygun fiyat için WhatsApp üzerinden doğrudan bize yazın — üçüncü taraf sitelerinde genellikle komisyon vardır, bu yüzden bize ulaşmak çoğu zaman daha hesaplıdır. Kesin müsaitlik ve fiyatı paylaşır, birkaç saat içinde döneriz.",
    cta: "Fiyat sor",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Düşük sezon",
    midSeason: "Orta sezon",
    highSeason: "Yüksek sezon",
    starting: "başlayan / gece",
    popular: "Yoğun",
  },
  ar: {
    headline: "الأسعار",
    note:
      "تتفاوت الأسعار حسب حجم الفيلا والموسم ومدة الإقامة. للحصول على أقل سعر، احجز مباشرة معنا عبر واتساب — مواقع الحجز الخارجية غالباً تشمل عمولة، لذا التواصل المباشر معنا عادةً أوفر. نؤكد لك التوفر والأسعار بدقة ونرد خلال ساعات قليلة.",
    cta: "استفسر عن الأسعار",
    low: "٩٠€",
    mid: "١٣٠€",
    high: "١٩٠€",
    lowSeason: "الموسم المنخفض",
    midSeason: "الموسم المتوسط",
    highSeason: "الموسم المرتفع",
    starting: "من / ليلة",
    popular: "الأكثر طلباً",
  },
  ru: {
    headline: "Стоимость",
    note:
      "Цены зависят от размера виллы, сезона и продолжительности пребывания. Самую выгодную цену вы получите при прямом бронировании через WhatsApp — на агрегаторах часто заложена комиссия, поэтому напрямую обычно дешевле. Уточним доступность и точную стоимость и ответим в течение нескольких часов.",
    cta: "Узнать стоимость",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Низкий сезон",
    midSeason: "Средний сезон",
    highSeason: "Высокий сезон",
    starting: "от / ночь",
    popular: "Популярно",
  },
  de: {
    headline: "Preise",
    note:
      "Die Preise hängen von Villagröße, Saison und Aufenthaltsdauer ab. Den günstigsten Preis erhalten Sie bei einer Direktbuchung über WhatsApp — auf Portalen liegt oft eine Provision obenauf, deshalb lohnt sich die direkte Anfrage in der Regel. Wir nennen Ihnen genaue Verfügbarkeit und Preise und melden uns innerhalb weniger Stunden.",
    cta: "Preise anfragen",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Nebensaison",
    midSeason: "Zwischensaison",
    highSeason: "Hauptsaison",
    starting: "ab / Nacht",
    popular: "Beliebt",
  },
  fr: {
    headline: "Tarifs",
    note:
      "Les tarifs varient selon la taille de la villa, la saison et la durée du séjour. Pour le meilleur prix, réservez directement avec nous sur WhatsApp — les plateformes ajoutent souvent une commission, il est donc généralement plus avantageux de nous écrire. Nous confirmons disponibilité et tarif précis et répondons en quelques heures.",
    cta: "Demander un tarif",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Basse saison",
    midSeason: "Mi-saison",
    highSeason: "Haute saison",
    starting: "à partir de / nuit",
    popular: "Populaire",
  },
  "zh-Hans": {
    headline: "价格",
    note:
      "具体价格因别墅大小、季节和入住天数而异。通过 WhatsApp 直接向我们预订可享最优价格——第三方平台通常含佣金，直接联系我们通常更实惠。我们会确认准确空房与报价，并在数小时内回复。",
    cta: "咨询价格",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "淡季",
    midSeason: "平季",
    highSeason: "旺季",
    starting: "起 / 晚",
    popular: "热门",
  },
  ko: {
    headline: "요금",
    note:
      "요금은 빌라 규모, 시즌, 숙박 일수에 따라 달라집니다. 왓츠앱으로 저희에게 직접 예약하시면 최저가를 받으실 수 있습니다 — 제3자 사이트에는 수수료가 포함되는 경우가 많아 직접 문의하시는 편이 보통 더 유리합니다. 정확한 예약 가능 여부와 견적을 알려드리며 수 시간 내에 답변드립니다.",
    cta: "요금 문의",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "비수기",
    midSeason: "준성수기",
    highSeason: "성수기",
    starting: "부터 / 박",
    popular: "인기",
  },
  ja: {
    headline: "料金",
    note:
      "料金は別荘の広さ、季節、宿泊日数により異なります。WhatsAppで弊社に直接ご予約いただくと、最もお得な料金になります。第三者サイトには手数料が上乗せされることが多く、直接のご連絡の方が通常お得です。空室状況と正確なお見積もりをお知らせし、数時間以内にご返信します。",
    cta: "料金を問い合わせる",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "オフシーズン",
    midSeason: "ミッドシーズン",
    highSeason: "ハイシーズン",
    starting: "〜 / 泊",
    popular: "人気",
  },
  it: {
    headline: "Tariffe",
    note:
      "Le tariffe variano in base alle dimensioni della villa, alla stagione e alla durata del soggiorno. Per il prezzo più basso, prenota direttamente con noi su WhatsApp — sui portali di terze parti spesso c’è una commissione, quindi scriverci di solito conviene di più. Confermiamo disponibilità e prezzo esatti e rispondiamo entro poche ore.",
    cta: "Richiedi tariffe",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Bassa stagione",
    midSeason: "Media stagione",
    highSeason: "Alta stagione",
    starting: "da / notte",
    popular: "Popolare",
  },
  nl: {
    headline: "Tarieven",
    note:
      "Prijzen verschillen naar villaformaat, seizoen en verblijfsduur. Voor de laagste prijs boek je rechtstreeks via WhatsApp met ons — op platforms van derden zit vaak commissie, dus direct contact is meestal voordeliger. We bevestigen exacte beschikbaarheid en prijs en reageren binnen enkele uren.",
    cta: "Tarieven opvragen",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Laagseizoen",
    midSeason: "Tussenseizoen",
    highSeason: "Hoogseizoen",
    starting: "vanaf / nacht",
    popular: "Populair",
  },
  es: {
    headline: "Tarifas",
    note:
      "Los precios varían según el tamaño de la villa, la temporada y la duración de la estancia. Para el precio más bajo, reserva directamente con nosotros por WhatsApp — en webs de terceros suele haber comisión, así que escribirnos suele salir más barato. Confirmamos disponibilidad y precio exactos y respondemos en pocas horas.",
    cta: "Solicitar tarifas",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Temporada baja",
    midSeason: "Temporada media",
    highSeason: "Temporada alta",
    starting: "desde / noche",
    popular: "Popular",
  },
  ms: {
    headline: "Kadar",
    note:
      "Kadar berbeza mengikut saiz villa, musim dan tempoh penginapan. Untuk harga terendah, tempah terus dengan kami melalui WhatsApp — laman pihak ketiga biasanya ada komisen, jadi hubungi kami biasanya lebih jimat. Kami sahkan ketersediaan dan harga tepat serta membalas dalam beberapa jam.",
    cta: "Minta kadar",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Musim sepi",
    midSeason: "Musim pertengahan",
    highSeason: "Musim puncak",
    starting: "dari / malam",
    popular: "Popular",
  },
  pt: {
    headline: "Preços",
    note:
      "Os preços variam consoante o tamanho da villa, a época e a duração da estadia. Para o preço mais baixo, reserve diretamente connosco por WhatsApp — em sites de terceiros costuma haver comissão, por isso falar connosco costuma sair mais barato. Confirmamos disponibilidade e preço exatos e respondemos em poucas horas.",
    cta: "Pedir preços",
    low: "€90",
    mid: "€130",
    high: "€190",
    lowSeason: "Época baixa",
    midSeason: "Época média",
    highSeason: "Época alta",
    starting: "desde / noite",
    popular: "Popular",
  },
};

const SEASON_MONTHS: Record<Lang, { low: string; mid: string; high: string }> = {
  en: { low: "Nov – Mar", mid: "Apr – Jun, Oct", high: "Jul – Sep" },
  tr: { low: "Kas – Mar", mid: "Nis – Haz, Eki", high: "Tem – Eyl" },
  ar: { low: "نوف – مار", mid: "أبر – يون، أكت", high: "يول – سبت" },
  ru: { low: "Ноя – Мар", mid: "Апр – Июн, Окт", high: "Июл – Сен" },
  de: { low: "Nov – Mär", mid: "Apr – Jun, Okt", high: "Jul – Sep" },
  fr: { low: "Nov – Mar", mid: "Avr – Juin, Oct", high: "Juil – Sept" },
  "zh-Hans": { low: "11月 – 3月", mid: "4月 – 6月、10月", high: "7月 – 9月" },
  ko: { low: "11월 – 3월", mid: "4월 – 6월, 10월", high: "7월 – 9월" },
  ja: { low: "11月 – 3月", mid: "4月 – 6月、10月", high: "7月 – 9月" },
  it: { low: "Nov – Mar", mid: "Apr – Giu, Ott", high: "Lug – Set" },
  nl: { low: "Nov – Mrt", mid: "Apr – Jun, Okt", high: "Jul – Sep" },
  es: { low: "Nov – Mar", mid: "Abr – Jun, Oct", high: "Jul – Sep" },
  ms: { low: "Nov – Mac", mid: "Apr – Jun, Okt", high: "Jul – Sep" },
  pt: { low: "Nov – Mar", mid: "Abr – Jun, Out", high: "Jul – Set" },
};

const SEASON_ICONS = [
  <svg key="snow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /></svg>,
  <svg key="leaf" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 21.34M17 8c2-1 4-.5 7 1-1 3-2 5-3 7" /><path d="M17 8l-4 4" /></svg>,
  <svg key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
];

export default function PricingOverview({ lang, pathPrefix = "" }: Props) {
  const c = COPY[lang] ?? COPY.en;
  const months = SEASON_MONTHS[lang] ?? SEASON_MONTHS.en;

  const seasons = [
    {
      id: "pricing-tier-low",
      label: c.lowSeason,
      months: months.low,
      price: c.low,
      icon: SEASON_ICONS[0],
      highlight: false,
    },
    {
      id: "pricing-tier-mid",
      label: c.midSeason,
      months: months.mid,
      price: c.mid,
      icon: SEASON_ICONS[1],
      highlight: false,
    },
    {
      id: "pricing-tier-high",
      label: c.highSeason,
      months: months.high,
      price: c.high,
      icon: SEASON_ICONS[2],
      highlight: true,
    },
  ];

  return (
    <section
      className="section-y bg-[var(--color-surface)] content-lazy"
      aria-labelledby="pricing-overview-heading"
    >
      <div className="content-wrapper">
        <AnimateOnScroll variant="fade-up">
          <h2
            id="pricing-overview-heading"
            className="font-serif font-semibold text-h2 text-[var(--color-text-primary)] mb-3"
          >
            {c.headline}
          </h2>
          <p className="text-base text-[var(--color-text-secondary)] mb-8 max-w-xl leading-relaxed">
            {c.note}
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {seasons.map(({ id, label, months, price, icon, highlight }, i) => (
            <AnimateOnScroll key={id} variant="fade-up" delay={i * 0.08}>
              <div
                className={`rounded-xl border p-6 transition-shadow duration-300 ${
                  highlight
                    ? "border-[var(--accent-400)] shadow-[var(--shadow-glow)]"
                    : "border-[var(--color-border)] bg-[var(--color-bg)]"
                }`}
                style={highlight ? { backgroundColor: "var(--accent-muted)" } : undefined}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: highlight ? "var(--accent-500)" : "var(--color-text-muted)" }}>
                    {icon}
                  </span>
                  <h3
                    id={id}
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] m-0"
                  >
                    {label}
                  </h3>
                  {highlight && (
                    <span className="ms-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: "var(--accent-600)", backgroundColor: "var(--accent-muted)" }}>
                      {c.popular}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mb-4">{months}</p>
                <p className="font-serif font-semibold text-2xl text-[var(--color-text-primary)]">
                  {price}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 font-serif italic">
                  {c.starting}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll variant="fade-up" delay={0.2}>
          <Link
            href={villaPath(pathPrefix, `/${lang}/contact`)}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-sm font-medium text-white transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:brightness-110 active:scale-[0.97]"
            style={{ backgroundColor: "var(--accent-500)" }}
          >
            {c.cta}
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
