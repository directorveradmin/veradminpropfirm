# VERADMIN PRO

VERADMIN PRO is a **desktop-first, local-first account operations system** for managing prop-firm trading accounts from a single command center.

It is built to help the user:
- manage prop firms and the accounts that belong to them,
- understand and preserve account rule profiles,
- monitor operational posture, restrictions, and status,
- log trades manually,
- track payout readiness and payout history,
- review alerts and timing pressure,
- and continue the product in a structured, maintainable way.

This repository is **not** a greenfield prototype.  
It already contains a working technical foundation and a growing scaffold for the full product.

---

## What VERADMIN PRO is

VERADMIN PRO is:

- a **desktop application**
- a **local SQLite-backed system**
- a **rule-driven account management product**
- a **manual operations and decision-support tool**
- a **single-user, local-first workspace** for prop-firm account operations

## What VERADMIN PRO is not

VERADMIN PRO is **not**:

- an auto-trading system
- a broker execution platform
- a market terminal
- a copy-trading tool
- a cloud-first back office

The app does **not** place trades.  
Its purpose is to help the user manage accounts, rules, states, and workflows safely and clearly.

---

## Current build status

The repository is currently in an **active scaffold + implementation phase**.

That means:

- the architecture direction is real,
- the repository structure is already meaningful,
- the database boundary already exists,
- the desktop boundary already exists,
- and the next work is to **fill the product surface** without breaking what already works.

This is the correct mindset for the repo:

> **Keep what works. Expand what is missing. Do not start over.**

---

## Current architecture

VERADMIN PRO currently follows this general direction:

- **Desktop shell:** Tauri
- **Front end:** Next.js App Router + React + TypeScript
- **Persistence:** SQLite
- **Database layer:** Drizzle ORM + repository boundary
- **Validation:** Zod
- **Testing direction:** Vitest / integration / end-to-end structure
- **Project style:** local-first, rule-driven, screen-oriented build

The most important design rule is:

> **Business truth must not live in the UI.**

The UI should present truth, not invent it.

That means:
- page components should stay thin,
- feature modules should stay modular,
- services should orchestrate,
- repositories should persist,
- and central rule behavior should remain authoritative.

---

## Core product concepts

### The account is the central object

Everything in VERADMIN PRO connects back to the account:

- prop firm
- rule profile
- funded amount / challenge type
- status
- journal history
- payout readiness
- alerts
- calendar timing
- performance and analytics

### Shared account status model

The product uses four primary statuses:

- **ACTIVE**
- **RESTING**
- **WAITING**
- **CLOSED**

These are not decorative labels.  
They are part of the product’s operating model and should stay consistent across pages, cards, tables, and future workflows.

### Approved UI color language

The current approved palette for the front end is:

- `#000000` — primary black / strong neutral
- `#AAC240` — active / positive / operational green
- `#BCCDB6` — soft neutral support surface
- `#EFF3A2` — resting / caution-light
- `#FFE2AD` — waiting / attention
- `#DC143C` — destructive / closed / critical

Pages and components should use shared tokens rather than inventing one-off color meanings.

---

## Repository structure

This repo already contains the main boundaries needed for the product:

```text
db/            Database client, schema, migrations, repositories, seeds, fixtures
docs/          Product, architecture, rule, workflow, and build documentation
public/        Static assets
scripts/       Local development and database scripts
src-tauri/     Desktop shell boundary
src/           App routes, shared components, features, hooks, libraries
tests/         Test structure for unit, integration, and later e2e coverage
```

### Key `src/` boundaries

```text
src/
  app/         Next.js App Router entry points and routes
  components/  Shared layout and UI components
  features/    Page-specific and domain-facing front-end modules
  hooks/       Reusable client hooks
  lib/         Domain/platform/services/validation/view-models
```

### Key `db/` boundaries

```text
db/
  schema/        Database schema modules
  migrations/    Migration history
  repositories/  Persistence boundaries
  seeds/         Seed data
  fixtures/      Supporting test/dev fixtures
  client.ts      Database client boundary
```

---

## Product surface

The planned product surface for VERADMIN PRO includes these major areas:

- **Dashboard**
- **Accounts Engine**
- **Account Detail**
- **Journal**
- **Calendar**
- **Payouts**
- **Alerts**
- **Analytics**
- **Settings**
- **Backup / import-export / maintenance tooling**

Some of these areas are currently scaffolded more heavily than others.  
The intended direction is to build them **top down**, starting from the front pages and shell, then filling the supporting service, repository, and database layers in a controlled order.

---

## Local development

### Prerequisites

You should have:

- Node.js
- pnpm
- Rust / Cargo
- Tauri prerequisites for your platform

### Install dependencies

```bash
pnpm install
```

### Run the doctor check

```bash
pnpm doctor
```

### Run the web app

```bash
pnpm dev:web
```

### Run the desktop app

```bash
pnpm dev:desktop
```

---

## Database commands

Generate Drizzle artifacts:

```bash
pnpm db:generate
```

Apply migrations:

```bash
pnpm db:migrate
```

Seed demo data:

```bash
pnpm db:seed:demo
```

Seed edge-case data:

```bash
pnpm db:seed:edge
```

Reset local development state:

```bash
pnpm dev:reset
```

---

## Quality and build commands

Type-check:

```bash
pnpm typecheck
```

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Build the web app:

```bash
pnpm build:web
```

Build the desktop app:

```bash
pnpm build:desktop
```

Print the repository tree:

```bash
pnpm tree
```

---

## Documentation guidance

The `docs/` folder contains the working product and architecture documentation for the repo.

Use the docs to understand:
- product doctrine,
- architecture direction,
- rule engine intent,
- data model direction,
- page ownership,
- workflow expectations,
- and release/build planning.

Recommended reading order for a new developer:

1. product doctrine
2. architecture overview
3. rule engine and operating model
4. data model / repository structure
5. page and navigation docs
6. workflow and mutation docs
7. testing and release docs

---

## Development rules

When working on this repository:

### 1. Do not start over
This repo already has the correct architectural direction.

### 2. Do not move business truth into the UI
The UI should present data, not define core operational meaning.

### 3. Keep pages thin
Route files should compose feature modules and shared components.

### 4. Prefer modular front-end growth
New page work should land in:
- `src/features`
- `src/components`
- `src/lib/view-models`
- `src/lib/services`

not as giant route files.

### 5. Keep repository boundaries explicit
Database access belongs in repositories, not inside components.

### 6. Expand safely
The project should be extended in this order:

1. route skeleton
2. shell
3. shared UI
4. feature modules
5. view-models
6. services
7. repositories
8. database expansion
9. wiring
10. testing
11. release hardening

### 7. Protect what already works
If replacing files, do it intentionally and with backup awareness.  
Do not casually rewrite working foundation files.

---

## Contribution mindset

The most important rule for contributors is:

> **VERADMIN PRO should become more structured over time, not more improvised.**

That means:
- no hidden business logic in the front end,
- no giant pages,
- no accidental architecture drift,
- and no replacing the current stack with a different one unless explicitly approved.

---

## Short summary

VERADMIN PRO is a local-first desktop product for managing prop-firm account operations.

This repository already contains the correct foundation.  
The work now is to **fill the product surface carefully, preserve the architecture, and continue building from the top down**.

