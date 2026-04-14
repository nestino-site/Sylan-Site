import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";

import { isLang, type Lang } from "../lib/i18n";
import { resolveRequestOrigin } from "../lib/site-origin";
import { villaPath } from "../lib/villa-path";
import { THE_STAY_IMAGE } from "../lib/silyan-images";

type Props = { params: Promise<{ lang: string; siteSlug?: string }>; pathPrefix: string };

const META: Record<string, { title: string; description: string }> = {
  en: { title: "About — Silyan Villas", description: "Family-run boutique villas in Hisarçandır — eleven independent homes with private pools, managed directly by the hosts." },
  tr: { title: "Hakkımızda — Silyan Villas", description: "Hisarçandır'da aile işletmesi butik villalar — özel havuzlu on bir bağımsız ev, doğrudan ev sahipleri tarafından yönetilir." },
  ar: { title: "من نحن — سيليان فيلاز", description: "فيلات بوتيك عائلية في هيسارتشاندير — أحد عشر منزلاً مستقلاً بمسابح خاصة." },
  ru: { title: "О нас — Silyan Villas", description: "Семейные бутик-виллы в Хисарчандыре — одиннадцать независимых домов с частными бассейнами." },
};

const COPY: Record<string, { label: string; h1: string; p1: string; p2: string; pullQuote: string; bulletsTitle: string; bullets: { icon: string; text: string }[] }> = {
  en: {
    label: "About",
    h1: "A local family, three villas, one standard",
    p1: "Silyan Villas was created by a local family with roots in the Konyaaltı hills — people who knew the land well enough to know what others were missing. The villas are designed around the pace of the mountain: slow mornings, shade in the afternoon, warm evenings in the garden. Three independent villas, each with its own character, all sharing the same standard: clean, complete, cared for.",
    p2: "We manage the property ourselves. When you arrive, you're not checking into a hotel — you're staying in something someone cares about.",
    pullQuote: "You're not checking into a hotel — you're staying in something someone cares about.",
    bulletsTitle: "What matters to us",
    bullets: [
      { icon: "family", text: "Independent, family-run hosting" },
      { icon: "direct", text: "Direct relationship with guests — no agency layer" },
      { icon: "pride", text: "Pride in the setting and the craft of hospitality" },
    ],
  },
  tr: {
    label: "Hakkımızda",
    h1: "Yerel bir aile, üç villa, tek standart",
    p1: "Silyan Villas, Konyaaltı tepelerinde kökleri olan yerel bir aile tarafından oluşturuldu — başkalarının özlediği şeyi bilen insanlar. Villalar, dağın temposu etrafında tasarlandı: yavaş sabahlar, öğleden sonra gölge, bahçede sıcak akşamlar. Her biri kendi karakterine sahip üç bağımsız villa; hepsi aynı standardı paylaşır: temiz, eksiksiz, özenli.",
    p2: "Mülkü kendimiz yönetiyoruz. Geldiğinizde bir otele giriş yapmıyorsunuz — birinin önemsediği bir yerde kalıyorsunuz.",
    pullQuote: "Bir otele giriş yapmıyorsunuz — birinin önemsediği bir yerde kalıyorsunuz.",
    bulletsTitle: "Bizim için önemli olanlar",
    bullets: [
      { icon: "family", text: "Bağımsız, aile işletmesi misafirperverlik" },
      { icon: "direct", text: "Misafirlerle doğrudan ilişki — aracı katman yok" },
      { icon: "pride", text: "Mekâna ve misafirperverlik zanaatına gurur" },
    ],
  },
  ar: {
    label: "من نحن",
    h1: "عائلة محلية، ثلاث فيلات، معيار واحد",
    p1: "أسست سيليان فيلاز عائلة محلية لها جذور في تلال كونيالتي — أناس عرفوا الأرض جيداً ليعرفوا ما يفتقده الآخرون. صممت الفيلات على وتيرة الجبل: صباحات هادئة، ظل بعد الظهر، أمسيات دافئة في الحديقة. ثلاث فيلات مستقلة، لكل منها طابعها الخاص، وجميعها تشترك في المعيار نفسه: نظيفة، كاملة، معتنى بها.",
    p2: "ندير المكان بأنفسنا. عند وصولك، لا تسجل دخولك في فندق — أنت تقيم في مكان يهتم به أحد ما.",
    pullQuote: "لا تسجل دخولك في فندق — أنت تقيم في مكان يهتم به أحد ما.",
    bulletsTitle: "ما يهمنا",
    bullets: [
      { icon: "family", text: "استضافة عائلية مستقلة" },
      { icon: "direct", text: "علاقة مباشرة مع الضيوف — دون وسيط" },
      { icon: "pride", text: "الفخر بالمكان وحرفية الضيافة" },
    ],
  },
  ru: {
    label: "О нас",
    h1: "Местная семья, три виллы, один стандарт",
    p1: "Silyan Villas создана местной семьёй с корнями в холмах Конъяалты — людьми, которые знали землю достаточно хорошо, чтобы понять, чего не хватает гостям. Виллы выстроены вокруг ритма гор: неторопливые утра, тень днём, тёплые вечера в саду. Три независимые виллы, у каждой свой характер, общий стандарт: чисто, полно, с заботой.",
    p2: "Мы сами ведём объект. По приезде вы не заселяетесь в отель — вы останавливаетесь там, о чём кто-то искренне заботится.",
    pullQuote: "Вы не заселяетесь в отель — вы останавливаетесь там, о чём кто-то заботится.",
    bulletsTitle: "Что для нас важно",
    bullets: [
      { icon: "family", text: "Независимый семейный хостинг" },
      { icon: "direct", text: "Прямой контакт с гостями — без агентского слоя" },
      { icon: "pride", text: "Гордость местом и ремеслом гостеприимства" },
    ],
  },
};

