# Nestino Growth Engine — Product Requirements (PRD)

## Summary

The **Engine** is Nestino’s autonomous **acquisition and discoverability layer**. It runs continuously per tenant to:

1. **Discover demand** (keywords + intent, per language)  
2. **Produce and publish** strategic content (not spam)  
3. **Audit and fix** on-site SEO/GEO blockers where safe  
4. **Monitor AI surfaces** (GEO/AEO) per language  
5. **Detect off-site gaps** and escalate human tasks  
6. **Sync performance** signals back into prioritization  
7. **Aggregate destination-level learning** (anonymized) so all tenants in the same market benefit from shared SEO/GEO/audit patterns  
8. **Humanize** engine drafts (`ContentHumanizerJob`) using host voice and guest quotes before operator review

The villa website is the **rendering surface**; the engine is the **operator**.

## Subsystems (in scope)

| Subsystem | Outcome |
|-----------|---------|
| SEO Discovery | Living map of keyword opportunities per tenant × language |
| Content pipeline | Brief → draft → review → publish (via CMS API) |
| On-site optimization | Issues detected, auto-fix when low-risk |
| GEO / AEO monitoring | Snapshot whether property appears in AI answers, per platform × language |
| Off-site / mentions | Opportunity list + tasks for outreach |
| Performance loop | Search Console + on-site events inform keep/kill/expand |
| Cross-tenant insights | `destination_insights` rows per `(destination, language)` feed keyword + brief jobs |
| Humanized content | Brief → **draft** (`ContentGenerationJob`) → **humanizer** → `pending_review` → approve → publish |

## Operating model

Default loop (per tenant):

`Crawl → Diagnose → Decide → Execute → Measure → Iterate`

MVP is **batch + scheduled** (Celery Beat), not fully event-driven. Event hooks may enqueue jobs (e.g. on approve).

## Success criteria (MVP)

- **Coverage:** Every active tenant gets weekly crawl + audit + performance sync.  
- **Publishing:** Engine can create **draft** pages in ≥2 languages for a Bali tenant without manual SQL; default path includes **humanizer** → `pending_review` before publish.  
- **Learning:** With ≥2 active tenants in a destination, weekly `destination_insights` updates inform new keyword/brief cycles.  
- **Safety:** No auto-publish without `approved` status unless explicit operator override (see integration doc).  
- **Visibility:** GEO job stores at least **N** snapshots/tenant/week across platforms (rate-limited).  
- **Human layer:** ≥90% of off-site actions surface as `engine_tasks`, not silent auto-posting.

## Non-goals (explicit)

- PMS, channel manager, booking engine, payments  
- Automated forum spam / Reddit posting  
- Fully autonomous brand PR without human approval  
- Guaranteed rankings or AI citations (engine optimizes for probability, not promises)

## Roles

- **Engine service account** — DB read/write, API calls  
- **Operator** — approves content, completes tasks, overrides  
- **Villa owner** — not an engine user at MVP

## Dependencies

- [../00-system/data-model.md](../00-system/data-model.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)  
- [../../strategy.md](../../strategy.md)  
- [multilingual-spec.md](./multilingual-spec.md)  
- [jobs-spec.md](./jobs-spec.md)  
- [seed-data-spec.md](./seed-data-spec.md)  
- [testing-spec.md](./testing-spec.md)

## KPIs (product)

- Time from opportunity → published page  
- % issues auto-fixed vs escalated  
- Inquiry rate per language segment  
- GEO appearance rate by language (directional)  
- Humanizer pass success rate (first vs second attempt)  
- Freshness of `destination_insights` + correlation with opportunity priority shifts
