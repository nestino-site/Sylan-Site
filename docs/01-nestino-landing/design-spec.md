# Nestino Landing — Design Specification

## Brand feel

- **Premium, direct, credible** — looks like a product company, not a template shop.  
- **Dark-first UI** with high contrast and generous whitespace.  
- Avoid “AI slop” aesthetics: no purple gradients on white, no generic SaaS illustrations unless custom.

## Page structure (order)

1. **Nav** — logo, “How it works”, “Pricing”, primary CTA, secondary “WhatsApp”  
2. **Hero** — headline, subhead, primary CTA, secondary CTA (“See a demo”), trust micro-line  
3. **Problem** — OTA tax + invisible in Google/AI (3 bullets max)  
4. **Before / After** — split visual + 3 improvement bullets  
5. **How it works** — 3 steps horizontal on desktop, stacked mobile  
6. **Proof** — metrics/testimonial/destinations (pick 2)  
7. **Pricing** — trial callout + $349/mo after + what’s included checklist  
8. **FAQ** — 6–10 Q&As  
9. **Final CTA** — repeat primary CTA + WhatsApp  
10. **Footer** — legal, contact, ©

## Typography

- **Headlines:** modern sans, weight 600–700, sizes responsive (clamp).  
- **Body:** 16–18px base, line-height 1.6.  
- **No** decorative serif required on landing (optional subtle serif for wordmark only).

## Color

- Background: near-black `#0a0a0b` (adjust for WCAG).  
- Surface cards: `#141416`.  
- Primary accent: **single** color (choose one: warm sand OR electric cyan — lock in implementation).  
- Text: `#f4f4f5` primary, `#a1a1aa` secondary.

## Motion

- Subtle fade/slide on scroll; **respect `prefers-reduced-motion`**.  
- No auto-playing video with sound.

## Copy tone

- Owner-to-owner, **outcome-first**.  
- Prefer: “More direct inquiries. Less OTA tax.” over “AI-powered synergies”.  
- Say **AI search** explicitly once in hero or problem section.

## CTA copy options

| Location | Primary | Secondary |
|----------|---------|-----------|
| Hero | “Start your free month” | “See your demo” |
| Mid-page | “Get your pre-built site” | “Chat on WhatsApp” |
| Final | “Activate my trial” | “Book a 10-min call” (optional) |

## `/demo/[slug]` layout

- Full viewport iframe/embed of `https://{slug}.nestino.com/en` (or default locale).  
- Top bar: “This is your new site — live preview” + **Claim** CTA → scrolls to form on `/` with `?slug=` or opens trial modal.  
- Mobile: bar collapses to icon + CTA.

## Imagery

- Use **realistic** villa photography (licensed).  
- Before/after: blur old site if low-res; crisp Nestino screenshot.

## Accessibility

- WCAG 2.2 AA target for text contrast.  
- Keyboard navigable modals/forms.  
- Visible focus states.

## Analytics events (names)

- `landing_view`  
- `cta_click` `{ location, cta_id }`  
- `form_submit` `{ destination }`  
- `whatsapp_click`  
- `demo_view` `{ slug }`

## Related

- [PRD.md](./PRD.md)  
- [tech-spec.md](./tech-spec.md)
