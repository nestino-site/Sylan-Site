# Silyan Villas — Nestino Site Plan

**Property:** Silyan Villas  
**Location:** Hisarçandır, Konyaaltı, Antalya, Turkey  
**Demo URL:** `https://silyan.nestino.com`  
**Status:** Pre-build (demo phase — not yet shown to owner)  
**Created:** April 2026  

This document is the single source of truth for building and running the Silyan Villas site on the Nestino platform. It covers DB setup, language strategy, page architecture, content plan, schema markup, conversion layer, media plan, and build sequence.

Cross-reference with: [docs/03-villa-sites/PRD.md](../../03-villa-sites/PRD.md), [docs/03-villa-sites/design-spec.md](../../03-villa-sites/design-spec.md), [docs/03-villa-sites/tech-spec.md](../../03-villa-sites/tech-spec.md), [docs/02-engine/multilingual-spec.md](../../02-engine/multilingual-spec.md).

---

## 1. Property Intelligence

### What we extracted from silyanvillas.com

| Field | Value |
|-------|-------|
| **Property name** | Silyan Villas |
| **Type** | Boutique villa compound (3 independent villas) |
| **Location** | Hisarçandır Mah., Çandır Cad. No:182, Konyaaltı / Antalya, Turkey |
| **Coordinates** | 36.8230°N, 30.5378°E |
| **Setting** | Mountain / nature; above Konyaaltı; forested hillside |
| **Phone** | +90 531 696 0953 |
| **Email** | info@silyanvillas.com |
| **WhatsApp** | +90 531 696 0953 (same) |
| **Current booking** | Redirects to hotelrunner.com (OTA dependency — we will replace) |
| **Current site tech** | WordPress / MTech Digital, 2024 |
| **Current weaknesses** | No pricing, no schema, thin copy, OTA redirect as primary CTA, boilerplate descriptions, likely auto-translated language switching |

### Distances

| Destination | Distance |
|-------------|----------|
| Antalya Airport (AYT) | 22 km |
| Antalya City Centre | 12 km |
| Konyaaltı Beach | 8 km |
| Lara Beach | ~25 km |

### The three villas

| Villa | Bedrooms | Baths | Max Guests | Key features |
|-------|----------|-------|-----------|--------------|
| **Villa Badem** (Almond) | 3 (en-suite) | 3 | 6 | Private pool, garden, mountain views |
| **Villa Defne** (Laurel) | 5 (en-suite) | 5 | 10 | Private pool, garden, mountain views — largest unit |
| **Villa İncir** (Fig) | 3 (en-suite) | 3 | 6 | Private pool, garden, mountain views |

### Shared amenities (all villas)

Washing machine · dishwasher · refrigerator · microwave · oven · WiFi · iron · satellite TV · tea/coffee maker · hair dryer · private parking · non-smoking · no pets

### Stay policies

- Minimum stay: 2 nights
- Check-in: 15:00
- Check-out: 12:00
- No smoking · No pets · Private parking

### Media inventory

| Source | Assets |
|--------|--------|
| Villa Badem | 16 .webp gallery images |
| Villa Defne | 20+ .webp gallery images |
| Villa İncir | 15 .webp gallery images |
| Promo video | `06293.webm` (site-wide hero candidate) |
| Exterior/aerial | Not confirmed — to source or request from owner |
| Twilight/golden hour | Not confirmed — to request from owner |
| Neighborhood shots | Not confirmed — to source |

---

## 2. Tenant & Site DB Setup

### `tenants` row

```json
{
  "name": "Silyan Villas",
  "slug": "silyan",
  "destination": "antalya",
  "location_label": "Hisarçandır, Konyaaltı, Antalya, Turkey",
  "status": "trial",
  "property_url": "https://www.silyanvillas.com",
  "owner_email": "info@silyanvillas.com",
  "owner_phone": "+905316960953",
  "writing_style": "warm minimalist",
  "host_voice_notes": null,
  "guest_review_snippets": null
}
```

**Note on `destination`:** `antalya` is a new value not in the current destination map in [multilingual-spec.md](../../02-engine/multilingual-spec.md). Add `antalya` to the destination → language stack table there (see Section 4 below for the language tiers to use).

