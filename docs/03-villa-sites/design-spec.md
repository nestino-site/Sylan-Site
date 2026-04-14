# Nestino Villa Sites — Design Specification

## Design principles

- **Editorial luxury** over template grid look.  
- Photography leads; typography supports.  
- **Calm** motion; no aggressive popups (light exit intent optional).

---

## Design tokens

**Base unit:** `4px` — all spacing and radii align to multiples of 4 unless noted.

### Spacing scale (CSS custom properties)

| Token | Value | Usage |
|-------|-------|--------|
| `--space-1` | 4px | Tight inline gaps, icon padding |
| `--space-2` | 8px | Form field gaps, compact stacks |
| `--space-3` | 12px | Button padding (vertical compact) |
| `--space-4` | 16px | Default paragraph gap, card padding (mobile) |
| `--space-5` | 24px | Section inner padding, list gaps |
| `--space-6` | 32px | Card padding (desktop), block spacing |
| `--space-8` | 48px | Major section breaks (mobile) |
| `--space-10` | 64px | Section vertical rhythm (mobile) — maps to `Section` mobile |
| `--space-12` | 96px | Section vertical rhythm (desktop) — maps to `Section` desktop |
| `--space-section-y` | `var(--space-10)` mobile / `var(--space-12)` desktop | `Section` component vertical padding |
| `--max-w-content` | 1200px | `Section` max width; align with PRD layout |

### Border radius

| Token | Value | Usage |
|-------|-------|--------|
| `--radius-sm` | 4px | Inputs, small chips |
| `--radius-md` | 8px | Cards, buttons |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars |

### Shadows

| Token | Usage |
|-------|--------|
| `--shadow-sm` | Subtle lift: cards at rest |
| `--shadow-md` | Hover states, sticky bars |
| `--shadow-lg` | Lightbox overlay chrome only |

### Z-index layers

| Token | Value | Usage |
|-------|-------|--------|
| `--z-base` | 0 | Default stacking |
| `--z-sticky-header` | 40 | `SiteHeader` when sticky |
| `--z-sticky-cta` | 45 | `StickyCtaBar` |
| `--z-floating-whatsapp` | 50 | `FloatingWhatsApp` |
| `--z-lightbox` | 100 | Gallery lightbox |

---

## Typography scale

**Font roles:** display/headings use **serif**; UI, body, captions use **sans** (see [PRD](./PRD.md) tone).

| Role | Token | Size (clamp) | Line height | Weight | Font stack |
|------|--------|--------------|-------------|--------|------------|
| Display | `--type-display` | clamp(2.25rem, 5vw, 3.5rem) | 1.1 | 600–700 | Serif |
| H1 | `--type-h1` | clamp(1.875rem, 4vw, 2.5rem) | 1.15 | 600 | Serif |
| H2 | `--type-h2` | clamp(1.5rem, 3vw, 2rem) | 1.2 | 600 | Serif |
| H3 | `--type-h3` | clamp(1.25rem, 2.5vw, 1.5rem) | 1.25 | 600 | Serif |
| H4 | `--type-h4` | 1.125rem | 1.3 | 600 | Sans |
| Body large | `--type-body-lg` | 1.125rem | 1.6 | 400 | Sans |
| Body | `--type-body` | 1rem (min 16px mobile) | 1.6 | 400 | Sans |
| UI / label | `--type-ui` | 0.875rem | 1.4 | 500 | Sans |
| Caption | `--type-caption` | 0.75rem | 1.4 | 400 | Sans |

Implement with `next/font`: subset and variable fonts where available; document chosen font files in app README.

---

## Color system

**Default theme:** **light** — warm editorial base for all new sites unless `sites.theme = dark` (see [data-model](../00-system/data-model.md) `sites.theme`).

### Light palette (default)

| Token | Hex (reference) | Usage |
|-------|-----------------|--------|
| `--color-bg` | `#faf9f7` | Page background |
| `--color-surface` | `#ffffff` | Cards, elevated surfaces |
| `--color-text-primary` | `#111111` | Body and headings |
| `--color-text-secondary` | `#525252` | Supporting copy |
| `--color-text-muted` | `#737373` | Captions, meta |
| `--color-border` | `#e7e5e4` | Dividers, card borders |
| `--color-border-strong` | `#d6d3d1` | Focus rings, inputs |

### Dark palette (`sites.theme = dark`)

| Token | Hex (reference) | Usage |
|-------|-----------------|--------|
| `--color-bg` | `#0c0c0d` | Page background |
| `--color-surface` | `#141416` | Cards |
| `--color-text-primary` | `#fafafa` | Body and headings |
| `--color-text-secondary` | `#a3a3a3` | Supporting copy |
| `--color-text-muted` | `#737373` | Captions |
| `--color-border` | `#27272a` | Dividers |
| `--color-border-strong` | `#3f3f46` | Inputs |

**Contrast:** meet WCAG 2.2 AA for text on `bg` and `surface`; verify accent-on-surface for CTAs.

