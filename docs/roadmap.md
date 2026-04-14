# Nestino — Build Roadmap (High Level)

This document splits work into **two phases** at the roadmap level only. Step-by-step execution for each item is **not** defined here — this is a planning reference, not a sprint board.

Related strategy context: [strategy.md](./strategy.md).

**Implementation specs (for Claude / engineering):** [docs/README.md](./docs/README.md) and [CLAUDE.md](./CLAUDE.md).

*Last updated: April 2026.*

---

## Phase 1 — Nestino Landing Page & Own Domain

Everything needed to establish Nestino's own credible web presence before reaching out to villa owners.

- Register and configure Nestino's primary domain (DNS, SSL, professional email)
- Define brand identity: name, visual language, tone of voice
- Define core messaging and primary CTAs aligned with the GTM pitch (who it's for, what they get, how to start)
- Design and ship the **Nestino marketing landing page**: hero, value proposition, before/after framing, trust signals, CTA
- Write copy that speaks directly to villa owners — pain points (OTA dependency, dead website, invisible in search), not technical features
- **Language decision for Nestino's own site**: launch in English (primary), with consideration for Indonesian (Bahasa Indonesia) if early focus is Bali — villa owners in target markets are often English-comfortable, but localized outreach copy can increase response rates
- Implement analytics, event tracking, and basic conversion measurement (form submits, CTA clicks, scroll depth) — include country/language dimension from day one
- Set up **schema markup on Nestino's own site** (Organization, WebSite, FAQPage) — practice what you preach
- Allow AI crawlers in `robots.txt` from day one (GPTBot, PerplexityBot, ClaudeBot, GoogleExtendedBot)
- Ensure consistent NAP / entity information across the domain and any external mentions
- Legal / policy pages (privacy policy, terms of service)
- Hosting and deployment pipeline (fast, globally distributed, HTTPS enforced)
- Set up a simple **lead capture and CRM layer** — form backend, notification, spreadsheet or lightweight tool to track prospects
- Set up Google Search Console and Google Business Profile for Nestino as a company

---

## Phase 2 — Building the Engines & Villa Websites

The core product: the villa site infrastructure and the autonomous growth engine that runs on top of it.

### Villa Site Foundation

- Design system and component library for villa sites: premium, fast, mobile-first, conversion-focused
- Page templates: homepage, rooms / villa details, location, experience, about, contact/inquiry, blog/content hub
- **Full schema markup baseline** for every property site: `LodgingBusiness`, `Hotel`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`, `Review` — required for AI citations and rich results; include `inLanguage` attribute per language version
- `robots.txt` template allowing AI crawlers (GPTBot, PerplexityBot, ClaudeBot, GoogleExtendedBot, Google-Extended) on all villa sites
- Core Web Vitals compliance (LCP, INP, CLS) as a launch requirement — not an afterthought
- SEO-ready URL structure, XML sitemap generation, canonical tags
- **Multilingual URL architecture**: language subfolders from day one (e.g., `/en/`, `/zh/`, `/ko/`) — subfolders preferred over subdomains for SEO consolidation
- **hreflang implementation**: bidirectional tags, self-referential tags, and `x-default` fallback on all pages with language variants
- Language-specific XML sitemaps, submitted separately per locale to Google Search Console

### Multi-Tenant Hosting & Subdomain Model

- Subdomain provisioning system for demo sites (`property.nestino.com`)
- Path to custom domain when the owner converts to paid (CNAME delegation or full DNS transfer)
- Deployment pipeline: fast spin-up of new property sites from templates

### Content Ingestion (Manual First)

- Intake process for property data: name, location, type, ADR range, key features, unique selling points
- Photo management: sourcing, optimizing, serving (lazy load, modern formats, CDN)
- Location and destination content layer (feeds into SEO content strategy)
- CTA configuration: WhatsApp number, inquiry form, phone click-to-call, optional calendar/booking link

### Conversion Layer

- Inquiry and contact form with backend notification (email/Slack/webhook)
- WhatsApp deep links (pre-filled message template)
- Click-to-call with event tracking
- Measurable conversion events sent to analytics and optionally to a CRM

### Growth Engine — SEO Discovery

- Keyword and intent research pipeline: property + location analysis → opportunity map
- Keyword clustering by intent type: transactional, informational, navigational, comparison, planning
- Seasonal and trend signal ingestion (Google Trends, Search Console data)
- Prioritization logic: expected traffic × competition × conversion intent
- **Language-aware prioritization**: for each content opportunity, evaluate which languages to target based on the property's source market composition — English first, then destination-specific languages (e.g., Chinese + Korean for Bali; German + French for European destinations)
- **Native-language keyword research**: each language requires independent keyword research, not translation of English keywords — search behavior and phrasing differ fundamentally across languages
- Source market identification per property: pull destination-level nationality data to determine which language tiers apply (Tier 1 = launch, Tier 2 = month 1–3, Tier 3 = month 3–6+)
- Content calendar / queue generation from opportunity map, with language dimension as a first-class column

### Growth Engine — Content Production

- Content generation workflow: keyword → brief → draft → review → publish
- Page types: location landing pages, comparison content, trip-planning guides, FAQ pages, seasonal content
- Content format standard: modular, scannable, AI-readable — clear declarative answers, FAQ blocks, named signals (owner voice, real guest detail)
- **Multilingual content generation**: produce content natively in each target language, not as translated versions of English content — cultural framing, search intent, and tone differ per market:
  - Chinese: privacy, exclusivity, group suitability, family features, food compatibility
  - Korean: aesthetic and design detail, wellness, "instagrammable" angles
  - German: precise specifications, sustainability, transparent pricing
  - French: gastronomy, cultural context, refinement
  - Japanese: service quality, cleanliness, nature and calm
  - Australian/English: outdoor living, pool/beach access, relaxed tone
- **Language-specific seasonal content**: account for source market calendars (Chinese Golden Week, Korean Chuseok, European school holidays, Australian summer) when planning seasonal content angles
- Human-in-the-loop review layer for quality and brand fit before publish — native speaker review for each non-English language
- Internal linking automation between related pages, including cross-language linking where appropriate

### Growth Engine — GEO / AEO (AI-Native Discovery)

- **GEO audit module**: check how and whether the property appears in ChatGPT, Perplexity, Google AI Overviews, Gemini — per language (a Korean-language query in ChatGPT returns different results than English)
- Entity consistency check: ensure property name, location, and key facts are consistent across the site and external surfaces
- Conversational content optimization: restructure existing pages to answer natural-language AI queries
- Schema audit and enhancement: detect missing or malformed structured data; auto-generate fixes where safe; ensure `inLanguage` is set correctly per language version
- E-E-A-T signal improvement: original photography, owner/host voice content, review integration, on-the-ground specificity
- AI crawler access audit: verify that all AI bots can crawl and index the site
- **Multilingual AI discovery tracking**: monitor AI surface appearances per language — Google AI Mode supports nearly 100 languages (as of Feb 2026); every language version Nestino publishes is eligible for citation in that language's AI Overview
- **Language-specific citation gap analysis**: identify in which languages the property appears in AI answers vs. where it is missing, and queue content production to fill gaps

### Growth Engine — On-Site Optimization

- Crawl / audit loop: regular automated analysis of all pages on each property site
- Issue detection: thin content, weak metadata, broken links, poor heading hierarchy, missing schema, low-intent titles
- Safe auto-fix execution for low-risk improvements (metadata, internal links, schema additions)
- Human task generation for higher-risk changes (copy rewrites, structural changes)
- CTA and conversion element audit: placement, copy, mobile behavior

### Growth Engine — Measurement & Feedback Loop

- Search Console integration per property — **separate properties per language/locale** where meaningful (e.g., English global + zh-CN + ko)
- Analytics integration: engagement, scroll, CTA events, inquiry conversions — **segmented by language/country of visitor**
- Ranking and content performance dashboard: what's growing, what's stagnant, what needs cutting — **broken down by language version**
- AI surface monitoring: track appearances in Perplexity, ChatGPT, AI Overviews for target queries — run queries **in each target language** to monitor per-language visibility
- Performance signal feeding back into content prioritization (double down on what works), including **language × keyword combinations** — e.g., if Korean-language content on a Bali property is converting, accelerate Korean content production for that property

### Growth Engine — Off-Site / Mention Generation

- External mention audit: identify where the property is and isn't cited across the web
- Opportunity list generation: missing directories, travel publications, local guides, comparison pages
- Review platform coverage check: Google, TripAdvisor, OTA reviews — volume, recency, sentiment
- Discussion and community footprint: Reddit (`r/bali`, `r/LuxuryTravel`, destination subreddits), travel forums
- Task escalation for outreach: backlinks, PR opportunities, listing submissions — surfaced as actionable items for human follow-up

### Operator Console (Internal)

- Multi-property dashboard: status, phase, engine activity per villa
- Trial and activation tracking: trial start → 30-day metrics → conversion decision
- Content queue and review interface: approve, edit, reject generated content
- Issue and task management: auto-detected issues and human tasks per property
- Performance summaries for owner reporting (the "proof of movement" artifact)

### Billing & Subscription

- Trial activation flow (free 30 days, no credit card required initially)
- Subscription conversion: trial → $349/month paid
- Payment processing integration (Stripe or equivalent)
- Subscription management: pause, cancel, upgrade paths

---

*Last updated: April 2026. Next step: break each phase into detailed tasks, acceptance criteria, and milestones when you're ready to execute.*