### `sites` row

```json
{
  "subdomain": "silyan",
  "custom_domain": null,
  "status": "demo",
  "default_language": "en",
  "theme": "light",
  "accent_hex": "#7D6B52",
  "robots_template": null
}
```

**Accent `#7D6B52`:** warm clay/stone, confirmed. Derived `--accent-600` (hover): `#6A5A44`; `--accent-400` (subtle): `#9A8568`.

**`status: demo`:** site must `noindex` in `robots.ts` until owner activates trial (per tech-spec). After owner converts, update to `live` and set GSC verification token.

### `site_languages` rows

All four languages are Tier 1 at launch for Antalya (Gulf, Russian, domestic, and international markets are all primary).

| `language_code` | `tier` | `status` | Launch |
|-----------------|--------|----------|--------|
| `en` | 1 | `active` | Day 0 |
| `tr` | 1 | `active` | Day 0 |
| `ar` | 1 | `active` | Day 0 |
| `ru` | 1 | `active` | Day 0 |

**hreflang `x-default`:** → `/en/`

---

## 3. Language Strategy — Antalya

Antalya is Turkey's premier international tourism destination. Unlike Bali (Australian/Chinese-led), Antalya's source market is dominated by:

| Market | Why it matters |
|--------|---------------|
| **Russia / CIS** | Historically #1–2 source market; Russian-speaking guests search natively in Russian |
| **Turkey (domestic)** | Strong domestic demand for boutique mountain stays near Antalya; Turkish-language SEO is a low-competition opportunity |
| **Gulf states (UAE, Saudi, Kuwait)** | Fast-growing luxury segment; Arabic-language content is rare on independent villa sites |
| **UK / Europe / Global** | English covers all international traffic not served by the above |

### Why this language set beats translation

A direct translation of English content into Russian or Arabic has near-zero SEO value — search intent, phrasing, and cultural hooks differ fundamentally:

| Language | Key cultural signals for Silyan content |
|----------|----------------------------------------|
| **Russian** | Emphasis on full-board or self-catering option, proximity to sea, group/family capacity, what's included vs. extra, direct pricing ranges |
| **Turkish** | Nature escape from city, doğa içinde tatil (holiday in nature), dağ manzarası (mountain view), aile dostu (family-friendly), haftalık kiralık (weekly rental) |
| **Arabic** | Privacy (خصوصية), family-suitable (مناسب للعائلات), halal-friendly environment, pool (مسبح خاص), city proximity, ease of communication |
| **English** | Mountain retreat, Mediterranean climate, Antalya base camp, boutique nature villa, authentic Turkey experience |

Each language gets independent keyword research — not translated EN keyword lists.

### Engine job routing for Antalya

