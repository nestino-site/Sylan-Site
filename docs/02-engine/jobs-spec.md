# Nestino Engine — Jobs Specification

Each job is a **Celery task** with a stable `job_type` string matching the class name.

**Standard job record:** see `engine_jobs` in [../00-system/data-model.md](../00-system/data-model.md).

**Retry policy (default):** `max_retries = 3`, backoff `2^attempt * 30s` cap 15m.  
**Idempotency:** pass `idempotency_key` for crawl/audit where duplicate work is expensive.

---

## 1. `CrawlSiteJob`

**Purpose:** Fetch all indexable URLs for a tenant’s **source** property URL (legacy site) and/or **Nestino** site, extract text, metadata, links, JSON-LD.

**Trigger:** onboarding, weekly schedule, manual.

**Input `payload_json`**

`target` is an **enum string**: `"legacy_site"` (crawl `tenants.property_url`) or `"nestino_site"` (crawl published Nestino URLs / sitemap for this tenant).

```json
{
  "tenant_id": "uuid",
  "target": "legacy_site",
  "max_pages": 200,
  "respect_robots": true,
  "cms_api_key_plaintext": "optional; onboarding only — see api-contracts C1"
}
```

**Reads:** `tenants.property_url`, `sites.subdomain`, `sites.custom_domain`

**Writes:**

- `engine_job_results` (`result_type: crawl_report`) — list of URLs + http status + title + word count + schema types  
- Optional: ephemeral object storage for raw HTML (if enabled)  
- **Onboarding:** if `cms_api_key_plaintext` is present, encrypt with `CREDENTIALS_ENCRYPTION_KEY`, upsert `site_cms_credentials`, then **redact** plaintext from persisted `payload_json` and logs. If `site_cms_credentials` already exists for `site_id`, **skip** encrypt and still **redact** any plaintext in payload (idempotent handoff).
- **Handoff telemetry:** append to job result summary `cms_key_handoff_status`: `encrypted_ok` \| `skipped_already_present` \| `failed_no_plaintext` \| `failed_encrypt` (see [api-contracts C1 recovery](../00-system/api-contracts.md)).

**Recovery:** If encrypt fails or plaintext is missing on retry, operator follows **api-contracts C1** scenarios A–C (OW8 key rotation or re-issue). On villa CMS **401**, create `engine_tasks` **“CMS key mismatch — rotate via console (OW8)”**.

**Side effects:** none on villa CMS

**Worked example**

- Input tenant `slug = villa-bali`, `property_url = https://old.example.com`  
- Crawler collects 42 URLs, finds 0 FAQ schema, 3 broken internal links  
- Result payload stores top issues summary for `OnSiteAuditJob`

---

## 2. `KeywordDiscoveryJob`

**Purpose:** Build/update `keywords` + `keyword_opportunities` per **active** `site_languages`.

**Trigger:** weekly per tenant, manual.

**Input**

```json
{
  "tenant_id": "uuid",
  "languages": ["en", "zh-Hans"],
  "seed_mode": "destination_default"
}
```

`seed_mode` values:

- **`destination_default`** — load committed JSON from **`engine/seeds/{destination}.json`** (fallback **`engine/seeds/other.json`** if file missing). See [seed-data-spec](./seed-data-spec.md) for schema, `base_keywords`, `base_intents`, `base_content_patterns`, `seasonal_calendar`. Merge file seeds with property attributes + LLM/SERP expansion.
- **`destination_insights_guided`** — prefer `destination_insights` for `(tenant.destination, language_code)` when a row exists with **`tenant_count >= 2`**; use `winning_intents`, `winning_keywords_sample`, `winning_content_patterns`. **Always** merge file seeds from `engine/seeds/{destination}.json` as **fallback** when aggregate fields are empty. If no insights row or insights skipped (cold start), behave like `destination_default`.

**Scheduler recommendation:** use `destination_insights_guided` for tenants in `trial`/`active` once insights exist; new destinations stay on `destination_default` until `DestinationInsightsSyncJob` produces eligible rows.

