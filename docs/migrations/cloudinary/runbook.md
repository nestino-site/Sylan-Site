# Cloudinary Migration Runbook (Silyan)

This document records the Cloudinary migration for villa-site images and serves as the reusable guide for other projects.

## Scope and outcome

- Scope: static villa images (`silyan-images.ts`), brand assets (logo/favicon/hero), CMS image rewrite tooling, and future upload endpoint.
- Inventory: `216` unique legacy URLs.
- Migration result: `213` migrated, `3` failed (kept as WordPress fallback URLs).

## Files generated as migration logs

- Inventory: `docs/migrations/cloudinary/inventory.json`
- URL mapping manifest: `docs/migrations/cloudinary/url-mapping.json`
  - Format per entry: `old_url -> cloudinary_public_id -> cloudinary_url`

## Commands executed

Run from `apps/villa-sites`:

```bash
pnpm cloudinary:inventory
pnpm cloudinary:migrate
pnpm cloudinary:rewrite:static
pnpm cloudinary:rewrite:cms
```

Notes:
- `cloudinary:migrate` is idempotent: existing mapped URLs are skipped.
- `cloudinary:rewrite:cms` needs `DATABASE_URL`; if missing, it safely no-ops.

## Cutover changes applied in code

- Added Cloudinary migration scripts:
  - `apps/villa-sites/scripts/cloudinary/inventory.mjs`
  - `apps/villa-sites/scripts/cloudinary/migrate.mjs`
  - `apps/villa-sites/scripts/cloudinary/rewrite-static-map.mjs`
  - `apps/villa-sites/scripts/cloudinary/rewrite-cms-body-json.mjs`
- Added server Cloudinary helper:
  - `apps/villa-sites/lib/cloudinary.ts`
- Added CMS media upload endpoint writing to `site_images`:
  - `apps/villa-sites/app/api/cms/media/upload/route.ts`
- Updated static image references to Cloudinary in:
  - `packages/villa-site/src/lib/silyan-images.ts`
- Tightened image host allowlist:
  - `apps/villa-sites/next.config.ts` now explicitly allows `res.cloudinary.com` and removed wildcard host.
- Updated favicon source to come from shared `SITE_LOGO`:
  - `apps/villa-sites/app/layout.tsx`

## Failed legacy URLs (fallback retained)

The following files failed upload and remain on the old source for now:

1. `https://www.silyanvillas.com/wp-content/uploads/2024/07/DSC00183.webp`
2. `https://www.silyanvillas.com/wp-content/uploads/2024/07/DSC00299-2.webp`
3. `https://www.silyanvillas.com/wp-content/uploads/2024/07/DSC00580.webp`

## Rollback procedure

### Full rollback

1. Revert `packages/villa-site/src/lib/silyan-images.ts`.
2. Revert `apps/villa-sites/next.config.ts` (restore previous host policy if required).
3. Revert `apps/villa-sites/app/layout.tsx` if logo/favicon must point to prior source.
4. Redeploy.

### Partial rollback (CMS body_json only)

1. Use `docs/migrations/cloudinary/url-mapping.json`.
2. Swap mapping direction (`cloudinary_url -> old_url`).
3. Re-run `rewrite-cms-body-json.mjs` with the reversed map.

## Reuse in other projects

Use the same pattern for another site:

1. Build inventory (`inventory.mjs`) from that project’s static image source + CMS blocks.
2. Import to Cloudinary (`migrate.mjs`) with a project-specific folder prefix (for example `tenant-slug/legacy`).
3. Rewrite static maps and CMS URLs using the generated manifest.
4. Update `next.config` image allowlist to include only required domains.
5. Add/verify:
   - `CLOUDINARY_URL` (server secret)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (public)

## Security note

Because Cloudinary credentials were shared during implementation, rotate the Cloudinary API secret immediately after verification and update deployment envs in all environments.
