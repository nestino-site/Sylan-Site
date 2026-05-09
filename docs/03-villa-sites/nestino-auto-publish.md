# Nestino auto-publish (Silyan villa-sites)

## Webhook

- **Path:** `POST /api/webhooks/nestino-publish`
- **Verify:** `X-Publish-Signature` = `sha256=<hex>` of **raw** JSON body with `NESTINO_PUBLISH_SECRET`
- **Headers:** `X-Publish-Timestamp` (Unix ms) within ±5 minutes
- **Body:** `pageId`, `slug`, `siteId`, `event` (`page.published` | `page.updated`), `timestamp`

## Environment (Silyan)

| Variable | Required |
|----------|----------|
| `NESTINO_API_BASE_URL` | Yes (server-side fetch for CMS routes) |
| `NESTINO_SITE_ID` | Yes |
| `NESTINO_PUBLISH_SECRET` | Yes |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional (not used for publish path; reserved for rate limiting / future use) |
| `DATABASE_URL` | Recommended on Vercel so `Host` resolves the correct site via `sites.custom_domain` (e.g. `www.villasilyan.com`). If unset, the CMS route can still use `NESTINO_SITE_ID` alone for this single-tenant deploy. |

Errors are JSON: `{ "error": { "code", "message" } }` with `503` for misconfiguration, `401` for auth/timestamp, `403` for wrong site.

## After webhook

The webhook **only revalidates** Next.js cache (`/{lang}/{slug}`, tag `content`). Published HTML is **not** stored in Redis.

Public pages load content on each request (with `revalidate = 60`) via:

`GET {NESTINO_API_BASE_URL}/api/v1/pages?slug=…&siteId=…&language=…`

## Public URLs

Published CMS pages: **`/en/<slug>`** and **`/ar/<slug>`** (slug has no leading `/` and no duplicate `en/` or `ar/` prefix in the stored value).

Tenant resolution uses **`resolveSiteContext(Host, x-nestino-slug)`** so custom domains match before subdomain-only routing.

## Quick checks

1. `POST` webhook with empty body and no valid signature → **401** JSON.
2. Valid signature + env → **200** and `revalidated: true`.
3. `GET /en/<slug>` → **200** when Nestino pages API returns the slug for `NESTINO_SITE_ID`.

Nestino must set `publishWebhookUrl`, `publishWebhookSecret`, and optionally `autoPublish` on the site (see product checklist).
