import { NextResponse } from "next/server";

import {
  buildEmergencyEntriesFromEnv,
  collectSitemapUrls,
  type SitemapUrlEntry,
} from "@/lib/sitemap-urls";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeXmlLoc(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function buildXml(entries: SitemapUrlEntry[]): string {
  const body = entries
    .map((e) => {
      const loc = escapeXmlLoc(e.url);
      const lastmod = e.lastModified
        ? `\n    <lastmod>${e.lastModified.toISOString()}</lastmod>`
        : "";
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export async function GET() {
  try {
    let entries = await collectSitemapUrls();
    if (entries.length === 0) {
      entries = buildEmergencyEntriesFromEnv();
    }
    const xml = buildXml(entries);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=120, s-maxage=120",
      },
    });
  } catch (err) {
    console.error("[sitemap.xml GET]", err);
    const entries = buildEmergencyEntriesFromEnv();
    const xml = buildXml(entries);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  }
}
