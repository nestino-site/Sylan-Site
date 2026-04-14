# Nestino Operator Console — Technical Specification

## Stack

- **Next.js 15** App Router + **TypeScript** + **Tailwind** + **Shadcn UI**  
- **Clerk** (`@clerk/nextjs`) for auth  
- **Vercel** deploy  
- **Drizzle** + Supabase Postgres (service role **server-only**)

## Auth middleware

- `middleware.ts` protects **all authenticated app routes** under `/app/**`. Public `/` may redirect signed-in users to `/app` or show marketing — **do not** leave KPI/dashboard routes at `/` unprotected.  
- **Clerk webhook → `users` table is required** for MVP: on `user.created` / membership events, upsert `users` (`clerk_user_id`, `email`, `role`). Without this, role checks have no backing row.  
- If `clerk_user_id` is **not** found in `users`, return **403** with message: *Account not provisioned; contact admin.*  
- Role check: `admin` vs `editor` via DB lookup (or Clerk `publicMetadata` mirrored into `users.role` on webhook).

## Data access pattern

- **Server Components** fetch lists via Drizzle.  
- **Mutations** via Server Actions or Route Handlers **with** Zod validation.  
- Never expose service role to browser.

**OW1 / manual onboarding:** When the console creates `sites` (not via landing trial), use the **same CMS key handoff** as [api-contracts C1](../00-system/api-contracts.md): store hash+prefix on `sites`, enqueue `CrawlSiteJob` with `cms_api_key_plaintext` (or equivalent), engine encrypts into `site_cms_credentials`.

## Engine communication

- Use `ENGINE_INTERNAL_URL` + `ENGINE_INTERNAL_TOKEN`.  
- Wrap in `lib/engine-client.ts` with typed methods: `triggerJob`, `getJob`. Content approve/reject uses **Drizzle on `content_versions`** in MVP (see [api-contracts B6](../00-system/api-contracts.md)); do not call a `transitionContentVersion` API until explicitly wired.

## Key screens

| Path | Purpose |
|------|---------|
| `/app` | KPI snapshot + shortcuts |
| `/app/tenants` | List/search tenants |
| `/app/tenants/new` | OW1 onboarding form |
| `/app/tenants/[id]` | Tenant detail tabs: Overview, **Brand** (`host_voice_notes`, `writing_style`, `guest_review_snippets`, `brand_avoid_words`), Site (incl. `gsc_site_url`, `gsc_verification_token`, OW8 key rotation for admin), **Media** (image upload → `site_images` + processing per [image-pipeline-spec](../03-villa-sites/image-pipeline-spec.md)), Languages, Jobs, Content, Issues, Performance |
| `/app/content-review` | Global queue OW2 |
| `/app/jobs` | Cross-tenant job explorer |
| `/app/trials` | OW6 trial list |

## Content review UI

- Query `content_versions` where `status = 'pending_review'` join `content_pages` + `sites` + `tenants`.  
- Render `body_json.blocks` with a shared **`BlockRenderer`** (portable block schema in [engine-integration.md](../03-villa-sites/engine-integration.md)); do not assume markdown.  
- Actions: **Server Action** updates `content_versions` (approve/reject) via Drizzle; optional separate control to enqueue **`ContentPublishJob`** via engine (if auto-publish on approve is enabled).

**Recommended:** Approving does **not** auto-publish until operator clicks “Publish live” (two-step) — configurable; document in UI help text.

## Job management UI

- Query `engine_jobs` order by `created_at desc` limit 200.  
- Retry = `POST /jobs/trigger` with same payload + new idempotency key.

## Issue tracker

- CRUD on `engine_issues` + `engine_tasks`  
- Use Shadcn `DataTable` with filters.

## Performance dashboard

- Read latest `engine_job_results` where `result_type = gsc_snapshot`  
- Read `inquiries` counts grouped by week + `language_code`  
- Read `geo_snapshots` aggregated appeared rate

## Stripe

- Use Stripe Checkout for new subscriptions  
- Webhook route `/api/webhooks/stripe` updates `subscriptions` + `trials.converted_at`

## Observability

- Log important mutations with `tenant_id` + actor Clerk id

## Related

- [PRD.md](./PRD.md)  
- [design-spec.md](./design-spec.md)  
- [../00-system/architecture.md](../00-system/architecture.md)  
- [../02-engine/architecture.md](../02-engine/architecture.md)  
- [../03-villa-sites/image-pipeline-spec.md](../03-villa-sites/image-pipeline-spec.md)
