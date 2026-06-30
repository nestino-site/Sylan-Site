# Nestino Enterprise Website - Technical Specification

## Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS
- Framer Motion for client-side storytelling primitives
- Vercel hosting

The corporate website lives in `apps/landing`. It is separate from `apps/villa-sites`, which remains the multi-tenant property/demo app.

## App Structure

```text
apps/landing/
  app/
    page.tsx
    platform/page.tsx
    property-os/page.tsx
    guest-identity/page.tsx
    curina-lifestyle-network/page.tsx
    enterprise-analytics/page.tsx
    technology/page.tsx
    partners/page.tsx
    pricing/page.tsx
    about/page.tsx
    contact/page.tsx
    api/contact/route.ts
    robots.ts
    sitemap.ts
    globals.css
    layout.tsx
  components/
  content/
  lib/
```

## Data And APIs

### Contact Inquiry

- Route: `POST /api/contact`
- Validate with Zod.
- Fields: `name`, `email`, `company`, `inquiryType`, `message`, optional `website`, optional `role`, honeypot field.
- Return typed JSON errors with stable `code` fields.
- Do not log full PII payloads.
- If `RESEND_API_KEY` and contact recipients are configured, send email via Resend.
- If `CRM_WEBHOOK_URL` is configured, forward sanitized inquiry data to the webhook.
- If neither integration is configured, return success for local/dev after validation so the UI can be tested.

### Trial Activation

The old `POST /api/trials/activate` flow remains a separate future path from the prior landing MVP. Do not implement trial provisioning in this enterprise website pass unless the product scope returns to the owner-trial funnel.

## Content Model

- Store website copy in TypeScript content modules under `apps/landing/content`.
- Keep product pillars and navigation data structured so pages can share language consistently.
- Avoid fabricated logos, metrics, and testimonials.

## Motion And Client Boundaries

- Server Components by default.
- Client components only for animation, mobile menu, interactive diagrams, and contact form.
- All motion components must honor `prefers-reduced-motion`.
- Advanced WebGL/Spline/Three.js are deferred unless explicitly approved.

## SEO And AI Discovery

- Metadata API for every page.
- `app/sitemap.ts` for all corporate routes.
- `app/robots.ts` should allow standard crawlers and AI crawlers.
- JSON-LD: `Organization`, `WebSite`, and page-specific structured data where appropriate.
- Use clear entity language around Nestino, Curina, hospitality operating system, guest identity, and autonomous demand engine.

## Analytics

- Vercel Analytics in the root layout.
- Optional PostHog event helper for:
  - `landing_view`
  - `cta_click`
  - `contact_submit`
  - `partner_interest`
  - `pricing_intent`
  - `section_view`
- Analytics must fail silently if PostHog is not configured.

## Security

- CSP headers in `next.config.ts` suitable for Vercel Analytics, optional PostHog, images, and contact submissions.
- No secrets in client bundles.
- Honeypot field on public contact form.
- Use typed error responses.
- Rate limiting can be added with Upstash Redis when production keys are available.

## Performance Budgets

- LCP under 2.5s on fast 4G.
- CLS under 0.1.
- Avoid heavy hero video in the initial implementation.
- Prefer CSS/SVG product visuals.
- Lazy-load below-fold interactive diagrams where appropriate.
- Use `next/image` for licensed imagery once available.

## Accessibility

- Semantic headings and landmarks.
- Keyboard accessible nav and form controls.
- Visible focus states.
- WCAG 2.2 AA contrast target.
- Reduced-motion fallbacks.

## Deployment

- Root scripts:
  - `pnpm dev:landing`
  - `pnpm build:landing`
  - `pnpm lint:landing`
- Production deploys from the `apps/landing` Vercel project.

## Related

- [PRD.md](./PRD.md)
- [design-spec.md](./design-spec.md)
- [../00-system/architecture.md](../00-system/architecture.md)
