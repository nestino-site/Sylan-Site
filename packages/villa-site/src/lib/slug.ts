const VILLA_BASE_DOMAIN =
  process.env.NEXT_PUBLIC_VILLA_BASE_DOMAIN ?? "nestino.com";

/**
 * Maps Host header to tenant subdomain/slug for villa-site routing.
 * Shared with middleware, robots.txt, and sitemap.xml (routes that bypass middleware).
 *
 * Standalone deploy (e.g. Sylan-Site on Vercel): unknown hosts resolve to
 * `NEXT_PUBLIC_VILLA_SUBDOMAIN` or `silyan` so a single tenant DB row matches.
 */
export function resolveSlug(host: string): string {
  const hostname = host.split(":")[0] ?? "";
  const envSlug = process.env.NEXT_PUBLIC_VILLA_SUBDOMAIN?.trim();

  if (hostname.endsWith(`.${VILLA_BASE_DOMAIN}`)) {
    const sub = hostname.slice(0, hostname.length - VILLA_BASE_DOMAIN.length - 1);
    if (sub) return sub;
  }

  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, hostname.indexOf(".localhost"));
    if (sub) return sub;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return envSlug ?? "silyan";
  }

  return envSlug ?? "silyan";
}
