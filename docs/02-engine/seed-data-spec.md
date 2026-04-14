# Nestino Engine — Destination seed data (cold start)

When **`destination_insights`** has no row (or `tenant_count < 2`) for `(destination, language_code)`, the engine must still bootstrap keyword and brief quality. **`KeywordDiscoveryJob`** with `seed_mode: destination_default` loads **committed seed bundles** from the repo.

**Business rationale:** [strategy.md](../../strategy.md) Section 11 (multilingual). **Job wiring:** [jobs-spec.md](./jobs-spec.md) (`KeywordDiscoveryJob`, `DestinationInsightsSyncJob`).

---

## File location and naming

- **Path:** `engine/seeds/{destination}.json`  
- **`{destination}`** must match `tenants.destination` (e.g. `bali`, `thailand`, `europe`, `caribbean`, `other`). See [multilingual-spec](./multilingual-spec.md) destination values.  
- If a file is **missing** for a destination, fall back to `engine/seeds/other.json` after logging a warning.

---

## Bundle JSON schema

Top-level object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `destination` | string | yes | Same as filename stem (e.g. `bali`) |
| `schema_version` | int | yes | Bundle format version; start at `1` |
| `languages` | object | yes | Keys: BCP-47 codes (`en`, `zh-Hans`, …). Values: per-language seed objects (below) |

Per **language** object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `base_keywords` | string[] | yes | **30–50** native-language seeds (not translated from English); villa / location / trip intent |
| `base_intents` | object | yes | Relative weights summing to ~1.0 — keys: `informational`, `commercial`, `transactional`, `comparison`, `navigational` (subset allowed; normalize in code) |
| `base_content_patterns` | object | yes | Starter patterns by `page_type` (see below) |
| `seasonal_calendar` | object | optional | Source-market keyed events (see below) |

### `base_content_patterns`

Object keyed by page type aligned with `content_pages.page_type` where applicable:

- Keys: `home`, `location`, `guide`, `faq`, `custom` (extend as needed)
- Value per key: `{ "h2_templates": string[], "faq_question_starters": string[] }`  
  - `h2_templates` are **outline hints** for briefs (not copy-pasted to every tenant)  
  - `faq_question_starters` seed FAQ targets in the property’s language

### `seasonal_calendar` (optional)

Object keyed by **source market** id (e.g. `cn`, `kr`, `eu`, `au`, `us`):

- Value: `{ "peaks": [{ "name": "string", "approx_months": "string" }], "notes": "string" }`  
- Used to bias **seasonal** keyword and brief angles (Golden Week, Chuseok, EU school holidays, etc.)

---

## Example (trimmed — full files in `engine/seeds/`)

```json
{
  "destination": "bali",
  "schema_version": 1,
  "languages": {
    "en": {
      "base_keywords": [
        "private villa Canggu",
        "Bali villa honeymoon pool",
        "luxury villa Seminyak near beach"
      ],
      "base_intents": {
        "informational": 0.4,
        "commercial": 0.3,
        "transactional": 0.2,
        "comparison": 0.1
      },
      "base_content_patterns": {
        "guide": {
          "h2_templates": [
            "Best time to visit {area} for a quiet stay",
            "What to expect from a private villa in {destination}"
          ],
          "faq_question_starters": [
            "How far is the villa from",
            "Is the pool private"
          ]
        }
      },
      "seasonal_calendar": {
        "cn": {
          "peaks": [{ "name": "Golden Week", "approx_months": "early October" }],
          "notes": "Plan content 6–8 weeks ahead"
        }
      }
    }
  }
}
```

---

## `KeywordDiscoveryJob` behavior (`destination_default`)

1. Resolve `tenants.destination` → load `engine/seeds/{destination}.json` (fallback `other.json`).  
2. For each active `site_languages.language_code`, read that language’s block from `languages`; if missing, use **English** block only as fallback and enqueue `engine_tasks` “Add seed bundle for {lang}” (optional).  
3. Merge `base_keywords` with property attributes (bedrooms, pool, chef) and LLM expansion per [multilingual-spec](./multilingual-spec.md).  
4. Apply `base_intents` as **prior** for intent tagging before SERP data arrives.  
5. Pass `base_content_patterns` into downstream brief context when no `destination_insights` row exists.

---

## Graduation: `destination_insights_guided`

- **Cold start:** No row or job skipped due to `tenant_count < 2` → use `destination_default` seeds + SERP/LLM as today.  
- **Graduation:** When `destination_insights` exists for `(destination, language_code)` with **`tenant_count >= 2`**, `KeywordDiscoveryJob` should use **`seed_mode: destination_insights_guided`** (scheduler or per-tenant flag): prefer `winning_intents`, `winning_keywords_sample`, `winning_content_patterns` from DB; **still merge** file seeds as **fallback** when aggregate fields are empty.  
- **Regression:** If aggregate row is deleted or stale, fall back to file seeds without failing the job.

---

## Maintenance

- Update seed files when entering a **new** primary destination or when market research changes baseline intents.  
- Bump `schema_version` if the JSON shape changes; engine code must support previous version for one release or migrate on load.

---

## Related

- [jobs-spec.md](./jobs-spec.md)  
- [multilingual-spec.md](./multilingual-spec.md)  
- [data-model.md](../00-system/data-model.md) — `destination_insights`
