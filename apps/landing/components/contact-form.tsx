"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactResponse = {
  ok?: boolean;
  error?: {
    code: string;
    message: string;
  };
};

const inquiryTypes = [
  { value: "enterprise", label: "Hotel group or property operator" },
  { value: "partner", label: "Curina lifestyle partner" },
  { value: "technology", label: "Technology or integration partner" },
  { value: "investor", label: "Investor or strategic partner" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialIntent = searchParams.get("intent");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string>("");

  const defaultInquiryType = useMemo(() => {
    if (initialIntent === "partner" || initialIntent === "curina") return "partner";
    if (initialIntent === "technology") return "technology";
    if (initialIntent === "pricing" || initialIntent === "platform") return "enterprise";
    return "enterprise";
  }, [initialIntent]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ContactResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error?.message ?? "Unable to send inquiry.");
      }

      trackEvent("contact_submit", {
        inquiry_type: String(payload.inquiryType ?? "enterprise"),
      });
      setState("success");
      setMessage("Thank you. Nestino will review your inquiry and respond shortly.");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to send inquiry.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="luxury-card grid gap-5 p-6 md:p-8">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company" name="company" required />
        <Field label="Role" name="role" />
      </div>
      <Field label="Website" name="website" type="url" placeholder="https://example.com" />

      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        Inquiry type
        <select
          name="inquiryType"
          defaultValue={defaultInquiryType}
          className="rounded-2xl border border-beige bg-white px-4 py-3 text-base font-normal text-charcoal shadow-sm outline-none transition focus:border-champagne"
        >
          {inquiryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        What should Nestino know?
        <textarea
          name="message"
          required
          rows={6}
          className="rounded-2xl border border-beige bg-white px-4 py-3 text-base font-normal text-charcoal shadow-sm outline-none transition focus:border-champagne"
          placeholder="Tell us about the properties, partner network, or platform conversation you want to explore."
        />
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-ivory shadow-gold transition hover:bg-olive disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {state === "submitting" ? "Sending..." : "Send inquiry"}
      </button>

      {message && (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${
            state === "success"
              ? "bg-olive/10 text-olive"
              : "bg-champagne/15 text-charcoal"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-charcoal">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-2xl border border-beige bg-white px-4 py-3 text-base font-normal text-charcoal shadow-sm outline-none transition focus:border-champagne"
      />
    </label>
  );
}
