import Image from "next/image";
import type { Lang } from "../../lib/i18n";
import { THE_STAY_IMAGE } from "../../lib/silyan-images";
import AnimateOnScroll from "../animate-on-scroll";

type Props = { lang: Lang };

type StayCopy = {
  label: string;
  introLead: string;
  awayBand: string;
  headline: string;
  pullQuote: string;
  body: string;
  bodySecond: string;
  imageAlt: string;
};

const COPY: Record<string, StayCopy> = {
  en: {
    label: "About Silyan Villas",
    introLead:
      "Pine forest, private pools, and mountain light — captivating scenery that invites you to slow down and breathe deeply.",
    awayBand: "Away from the noise of city life",
    headline: "A place between the mountain and the sea",
    pullQuote: "Quiet enough to hear the trees, close enough to reach the sea.",
    body: "Silyan Villas is the natural choice for guests who want to immerse themselves in the atmosphere of nature without giving up comfort. Eleven independent villas sit on a forested hillside above Konyaaltı, Hisarçandır — each with its own pool and garden, designed for families and groups who value privacy and space.",
    bodySecond:
      "Working with experienced architects, we shaped each home to be modern, comfortable, and functional: generous layouts, full kitchens, and private outdoor living so you can settle in and truly unwind.",
    imageAlt:
      "Private pool, pine forest, and mountain views at Silyan Villas — Hisarçandır nature retreat near Antalya, Turkey",
  },
  tr: {
    label: "Silyan Villas Hakkında",
    introLead:
      "Çam ormanı, özel havuzlar ve dağ ışığı — sizi yavaşlatmaya ve derin nefes almaya davet eden büyüleyici bir manzara.",
    awayBand: "Şehir hayatının gürültüsünden uzakta",
    headline: "Dağ ile deniz arasında bir kaçış noktası",
    pullQuote: "Ağaçları duyabilecek kadar sessiz, denize ulaşabilecek kadar yakın.",
    body: "Silyan Villas, konfordan ödün vermeden doğanın atmosferine kendini bırakmak isteyen misafirler için doğal bir tercihtir. Hisarçandır'da Konyaaltı üzerindeki ormanlık yamaçta on bir bağımsız villa yer alır — her biri mahremiyet ve alan arayan aileler ve gruplar için özel havuzu ve bahçesiyle tasarlandı.",
    bodySecond:
      "Deneyimli mimarlarla birlikte her evi modern, konforlu ve işlevsel kıldık: geniş planlar, tam donanımlı mutfaklar ve gerçekten dinlenebileceğiniz özel açık yaşam alanları.",
    imageAlt:
      "Silyan Villas'ta özel havuz, çam ormanı ve dağ manzarası — Antalya yakınında Hisarçandır doğa kaçamağı, Türkiye",
  },
  ar: {
    label: "عن سيليان فيلاز",
    introLead:
      "غابة صنوبر ومسابح خاصة وضوء جبلي — منظر آسِر يدعوك إلى التهدئة والتنفس بعمق.",
    awayBand: "بعيدًا عن ضجيج الحياة في المدينة",
    headline: "ملجأ بين الجبل والبحر",
    pullQuote: "هادئة بما يكفي لتسمع الأشجار، قريبة بما يكفي للوصول إلى البحر.",
    body: "سيليان فيلاز الخيار الطبيعي للضيوف الذين يريدون الانغماس في أجواء الطبيعة دون التفريط في الراحة. أحد عشر فيلا مستقلة على تلة مشجرة فوق كونيالتي في هيسارتشاندير — لكل منها مسبح وحديقة خاصة، مصممة للعائلات والمجموعات التي تقدر الخصوصية والمساحة.",
    bodySecond:
      "بالتعاون مع مهندسين معماريين ذوي خبرة، صممنا كل منزلاً ليكون عصرياً ومريحاً وعملياً: مخططات سخية، مطابخ كاملة، ومساحات خارجية خاصة لتستريح حقاً.",
    imageAlt:
      "مسبح خاص وغابة صنوبر وإطلالة جبلية في سيليان فيلاز — ملاذ طبيعي في هيسارتشاندير قرب أنطاليا، تركيا",
  },
  ru: {
    label: "О Silyan Villas",
    introLead:
      "Сосновый лес, частные бассейны и горный свет — настолько живописно, что хочется замедлиться и глубоко вдохнуть.",
    awayBand: "Вдали от городского шума",
    headline: "Место между горой и морем",
    pullQuote: "Достаточно тихо, чтобы слышать деревья, достаточно близко до моря.",
    body: "Silyan Villas — естественный выбор для гостей, которые хотят раствориться в атмосфере природы, не отказываясь от комфорта. Одиннадцать независимых вилл на лесистом склоне над Конъяалты в Хисарчандыре — у каждой свой бассейн и сад, для семей и групп, ценящих уединение и простор.",
    bodySecond:
      "Вместе с опытными архитекторами мы создали современные, удобные и практичные дома: продуманные планировки, полноценные кухни и приватные зоны на улице — чтобы можно было по-настоящему отдохнуть.",
    imageAlt:
      "Частный бассейн, сосновый лес и горные виды в Silyan Villas — природный отдых в Хисарчандыре у Анталии, Турция",
  },
};

