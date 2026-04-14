# Nestino Engine — Data Model Notes

This document **extends** [../00-system/data-model.md](../00-system/data-model.md) with engine-centric indexing, retention, and queue semantics.

---

## Index strategy (high traffic paths)

| Table | Index | Reason |
|-------|-------|--------|
| `engine_jobs` | `(status, priority, created_at)` | Worker fetch |
| `engine_jobs` | `(tenant_id, job_type, created_at DESC)` | Console views |
| `content_versions` | partial unique `(page_id, language_code) WHERE is_current = true` | One “current” row per language slot |
| `content_versions` | `(page_id, language_code, version DESC)` | History / audit |
| `keywords` | `(tenant_id, language_code, status)` | Discovery joins |
| `keyword_opportunities` | `(tenant_id, status, priority_score DESC)` | Queue pop |
| `geo_snapshots` | `(tenant_id, snapshot_at DESC)` | Dashboard |
| `inquiries` | `(site_id, created_at DESC)` | CVR reporting |
| `destination_insights` | `(destination, language_code)` UNIQUE | Upsert by `DestinationInsightsSyncJob` |

Add **partial indexes** for `status = 'open'` on issues/tasks when tables grow.

---

## Queue state machine

`engine_jobs.status` transitions:

`pending` → `running` → `complete`  
`running` → `failed` (retry) → `running`  
`failed` (after max retries) → `dead`

**Worker claim:** use `SELECT … FOR UPDATE SKIP LOCKED` pattern or Celery acks late.

---

## Content versioning model

Rules:

1. `version` increments monotonically per `(page_id, language_code)` (new row each edit; history retained).  
2. Exactly **one** row per `(page_id, language_code)` has **`is_current = true`** at a time — that row is what public pages render when `status = 'published'`. Older published rows flip to `is_current = false` when a new version publishes.  
3. `published_at` set only on successful CMS publish + DB commit.

**Partial unique index (Postgres):**

```sql
CREATE UNIQUE INDEX one_current_version_per_lang
ON content_versions (page_id, language_code)
WHERE is_current = true;
```

Publish flow (villa CMS or DB mirror): in one transaction, set prior current row `is_current = false`, set new row `is_current = true`, `status = 'published'`.

---

## GEO snapshot retention

- Keep **90 days** detailed rows; aggregate monthly for long-term.  
- Nightly job (future) deletes `geo_snapshots.snapshot_at < now() - interval '90 days'` except **monthly sample** kept.

---

## pgvector usage

**Table:** `keywords.embedding` (optional)

- Model dimension must match embedding model (**1024** for Voyage `voyage-3-lite`; see [integrations-spec](./integrations-spec.md)).  
- Use **HNSW** index (`vector_cosine_ops`) when volume > 10k rows/tenant.  
- Purpose: cluster duplicates, merge opportunities, detect cannibalization.

**Job:** `KeywordDiscoveryJob` can embed seeds + centroid clustering.

---

## `engine_job_results` types

Standard `result_type` values:

- `crawl_report`  
- `gsc_snapshot`  
- `content_brief`  
- `audit_summary`  
- `geo_batch`  
- `offsite_analysis`  
- `destination_insights_report` — output of `DestinationInsightsSyncJob`  
- `humanizer_pass` — quality metadata from `ContentHumanizerJob` (avoid duplicating full `body_json` in payload when large)

---

## Related

- [jobs-spec.md](./jobs-spec.md)  
- [../00-system/data-model.md](../00-system/data-model.md)
