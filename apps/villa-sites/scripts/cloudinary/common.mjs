import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const WP_BASE = "https://www.silyanvillas.com/wp-content/uploads/2024/07";

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readJson(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function sha1(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

export function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

export function inferAssetType(url) {
  if (url.includes("/logoweb")) return "brand.logo";
  if (url.includes("konyaalti")) return "site.location";
  if (url.includes("Villa") || url.includes("villa")) return "villa";
  return "misc";
}

export function extractFilename(url) {
  const pathname = new URL(url).pathname;
  const name = pathname.split("/").pop() ?? "asset";
  return name;
}

export function cloudinaryPublicIdForUrl(url, prefix = "silyan/legacy") {
  const file = extractFilename(url);
  const base = file.replace(/\.[^.]+$/, "");
  const hash = sha1(url).slice(0, 8);
  return `${prefix}/${toSlug(base)}-${hash}`;
}
