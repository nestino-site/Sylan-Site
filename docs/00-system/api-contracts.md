# Nestino — API Contracts (Cross-System)

All subsystems **must** conform to these contracts. Version changes require updating this file and coordinated releases.

**Global headers**

- `Content-Type: application/json`
- Correlation: optional `X-Request-Id` (UUID); echo in logs

**Error shape (all JSON APIs)**

```json
{
  "error": {
    "code": "string_machine_code",
    "message": "Human-readable message",
    "details": {}
  }
}
```

Common codes: `unauthorized`, `forbidden`, `not_found`, `validation_error`, `conflict`, `rate_limited`, `internal_error`.

---

## A. Engine → Villa site (CMS API)

**Base URL:** `https://{subdomain}.nestino.com` or `https://{custom_domain}`  
**Auth:** `Authorization: Bearer <CMS_API_KEY>` (plaintext key; rotate periodically)  
**Scope:** Server-to-server only.

**Credential storage (critical):**

- The **villa app** verifies the bearer token against `sites.cms_api_key_hash` (see [data-model.md](./data-model.md)).  
- The **engine** loads the plaintext key from `site_cms_credentials.key_ciphertext` (decrypt at runtime) — hashing alone is not enough for outbound calls.

### A1. `POST /api/cms/pages`

Creates a new `content_pages` row and optional initial `content_versions` draft.

**Request**

```json
{
  "slug": "guides/best-time-canggu",
  "page_type": "guide",
  "initial_version": {
    "language_code": "en",
    "title": "Best time to visit Canggu for a quiet luxury stay",
    "body_json": { "version": 1, "blocks": [] },
    "meta_title": "…",
    "meta_description": "…",
    "schema_json": {},
    "status": "draft",
    "source": "engine"
  }
}
```

**Response `201`**

```json
{
  "page": {
    "id": "uuid",
    "site_id": "uuid",
    "slug": "guides/best-time-canggu",
    "page_type": "guide",
    "status": "active"
  },
  "version": {
    "id": "uuid",
    "page_id": "uuid",
    "language_code": "en",
    "version": 1,
    "status": "draft"
  }
}
```

---

### A2. `PUT /api/cms/pages/:pageId`

Updates **draft or pending_review** content for a given language (bumps `version`).

**Request**

```json
{
  "language_code": "en",
  "title": "…",
  "body_json": { "version": 1, "blocks": [] },
  "meta_title": "…",
  "meta_description": "…",
  "schema_json": {},
  "status": "draft",
  "source": "engine"
}
```

**Response `200`**

```json
{
  "version": {
    "id": "uuid",
    "page_id": "uuid",
    "language_code": "en",
    "version": 2,
    "status": "draft"
  }
}
```

**Rules**

- If latest version is `published`, new row must be created with `status` `draft` or `pending_review` (implementation detail: always append version).

---

### A3. `POST /api/cms/pages/:pageId/publish`

Publishes a specific `version` number for a language.

**Request**

```json
{
  "language_code": "en",
  "version": 2
}
```

**Response `200`**

```json
{
  "published": {
    "page_id": "uuid",
    "language_code": "en",
    "version": 2,
    "published_at": "2026-04-08T12:00:00.000Z"
  }
}
```

**Rules**

- Only allowed if version `status` is `approved` **or** request includes internal override header `X-Nestino-Override: operator` (console-only; optional MVP).
- MVP default: **only `approved`** versions publish (see engine-integration).  
- On success, set **`is_current`** atomically: prior row with `is_current = true` for this `(page_id, language_code)` → `false`; published row → `true` (see [data-model](./data-model.md) `content_versions`).

---

### A4. `POST /api/cms/languages`

Registers or updates `site_languages` for hreflang and routing.

**Request**

```json
{
  "languages": [
    { "language_code": "en", "tier": 1, "status": "active" },
    { "language_code": "zh-Hans", "tier": 1, "status": "active" }
  ]
}
```

**Response `200`**

```json
{ "updated": 2 }
```

---

### A5. `PUT /api/cms/robots`

Sets robots.txt body template for tenant. **Storage:** join `lines` with `\n` and persist on **`sites.robots_template`** (nullable `text`). `app/robots.ts` reads `sites.robots_template` when set; otherwise uses the default template (allow AI crawlers per PRD).

**Request**

