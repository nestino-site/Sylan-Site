# Nestino Landing — Product Requirements (PRD)

## Goal

Convert **skeptical villa owners** into **activated 30-day trials** with minimal friction, while clearly communicating the differentiated offer: **pre-built site + autonomous growth engine**.

## Primary user

- Independent villa / boutique stay owner or decision-maker  
- Often **OTA-dependent**, weak digital presence  
- May arrive from cold outreach, referral, or paid channel  
- **English-first** at MVP; optional `id-ID` later (see [tech-spec.md](./tech-spec.md))

## In scope (MVP pages)

| Route | Purpose |
|-------|---------|
| `/` | Primary landing: value prop, offer, proof, FAQ, CTA |
| `/demo/[slug]` | Live preview of prospect’s pre-built demo site (iframe or embed) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## User stories & acceptance criteria

### US1 — Hero clarity

**As** an owner, **I want** to understand what Nestino is in under 5 seconds **so that** I don’t bounce.

**AC**

- Above the fold: headline, subhead, **one primary CTA** (Start free month / See your demo).  
- LCP element is optimized (hero text + light visual, not a 5MB video).  
- Mobile: CTA visible without scroll on common viewports (375–430px height).

---

### US2 — Before / after credibility

**As** an owner, **I want** to see a clear before/after **so that** I believe the upgrade is real.

**AC**

- Section shows **old site thumbnail** (or placeholder) vs **Nestino demo** screenshot.  
- Captions explain **3 concrete improvements** (speed, structure, discovery).  
- If personalized demo exists, CTA deep-links to `/demo/[slug]`.

---

### US3 — Offer comprehension

**As** an owner, **I want** to understand pricing and trial **so that** I know risk/reward.

**AC**

- States **$349/mo** after trial and **first month free** (aligned with [strategy.md](../../strategy.md)).  
- Bullets: edits included during trial, growth work during trial, opt-out at end.  
- No hidden fee language; link to terms.

---

### US4 — Proof of movement

**As** an owner, **I want** credible proof **so that** I trust outcomes.

**AC**

- At least **one** of: metric snapshot (anonymized), testimonial quote, logo row, or “typical 30-day outcomes” list.  
- No fabricated numbers; label as **example** if hypothetical.

---

### US5 — How it works

**As** an owner, **I want** a simple 3-step explanation **so that** I understand the process.

**AC**

- Exactly **3 steps**: e.g. Pre-build → Activate trial → Grow direct demand.  
- Each step ≤ 20 words.  
- Illustrations optional; not required for MVP.

---

### US6 — Lead capture

**As** an owner, **I want** to submit my details **so that** Nestino can activate me.

**AC**

- Form fields: **name**, **email**, **property URL** (optional but recommended), **destination** (select), **WhatsApp** (optional E.164).  
- Validation + accessible errors.  
- Success state: confirmation + what happens next (check email / WhatsApp).  
- Rate limiting on API route.

---

### US7 — Demo preview

**As** an owner, **I want** to open my demo site **so that** I see “it already exists.”

**AC**

- `/demo/[slug]` resolves `sites.subdomain` / tenant slug.  
- If not found → friendly 404 with CTA back to `/`.  
- Embedded demo uses **sandboxed iframe** where possible; “Claim this site” bar fixed on mobile.

---

### US8 — Pricing & FAQ

**As** an owner, **I want** FAQ answers **so that** objections are handled.

**AC**

- FAQ covers: what you get, what you don’t (no PMS), data ownership, cancel anytime, languages, AI search.  
- FAQ uses `FAQPage` schema (see tech-spec).

---

### US9 — Trust signals

**As** an owner, **I want** signals of legitimacy **so that** I feel safe.

**AC**

- Footer: company identity, contact email, social optional.  
- `Organization` schema present.

---

### US10 — WhatsApp contact

**As** an owner, **I want** one-tap WhatsApp **so that** I can talk to a human.

**AC**

- WhatsApp link with prefilled message including **property name** if captured (query param).  
- Click tracked as analytics event.

---

## Non-goals (MVP)

- Owner dashboard / login  
- Blog / CMS on landing  
- Booking engine or availability  
- Self-serve site builder UI  
- Payments on landing (Stripe may exist only in console flow)

## Dependencies

- [../00-system/api-contracts.md](../00-system/api-contracts.md) — `POST /api/trials/activate`  
- [../../strategy.md](../../strategy.md) — messaging constraints

## Success metrics

- Landing → trial activation conversion rate  
- Time to first demo view (`/demo/[slug]` sessions)  
- Qualified lead volume (destinations with engine coverage)
