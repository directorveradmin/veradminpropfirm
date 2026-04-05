# Veradmin Architecture Decisions

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering  
Purpose: Record the governing architectural decisions for Veradmin so the product is built consistently, cleanly, and with long-term trust

---

## 1. Purpose of This Document

This document records the architectural decisions that shape Veradmin.

It answers questions like:

- Why is the app desktop-first?
- Why is it local-first?
- Why use Tauri instead of a browser-only experience?
- Why is the rule engine isolated?
- Why separate stored data from derived data?
- Why delay cloud sync?
- Why store event history?

The goal is not to collect technical trivia.
The goal is to establish stable architectural intent.

Each major decision should help future contributors understand not only what was chosen, but why.

---

## 2. System Summary

Veradmin is a local-first desktop application for managing a prop-firm fleet.

Its architecture must support:

- fast desktop startup,
- reliable local persistence,
- deterministic rule evaluation,
- mode-driven account state,
- event-aware history,
- future extensibility,
- and optional later sync without compromising local trust.

The architecture must support the product doctrine, not compete with it.

---

## 3. Architectural Goals

The architecture should optimize for:

1. trustworthiness
2. local reliability
3. deterministic behavior
4. maintainability
5. clear domain boundaries
6. testability
7. future extensibility without rewrite
8. low operational friction for a solo user

It should not optimize first for:

- multi-user complexity,
- distributed-first sync,
- public SaaS readiness,
- mobile-first reuse,
- or maximum abstraction for its own sake.

---

## 4. High-Level Architectural Style

**Architecture style:** desktop shell + local application core + deterministic domain engine + persistent local database + future optional sync edge

At a high level, Veradmin consists of:

- desktop runtime shell
- UI layer
- application/service layer
- domain/rule engine
- persistence layer
- import/export/backup utilities
- test harness
- future optional sync adapter

This separation is important.

The product must not become a tangle where UI components secretly own business logic or where database records directly dictate interface behavior without domain interpretation.

---

## 5. ADR-001: Desktop-first application

**Decision:** Veradmin will be built as a desktop application using Tauri.

**Status:** Accepted

### Rationale

Veradmin is used like a tactical terminal. The user should be able to open it directly from their machine, without browser dependence, login friction, or the feeling of "opening a website."

Desktop delivery supports:

- one-click launch,
- native windowing,
- predictable local file access,
- easy local backup/export flows,
- and an experience aligned with trading software expectations.

### Consequences

- packaging and release discipline matter
- Tauri configuration becomes part of app quality
- desktop UX assumptions are valid
- mobile-first layout compromises are rejected in v1

---

## 6. ADR-002: Local-first data model

**Decision:** Local storage is the primary source of truth in v1.

**Status:** Accepted

### Rationale

The product’s value depends on reliable daily access and low friction.
The user must not lose operational capability because of network issues, auth issues, or remote service failures.

SQLite is appropriate because it is:

- fast,
- stable,
- local,
- mature,
- and sufficient for a single-user desktop application.

### Consequences

- migration handling is important
- backup/restore workflows matter
- sync must be additive later, not foundational now
- local database corruption recovery should be planned

---

## 7. ADR-003: Rule-engine-first domain core

**Decision:** Rule evaluation must live in a dedicated domain module, not inside UI components or ad hoc query code.

**Status:** Accepted

### Rationale

The core value of Veradmin is the translation of account data into operational permission states.

That logic is too important to scatter across:

- React components,
- utility files without domain ownership,
- or database query side effects.

A dedicated domain engine makes it possible to:

- test rules thoroughly,
- simulate outcomes,
- explain decisions,
- and keep the UI thin.

### Consequences

- domain inputs and outputs must be explicit
- rule functions must be pure where possible
- side effects must happen outside the core evaluator
- simulation becomes easier later

---

## 8. ADR-004: Mode-driven state interpretation

**Decision:** Accounts will be interpreted and displayed through explicit modes, not just raw balance state.

**Status:** Accepted

### Rationale

Balances and percentages do not guide behavior.
Modes do.

Mode logic creates a bridge between facts and action.
It lets the engine answer not only "where is the account?" but "how should the operator behave?"

### Consequences

- mode definitions must be documented
- mode transitions must be testable
- UI must display mode prominently
- event history should capture important mode changes

---

## 9. ADR-005: Event-aware architecture

**Decision:** Veradmin will preserve meaningful event history instead of relying only on current-state tables.

**Status:** Accepted

### Rationale

Trust requires explainability.

The system must eventually answer questions like:

- Why is this account restricted?
- When did payout become available?
- What caused this mode change?
- What happened before this stop?

A purely snapshot-based model is insufficient for that.

### Consequences

- event or audit tables are required
- writes should generate meaningful events
- current-state data and history data must stay conceptually distinct
- restore and debugging become easier

---

## 10. ADR-006: Delay cloud sync

**Decision:** Cloud sync is not part of the architectural center of v1.

**Status:** Accepted

