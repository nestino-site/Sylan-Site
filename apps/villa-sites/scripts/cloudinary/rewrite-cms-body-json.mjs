import path from "node:path";
import pg from "pg";

import { parseArgs, readJson, requireEnv } from "./common.mjs";

function rewriteBodyJson(bodyJson, urlMap) {
  if (!bodyJson || typeof bodyJson !== "object") return { next: bodyJson, changed: 0 };
  const blocks = Array.isArray(bodyJson.blocks) ? bodyJson.blocks : [];
  let changed = 0;
  const nextBlocks = blocks.map((block) => {
    if (block?.type !== "image" || typeof block?.src !== "string") {
      return block;
    }
    const mapped = urlMap.get(block.src);
    if (!mapped) return block;
    if (mapped === block.src) return block;
    changed += 1;
    return { ...block, src: mapped };
  });
  if (changed === 0) return { next: bodyJson, changed: 0 };
  return { next: { ...bodyJson, blocks: nextBlocks }, changed };
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(args["repo-root"] ?? process.cwd(), "../..");
  const mappingPath = path.resolve(
    repoRoot,
    args.mapping ?? "docs/migrations/cloudinary/url-mapping.json"
  );
  const dryRun = Boolean(args["dry-run"]);

  const databaseUrl = requireEnv("DATABASE_URL");
  const mapping = await readJson(mappingPath, null);
  if (!mapping) {
    throw new Error(`Missing mapping file: ${mappingPath}`);
  }

  const urlMap = new Map(
    (mapping.entries ?? [])
      .filter((entry) => entry?.old_url && entry?.cloudinary_url && entry.status !== "failed")
      .map((entry) => [entry.old_url, entry.cloudinary_url])
  );

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const client = await pool.connect();

  try {
    const { rows } = await client.query(`
      select id, body_json
      from content_versions
      where status = 'published' and is_current = true
    `);

    let changedRows = 0;
    let changedBlocks = 0;

    for (const row of rows) {
      const { next, changed } = rewriteBodyJson(row.body_json, urlMap);
      if (changed === 0) continue;

      changedRows += 1;
      changedBlocks += changed;

      if (!dryRun) {
        await client.query(
          `update content_versions set body_json = $1 where id = $2`,
          [next, row.id]
        );
      }
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun,
          totalRows: rows.length,
          changedRows,
          changedBlocks,
          mappingPath,
        },
        null,
        2
      )
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