**Reads:** `tenants.destination`, `tenants.name`, `site_languages`, optional prior `keywords`, **`destination_insights`** for `(tenant.destination, language_code)` when `seed_mode` is insights-guided, **`engine/seeds/*.json`** when applying file seeds.

**Writes:**

- Upsert `keywords`  
- Insert/update `keyword_opportunities` with `priority_score`  
- Optional: update `keywords.embedding` (pgvector) for clustering

**External:** SerpAPI / Keyword tool / LLM expansion (see integrations-spec)

**Worked example**

- Destination `bali` + language `en` generates seeds: “private villa canggu”, “bali villa honeymoon”, …  
- Stores 120 keywords, selects top 15 opportunities above score threshold

---

## 3. `ContentBriefJob`

**Purpose:** Turn one `keyword_opportunity` into a structured brief for writers/LLM.

**Trigger:** queue consumer when opportunity status `open` → `briefed`.

**Input**

```json
{
  "tenant_id": "uuid",
  "opportunity_id": "uuid"
}
```

**Reads:** opportunity, keyword row, tenant facts, top competitor SERP snippets (cached), **`destination_insights`** for `(tenant.destination, keywords.language_code)` — pass `winning_content_patterns` + `winning_intents` into the brief as `destination_insights_json` (see [prompt-library](./prompt-library.md)).

**Writes:**

- `engine_job_results` (`content_brief`)  
- Update `keyword_opportunities.status = briefed`  
- Store brief JSON in results (or `content_plans` table if added later)

**LLM:** `content-brief-generator` prompt

**Worked example**

- Opportunity: `zh-Hans` + “巴厘岛 私人别墅 蜜月”  
- Brief: angle, outline H2s, FAQ targets, internal link targets, CTA notes

---

## 4. `ContentGenerationJob`

**Purpose:** Generate the **first** engine draft via CMS API — **`status = draft` only** when `auto_humanize` is **true** (MVP default). Does **not** set `pending_review` in that path; `ContentHumanizerJob` does.

**Trigger:** manual approval in console or auto-queue from `ContentBriefJob` (config flag).

**Input**

```json
{
  "tenant_id": "uuid",
  "brief_result_id": "uuid",
  "language_code": "en",
  "page_slug_suggestion": "guides/best-time-canggu",
  "auto_humanize": true,
  "auto_submit_review": false
}
```

**Flag rules (mutually exclusive for engine MVP path):**

- **`auto_humanize: true` (default):** `auto_submit_review` **must** be `false`. Job creates/updates CMS content with **`status = draft`**, then enqueues **`ContentHumanizerJob`** with the new `content_version_id`.  
- **`auto_humanize: false` (non-default / emergency):** may set `auto_submit_review: true` to go **`draft` → `pending_review`** in one step **without** humanizer — document override in engine README; not the default product path.

**Reads:** brief JSON, `tenants.host_voice_notes` / `writing_style` / `guest_review_snippets` / `brand_avoid_words` (passed through to humanizer, not all required for draft pass)

**Writes:**

- Calls villa **CMS** `POST /api/cms/pages` or `PUT /api/cms/pages/:id`  
- Updates `keyword_opportunities.content_page_id`, `status = drafted`  
- Enqueues **`ContentHumanizerJob`** when `auto_humanize: true`

**LLM:** `content-page-generator` (+ `faq-generator` as sub-step)

**Worked example**

- Creates page slug `guides/best-time-canggu`, version 1 **`draft`**, `source=engine`; enqueues humanizer for version 1.

---

## 5. `ContentHumanizerJob`

**Purpose:** Second LLM pass — rewrite `body_json` text to remove AI-tell patterns, mirror host voice and guest quotes, keep block structure. Produces **`pending_review`**.

**Trigger:** auto-queued by `ContentGenerationJob` when `auto_humanize: true`; manual retry.

**Input**

```json
{
  "tenant_id": "uuid",
  "content_version_id": "uuid"
}
```

**Reads:** that `content_versions` row (`status` must be `draft`, `source=engine`), `tenants.host_voice_notes`, `writing_style`, `guest_review_snippets`, `brand_avoid_words`, `destination`; `facts_json` if stored on brief result or tenant extension

