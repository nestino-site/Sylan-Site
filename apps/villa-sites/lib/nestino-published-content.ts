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
  /** ISO 8601 string when known */
  publishedAt: string | null;
  updatedAt: number;
};

const RECORD_TTL_SECONDS = 7 * 24 * 60 * 60;
const INDEX_TTL_SECONDS = 30 * 24 * 60 * 60;

let redisClient: Redis | null | undefined;
const memoryStore = new Map<string, string>();

export function isPersistentStoreConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

/** Production deployments must use Upstash so publish survives cold starts. */
export function assertPersistentStoreForProduction(): void {
  if (process.env.NODE_ENV === "production" && !isPersistentStoreConfigured()) {
    throw new Error("PERSISTENT_STORE_REQUIRED");
  }
}

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

function parsePublishedAt(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw === "string" && raw.trim()) {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.toISOString();
  return null;
}

function fallbackFinalContent(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const maybeBody = value as {
      blocks?: Array<{ text?: string; items?: Array<{ q?: string; a?: string } | string> }>;
    };
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

/**
 * Maps Nestino GET /api/v1/content/:pageId or GET /api/v1/pages/:pageId responses into a store record.
 */
export function extractRecord(raw: unknown, fallbackPageId?: string): PublishedContentRecord | null {
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const record = extractRecord(item, fallbackPageId);
      if (record) return record;
    }
    return null;
  }

  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  if (!obj) return null;

  const wrapped = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown>;
  const root =
    wrapped.page && typeof wrapped.page === "object"
      ? (wrapped.page as Record<string, unknown>)
      : wrapped;

  const version =
    (wrapped.version && typeof wrapped.version === "object"
      ? wrapped.version
      : wrapped.currentVersion && typeof wrapped.currentVersion === "object"
        ? wrapped.currentVersion
        : wrapped.publishedVersion && typeof wrapped.publishedVersion === "object"
          ? wrapped.publishedVersion
          : null) as Record<string, unknown> | null;

  const pageId = String(
    wrapped.pageId ??
      wrapped.page_id ??
      root.id ??
      root.pageId ??
      version?.pageId ??
      version?.page_id ??
      fallbackPageId ??
      ""
  ).trim();

  const siteId = String(
    wrapped.siteId ?? wrapped.site_id ?? root.siteId ?? root.site_id ?? ""
  ).trim();

  const slug = normalizeSlug(
    String(wrapped.slug ?? wrapped.path ?? root.slug ?? root.path ?? "").trim()
  );

  const language =
    mapBackendLanguage(
      wrapped.language ??
        wrapped.languageCode ??
        wrapped.language_code ??
        version?.language ??
        version?.languageCode ??
        version?.language_code ??
        root.language ??
        root.languageCode
    ) ?? null;

  const title = String(wrapped.title ?? version?.title ?? root.title ?? "").trim();

  const metaTitleRaw =
    wrapped.metaTitle ??
    wrapped.meta_title ??
    version?.metaTitle ??
    version?.meta_title ??
    null;
  const metaDescriptionRaw =
    wrapped.metaDescription ??
    wrapped.meta_description ??
    version?.metaDescription ??
    version?.meta_description ??
    null;

  const finalContentRaw =
    wrapped.finalContent ??
    wrapped.final_content ??
    wrapped.content ??
    wrapped.body ??
    wrapped.html ??
    version?.finalContent ??
    version?.final_content ??
    version?.bodyJson ??
    wrapped.bodyJson;

  const status = String(
    wrapped.status ?? version?.status ?? root.status ?? "published"
  ).trim();

  const publishedAtRaw =
    wrapped.publishedAt ??
    wrapped.published_at ??
    version?.publishedAt ??
    version?.published_at ??
    null;

  if (!pageId || !siteId || !slug || !language) return null;

  const finalContent = fallbackFinalContent(finalContentRaw);
  const publishedAt = parsePublishedAt(publishedAtRaw);

  return {
    pageId,
    siteId,
    slug,
    language,
    title: title || slug,
    metaTitle: typeof metaTitleRaw === "string" && metaTitleRaw.trim() ? metaTitleRaw : null,
    metaDescription:
      typeof metaDescriptionRaw === "string" && metaDescriptionRaw.trim()
        ? metaDescriptionRaw
        : null,
    finalContent,
    status,
    publishedAt,
    updatedAt: Date.now(),
  };
}

export async function upsertPublishedRecord(record: PublishedContentRecord): Promise<void> {
  assertPersistentStoreForProduction();

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

const FETCH_TIMEOUT_MS = 12_000;

function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { cache: "no-store", signal: ctrl.signal }).finally(() => clearTimeout(id));
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) return null;
    try {
      return await response.json();
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/** Canonical: GET /api/v1/content/:pageId */
export async function fetchPublishedByContentEndpoint(
  apiBaseUrl: string,
  pageId: string
): Promise<PublishedContentRecord | null> {
  const payload = await fetchJson(`${apiBaseUrl}/api/v1/content/${pageId}`);
  return extractRecord(payload, pageId);
}

/** Fallback: GET /api/v1/pages/:pageId */
export async function fetchPublishedByPagesEndpoint(
  apiBaseUrl: string,
  pageId: string
): Promise<PublishedContentRecord | null> {
  const payload = await fetchJson(`${apiBaseUrl}/api/v1/pages/${pageId}`);
  return extractRecord(payload, pageId);
}

/**
 * Tries Nestino content API first, then pages API (checklist contract).
 * Does not use unverified slug query parameters.
 */
export async function fetchPublishedPageRecord(
  apiBaseUrl: string,
  pageId: string
): Promise<PublishedContentRecord | null> {
  const fromContent = await fetchPublishedByContentEndpoint(apiBaseUrl, pageId);
  if (fromContent) return fromContent;
  return fetchPublishedByPagesEndpoint(apiBaseUrl, pageId);
}

/**
 * Self-healing fallback for public routes when the publish webhook/store missed an event.
 * Nestino currently supports slug lookup on /api/v1/pages.
 */
export async function fetchPublishedBySlug(
  apiBaseUrl: string,
  siteId: string,
  slug: string,
  language: SupportedPublishedLang
): Promise<PublishedContentRecord | null> {
  const normalized = normalizeSlug(slug);
  const upper = language.toUpperCase();
  const params = new URLSearchParams({
    slug: normalized,
    siteId,
    language: upper,
  });

  const withoutSlash = await fetchJson(`${apiBaseUrl}/api/v1/pages?${params.toString()}`);
  const first = extractRecord(withoutSlash);
  if (first) return first;

  params.set("slug", `/${normalized}`);
  const withSlash = await fetchJson(`${apiBaseUrl}/api/v1/pages?${params.toString()}`);
  return extractRecord(withSlash);
}
