import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  company: z.string().min(2).max(180),
  role: z.string().max(120).optional().or(z.literal("")),
  website: z.string().url().max(240).optional().or(z.literal("")),
  inquiryType: z.enum(["enterprise", "partner", "technology", "investor"]),
  message: z.string().min(20).max(3000),
  companyWebsite: z.string().max(0).optional().or(z.literal("")),
});

type ContactPayload = z.infer<typeof contactSchema>;

function jsonError(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

function formatInquiry(payload: ContactPayload) {
  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company}`,
    `Role: ${payload.role || "Not provided"}`,
    `Website: ${payload.website || "Not provided"}`,
    `Inquiry type: ${payload.inquiryType}`,
    "",
    payload.message,
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_json", "Request body must be valid JSON.", 400);
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("validation_error", "Please check the required fields.", 400);
  }

  const payload = parsed.data;

  if (payload.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Nestino <hello@nestino.com>";
  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
  const formattedInquiry = formatInquiry(payload);

  try {
    if (resendKey && toEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: payload.email,
        subject: `Nestino ${payload.inquiryType} inquiry from ${payload.company}`,
        text: formattedInquiry,
      });
    }

    if (crmWebhookUrl) {
      await fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "nestino_landing",
          inquiryType: payload.inquiryType,
          name: payload.name,
          email: payload.email,
          company: payload.company,
          role: payload.role || null,
          website: payload.website || null,
          message: payload.message,
        }),
      });
    }
  } catch {
    return jsonError(
      "delivery_error",
      "The inquiry was valid, but delivery failed. Please try again shortly.",
      502,
    );
  }

  return NextResponse.json({ ok: true });
}