**Writes:**

- New `content_versions` row: same `page_id`, `language_code`, **`version = prior + 1`**, merged title/meta/schema from draft + humanized `body_json`, **`status = pending_review`**, `source = engine`  
- `engine_job_results` (`humanizer_pass`) — quality metadata, banned-phrase check results (**not** full duplicate of `body_json` in payload if large)

**LLM:** `content-humanizer` prompt ([prompt-library](./prompt-library.md) §8) with `CLAUDE_MODEL_PREMIUM`

**On quality fail:** retry LLM once with stricter instructions; if still failing, create `pending_review` version with `needs_human: true` in metadata / operator note.

**Worked example**

- Draft v1 too generic → humanizer writes v2 with varied sentences, no “nestled”, mirrors host notes → queue shows one `pending_review` row for operator.

---

## 6. `ContentPublishJob`

**Purpose:** Publish **approved** version to live site and revalidate caches.

**Trigger:** on `content_versions.status` transition to `approved` (event) or scheduled sweep.

**Input**

```json
{
  "tenant_id": "uuid",
  "page_id": "uuid",
  "language_code": "en",
  "version": 2
}
```

**Reads:** version row must be `approved`

**Writes:**

- CMS `POST /api/cms/pages/:id/publish` (villa app sets `is_current` + `published_at` per [api-contracts A3](../00-system/api-contracts.md))  
- CMS `POST /api/cms/revalidate` with paths  
- CMS `POST /api/cms/sitemap` (optional; busts dynamic sitemap — see [api-contracts](../00-system/api-contracts.md))  
- Update opportunity `status = published`

**Failure:** non-retryable if 409 conflict → log + task for operator

---

## 7. `OnSiteAuditJob`

**Purpose:** Crawl **Nestino** site; detect SEO/GEO issues; auto-fix safe items.

**Trigger:** 2× weekly, post-publish.

**Input**

```json
{
  "tenant_id": "uuid",
  "site_id": "uuid",
  "modes": ["technical", "content", "schema", "robots"]
}
```

**Reads:** published routes from DB or sitemap

**Writes:**

- `engine_issues` rows  
- Optional auto-fix via CMS: meta title/desc, robots lines, internal links  
- `engine_job_results` (`audit_summary`)

**LLM:** `on-site-issue-classifier`, `meta-optimizer`, `faq-generator` (suggest only)

**Worked example**

- Detects missing `FAQPage` on guide template → issue `missing_schema` high  
- Auto-fix: add placeholder FAQ block draft → `pending_review`

---

## 8. `GEOMonitoringJob`

**Purpose:** Probe AI surfaces with controlled queries per language; store `geo_snapshots`.

**Trigger:** weekly (batched by tenant), manual.

**Input**

```json
{
  "tenant_id": "uuid",
  "languages": ["en", "ko"],
  "platforms": ["perplexity", "openai_web", "google_aio_stub"],
  "max_queries_per_language": 5
}
```

**Reads:** tenant name, slug, destination, published page titles

**Writes:** `geo_snapshots` rows (`raw_json` redacted)

**LLM/tooling:** `geo-query-generator` + provider adapter (see integrations-spec)

**Worked example**

- Query EN: “Best private pool villa in Canggu for families”  
- Result: `appeared=false` → opportunity queued for new guide page in EN

---

## 9. `OffSiteGapJob`

**Purpose:** Identify missing citations/listings/forums; create `offsite_opportunities` + `engine_tasks`.

**Trigger:** monthly, manual.

**Input**

```json
{
  "tenant_id": "uuid",
  "focus": "directories|forums|pr|all"
}
```

**Reads:** NAP consistency, brand name variants, OTA profile URLs (manual fields optional)

**Writes:** `offsite_opportunities`, optional `engine_tasks`

**LLM:** `offsite-gap-analyzer`

**Worked example**

- Missing TripAdvisor listing link → task “claim or create listing”

---

## 10. `PerformanceSyncJob`

