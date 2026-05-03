import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveSiteContext } from "@nestino/villa-site/lib/tenant";

import { getPublicSiteOrigin, isCanonicalProductionSite } from "@/lib/public-site-url";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const { siteUrl, hostForTenant } = await getPublicSiteOrigin();
  const ctx = await resolveSiteContext(hostForTenant, h.get("x-nestino-slug"));

  const tenantLive = ctx?.site.status === "live";
  const envForce =
    process.env.NEXT_PUBLIC_ROBOTS_ALLOW_INDEX === "true" ||
    process.env.NEXT_PUBLIC_ROBOTS_ALLOW_INDEX === "1";
  const onCanonicalDomain = isCanonicalProductionSite(siteUrl);

  // Prefer DB: only index when status is live. Fallback: same host as NEXT_PUBLIC_SITE_URL
  // (standalone villa deploy) or NEXT_PUBLIC_ROBOTS_ALLOW_INDEX=true — avoids Disallow: /
  // while sitemap works, which blocked Google Search Console fetches.
  if (!tenantLive && !envForce && !onCanonicalDomain) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  const sitemapAbsolute = `${siteUrl}/sitemap.xml`;

  // Custom robots template stored in DB (set via PUT /api/cms/robots)
  if (ctx?.site.robotsTemplate) {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: sitemapAbsolute,
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
  };
}
