import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

import {
  WP_BASE,
  ensureDir,
  inferAssetType,
  parseArgs,
  readJson,
  writeJson,
} from "./common.mjs";

const STATIC_SOURCE_FILE =
  "packages/villa-site/src/lib/silyan-images.ts";

function collectFromSilyanImages(content) {
  const matches = new Set();
  const basePattern = /\$\{BASE\}\/([^`"'\s)]+)/g;
  let m = basePattern.exec(content);
  while (m) {
    matches.add(`${WP_BASE}/${m[1]}`);
    m = basePattern.exec(content);
  }

  const absolutePattern = /https:\/\/www\.silyanvillas\.com\/wp-content\/uploads\/2024\/07\/[^\s"'`)]+/g;
  const absolutes = content.match(absolutePattern) ?? [];
  for (const url of absolutes) {
    matches.add(url);
  }

  return [...matches].sort();
}

function collectImageBlockUrls(bodyJson) {
  if (!bodyJson || typeof bodyJson !== "object") return [];
  const blocks = Array.isArray(bodyJson.blocks) ? bodyJson.blocks : [];
  return blocks
    .filter((b) => b?.type === "image" && typeof b?.src === "string")
    .map((b) => b.src);
}

async function collectCmsUrls() {
  if (!process.env.DATABASE_URL) {
    return { rows: [], urls: [] };
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const result = await client.query(`
      select id, page_id, language_code, version, body_json
      from content_versions
      where status = 'published' and is_current = true
    `);

    const rows = [];
    const urlSet = new Set();
    for (const row of result.rows) {
      const urls = collectImageBlockUrls(row.body_json);
      for (const src of urls) {
        urlSet.add(src);
      }
      rows.push({
        id: row.id,
        pageId: row.page_id,
        languageCode: row.language_code,
        version: row.version,
        imageCount: urls.length,
      });
    }

    return { rows, urls: [...urlSet].sort() };
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(args["repo-root"] ?? process.cwd(), "../..");
  const outputPath = path.resolve(
    repoRoot,
    args.out ?? "docs/migrations/cloudinary/inventory.json"
  );
  const mappingPath = path.resolve(
    repoRoot,
    args.mapping ?? "docs/migrations/cloudinary/url-mapping.json"
  );

  const silyanImagesPath = path.resolve(repoRoot, STATIC_SOURCE_FILE);
  const content = await fs.readFile(silyanImagesPath, "utf8");
  const staticUrls = collectFromSilyanImages(content);
  const cms = await collectCmsUrls();

  const existingMap = (await readJson(mappingPath, { entries: [] })) ?? {
    entries: [],
  };
  const mappedOldUrls = new Set(existingMap.entries.map((e) => e.old_url));

  const allUrls = [...new Set([...staticUrls, ...cms.urls])].sort();
  const inventory = {
    generatedAt: new Date().toISOString(),
    totals: {
      staticUrls: staticUrls.length,
      cmsUrls: cms.urls.length,
      allUniqueUrls: allUrls.length,
      alreadyMapped: allUrls.filter((u) => mappedOldUrls.has(u)).length,
    },
    static: staticUrls.map((url) => ({
      url,
      source: STATIC_SOURCE_FILE,
      type: inferAssetType(url),
      mapped: mappedOldUrls.has(url),
    })),
    cms: {
      rows: cms.rows,
      urls: cms.urls.map((url) => ({
        url,
        type: inferAssetType(url),
        mapped: mappedOldUrls.has(url),
      })),
    },
    allUrls: allUrls.map((url) => ({
      url,
      mapped: mappedOldUrls.has(url),
    })),
  };

  await ensureDir(path.dirname(outputPath));
  await writeJson(outputPath, inventory);

  console.log(
    JSON.stringify(
      {
        ok: true,
        outputPath,
        static: staticUrls.length,
        cms: cms.urls.length,
        all: allUrls.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
