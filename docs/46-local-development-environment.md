# Veradmin Local Development Environment

Version: 1.0  
Status: Active  
Owner: Engineering / Delivery  
Applies To: local machine setup, developer onboarding, daily development workflow, and repeatable local bootstrapping

---

## 1. Purpose of This Document

This document defines the local development environment for the Veradmin scaffold.
It is intentionally small, explicit, and repeatable.

---

## 2. Required Tooling

The scaffold assumes the following local tooling is installed and working:

- Node.js LTS pinned by the repo during initialization
- one standardized package manager (`pnpm` recommended for this scaffold)
- Rust stable toolchain for Tauri
- platform-specific Tauri prerequisites
- Git
- a code editor with TypeScript, linting, and formatting support

The repo should pin exact versions during initialization rather than depending on memory.

---

## 3. Local Development Modes

### Web-only mode
Use when working on UI composition or non-native layout issues.

### Desktop-shell mode
Use when working on the real Veradmin product container, local persistence flow, app paths, or native workflows.

### Test/fixture mode
Use when validating domain, repository, and workflow behavior against controlled fleet states.

---

## 4. Recommended First-Time Local Setup

### 4.1 Clone and enter repo

```bash
git clone <repo-url> veradmin
cd veradmin
```

### 4.2 Install JavaScript dependencies

```bash
pnpm install
```

### 4.3 Confirm environment health

```bash
pnpm doctor
```

### 4.4 Create local env file from example

```bash
cp .env.example .env.local
```

### 4.5 Reset local dev state for a clean start

```bash
pnpm dev:reset
```

### 4.6 Apply database migrations

```bash
pnpm db:migrate
```

### 4.7 Seed demo fleet

```bash
pnpm db:seed:demo
```

### 4.8 Start desktop development shell

```bash
pnpm dev:desktop
```

---

## 5. Development Data Convention

The scaffold uses a repo-local development directory for disposable local state:

```text
.veradmin-dev/
```

Recommended contents:

```text
.veradmin-dev/
  backups/
  exports/
  logs/
  veradmin.dev.sqlite
```

This makes reset, inspection, and fixture work straightforward.

---

## 6. Minimal Environment File

Example `.env.local` values for the scaffold:

```bash
VERADMIN_ENV=development
VERADMIN_DB_PATH=.veradmin-dev/veradmin.dev.sqlite
VERADMIN_FIXTURE_SET=demo
NEXT_PUBLIC_VERADMIN_APP_NAME=Veradmin
```

Environment should stay intentionally small in v1.

---

## 7. Daily Development Loop

Recommended daily loop:

1. pull latest changes
2. run `pnpm install` if dependencies changed
3. run `pnpm doctor` if environment changed
4. run `pnpm dev:desktop`
5. use seeded fixtures for realistic checks
6. run lint, typecheck, and targeted tests before finishing

---

## 8. Reset and Recovery Flow

When local state becomes confusing:

```bash
pnpm dev:reset
pnpm db:migrate
pnpm db:seed:demo
```

This should return the scaffold to a clean, known-good local development baseline.

---

## 9. Expected Local Commands

```bash
pnpm dev:web
pnpm dev:desktop
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:migrate
pnpm db:seed:demo
pnpm db:seed:edge
pnpm dev:reset
pnpm build:web
pnpm build:desktop
```

---

## 10. Local Setup Definition of Ready

A developer environment is ready when:

- dependencies install cleanly
- `pnpm doctor` passes
- `.env.local` is present
- a local SQLite path is resolved
- migrations apply cleanly
- demo seed data loads
- Tauri launches against the local frontend

---

## 11. Anti-Patterns to Avoid

Avoid:

- hidden machine-only tweaks
- untracked env settings
- ad hoc database file locations
- relying on production app-data paths during early development
- using empty data only
- leaving seed/reset flows undocumented

---

## 12. Final Statement

The local environment should feel calm and recoverable.
If a contributor cannot get back to a clean local state quickly, the scaffold is not disciplined enough.
