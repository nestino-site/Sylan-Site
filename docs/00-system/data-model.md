# Nestino — Shared Data Model (PostgreSQL)

Single logical database (Supabase Postgres). **All apps** and the **engine** use this schema. RLS protects tenant data; **service role** is used only on trusted servers (engine, server routes).

Conventions:

- `id` = `uuid` primary key, `gen_random_uuid()` default unless noted.
- `timestamptz` for all timestamps; store UTC.
- Soft delete avoided at MVP unless column listed.
- JSON columns use `jsonb` with `GIN` index when queried.

---

## Entity list

1. `tenants`  
2. `sites`  
3. `site_languages`  
4. `users`  
5. `content_pages`  
6. `content_versions`  
7. `keywords`  
8. `keyword_opportunities`  
9. `engine_jobs`  
10. `engine_job_results`  
11. `engine_issues`  
12. `engine_tasks`  
13. `geo_snapshots`  
14. `offsite_opportunities`  
15. `subscriptions`  
16. `trials`  
17. `inquiries`  
18. `site_cms_credentials` — **engine-only** decryptable CMS key material (see below)  
19. `destination_insights` — anonymized cross-tenant learning per destination + language (engine-only reads/writes at MVP)  
20. `site_images` — property media catalog (storage paths, alt text, variants)

*(Original plan listed 16 core entities; additional entities support leads, safe CMS automation, destination-level feedback loops, and image pipeline.)*

---

## 1. `tenants`

Villa / property account (commercial entity Nestino serves).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `name` | text NOT NULL | Display / legal short name |
| `slug` | text NOT NULL UNIQUE | URL-safe; used in subdomain `slug.nestino.com` |
| `destination` | text NOT NULL | e.g. `bali`, `phuket`, `tuscany` — drives language tiers |
| `location_label` | text | Human-readable region |
| `adr_min` | numeric(12,2) | Optional; for prioritization |
| `status` | text NOT NULL | `prospect`, `trial`, `active`, `churned`, `paused` |
| `property_url` | text | Legacy / competitor site URL for crawl |
| `owner_email` | text | Primary contact |
| `owner_phone` | text | E.164 preferred |
| `host_voice_notes` | text NULL | Operator notes: how the owner speaks, phrases, story fragments — feeds `ContentHumanizerJob` |
| `writing_style` | text NULL | e.g. `warm minimalist`, `editorial luxury`, `conversational direct` |
| `guest_review_snippets` | jsonb NULL | Array of real guest quote strings; humanizer mirrors guest vocabulary |
| `brand_avoid_words` | jsonb NULL | Array of banned words/phrases (e.g. competitor names) |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | |

**Indexes:** `(status)`, `(destination)`, `(slug)` unique.

**RLS:** Operators (authenticated via Supabase JWT from console) full access; **no** direct client access from villa public site. Engine uses service role.

---

## 2. `sites`

One site per tenant (MVP).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | UNIQUE |
| `subdomain` | text NOT NULL UNIQUE | Must match `tenants.slug` or documented mapping |
| `custom_domain` | text UNIQUE NULL | Nullable until paid |
| `custom_domain_verified` | boolean NOT NULL DEFAULT false | |
| `status` | text NOT NULL | `draft`, `demo`, `live` |
| `default_language` | text NOT NULL DEFAULT 'en' | BCP-47 code |
| `theme` | text NOT NULL DEFAULT 'light' | `light` \| `dark` — base palette for villa UI (see [design-spec](../03-villa-sites/design-spec.md)) |
| `accent_hex` | text NULL | Optional UI accent from hero palette (e.g. `#c4a574`); null → theme default |
| `robots_template` | text NULL | Newline-joined robots.txt body when set; else app default |
| `gsc_site_url` | text NULL | Search Console property URL (e.g. `sc-domain:slug.nestino.com` or `https://www.example.com/`) for `PerformanceSyncJob`; null → job skips GSC pull for this site |
| `gsc_verification_token` | text NULL | Value for `<meta name="google-site-verification" content="…">` on villa site |
| `cms_api_key_hash` | text NOT NULL | bcrypt/argon2 **hash** — used by villa app to verify `Authorization: Bearer` on CMS routes |
| `cms_api_key_prefix` | text NOT NULL | First 8 chars for console display |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Indexes:** `(tenant_id)` unique, `(subdomain)`, `(custom_domain)` partial where not null.

**RLS:** Same as tenants for operators; villa app server uses service role or restricted DB role for read by host.

---

## 3. `site_languages`

