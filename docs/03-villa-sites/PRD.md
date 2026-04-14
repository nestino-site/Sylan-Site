# Nestino Villa Sites — Product Requirements (PRD)

## Definition

A **villa site** is a **multi-tenant**, **multilingual**, performance-oriented marketing site for **one** property. It must outperform typical OTA-only or brochure sites on **speed**, **structured data**, **conversion**, and **AI-era discoverability**.

## Tenant & hosting model

- **One** `sites` row per `tenants` row (MVP).  
- **Demo / trial URL:** `https://{slug}.nestino.com`  
- **Paid custom domain:** `custom_domain` with DNS verification + SSL (Vercel)

## Page types (MVP)

| Type | Purpose |
|------|---------|
| Home | Brand, hero, key stats, galleries, primary CTAs |
| Rooms / spaces | Layout, amenities, photos |
| Experience | Services, staff, chef, wellness |
| Location | Map, distances, neighborhood story |
| About | Host story, house rules summary |
| Guides / blog | Engine-generated demand content |
| Contact / inquiry | Form + WhatsApp + phone |

## Conversion requirements

- **WhatsApp** deep link (prefilled) on every major template  
- **Inquiry form** with email notification  
- **Click-to-call** on mobile  
- All tracked with `tenant_id` + `language_code` metadata

## SEO / technical requirements

- Pass **Core Web Vitals** budgets (see tech-spec)  
- Clean URL structure `/{lang}/{slug}`  
- `hreflang` cluster for all active languages  
- XML sitemap includes all published locales  
- `robots.txt` allows AI crawlers by default  
- JSON-LD: `LodgingBusiness` / `Hotel` + `FAQPage` where applicable + `BreadcrumbList` + `inLanguage`

## AI discovery (GEO/AEO) requirements

- FAQ sections on guides and home (where relevant)  
- Entity clarity: consistent property name, geo, NAP  
- No thin “AI spam” pages — minimum editorial quality enforced by engine review

## Multilingual requirements

- Language as **first-class** route segment  
- Native-language meta for each locale  
- Content from DB per locale (not machine-translate on the fly for published pages)

## Content update model

- Public pages render from **`content_versions`** latest **published** row.  
- Engine updates via **CMS API** without redeploy (ISR revalidation).

## User stories

### US1 — Instant credibility

**As** a guest, **I want** a fast, beautiful site **so that** I trust the property.

**AC:** LCP budget met on 4G Fast; hero loads progressive imagery.

### US2 — Mobile clarity

**As** a guest on mobile, **I want** obvious CTAs **so that** I can inquire quickly.

**AC:** Sticky CTA or floating WhatsApp visible on scroll.

### US3 — Language match

**As** a guest, **I want** my language **so that** I understand details.

**AC:** `/en` vs `/zh-Hans` content differs appropriately; hreflang present.

### US4 — Discovery

**As** a guest searching Google, **I want** rich results **so that** I click.

**AC:** Valid JSON-LD on home + key templates.

### US5 — AI search

**As** a guest using AI tools, **I want** factual structured answers **so that** the property is recommendable.

**AC:** FAQs + clear factual blocks; `inLanguage` set.

### US6 — Location trust

**As** a guest, **I want** map + distances **so that** I understand the area.

**AC:** Map embed + distance table to 3–5 POIs.

### US7 — Photo proof

**As** a guest, **I want** high-quality photos **so that** I can visualize the stay.

**AC:** Gallery with lightbox; lazy load; alt text.

### US8 — Rooms comprehension

**As** a guest, **I want** room specs **so that** I know fit and amenities.

**AC:** Beds, baths, occupancy, pool, staff callouts.

### US9 — Social proof

**As** a guest, **I want** reviews or quotes **so that** I reduce risk.

**AC:** Curated quotes + link-out to OTA/Google reviews optional.

### US10 — Inquiry success

**As** a guest, **I want** confirmation after form submit **so that** I know it worked.

**AC:** Inline success state + email to operator.

### US11 — Privacy respect

**As** a guest, **I want** a privacy policy link **so that** I feel safe submitting data.

**AC:** Footer link to property-specific or Nestino-hosted policy (decide in implementation).

### US12 — No booking confusion

**As** a guest, **I want** clear “inquiry-first” flow **so that** I’m not misled about instant booking.

**AC:** No fake availability; copy states inquiry/booking via host.

## Non-goals (MVP)

- Real-time booking engine  
- Payments  
- Channel manager / PMS sync  
- Guest login portal

## Dependencies

- [../00-system/data-model.md](../00-system/data-model.md)  
- [../00-system/api-contracts.md](../00-system/api-contracts.md)  
- [engine-integration.md](./engine-integration.md)  
- [image-pipeline-spec.md](./image-pipeline-spec.md) — property imagery  
- [design-spec.md](./design-spec.md) — tokens, theming (`sites.theme`, `accent_hex`)
