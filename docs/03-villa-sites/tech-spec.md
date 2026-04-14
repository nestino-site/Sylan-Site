# Nestino Villa Sites — Technical Specification

## Stack

- **Next.js 15** App Router + **TypeScript** + **Tailwind**  
- **Vercel** with **Edge Middleware** for tenancy + language  
- **Drizzle** + Postgres (Supabase) — **server-only** DB access

## Tenancy resolution (critical)

**Middleware** (`middleware.ts`):

1. Read `Host` header.  
2. If host matches `*.nestino.com` → extract `subdomain` → lookup `sites.subdomain` → attach `site_id`, `tenant_id` to **request headers** (`x-nestino-site-id`) for server components.  
3. If host matches `custom_domain` → same lookup.  
4. If unknown host → 404 or marketing redirect (configurable).

**Caching:** use `unstable_cache` or tag-based revalidation keyed by `site_id`.

## Language routing

- Folder structure: `app/[lang]/(site)/...`  
- Supported languages from `site_languages` where `status=active`.  
- Invalid `lang` → 302 to `default_language`.  
- `generateStaticParams` **not** used for content pages at MVP (dynamic).

## Content rendering

- Load the **current** published row: `content_versions` where `is_current = true`, `status = 'published'`, matching `(page_id, lang)` or `(site_id, slug, lang)`.  
- `body_json.blocks` mapped to React components (`PortableRenderer`).  
- **ISR / revalidation:** `export const revalidate = 60` on public pages + `revalidateTag('site:{id}')` on CMS writes.

## SEO head

- `generateMetadata` reads `meta_title`, `meta_description`, OG image from site settings table (extend schema if needed) or from page version.  
- Canonical URL includes `https://{host}/{lang}/{slug}`.  
- **Google Search Console verification:** if `sites.gsc_verification_token` is set, inject `<meta name="google-site-verification" content="…" />` in the root layout or `generateMetadata` for the tenant (same value for all locales on that host). Operators paste the token from GSC; `PerformanceSyncJob` creates an `engine_tasks` row if the property is not verified yet.

## hreflang

- Layout component queries all **published** siblings for current slug across languages.  
- Emit `alternate` links + `x-default` to default language URL.

## JSON-LD

- Serialize `schema_json` from DB; allow array merge with auto-generated `WebSite` + `Organization` if needed.  
- Always set `@context`, ensure `inLanguage` matches route lang.

## `robots.ts`

- Dynamic per tenant; default allow AI bots.  
- If `sites.status=demo`, optionally `noindex` entire site until owner opts in — **product decision** (default: `noindex` for demo to avoid duplicate thin sites).

## `sitemap.ts`

- Enumerate published pages × languages.  
- Include `<lastmod>` from `published_at`.

## CMS API routes

- Implement under `app/api/cms/...` as defined in [../00-system/api-contracts.md](../00-system/api-contracts.md).  
- Authenticate with **API key** → hash compare `sites.cms_api_key_hash`.

## Public inquiry API

- `POST /api/inquiries` — insert `inquiries`, send Resend email, optional Slack webhook.

## Analytics

- PostHog: `site_id`, `lang`, `page_type` as super properties.  
- Events: `cta_click`, `whatsapp_click`, `phone_click`, `form_submit`.

## Performance

- `next/image` remote patterns for CDN domain  
- Preload hero only  
- Fonts: `next/font` subset

## Security

- Rate limit inquiries per IP  
- CSP allowing maps + analytics domains  
- **Landing iframe (demo preview):** Next.js / defaults can send `X-Frame-Options: SAMEORIGIN`, which blocks embedding `https://{slug}.nestino.com` inside the marketing site’s iframe. For **`sites.status = demo`** (and any status where marketing embed is required), configure **`next.config.ts` headers** so the response includes **`Content-Security-Policy: frame-ancestors 'self' https://nestino.com https://*.nestino.com`** (adjust apex/wildcard to match production marketing hostnames). Do **not** send `X-Frame-Options: DENY` / `SAMEORIGIN` on those responses when embed is allowed, or the iframe will fail silently.

## Related

- [PRD.md](./PRD.md)  
- [design-spec.md](./design-spec.md)  
- [image-pipeline-spec.md](./image-pipeline-spec.md)  
- [engine-integration.md](./engine-integration.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)
