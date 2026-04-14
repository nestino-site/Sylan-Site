import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isDatabaseConfigured, inquiries } from "@nestino/db";
import { getSiteBySubdomain } from "@nestino/villa-site/lib/tenant";

const InquirySchema = z.object({
  language_code: z.string().min(2).max(10),
  name: z.string().max(200).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  metadata_json: z
    .object({
      page_path: z.string().optional(),
      villa_preference: z.string().optional(),
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  // Resolve site from request host
  const host = request.headers.get("host") ?? "";
  const referer = request.headers.get("referer");
  const slug =
    request.headers.get("x-nestino-slug") ??
    extractSlugFromSitesPath(referer) ??
    extractSlug(host);

  if (!slug) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Site not found" } },
      { status: 404 }
    );
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation_error", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: { code: "internal_error", message: "Database not configured" } },
      { status: 503 }
    );
  }

  const ctx = await getSiteBySubdomain(slug);
  if (!ctx) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Site not found" } },
      { status: 404 }
    );
  }

  const db = getDb();
  const { language_code, name, email, phone, message, metadata_json } =
    parsed.data;

  const [row] = await db
    .insert(inquiries)
    .values({
      siteId: ctx.site.id,
      languageCode: language_code,
      channel: "form",
      name: name ?? null,
      email: email ?? null,
      phone: phone ?? null,
      message: message ?? null,
      metadataJson: metadata_json ?? null,
    })
    .returning({ id: inquiries.id });

  // Send email notification (non-blocking — fire and forget)
  if (process.env.RESEND_API_KEY && email) {
    void sendNotificationEmail({
      siteName: ctx.tenant.name,
      ownerEmail: ctx.tenant.ownerPhone ?? "",
      name: name ?? "Anonymous",
      email,
      phone: phone ?? "",
      message: message ?? "",
      metadata: metadata_json,
    });
  }

  return NextResponse.json({ id: row?.id }, { status: 201 });
}

function extractSlugFromSitesPath(referer: string | null): string | null {
  if (!referer) return null;
  try {
    const u = new URL(referer);
    const m = u.pathname.match(/^\/sites\/([^/]+)(?:\/|$)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function extractSlug(host: string): string | null {
  const hostname = host.split(":")[0] ?? "";
  const baseDomain = process.env.NEXT_PUBLIC_VILLA_BASE_DOMAIN ?? "nestino.com";
  if (hostname.endsWith(`.${baseDomain}`)) {
    return hostname.slice(0, hostname.length - baseDomain.length - 1) || null;
  }
  return null;
}

async function sendNotificationEmail(data: {
  siteName: string;
  ownerEmail: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "Nestino <notifications@nestino.com>";
  const to = process.env.INTERNAL_NOTIFY_EMAIL ?? "hello@nestino.ai";

  await resend.emails.send({
    from,
    to,
    subject: `New inquiry — ${data.siteName}`,
    text: [
      `New inquiry received for ${data.siteName}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Villa: ${data.metadata?.villa_preference ?? "Any"}`,
      `Message: ${data.message}`,
      `Page: ${data.metadata?.page_path ?? ""}`,
    ].join("\n"),
  });
}