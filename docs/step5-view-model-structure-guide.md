# Veradmin Step 5: State and View-Model Structure Guide

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering  
Applies To: implementation-facing state organization, read-model assembly, view-model file layout, and ownership discipline

---

## 1. Purpose

This guide turns the canonical Step 5 doctrine into implementation-facing structure guidance for the current Veradmin scaffold.

It is intentionally practical.
It should help the next implementation chat add code into the existing repo without drifting from the current architecture.

---

## 2. Current Scaffold Fit

The existing scaffold already gives Veradmin the right homes:

- `db/repositories/` for persistence access
- `src/lib/services/` for orchestration
- `src/lib/view-models/` for screen-facing prepared models
- `src/features/*` for feature-specific composition
- `src/lib/domain/*` for deterministic evaluation logic

Step 5 should deepen those homes, not replace them.

---

## 3. Recommended Implementation Split

Use this implementation split consistently.

## 3.1 Repository layer

Purpose:
- load stored facts
- persist durable writes
- return typed fact records only

Examples:
- accounts repository
- rule profiles repository
- payouts repository
- notes repository
- alerts repository
- timeline/event repositories

## 3.2 Evaluation services

Purpose:
- take stored bundles
- resolve rule profile version
- call the deterministic rule engine
- return evaluation results

Examples:
- account evaluation service
- future fleet evaluation service
- future simulation evaluation service

## 3.3 Read-model services

Purpose:
- assemble everything a screen needs
- combine stored bundles and evaluation results
- attach degraded-state metadata
- decide refresh scope after writes

Examples:
- dashboard read-model service
- account detail read-model service
- journal read-model service
- payouts read-model service
- calendar read-model service
- alerts read-model service

## 3.4 View-model mappers

Purpose:
- shape read models into sections, rows, cards, summaries, and detail drawers
- keep React components mostly declarative
- preserve the hierarchy defined by each screen spec

## 3.5 Feature screen hooks/controllers

Purpose:
- own loading lifecycle
- own local UI state
- call read-model services
- feed view-models into components
- trigger workflow commands

---

## 4. Proposed Type Families

The following type families keep ownership clear.

## 4.1 Stored bundles

```ts
AccountStoredBundle
AccountTimelineBundle
DashboardStoredBundle
JournalStoredBundle
PayoutsStoredBundle
CalendarStoredBundle
AlertsStoredBundle
```

## 4.2 Derived evaluation types

```ts
AccountEvaluationResult
FleetEvaluationSummary
SimulationEvaluationResult
```

## 4.3 Read models

```ts
DashboardReadModel
AccountDetailReadModel
JournalReadModel
PayoutsReadModel
CalendarReadModel
AlertsReadModel
SimulationPreviewReadModel
```

## 4.4 View models

```ts
CommandCenterViewModel
AccountCardViewModel
AccountDetailViewModel
JournalEventRowViewModel
JournalScreenViewModel
PayoutRowViewModel
PayoutsScreenViewModel
CalendarLaneViewModel
CalendarScreenViewModel
AlertRowViewModel
AlertsScreenViewModel
SimulationPreviewViewModel
```

## 4.5 UI state types

```ts
DashboardUiState
AccountDetailUiState
SimulationUiState
JournalUiState
PayoutsUiState
CalendarUiState
AlertsUiState
```

---

## 5. Command Center Structure

Recommended output shape:

```ts
CommandCenterViewModel {
  mission: MissionItemViewModel[]
  fleetHealth: FleetHealthMetricViewModel[]
  criticalAlerts: AlertRowViewModel[]
  accountCards: AccountCardViewModel[]
  secondarySummaries: SecondarySummaryViewModel[]
  degradedState: DegradedStateViewModel | null
}
```

The key rule:
mission ordering and account ordering may be expressed here, but must be based on already-derived urgency inputs rather than screen-local tactical guesses.

---

## 6. Account Detail Structure

Recommended output shape:

```ts
AccountDetailViewModel {
  header: AccountHeaderViewModel
  currentState: CurrentStatePanelViewModel
  permissions: PermissionsPanelViewModel
  whyThisState: WhyThisStateViewModel
  actions: TacticalActionsViewModel
  timelinePreview: TimelinePreviewViewModel
  payoutContext: PayoutContextViewModel
  metadata: MetadataSectionViewModel
  degradedState: DegradedStateViewModel | null
}
```

This model should feel like a tactical dossier built from known truth.

---

## 7. Journal Structure

Recommended output shape:

```ts
JournalScreenViewModel {
  summaryStrip: JournalSummaryViewModel
  filters: JournalFilterSummaryViewModel
  events: JournalEventRowViewModel[]
  selectedEvent: JournalEventDetailViewModel | null
  accountContext: JournalAccountContextViewModel | null
  degradedState: DegradedStateViewModel | null
}
```

Important rule:
notes, payouts, mode shifts, restriction events, and trade outcomes should all arrive as structured event categories, not as free-form rendering guesses.

---

## 8. Payouts Structure

Recommended output shape:

```ts
PayoutsScreenViewModel {
  summaryStrip: PayoutSummaryViewModel
  readyNow: PayoutRowViewModel[]
  approaching: PayoutRowViewModel[]
  pending: PayoutRowViewModel[]
  blocked: PayoutRowViewModel[]
  refundTasks: RefundTaskViewModel[]
  selectedRow: PayoutDetailViewModel | null
  degradedState: DegradedStateViewModel | null
}
```

Important rule:
blocked reasons and readiness explanations must come from evaluation + stored payout facts, not from the row component.

---

## 9. Calendar Structure

Recommended output shape:

```ts
CalendarScreenViewModel {
  rangeSummary: CalendarRangeSummaryViewModel
  laneGroups: CalendarLaneGroupViewModel[]
  clusteringSummary: ClusteringSummaryViewModel[]
  selectedMarker: CalendarMarkerDetailViewModel | null
  degradedState: DegradedStateViewModel | null
}
```

Important rule:
payout timing, active/rest markers, and warning markers should be mapped from known timing inputs, not inferred visually in the component tree.

---

## 10. Alerts Structure

Recommended output shape:

```ts
AlertsScreenViewModel {
  summaryStrip: AlertsSummaryViewModel
  critical: AlertRowViewModel[]
  high: AlertRowViewModel[]
  medium: AlertRowViewModel[]
  low: AlertRowViewModel[]
  resolved: AlertRowViewModel[]
  selectedAlert: AlertDetailViewModel | null
  degradedState: DegradedStateViewModel | null
}
```

Important rule:
severity grouping belongs to persisted/derived alert truth plus mapper grouping, not to CSS-level interpretation.

---

## 11. Shared State Inventory

Keep the shared inventory small.

Recommended shared state:
- `selectedAccountId`
- `globalAlertCounts`
- `appHealthStatus`
- `surfaceRefreshVersionByKey`
- optional `sharedDateRangeContext` only when two or more surfaces truly share the same planning scope

Do not promote screen-local concerns to shared state prematurely.

---

## 12. Local State Inventory by Surface

### Dashboard
- filter chip state
- group mode
- quick panel expansion

### Account Detail
- active subpanel
- selected simulation preset
- action modal state

### Journal
- search string
- selected category
- selected event id
- date range picker state

### Payouts
- section focus
- selected row id
- open detail drawer state

### Calendar
- selected range
- group-by mode
- selected lane marker id

### Alerts
- severity tab
- show resolved toggle
- selected alert id

---

## 13. Mapping Discipline Checklist

Before accepting a mapper or screen hook, check:

- Does it consume evaluation outputs rather than recalculating them?
- Does it avoid reading repositories directly from React components?
- Does it keep display formatting separate from tactical truth?
- Does it surface degraded state explicitly?
- Does it avoid mutating live state during preview?
- Does it keep local UI state outside read-model services?

If any answer is no, the boundary likely slipped.

---

## 14. Minimal Refresh Coordinator Contract

A lightweight refresh coordinator is enough for Step 5.

Recommended invalidation keys:

```ts
'dashboard'
`account:${accountId}`
'journal'
'payouts'
'calendar'
'alerts'
```

Recommended behavior:
- workflow services emit affected keys after successful persistence + evaluation
- screen hooks subscribe only to keys they care about
- filter changes do not emit refresh events
- preview-only actions do not emit refresh events

This preserves coherence without introducing a giant state framework.

---

## 15. What Step 5 Should Not Introduce

Avoid introducing in this step:
- a Redux-style mega-store by default
- server-dependent state ownership
- screen-owned repository queries scattered across many components
- persistent caching of lives/mode/permissions as source of truth
- simulation that forks calculation logic from live evaluation

---

## 16. Final Statement

A clean Step 5 implementation should make the next screen-building step feel mostly like assembly work.
If the next step still needs to debate who owns mode, permissions, summaries, or refresh behavior, then Step 5 has not been finished cleanly enough.
