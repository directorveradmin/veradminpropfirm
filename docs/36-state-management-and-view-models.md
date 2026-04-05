# Veradmin State Management and View Models

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Product  
Applies To: UI state, derived state, domain state, view models, screen composition, update propagation, and the boundary between rule engine outputs and presentation

---

## 1. Purpose of This Document

This document defines how Veradmin should manage state between:
- persisted data,
- rule evaluation,
- screen-level needs,
- and reusable UI presentation models.

Veradmin is a state-rich product.
It contains:
- local persisted account and event data,
- derived operational truth from the rule engine,
- screen-specific grouped or summarized representations,
- transient UI state,
- recovery and error states,
- and future simulation/preview states.

Without discipline, the codebase could easily become a tangle of duplicated calculations, inconsistent labels, and screens that each interpret the same raw data differently.

This document exists so state and view-model architecture remain clean, testable, and deterministic.

---

## 2. State Management Mission

The state-management layer must do six things well:

1. Preserve one authoritative source of product truth.
2. Keep rule evaluation deterministic and reusable.
3. Prevent UI layers from inventing their own operational logic.
4. Translate domain truth into screen-friendly view models cleanly.
5. Distinguish persisted data from transient UI state.
6. Support updates that feel immediate without becoming fragile.

This layer is essential for trust, not just engineering neatness.

---

## 3. Core Principle: Stored State, Derived State, View State

Veradmin should explicitly separate at least three major state categories.

### 3.1 Stored state

Persisted product data such as:
- accounts
- rule profile assignments
- journal events
- payout records
- notes
- alert records
- settings
- backup metadata

This lives in the database or durable storage.

### 3.2 Derived state

Deterministic outputs computed from stored data and rule profiles, such as:
- lives remaining
- tradable status
- mode
- payout readiness
- restrictions
- next recommended action
- fleet health summaries

This should come from the rule engine or explicit derivation services.

### 3.3 View state

Transient UI state such as:
- selected tab
- current filters
- expanded card
- active modal
- selected date range
- drawer open/closed state
- unsaved form input
- currently selected alert or event

This should not be confused with product truth.

---

## 4. Authoritative Source Rules

The product must define clear authority:

- the database is authoritative for persisted facts
- the rule engine is authoritative for derived operational truth
- view models are authoritative only for screen presentation
- UI components are not authoritative for business logic

A screen should never become the place where operational truth is “decided.”

---

## 5. Domain-to-View Pipeline

Recommended conceptual pipeline:

1. Stored data loaded from local persistence
2. Domain services / repositories provide structured domain objects
3. Rule engine derives current operational truth
4. View-model mappers shape that truth for a specific screen
5. UI renders view models
6. User action triggers structured event
7. Event is persisted
8. Rule engine re-evaluates
9. View models refresh

This pipeline should remain visible in architecture and implementation.

---

## 6. View Models: Why They Exist

View models are not redundant ceremony.
They exist because screens need:
- grouped summaries
- preformatted copy labels
- state badges
- action affordances
- comparison deltas
- filter-friendly shapes
- alert grouping
- timeline display models

These are often not the same shape as the raw domain objects.

A good view model keeps presentation clean without letting screens invent their own truth.

---

## 7. Recommended View Model Types

Veradmin should likely use dedicated view-model structures for at least:

- Command Center dashboard
- account card
- Account Detail screen
- Journal list and event detail
- Payout list
- Calendar lane and marker views
- Alerts list and detail
- backup/restore/export summaries
- settings summary sections

Each screen or reusable surface should consume a clear model shaped for that specific purpose.

---

## 8. Command Center View Model Responsibilities

The Command Center view model should shape:
- mission items
- fleet health metrics
- prioritized account card list
- critical alerts summary
- quick action availability
- secondary operational summaries

It should not recalculate the raw rule logic itself.
It should orchestrate already-derived truth into the screen’s specific hierarchy.

---

## 9. Account View Model Responsibilities

The Account Detail view model should shape:
- current-state summary panel
- permissions and restrictions panel
- why-this-state explanation
- tactical action availability
- timeline summary
- payout/admin context

