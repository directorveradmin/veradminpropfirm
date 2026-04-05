# Veradmin State Management and View Models

Version: 1.1  
Status: Active  
Owner: Architecture / Engineering / Product  
Applies To: application state, derived state, view models, screen composition, update propagation, simulation preview, and the boundary between rule-engine truth and presentation

---

## 1. Purpose of This Document

This document completes Step 5 of 12 for Veradmin.

Its job is to translate the deterministic domain layer from Step 4 into a clean application-state and view-model architecture that can support the Command Center, Account Detail, Journal, Payouts, Calendar, and Alerts surfaces without letting those screens invent their own operational truth.

This step does **not** build all screens in full.
It does **not** move domain logic into UI code.
It does **not** redesign the repository or data model.
It defines how stored facts, derived operational truth, screen-facing read models, simulation previews, and transient UI state should relate to one another.

---

## 2. Governing Decisions Carried Forward

Step 5 inherits these already-frozen rules:

- Veradmin remains **desktop-first** and **local-first**.
- SQLite remains the authoritative v1 persistence source.
- Repositories own persistence access, not domain truth.
- The rule engine remains the authoritative source of operational evaluation.
- Stored facts and derived operational truth remain separate.
- View models may shape truth for display, but may not reinterpret or replace it.
- Simulation must reuse the same evaluation path as live state.

Step 5 exists to make those boundaries hold inside application state, not only inside docs.

---

## 3. Canonical State Categories

Veradmin should explicitly separate **four** state categories in implementation.

## 3.1 Stored state

Durable facts loaded from local persistence.

Examples:
- accounts
- current profile pointers
- profile assignment history
- account day state
- trade logs
- balance snapshots
- payout requests
- refund tasks
- notes
- alerts
- rotations
- news windows
- audit events
- fleet settings

These remain authoritative only for what was actually persisted.

## 3.2 Derived state

Deterministic operational truth computed from stored facts and rule profiles.

Examples:
- hard floor
- daily floor
- dominant floor
- lives and fractional lives
- payout readiness
- dominant mode
- permissions
- active restrictions
- alert derivation results
- next recommended action
- explanation package
- fleet health summaries

This state belongs to the rule engine and explicit derivation services.
It must never be re-decided inside screen code.

## 3.3 View state

Screen-facing state shaped for presentation.

Examples:
- mission items
- account card rows
- account detail panels
- journal list entries
- grouped payout sections
- calendar lanes and markers
- grouped alerts sections
- status badges
- screen summary strips

This state is derived from stored facts plus derived state.
It is not an additional truth source.

## 3.4 Preview state

Temporary before/after state used by simulation and consequence previews.

Examples:
- one-loss simulation result
- one-win simulation result
- custom P/L preview
- payout request consequence preview
- next-day reset preview

Preview state must never overwrite stored state or masquerade as committed truth.

---

## 4. Authoritative Source Rules

Veradmin should follow this authority chain exactly:

1. **database / repositories** for persisted facts
2. **rule engine** for operational truth
3. **read-model services** for assembling stored bundles and evaluation bundles
4. **view-model mappers** for screen-friendly shapes
5. **screens/components** for local interaction state only

Therefore:
- repositories do not decide mode, tradability, payout readiness, or alert meaning
- services do not hide raw UI interaction state
- view models do not recalculate rule logic
- UI components do not backfill missing persistence truth

---

## 5. Canonical Domain-to-View Pipeline

Every meaningful screen should follow the same pipeline:

1. Load stored facts through repositories.
2. Assemble the required stored-fact bundle in a service.
3. Resolve the governing rule profile version.
4. Run the canonical rule-evaluation order.
5. Combine stored facts and derived outputs into a screen read model.
6. Map the read model into a specific screen view model.
7. Render that view model.
8. On user action, persist facts first.
9. Re-evaluate affected accounts.
10. Refresh affected screen view models.

The important design rule is simple:
**persist -> evaluate -> map -> render**.

Never:
**render -> guess -> persist later**.

---

## 6. Recommended Application-State Architecture

Step 5 should use a layered application-state model instead of one large global store.

## 6.1 Layer A: persistence-backed fact state

Source:
- `db/repositories/*`
- repository-backed services

Responsibility:
- fetch durable records
- persist durable writes
- expose typed fact bundles

