import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

// CSP: optional iframe embed from Nestino marketing; tighten for a standalone domain if needed.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com https://us.i.posthog.com https://eu.i.posthog.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  // <video> uses media-src (falls back to default-src otherwise — blocks tenant CDN / WP uploads)
  "media-src 'self' https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.posthog.com https://us.i.posthog.com https://eu.i.posthog.com wss://*.posthog.com https://maps.googleapis.com",
  "frame-src https://www.google.com https://maps.google.com",
  // Allow marketing site to embed demo villa pages in iframes
  "frame-ancestors 'self' https://nestino.com https://*.nestino.com https://nestino-main.vercel.app",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@nestino/db", "@nestino/villa-site"],
  images: {
    remotePatterns: [
      // Supabase Storage CDN
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Allow original silyan domain during migration
      {
        protocol: "https",
        hostname: "www.silyanvillas.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // No X-Frame-Options — use frame-ancestors in CSP only.
        ],
      },
    ];
  },
};

export default nextConfig;