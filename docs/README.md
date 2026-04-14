# Nestino Technical Documentation

Spec-driven documentation for building Nestino with AI-assisted development. Start with [../CLAUDE.md](../CLAUDE.md).

## Index

| Area | Path |
|------|------|
| System (architecture, DB, APIs, env) | [00-system/](./00-system/) — [env-vars.md](./00-system/env-vars.md) |
| Marketing landing | [01-nestino-landing/](./01-nestino-landing/) |
| Growth engine | [02-engine/](./02-engine/) — [architecture](./02-engine/architecture.md), [jobs-spec](./02-engine/jobs-spec.md), [multilingual-spec](./02-engine/multilingual-spec.md), [integrations-spec](./02-engine/integrations-spec.md), [prompt-library](./02-engine/prompt-library.md), [data-model](./02-engine/data-model.md), [seed-data-spec](./02-engine/seed-data-spec.md), [testing-spec](./02-engine/testing-spec.md) |
| Villa sites (tenant app) | [03-villa-sites/](./03-villa-sites/) — [design-spec](./03-villa-sites/design-spec.md), [image-pipeline-spec](./03-villa-sites/image-pipeline-spec.md), [engine-integration](./03-villa-sites/engine-integration.md) |
| Operator console | [04-operator-console/](./04-operator-console/) — [design-spec](./04-operator-console/design-spec.md) |
| Property site plans | [properties/](./properties/) — per-property build specs and content plans |

## Business context

- [../strategy.md](../strategy.md) — GTM, positioning, multilingual strategy  
- [../roadmap.md](../roadmap.md) — phased roadmap

## Suggested write order when extending specs

1. `00-system/*`  
2. All `PRD.md` files  
3. Design + tech specs  
4. `jobs-spec.md`, `prompt-library.md`, `engine-integration.md`  
5. `seed-data-spec.md`, `testing-spec.md`, `image-pipeline-spec.md`, console `design-spec.md` as needed