### Rationale

Local trust matters more than network convenience.
Sync is a future convenience layer, not a core dependency.

### Consequences

- local architecture must be complete on its own
- cloud-specific abstractions should remain optional
- data model should be sync-friendly later, but not designed around remote-first constraints
- no auth complexity is introduced prematurely

---

## 11. ADR-007: Thin UI, rich domain

**Decision:** UI components should remain mostly presentational and interaction-oriented. Domain meaning belongs in services and engine modules.

**Status:** Accepted

### Rationale

Mixing business logic into components creates brittleness, duplicate logic, and testing pain.

### Consequences

- components receive prepared view models where practical
- business decisions happen before render
- hooks should coordinate, not secretly compute core policy
- component tests stay simpler

---

## 12. Recommended Tech Stack

### Desktop shell

- Tauri

### Frontend

- Next.js
- React
- TypeScript

### Styling / design system

- Tailwind CSS
- Shadcn/UI

### Database

- SQLite

### ORM / migrations

- Drizzle ORM

### Validation

- Zod

### Testing

- Vitest for unit/domain tests
- Playwright later for end-to-end flows

### Optional future sync

- Supabase or equivalent, later and optional

This stack is chosen to keep local delivery strong while preserving future extensibility.

---

## 13. Suggested Repository Structure

```text
veradmin/
  src/
    app/
    components/
    features/
    hooks/
    lib/
      db/
      domain/
        rules/
        modes/
        payouts/
        alerts/
      services/
      validation/
      utils/
    styles/
  drizzle/
  docs/
  scripts/
    seed/
    backup/
    restore/
  tests/
    unit/
    integration/
    fixtures/
  src-tauri/
```

### Structure intent

- `app/`: routes and page composition
- `components/`: reusable UI building blocks
- `features/`: grouped feature-specific UI/application logic
- `lib/db/`: DB access and migration setup
- `lib/domain/`: rule engine and business logic
- `lib/services/`: orchestration and side-effect handling
- `lib/validation/`: zod schemas and data contracts
- `tests/fixtures/`: seeded account scenarios
- `docs/`: source-of-truth product and architecture docs

---

## 14. Domain Boundary Model

The application should conceptually separate these layers.

### 14.1 Raw persisted facts

These are things that are stored because they happened or were configured.

Examples:

- account metadata
- firm rule profiles
- logged events
- payout records
- notes
- settings

### 14.2 Derived domain outputs

These are computed by the engine.

Examples:

- Lives remaining
- tradable status
- current mode
- max safe lot size
- payout readiness
- next recommended action
- alert severity
- fleet health score

### 14.3 UI view models

These are prepared representations for rendering.

Examples:

- badge labels
- card summaries
- warning text
- icon states
- dashboard groupings

This separation prevents the database from becoming a dump of presentation choices and prevents the UI from re-implementing domain logic.

---

## 15. Data Model Decisions

## 15.1 Core entities

At minimum, architecture should support these entity families:

- accounts
- firm_rule_profiles
- trade_logs or event_logs
- balance snapshots or equivalent account-state support
- payout_requests / payout_events
- refund_tasks
- notes
- alerts
- audit_events
- app/fleet settings

## 15.2 Current state vs event history

Current state should be easy to read.
Event history should be preserved for explanation and reconstruction.

Avoid forcing one table to serve both purposes poorly.

## 15.3 Derived fields

Derived values such as Lives, mode, tradable status, and risk severity should normally be computed, not stored as authoritative truth.

They may be cached later for performance, but the engine remains the source of truth.

---

## 16. Rule Engine Design Principles

The rule engine should be:

- deterministic
- composable
- testable
- explainable
- side-effect-light

### Inputs

It should consume explicit inputs such as:

- account state
- firm rule profile
- current day state
- payout state
- optional proposed event or proposed trade

### Outputs

It should return explicit outputs such as:

- effective floor
- daily floor
- Lives
- fractional Lives
- current mode
- tradable flag
- full-size vs fractional-only
- warnings
- blocking reasons
- payout readiness
- next action summary

### Design note

The engine should not directly mutate the database.
It should evaluate and return results.
Higher-level services can then persist or present those results.

---

## 17. Rule Evaluation Order

The exact logic may evolve, but architecture should assume a stable evaluation order such as:

1. load account and relevant profile
2. determine raw account state
3. compute effective floors
4. compute daily restrictions
5. compute Lives and fractional Lives
6. evaluate hard-stop or breach states
7. evaluate payout and phase conditions
8. determine mode
9. determine tradable permissions
10. determine warnings and next action

This order matters for consistency and explainability.

---

## 18. Simulation Architecture

Simulation should be architecturally possible from the beginning.

That means the rule engine should support hypothetical inputs such as:

- apply one loss
- apply one win
- apply custom P/L
- advance date
- request payout
- pause account

Simulation should not require duplicating business logic.
It should reuse the same domain evaluator with altered inputs.

---