This is a strong example of why view models matter:
the screen needs a tactical dossier, not just raw tables.

---

## 10. Journal View Model Responsibilities

The Journal screen likely needs:
- event-list entries
- grouped/filtered event collections
- summary strip numbers
- detail-drawer models
- account-scoped history models

A journal event view model should clearly expose:
- display timestamp
- type label
- account label
- summary
- severity or importance indicator if applicable
- drill-down support

---

## 11. Payout and Calendar View Models

The Payouts screen needs view models for:
- readiness summaries
- pending status
- blockers
- refund task surfaces
- grouped payout sections

The Calendar screen needs view models for:
- account lanes
- period blocks
- payout markers
- alert markers
- weekly load summaries

These are all presentation-friendly shapes built on deterministic state, not ad hoc computations.

---

## 12. State Update Triggers

Important user/system events should trigger predictable state refresh flows.

Examples:
- log win/loss/custom event
- add note
- request payout
- mark payout received
- pause/resume account
- restore backup
- update settings that affect view behavior
- change rule profile assignment
- run migration
- change date filter or screen scope

The app should know which updates require:
- re-query
- rule re-evaluation
- view-model remapping
- pure UI update only

---

## 13. Simulation and Preview State

Simulation introduces an additional state type:
**preview state**.

Rules:
- preview state must never overwrite live stored state
- preview state may reuse domain and view-model mappers
- UI should clearly distinguish preview from committed truth
- simulation-specific view models may be needed for before/after comparison

This is one of the product’s most important state boundaries.

---

## 14. Error and Degraded State Handling

State management must also support explicit degraded or uncertain states.

Examples:
- account evaluation unavailable
- backup metadata failed to load
- migration status uncertain
- alert source missing
- partial journal load only

View models should be able to express:
- healthy
- partial
- unavailable
- unsafe to interpret

This is critical for trust-preserving failure handling.

---

## 15. Caching and Refresh Philosophy

Veradmin should feel fast, but not at the expense of correctness.

Recommended philosophy:
- prefer fresh deterministic derivation after meaningful state changes
- cache only where it does not risk stale or contradictory operational truth
- if caching is used, invalidation rules must be explicit
- local-first architecture already provides strong responsiveness; avoid unnecessary complexity too early

The product should prefer trustworthy immediacy over overengineered performance tricks.

---

## 16. State Ownership Guidelines

State ownership should be explicit.

Recommended rough ownership:
- repositories / persistence layer own data retrieval and writes
- rule engine owns operational evaluation
- mappers/services own view-model transformation
- screens own local UI interaction state
- reusable components own only local component interaction state

This prevents screens from becoming accidental business logic containers.

---

## 17. Cross-Screen Shared State

Some state may be shared across screens:
- active account selection
- date range context in a flow
- current filters
- current restore or recovery status
- global alert counts
- current app health / diagnostics summary

Shared state should be used intentionally, not by default.
Only cross-screen state that reduces friction meaningfully should be globalized.

---

## 18. Anti-Patterns to Avoid

Avoid:
- recalculating lives/mode/permissions separately in multiple screens
- storing derived truth permanently when it should be recomputed
- letting raw database objects leak directly into all UI components
- mixing transient UI state with domain state in one unstructured store
- mutating live state during simulation previews
- building one giant global state object for everything

---

## 19. Definition of Done for State Management and View Models

This spec is satisfied when:

1. Persisted, derived, and view state are clearly separated.
2. Screens depend on view models rather than ad hoc calculations.
3. Rule engine outputs remain the authoritative source of operational truth.
4. Updates propagate predictably after meaningful actions.
5. Simulation and degraded states are handled cleanly.
6. State ownership boundaries are visible in implementation.
7. The codebase stays explainable as the product grows.

---

## 20. Future Considerations

Potential later additions:
- explicit state diagrams for key flows
- richer memoization/caching rules
- event-stream derived view layers
- state inspection tooling for development
- more advanced compare-state support for reviews and analytics

These are valuable later, but v1 must first make state separation and view-model shaping disciplined and reliable.
