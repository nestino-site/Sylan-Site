# Nestino Villa Sites — Image pipeline

Property photography is **conversion-critical**. This spec defines ingestion, storage, variants, CDN, alt text, hero accent extraction, and how images relate to **`body_json`** blocks.

**Related:** [design-spec.md](./design-spec.md) (imagery, `accent_hex`), [data-model.md](../00-system/data-model.md) (`site_images`), [tech-spec.md](./tech-spec.md) (`next/image`).

---

## Storage decision (MVP)

**Default:** **Supabase Storage** (same project as Postgres) — single vendor, RLS-capable buckets, CDN URLs compatible with `next/image` `remotePatterns`.

**Alternative:** S3-compatible (e.g. R2) + Cloudflare CDN — document in app README if used; path conventions below stay the same.

---

## Ingestion

| Phase | Behavior |
|-------|----------|
| **MVP** | **Manual upload** via operator console (tenant **Site** or **Media** tab): operator selects files per `site_id`; server uploads to storage and inserts **`site_images`** rows. |
| **Future** | Optional extraction from **legacy URL** during `CrawlSiteJob` — download, dedupe, same processing pipeline; out of MVP unless specified in jobs-spec. |

**Constraints:** no watermarks; hero sources **min ~2400px** wide when available (see design-spec).

---

## Path convention

Bucket (e.g. `property-media`):

```text
{tenant_id}/originals/{uuid}.{ext}
{tenant_id}/processed/{uuid}/{width}w.{format}
```

- **`uuid`:** new UUID per uploaded asset (not sequential).  
- **`ext`:** original extension on `originals/`; processed use `.webp` / `.avif` / `.jpg`.

---

## Processing pipeline (on upload)

Run on **console server** or **engine worker** (choose one implementation; document in code README):

1. Read original from `originals/`.  
2. Generate **width variants:** **400, 800, 1200, 1600, 2400** (omit 2400 if source smaller).  
3. **Formats:** **WebP** primary; **AVIF** optional (second pass); **JPEG** fallback for oldest clients.  
4. **Quality targets:** WebP **~80**, AVIF **~75**, JPEG **~85**.  
5. **Library:** **`sharp`** (Node) or equivalent in Python if processing in engine.  
6. Write URLs + dimensions back to **`site_images`**.

---

## CDN and `next/image`

- Use Supabase public/signed URL pattern or custom CDN domain.  
- Configure **`remotePatterns`** in villa app `next/image` for the storage host.  
- **Cache-Control** on processed objects: long max-age + immutable (filename includes variant).

---

## Alt text

- **Required** before treating an image as “published-ready” in console (validation).  
- **Engine assist:** optional `image-alt-generator` prompt ([prompt-library](../02-engine/prompt-library.md)); operator **always** approves/edits.  
- Store **`alt_text`** on **`site_images`**; sync into `body_json` `image` blocks when inserting blocks via CMS.

---

## Hero accent extraction

On upload (or when operator marks `role = hero`):

1. Sample dominant color from image (e.g. **`sharp`** stats, **`node-vibrant`**, or Python equivalent).  
2. Suggest **`sites.accent_hex`** in console; operator **confirms** or overrides (see [design-spec](./design-spec.md) theming).

---

## Database: `site_images` vs `body_json`

| Approach | Use |
|----------|-----|
| **`site_images` rows** | Canonical catalog for uploads, alt text, variants, roles (`hero`, `gallery`, `room`, `og`). |
| **`body_json` `image` blocks** | Reference **`src`** = public URL of chosen variant (typically 1200w or 1600w WebP) + **`alt`** copied from `site_images.alt_text`. |

**Rule:** Do not rely on `body_json` alone for upload metadata — **`site_images`** is the source of truth for assets managed by Nestino.

Schema: [data-model.md](../00-system/data-model.md) §20 `site_images`.

---

## Performance

- **Hero:** `next/image` **`priority`**, appropriate **`sizes`** (e.g. `(max-width: 768px) 100vw, 1200px`).  
- **Below fold:** lazy load, no priority.  
- **Gallery:** blur placeholder optional (`placeholder="blur"` with tiny LQIP if generated).

---

## Related

- [design-spec.md](./design-spec.md)  
- [engine-integration.md](./engine-integration.md) — `image` block type  
- [../00-system/architecture.md](../00-system/architecture.md) — CDN & media  
- [../02-engine/prompt-library.md](../02-engine/prompt-library.md) — `image-alt-generator`
