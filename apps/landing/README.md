# Nestino Landing

Corporate website for Nestino, the enterprise hospitality operating system.

## Local Development

```bash
pnpm dev:landing
```

The app runs on port `3000`.

## Scripts

- `pnpm dev:landing` - start the landing app locally
- `pnpm build:landing` - production build
- `pnpm lint:landing` - lint this app

## Environment

Copy `.env.example` and configure the optional integrations:

- `NEXT_PUBLIC_SITE_URL` for metadata, sitemap, and canonical URLs
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` for analytics events
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` for contact emails
- `CRM_WEBHOOK_URL` for forwarding sanitized enterprise inquiries

The contact route validates and returns success in local/dev even when email and CRM integrations are not configured.