Enabled languages per site.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `site_id` | uuid NOT NULL FK → sites | |
| `language_code` | text NOT NULL | e.g. `en`, `zh-Hans`, `ko`, `fr` |
| `tier` | int NOT NULL | 1, 2, 3 per strategy |
| `status` | text NOT NULL | `planned`, `active`, `paused` |
| `launched_at` | timestamptz NULL | |
| `created_at` | timestamptz | |

**Unique:** `(site_id, language_code)`.

**Indexes:** `(site_id, status)`.

---

## 4. `users`

Nestino operators (not villa owners).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `clerk_user_id` | text NOT NULL UNIQUE | |
| `email` | text | |
| `role` | text NOT NULL | `admin`, `editor` |
| `created_at` | timestamptz | |

**RLS:** User can read self; `admin` policies for management (implement via Supabase custom claims or console-only service role).

*MVP simplification:* Console may use **service role** only + Clerk session check in Next.js middleware (document in console tech-spec).

---

## 5. `content_pages`

Logical page on a site (one row per page “slot”, not per language).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `site_id` | uuid NOT NULL FK → sites | |
| `slug` | text NOT NULL | Without locale prefix; e.g. `location/canggu` |
| `page_type` | text NOT NULL | `home`, `room`, `location`, `guide`, `faq`, `contact`, `custom` |
| `status` | text NOT NULL | `archived`, `active` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Unique:** `(site_id, slug)`.

**Indexes:** `(site_id, page_type)`.

---

## 6. `content_versions`

Versioned content per page **and** language.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `page_id` | uuid NOT NULL FK → content_pages | |
| `language_code` | text NOT NULL | |
| `version` | int NOT NULL | Monotonic per (page_id, language_code) |
| `title` | text NOT NULL | |
| `body_json` | jsonb NOT NULL | Portable block format: **`version`** (int, default `1` for new rows) + **`blocks`** array (see [engine-integration](../03-villa-sites/engine-integration.md)); omitting `version` on legacy rows = treat as `1` when reading |
| `meta_title` | text | |
| `meta_description` | text | |
| `schema_json` | jsonb | Array of JSON-LD objects or single object |
| `is_current` | boolean NOT NULL DEFAULT false | Exactly one `true` per `(page_id, language_code)`; only **`status = 'published'`** rows may be `true` (the version served on the public site); set atomically on publish |
| `status` | text NOT NULL | `draft`, `pending_review`, `approved`, `published` |
| `source` | text NOT NULL | `engine`, `human`, `import` |
| `approved_by_user_id` | uuid NULL FK → users | |
| `published_at` | timestamptz NULL | |
| `created_at` | timestamptz | |

**Unique:** `(page_id, language_code, version)`.

**Indexes:** `(page_id, language_code, status)`, `(status, created_at)`, partial unique on `(page_id, language_code) WHERE is_current = true` (one current row per language slot).

**Published fetch:** Public renderers load the row where `is_current = true` and `status = 'published'` for `(page_id, language_code)` (history rows keep `is_current = false`).

---

## 7. `keywords`

Keyword research record per tenant + language.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `language_code` | text NOT NULL | |
| `keyword` | text NOT NULL | UTF-8, native language |
| `intent_type` | text | `transactional`, `informational`, `commercial`, `navigational` |
| `volume_estimate` | int NULL | |
| `competition` | text NULL | `low`, `med`, `high` or numeric |
| `tier` | int NOT NULL DEFAULT 1 | Engine scheduling |
| `status` | text NOT NULL | `idea`, `queued`, `in_use`, `retired` |
| `embedding` | vector(1024) NULL | Optional pgvector (**phase 2**); dimension matches Voyage `voyage-3-lite` (see [integrations-spec](../02-engine/integrations-spec.md)); MVP: column nullable, no index required |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Unique:** `(tenant_id, language_code, keyword)` (normalized form).

**Indexes:** `(tenant_id, language_code, status)`, IVFFlat/HNSW on `embedding` if used.

---

## 8. `keyword_opportunities`

Prioritized queue linking keywords → eventual content.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `keyword_id` | uuid NOT NULL FK → keywords | |
| `priority_score` | numeric(10,4) NOT NULL | |
| `suggested_page_type` | text | |
| `content_page_id` | uuid NULL FK → content_pages | Filled when mapped |
| `status` | text NOT NULL | `open`, `briefed`, `drafted`, `published`, `killed` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Indexes:** `(tenant_id, status, priority_score DESC)`.

---

## 9. `engine_jobs`

