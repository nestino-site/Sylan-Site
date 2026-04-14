# Nestino — Agent Operating Manual (CLAUDE.md)

Read this file before writing or changing code in this repository. It is the **single source of truth** for how Nestino is structured, which specs apply where, and what is non-negotiable.

## Project overview (one paragraph)

**Nestino** is a direct-demand platform for premium villas and boutique stays: it runs **high-converting multilingual property websites** and an **autonomous growth engine** (SEO + GEO/AEO + on-site optimization + off-site gap detection). The marketing **landing** converts owners into trials; the **operator console** is Nestino’s internal control plane; the **engine** is a Python/Celery backend that reads/writes Postgres and calls external APIs; each **villa site** is a multi-tenant Next.js app that serves content from the database and exposes a **CMS API** for the engine to publish updates. The engine also runs a **cross-tenant feedback loop**: performance, GEO, and audit signals from all active sites are aggregated per destination into `destination_insights` and fed back into every tenant’s keyword discovery and content briefs. Engine-generated pages use a **humanizer pass** (`ContentHumanizerJob`) with host voice notes and guest review snippets before operator review — see [docs/02-engine/jobs-spec.md](./docs/02-engine/jobs-spec.md) for defaults and exceptions.

## Spec map (what to read for what)

| Area | Primary docs |
|------|----------------|
| Business & GTM | [strategy.md](./strategy.md), [roadmap.md](./roadmap.md) |
| System-wide architecture & APIs | [docs/00-system/architecture.md](./docs/00-system/architecture.md), [docs/00-system/data-model.md](./docs/00-system/data-model.md), [docs/00-system/api-contracts.md](./docs/00-system/api-contracts.md), [docs/00-system/env-vars.md](./docs/00-system/env-vars.md) |
| Nestino marketing site | [docs/01-nestino-landing/](./docs/01-nestino-landing/) |
| Growth engine | [docs/02-engine/](./docs/02-engine/) — [architecture](./docs/02-engine/architecture.md), [jobs-spec](./docs/02-engine/jobs-spec.md), [multilingual-spec](./docs/02-engine/multilingual-spec.md), [integrations-spec](./docs/02-engine/integrations-spec.md), [prompt-library](./docs/02-engine/prompt-library.md), [data-model](./docs/02-engine/data-model.md), [seed-data-spec](./docs/02-engine/seed-data-spec.md), [testing-spec](./docs/02-engine/testing-spec.md) |
| Villa sites (tenant app) | [docs/03-villa-sites/](./docs/03-villa-sites/) — [design-spec](./docs/03-villa-sites/design-spec.md), [image-pipeline-spec](./docs/03-villa-sites/image-pipeline-spec.md), [engine-integration](./docs/03-villa-sites/engine-integration.md) |
| Operator console (internal) | [docs/04-operator-console/](./docs/04-operator-console/) — [design-spec](./docs/04-operator-console/design-spec.md) |

**Rule:** If a product decision is not in these docs, **do not invent it** — add or update the relevant spec first, then implement.

## Locked tech stack (do not re-debate per session)

| Layer | Choice |
|-------|--------|
| Monorepo | **pnpm** workspaces |
| Marketing landing | **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS** → **Vercel** |
| Villa sites (tenant app) | **Next.js 15** (App Router) + **TypeScript** + **Tailwind** + **Vercel Edge** middleware for host-based tenancy |
| Operator console | **Next.js 15** + **TypeScript** + **Tailwind** + **Shadcn UI** + **Clerk** → **Vercel** |
| Engine | **Python 3.12+** + **FastAPI** + **Celery** + **Redis** |
| Database | **PostgreSQL** via **Supabase** (RLS enabled) + **pgvector** extension where embeddings are used |
| ORM (TS apps) | **Drizzle** + SQL migrations committed to repo |
| AI | **Anthropic Messages API** — model IDs via env (see [docs/02-engine/integrations-spec.md](./docs/02-engine/integrations-spec.md)) |
| Email | **Resend** |
| Billing | **Stripe** |
| Analytics (web) | **Vercel Analytics** + **PostHog** (events) |

## Monorepo layout (target)

```
/
├── apps/
│   ├── landing/          # nestino.com marketing
│   ├── villa-sites/      # multi-tenant property sites (*.nestino.com + custom domains)
│   └── console/          # internal operator UI
├── packages/
│   ├── db/               # Drizzle schema, shared types, DB client (service role only on server)
│   ├── ui/               # optional shared primitives (if deduping is worth it)
│   └── config/           # eslint, tsconfig bases
├── engine/               # FastAPI + Celery workers
│   └── seeds/            # destination JSON for KeywordDiscoveryJob cold start (see docs/02-engine/seed-data-spec.md)
├── docs/                 # product & technical specifications
├── CLAUDE.md
├── strategy.md
└── roadmap.md
```