## 19. Persistence Layer Decisions

## 19.1 SQLite as primary store

SQLite is sufficient and appropriate for v1.

## 19.2 Migrations required

Schema changes must be handled through migrations, not manual DB editing.

## 19.3 Seed scripts required

Development and testing require repeatable fleets and edge cases.

## 19.4 Backup/restore utilities required

Local-first means data safety is the product’s responsibility.

---

## 20. Validation Decisions

All data entering the domain layer should be validated.

Use Zod or equivalent for:

- inbound UI submissions
- import payloads
- settings changes
- event logging payloads
- rule profile edits
- export/import data

The goal is to fail clearly and safely, not silently corrupt state.

---

## 21. Service Layer Decisions

A service layer should orchestrate workflows such as:

- log trade event
- recalculate account status
- generate resulting alerts
- create audit event
- refresh account card summary
- export fleet data
- backup database

The service layer exists so that UI components do not coordinate multi-step domain + persistence logic directly.

---

## 22. State Management Decisions

The application should keep client state simple and deliberate.

Use React state and localized stores where appropriate, but avoid global complexity unless justified.

General guidance:

- source-of-truth domain data should come from persistence/services
- temporary interaction state may live near the UI
- heavy duplication of domain state in client-only stores should be avoided
- optimistic updates are acceptable only if consistent and reversible

---

## 23. Testing Architecture

Testing must exist at multiple levels.

### Unit tests

For:

- Lives calculations
- floor calculations
- mode logic
- payout readiness
- restriction logic
- alert derivation

### Integration tests

For:

- event logging workflows
- account recalculation services
- migration correctness
- import/export flows

### End-to-end tests later

For:

- morning workflow
- trade logging workflow
- payout workflow
- startup and persistence
- backup/restore

### Fixtures

Maintain several scenario fleets:

- normal fleet
- mixed-firm fleet
- edge-case fleet
- messy/manual-override fleet

---

## 24. UX/Domain Interface Contract

Architecture must support the UX promise that the user can quickly know:

- what matters now,
- what is safe,
- what is blocked,
- what changed,
- and why.

That means domain outputs should be explicit enough to power:

- card summaries,
- account banners,
- warning ribbons,
- mission panels,
- and explanation drawers

without forcing the UI to reverse-engineer meaning.

---

## 25. Security and Privacy Decisions

Because v1 is single-user and local-first:

- full auth is not required initially
- sensitive data should remain local
- exports should be explicit and user-controlled
- optional later sync should be opt-in
- backup location should be clear to the user
- no hidden telemetry should exist by default

If later commercialized, security posture can expand, but v1 should remain simple and trustworthy.

---

## 26. Performance Decisions

Performance matters because this is a command surface.

Architecture should favor:

- lightweight startup
- small local DB reads
- precomputed or prepared view models where helpful
- batched updates after event logging
- minimal blocking UI interactions

Performance optimization should not undermine correctness or clarity.

---

## 27. Error Handling Decisions

Errors must be explicit and recoverable.

The app should be able to distinguish:

- validation errors
- migration errors
- persistence errors
- domain inconsistency errors
- backup/export errors
- unexpected runtime errors

User-facing errors should be clear and calm.
Internal errors should be loggable and debuggable.

---

## 28. Release and Versioning Decisions

The app should use explicit semantic versioning or equivalent release labeling.

Each release should include:

- version
- changelog
- migration notes if needed
- backup recommendations if relevant

Releases should not silently alter rule semantics without documentation.

---

## 29. Future Extension Decisions

Architecture should leave room for future additions without requiring rewrites.

Future-compatible directions include:

- optional sync
- mobile read-only companion
- richer analytics
- AI daily briefing
- smarter payout optimization
- richer rule profiles per firm
- import adapters

The presence of these possibilities should influence modularity, but not dictate v1 complexity.

---

## 30. Rejected Architectural Paths

To clarify intent, these paths are rejected for v1:

### Rejected: browser-only web app as the primary experience

Reason: weak alignment with terminal-like use and offline trust.

### Rejected: cloud-first persistence

Reason: unnecessary operational dependency for a solo operator.

### Rejected: logic living mainly in React components

Reason: poor testability and maintainability.

### Rejected: storing all domain outputs as permanent truth

Reason: drift risk and duplication of computed state.

### Rejected: multi-user auth as a foundation

Reason: unnecessary complexity before local single-user excellence.

---

## 31. Architecture Definition of Done

Architecture is not "done" when files exist.
It is done when:

- core decisions are recorded,
- domain boundaries are respected,
- the rule engine is isolated,
- persistence is stable,
- tests can be written cleanly,
- local data survives restart,
- and future features can be added without architectural panic.

---

## 32. Final Statement

Veradmin’s architecture must serve one outcome above all:

**a trustworthy tactical operating environment for a solo prop-firm fleet operator**

If a future technical choice improves generic engineering elegance but weakens that outcome, it is the wrong choice.

This document exists to protect that standard.