Job instances.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NULL FK → tenants | Null for global jobs |
| `job_type` | text NOT NULL | e.g. `CrawlSiteJob` |
| `idempotency_key` | text NULL | |
| `status` | text NOT NULL | `pending`, `running`, `complete`, `failed`, `dead` |
| `triggered_by` | text NOT NULL | `cron`, `manual`, `event` |
| `priority` | text NOT NULL DEFAULT 'default' | `high`, `default`, `low` |
| `attempt_count` | int NOT NULL DEFAULT 0 | |
| `last_error` | text NULL | Truncated |
| `payload_json` | jsonb NOT NULL DEFAULT '{}' | |
| `started_at` | timestamptz NULL | |
| `completed_at` | timestamptz NULL | |
| `created_at` | timestamptz | |

**Unique (optional):** `(job_type, idempotency_key)` where key not null.

**Indexes:** `(status, priority, created_at)`, `(tenant_id, created_at DESC)`.

---

## 10. `engine_job_results`

Append-only job outputs (or latest per job — implement as needed).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `job_id` | uuid NOT NULL FK → engine_jobs | |
| `result_type` | text NOT NULL | e.g. `crawl_report`, `keyword_batch` |
| `payload_json` | jsonb NOT NULL | |
| `created_at` | timestamptz | |

**Indexes:** `(job_id, created_at DESC)`.

---

## 11. `engine_issues`

On-site / engine-detected issues.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `page_id` | uuid NULL FK → content_pages | |
| `issue_type` | text NOT NULL | `thin_content`, `missing_schema`, `broken_link`, ... |
| `severity` | text NOT NULL | `low`, `med`, `high` |
| `auto_fixable` | boolean NOT NULL DEFAULT false | |
| `status` | text NOT NULL | `open`, `fixed`, `ignored`, `escalated` |
| `detail_json` | jsonb | Evidence |
| `created_at` | timestamptz | |
| `resolved_at` | timestamptz NULL | |

**Indexes:** `(tenant_id, status, severity)`.

---

## 12. `engine_tasks`

Human work items.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `issue_id` | uuid NULL FK → engine_issues | |
| `task_type` | text NOT NULL | `outreach`, `pr`, `review_reply`, `manual_content` |
| `title` | text NOT NULL | |
| `description` | text | |
| `status` | text NOT NULL | `open`, `in_progress`, `done`, `cancelled` |
| `assigned_to_user_id` | uuid NULL FK → users | |
| `due_at` | timestamptz NULL | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Indexes:** `(tenant_id, status)`, `(assigned_to_user_id, status)`.

---

## 13. `geo_snapshots`

AI surface monitoring.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `language_code` | text NOT NULL | |
| `platform` | text NOT NULL | `chatgpt`, `perplexity`, `google_aio` |
| `query` | text NOT NULL | |
| `appeared` | boolean NOT NULL | Property cited or brand visible |
| `citation_url` | text NULL | |
| `rank_hint` | int NULL | If applicable |
| `raw_json` | jsonb NULL | Redact secrets |
| `snapshot_at` | timestamptz NOT NULL | |

**Indexes:** `(tenant_id, snapshot_at DESC)`, `(tenant_id, language_code, platform)`.

---

## 14. `offsite_opportunities`

Off-site gaps / outreach ideas.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants | |
| `opportunity_type` | text NOT NULL | `directory`, `forum`, `pr`, `backlink` |
| `target_url` | text NULL | |
| `title` | text NOT NULL | |
| `description` | text | |
| `status` | text NOT NULL | `suggested`, `in_progress`, `done`, `dismissed` |
| `created_at` | timestamptz | |

**Indexes:** `(tenant_id, status)`.

---

## 15. `subscriptions`

Stripe subscription mirror.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants UNIQUE | |
| `stripe_customer_id` | text NOT NULL | |
| `stripe_subscription_id` | text NOT NULL UNIQUE | |
| `plan` | text NOT NULL | e.g. `nestino_pro_349` |
| `status` | text NOT NULL | Stripe status mirror |
| `current_period_end` | timestamptz | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

## 16. `trials`

Trial period tracking.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `tenant_id` | uuid NOT NULL FK → tenants UNIQUE | |
| `started_at` | timestamptz NOT NULL | |
| `ends_at` | timestamptz NOT NULL | |
| `converted_at` | timestamptz NULL | |
| `status` | text NOT NULL | `active`, `converted`, `expired`, `cancelled` |
| `created_at` | timestamptz | |

---

## 17. `inquiries`

Leads from villa sites.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `site_id` | uuid NOT NULL FK → sites | |
| `language_code` | text NOT NULL | |
| `channel` | text NOT NULL | `form`, `whatsapp_intent`, `phone_click` |
| `name` | text NULL | |
| `email` | text NULL | |
| `phone` | text NULL | |
| `message` | text NULL | |
| `metadata_json` | jsonb NULL | UTM, page path |
| `created_at` | timestamptz | |

**Indexes:** `(site_id, created_at DESC)`.

