# Veradmin Repository Structure and Boundaries

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering  
Applies To: repository organization, code ownership, database boundaries, native boundary placement, and implementation discipline

---

## 1. Purpose of This Document

This document turns the repo-structure guidance into one concrete Step 2 implementation scaffold.

---

## 2. Canonical Step 2 Repo Tree

```text
veradmin/
  docs/
    02-mvp-scope.md
    03-architecture-decisions.md
    16-dev-setup-and-repo-structure.md
    35-navigation-map-and-user-flows.md
    37-implementation-sequencing-and-build-order.md
    38-operating-model-overview.md
    41-rule-evaluation-order.md
    45-delivery-environment-and-repo-scaffold.md
    46-local-development-environment.md
    47-repository-structure-and-boundaries.md
    48-dev-scripts-and-commands.md
    49-scaffold-definition-of-done.md
    handoff_step2_to_step3.md
  public/
  scripts/
    db/
      migrate.ts
      seed-demo.ts
      seed-edge.ts
    doctor.mjs
    print-repo-tree.sh
    reset-local-dev.sh
  src/
    app/
      (shell)/
      layout.tsx
      page.tsx
      globals.css
    components/
      ui/
      layout/
      feedback/
    features/
      dashboard/
      accounts/
      journal/
      payouts/
      alerts/
      calendar/
      settings/
      backups/
    hooks/
    lib/
      domain/
        rules/
        modes/
        payouts/
        alerts/
        accounts/
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
    src/
      commands/
      main.rs
      lib.rs
    tauri.conf.json
    Cargo.toml
  .env.example
  .gitignore
  .npmrc
  drizzle.config.ts
  next.config.mjs
  package.json
  tsconfig.json
```

---

## 3. Root-Level Ownership

### `docs/`
Repo-canonical implementation guidance.
This remains first-class.

### `public/`
Static frontend assets only.
No business logic.

### `scripts/`
Operational development scripts.
Short, readable, and reset-friendly.

### `src/`
All TypeScript application code.
This keeps product code visually distinct from repo and desktop-shell concerns.

### `db/`
Single clear persistence boundary.
No random schema duplication elsewhere.

### `tests/`
Automated test organization and reusable fixture support.

### `src-tauri/`
Native desktop shell boundary only.

---

## 4. `src/` Boundary Model

### `src/app/`
Route composition and shell-level pages.
This is where the app is assembled, not where core truth is invented.

### `src/components/`
Reusable UI primitives and shared presentational pieces.
Examples:

- chrome layout elements
- common empty states
- badges
- surface containers

### `src/features/`
Feature-scoped modules.
This is the correct home for screen-specific composition and interaction handling.

### `src/hooks/`
Reusable hooks with limited scope.
Do not allow this folder to become a hidden business-logic graveyard.

### `src/lib/domain/`
Future deterministic operational core.
This will house rule calculations and state interpretation.

### `src/lib/platform/`
TypeScript-side wrappers around native desktop capabilities.
Examples later may include:

- resolved storage paths
- backup/export helpers
- desktop environment detection
- guarded invocation helpers

### `src/lib/services/`
Workflow orchestration.
Examples later may include:

- log trade event
- recalculate account state
- generate follow-up alerts
- emit audit memory

### `src/lib/validation/`
Zod schemas and shared contracts.

### `src/lib/view-models/`
Prepared UI-facing shapes built from deterministic truth.

---

## 5. `db/` Boundary Model

### `db/schema/`
Canonical typed schema definitions.

### `db/migrations/`
Generated and reviewed migration files committed to the repo.

### `db/seeds/`
Seed definitions and reusable seeding helpers.

### `db/fixtures/`
Representative fleet datasets:

- clean
- edge-case
- messy

### `db/repositories/`
Persistence access boundaries.
Application code should depend on repositories or repository contracts, not on table-level SQL scattered through features.

---

## 6. `src-tauri/` Boundary Model

`src-tauri/` should stay small and purposeful.

Correct responsibilities:

- app bootstrapping
- native configuration
- path resolution
- native command registration
- local backup/export/import helpers
- native logging or diagnostics hooks where justified later

Incorrect responsibilities:

- account mode decisions
- payout semantics
- alert policy
- rule evaluation order
- UI-specific view logic

---

## 7. Next.js Boundary Rule

The Step 2 scaffold assumes Next.js is used for UI composition and static desktop delivery.

Therefore:

- do not make core product truth depend on server actions
- do not make the domain core depend on route handlers
- do not bury critical application logic inside framework-only folders

The frontend shell is important, but it is not the canonical home of Veradmin’s business truth.

---

## 8. Database Tooling Boundary Rule

Drizzle is the schema and migration authority for the scaffold.
SQLite remains the data store.
Repository code remains the application-facing persistence surface.

This gives Step 3 a clean place to add the real schema without arguing later about where facts, migrations, and fixtures belong.

---

## 9. Test Boundary Rule

Use:

- `tests/unit/` for deterministic calculations and validators
- `tests/integration/` for repository/service and workflow slices
- `tests/fixtures/` for reusable scenario datasets

Do not bury important tests under random feature folders if they are meant to validate cross-feature truth.

---

## 10. Repo Tree Definition of Done

The structure is correct when:

1. a contributor can find docs, platform code, persistence, and app code instantly
2. UI folders do not hide domain truth
3. persistence is not scattered across screens
4. Tauri remains a shell boundary
5. later steps have obvious homes to build into

---

## 11. Final Statement

The repo tree should read like the architecture.
If someone has to guess where a rule, repository, or platform concern belongs, the scaffold is not clean enough.
