import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveSlug } from "@nestino/villa-site/lib/slug";
import { getSiteBySubdomain } from "@nestino/villa-site/lib/tenant";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host") ?? "";
  const slug = h.get("x-nestino-slug") || resolveSlug(host) || "";
  const ctx = slug ? await getSiteBySubdomain(slug) : null;
  const protocol = host.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  // Demo sites are noindex until the owner activates to 'live'
  if (!ctx || ctx.site.status !== "live") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  // Custom robots template stored in DB (set via PUT /api/cms/robots)
  if (ctx.site.robotsTemplate) {
    // Parse stored lines into rules — basic implementation
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // Default: allow all including AI crawlers
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "GoogleExtendedBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}