import path from "node:path";

import { v2 as cloudinary } from "cloudinary";

import {
  cloudinaryPublicIdForUrl,
  parseArgs,
  readJson,
  requireEnv,
  writeJson,
} from "./common.mjs";

function shouldMigrateUrl(url) {
  return /^https?:\/\//.test(url);
}

function parseCloudName(cloudinaryUrl) {
  const parsed = new URL(cloudinaryUrl);
  return parsed.hostname;
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(args["repo-root"] ?? process.cwd(), "../..");
  const inventoryPath = path.resolve(
    repoRoot,
    args.inventory ?? "docs/migrations/cloudinary/inventory.json"
  );
  const mappingPath = path.resolve(
    repoRoot,
    args.out ?? "docs/migrations/cloudinary/url-mapping.json"
  );
  const dryRun = Boolean(args["dry-run"]);
  const folder = args.folder ?? "silyan/legacy";

  const cloudinaryUrl = requireEnv("CLOUDINARY_URL");
  const cloudName = parseCloudName(cloudinaryUrl);
  cloudinary.config({ secure: true, cloudinary_url: cloudinaryUrl });

  const inventory = await readJson(inventoryPath, null);
  if (!inventory) {
    throw new Error(`Inventory file not found: ${inventoryPath}`);
  }

  const existing = (await readJson(mappingPath, null)) ?? {
    generatedAt: new Date().toISOString(),
    cloudName,
    entries: [],
  };
  const byOldUrl = new Map(existing.entries.map((entry) => [entry.old_url, entry]));

  const urls = Array.isArray(inventory.allUrls)
    ? inventory.allUrls.map((entry) => entry.url)
    : [];

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;
  const now = new Date().toISOString();
  const timeoutMs = Number(args.timeout ?? 30000);

  for (const url of urls) {
    if (!shouldMigrateUrl(url)) {
      skipped += 1;
      continue;
    }
    if (byOldUrl.has(url)) {
      skipped += 1;
      continue;
    }

    const publicId = cloudinaryPublicIdForUrl(url, folder);
    const defaultDelivery = cloudinary.url(publicId, {
      secure: true,
      transformation: [{ fetch_format: "auto", quality: "auto" }],
    });

    if (dryRun) {
      byOldUrl.set(url, {
        old_url: url,
        cloudinary_public_id: publicId,
        cloudinary_url: defaultDelivery,
        status: "dry_run",
        migrated_at: now,
      });
      created += 1;
      continue;
    }

    try {
      const uploadResult = await Promise.race([
        cloudinary.uploader.upload(url, {
          resource_type: "image",
          folder,
          public_id: publicId.split("/").pop(),
          use_filename: false,
          unique_filename: false,
          overwrite: false,
        }),
        new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error(`Upload timeout after ${timeoutMs}ms`)),
            timeoutMs
          );
        }),
      ]);

      byOldUrl.set(url, {
        old_url: url,
        cloudinary_public_id: uploadResult.public_id,
        cloudinary_url: uploadResult.secure_url,
        status: "migrated",
        migrated_at: now,
      });
      created += 1;
    } catch (error) {
      byOldUrl.set(url, {
        old_url: url,
        cloudinary_public_id: publicId,
        cloudinary_url: defaultDelivery,
        status: "failed",
        migrated_at: now,
        error: error instanceof Error ? error.message : String(error),
      });
      failed += 1;
    }

    processed += 1;
    if (processed % 10 === 0) {
      console.log(
        `[cloudinary-migrate] processed=${processed}/${urls.length} created=${created} skipped=${skipped} failed=${failed}`
      );
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    cloudName,
    entries: [...byOldUrl.values()].sort((a, b) =>
      a.old_url.localeCompare(b.old_url)
    ),
  };

  await writeJson(mappingPath, output);

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        inventoryPath,
        mappingPath,
        totalUrls: urls.length,
        created,
        skipped,
        failed,
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