The `KeywordDiscoveryJob` must be configured with:
- `gl` parameter: `tr` (Turkey) for TR/RU; `ae` for AR; `gb` for EN
- `hl` parameter: matching language code
- Seed lists: see [Section 10 — Initial Keyword Seeds](#10-initial-keyword-seeds)

---

## 4. Destination Map Update Required

**Action required in [docs/02-engine/multilingual-spec.md](../../02-engine/multilingual-spec.md):** Add `antalya` to the destination → default language stack table:

| `destination` value | Tier 1 | Tier 2 | Tier 3 |
|---------------------|--------|--------|--------|
| `antalya` | `en`, `tr`, `ar`, `ru` | `de` | `fr`, `nl` |

**Rationale for Tier 2 German:** Germany is a top-3 European source market for Antalya (direct flights from Frankfurt, Munich, Berlin). Add after Month 1 when Tier 1 content is stable.

---

## 5. Design Decisions

| Token | Value | Notes |
|-------|-------|-------|
| `theme` | `light` | Warm off-white base — fits Mediterranean/natural setting |
| `accent_hex` | `#7D6B52` | Warm clay/stone — confirmed |
| `--accent-600` | `#6A5A44` | Hover state on CTAs |
| `--accent-400` | `#9A8568` | Subtle fills |
| Serif font | **Fraunces** | Editorial, natural weight variation — fits boutique nature property |
| Sans font | **Inter** | Clean, readable across Arabic/Cyrillic/Latin scripts |
| Hero type | Video (06293.webm) + image fallback | Video as hero background; static image fallback for reduced motion |

**Arabic note:** Ensure `dir="rtl"` is applied on `<html>` for the `/ar/` locale. Layout must mirror correctly (StickyCtaBar, FloatingWhatsApp placement). Inter supports Arabic glyphs sufficiently for UI; body Arabic text may use a system fallback or add Noto Sans Arabic via `next/font`.

**Russian note:** Inter supports Cyrillic — no extra font needed.

---

## 6. Page Architecture

### Route map

| Page | Route pattern | `page_type` | Priority |
|------|--------------|-------------|----------|
| Home | `/[lang]/` | `home` | P0 |
| Villas index | `/[lang]/villas/` | `custom` | P0 |
| Villa Badem | `/[lang]/villas/badem/` | `room` | P0 |
| Villa Defne | `/[lang]/villas/defne/` | `room` | P0 |
| Villa İncir | `/[lang]/villas/incir/` | `room` | P0 |
| Location | `/[lang]/location/` | `location` | P0 |
| Contact / Inquiry | `/[lang]/contact/` | `contact` | P0 |
| About | `/[lang]/about/` | `custom` | P1 |
| Guides hub | `/[lang]/guides/` | `guide` | P1 (engine-fed) |
| Privacy policy | `/[lang]/privacy/` | `custom` | P1 |

**Navigation (SiteHeader):** Villas · Location · About · Contact  
**Footer:** NAP · WhatsApp · Email · Privacy Policy · Powered by Nestino (small)

---

## 7. Home Page — Content Spec

Template order per [design-spec.md § Templates → Home](../../03-villa-sites/design-spec.md):

### 7.1 Hero

- **Media:** `06293.webm` as background video (muted, autoplay, loop); static image fallback (best exterior .webp)
- **Overlay:** dark gradient bottom-to-top for text legibility
- **Headline (EN):** *"Three private villas in the mountains above Antalya"*
- **Headline (TR):** *"Antalya'nın doğasında üç özel villa"*
- **Headline (AR):** *"ثلاث فيلات خاصة في جبال أنطاليا"*
- **Headline (RU):** *"Три частные виллы в горах над Анталией"*
- **Subhead (EN):** *"Private pools, mountain air, 8 km from the sea — your retreat near one of Turkey's most-visited cities."*
- **CTA 1 (primary):** "Explore Villas" → `/[lang]/villas/`
- **CTA 2 (secondary):** "WhatsApp Us" → WhatsApp deep link

### 7.2 StatBar

4 stats:
- 🏡 3 private villas
- 👥 Up to 10 guests
- 🏊 3 private pools
- 🏔 Mountain views

### 7.3 "The Stay" block

2-column: text left, image right (desktop); stacked mobile.

**Body (EN):**
> Silyan Villas sits in Hisarçandır, a forested hillside above Konyaaltı — quiet enough to hear the trees, close enough to reach Antalya's restaurants and beaches in minutes. Three independent villas, each with its own private pool and garden, designed for families and groups who want space without compromise.

**[Placeholder for TR / AR / RU — native-language versions to be written by engine ContentGenerationJob, reviewed before publish]**

### 7.4 Villa cards (3-up grid)

Each card: primary photo · villa name · capacity badge · one-line hook · "View Villa" button

| Villa | One-line hook (EN) |
|-------|-------------------|
| Villa Badem | *3 bedrooms · private pool · sleeps 6* |
| Villa Defne | *5 bedrooms · private pool · sleeps 10 — the largest villa* |
| Villa İncir | *3 bedrooms · private pool · sleeps 6 — a fig tree's shade* |

### 7.5 Location teaser

- Headline: "Everything near, nothing crowded"
- Distance chips: ✈ 22 km to airport · 🏙 12 km to city · 🏖 8 km to beach
- CTA: "See the location" → `/[lang]/location/`

### 7.6 Pricing overview

**Decision: display seasonal price ranges.** This replaces the current zero-pricing approach and reduces friction for serious guests evaluating fit.

| Season | Approx. range (per villa per night) |
|--------|-------------------------------------|
| Low season (Nov–Mar) | from €X / night |
| Mid season (Apr–Jun, Oct) | from €Y / night |
| High season (Jul–Sep) | from €Z / night |

**Note:** Exact rates to be confirmed with owner before publish. Display as "from €X" ranges; always pair with inquiry CTA. Do not imply instant booking.

Copy: *"Prices vary by villa size, season, and length of stay. Contact us for exact availability and rates."*

### 7.7 Reviews / Social proof

- 3–5 curated guest quotes (to source from hotelrunner.com reviews, Google, or owner-provided)
- Format: quote text + reviewer name + country flag
- **Placeholder until real reviews collected:**

> *"The perfect escape from the heat of the city. Our kids loved the pool, we loved the peace."*  
> — Sample Guest, Germany

### 7.8 FAQ block

8 Q&As targeting both guest intent and AI citation:

| Q | A |
|---|---|
| How many villas are there? | Three — Villa Badem, Villa Defne, and Villa İncir. Each is a fully independent villa with its own private pool, garden, and entrance. |
| How many guests can Silyan Villas accommodate in total? | All three villas together sleep up to 22 guests: Badem and İncir each sleep 6, Defne sleeps 10. |
| Can I book more than one villa at once? | Yes. Contact us directly if you'd like to book two or all three villas simultaneously for a group. |
| What is the minimum stay? | 2 nights minimum for all villas. |
| Is there a private pool at each villa? | Yes. Every villa has its own private pool and garden — you will not share with other guests. |
| How far is Silyan Villas from Antalya Airport? | 22 km — approximately 25–30 minutes by car depending on traffic. |
| Are pets allowed? | No pets are permitted at Silyan Villas. |
| Is the property suitable for families with children? | Yes. All three villas are designed for families and groups, with private gardens and pools. Children must be supervised around pool areas at all times. |

### 7.9 Final CTA band

- Headline: "Ready to book your stay?"
- Body: "Send us a message on WhatsApp or fill in the inquiry form — we'll reply within a few hours."
- CTA 1 (primary): "Send WhatsApp message"
- CTA 2 (secondary): "Fill inquiry form" → `/[lang]/contact/`

---

## 8. Villa Detail Pages — Content Spec

Applies to Badem, Defne, and İncir. Differences in capacity/bedrooms only.

### 8.1 Page structure

1. **Gallery** — full-width slider or masonry grid; lightbox on click; lazy load; alt text per image
2. **Headline + one-liner** (e.g. "Villa Badem — 3 bedrooms, private pool, mountain views")
3. **Specs table**

| Feature | Value |
|---------|-------|
| Bedrooms | 3 (each en-suite) |
| Bathrooms | 3 |
| Max guests | 6 |
| Pool | Private, in-garden |
| Views | Mountain and garden |
| Parking | Private, on-site |

4. **Description block** — 150–200 words, atmospheric, who the villa is for
5. **Amenities grid** — icon + label: WiFi · Full kitchen · Dishwasher · Washing machine · Oven · Microwave · TV (Satellite) · Iron · Hair dryer · Tea/Coffee maker · Private pool · Private garden · Private parking
6. **Pricing block** — seasonal range (same structure as home § 7.6 but villa-specific)
7. **House rules block** — Check-in 15:00 · Check-out 12:00 · No smoking · No pets · Min. 2 nights
8. **Inquiry CTA** — dual: inquiry form + WhatsApp deep link (prefilled message)
9. **Related villas** — the other 2 villas as cards

### 8.2 Villa descriptions (EN sample — owner voice placeholder)

**Villa Badem:**
> Named after the almond tree, Villa Badem is a sun-filled three-bedroom retreat designed for families or small groups of up to six. A private pool and shaded garden give you room to settle in — morning swims before the heat, evenings outdoors with the mountain air cooling things down. Every bedroom has its own bathroom. The kitchen is fully equipped for self-catering or light cooking. Antalya is 12 km away when you're ready for it.

**Villa Defne:**
> The largest of the three, Villa Defne sleeps up to ten guests across five en-suite bedrooms — ideal for extended families, two-family trips, or larger groups who want privacy without sacrificing proximity. The private pool and garden face the mountain ridge. Antalya Airport is 22 km; Konyaaltı Beach is 8.

**Villa İncir:**
> Villa İncir — named for the fig tree — mirrors Badem in layout: three bedrooms, each with its own bathroom, sleeping six. A quiet villa for a couple of families or a group of friends who want their own space, their own pool, and a stretch of mountain calm before the day begins.

**[TR / AR / RU versions:** written natively by engine, reviewed by operator before publish. Cultural framing per strategy.md §11 applied in prompts — Russian: full specification of what's included, pricing transparency; Arabic: privacy and family suitability foregrounded; Turkish: nature language, city proximity, aile/grup framing.**]**

### 8.3 WhatsApp deep link format per villa

```
https://wa.me/905316960953?text=Merhaba%2C+Villa+Badem+hakk%C4%B1nda+bilgi+almak+istiyorum.
```

- EN: "Hello, I'm interested in booking Villa Badem at Silyan Villas."
- TR: "Merhaba, Villa Badem hakkında bilgi almak istiyorum."
- AR: "مرحباً، أريد الاستفسار عن حجز فيلا بادم."
- RU: "Здравствуйте, хочу узнать о бронировании виллы Бадем."

---

## 9. Location Page — Content Spec

### Route: `/[lang]/location/`

### Structure

1. **Map embed** — Google Maps iframe centered on 36.8230°N, 30.5378°E; pin at Silyan Villas
2. **Headline:** "Between the mountains and the sea"
3. **Neighborhood block:**

> Hisarçandır is one of Konyaaltı's most peaceful neighborhoods — elevated above the coastal plain, surrounded by pine and oak forest, with a microclimate that runs 3–5°C cooler than the beach in summer. The drive into Antalya takes 20 minutes. Konyaaltı Beach is 8 km. The airport is 22 km, making arrivals and departures straightforward.
>
> Silyan Villas is 10 minutes from Antalya's Kaleiçi old town, the waterfalls of Düden, and the marina — but you won't hear the city from the garden.

4. **Distance table**

| Destination | Distance | Approx. drive |
|-------------|----------|--------------|
| Antalya Airport (AYT) | 22 km | ~25–30 min |
| Antalya City Centre | 12 km | ~20 min |
| Konyaaltı Beach | 8 km | ~15 min |
| Kaleiçi Old Town | ~15 km | ~20 min |
| Düden Waterfalls | ~10 km | ~15 min |
| Lara Beach | ~25 km | ~30 min |

5. **What to do in Antalya** — 4–6 highlights (beach days, Kaleiçi walking, boat trips, waterfalls, local markets)
6. **Seasonal note block** (engine-maintained): best time to visit, seasonal temperatures
7. **CTA:** "Questions about getting here? WhatsApp us."

---

## 10. Contact Page — Content Spec

### Route: `/[lang]/contact/`

### Layout: split — left image (poolside or mountain view photo), right form

### Form fields

- Name (required)
- Email (required)
- Phone (optional)
- Preferred villa (dropdown: Any / Villa Badem / Villa Defne / Villa İncir)
- Arrival date (date picker)
- Departure date (date picker)
- Number of guests
- Message (optional)
- Submit: "Send inquiry"

### Under the form

- WhatsApp button: "Or message us on WhatsApp"
- Trust microcopy: "We reply within a few hours. No spam, no third-party sharing."
- Phone: +90 531 696 0953 (click-to-call on mobile)

### `POST /api/inquiries` payload

```json
{
  "language_code": "en",
  "name": "...",
  "email": "...",
  "phone": "...",
  "message": "Villa: Villa Badem | Dates: 10 Jul – 17 Jul | Guests: 4 | Note: ...",
  "metadata_json": { "page_path": "/en/contact", "villa_preference": "badem" }
}
```

Resend email to: `info@silyanvillas.com` + Nestino operator notification.

---

## 11. About Page — Content Spec

### Route: `/[lang]/about/`

**Placeholder host story (replace with real owner voice when available):**

> Silyan Villas was created by a local family with roots in the Konyaaltı hills — people who knew the land well enough to know what others were missing. The villas are designed around the pace of the mountain: slow mornings, shade in the afternoon, warm evenings in the garden. Three independent villas, each with its own character, all sharing the same standard: clean, complete, cared for.
>
> We manage the property ourselves. When you arrive, you're not checking into a hotel — you're staying in something someone cares about.

**Key messaging for About:**
- Independent, family-run
- Direct relationship with guests (no agency layer)
- Pride in the setting and the craft of hosting

---

## 12. Schema Markup Plan

All schema uses `inLanguage` matching the route language. Serialized in `content_versions.schema_json`.

### Home page JSON-LD

```json
[
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://silyan.nestino.com/en/#lodging",
    "name": "Silyan Villas",
    "url": "https://silyan.nestino.com/en/",
    "description": "Three private villas with pools in Hisarçandır, Konyaaltı, Antalya — boutique mountain retreat 8 km from the sea.",
    "telephone": "+905316960953",
    "email": "info@silyanvillas.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hisarçandır Mah. Çandır Cad. No:182",
      "addressLocality": "Konyaaltı",
      "addressRegion": "Antalya",
      "postalCode": "07070",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 36.8230,
      "longitude": 30.5378
    },
    "numberOfRooms": "11",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Private Pool", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Private Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Mountain View", "value": true }
    ],
    "inLanguage": "en"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Silyan Villas",
    "url": "https://silyan.nestino.com/en/"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many villas are there at Silyan Villas?",
        "acceptedAnswer": { "@type": "Answer", "text": "Three — Villa Badem, Villa Defne, and Villa İncir." }
      },
      {
        "@type": "Question",
        "name": "How far is Silyan Villas from Antalya Airport?",
        "acceptedAnswer": { "@type": "Answer", "text": "22 km, approximately 25–30 minutes by car." }
      },
      {
        "@type": "Question",
        "name": "Does each villa have a private pool?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Each of the three villas has its own private pool and garden." }
      }
    ],
    "inLanguage": "en"
  }
]
```

### Villa detail pages — additional `Hotel` schema per villa

```json
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Villa Badem — Silyan Villas",
  "containedInPlace": { "@id": "https://silyan.nestino.com/en/#lodging" },
  "numberOfRooms": "3",
  "occupancy": { "@type": "QuantitativeValue", "maxValue": 6 },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Private Pool", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "En-Suite Bathrooms", "value": true }
  ],
  "inLanguage": "en"
}
```

Repeat for Defne (`numberOfRooms: "5"`, `maxValue: 10`) and İncir (`numberOfRooms: "3"`, `maxValue: 6`).

### BreadcrumbList — villa detail example

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://silyan.nestino.com/en/" },
    { "@type": "ListItem", "position": 2, "name": "Villas", "item": "https://silyan.nestino.com/en/villas/" },
    { "@type": "ListItem", "position": 3, "name": "Villa Badem", "item": "https://silyan.nestino.com/en/villas/badem/" }
  ]
}
```

---

## 13. Conversion Layer

Every page has access to:

| Element | Behavior |
|---------|----------|
| **FloatingWhatsApp** | Bottom-right, all pages, `z-index: var(--z-floating-whatsapp)`. Prefilled message is page-aware: villa pages use villa-specific prefill; other pages use generic prefill. |
| **StickyCtaBar** | Appears after 100px scroll past hero bottom. CTA 1: "Check availability" → `/[lang]/contact/`. CTA 2: WhatsApp icon. Hidden on contact page. |
| **Click-to-call** | Mobile only. `tel:+905316960953`. Tracked as `phone_click` PostHog event. |
| **Inquiry form** | `/[lang]/contact/` — `POST /api/inquiries`. Rate-limited per IP. Tracked as `form_submit`. |

### PostHog event schema

All events include super properties: `site_id: "silyan"`, `language_code`, `page_type`, `villa` (if applicable).

| Event | Fired when |
|-------|-----------|
| `whatsapp_click` | Any WhatsApp link/button tapped |
| `phone_click` | Click-to-call tapped |
| `cta_click` | Any CTA button; `{label, destination}` as properties |
| `form_submit` | Inquiry form submitted successfully |
| `form_error` | Validation or API error on form |

---

## 14. robots.txt

Set via `PUT /api/cms/robots` once site goes live. Template:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: GoogleExtendedBot
Allow: /

User-agent: Google-Extended
Allow: /
```

