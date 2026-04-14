# Nestino Landing — Technical Specification

## Stack

- **Next.js 15** App Router + **TypeScript** + **Tailwind CSS**  
- **Vercel** hosting  
- **Drizzle** + shared `packages/db` for DB access (server-only)

## Data & APIs

### Trial activation

- Route: `POST /api/trials/activate` — contract in [../00-system/api-contracts.md](../00-system/api-contracts.md).  
- Implementation: server action or Route Handler; **Zod** validate body.  
- **Rate limit:** per IP + per email hash (Upstash Redis or Vercel KV).  
- **Transaction:** create `tenants`, `sites`, `trials`, default `site_languages`. Generate CMS API key; store **hash + prefix** on `sites` only (**no** `site_cms_credentials` from landing — no `CREDENTIALS_ENCRYPTION_KEY` on Vercel).  
- After commit: enqueue `CrawlSiteJob` with **`cms_api_key_plaintext`** in the job payload (or equivalent secure handoff: e.g. Redis once + job id). The **engine** encrypts and writes `site_cms_credentials`, then redacts the plaintext from persisted job payload/logs. See [api-contracts C1](../00-system/api-contracts.md) side effects.

### Demo page

- File: `app/demo/[slug]/page.tsx`  
- Resolve slug → `sites.subdomain` join `tenants`  
- Pass `demoUrl` to client iframe component  
- `notFound()` if missing

### Lead-only form (optional path)

If MVP collects leads **without** full trial provisioning, still store `tenants` as `prospect` status — align with PRD (prefer full trial path).

## Forms & email

- **Resend** transactional email to internal team + optional owner confirmation.  
- Webhook to CRM (Slack, Airtable, HubSpot) via `CRM_WEBHOOK_URL` secret.

## Analytics

- **Vercel Analytics** enabled  
- **PostHog** client events (see design-spec event names)

## SEO & AI discovery

- Metadata API: title/description/OG image for `/`  
- `app/robots.ts` allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)  
- JSON-LD: `Organization`, `WebSite`, `FAQPage` on `/`

## Performance budgets

- **LCP** < 2.5s on 4G Fast (Vercel Speed Insights)  
- **CLS** < 0.1  
- Image: `next/image`, priority only for above-fold hero

## Security

- CSP headers (strict enough for Vercel + PostHog)  
- No secrets in client bundle  
- Honeypot field on form

## i18n (optional phase 1.1)

- `en` default; `id` copy via `next-intl` if needed — out of MVP unless requested

## Deployment

- Production branch `main` → auto deploy  
- Preview deployments for PRs

## Related

- [PRD.md](./PRD.md)  
- [design-spec.md](./design-spec.md)  
- [../00-system/architecture.md](../00-system/architecture.md)
