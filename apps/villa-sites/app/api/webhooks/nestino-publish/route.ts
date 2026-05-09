import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeSlug } from "@/lib/nestino-published-content";

export const runtime = "nodejs";

const MAX_SKEW_MS = 5 * 60 * 1000;
const IDEMPOTENCY_TTL_MS = 60 * 60 * 1000;

const PublishPayloadSchema = z.object({
  pageId: z.string().min(1),
  slug: z.string().min(1),
  siteId: z.string().min(1),
  event: z.enum(["page.published", "page.updated"]),
  timestamp: z.number().int().positive(),
});

type PublishPayload = z.infer<typeof PublishPayloadSchema>;

const inMemoryDedupe = new Map<string, number>();

function jsonError(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function getRequiredEnv() {
  const publishSecret = process.env.NESTINO_PUBLISH_SECRET;
  const siteId = process.env.NESTINO_SITE_ID;

  if (!publishSecret || !siteId) return null;
  return { publishSecret, siteId };
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

function claimIdempotencyKey(key: string): boolean {
  const now = Date.now();
  for (const [existingKey, expiresAt] of inMemoryDedupe.entries()) {
    if (expiresAt <= now) inMemoryDedupe.delete(existingKey);
  }

  if (inMemoryDedupe.has(key)) return false;

  inMemoryDedupe.set(key, now + IDEMPOTENCY_TTL_MS);
  return true;
}

function revalidateForSlug(slug: string, language: string | null) {
  revalidateTag("content");
  if (!slug) return;

  if (language) {
    revalidatePath(`/${language}/${slug}`);
  }
  revalidatePath(`/en/${slug}`);
  revalidatePath(`/ar/${slug}`);
  revalidatePath(`/${slug}`);
}

export async function POST(request: Request) {
  const env = getRequiredEnv();
  if (!env) {
    console.error("[nestino-publish-webhook] missing required env vars");
    return jsonError(
      "misconfigured",
      "Missing NESTINO_PUBLISH_SECRET or NESTINO_SITE_ID",
      503
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-publish-signature");
  const timestampHeader = request.headers.get("x-publish-timestamp");

  if (!verifySignature(rawBody, signature, env.publishSecret)) {
    console.warn("[nestino-publish-webhook] invalid signature");
    return jsonError("invalid_signature", "X-Publish-Signature does not match HMAC of raw body", 401);
  }

  if (!isTimestampFresh(timestampHeader)) {
    console.warn("[nestino-publish-webhook] stale timestamp", { timestampHeader });
    return jsonError("stale_timestamp", "X-Publish-Timestamp is missing or outside allowed skew window", 401);
  }

  let parsedPayload: PublishPayload;
  try {
    parsedPayload = PublishPayloadSchema.parse(JSON.parse(rawBody));
  } catch {
    return jsonError("invalid_payload", "Body must be valid JSON matching the publish webhook schema", 400);
  }

  if (parsedPayload.siteId !== env.siteId) {
    console.warn("[nestino-publish-webhook] forbidden site", {
      event: parsedPayload.event,
      pageId: parsedPayload.pageId,
      slug: parsedPayload.slug,
      siteId: parsedPayload.siteId,
    });
    return jsonError("forbidden_site", "payload.siteId does not match NESTINO_SITE_ID", 403);
  }

  const dedupeKey = [
    "nestino-publish",
    parsedPayload.event,
    parsedPayload.pageId,
    parsedPayload.timestamp,
  ].join(":");
  const claimed = claimIdempotencyKey(dedupeKey);

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
  revalidateForSlug(slug, null);

  console.info("[nestino-publish-webhook] revalidated", {
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    result: "ok",
  });

  return NextResponse.json({
    ok: true,
    event: parsedPayload.event,
    pageId: parsedPayload.pageId,
    slug,
    revalidated: true,
  });
}