**While `sites.status = demo`:** `robots.ts` must return `Disallow: /` for `*` (noindex entire site). The template above only applies once status becomes `live`.

---

## 15. hreflang Cluster

Every page emits all 4 language alternates:

```html
<link rel="alternate" hreflang="en" href="https://silyan.nestino.com/en/villas/badem/" />
<link rel="alternate" hreflang="tr" href="https://silyan.nestino.com/tr/villas/badem/" />
<link rel="alternate" hreflang="ar" href="https://silyan.nestino.com/ar/villas/badem/" />
<link rel="alternate" hreflang="ru" href="https://silyan.nestino.com/ru/villas/badem/" />
<link rel="alternate" hreflang="x-default" href="https://silyan.nestino.com/en/villas/badem/" />
```

Arabic pages must also set `dir="rtl"` on `<html>`.

---

## 16. Sitemap

`sitemap.ts` enumerates all published pages × all 4 active languages:

```
/en/ · /tr/ · /ar/ · /ru/
/en/villas/ · /tr/villas/ · …
/en/villas/badem/ · /tr/villas/badem/ · …
/en/villas/defne/ · …
/en/villas/incir/ · …
/en/location/ · …
/en/contact/ · …
/en/about/ · …
```

`<lastmod>` from `content_versions.published_at`.

