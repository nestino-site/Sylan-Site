# Nestino Operator Console — Product Requirements (PRD)

## Purpose

Internal **control plane** for Nestino operators to onboard villas, run/review the engine, approve content, track trials/subscriptions, and produce **owner-facing proof**.

## Users

- **Admin** — full access, billing, destructive actions  
- **Editor** — content review, tasks, job triggers (no billing)

1–5 seats at MVP.

## Auth

- **Clerk** with organization membership  
- Roles: `admin`, `editor`

## Core workflows

### OW1 — Onboard a new villa

**Goal:** Create tenant + site + languages + CMS key + trigger first crawl.

**AC**

- Form captures: name, slug, destination, property URL, owner contacts, default language, tier overrides (optional).  
- **Optional at create:** `gsc_site_url`, `gsc_verification_token` (can be filled later on tenant **Site** tab — required for `PerformanceSyncJob` once reporting is expected).  
- **Optional at create; recommended before first engine content:** **Brand** fields on tenant — `host_voice_notes`, `writing_style`, `guest_review_snippets`, `brand_avoid_words` (see [data-model](../00-system/data-model.md) `tenants`). Editable anytime on tenant **Brand** tab; feeds `ContentHumanizerJob`.  
- On submit: DB rows created + `CrawlSiteJob` enqueued + CMS key shown once.  
- Slug uniqueness validated.

---

### OW2 — Review engine content

**Goal:** Approve or reject `content_versions` in `pending_review`.

**AC**

- Queue lists items with filters (tenant, lang, type).  
- Diff view: **previous published** (`is_current = true` + `status = published`) vs **new draft** when a prior published version exists.  
- If **no** prior published version exists (e.g. first page in a language), show **full content** preview labeled **“New page”** (not a diff).  
- Approve → status `approved` via **direct DB update** (MVP; see [api-contracts B6](../00-system/api-contracts.md)); Reject → `draft` + reason note.  
- Optional: inline edit (future).

---

### OW3 — Monitor jobs

**Goal:** See `engine_jobs` statuses and errors; retry dead jobs.

**AC**

- Table per tenant: type, status, timestamps, attempt count.  
- “Retry” enqueues new job with new id or same idempotency policy (documented).  
- Error message visible (truncated + expandable).

---

### OW4 — Issues & tasks

**Goal:** Triage `engine_issues`, convert to `engine_tasks`, assign owners.

**AC**

- Filters: severity, auto_fixable, status.  
- Mark resolved / ignored with reason.  
- Assign due dates.

---

### OW5 — Performance dashboard

**Goal:** Show “proof of movement” for owners.

**AC**

- Charts/tables: impressions/clicks (GSC), inquiries by language, GEO appeared % (weekly).  
- Export CSV or PDF (optional MVP: CSV only).

---

### OW6 — Trial → paid

**Goal:** Convert trial to Stripe subscription.

**AC**

- Trial countdown visible.  
- Button creates Stripe Checkout Session or Customer Portal link.  
- On webhook, `subscriptions` + `tenants.status` updated.

---

### OW7 — Owner reporting

**Goal:** Send summary to owner email/WhatsApp template.

**AC**

- Generate text summary from last 30 days metrics.  
- Copy-to-clipboard + mailto link (MVP acceptable).

---

### OW8 — Rotate CMS API key

**Goal:** Replace a compromised or leaked villa CMS API key without breaking engine → villa publish calls.

**AC**

- **Admin** only.  
- Action: generate new raw key → update `sites.cms_api_key_hash`, `sites.cms_api_key_prefix`, and `site_cms_credentials.key_ciphertext` (+ bump `key_version`) in **one transaction**.  
- Show full new key **once** (copy UI); engine uses decryptable credential on next job.  
- Log actor + `tenant_id` (no key in logs).

## Non-goals (MVP)

- Villa-owner login / self-serve  
- Full CRM replacement  
- Chat support inbox

## Dependencies

- [../00-system/data-model.md](../00-system/data-model.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)  
- [../02-engine/jobs-spec.md](../02-engine/jobs-spec.md)  
- [design-spec.md](./design-spec.md) — layout, content review UX, Shadcn mapping