Examples:
- `AccountStoredBundle`
- `AccountTimelineBundle`
- `DashboardStoredBundle`
- `PayoutsStoredBundle`
- `CalendarStoredBundle`
- `AlertsStoredBundle`

This layer should be framework-agnostic TypeScript where possible.

## 6.2 Layer B: evaluation state

Source:
- `src/lib/domain/rules/*`
- `src/lib/services/accountEvaluationService.ts`
- future fleet evaluation services

Responsibility:
- produce evaluation outputs for one account or a fleet slice
- expose deterministic domain results
- remain reusable by live views and simulation

Examples:
- `AccountEvaluationResult`
- `FleetEvaluationSummary`
- `SimulationEvaluationResult`

This layer should not contain screen formatting.

## 6.3 Layer C: screen read-model state

Source:
- service-composed stored bundles
- evaluation results

Responsibility:
- gather the exact inputs a screen needs
- keep repeated joining/orchestration out of page components
- remain screen-oriented without becoming presentation-only chrome

Examples:
- `DashboardReadModel`
- `AccountDetailReadModel`
- `JournalReadModel`
- `PayoutsReadModel`
- `CalendarReadModel`
- `AlertsReadModel`

This layer is where cross-entity assembly belongs.

## 6.4 Layer D: view-model state

Source:
- screen read models

Responsibility:
- shape display-ready sections
- expose labels, section ordering, grouping, callouts, and affordance availability
- keep screen components simple and declarative

Examples:
- `CommandCenterViewModel`
- `AccountDetailViewModel`
- `JournalScreenViewModel`
- `PayoutsScreenViewModel`
- `CalendarScreenViewModel`
- `AlertsScreenViewModel`

This layer should be pure mapping logic.

## 6.5 Layer E: local UI state

Source:
- screen-level hooks / feature components

Responsibility:
- store transient interaction state only

Examples:
- active filter chips
- expanded drawer id
- selected timeline event id
- sort order
- modal open state
- unsaved form fields
- temporary selection focus

This layer should never own operational truth.

---

## 7. Shared State Boundaries

Only a small set of state should be shared across screens.

## 7.1 Allowed shared app state

Good candidates:
- active account selection
- current app health / degraded-state banner
- unresolved alert counts
- current trading-date context
- navigation-level date range context when multiple screens intentionally share it
- refresh invalidation signals by surface or account id

## 7.2 Shared state that should remain derived, not globally edited

Examples:
- fleet health counts
- payout-ready counts
- critical alerts summary
- account mode totals
- mission item counts

These should be recomputed from evaluation/read models, not treated as mutable global source.

## 7.3 Shared state anti-rule

Do not build one giant app store containing:
- raw DB entities
- evaluation results
- view models
- filters
- form drafts
- modal state
- simulation preview state

That structure would blur ownership and quickly become fragile.

---

## 8. Local UI State Boundaries

Local UI state should stay inside the narrowest useful owner.

## 8.1 Command Center local UI state

Examples:
- current filter (all / tradable / payout-ready / near-risk)
- grouping mode
- expanded account card id
- dismissed non-critical mission snippet

Do not store lives, tradability, or urgency ranking here.

## 8.2 Account Detail local UI state

Examples:
- selected timeline tab
- explanation section expansion
- selected simulation preset
- open action modal

Do not store permissions or current mode here.

## 8.3 Journal local UI state

Examples:
- active event category filter
- account scope filter
- search string
- selected event row
- date range picker state

Do not infer event meaning locally if it should come from persisted or derived event types.

## 8.4 Payouts local UI state

Examples:
- current section focus
- pending vs ready filter
- selected payout row
- drawer open state

Do not locally decide readiness or blockers.

## 8.5 Calendar local UI state

Examples:
- selected week range
- lane grouping mode
- selected period block
- zoom level if introduced later

Do not compute rhythm meaning in component code.

## 8.6 Alerts local UI state

Examples:
- severity tab
- resolved toggle
- selected alert id
- category filter

Do not assign severity or resolution semantics in the UI.

---

## 9. Screen View-Model Responsibilities

## 9.1 Command Center / Dashboard

The Command Center view model should expose:
- today’s mission items
- fleet health strip metrics
- prioritized account cards
- critical alert zone
- secondary operational summaries
- quick-action availability

It may sort or group accounts using already-derived urgency inputs.
It may not invent urgency rules outside the service/mapper contract.

## 9.2 Account Detail