**Purpose:** Pull Search Console metrics + store snapshots for reporting loop.

**Trigger:** daily.

**Input**

```json
{
  "tenant_id": "uuid",
  "date_range": "last_28_days"
}
```

**Reads:** `sites` for the tenant’s site row — **`gsc_site_url`**. If `gsc_site_url` is **null**, complete the job without calling GSC (optional `engine_job_results` row noting `skipped: no_gsc_site_url`) or enqueue `engine_tasks` “Configure GSC property URL”.

**Writes:**

- `engine_job_results` (`gsc_snapshot`) — aggregates by page + country + query (hashed). Each **page** entry includes **`intent_inferred`** (join to `keywords` / opportunities where possible) so `DestinationInsightsSyncJob` can aggregate intent-level performance without re-joining raw GSC rows.  
- Optional: materialized view for console dashboard

**External:** Google Search Console API

**Worked example**

- `sites.gsc_site_url = sc-domain:villa-bali.nestino.com` → pulls last 28 days; stores impression growth on `/en/location/canggu` + feeds `KeywordDiscoveryJob`

---

## 11. `DestinationInsightsSyncJob`

**Purpose:** Aggregate anonymized SEO / GEO / audit signals across **all active tenants** in a **destination**, per `language_code`, into `destination_insights`.

**Trigger:** weekly (Celery Beat) per distinct `destination` value, after `PerformanceSyncJob` batch for the week; manual per destination.

**Input**

```json
{
  "destination": "bali"
}
```

**Reads:** `engine_job_results` from last **30 days** where `result_type` in (`gsc_snapshot`, `audit_summary`, `geo_batch`), joined to tenants filtered by `destination` and `status in ('trial','active')`.

**Writes:**

- Upsert `destination_insights` per `(destination, language_code)`  
- `engine_job_results` (`destination_insights_report`) — summary stats + `tenant_count` used

**Rules:**

- If **fewer than 2** qualifying tenants for a `(destination, language_code)` slice, **skip** upsert (privacy / de-anonymization).  
- Strip tenant slugs, names, and URLs from aggregated `winning_keywords_sample`.

**Cold start:** While no row exists (or slice skipped), `KeywordDiscoveryJob` relies entirely on **`engine/seeds/{destination}.json`** + SERP/LLM — see [seed-data-spec](./seed-data-spec.md). No `destination_insights` dependency.

**Graduation:** After upsert with **`tenant_count >= 2`**, eligible `(destination, language_code)` slices feed **`destination_insights_guided`** runs for that destination; file seeds remain fallback per seed-data-spec.

**Worked example**

- After 4 Bali tenants report GSC + audits, row `(bali, en)` gets updated `winning_intents` + `top_issue_types`; next `KeywordDiscoveryJob` for each Bali tenant reads it.

---

## Job orchestration rules

1. **`OnSiteAuditJob` (Nestino)** is enqueued after the **first successful `ContentPublishJob`** on the tenant’s villa site (event from job completion), not from `CrawlSiteJob` alone — auditing an empty Nestino site is low value. `CrawlSiteJob` with `target: legacy_site` still runs at onboarding for competitor/legacy URL intel.  
2. `KeywordDiscoveryJob` → spawns `ContentBriefJob` for top-N opportunities (cap per week).  
3. `ContentGenerationJob` never runs without either brief or explicit operator payload.  
4. **`ContentHumanizerJob`** runs after `ContentGenerationJob` when `auto_humanize: true` (default); do not set `pending_review` from generation in that path.  
5. `ContentPublishJob` **requires** approved version (MVP).  
6. `PerformanceSyncJob` outputs feed scoring function for opportunity priority (implement as pure function + tests).  
7. `DestinationInsightsSyncJob` runs **after** weekly/daily performance batches; feeds `KeywordDiscoveryJob` + `ContentBriefJob` via `destination_insights`.

## Related

- [multilingual-spec.md](./multilingual-spec.md)  
- [seed-data-spec.md](./seed-data-spec.md)  
- [prompt-library.md](./prompt-library.md)  
- [integrations-spec.md](./integrations-spec.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)
