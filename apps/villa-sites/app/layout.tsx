import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Fraunces, Inter, Noto_Naskh_Arabic, Noto_Sans_Arabic } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";

import { VillaHtmlDirSync } from "@nestino/villa-site/components/villa-html-dir-sync";
import { isLang, isRtl, htmlLang, type Lang } from "@nestino/villa-site/lib/i18n";
import { SITE_LOGO } from "@nestino/villa-site/lib/silyan-images";
import { getSiteBySubdomain } from "@nestino/villa-site/lib/tenant";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Silyan Villas",
  description: "Private villas with pools in the mountains above Antalya.",
  icons: {
    icon: SITE_LOGO,
    apple: SITE_LOGO,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const slug = h.get("x-nestino-slug") ?? "";
  const rawLang = h.get("x-nestino-lang") ?? "en";
  const lang: Lang = isLang(rawLang) ? rawLang : "en";

  // Load site for accent + theme — cached 60s
  const ctx = slug ? await getSiteBySubdomain(slug) : null;

  const accentHex = ctx?.site.accentHex ?? null;
  const isDark = ctx?.site.theme === "dark";

  // Build tenant-specific CSS variable overrides for the accent colour.
  // These override the :root defaults in globals.css.
  // We compute a rough darker/lighter variant — operators can refine later.
  const accentStyles = accentHex
    ? `
      :root {
        --accent-500: ${accentHex};
        --accent-600: color-mix(in srgb, ${accentHex} 88%, black);
        --accent-400: color-mix(in srgb, ${accentHex} 72%, white);
        --accent-muted: color-mix(in srgb, ${accentHex} 20%, transparent);
        --ring-accent: color-mix(in srgb, ${accentHex} 40%, transparent);
      }
    `
    : "";

  const fontVars = `${fraunces.variable} ${inter.variable} ${notoSansArabic.variable} ${notoNaskhArabic.variable}`;
  const themeClass = isDark ? "theme-dark" : "";

  return (
    <html
      lang={htmlLang(lang)}
      dir={isRtl(lang) ? "rtl" : "ltr"}
      className={`${fontVars} ${themeClass}`.trim()}
    >
      <head>
        {/* GSC verification */}
        {ctx?.site.gscVerificationToken && (
          <meta
            name="google-site-verification"
            content={ctx.site.gscVerificationToken}
          />
        )}
        {/* Per-tenant accent colour override */}
        {accentStyles && (
          <style dangerouslySetInnerHTML={{ __html: accentStyles }} />
        )}
      </head>
      <body className="min-h-dvh flex flex-col font-sans">
        {/* Google Tag Manager — next/script ensures client execution + correct load order */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NBNBWQ88');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NBNBWQ88"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Suspense fallback={null}>
          <VillaHtmlDirSync pattern="path-lang" />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}