Adjust folder names only if **all** cross-references in `docs/` are updated in the same change.

## Coding conventions

- **TypeScript:** `strict: true`. No `any`. Prefer `unknown` + narrowing.
- **Exports:** named exports for modules; default export only for Next.js `page.tsx` / `layout.tsx` where required.
- **Files:** kebab-case for files; **PascalCase** for React components.
- **React:** Server Components by default; `"use client"` only when needed.
- **API routes:** validate input (Zod); return typed JSON errors with stable `code` fields.

## Database conventions

- Every tenant-scoped row includes **`tenant_id` UUID** (except global tables like `users` if not tenant-scoped).
- **`destination_insights`** is **destination-scoped**, not tenant-scoped (no `tenant_id`; keyed by `(destination, language_code)`). It is an intentional **cross-tenant aggregate** (anonymized). RLS: engine service role only — see [docs/00-system/data-model.md](./docs/00-system/data-model.md).
- **RLS** enabled on all tenant tables; policies documented in [docs/00-system/data-model.md](./docs/00-system/data-model.md).
- Migrations are **forward-only**; never edit applied migrations.
- **No** raw SQL from Next.js client components — only server-side code with service role or RLS-scoped user.

## Environment variables

- **`NEXT_PUBLIC_*`**: safe for browser; never put secrets here.
- **Secrets**: `*_SECRET`, `*_KEY`, `*_TOKEN` — server-only.
- Every app ships **`.env.example`** listing required keys with dummy values. **Which key goes where:** see [docs/00-system/env-vars.md](./docs/00-system/env-vars.md).
- **Never** log secrets, API keys, or full request bodies containing PII.

## Local development (one command per app — target)

Document exact commands in each app’s `README.md` when scaffolding. Target:

- `pnpm dev:landing` — marketing app
- `pnpm dev:villa` — villa tenant app
- `pnpm dev:console` — operator console
- `pnpm dev:engine` — FastAPI + Celery worker (docker-compose or local Redis)

## Testing standards

- **Engine:** follow [docs/02-engine/testing-spec.md](./docs/02-engine/testing-spec.md) — **MockAnthropicClient** + fixtures under `engine/tests/fixtures/llm/`; integration tests with Testcontainers (or equivalent) for Postgres; mock CMS HTTP with `respx` / `httpx_mock`. See testing-spec for fixture conventions and pipeline assertions.
- **Next.js apps:** integration tests for critical API routes (trial activation, CMS auth); optional Playwright for smoke flows later.
- **UI components:** tests not required at MVP unless logic-heavy.

## Security & compliance

- CMS API: **per-site API key** (see [docs/00-system/api-contracts.md](./docs/00-system/api-contracts.md)).
- Engine ↔ Console: **internal service token** + network restrictions in production.
- Rate-limit public forms and CMS endpoints.
- Store PII (inquiries) with retention policy documented in operator console spec.

## “Do not” list

- Do not add **booking engine, PMS, channel manager, or payments on villa sites** at MVP (see strategy).
- Do not bypass **review gating** for engine-published content (see [docs/03-villa-sites/engine-integration.md](./docs/03-villa-sites/engine-integration.md)).
- Do not block Celery workers with synchronous long HTTP calls without timeouts.
- Do not ship **English-only** content pipelines — multilingual is first-class (see [docs/02-engine/multilingual-spec.md](./docs/02-engine/multilingual-spec.md)).
- Do not skip the **humanizer pipeline** for engine-generated pages when `auto_humanize` is enabled (MVP default): `ContentGenerationJob` must leave **`status = draft`** and enqueue `ContentHumanizerJob`; only the humanizer sets **`pending_review`** for that flow. If `auto_humanize` is disabled (non-default / emergency), document the exception in code README (see [docs/02-engine/jobs-spec.md](./docs/02-engine/jobs-spec.md)).

## When stuck

1. Re-read the **PRD** and **tech-spec** for the sub-project you are changing.  
2. Re-read **api-contracts** if touching cross-system boundaries.  
3. Update the spec if reality diverged — **spec first, then code.**

---

*This file is maintained for humans and coding agents. Keep it concise; put detail in `docs/`.*
