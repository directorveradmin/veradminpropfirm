# Veradmin Development Setup and Repository Structure

Version: 1.0  
Status: Active  
Owner: Engineering / Architecture / Delivery  
Applies To: Local development environment, repository organization, coding workflow, scripts, seed data, and implementation discipline

---

## 1. Purpose of This Document

This document defines how the Veradmin codebase should be set up and organized.

Its purpose is to make implementation consistent, fast to understand, and safe to extend.
A strong product can still become hard to build if the repository is chaotic, the setup is unclear, or the local workflow is inconsistent.

This document exists so that:
- a contributor knows how to run the project,
- the codebase mirrors the product architecture,
- important boundaries stay visible,
- and the project remains maintainable as the docs become code.

---

## 2. Setup Mission

The development setup and repo structure should optimize for:

1. local reliability
2. fast onboarding
3. architecture clarity
4. testability
5. deterministic setup
6. low-friction daily development
7. future extensibility without structural drift

The repo should feel like the product: disciplined, clear, and calm.

---

## 3. Core Technology Direction

Veradmin v1 should be built around:

- Tauri for desktop packaging
- Next.js for application UI/runtime
- Tailwind CSS for styling
- Shadcn/UI for base component primitives
- SQLite as the local-first data store
- Drizzle ORM for schema and query organization
- Zod for validation
- Vitest for unit/integration testing
- Playwright later for end-to-end workflows if needed

These choices reflect the current doctrine: desktop-first, local-first, reliable, and future-extensible.

---

## 4. Development Environment Requirements

Recommended local prerequisites:
- Node.js current supported version for the app
- package manager selected and standardized
- Rust toolchain for Tauri
- SQLite support through chosen driver/tooling
- Git
- editor setup with linting and formatting support

The exact versions should be pinned in the repo documentation and checked periodically.

The goal is not to chase the newest version at all times.
The goal is stable local reproducibility.

---

## 5. Repository Root Structure

Recommended high-level repo shape:

- `app/` or equivalent UI routing layer
- `components/`
- `features/`
- `lib/`
- `db/`
- `docs/`
- `scripts/`
- `tests/`
- `public/`
- `src-tauri/`
- configuration files at repo root

This structure should reflect domain logic, not only framework defaults.

---

## 6. Role of Each Major Directory

### 6.1 `docs/`
Contains the repo-canonical specifications and architecture guidance.

This is where the living product truth lives before and during implementation.

### 6.2 `app/`
Contains route-level UI surfaces and composition points.

Examples:
- dashboard route
- accounts route
- journal route
- payouts route
- settings route

### 6.3 `components/`
Contains shared presentational and interaction components.
This is not the place for deep domain logic.

### 6.4 `features/`
Contains domain-focused application modules.

Recommended feature areas:
- dashboard
- accounts
- journal
- payouts
- alerts
- settings
- calendar
- backups
- rule-engine surfaces

This layer should be closer to business capability than generic components.

### 6.5 `lib/`
Contains shared logic, utilities, domain helpers, and cross-feature services.

This may include:
- rule engine core
- state derivation helpers
- formatting helpers
- date/time helpers
- validation utilities

### 6.6 `db/`
Contains schema, migrations, seed logic, and database access boundaries.

Recommended contents:
- schema definitions
- migration files
- seed scripts
- query helpers or repositories
- data fixtures for testing

### 6.7 `scripts/`
Contains development and maintenance scripts.

Examples:
- seed local database
- reset local dev state
- run backup simulation
- export test data
- validate fixtures

### 6.8 `tests/`
Contains automated tests and test fixtures.

May include:
- unit
- integration
- e2e
- fixtures
- seeded fleet datasets

### 6.9 `src-tauri/`
Contains Tauri-specific shell, configuration, and platform behavior.

This layer should stay focused on desktop shell responsibilities, not product logic.

---

## 7. Recommended Domain-Oriented Feature Structure

Within `features/`, organize by domain rather than by raw technical layer.

Example pattern:
- `features/dashboard/`
- `features/accounts/`
- `features/journal/`
- `features/payouts/`
- `features/alerts/`
- `features/calendar/`
- `features/settings/`

