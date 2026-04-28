import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveSiteContext } from "@nestino/villa-site/lib/tenant";

import { getPublicSiteOrigin } from "@/lib/public-site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const { siteUrl, hostForTenant } = await getPublicSiteOrigin();
  const ctx = await resolveSiteContext(hostForTenant, h.get("x-nestino-slug"));

  const hostLabel = siteUrl.replace(/^https?:\/\//, "");

  // Demo sites are noindex until the owner activates to 'live'
  if (!ctx || ctx.site.status !== "live") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const sitemapAbsolute = `${siteUrl}/sitemap.xml`;

  // Custom robots template stored in DB (set via PUT /api/cms/robots)
  if (ctx.site.robotsTemplate) {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: sitemapAbsolute,
      host: hostLabel,
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "GoogleExtendedBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: sitemapAbsolute,
    host: hostLabel,
  };
}
