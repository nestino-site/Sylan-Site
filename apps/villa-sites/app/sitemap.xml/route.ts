import { NextResponse } from "next/server";

import {
  buildEmergencyEntriesFromEnv,
  buildSitemapLoc,
  collectSitemapUrls,
  pickXDefaultLang,
  type SitemapCollectResult,
  type SitemapPageEntry,
} from "@/lib/sitemap-urls";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeXmlLoc(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function escapeXmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function formatPriority(p: number): string {
  return p.toFixed(2);
}

function buildAlternateLinks(page: SitemapPageEntry, base: string): string {
  const lines: string[] = [];
  const xDefaultLang = pickXDefaultLang(page.langs);
  const xDefaultHref = buildSitemapLoc(base, xDefaultLang, page.postLangPath);

  for (const lang of page.langs) {
    const href = buildSitemapLoc(base, lang, page.postLangPath);
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeXmlAttr(lang)}" href="${escapeXmlLoc(href)}"/>`
    );
  }
  lines.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXmlLoc(xDefaultHref)}"/>`
  );
  return lines.join("\n");
}

function buildXml(result: SitemapCollectResult): string {
  const { base, pages } = result;
  const blocks: string[] = [];

  for (const page of pages) {
    const lastmod = `\n    <lastmod>${page.lastModified.toISOString()}</lastmod>`;
    const cf = `\n    <changefreq>${page.changefreq}</changefreq>`;
    const pri = `\n    <priority>${formatPriority(page.priority)}</priority>`;
    const alternates = buildAlternateLinks(page, base);

    for (const lang of page.langs) {
      const loc = buildSitemapLoc(base, lang, page.postLangPath);
      blocks.push(`  <url>
    <loc>${escapeXmlLoc(loc)}</loc>${lastmod}${cf}${pri}
${alternates}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join("\n")}
</urlset>`;
}

export async function GET() {
  try {
    let result = await collectSitemapUrls();
    if (result.pages.length === 0) {
      result = buildEmergencyEntriesFromEnv();
    }
    const xml = buildXml(result);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=120, s-maxage=120",
      },
    });
  } catch (err) {
    console.error("[sitemap.xml GET]", err);
    const result = buildEmergencyEntriesFromEnv();
    const xml = buildXml(result);
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  }
}
