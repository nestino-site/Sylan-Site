import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  fetchPublishedByPageId,
  normalizeSlug,
  upsertPublishedRecord,
} from "@/lib/nestino-published-content";

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

function revalidateForSlug(slug: string, language: string | null) {
  revalidateTag("content");
  if (!slug) return;

  if (language) {
    revalidatePath(`/${language}/${slug}`);
  }
  revalidatePath(`/en/${slug}`); // middleware canonical/fallback
  revalidatePath(`/ar/${slug}`);
  revalidatePath(`/${slug}`); // host rewrite fallback
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
  let contentFetchOk = false;
  let upserted = false;
  let language: string | null = null;

  try {
    const record = await fetchPublishedByPageId(env.apiBaseUrl, parsedPayload.pageId);
    if (record && record.siteId === env.siteId) {
      await upsertPublishedRecord(record);
      language = record.language;
      contentFetchOk = true;
      upserted = true;
    } else if (record && record.siteId !== env.siteId) {
      console.warn("[nestino-publish-webhook] fetched content site mismatch", {
        expectedSiteId: env.siteId,
        fetchedSiteId: record.siteId,
        pageId: parsedPayload.pageId,
      });
    }
  } catch {
    contentFetchOk = false;
  }

  revalidateForSlug(slug, language);

  console.info("[nestino-publish-webhook] processed", {
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    language,
    contentFetchOk,
    upserted,
    result: "ok",
  });

  return NextResponse.json({
    ok: true,
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    language,
    contentFetchOk,
    upserted,
  });
}