const BULLET_ICONS: Record<string, React.ReactNode> = {
  family: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M9 22V12h6v10" /></svg>,
  direct: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  pride: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
};

export async function generateAboutMetadata({ params, pathPrefix }: Props): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang] ?? META.en!;
  const h = await headers();
  const origin = resolveRequestOrigin(h.get("host"));
  const path = villaPath(pathPrefix, `/${lang}/about`);
  const canonical = `${origin.origin}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function AboutPage({ params, pathPrefix }: Props) {
  const { lang } = await params;
  const safeLang: Lang = isLang(lang) ? lang : "en";
  const c = COPY[safeLang] ?? COPY.en!;

  return (
    <div>
      {/* Hero image */}
      <div className="relative aspect-[21/9] sm:aspect-[3/1] overflow-hidden">
        <Image
          src={THE_STAY_IMAGE}
          alt="Silyan Villas mountain view"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 content-wrapper pb-6 sm:pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">{c.label}</p>
          <h1 className="text-white font-serif font-semibold drop-shadow-lg" style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.5rem)", lineHeight: "1.12" }}>
            {c.h1}
          </h1>
        </div>
      </div>

      <div className="section-y">
        <div className="content-wrapper max-w-3xl">
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 first-letter:text-3xl first-letter:font-serif first-letter:font-semibold first-letter:float-start first-letter:me-2 first-letter:mt-0.5 first-letter:text-[var(--accent-500)]">
            {c.p1}
          </p>

          {/* Pull quote */}
          <blockquote className="my-8 ps-4 border-s-2 border-[var(--gold-accent)]/40">
            <p className="font-serif italic text-lg text-[var(--color-text-secondary)]">{c.pullQuote}</p>
          </blockquote>

          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-12">{c.p2}</p>

          {/* Values cards */}
          <h2 className="font-serif font-semibold text-h3 text-[var(--color-text-primary)] mb-6">{c.bulletsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {c.bullets.map((b) => (
              <div key={b.icon} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--accent-400)]/50">
                <span className="mb-3 block" style={{ color: "var(--accent-500)" }}>
                  {BULLET_ICONS[b.icon]}
                </span>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