Within each feature, recommended internal substructure may include:
- components
- hooks
- services
- mappers
- validators
- view models

This keeps feature code near the domain it serves.

---

## 8. Rule Engine Placement

The rule engine is the operational core and should be given a clear home.

Recommended structure:
- `lib/rule-engine/` or equivalent domain core location

Possible substructure:
- evaluator
- calculators
- mode assignment
- restrictions
- simulation
- explanation builders
- fixtures/tests

The rule engine should not live inside a random UI feature folder.
UI depends on it.
It should not depend on UI.

---

## 9. Database Structure Recommendations

Recommended `db/` structure:
- `schema/`
- `migrations/`
- `seeds/`
- `repositories/` or query layer
- `fixtures/`

The database layer should distinguish:
- raw schema
- migration logic
- development seed data
- test fixtures
- application-facing access patterns

This prevents drift between development, testing, and runtime assumptions.

---

## 10. Docs Structure

The `docs/` directory should remain first-class.

Recommended conventions:
- numbered files for reading order
- clear titles
- version and status headers
- active vs draft distinction
- update docs when behavior materially changes

The docs are not decoration.
They are implementation guidance.

---

## 11. Configuration and Environment Files

The repo should keep configuration disciplined.

Recommended files may include:
- package manager lockfile
- formatter config
- linter config
- TypeScript config
- app config
- Tauri config
- environment example file

Rules:
- commit safe example configs
- never rely on undocumented local tweaks
- environment variables should be minimal in v1 where possible

The fewer hidden setup assumptions, the better.

---

## 12. Local Development Scripts

The repo should expose a clear small set of commands for common work.

At minimum, document commands for:
- install dependencies
- run app in development mode
- run desktop shell locally
- run tests
- run linting
- seed local database
- reset local dev state
- build release package

The exact command names matter less than consistency and documentation.

---

## 13. Seed Data and Fixtures

Veradmin should ship with controlled dev/test fixtures.

Recommended fixture categories:
- clean fleet
- edge-case fleet
- messy fleet

These should be easy to load from scripts and referenced in testing docs.

Local development without realistic data leads to weak product decisions.

---

## 14. State and Data Flow Boundaries

The repo structure should make these boundaries visible:

- stored data vs derived data
- domain logic vs UI logic
- feature-level composition vs shared design system components
- desktop shell vs product logic
- documentation vs implementation

When these boundaries blur, the codebase becomes hard to trust.

---

## 15. Coding Workflow Expectations

Recommended development workflow:
1. identify relevant spec doc
2. clarify domain behavior
3. implement smallest correct slice
4. write/update tests
5. validate against seeded data
6. review UI against UX/copy specs
7. update docs if behavior changed meaningfully

The workflow should be spec-aware, not code-only.

---

## 16. Branching and Change Discipline

Even in a small project, change discipline matters.

Recommended habits:
- work in focused branches where practical
- avoid giant mixed-purpose commits
- keep logic, UI, and migration changes understandable
- reference relevant docs in commit or PR notes when helpful
- do not merge behavior changes that contradict repo docs silently

The codebase should tell a readable story.

---

## 17. Definition of Done for Repository Structure and Setup

This spec is satisfied when:

1. A contributor can clone the repo and understand the major directories quickly.
2. Local development setup is repeatable and documented.
3. Domain logic has a clear home.
4. Database, docs, features, tests, and desktop shell are cleanly separated.
5. Seed data and test fixtures are easy to run.
6. The repo structure mirrors product architecture instead of hiding it.
7. The project feels maintainable before it becomes large.

---

## 18. Anti-Patterns to Avoid

Avoid:
- dumping unrelated logic into `utils`
- mixing domain logic deeply into UI components
- scattering database queries across random screens
- hiding core behavior in framework-only folders
- treating docs as stale side files
- relying on tribal knowledge for setup
- making Tauri shell code the home of business rules
- growing a repo shape that contradicts the product architecture

---

## 19. Future Considerations

Potential later additions:
- monorepo split if product grows
- component documentation site
- generated schema docs
- CI pipeline documentation
- contribution guidelines
- architecture decision records index
- sync module separation if cloud is added later

These are valuable later, but v1 must first establish a disciplined, understandable local codebase.