The Account Detail view model should expose:
- account header
- current state summary panel
- permissions and restrictions panel
- why-this-state panel
- tactical actions groups
- timeline preview or linked timeline panel
- payout/admin context
- simulation entry state

It should feel like a tactical dossier assembled from known truth.

## 9.3 Journal

The Journal view model should expose:
- summary strip
- filtered event list
- event detail panel model
- account-scoped context model
- event category grouping
- date range state shell

It should structure memory, not reinterpret business truth.

## 9.4 Payouts

The Payouts view model should expose:
- ready / approaching / pending / blocked sections
- payout-row summaries
- blockers summaries
- payout detail model
- refund/admin task sections
- cash-flow summary widgets if supported

It should consume payout readiness from evaluation outputs and payout history from stored facts.

## 9.5 Calendar / Rotation

The Calendar view model should expose:
- fleet rhythm summary strip
- lane groups
- period blocks
- payout markers
- alert markers
- detail drawer model
- clustering summaries

It should not invent mode or payout significance on its own.

## 9.6 Alerts

The Alerts view model should expose:
- summary strip
- grouped severity sections
- alert rows
- alert detail model
- resolution affordances
- tactical vs administrative grouping

It should use alert severity and category from persisted/derived alert truth, not from UI heuristics.

---

## 10. Recommended Read-Model and Mapper Split

Step 5 should separate **read-model assembly** from **view-model mapping**.

## 10.1 Read-model assembly services

Recommended responsibility:
- fetch the required facts
- call evaluation services
- return a structured screen read model

Recommended examples:
- `buildDashboardReadModel()`
- `buildAccountDetailReadModel(accountId)`
- `buildJournalReadModel(scope)`
- `buildPayoutsReadModel(scope)`
- `buildCalendarReadModel(range)`
- `buildAlertsReadModel(scope)`

## 10.2 View-model mappers

Recommended responsibility:
- convert read models into screen-facing display sections
- format display labels and normalized card/row shapes
- preserve section hierarchy required by each screen spec

Recommended examples:
- `mapDashboardViewModel(readModel)`
- `mapAccountDetailViewModel(readModel)`
- `mapJournalViewModel(readModel)`
- `mapPayoutsViewModel(readModel)`
- `mapCalendarViewModel(readModel)`
- `mapAlertsViewModel(readModel)`

This split prevents services from becoming UI-shape factories and prevents screens from becoming orchestration layers.

---

## 11. State Ownership and Mapping Discipline

The following rules are non-negotiable.

## 11.1 Mapping rule

View-model mappers may:
- rename fields for clarity
- group related facts
- order sections
- attach stable display labels
- collapse already-known truth into reusable display blocks

View-model mappers may **not**:
- recalculate lives
- decide tradability
- reassign mode
- infer payout readiness from raw balances when the engine already owns that
- invent alert severity
- convert missing data into fake safe states

## 11.2 Service rule

Read-model services may:
- fetch stored bundles
- call evaluation services
- merge stored and derived results
- decide refresh targets
- surface degraded-state markers

Read-model services may **not**:
- render UI copy directly inside components
- bury raw SQL inside feature components
- silently replace engine outputs with UI convenience values

## 11.3 Screen rule

Screens may:
- hold local UI state
- request a read model
- consume a view model
- trigger workflows
- show loading / partial / degraded states

Screens may **not**:
- become ad hoc calculators
- stitch together competing sources of truth
- persist guessed derived fields as authoritative facts

---

## 12. Simulation Preview Separation

Simulation requires an explicit side path.

## 12.1 Live path

`stored facts -> live evaluation -> live read model -> live view model`

## 12.2 Preview path

`live stored facts + hypothetical action -> simulation evaluation -> simulation read model -> preview view model`

## 12.3 Simulation rules

- live facts remain unchanged until the user commits a real action
- preview state is displayed with obvious simulation framing
- before/after comparisons reuse the same view-model conventions where possible
- closing simulation returns to the live view without merge confusion
- preview-only alert changes, mode changes, and next-action changes must remain preview-only

---

## 13. Refresh and Invalidation Rules

After a meaningful write, Veradmin should refresh by **affected surface**, not by full-app chaos.

## 13.1 Refresh targets after trade logging

Refresh:
- affected account detail
- Command Center mission + card ordering
- Journal timeline/history
- Alerts if thresholds, restrictions, or severity changed
- Payouts if payout significance changed
- Calendar only if payout or rotation timing markers changed