---

## Theming (`accent_hex`)

**Source:** `sites.accent_hex` (nullable). When null, use **brand default** accent: light theme `#8b7355` (warm bronze); dark theme `#c4a574` (sand gold).

**CSS variables derived from accent** (compute at build/request from hex or use CSS `color-mix` where supported):

| Token | Rule |
|-------|------|
| `--accent-500` | Base = `accent_hex` or fallback |
| `--accent-600` | Darker ~8% for hover on light bg |
| `--accent-400` | Lighter for subtle fills |
| `--accent-muted` | `color-mix(in srgb, var(--accent-500) 20%, transparent)` or equivalent |
| `--ring-accent` | Focus ring: `color-mix(in srgb, var(--accent-500) 40%, transparent)` |

**Usage:** primary buttons, links, progress, `StatBar` icons, `StickyCtaBar` accent — never as large text blocks without contrast check.

---

## Component → token mapping

| Component | Tokens / rules |
|-----------|----------------|
| `SiteHeader` | `--z-sticky-header`, `--space-4` horizontal padding, `--type-ui` nav links |
| `Hero` | `--type-display` headline, `--type-body-lg` subhead, full-bleed media |
| `StatBar` | `--space-4` gap, `--accent-500` icons, `--type-caption` labels |
| `PhotoGrid` | `--radius-md` images, `--space-2` gap |
| `Section` | `--max-w-content`, `--space-section-y`, `--space-6` horizontal padding |
| `Testimonial` | `--type-body` quote, `--type-caption` attribution, `--color-surface` optional card |
| `FAQAccordion` | `--type-h4` triggers, `--space-3` item gap, `--border-border` dividers |
| `StickyCtaBar` | `--z-sticky-cta`, `--shadow-md`, `--accent-600` primary CTA hover |
| `FloatingWhatsApp` | `--z-floating-whatsapp`, `--radius-full` |
| `Footer` | `--color-text-secondary`, `--space-8` top padding, `--type-caption` legal |

---

## Core components

- `SiteHeader` — logo/wordmark, language switcher, primary CTA  
- `Hero` — full-bleed media, headline, subhead, dual CTAs  
- `StatBar` — 3–4 icons (beds, baths, guests, pool)  
- `PhotoGrid` — masonry or uniform, opens lightbox  
- `Section` — max width 1200px, vertical rhythm 96px desktop / 64px mobile  
- `Testimonial` — quote + attribution  
- `FAQAccordion` — accessible keyboard nav  
- `StickyCtaBar` — appears after hero scroll  
- `FloatingWhatsApp` — bottom-right  
- `Footer` — NAP, socials, policy links

## Templates

### Home

1. Hero (video or image carousel — prefer image at MVP)  
2. StatBar  
3. “The stay” — 2-column text + image  
4. Highlight cards (chef, pool, beach distance)  
5. Rooms teaser grid → link to rooms index  
6. Location teaser → link to location page  
7. Reviews / quotes  
8. FAQ (property-specific)  
9. Final CTA band

### Rooms index + detail

- Index: cards with primary photo, title, occupancy, “View”  
- Detail: gallery, specs table, amenity icons, related guide links

### Location

- Map (Google/Mapbox)  
- “Neighborhood in 60 seconds”  
- Distance table  
- Seasonal note block (engine-maintained)

### Guide / blog post

- Breadcrumbs  
- Answer-first paragraph  
- TOC optional for long posts  
- FAQ block at bottom  
- Related posts row

### Contact

- Split layout: left image, right form  
- WhatsApp as secondary button  
- Trust microcopy under form

## Typography (font stacks)

- **Serif (display / H1–H3):** e.g. Fraunces, Playfair Display, or Editorial New — lock one family per deploy.  
- **Sans (body, UI, H4+):** e.g. Inter or Geist.  
- **Minimum** body size: **16px** on mobile (`--type-body`).

See **Typography scale** above for token sizes.

## Color (summary)

- **Default:** light palette (`--color-bg` warm off-white).  
- **Per-tenant dark:** set `sites.theme = dark` and use dark palette tokens.  
- **Accent:** `sites.accent_hex` + derived `--accent-*` tokens; optional suggestion from hero image (see [image-pipeline-spec](./image-pipeline-spec.md)).

## Imagery

- Prefer **twilight + interior warm** shots for hero  
- **No watermarks**; min width 2400px for hero sources  
- Alt text required (engine can suggest, human approves)

## Breakpoints

- Test at **375, 390, 430, 768, 1024, 1280**

## Accessibility

- WCAG AA for text contrast  
- `prefers-reduced-motion` respected  
- Focus rings visible

## Related

- [PRD.md](./PRD.md)  
- [tech-spec.md](./tech-spec.md)  
- [image-pipeline-spec.md](./image-pipeline-spec.md) — hero accent extraction, imagery pipeline  
- [data-model.md](../00-system/data-model.md) — `sites.theme`, `sites.accent_hex`
