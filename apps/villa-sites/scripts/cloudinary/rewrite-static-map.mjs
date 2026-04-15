import fs from "node:fs/promises";
import path from "node:path";

import { parseArgs, readJson } from "./common.mjs";

const STATIC_FILE = "packages/villa-site/src/lib/silyan-images.ts";
const WP_BASE = "https://www.silyanvillas.com/wp-content/uploads/2024/07";

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(args["repo-root"] ?? process.cwd(), "../..");
  const mappingPath = path.resolve(
    repoRoot,
    args.mapping ?? "docs/migrations/cloudinary/url-mapping.json"
  );
  const targetPath = path.resolve(repoRoot, args.target ?? STATIC_FILE);
  const dryRun = Boolean(args["dry-run"]);

  const mapping = await readJson(mappingPath, null);
  if (!mapping) {
    throw new Error(`Missing mapping file: ${mappingPath}`);
  }
  const urlMap = new Map(
    (mapping.entries ?? [])
      .filter((entry) => entry?.old_url && entry?.cloudinary_url && entry.status !== "failed")
      .map((entry) => [entry.old_url, entry.cloudinary_url])
  );

  const original = await fs.readFile(targetPath, "utf8");
  let updated = original;
  let replacements = 0;

  updated = updated.replace(
    /\$\{BASE\}\/([^`"'\s)]+)/g,
    (fullMatch, filePart) => {
      const oldUrl = `${WP_BASE}/${filePart}`;
      const newUrl = urlMap.get(oldUrl);
      if (!newUrl) return fullMatch;
      replacements += 1;
      return newUrl;
    }
  );

  for (const [oldUrl, newUrl] of urlMap.entries()) {
    if (!updated.includes(oldUrl)) continue;
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "g");
    const before = updated;
    updated = updated.replace(re, newUrl);
    if (before !== updated) replacements += 1;
  }

  if (!dryRun && updated !== original) {
    await fs.writeFile(targetPath, updated, "utf8");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        targetPath,
        replacements,
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