## 13.2 Refresh targets after note creation

Refresh:
- affected account timeline
- Journal
- Account Detail

Usually do **not** refresh:
- full fleet evaluations
- payout lists
- calendar rhythm

unless a note is intentionally represented as a surfaced alert or mission item.

## 13.3 Refresh targets after payout request / payout received

Refresh:
- affected account detail
- Payouts screen
- Command Center mission items
- Alerts
- Journal
- Calendar if payout timing significance changed

## 13.4 Refresh targets after pause / resume / profile assignment change

Refresh:
- affected account detail
- Command Center
- Alerts
- Journal
- Calendar if activity rhythm changed
- Payouts if payout relevance changed

## 13.5 Refresh targets after pure filter or date-range changes

Refresh only:
- local screen view state
- view-model remapping if needed

Do **not** persist or re-evaluate accounts merely because the user changed a filter.

---

## 14. Recommended Folder and File Placement

This step should fit the existing scaffold instead of replacing it.

Recommended additions:

```text
src/
  features/
    dashboard/
      state/
        dashboardUiState.ts
    accounts/
      state/
        accountDetailUiState.ts
        simulationUiState.ts
    journal/
      state/
        journalUiState.ts
    payouts/
      state/
        payoutsUiState.ts
    calendar/
      state/
        calendarUiState.ts
    alerts/
      state/
        alertsUiState.ts

  lib/
    services/
      read-models/
        dashboardReadModelService.ts
        accountDetailReadModelService.ts
        journalReadModelService.ts
        payoutsReadModelService.ts
        calendarReadModelService.ts
        alertsReadModelService.ts
      state/
        refreshCoordinator.ts
        surfaceInvalidation.ts

    view-models/
      shared/
        badges.ts
        sections.ts
        formatters.ts
        degradedState.ts
      dashboard/
        types.ts
        mapDashboardViewModel.ts
      account-detail/
        types.ts
        mapAccountDetailViewModel.ts
      journal/
        types.ts
        mapJournalViewModel.ts
      payouts/
        types.ts
        mapPayoutsViewModel.ts
      calendar/
        types.ts
        mapCalendarViewModel.ts
      alerts/
        types.ts
        mapAlertsViewModel.ts
      simulation/
        types.ts
        mapSimulationPreviewViewModel.ts
```

The exact filenames may vary, but the split should remain visible.

---

## 15. Dependency and Tooling Discipline

Step 5 should stay conservative.

Recommended default:
- use pure TypeScript modules for services and mappers
- use React screen-local state for local UI state
- use a lightweight shared invalidation/coordinator layer only where multiple surfaces must refresh coherently
- do not introduce a heavy global state library unless implementation pain clearly justifies it later

The architecture should stay explainable to a single contributor reading the repo tree.

---

## 16. Degraded and Partial State Rules

Every screen view model should be able to represent:
- healthy
- loading
- partial
- unavailable
- unsafe to interpret

Recommended behavior:
- degraded status is explicit in the view model
- screens show what is missing, not a fake clean state
- read-model services surface whether degradation came from loading failure, missing stored facts, or failed evaluation
- tactical surfaces should favor caution if the state is unsafe to interpret

---

## 17. Anti-Patterns to Avoid

Avoid:
- one giant app store for everything
- dashboard-specific mode logic
- account-detail-specific permission logic
- alert severity guessed inside a card component
- payout readiness inferred in a table row mapper from balances alone
- simulation mutating live account state
- view models consuming raw repositories directly from React components
- storing derived truth back into authoritative account columns just for UI convenience

---

## 18. Step 5 Definition of Done

Step 5 is complete when all of the following are true:

1. Stored, derived, view, and preview state are separated clearly.
2. The rule engine remains the only source of operational truth.
3. Repositories continue returning stored facts only.
4. View models exist as an explicit layer instead of ad hoc screen calculations.
5. Shared state is narrow and intentional.
6. Local UI state stays local.
7. Simulation preview is isolated from live state.
8. Refresh rules after meaningful events are explicit.
9. Screen integration can begin without re-litigating ownership boundaries.

---

## 19. Final Statement

Step 5 is where Veradmin’s deterministic truth becomes safely consumable by screens.

If this layer is done well, the screens that follow can feel immediate, coherent, and trustworthy.
If this layer is done poorly, every screen will start becoming its own unofficial rule engine.

Veradmin should choose the first path on purpose.
