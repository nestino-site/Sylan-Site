# Nestino Operator Console — Design Specification

Internal UI for operators: **data-dense**, **desktop-first**, built with **Shadcn UI** + Tailwind. Product workflows: [PRD.md](./PRD.md). Implementation: [tech-spec.md](./tech-spec.md).

---

## Layout structure

### Shell

- **Sidebar (left):** primary navigation; **collapsible** to icon-only on viewports ≥1024px to maximize table width.
- **Top bar:** product name / logo, **global search** (optional MVP: tenant slug search), **user menu** (Clerk `UserButton` + sign out). Do **not** duplicate full tenant context here — tenant context lives on tenant detail.
- **Main content:** scrollable region with consistent horizontal padding (`px-6` / 24px) and max width **full** for tables; **narrow** forms may use `max-w-2xl` centered.

### Tenant detail context

On `/app/tenants/[id]`: **secondary top strip** below global top bar with tenant name, status badge (`trial` / `active` / …), and quick links (open live site, copy subdomain). **Tabs** for Overview, Brand, Site, Languages, Jobs, Content, Issues, Performance (see tech-spec).

---

## Navigation hierarchy

```text
/app                    Dashboard (KPI + shortcuts)
/app/tenants            Tenants list
/app/tenants/new        Onboard (OW1)
/app/tenants/[id]       Tenant detail (tabs)
/app/content-review     Global content queue (OW2)
/app/jobs               Cross-tenant jobs (OW3)
/app/trials             Trials / conversion (OW6)
```

**Sidebar order (recommended):** Dashboard → Tenants → Content review → Jobs → Trials. Group labels: **Operate**, **Content**, **System** (optional).

---

## Data density principles

- **Lists:** **table-first** — Shadcn `DataTable` with sortable columns, row click → detail or `Sheet`.
- **Dashboard:** **cards** for KPI snapshots (2–4 per row on xl); each card: metric, label, optional delta vs prior period.
- **Content review:** **full-width** workspace (see below); avoid cramming preview into a narrow column on desktop.
- **Forms (OW1):** single column, grouped fieldsets with `Card` headers; sticky footer with primary submit on long forms.

---

## Content review UX (OW2)

### Layout

- **Desktop (≥1280px):** **split pane**
  - **Left (60–65%):** scrollable **BlockRenderer** preview of `body_json.blocks` (same schema as [engine-integration.md](../03-villa-sites/engine-integration.md)).
  - **Right (35–40%):** sticky panel with metadata — tenant, page slug, `language_code`, `page_type`, version number, `source`, timestamps; **Approve** / **Reject** primary actions; optional **Publish live** secondary (two-step per tech-spec).
- **Tablet:** stack preview above metadata; actions fixed bottom bar.
- **Diff mode:** when a **prior published** version exists (`is_current` + `published` for same `page_id` + `language_code`):
  - Show **side-by-side** or **inline diff** of text blocks (paragraph, h2, FAQ q/a); for structural changes, show a **change summary** list (e.g. “FAQ block added”).
- **New page** (no prior published): single preview labeled **“New page”** — no diff UI.

### Actions

- **Reject:** require short reason (textarea or select + optional note); set status per PRD.
- **Approve:** optional confirmation dialog if “Publish live” is bundled (configurable).

---

## Dashboard widgets (`/app`)

- **KPI cards:** large number, caption, optional **trend** (↑/↓ % vs last 7d) — no fabricated data; use live aggregates.
- **Shortcuts:** buttons/links to Content review (count badge if `pending_review` > 0), Failed jobs, Trials ending in 7 days.
- **Charts (performance):** line or area for GSC impressions/clicks over 28d; bar chart for inquiries by `language_code` — reuse Performance tab patterns for consistency.

---

## Shadcn component mapping

| Workflow | Shadcn primitives |
|----------|-------------------|
| Tenants, jobs, issues, trials lists | `DataTable`, `DropdownMenu` (row actions), `Badge` (status) |
| Tenant detail tabs | `Tabs`, `TabsList`, `TabsContent` |
| Onboarding / settings forms | `Form`, `Input`, `Select`, `Textarea`, `Switch`, `Card` |
| Content review | `ScrollArea`, `Separator`, `Button`, `Alert` (warnings), optional `ResizablePanelGroup` for split pane |
| Job errors / payloads | `Sheet` or `Dialog` for expandable error text; `Code` / monospace for truncated JSON |
| Destructive actions | `AlertDialog` (key rotation, delete) |
| Toasts | `Sonner` or Shadcn `Toast` for save / job trigger feedback |
| Filters | `Popover` + `Command` or `Select` for tenant, status, job type |

---

## Responsive notes

- **Primary target:** desktop **1280px+** — full sidebar + split-pane review.
- **Tablet (768–1279px):** collapsible sidebar; stacked content review acceptable.
- **Mobile:** not required for MVP; if routed on small screens, show a **“Use desktop”** banner rather than fully optimizing complex tables.

---

## Visual tone

- **Neutral professional** — align with Shadcn default zinc/slate; avoid villa-marketing luxury styling (console is internal tooling).
- **Status colors:** consistent semantic mapping — success (active/complete), warning (pending/retry), destructive (failed/dead), muted (paused).

---

## Related

- [PRD.md](./PRD.md)  
- [tech-spec.md](./tech-spec.md)  
- [../03-villa-sites/engine-integration.md](../03-villa-sites/engine-integration.md) — `body_json` / `BlockRenderer`  
- [../00-system/data-model.md](../00-system/data-model.md)
