import { Redis } from "@upstash/redis";

export type SupportedPublishedLang = "en" | "ar";

export type PublishedContentRecord = {
  pageId: string;
  siteId: string;
  slug: string;
  language: SupportedPublishedLang;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  finalContent: string;
  status: string;
  updatedAt: number;
};

const RECORD_TTL_SECONDS = 7 * 24 * 60 * 60;
const INDEX_TTL_SECONDS = 30 * 24 * 60 * 60;

let redisClient: Redis | null | undefined;
const memoryStore = new Map<string, string>();

function getRedisClient(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

export function normalizeSlug(rawSlug: string): string {
  const cleaned = rawSlug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("en/")) return cleaned.slice(3);
  if (cleaned.startsWith("ar/")) return cleaned.slice(3);
  return cleaned;
}

export function mapBackendLanguage(raw: unknown): SupportedPublishedLang | null {
  const value = String(raw ?? "").trim().toUpperCase();
  if (value === "EN") return "en";
  if (value === "AR") return "ar";
  if (value === "EN-US" || value === "EN-GB") return "en";
  if (value === "AR-SA" || value === "AR-AE") return "ar";
  return null;
}

function contentKey(siteId: string, language: SupportedPublishedLang, slug: string): string {
  return `nestino:published:${siteId}:${language}:${slug}`;
}

function pageIndexKey(siteId: string, pageId: string): string {
  return `nestino:published:page-index:${siteId}:${pageId}`;
}

function isSupportedLang(value: string): value is SupportedPublishedLang {
  return value === "en" || value === "ar";
}

function fallbackFinalContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const maybeBody = value as { blocks?: Array<{ text?: string; items?: Array<{ q?: string; a?: string } | string> }> };
    const blocks = maybeBody.blocks ?? [];
    const lines: string[] = [];
    for (const block of blocks) {
      if (typeof block.text === "string" && block.text.trim()) lines.push(`<p>${block.text}</p>`);
      if (Array.isArray(block.items)) {
        for (const item of block.items) {
          if (typeof item === "string" && item.trim()) lines.push(`<p>${item}</p>`);
          if (item && typeof item === "object") {
            const q = typeof item.q === "string" ? item.q : "";
            const a = typeof item.a === "string" ? item.a : "";
            if (q || a) lines.push(`<p><strong>${q}</strong> ${a}</p>`);
          }
        }
      }
    }
    return lines.join("\n");
  }
  return "";
}

function extractRecord(raw: unknown, fallbackPageId?: string): PublishedContentRecord | null {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  if (!obj) return null;

  const root = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown>;
  const page = (root.page && typeof root.page === "object" ? root.page : null) as Record<string, unknown> | null;
  const version = (root.version && typeof root.version === "object" ? root.version : null) as Record<string, unknown> | null;

  const pageId = String(
    root.pageId ??
      root.page_id ??
      page?.id ??
      version?.pageId ??
      version?.page_id ??
      fallbackPageId ??
      ""
  ).trim();
  const siteId = String(root.siteId ?? root.site_id ?? page?.siteId ?? page?.site_id ?? "").trim();
  const slug = normalizeSlug(
    String(root.slug ?? root.path ?? page?.slug ?? page?.path ?? "").trim()
  );
  const language =
    mapBackendLanguage(
      root.language ??
        root.languageCode ??
        root.language_code ??
        version?.language ??
        version?.languageCode ??
        version?.language_code
    ) ?? null;

  const title = String(root.title ?? version?.title ?? "").trim();
  const metaTitleRaw = root.metaTitle ?? root.meta_title ?? version?.metaTitle ?? version?.meta_title ?? null;
  const metaDescriptionRaw =
    root.metaDescription ?? root.meta_description ?? version?.metaDescription ?? version?.meta_description ?? null;
  const finalContentRaw = root.finalContent ?? root.final_content ?? root.content ?? root.body ?? root.html ?? version?.finalContent ?? version?.bodyJson ?? root.bodyJson;
  const status = String(root.status ?? version?.status ?? page?.status ?? "published");

  if (!pageId || !siteId || !slug || !language) return null;

  const finalContent = fallbackFinalContent(finalContentRaw);

  return {
    pageId,
    siteId,
    slug,
    language,
    title: title || slug,
    metaTitle: typeof metaTitleRaw === "string" && metaTitleRaw.trim() ? metaTitleRaw : null,
    metaDescription: typeof metaDescriptionRaw === "string" && metaDescriptionRaw.trim() ? metaDescriptionRaw : null,
    finalContent,
    status,
    updatedAt: Date.now(),
  };
}

export async function upsertPublishedRecord(record: PublishedContentRecord): Promise<void> {
  const key = contentKey(record.siteId, record.language, record.slug);
  const indexKey = pageIndexKey(record.siteId, record.pageId);
  const payload = JSON.stringify(record);
  const redis = getRedisClient();

  if (redis) {
    await Promise.all([
      redis.set(key, payload, { ex: RECORD_TTL_SECONDS }),
      redis.set(indexKey, `${record.language}:${record.slug}`, { ex: INDEX_TTL_SECONDS }),
    ]);
    return;
  }

  memoryStore.set(key, payload);
  memoryStore.set(indexKey, `${record.language}:${record.slug}`);
}

export async function getPublishedRecordBySlug(
  siteId: string,
  language: SupportedPublishedLang,
  slug: string
): Promise<PublishedContentRecord | null> {
  const key = contentKey(siteId, language, normalizeSlug(slug));
  const redis = getRedisClient();
  const raw = redis ? await redis.get<string>(key) : memoryStore.get(key);
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as PublishedContentRecord;
    if (!isSupportedLang(parsed.language)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const DEV_FALLBACK_SITE_ID = "00000000-0000-0000-0000-000000000001";

/** Map offline dev tenant id to configured Nestino site so Redis keys match webhook upserts. */
export function effectiveSiteIdForPublishedContent(ctxSiteId: string): string {
  const envId = process.env.NESTINO_SITE_ID?.trim();
  if (envId && ctxSiteId === DEV_FALLBACK_SITE_ID) return envId;
  return ctxSiteId;
}

const FETCH_TIMEOUT_MS = 5_000;

function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { cache: "no-store", signal: ctrl.signal }).finally(() => clearTimeout(id));
}

export async function fetchPublishedByPageId(
  apiBaseUrl: string,
  pageId: string
): Promise<PublishedContentRecord | null> {
  try {
    const response = await fetchWithTimeout(`${apiBaseUrl}/api/v1/content/${pageId}`);
    if (!response.ok) return null;
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return null;
    }
    return extractRecord(payload, pageId);
  } catch {
    return null;
  }
}

export async function fetchPublishedBySlug(
  apiBaseUrl: string,
  slug: string,
  language: SupportedPublishedLang
): Promise<PublishedContentRecord | null> {
  const upper = language.toUpperCase();
  const normalized = normalizeSlug(slug);
  const candidates = [
    `${apiBaseUrl}/api/v1/content?slug=${encodeURIComponent(normalized)}&language=${upper}`,
    `${apiBaseUrl}/api/v1/pages?slug=${encodeURIComponent(normalized)}&language=${upper}`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) continue;
      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        continue;
      }
      const record = extractRecord(payload);
      if (record) return record;
    } catch {
      continue;
    }
  }
  return null;
}
