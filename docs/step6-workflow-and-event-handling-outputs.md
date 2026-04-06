# Step 6 Workflow and Event-Handling Outputs

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Product

---

## 1. Purpose

This artifact defines the concrete outputs that Step 6 workflows must return and the event-handling behavior they must produce.

It is intentionally implementation-facing.
It exists so Step 7 can consume stable workflow outputs without reconstructing consequence logic in the screen layer.

---

## 2. Workflow Result Families

Every Step 6 mutation should return one of these result families.

### 2.1 `AccountCreationResult`
Contains:
- created account id
- persisted row ids
- initial evaluation
- derived events generated on first evaluation
- invalidation keys
- consequence summary

### 2.2 `AccountMutationResult`
Used for:
- profile assignment
- trade logging
- note creation
- payout request/receipt
- pause/resume
- account updates

Contains:
- account id
- workflow type
- before snapshot if recompute happened
- after snapshot if recompute happened
- persisted fact ids
- audit event ids
- derived system events
- invalidation keys
- degraded state if partial

### 2.3 `AccountReadResult`
Used for load-only operations.
Contains:
- stored bundle
- evaluation result
- degraded markers
- timeline integrity markers

---

## 3. Post-Action Consequence Output

For all recompute-triggering actions, return this structure.

```ts
AccountConsequenceSummary {
  headline: string
  status: 'success' | 'partial' | 'blocked'
  changedFields: string[]
  modeDelta?: { before: string; after: string } | null
  tradabilityDelta?: { before: boolean; after: boolean } | null
  fullSizeDelta?: { before: boolean; after: boolean } | null
  payoutStateDelta?: { before: string | null; after: string | null } | null
  livesDelta?: { before: number | null; after: number | null } | null
  fractionalLivesDelta?: { before: number | null; after: number | null } | null
  alertsCreated: string[]
  alertsResolved: string[]
  nextRecommendedAction?: string | null
  explanationReasons: string[]
}
```

This becomes the screen-facing bridge for post-action confirmation, toast/callout content, and later account-detail refresh summaries.

---

## 4. Derived Event Output Contract

Every workflow that changes operational posture should return a list of derived system events.

```ts
DerivedAccountSystemEvent {
  eventType: string
  accountId: string
  eventTimestamp: string
  causalWorkflow: string
  causalFactIds: string[]
  beforeValue?: string | number | boolean | null
  afterValue?: string | number | boolean | null
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'resolved' | null
  summary: string
  payloadJson?: string | null
}
```

### 4.1 Generated when any of these change
- mode
- may trade
- full-size permission
- payout readiness
- restriction set
- alert posture
- lifecycle/control state where relevant

### 4.2 Not generated for pure no-op changes
If the post-write evaluation produces no meaningful operational delta, do not fabricate a system-transition event.
The audit event is enough.

---

## 5. Audit Output Contract

Each workflow must create at least one audit row describing the operator action itself.

```ts
WorkflowAuditRecord {
  eventType: string
  accountId: string | null
  eventTimestamp: string
  actorType: 'user' | 'system' | 'migration' | 'sync'
  summary: string
  ruleProfileVersionId?: string | null
  payloadJson?: string | null
}
```

Examples:
- `account_created`
- `profile_assignment_changed`
- `trade_logged`
- `note_added`
- `payout_requested`
- `payout_received`
- `account_paused`
- `account_resumed`
- `account_updated`

---

## 6. Alert-Handling Outputs

Workflows do not decide alert semantics independently from doctrine, but they do own the sequence that persists alert changes after evaluation.

### 6.1 Required alert outputs
- `alertsCreated: AlertWriteIntent[]`
- `alertsResolved: AlertResolutionIntent[]`
- `activeAlertSummaryAfter: ActiveAlertSummary[]`

### 6.2 Alert write intent shape

```ts
AlertWriteIntent {
  accountId?: string | null
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'resolved'
  title: string
  message: string
  source: string
  sourceRefId?: string | null
}
```

### 6.3 Alert resolution intent shape

```ts
AlertResolutionIntent {
  alertId: string
  resolvedAt: string
  resolutionSource: string
}
```

