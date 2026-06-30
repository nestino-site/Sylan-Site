# Nestino Enterprise Website - Design Specification

## Brand Feel

Nestino must feel like the future operating system for premium hospitality: quiet, architectural, intelligent, editorial, and enterprise-grade. It should feel closer to Apple storytelling, Aman restraint, Stripe product clarity, Linear precision, and Porsche confidence than a startup landing page.

The design language is bright luxury, not dark SaaS.

## Visual Principles

- Massive white space and slow editorial rhythm.
- One clear story per section.
- Warm hospitality palette rather than software-dashboard colors.
- Cinematic hospitality imagery with custom product diagrams.
- Premium interface mockups that feel calm, precise, and believable.
- Motion that explains the product, never motion that only decorates.
- No generic SaaS illustrations, fake logos, exaggerated claims, or clutter.

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| Warm Ivory | `#F8F6F1` | Primary page background |
| Soft Sand | `#EFE8DB` | Secondary sections |
| Pure White | `#FFFFFF` | Cards and dashboard surfaces |
| Champagne Gold | `#C8A96A` | Premium accent, connection lines, CTAs |
| Deep Olive | `#4B5B4E` | Secondary accent, technology trust color |
| Rich Charcoal | `#262626` | Primary text |
| Stone Gray | `#787878` | Muted text |
| Very Light Beige | `#E8E2D7` | Dividers and soft borders |

## Typography

- **Headlines:** editorial display feeling. Use available licensed or Google-hosted alternatives via `next/font`; prefer an elegant serif/display face for hero and major headlines.
- **Body/UI:** Inter or Geist, 16-18px base, generous line-height.
- **Numbers/Data:** IBM Plex Mono or a mono fallback for KPI cards and dashboard values.
- Headlines should be oversized, calm, and confident. Avoid cramped SaaS typography.

## Home Page Story

1. **Hero:** Full-screen cinematic introduction with hotel environment, luxury traveler, floating interface elements, animated gold connection lines, dashboard assembly, and delayed CTA reveal.
2. **Problem:** Fragmented hotel ecosystem: isolated properties, duplicated guest profiles, disconnected PMS/CRM/booking systems, OTA leakage, and lost customer value.
3. **Solution:** Hotels, guests, demand signals, and lifestyle partners connect into one intelligent hospitality network.
4. **Property OS:** Exploded architecture diagram for PMS, housekeeping, POS, maintenance, CRM, booking engine, revenue, payments, inventory, and AI.
5. **Guest Identity:** One guest profile enriches across hotels, restaurants, gyms, cafes, spa, events, retail, and airport lounge.
6. **Curina Lifestyle Network:** Scroll-based lifestyle city showing partner buildings, offers, points, recommendations, and profile enrichment.
7. **Autonomous Demand Engine:** Crawl -> Diagnose -> Decide -> Execute -> Measure -> Iterate.
8. **AI Engine:** Demand signals enter, forecasts and personalization emerge.
9. **Executive Dashboard:** Revenue, occupancy, RevPAR, guest lifetime value, direct booking mix, and cross-property movement.
10. **Network Effect:** Circular loop showing compounding guest signals, AI, personalization, direct bookings, revenue, and partner growth.
11. **Technology:** Layered cloud/API/data/AI/security architecture.
12. **Case Study Journey:** Guest moves through UGym, hotel booking, restaurant, spa, checkout, Curina return, and personalized offer.
13. **Final CTA:** Minimal, spacious, almost empty page with one sentence and one gold CTA.

## Page Design Direction

- Each secondary page must have a unique hero, one signature diagram, and a final CTA.
- Pages should not repeat the homepage wholesale.
- Navigation should feel premium and calm, with understated hover states.
- Pricing should be enterprise-oriented, not SaaS card overload.
- Contact should feel like a concierge conversation, not a lead-gen form.

## Motion

- Use slow, smooth easing and restrained timing.
- Every animation must explain fragmentation, unification, enrichment, forecasting, visibility, or network effects.
- Respect `prefers-reduced-motion`.
- Use SVG/CSS/Framer Motion first. Consider GSAP or WebGL only for later high-fidelity enhancements.

## Components

- Premium navigation and mobile menu
- Editorial section headers
- Luxury cards and glass dashboard cards
- Animated connection lines
- Network graph nodes
- Exploded module diagram
- Guest profile card
- Lifestyle city blocks
- AI demand forecast visual
- KPI cards and custom trend lines
- Circular network-effect loop
- Technology architecture layers
- Enterprise contact form

## Imagery

Use photography direction before licensed images are available:

- Luxury boutique hotels
- Architectural interiors
- Natural light
- Editorial travelers
- Premium restaurants
- Wellness and mountain/ocean retreats
- No business stock photography

Implementation may use CSS image placeholders and gradients until licensed assets are added.

## Accessibility

- WCAG 2.2 AA target for text contrast.
- Keyboard navigable menus, links, and forms.
- Visible focus states.
- Semantic headings and landmarks.
- Meaningful reduced-motion fallbacks for all storytelling sections.

## Analytics Events

- `landing_view`
- `cta_click` `{ location, cta_id }`
- `contact_submit` `{ inquiry_type }`
- `partner_interest` `{ category }`
- `pricing_intent` `{ package }`
- `section_view` `{ section_id }`

## Related

- [PRD.md](./PRD.md)
- [tech-spec.md](./tech-spec.md)
