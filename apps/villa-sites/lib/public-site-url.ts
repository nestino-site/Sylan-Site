import { headers } from "next/headers";

/**
 * Canonical public origin + host segment for tenant resolution.
 * Matches CDN/proxy behaviour (x-forwarded-*) and env fallbacks used by sitemap.xml.
 */
export async function getPublicSiteOrigin(): Promise<{
  /** Full origin without trailing slash, e.g. https://www.example.com */
  siteUrl: string;
  /** Hostname only (no port); may be empty when using env fallback — still OK for resolveSlug */
  hostForTenant: string;
}> {
  const h = await headers();
  const forwardedHost = h.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || h.get("host")?.trim() || "";

  const forwardedProto = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol =
    forwardedProto ||
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  if (host) {
    return { siteUrl: `${protocol}://${host}`, hostForTenant: host };
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return { siteUrl: fromEnv, hostForTenant: "" };
  }

  if (process.env.VERCEL_URL) {
    const v = process.env.VERCEL_URL.replace(/^https?:\/\//, "");
    return { siteUrl: `https://${v}`, hostForTenant: "" };
  }

  return { siteUrl: `${protocol}://localhost`, hostForTenant: "" };
}