```json
{
  "lines": [
    "User-agent: *",
    "Allow: /",
    "User-agent: GPTBot",
    "Allow: /"
  ]
}
```

**Response `200`**: `{ "ok": true }`

---

### A6. `POST /api/cms/revalidate`

Triggers Next.js revalidation for paths (implementation-specific).

**Request**

```json
{
  "paths": ["/en/guides/best-time-canggu", "/zh-Hans/guides/best-time-canggu"]
}
```

**Response `200`**: `{ "revalidated": true, "paths": ["…"] }`

---

### A6b. `POST /api/cms/sitemap` (alias)

**Purpose:** Same as triggering sitemap regeneration / cache bust for dynamic `sitemap.ts` (maps to the original plan’s “sitemap refresh” without storing static files).

**Request**

```json
{
  "revalidate_tags": ["sitemap", "tenant:{site_id}"]
}
```

or empty body `{}` if implementation always invalidates the whole tenant sitemap.

**Response `200`**: `{ "ok": true }`

**Note:** May be implemented as an internal call to `revalidateTag('sitemap')` + optional path `/sitemap.xml` in **A6**.

---

### A7. `PUT /api/cms/pages/:pageId/rollback`

Creates a **new** content version from a prior `version` (does not delete history).

**Request**

```json
{
  "language_code": "en",
  "to_version": 3,
  "source": "human"
}
```

**Response `200`**

```json
{
  "version": {
    "id": "uuid",
    "page_id": "uuid",
    "language_code": "en",
    "version": 7,
    "status": "draft"
  }
}
```

---

## B. Engine internal API (FastAPI)

**Base URL:** `https://engine.nestino.internal` (env-specific)  
**Auth:** `Authorization: Bearer <ENGINE_INTERNAL_TOKEN>`

### B1. `POST /jobs/trigger`

**Request**

```json
{
  "tenant_id": "uuid",
  "job_type": "CrawlSiteJob",
  "triggered_by": "manual",
  "priority": "high",
  "idempotency_key": "optional-string",
  "payload": {}
}
```

**Response `202`**

```json
{
  "job": {
    "id": "uuid",
    "status": "pending"
  }
}
```

---

### B2. `GET /jobs/:jobId`

**Response `200`**

```json
{
  "job": {
    "id": "uuid",
    "tenant_id": "uuid",
    "job_type": "CrawlSiteJob",
    "status": "complete",
    "attempt_count": 1,
    "last_error": null,
    "started_at": "…",
    "completed_at": "…"
  }
}
```

---

### B3. `GET /tenants/:tenantId/issues`

Query params: `status=open&severity=high`

**Response `200`**

```json
{
  "issues": [
    {
      "id": "uuid",
      "page_id": "uuid",
      "issue_type": "missing_schema",
      "severity": "high",
      "auto_fixable": true,
      "status": "open",
      "detail_json": {}
    }
  ]
}
```

---

### B4. `GET /tenants/:tenantId/tasks`

**Response `200`**: `{ "tasks": [ … ] }`

---

### B5. `POST /tenants/:tenantId/tasks/:taskId/complete`

**Request:** `{ "note": "optional" }`  
**Response `200`**: `{ "ok": true }`

---

### B6. `POST /content-versions/:versionId/transition`

**MVP decision:** The operator console **approves/rejects via direct Drizzle** updates (`content_versions.status`, `approved_by_user_id`, etc.) using the service role in Server Actions. **Do not** call B6 from the console in MVP — avoids double-writes and keeps the engine focused on jobs.

B6 remains in the contract for future use (e.g. engine-driven workflows or external tools); scaffold the route in FastAPI if desired, but **wire console UI to DB only** until explicitly changed.

**Request**

```json
{
  "to_status": "approved",
  "actor_user_id": "uuid"
}
```

**Response `200`**: `{ "version": { "id": "…", "status": "approved" } }`

---

## C. Landing — trial activation

Implemented on `apps/landing` (same DB as system).

### C1. `POST /api/trials/activate`

**Auth:** public + rate limit + optional honeypot field.

**Request**

```json
{
  "email": "owner@example.com",
  "property_name": "Villa Example",
  "property_url": "https://old-site.com",
  "destination": "bali",
  "whatsapp_e164": "+6281234567890"
}
```

**Response `201`**

