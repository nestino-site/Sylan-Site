import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_SKEW_MS = 5 * 60 * 1000;
const IDEMPOTENCY_TTL_SECONDS = 60 * 60;

const PublishPayloadSchema = z.object({
  pageId: z.string().min(1),
  slug: z.string().min(1),
  siteId: z.string().min(1),
  event: z.enum(["page.published", "page.updated"]),
  timestamp: z.number().int().positive(),
});

type PublishPayload = z.infer<typeof PublishPayloadSchema>;

let redisClient: Redis | null | undefined;
const inMemoryDedupe = new Map<string, number>();

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

function getRequiredEnv() {
  const publishSecret = process.env.NESTINO_PUBLISH_SECRET;
  const siteId = process.env.NESTINO_SITE_ID;
  const apiBaseUrl = process.env.NESTINO_API_BASE_URL;

  if (!publishSecret || !siteId || !apiBaseUrl) return null;
  return { publishSecret, siteId, apiBaseUrl: apiBaseUrl.replace(/\/$/, "") };
}

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;

  const receivedHex = signatureHeader.slice("sha256=".length);
  if (!/^[0-9a-fA-F]+$/.test(receivedHex)) return false;

  const received = Buffer.from(receivedHex, "hex");
  const expectedHex = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expected = Buffer.from(expectedHex, "hex");

  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

function isTimestampFresh(tsHeader: string | null): boolean {
  const ts = Number(tsHeader ?? 0);
  if (!ts || !Number.isFinite(ts)) return false;
  return Math.abs(Date.now() - ts) <= MAX_SKEW_MS;
}

function normalizeSlug(slug: string): string {
  const cleaned = slug.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  return cleaned || "";
}

async function claimIdempotencyKey(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (redis) {
    const result = await redis.set(key, "1", {
      nx: true,
      ex: IDEMPOTENCY_TTL_SECONDS,
    });
    return result === "OK";
  }

  const now = Date.now();
  for (const [existingKey, expiresAt] of inMemoryDedupe.entries()) {
    if (expiresAt <= now) inMemoryDedupe.delete(existingKey);
  }

  if (inMemoryDedupe.has(key)) return false;

  inMemoryDedupe.set(key, now + IDEMPOTENCY_TTL_SECONDS * 1000);
  return true;
}

async function fetchPublishedContent(apiBaseUrl: string, pageId: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/content/${pageId}`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    return response.ok;
  } finally {
    clearTimeout(timeout);
  }
}

function revalidateForSlug(slug: string) {
  revalidateTag("content");
  if (!slug) return;

  revalidatePath(`/${slug}`);
  revalidatePath(`/en/${slug}`);
  revalidatePath(`/tr/${slug}`);
  revalidatePath(`/ar/${slug}`);
  revalidatePath(`/ru/${slug}`);
}

export async function POST(request: Request) {
  const env = getRequiredEnv();
  if (!env) {
    console.error("[nestino-publish-webhook] missing required env vars");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-publish-signature");
  const timestampHeader = request.headers.get("x-publish-timestamp");

  if (!verifySignature(rawBody, signature, env.publishSecret)) {
    console.warn("[nestino-publish-webhook] invalid signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  if (!isTimestampFresh(timestampHeader)) {
    console.warn("[nestino-publish-webhook] stale timestamp", { timestampHeader });
    return new NextResponse("Stale timestamp", { status: 401 });
  }

  let parsedPayload: PublishPayload;
  try {
    parsedPayload = PublishPayloadSchema.parse(JSON.parse(rawBody));
  } catch {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  if (parsedPayload.siteId !== env.siteId) {
    console.warn("[nestino-publish-webhook] forbidden site", {
      event: parsedPayload.event,
      pageId: parsedPayload.pageId,
      slug: parsedPayload.slug,
      siteId: parsedPayload.siteId,
    });
    return new NextResponse("Forbidden site", { status: 403 });
  }

  const dedupeKey = [
    "nestino-publish",
    parsedPayload.event,
    parsedPayload.pageId,
    parsedPayload.timestamp,
  ].join(":");
  const claimed = await claimIdempotencyKey(dedupeKey);

  if (!claimed) {
    console.info("[nestino-publish-webhook] duplicate ignored", {
      event: parsedPayload.event,
      pageId: parsedPayload.pageId,
      slug: parsedPayload.slug,
      result: "duplicate",
    });
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const slug = normalizeSlug(parsedPayload.slug);
  const contentFetchOk = await fetchPublishedContent(env.apiBaseUrl, parsedPayload.pageId).catch(() => false);
  revalidateForSlug(slug);

  console.info("[nestino-publish-webhook] processed", {
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    contentFetchOk,
    result: "ok",
  });

  return NextResponse.json({
    ok: true,
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    contentFetchOk,
  });
}