**RLS:** Insert allowed from villa server role only; read for operators.

---

## 18. `site_cms_credentials`

**Why this exists:** `sites.cms_api_key_hash` lets the **villa app** validate incoming CMS requests but is **not** reversible. The **engine** must call the villa CMS with the real key after onboarding. Store a **server-side decryptable** secret here (never the plaintext in `sites`).

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `site_id` | uuid NOT NULL UNIQUE FK → sites | One row per site |
| `key_ciphertext` | bytea NOT NULL | Encrypted with KMS / `CREDENTIALS_ENCRYPTION_KEY` (32-byte AES-GCM, etc.) |
| `key_version` | int NOT NULL DEFAULT 1 | For rotation |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Access:** Engine service role **only**; **no** reads from Next.js apps (landing **does not** insert here — see [api-contracts](./api-contracts.md) C1). On key rotation, update ciphertext and bump `key_version`; re-hash `sites.cms_api_key_hash` for villa app.

**MVP alternative (dev only):** single shared test key in engine `.env` — document as non-production.

---

## 19. `destination_insights`

Anonymized **cross-tenant** learning per **destination** + **language**. No tenant-identifying fields; aggregated from `engine_job_results` (GSC, audit, GEO) by `DestinationInsightsSyncJob`.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `destination` | text NOT NULL | Matches `tenants.destination` |
| `language_code` | text NOT NULL | BCP-47 |
| `winning_intents` | jsonb | Top-performing `intent_type` clusters |
| `winning_content_patterns` | jsonb | H2 structures, FAQ patterns, block order hints |
| `winning_keywords_sample` | jsonb | Anonymized high-CTR keyword shapes (no tenant slugs) |
| `geo_appearance_avg` | numeric(5,4) NULL | Avg `appeared` rate across contributing tenants |
| `top_issue_types` | jsonb | Most common audit issue types + frequency |
| `fix_success_rate` | jsonb | Auto-fix outcomes where measurable |
| `computed_at` | timestamptz NOT NULL | |
| `tenant_count` | int NOT NULL | Number of tenants that contributed to this row |

**Unique:** `(destination, language_code)`.

**Indexes:** `(destination)`, `(computed_at DESC)`.

**RLS:** Engine service role **only** at MVP — **no** direct reads from Next.js apps or console UI (operators see derived signals in dashboards/job results, not raw table). Console may gain read-only later for debugging.

**Privacy:** Do not write fewer than **2** active tenants into a row (job skips upsert) to reduce re-identification risk.

---

## 20. `site_images`

Uploaded property images (see [image-pipeline-spec](../03-villa-sites/image-pipeline-spec.md)). **`body_json` `image` blocks** reference public URLs; this table is the **canonical** metadata and processing record.

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | |
| `site_id` | uuid NOT NULL FK → sites | |
| `storage_key_original` | text NOT NULL | Path in bucket, e.g. `{tenant_id}/originals/{uuid}.jpg` |
| `public_url_primary` | text NOT NULL | Default CDN URL for primary variant (e.g. 1200w WebP) for admin preview and block insertion |
| `width` | int NULL | Original width px |
| `height` | int NULL | Original height px |
| `alt_text` | text NOT NULL | Required for publish-ready; may start empty on draft upload |
| `role` | text NOT NULL DEFAULT 'gallery' | `hero` \| `gallery` \| `room` \| `og` \| `other` |
| `variants_json` | jsonb NULL | Map of descriptor → URL, e.g. `{"400w_webp":"…","1200w_webp":"…"}` |
| `dominant_color_hex` | text NULL | Suggested accent; operator confirms → `sites.accent_hex` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Indexes:** `(site_id)`, `(site_id, role)`.

**RLS:** Operators full access via console server role; villa app **read** for gallery assembly if needed (or join only in console and pass URLs into published `body_json`).

---

## RLS policy patterns (MVP)

Because Console and Engine often use **service role**, RLS is still valuable for:

- Future villa-owner portals  
- Least-privilege DB roles  
- Supabase Realtime  

**Recommended:**

1. Enable RLS on all tables.  
2. Policy `service_role_all` — full access for `auth.role() = 'service_role'` (or equivalent).  
3. Policy `authenticated_operators` — for `users` table mapping Clerk → uuid, optional second schema.  

Exact SQL lives in Drizzle migrations; keep comments pointing to this doc.

---

## Related

- [architecture.md](./architecture.md)  
- [api-contracts.md](./api-contracts.md)  
- [../03-villa-sites/image-pipeline-spec.md](../03-villa-sites/image-pipeline-spec.md) — `site_images`  
- [../02-engine/data-model.md](../02-engine/data-model.md) (indexes, queues, retention)