The workflow layer should treat these as persistence intentions derived from evaluation deltas.

---

## 7. Timeline Event Output

For the future Account Detail and Journal surfaces, Step 6 should normalize an account timeline event shape.

```ts
AccountTimelineEvent {
  id: string
  accountId: string
  occurredAt: string
  category: 'trade' | 'note' | 'payout' | 'control' | 'mode' | 'restriction' | 'alert' | 'audit'
  type: string
  title: string
  summary: string
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'resolved' | null
  source: 'manual' | 'system' | 'import' | 'migration'
  sourceRefId?: string | null
  stateAffecting: boolean
  detailPayloadJson?: string | null
}
```

### 7.1 Timeline assembly rule
This shape should be built from stored facts plus derived system events, not from screen-level heuristics.

---

## 8. History Integrity Outputs

Step 6 should expose explicit integrity markers rather than silently burying timeline uncertainty.

```ts
HistoryIntegrityMarker {
  code: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  relatedFactIds: string[]
}
```

### 8.1 Minimum marker cases
- missing open profile assignment
- profile version pointer mismatch
- balance snapshot missing after monetary mutation
- impossible timestamp ordering
- duplicate open assignment rows
- missing account reference in operational event chain
- partial timeline source load

### 8.2 Output usage
These markers should flow into:
- account read results,
- account detail degraded state later,
- journal warnings later,
- optional system alerts when severe.

---

## 9. Workflow Refresh Outputs

Each mutation workflow must return invalidation keys and a concise refresh explanation.

```ts
WorkflowRefreshPlan {
  keys: string[]
  reason: string
}
```

### 9.1 Expected plans

#### Trade result logged
- keys: `account:{id}`, `dashboard`, `journal`, `alerts`
- include `payouts` if payout significance changed
- include `calendar` if payout/rotation timing significance changed

#### Note added
- keys: `account:{id}`, `journal`

#### Profile changed
- keys: `account:{id}`, `dashboard`, `journal`, `alerts`, `payouts`, `calendar`

#### Pause/resume
- keys: `account:{id}`, `dashboard`, `alerts`, `journal`, `calendar`
- include `payouts` if relevance changed

#### Payout request/receipt
- keys: `account:{id}`, `payouts`, `dashboard`, `alerts`, `journal`
- include `calendar` if timing significance changed

---

## 10. Action-to-Output Matrix

| Workflow | Durable fact outputs | Derived outputs | Refresh outputs |
|---|---|---|---|
| Create account | account row, assignment row, snapshot, audit | initial evaluation, optional system events | dashboard, account, journal |
| Load account | none | evaluation + integrity markers | none |
| Assign profile | assignment closure/new row, account update, audit | recompute deltas, system events, alert deltas | account, dashboard, journal, alerts, payouts, calendar |
| Log trade | trade row, balance update, snapshot, audit | recompute deltas, system events, alert deltas | account, dashboard, journal, alerts, maybe payouts/calendar |
| Add note | note row, audit | none by default | account, journal |
| Pause/resume | account update, audit | recompute deltas, system events | account, dashboard, alerts, journal, calendar |
| Request payout | payout row, audit | recompute deltas, payout/system events | account, payouts, dashboard, alerts, journal, maybe calendar |
| Mark payout received | payout update, refund/admin facts if needed, audit | recompute deltas, payout/system events | account, payouts, dashboard, alerts, journal, maybe calendar |
| Update account facts | account update, optional snapshot, audit | recompute deltas, system events | affected surfaces only |

---

## 11. Required No-Guess Rule for Step 7

Step 7 screens should rely on these outputs directly for:
- change callouts,
- timeline construction,
- degraded warnings,
- refresh scope,
- post-action summaries.

The screen layer must not recalculate:
- what changed,
- which alerts were created or resolved,
- whether a mode transition occurred,
- whether history integrity is compromised.

---

## 12. Final Statement

The point of these outputs is simple:

after any meaningful account action, Veradmin should be able to say **what was written, what changed, why it changed, and what needs to refresh** without asking the screen layer to guess.