---

## 17. Media Plan

### What to use now (from existing site)

- All `.webp` images per villa — reoptimize through Nestino image pipeline (see [image-pipeline-spec.md](../../03-villa-sites/image-pipeline-spec.md))
- Promo video `06293.webm` → hero video background
- Role assignment:
  - Best pool + mountain shot per villa → `role: hero`
  - All others → `role: gallery`
  - One exterior or compound shot → `role: og` (OG meta image)

### What to request from owner

| Asset | Priority | Why |
|-------|----------|-----|
| Aerial / drone shot of full compound | High | Homepage hero fallback; shows scale of property |
| Twilight / golden hour pool shot | High | Design-spec prefers twilight for hero |
| Interior warm-light shots (living areas) | High | Conversion — guests decide on interiors |
| Neighborhood / forest shots | Medium | Location page, AI citation value |
| Owner portrait (optional) | Low | About page, E-E-A-T signal |

### Naming convention in `site_images`

`storage_key_original`:  
`{tenant_id}/originals/{villa}-{sequence}-{uuid}.webp`

e.g. `{uuid}/originals/badem-01-{uuid}.webp`

---

## 18. Initial Keyword Seeds

These seed the `KeywordDiscoveryJob` cold start. Written natively, not translated.

### English (EN)

- "private villa Antalya pool"
- "boutique villa Konyaaltı"
- "villa rental Antalya family"
- "mountain villa Antalya Turkey"
- "Antalya villa holiday private pool"
- "villa near Antalya beach"
- "group accommodation Antalya"
- "best time to visit Antalya"