const DISTANCES = [
  { km: "22 km", label: { en: "Airport", tr: "Havalimanı", ar: "المطار", ru: "Аэропорт" } },
  { km: "12 km", label: { en: "City centre", tr: "Şehir merkezi", ar: "مركز المدينة", ru: "Центр" } },
  { km: "8 km", label: { en: "Beach", tr: "Sahil", ar: "الشاطئ", ru: "Пляж" } },
];

export default function TheStay({ lang }: Props) {
  const c = COPY[lang] ?? COPY.en!;

  return (
    <section className="section-y" aria-labelledby="the-stay-heading">
      <div className="content-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image — first on mobile */}
          <AnimateOnScroll variant="fade-up" className="order-1 md:order-2">
            <div className="relative">
              {/* Decorative offset frame (hidden on mobile) */}
              <div
                className="hidden md:block absolute -end-3 -bottom-3 w-full h-full rounded-lg border-2"
                style={{ borderColor: "var(--gold-accent)", opacity: 0.2 }}
              />
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-[var(--shadow-lg)]">
                <Image
                  src={THE_STAY_IMAGE}
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Text */}
          <AnimateOnScroll variant="fade-up" delay={0.1} className="order-2 md:order-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--accent-500)" }}
            >
              {c.label}
            </p>
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-5">
              {c.introLead}
            </p>
            <h2
              id="the-stay-heading"
              className="font-serif font-semibold text-h2 text-[var(--color-text-primary)] mb-4"
            >
              {c.headline}
            </h2>
            <p
              className={`mb-5 text-[11px] font-semibold leading-snug sm:text-xs ${
                lang === "en" ? "uppercase tracking-[0.2em] sm:tracking-[0.22em]" : "tracking-wide"
              }`}
              style={{ color: "var(--accent-500)" }}
            >
              {c.awayBand}
            </p>

            {/* Pull quote */}
            <blockquote className="my-6 ps-4 border-s-2 border-[var(--gold-accent)]/40">
              <p className="font-serif italic text-base text-[var(--color-text-secondary)]">
                {c.pullQuote}
              </p>
            </blockquote>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-5">
              {c.body}
            </p>
            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
              {c.bodySecond}
            </p>

            {/* Distance pills — horizontal scroll on mobile */}
            <ul className="m-0 flex list-none gap-2 overflow-x-auto px-1 pb-1 -mx-1 scrollbar-none">
              {DISTANCES.map(({ km, label }) => (
                <li
                  key={km}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2"
                >
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: "var(--accent-500)" }}
                  >
                    {km}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {label[lang as keyof typeof label] ?? label.en}
                  </span>
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
