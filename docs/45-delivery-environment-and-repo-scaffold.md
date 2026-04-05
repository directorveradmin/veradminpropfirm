# Veradmin Delivery Environment and Repo Scaffold

Version: 1.0  
Status: Active  
Owner: Engineering / Architecture / Delivery  
Applies To: Step 2 delivery environment, repository scaffold, desktop delivery setup, local development flow, and implementation discipline

---

## 1. Purpose of This Document

This document completes Step 2 of 12 for Veradmin.

Its job is to turn the already-frozen doctrine, architecture, and operating model into an implementation-ready delivery scaffold.
It does **not** redesign the product.
It does **not** implement later systems such as the full rule engine, full data model, or major screens.
It defines the shell those later steps must grow inside.

---

## 2. Step 2 Scope

This step covers:

- repository structure
- local development environment
- Tauri + Next.js desktop delivery setup
- database and tooling boundaries
- development scripts and commands
- implementation-ready folder structure
- setup documentation
- definition of done for the scaffold

This step does **not** cover:

- full rule engine implementation
- final schema implementation
- screen implementation beyond scaffold placeholders
- advanced testing coverage
- release packaging hardening beyond the baseline scaffold

---

## 3. Governing Step 2 Decisions

### 3.1 Desktop shell remains primary
Veradmin is delivered as a Tauri desktop application.
The desktop shell is the real product container.
The browser runtime is a development convenience, not the product identity.

### 3.2 Local-first remains primary
SQLite remains the authoritative local store.
The app must be able to run and persist state locally without cloud dependency.

### 3.3 Next.js is used as the UI runtime, not as a server-first product dependency
The UI is scaffolded with Next.js App Router conventions under `src/app/`.
For desktop production packaging, the frontend is treated as a static build consumed by Tauri.
That means the scaffold should not depend on server actions, required route handlers, or browser-only product assumptions for core truth.

### 3.4 Tauri owns native concerns, not business truth
Tauri is responsible for:

- window/container lifecycle
- local file-system access
- app-data path resolution
- backup/export/import native boundaries
- native command bridge where needed

Tauri is **not** the home of rule semantics, account-state interpretation, or tactical product logic.

### 3.5 Domain truth stays in TypeScript-side domain modules
The future rule engine, application services, validation, and view-model shaping remain in the TypeScript application core.
The repo scaffold therefore gives strong first-class homes to:

- `src/lib/domain/`
- `src/lib/services/`
- `src/lib/validation/`
- `src/lib/view-models/`

### 3.6 Database ownership is explicit
The scaffold uses a dedicated root `db/` boundary rather than scattering persistence logic through UI folders.
This satisfies the existing repo-shape guidance while making database ownership obvious from the root.

### 3.7 One repo, one desktop product, no monorepo split yet
Step 2 chooses a single-repo, single-desktop-app structure.
A monorepo split is intentionally delayed until real growth justifies it.

---

## 4. Concrete Scaffold Choice

The recommended concrete repo shape for Step 2 is:

```text
veradmin/
  docs/
  public/
  scripts/
  src/
    app/
    components/
    features/
    hooks/
    lib/
      domain/
      platform/
      services/
      validation/
      view-models/
  db/
    fixtures/
    migrations/
    repositories/
    schema/
    seeds/
  tests/
    fixtures/
    integration/
    unit/
  src-tauri/
  package.json
  next.config.mjs
  drizzle.config.ts
  tsconfig.json
  .env.example
  .gitignore
  .npmrc
```

This is the Step 2 canonical scaffold.

---

## 5. Why `src/app/` Instead of a Root `app/`

Earlier docs allowed `app/` or equivalent.
Step 2 resolves that flexibility concretely by choosing `src/app/`.

Reasons:

- keeps TypeScript application code under one top-level source boundary
- aligns with the architecture suggestion that grouped app code live under `src/`
- keeps root-level repo concerns visually separate from application code
- makes future domain and feature boundaries easier to scan

This is a structure decision, not a change in product philosophy.

---

## 6. Tauri + Next.js Delivery Pattern

### Development mode
During local development:

- Next.js runs as the UI dev server
- Tauri points to that dev server for the desktop shell
- the developer can run web-only or desktop-shell development depending on the task

### Production desktop build
For production desktop packaging:

- Next.js builds a static desktop frontend output
- Tauri packages that frontend into the desktop shell
- the packaged app uses local persistence and native boundaries through Tauri