```json
{
  "tenant_id": "uuid",
  "site_id": "uuid",
  "subdomain": "villa-example",
  "trial_ends_at": "2026-05-08T12:00:00.000Z",
  "demo_url": "https://villa-example.nestino.com/en"
}
```

**Side effects (transactional)**

1. Insert `tenants`, `sites`, `trials`, default `site_languages` per [multilingual-spec](../02-engine/multilingual-spec.md).  
2. Generate CMS API key (raw secret); store **hash + prefix** on `sites` only. **Do not** write `site_cms_credentials` from the landing app (avoids sharing `CREDENTIALS_ENCRYPTION_KEY` with Vercel).  
3. Enqueue `CrawlSiteJob` (via Engine API or insert `engine_jobs` + worker pickup) with payload field **`cms_api_key_plaintext`** (ephemeral; **never** log or persist in `engine_jobs.payload_json` after the worker consumes it — strip or redact after encrypting).

**CMS key handoff:** The first worker that handles onboarding encrypts the plaintext with `CREDENTIALS_ENCRYPTION_KEY` (AES-256-GCM), upserts `site_cms_credentials`, then clears the plaintext from memory. If the job fails before encrypting, retry must include a **new** key generation path or operator re-issue — see **CMS key handoff failure recovery** below.

### CMS key handoff failure recovery

Canonical operator recovery: **OW8 — Rotate CMS API key** in the operator console ([console PRD](../04-operator-console/PRD.md) OW8): generate new raw key → update `sites.cms_api_key_hash`, `sites.cms_api_key_prefix`, and `site_cms_credentials.key_ciphertext` (+ bump `key_version`) in **one transaction**; show full key once.

| Scenario | State | Recovery |
|----------|--------|----------|
| **A — Fail before encrypt** | No row in `site_cms_credentials`; `cms_api_key_plaintext` may be absent from retried job payload | Operator runs **OW8** (or re-onboard key path): new key + enqueue `CrawlSiteJob` **without** relying on stale plaintext. If console OW1 path: same as tech-spec — enqueue crawl with fresh `cms_api_key_plaintext` once. |
| **B — Encrypted but payload not redacted** | Row exists in `site_cms_credentials`; `engine_jobs.payload_json` may still contain plaintext (should not happen after fix) | **Idempotent:** next `CrawlSiteJob` run must **skip** encrypt if credential row exists; **redact** any remaining plaintext fields in `payload_json` and logs. |
| **C — Key mismatch** | Villa CMS returns **401** on engine → CMS calls; hash on `sites` does not match decrypted key, or ciphertext corrupt | Operator **OW8** rotation. Engine: on 401 from CMS after retry, create `engine_tasks` titled **“CMS key mismatch — rotate via console (OW8)”** linked to tenant. |

**Detection & visibility**

- On every `CrawlSiteJob` completion, write `engine_job_results` (or extend crawl payload) with **`cms_key_handoff_status`**: `encrypted_ok` \| `skipped_already_present` \| `failed_no_plaintext` \| `failed_encrypt`.
- Console **OW3** (job monitor): show a **warning** on tenant/site when `sites.status` is not `draft` and **no** `site_cms_credentials` row exists for that `site_id` — engine cannot publish until OW8 or successful handoff.

---

## D. Operator console → Engine

All use **B** section + these convenience wrappers (optional; can be UI-only calling B1):

| UI action | Call |
|-----------|------|
| Re-run crawl | `POST /jobs/trigger` `CrawlSiteJob` |
| Run keyword discovery | `KeywordDiscoveryJob` |
| Run GEO monitoring | `GEOMonitoringJob` |
| Recompute destination insights | `DestinationInsightsSyncJob` |
| Publish approved content | Engine calls villa **A3** (not console) |

---

## E. Villa site — public inquiry API

**`POST /api/inquiries`** (no CMS key; CORS restricted to same origin)

**Request**

```json
{
  "language_code": "en",
  "name": "Jane",
  "email": "jane@example.com",
  "phone": "+1…",
  "message": "…",
  "metadata_json": { "page_path": "/en/contact" }
}
```

**Response `201`**: `{ "id": "uuid" }`

---

## Related

- [data-model.md](./data-model.md)  
- [../03-villa-sites/engine-integration.md](../03-villa-sites/engine-integration.md)  
- [../02-engine/jobs-spec.md](../02-engine/jobs-spec.md) — `CrawlSiteJob` + CMS key handoff recovery (cross-links §C1)
