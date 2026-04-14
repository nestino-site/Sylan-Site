const FALLBACK_ORIGIN = "https://nestino-main.vercel.app";

/**
 * Safe absolute URL for metadata / JSON-LD. Never throws.
 * `Host` can be missing on some proxies / internal fetches — `new URL("https://")` throws.
 */
export function resolveRequestOrigin(hostHeader: string | null): URL {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const withScheme = /^https?:\/\//i.test(fromEnv) ? fromEnv : `https://${fromEnv}`;
    try {
      return new URL(withScheme);
    } catch {
      // fall through
    }
  }

  const host = (hostHeader ?? "").trim();
  if (!host) {
    try {
      return new URL(FALLBACK_ORIGIN);
    } catch {
      return new URL("https://example.com");
    }
  }

  const protocol =
    host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  try {
    return new URL(`${protocol}://${host}`);
  } catch {
    try {
      return new URL(FALLBACK_ORIGIN);
    } catch {
      return new URL("https://example.com");
    }
  }
}
