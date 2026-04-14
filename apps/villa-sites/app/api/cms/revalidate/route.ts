import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const RevalidateSchema = z.object({
  paths: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// CMS revalidation endpoint — called by the engine after publishing content.
// Auth: Authorization: Bearer <CMS_API_KEY> verified against sites.cms_api_key_hash.
// See docs/00-system/api-contracts.md §A6
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Missing auth token" } },
      { status: 401 }
    );
  }

  // TODO: Verify token against sites.cms_api_key_hash (bcrypt compare).
  // For MVP, this is a stub that accepts any valid-looking token.
  // Full auth: import bcryptjs and compare against DB hash for the resolved site.

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const parsed = RevalidateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Invalid body" } },
      { status: 400 }
    );
  }

  const { paths = [], tags = [] } = parsed.data;

  for (const path of paths) {
    revalidatePath(path);
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  // Always revalidate content tag so published pages update
  revalidateTag("content");

  return NextResponse.json({ revalidated: true, paths, tags });
}