### Turkish (TR)

- "Antalya kiralık villa havuzlu"
- "Konyaaltı özel villa"
- "Antalya aile villası
- "Hisarçandır kiralık villa"
- "Antalya'da doğa tatili"
- "dağ manzaralı villa Antalya"
- "özel havuzlu villa Antalya"
- "Antalya'da haftalık villa"

### Arabic (AR)

- "فيلا خاصة في أنطاليا مع مسبح"
- "إيجار فيلا أنطاليا للعائلات"
- "فيلا مع مسبح خاص كونيالتي"
- "أفضل وقت لزيارة أنطاليا"
- "استئجار فيلا للمجموعات في أنطاليا"
- "فيلا بجبال أنطاليا"

### Russian (RU)

- "вилла с бассейном Анталья аренда"
- "частная вилла Кунялты снять"
- "отдых на вилле в Анталье"
- "вилла в горах Анталья"
- "вилла для семьи Анталья частный бассейн"
- "аренда виллы в Анталье на неделю"
- "лучшее время для отдыха в Анталье"

---

## 19. Content Gaps — What Still Needs To Be Collected

Before all pages can be published in full quality:

| Gap | Source | Status |
|-----|--------|--------|
| Real pricing ranges per villa per season | Owner | **Needed before pricing block goes live** |
| Guest reviews / quotes | hotelrunner.com + Google + owner | To collect |
| Owner story / About host voice | Owner interview | Placeholder in use |
| Exact amenity list confirmation | Owner | Current list assumed from site — verify |
| Aerial / twilight photography | Owner (or shoot) | To request |
| Interior warm-light shots | Owner | To request |
| TR / AR / RU native copy | Engine (ContentGenerationJob) | Will be generated and humanized; needs operator review |

