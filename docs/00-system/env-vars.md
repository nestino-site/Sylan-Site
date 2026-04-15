# Environment variables (by service)

Canonical list for **`.env.example`** files in each app. Keys marked **browser** use the `NEXT_PUBLIC_*` prefix in Next.js apps. All others are **server-only**.

| Variable | Apps / services | Secret? | Purpose |
|----------|-----------------|---------|---------|
| `DATABASE_URL` | landing, villa-sites, console, engine | yes | Postgres (Supabase) |
| `NEXT_PUBLIC_POSTHOG_KEY` | landing, villa-sites, console | browser | PostHog project key |
| `NEXT_PUBLIC_POSTHOG_HOST` | landing, villa-sites, console | browser | PostHog host (optional) |
| `RESEND_API_KEY` | landing, villa-sites | yes | Transactional email |
| `CLOUDINARY_URL` | villa-sites | yes | Cloudinary API URL for image import/upload (server-side only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | villa-sites | browser | Cloudinary cloud name for public delivery URLs |
| `CRM_WEBHOOK_URL` | landing | yes | Optional lead / CRM webhook |
| `ENGINE_INTERNAL_URL` | landing, console | yes | FastAPI base URL (server-side calls only) |
| `ENGINE_INTERNAL_TOKEN` | landing, console, engine | yes | Bearer for engine internal API |
| `UPSTASH_REDIS_REST_URL` | landing | yes | Optional IP/email rate limit (alternative: Vercel KV) |
| `UPSTASH_REDIS_REST_TOKEN` | landing | yes | Optional rate limit |
| `CLERK_PUBLISHABLE_KEY` | console | browser | Clerk |
| `CLERK_SECRET_KEY` | console | yes | Clerk server |
| `CLERK_WEBHOOK_SECRET` | console | yes | Clerk webhook signature verification (**required** for user provisioning) |
| `STRIPE_SECRET_KEY` | console | yes | Stripe |
| `STRIPE_WEBHOOK_SECRET` | console | yes | Stripe webhooks |
| `ANTHROPIC_API_KEY` | engine | yes | Claude Messages API |
| `CLAUDE_MODEL_PREMIUM` | engine | yes | Long-form model id |
| `CLAUDE_MODEL_FAST` | engine | yes | Fast / classifier model id |
| `CLAUDE_MAX_OUTPUT_TOKENS` | engine | no | Max output tokens |
| `CREDENTIALS_ENCRYPTION_KEY` | engine | yes | 32-byte secret for AES-256-GCM; encrypts `site_cms_credentials` (**engine only** — landing does not use this) |
| `VOYAGE_API_KEY` | engine | yes | Embeddings phase 2 (`voyage-3-lite`); optional at MVP |
| `SERP_API_KEY` | engine | yes | Keyword / SERP provider |
| `GSC_CLIENT_JSON` or `GSC_SERVICE_ACCOUNT_JSON` | engine | yes | Google Search Console OAuth / service account (pick one pattern in code README) |
| `REDIS_URL` | engine | yes | Celery broker (+ optional result backend) |
| `PERPLEXITY_API_KEY` | engine | yes | Optional GEO probes |
| `OPENAI_API_KEY` | engine | yes | Optional GEO / tooling |

Add **per-deploy** constants (not secrets): marketing apex domain for villa `frame-ancestors` CSP (e.g. `NEXT_PUBLIC_MARKETING_ORIGIN` on villa app if needed).

## Related

- [api-contracts.md](./api-contracts.md) — trial activation + CMS key handoff  
- [integrations-spec.md](../02-engine/integrations-spec.md) — engine external APIs
