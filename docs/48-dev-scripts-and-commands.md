# Veradmin Development Scripts and Commands

Version: 1.0  
Status: Active  
Owner: Engineering / Delivery  
Applies To: package scripts, local utilities, migration/seed flow, and standard developer commands

---

## 1. Purpose of This Document

This document defines the canonical command surface for the Step 2 scaffold.
The goal is a small command set that covers normal work without command sprawl.

---

## 2. Recommended Script Names

### Install

```bash
pnpm install
```

### Environment health

```bash
pnpm doctor
```

### Run UI in browser-only development mode

```bash
pnpm dev:web
```

### Run the real desktop shell in development

```bash
pnpm dev:desktop
```

### Lint

```bash
pnpm lint
```

### Typecheck

```bash
pnpm typecheck
```

### Run tests once

```bash
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Generate migration files from schema changes

```bash
pnpm db:generate
```

### Apply migrations to the local dev database

```bash
pnpm db:migrate
```

### Seed a realistic demo fleet

```bash
pnpm db:seed:demo
```

### Seed an edge-case fleet

```bash
pnpm db:seed:edge
```

### Reset local development state

```bash
pnpm dev:reset
```

### Build the static frontend output for desktop packaging

```bash
pnpm build:web
```

### Build the desktop package

```bash
pnpm build:desktop
```

### Print the canonical repo tree

```bash
pnpm tree
```

---

## 3. Recommended `package.json` Script Block

```json
{
  "scripts": {
    "doctor": "node ./scripts/doctor.mjs",
    "dev:web": "next dev",
    "dev:desktop": "tauri dev",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx ./scripts/db/migrate.ts",
    "db:seed:demo": "tsx ./scripts/db/seed-demo.ts",
    "db:seed:edge": "tsx ./scripts/db/seed-edge.ts",
    "dev:reset": "bash ./scripts/reset-local-dev.sh",
    "build:web": "next build",
    "build:desktop": "pnpm build:web && tauri build",
    "tree": "bash ./scripts/print-repo-tree.sh"
  }
}
```

This script block is intentionally narrow.
It covers the scaffold without pretending later phases are already implemented.

---

## 4. Script Responsibilities

### `doctor`
Checks the local environment and expected file presence.
It should fail clearly if required tooling or files are missing.

### `dev:web`
Fast UI-only loop.
Useful when native behavior is not under active work.

### `dev:desktop`
Canonical daily-driver development path.
Runs the app as the actual desktop product shell.

### `db:migrate`
Applies checked-in migrations to the current local database path.

### `db:seed:*`
Loads controlled, named scenario fleets.
This keeps development grounded in realistic states.

### `dev:reset`
Deletes disposable local state under `.veradmin-dev/` and recreates the development directories.
It must never target production app-data paths.

### `build:desktop`
Builds the frontend and then packages the desktop shell.

---

## 5. Recommended Helper Scripts

The scaffold includes these helper files:

- `scripts/doctor.mjs`
- `scripts/reset-local-dev.sh`
- `scripts/print-repo-tree.sh`
- `scripts/db/migrate.ts`
- `scripts/db/seed-demo.ts`
- `scripts/db/seed-edge.ts`

These are intentionally lightweight placeholders so later steps can fill in real schema and seed behavior without moving files around.

---

## 6. Command Discipline Rules

Rules for the scaffold:

1. Prefer one obvious script over many overlapping aliases.
2. Do not invent screen-specific scripts in Step 2.
3. Keep reset commands safe and explicitly scoped.
4. Keep migration and seed flows separate.
5. Treat desktop-shell development as a first-class command.

---

## 7. Script Definition of Done

The script surface is complete when:

- a contributor can install, run, reset, seed, test, and build without tribal knowledge
- local reset is safe and deterministic
- demo and edge fixtures are first-class flows
- desktop development is easier than ad hoc workarounds

---

## 8. Final Statement

Good scripts reduce friction without hiding architecture.
The command surface should feel calm, predictable, and hard to misuse.
