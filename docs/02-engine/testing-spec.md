# Nestino Engine — Testing strategy

How to test the Python/FastAPI/Celery engine: unit tests, LLM mocking, integration tests, fixtures, and CI. **Next.js app testing** remains per [CLAUDE.md](../../CLAUDE.md).

---

## Goals

- **Deterministic CI:** PRs do **not** require live Anthropic or paid SERP keys.  
- **Behavior over prose:** assert **DB state**, **HTTP calls**, and **job state transitions**, not subjective LLM quality (except nightly eval).  
- **Fast feedback:** unit tests run in seconds; integration tests in minutes.

---

## Unit tests

| Area | What to test |
|------|----------------|
| **Job helpers** | Pure functions: payload normalization, redaction of `cms_api_key_plaintext`, priority scoring (`priority_score` inputs → output), idempotency keys. |
| **Parsers** | HTML → signals for crawl/audit; SERP JSON → internal model; GSC API response → `gsc_snapshot` shape. |
| **Classifiers** | When not using real LLM, feed **fixture JSON** outputs into the code that consumes them (see below). |

---

## LLM mocking strategy

1. **`MockAnthropicClient`** (or inject transport): returns **static JSON** loaded from `engine/tests/fixtures/llm/{prompt_name}.json` matching the **declared output schema** for that prompt ([prompt-library](./prompt-library.md)).  
2. **Job tests** call the real orchestration code with mock client; assert **writes** to Postgres (e.g. `content_versions`, `engine_job_results`) and **outbound CMS** calls (mocked HTTP).  
3. **Do not** assert exact wording of long-form copy in unit/integration tests.

### Prompt quality / regression (optional)

- **Nightly (or weekly) job:** run a **small** set of prompts against the **real** API with frozen inputs; store scores or human-readable diffs; fail on schema violations or banned phrases only (not BLEU).  
- Keep **out of** default PR path to control cost.

---

## Integration tests

| Scope | Setup |
|-------|--------|
| **FastAPI routes** | `TestClient` + **Postgres**: Testcontainers `postgres` image **or** Supabase local; run Drizzle/migrations before suite. |
| **Celery tasks** | `task_always_eager=True` **or** invoke task callable directly with test DB and mocks. |
| **CMS outbound** | Mock `httpx` / `requests` with **`respx`** (pytest) or **`httpx_mock`**; assert URL, headers (`Authorization`), JSON body. |
| **Pipeline** | With mocked LLM + mocked CMS: enqueue `ContentBriefJob` → `ContentGenerationJob` → `ContentHumanizerJob` (or direct calls); assert `content_versions` version chain and statuses (`draft` → `pending_review`). |

---

## Fixtures layout

```text
engine/tests/fixtures/
  tenants/          # minimal JSON or SQL seeds for tenant, site, site_languages
  llm/
    content-brief-generator.json
    content-page-generator.json
    content-humanizer.json
    on-site-issue-classifier.json
    …
  crawl/
    sample-listing.html
    sample-with-schema.html
  gsc/
    performance-sample.json
```

**Naming:** one JSON file per **`prompt-library`** prompt id where LLM output is mocked.

---

## Test database

- **Dedicated** database or schema; **never** production.  
- **Migrations:** apply all forward migrations once per session.  
- **Isolation:** wrap each test in a **transaction** and rollback, **or** truncate tables between tests (order: respect FKs).  
- **Secrets:** use dummy keys in `.env.test`; no real `ANTHROPIC_API_KEY` in CI unit/integration jobs.

---

## CI pipeline

| Trigger | Suite |
|---------|--------|
| **Every PR / push** | Lint, unit tests, integration tests (Testcontainers or service Postgres). |
| **Nightly** | Prompt eval (real API, capped), optional load test of job throughput. |

---

## Related

- [prompt-library.md](./prompt-library.md)  
- [jobs-spec.md](./jobs-spec.md)  
- [integrations-spec.md](./integrations-spec.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)  
- [CLAUDE.md](../../CLAUDE.md)
