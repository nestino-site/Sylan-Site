# Nestino Engine — Multilingual Specification

This document is the **single source of truth** for how the engine handles **language tiers**, **keyword routing**, **content generation**, **GEO monitoring**, and **technical SEO artifacts** (hreflang, `inLanguage`).

Business rationale lives in [../../strategy.md](../../strategy.md) Section 11.

---

## 1. Language tier determination

### Inputs

- `tenants.destination` — enum-like string: `bali`, `thailand`, `europe`, `caribbean`, `other`  
- `tenants.status` — only `trial` and `active` tenants run full multilingual expansion  
- `site_languages` — authoritative list of enabled languages per site

### Rules

1. **English (`en`)** is always **Tier 1** for every destination.  
2. On tenant creation (trial), the **landing app** seeds initial `site_languages` from the **destination map** below (same transaction as `POST /api/trials/activate` — see [api-contracts](../00-system/api-contracts.md) C1). The **engine** adds or updates languages later (e.g. `POST /api/cms/languages`, tier changes).  
3. Tiers control **budget**: Tier 1 gets full keyword discovery + content + GEO queries; Tier 2 reduced caps; Tier 3 monthly batch.

### Destination → default language stack

| `destination` value | Tier 1 | Tier 2 | Tier 3 |
|---------------------|--------|--------|--------|
| `bali` | `en`, `zh-Hans` | `ko`, `fr` | `ja`, `ms` (optional) |
| `thailand` | `en`, `zh-Hans` | `de`, `ru`, `ko`, `fr` | … |
| `europe` | `en`, `de`, `fr` | `it`, `nl`, `es` | … |
| `caribbean` | `en` | `fr`, `es` | … |
| `antalya` | `en`, `tr`, `ar`, `ru` | `de` | `fr`, `nl` |
| `other` | `en` | (manual) | (manual) |

**Note:** Use BCP-47 tags consistently (`zh-Hans` not `zh-CN` in code, but Search Console property may use `zh-cn` — store both if needed).

---

## 2. Keyword research routing (`KeywordDiscoveryJob`)

For each `language_code` in `site_languages` where `status = active`:

1. Build **native-language seed lists** (not translation of EN seeds) using:
   - destination templates  
   - property attributes (bedrooms, pool, chef, beach distance)  
   - LLM expansion with **language forced** in prompt  
   - optional **`destination_insights`** row for `(destination, language_code)` when using `seed_mode: destination_insights_guided`  
2. Pull **volume/competition** signals from provider with `gl` + `hl` parameters matching language/market.  
3. Store `keywords.keyword` in **native script**.  
4. Tag `keywords.tier` with site language tier.

**Do not:** translate English keywords as the only source.

---

## 3. Content generation routing (`ContentGenerationJob` + `ContentHumanizerJob`)

1. Select prompt variant by `language_code` (see [prompt-library.md](./prompt-library.md)).  
2. Apply **cultural framing** hints from strategy (Chinese/Korean/German/French/Japanese/AU).  
3. `ContentGenerationJob` outputs `body_json` blocks that include:
   - answer-first lead paragraph  
   - H2 sections as blocks  
   - FAQ block object  
4. `meta_title` / `meta_description` must be native language and **pixel-aware** (engine validates length).

**Humanizer (MVP default):** When `auto_humanize = true`, enqueue **`ContentHumanizerJob`** after the draft is persisted, using the **same** `language_code`. The `content-humanizer` prompt must treat **non-English** outputs as first-class: banned phrase lists and cliché patterns are **language-aware** (see [prompt-library.md](./prompt-library.md) §8 — adapt local formulaic phrases, not only English tokens). `language_code` is always passed into the humanizer.

---

## 4. Language version lifecycle

States per `content_versions` (engine path, `auto_humanize` default **on**):

`draft` → *(optional `ContentHumanizerJob`)* → `pending_review` → `approved` → `published`

- With **`auto_humanize: true`:** `ContentGenerationJob` stops at **`draft`**; **`ContentHumanizerJob`** creates the next row with **`pending_review`**.  
- With **`auto_humanize: false`** (non-default): `ContentGenerationJob` may set **`pending_review`** directly — document in engine README.  
- Transitions are **per language** independently.  
- Publishing EN does not auto-publish ZH.  
- `ContentPublishJob` must pass `language_code` + `version`.

---

## 5. GEO monitoring per language (`GEOMonitoringJob`)

1. Use `geo-query-generator` to create queries **in the target language**.  
2. Run probes per `(tenant_id, language_code, platform)`.  
3. Store `geo_snapshots.query` in UTF-8; **never** store API keys in `raw_json`.  
4. Compare week-over-week `appeared` rate in console dashboard.

---

## 6. hreflang generation (`ContentPublishJob` + villa renderer)

For a given `page_id` and set of published languages:

- Build alternate URLs: `https://{host}/{lang}/{slug}`  
- Emit `<link rel="alternate" hreflang="x-default" href="...">` pointing to **default_language** version.  
- Ensure **reciprocal** clusters: every page lists all siblings.

Engine responsibilities:

- On new language launch, call CMS `POST /api/cms/languages` (after landing seeded the initial set).  
- Trigger revalidation for all affected paths

---

## 7. `inLanguage` JSON-LD injection

Every `schema_json` object MUST include:

```json
{ "inLanguage": "zh-Hans" }
```

where value matches `content_versions.language_code`.

Lodging schema on home should repeat property-level `@id` stable per site.

---

## 8. Search Console segmentation

Create or map properties per language **if** using path-based locales; otherwise single domain property with `page` dimension + custom dimension `language` in analytics.

Engine stores aggregates keyed by `language_code` in job results.

---

## Related

- [jobs-spec.md](./jobs-spec.md)  
- [seed-data-spec.md](./seed-data-spec.md) — cold-start keyword seeds per destination  
- [../03-villa-sites/tech-spec.md](../03-villa-sites/tech-spec.md)  
- [../../strategy.md](../../strategy.md)
