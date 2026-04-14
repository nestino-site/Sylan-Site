import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { isLang, type Lang } from "./lib/i18n";
import { resolveRequestOrigin } from "./lib/site-origin";
import { getSiteBySubdomain, getActiveLangs } from "./lib/tenant";
import { SITE_LOGO } from "./lib/silyan-images";
import { villaPath } from "./lib/villa-path";
import SiteHeader from "./components/site-header";
import StickyCtaBar from "./components/sticky-cta-bar";
import FloatingWhatsApp from "./components/floating-whats-app";
import Footer from "./components/footer";

export { getActiveLangs };

type LayoutParams = { lang: string; siteSlug?: string };

type LayoutProps = {
  children?: React.ReactNode;
  params: Promise<LayoutParams>;
  pathPrefix: string;
};

export async function generateVillaLangMetadata({
  params,
  pathPrefix: _pathPrefix,
}: LayoutProps): Promise<Metadata> {
  const { siteSlug: slugFromParams } = await params;
  const h = await headers();
  const slug = slugFromParams ?? h.get("x-nestino-slug") ?? "";
  const ctx = slug ? await getSiteBySubdomain(slug) : null;

  return {
    metadataBase: resolveRequestOrigin(h.get("host")),
    title: {
      default: ctx?.tenant.name ?? "Villa",
      template: `%s | ${ctx?.tenant.name ?? "Villa"}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export async function VillaLangLayout({
  children,
  params,
  pathPrefix,
}: LayoutProps) {
  const { lang, siteSlug: slugFromParams } = await params;

  if (!isLang(lang)) {
    redirect(villaPath(pathPrefix, "/en"));
  }

  const h = await headers();
  const slug = slugFromParams ?? h.get("x-nestino-slug") ?? "";

  const ctx = slug ? await getSiteBySubdomain(slug) : null;

  if (!ctx) {
    notFound();
  }

  const activeLangs = getActiveLangs(ctx);

  if (!activeLangs.includes(lang)) {
    redirect(villaPath(pathPrefix, `/${ctx.site.defaultLanguage}`));
  }

  return (
    <>
      <SiteHeader
        siteName={ctx.tenant.name}
        lang={lang as Lang}
        activeLangs={activeLangs}
        phone={ctx.tenant.ownerPhone ?? ""}
        pathPrefix={pathPrefix}
        logoSrc={ctx.tenant.slug === "silyan" ? SITE_LOGO : undefined}
      />
      <StickyCtaBar
        phone={ctx.tenant.ownerPhone ?? ""}
        lang={lang as Lang}
        siteName={ctx.tenant.name}
      />
      <main className="flex-1">{children}</main>
      <FloatingWhatsApp phone={ctx.tenant.ownerPhone ?? ""} />
      <Footer
        siteName={ctx.tenant.name}
        locationLabel={ctx.tenant.locationLabel ?? ""}
        phone={ctx.tenant.ownerPhone ?? ""}
        lang={lang as Lang}
        activeLangs={activeLangs}
        pathPrefix={pathPrefix}
      />
    </>
  );
}
