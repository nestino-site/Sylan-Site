import path from "node:path";

import { v2 as cloudinary } from "cloudinary";

import { parseArgs, readJson, requireEnv, writeJson } from "./common.mjs";

function parseCloudName(cloudinaryUrl) {
  const parsed = new URL(cloudinaryUrl);
  return parsed.hostname;
}

async function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(args["repo-root"] ?? process.cwd(), "../..");
  const mappingPath = path.resolve(
    repoRoot,
    args.mapping ?? "docs/migrations/cloudinary/url-mapping.json"
  );
  const timeoutMs = Number(args.timeout ?? 15000);

  const cloudinaryUrl = requireEnv("CLOUDINARY_URL");
  const cloudName = parseCloudName(cloudinaryUrl);
  cloudinary.config({ secure: true, cloudinary_url: cloudinaryUrl });

  const mapping = await readJson(mappingPath, null);
  if (!mapping || !Array.isArray(mapping.entries)) {
    throw new Error(`Invalid mapping file: ${mappingPath}`);
  }

  const failedEntries = mapping.entries.filter((entry) => entry.status === "failed");
  let retried = 0;
  let fixed = 0;

  for (const entry of failedEntries) {
    retried += 1;
    try {
      const result = await Promise.race([
        cloudinary.uploader.upload(entry.old_url, {
          resource_type: "image",
          public_id: entry.cloudinary_public_id,
          overwrite: true,
          use_filename: false,
          unique_filename: false,
        }),
        new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error(`Upload timeout after ${timeoutMs}ms`)),
            timeoutMs
          );
        }),
      ]);

      entry.cloudinary_public_id = result.public_id;
      entry.cloudinary_url = result.secure_url;
      entry.status = "migrated";
      entry.migrated_at = new Date().toISOString();
      delete entry.error;
      fixed += 1;
    } catch (error) {
      entry.error = error instanceof Error ? error.message : String(error);
      entry.migrated_at = new Date().toISOString();
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    cloudName,
    entries: mapping.entries.sort((a, b) => a.old_url.localeCompare(b.old_url)),
  };
  await writeJson(mappingPath, output);

  console.log(
    JSON.stringify(
      {
        ok: true,
        mappingPath,
        retried,
        fixed,
        remainingFailed: output.entries.filter((e) => e.status === "failed").length,
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
