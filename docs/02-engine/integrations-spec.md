# Nestino Engine — Integrations Specification

## Credential encryption (CMS keys at rest)

**Use case:** Encrypt plaintext CMS API keys into `site_cms_credentials.key_ciphertext` after trial activation handoff.

**Configuration**

- `CREDENTIALS_ENCRYPTION_KEY` — **secret**, 32-byte key (store as hex or base64 per implementation); **AES-256-GCM** recommended. **Engine only** — landing app does not hold this key (see [api-contracts](../00-system/api-contracts.md) C1).

**Practices**

- Never log decrypted keys or `cms_api_key_plaintext` job fields.  
- Redact job payloads after successful encrypt.

---

## Anthropic Claude (Messages API)

**Use cases:** briefs, page generation, classification, meta rewrite, FAQ, query generation, gap analysis.

**Configuration**

- `ANTHROPIC_API_KEY` — secret  
- `CLAUDE_MODEL_PREMIUM` — default **Sonnet-class** model for long-form (set per your Anthropic account)  
- `CLAUDE_MODEL_FAST` — **Haiku-class** for classification  
- `CLAUDE_MAX_OUTPUT_TOKENS` — e.g. 4096 for pages, 1024 for classifiers

**Practices**

- Retry on 429/5xx with exponential backoff + jitter.  
- Log **token usage** per job in `engine_job_results` (optional `usage_json`).  
- Truncate crawl HTML to relevant sections before LLM.  
- **Redact** PII from prompts unless necessary.

---

## Voyage AI (embeddings) — phase 2

**Use cases:** `KeywordDiscoveryJob` optional clustering / dedupe via `keywords.embedding` (pgvector).

**Why:** Anthropic does not expose a public embeddings API; **Voyage** is a common pairing for RAG/semantic workflows.

**Configuration**

- `VOYAGE_API_KEY` — secret  
- Model: **`voyage-3-lite`** (1024 dimensions) — must match `keywords.embedding vector(1024)` in [data-model](../00-system/data-model.md).

**MVP:** Leave `embedding` null; skip index creation until phase 2.

---

## Google Search Console

**Use cases:** `PerformanceSyncJob` — queries, pages, countries, devices.

**Configuration**

- OAuth service account or OAuth client with delegated domain verification  
- **`sites.gsc_site_url`** per site (nullable) — `PerformanceSyncJob` reads this column; operators set it in the console (onboarding optional, tenant detail required for reporting).  
- Rate limits: batch by day; cache responses 24h

**Failure handling**

- If property not verified → create `engine_tasks` “Verify GSC property”

---

## SERP / Trends providers

**Use cases:** keyword difficulty, SERP features, related queries.

**Configuration**

- `SERP_API_KEY` or equivalent  
- Cache key: `hash(keyword, hl, gl, engine)` TTL 48–72h

---

## Web crawler (Playwright or Crawlee)

**Use cases:** `CrawlSiteJob`, `OnSiteAuditJob`

**Configuration**

- `CRAWLER_MAX_CONCURRENCY_PER_HOST = 1`  
- `CRAWLER_TIMEOUT_MS = 30000`  
- Respect robots.txt when `respect_robots: true`  
- Store only hashed content if needed for dedupe

---

## GEO probe adapters (pluggable)

**Purpose:** `GEOMonitoringJob`

**Options (implement as strategy pattern)**

1. **OpenAI** Responses API with web tool (if available in your account) — **strict logging & compliance**  
2. **Perplexity API** — if licensed  
3. **Manual sampling** console upload (fallback MVP)

**Rules**

- No deceptive queries; rotate user agents per provider policy.  
- Store only boolean + short citation URL in `geo_snapshots`; trim `raw_json`.

---

## Resend (email)

**Use cases:** notify operators — job failures, content pending review.

**Configuration**

- `RESEND_API_KEY`  
- From domain verified

---

## Stripe (indirect)

Engine does **not** call Stripe directly at MVP; console handles billing. Optional webhook worker later.

---

## Villa CMS API

See [../00-system/api-contracts.md](../00-system/api-contracts.md).

**Client requirements**

- 30s timeout, retries only for idempotent GETs  
- mTLS optional later

---

## Related

- [architecture.md](./architecture.md)  
- [jobs-spec.md](./jobs-spec.md)  
- [testing-spec.md](./testing-spec.md) — mocking external APIs in tests