### Consequence
This means the implementation scaffold must avoid coupling core product behavior to always-on server runtime assumptions.

---

## 7. Database and Tooling Boundary Decision

Step 2 freezes the following boundary:

### Canonical schema authority
`db/schema/` is the canonical home for typed schema definitions.

### Migration authority
`db/migrations/` stores generated and reviewed SQL migrations committed to the repo.

### Seed and fixture authority
`db/seeds/` and `db/fixtures/` store controlled fleet datasets for development and testing.

### Application-facing access boundary
`db/repositories/` owns repository-level persistence contracts and query organization.
UI code must not talk directly to raw tables.

### Runtime desktop bridge
`src/lib/platform/` and `src-tauri/src/commands/` form the platform boundary where the desktop shell can expose native capabilities such as resolved storage paths, backup helpers, or future guarded database operations.

### Important practical note
Because Veradmin is desktop-first and not server-first, the scaffold intentionally keeps persistence behind explicit boundaries.
This prevents accidental dependence on Next server-only behavior that would break or complicate the packaged desktop product.

---

## 8. Rules for What Lives Where

### `src/app/`
Route composition, layouts, top-level screen entry points, and shell framing.
No deep domain truth here.

### `src/components/`
Reusable presentational and interaction components.
No hidden tactical logic here.

### `src/features/`
Feature-scoped UI/application modules such as dashboard, accounts, journal, payouts, alerts, calendar, and settings.
This is where feature composition belongs.

### `src/lib/domain/`
Future deterministic account interpretation core.
This is where rule-engine-first implementation will live in later steps.

### `src/lib/services/`
Workflow orchestration across validation, repositories, events, and derived refreshes.

### `src/lib/validation/`
Zod schemas and data contract validation.

### `src/lib/view-models/`
Screen-friendly shaping of derived truth.

### `src/lib/platform/`
TypeScript-side desktop/runtime bridge wrappers and contracts.

### `db/`
Persistence model, migrations, fixtures, seed flows, and repository contracts.

### `src-tauri/`
Desktop shell only.
No business-rule sprawl here.

---

## 9. Local Data Path Strategy

Step 2 chooses a dual-mode path strategy:

### Development
Default local dev data should be easy to reset and inspect.
Use a repo-local dev path such as:

```text
./.veradmin-dev/veradmin.dev.sqlite
```

This keeps development deterministic and disposable.

### Packaged desktop runtime
The packaged desktop app should resolve its persistent SQLite location from the platform app-data directory through Tauri.

### Why this matters
This gives development repeatability without confusing the future production storage model.

---

## 10. Environment Strategy

Environment variables should stay minimal in v1.
The scaffold should rely on explicit local defaults rather than hidden configuration.

Recommended environment variables for the scaffold:

- `VERADMIN_ENV`
- `VERADMIN_DB_PATH`
- `VERADMIN_FIXTURE_SET`
- `NEXT_PUBLIC_VERADMIN_APP_NAME`

Anything beyond that should be justified later.

---

## 11. Standard Script Surface

The scaffold exposes a small stable command set:

- install dependencies
- run web development mode
- run desktop development mode
- lint
- typecheck
- test
- generate migrations
- apply migrations
- seed demo data
- seed edge-case data
- reset local dev state
- build web output
- build desktop package
- run environment doctor

The exact script names are defined in `48-dev-scripts-and-commands.md` and mirrored in the scaffold examples.

---

## 12. Step 2 Deliverable List

Step 2 is complete when the repo scaffold includes:

1. a canonical repo tree
2. a documented local setup path
3. Tauri + Next.js baseline configuration direction
4. explicit database boundaries
5. scripts for common local workflows
6. placeholder platform bridge structure
7. placeholder docs and folders for later implementation
8. a clean handoff into Step 3

---

## 13. Non-Negotiables Preserved From Earlier Steps

This scaffold preserves the following earlier decisions:

- Veradmin remains desktop-first
- Veradmin remains local-first
- the rule engine remains a separate deterministic core
- lifecycle, mode, permissions, and business context remain distinct
- the repo must reflect architecture instead of framework sprawl
- setup must be disciplined and repeatable

---

## 14. Final Step 2 Statement

Step 2 does not attempt to make Veradmin feature-complete.
It makes Veradmin buildable.

The scaffold defined here is intentionally narrow, implementation-ready, and doctrine-aligned so that Step 3 can begin real schema and profile work without structural drift.