---

## 20. Engine Job Schedule (Initial)

Once `sites.status` → `demo` and crawl is triggered:

| Job | Trigger | Notes |
|-----|---------|-------|
| `CrawlSiteJob` | On demo creation | Crawls silyanvillas.com to extract existing structure |
| `KeywordDiscoveryJob` | After crawl, per language × 4 | Seeds `keywords` table for all 4 languages |
| `OnSiteAuditJob` | After initial content is published | Detects schema gaps, thin content, missing metadata |
| `GEOMonitoringJob` | Week 1 after go-live | Probes ChatGPT + Perplexity + Google AIO in EN, TR, AR, RU |
| `ContentGenerationJob` | From opportunity queue | Guides, location content, seasonal posts |
| `PerformanceSyncJob` | Daily after GSC verified | Pulls impressions, clicks per language |

---

## 21. Build Sequence

| Phase | What | Acceptance |
|-------|------|-----------|
| **P0 — Scaffold** | `apps/villa-sites` Next.js 15 app; tenancy middleware; language routing; Silyan DB rows; `site_languages` (EN/TR/AR/RU) | `silyan.nestino.com/en` returns 200; RTL works on `/ar/` |
| **P1 — Home** | Hero (video + image fallback); StatBar; Villa cards; Pricing overview block; Location teaser; FAQ; Final CTA; FloatingWhatsApp; StickyCtaBar | Full homepage in EN published; Core Web Vitals passing |
| **P2 — Villa pages** | Badem, Defne, İncir detail pages; gallery + lightbox; specs table; amenities; house rules; pricing block; inquiry CTA | All 3 EN villa pages live; WhatsApp links correct |
| **P3 — Location + Contact + About** | Location page (map + distances + narrative); Contact page (form + WhatsApp + click-to-call); About page (placeholder host story) | All pages navigable in EN |
| **P4 — Schema + SEO** | JSON-LD on all pages; hreflang cluster; canonical; sitemap; robots (noindex for demo) | Validator passes; no schema errors |
| **P5 — TR go-live** | Turkish content published on all P0–P3 pages; `/tr/` routes live | Full site in EN + TR |
| **P6 — AR go-live** | Arabic content published; `/ar/` routes live; RTL layout verified on all templates | Full site in EN + TR + AR |
| **P7 — RU go-live** | Russian content published; `/ru/` routes live | Full site in all 4 languages |
| **P8 — Analytics** | PostHog events wired; GSC token placeholder; CTA click tracking live | All events firing correctly per language |
| **P9 — Demo handover** | Owner demo walk-through; real pricing inserted; real reviews inserted; trial activated | `sites.status` → `live`; robots unblocked; sitemap submitted |

---

## 22. NAP — Canonical Entity (use exactly, everywhere)

```
Name:    Silyan Villas
Address: Hisarçandır Mah. Çandır Cad. No:182, Konyaaltı, Antalya, Turkey
Phone:   +90 531 696 0953
Email:   info@silyanvillas.com
URL:     https://silyan.nestino.com (Nestino site) / https://www.silyanvillas.com (legacy)
Geo:     36.8230°N, 30.5378°E
```

Use verbatim in schema, footer, Contact page, Google Business Profile, and any external citations.

---

*Property: Silyan Villas · Plan version: v1 · Created: April 2026 · Status: Pre-build*
