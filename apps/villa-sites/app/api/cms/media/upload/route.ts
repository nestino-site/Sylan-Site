import { createHash } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, siteImages } from "@nestino/db";
import { requireCloudinaryServerConfig } from "../../../../../lib/cloudinary";

const UploadSchema = z.object({
  siteId: z.string().uuid(),
  role: z.enum(["hero", "gallery", "room", "og", "other"]),
  sourceUrl: z.string().url(),
  altText: z.string().min(1).max(500).optional(),
  siteSlug: z.string().min(1).max(100).optional(),
});

function getCmsToken(request: NextRequest): string {
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader.replace("Bearer ", "").trim();
}

function toStorageKey(publicId: string, format?: string) {
  return format ? `${publicId}.${format}` : publicId;
}

function deterministicPublicId(siteId: string, role: string, sourceUrl: string) {
  const digest = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 10);
  return `sites/${siteId}/${role}/${digest}`;
}

// Auth note:
// This matches the current MVP level from revalidate route (token presence check).
// Replace with cms_api_key_hash verification against DB before production hardening.
export async function POST(request: NextRequest) {
  const token = getCmsToken(request);
  if (!token) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Missing auth token" } },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Body must be valid JSON" } },
      { status: 400 }
    );
  }

  const parsed = UploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Invalid body", issues: parsed.error.issues } },
      { status: 400 }
    );
  }

  const { siteId, role, sourceUrl, altText, siteSlug } = parsed.data;

  try {
    const cloudinary = requireCloudinaryServerConfig();
    const publicId = deterministicPublicId(siteId, role, sourceUrl);
    const upload = await cloudinary.uploader.upload(sourceUrl, {
      resource_type: "image",
      public_id: publicId,
      overwrite: false,
      use_filename: false,
      unique_filename: false,
      folder: `sites/${siteSlug ?? siteId}/${role}`,
    });

    const db = getDb();
    const [created] = await db
      .insert(siteImages)
      .values({
        siteId,
        role,
        storageKeyOriginal: toStorageKey(upload.public_id, upload.format),
        publicUrlPrimary: upload.secure_url,
        variantsJson: {
          "400w_webp": cloudinary.url(upload.public_id, {
            secure: true,
            transformation: [{ width: 400, crop: "limit", fetch_format: "webp", quality: "auto" }],
          }),
          "800w_webp": cloudinary.url(upload.public_id, {
            secure: true,
            transformation: [{ width: 800, crop: "limit", fetch_format: "webp", quality: "auto" }],
          }),
          "1200w_webp": cloudinary.url(upload.public_id, {
            secure: true,
            transformation: [{ width: 1200, crop: "limit", fetch_format: "webp", quality: "auto" }],
          }),
          "2400w_webp": cloudinary.url(upload.public_id, {
            secure: true,
            transformation: [{ width: 2400, crop: "limit", fetch_format: "webp", quality: "auto" }],
          }),
        },
        altText: altText ?? "",
        width: upload.width,
        height: upload.height,
        dominantColorHex: upload.colors?.[0]?.[0] ?? null,
      })
      .returning({
        id: siteImages.id,
        role: siteImages.role,
        publicUrlPrimary: siteImages.publicUrlPrimary,
      });

    return NextResponse.json(
      {
        ok: true,
        image: created,
        cloudinary: {
          publicId: upload.public_id,
          secureUrl: upload.secure_url,
          width: upload.width,
          height: upload.height,
          format: upload.format,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "upload_failed",
          message: error instanceof Error ? error.message : "Unknown upload error",
        },
      },
      { status: 500 }
    );
  }
}
