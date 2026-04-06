# Veradmin Step 6: Core Account Workflows

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Product / Operations  
Applies To: account creation/loading, profile assignment, structured event logging, notes, account updates and recompute, account-level event persistence, account-level history integrity, and workflow sequencing for core account actions

---

## 1. Purpose

This document completes **Step 6 of 12: Core Account Workflows** for Veradmin.

Its job is to define the core account interaction layer that makes the product usable as a local operator tool **before the full screen layer is finished**.

This step does **not** redesign Veradmin.
It does **not** build all major screens.
It does **not** move rule logic into repositories or UI.
It formalizes the workflow layer that sits between:

1. stored facts in SQLite,
2. deterministic evaluation in the rule engine,
3. event/history persistence,
4. read-model refresh propagation,
5. and the later Command Center / Account Detail surfaces.

The guiding rule for this step is:

**persist facts -> re-evaluate -> persist derived system events/audit memory -> invalidate affected surfaces -> show consequence summary**

---

## 2. Governing Constraints Carried Forward

Step 6 inherits these non-negotiable rules from prior docs:

- Veradmin remains **desktop-first** and **local-first**.
- SQLite remains the canonical v1 source of truth.
- Repositories persist and query stored facts only.
- The rule engine remains the sole owner of derived operational truth.
- View models remain downstream of stored facts plus engine outputs.
- Simulation stays separate from live committed state.
- Workflow services orchestrate persistence, evaluation, auditability, and refresh; they do not become alternate rule engines.

Step 6 therefore exists to make the real operator loop trustworthy:

- create/load account,
- assign profile,
- log trade result,
- add note,
- record pause/resume and payout events,
- recompute state,
- persist timeline/audit memory,
- refresh affected tactical surfaces coherently.

---

## 3. Step 6 Mission

The workflow layer must make the following feel safe and deterministic:

1. **Create or load an account** with valid governing profile context.
2. **Assign or change a rule profile** with traceable history.
3. **Log structured account events** without freeform ambiguity.
4. **Persist notes** without letting notes silently mutate operational truth.
5. **Recompute the account after meaningful events** using the canonical rule order.
6. **Persist account-level history** in a way that preserves explainability.
7. **Emit derived system events** when operational posture actually changes.
8. **Refresh later surfaces correctly** without screen-local guesswork.

If Step 6 is implemented correctly, Step 7 can mostly assemble the screens from already-trustworthy workflow services.

---

## 4. Existing Scaffold Fit

The current scaffold already establishes the homes this step should deepen:

- `db/schema/accounts.ts` for durable account facts, notes, tags, fleet settings, and profile-assignment history.
- `db/schema/operations.ts` for trade logs, snapshots, payouts, alerts, audit events, and related operational records.
- `db/repositories/accountsRepository.ts` for account-focused evaluation input bundles.
- `db/repositories/ruleProfilesRepository.ts` for profile family/version resolution.
- `src/lib/services/` as the workflow orchestration boundary.
- `src/lib/view-models/` as the later screen-facing mapping layer.

Step 6 should add account workflow services and repository surfaces **inside those boundaries**, not around them.

---

## 5. Core Workflow Ownership Model

### 5.1 Repositories own stored facts

Repositories may:
- load account facts,
- load current profile/version,
- load account timeline facts,
- persist trade logs / notes / payouts / pause-resume facts / audit events,
- append snapshots,
- close and open profile-assignment rows.

Repositories may not:
- decide tradability,
- assign mode,
- decide payout readiness,
- infer alert severity,
- write human-facing consequence summaries.

### 5.2 Evaluation services own recompute

Evaluation services take stored bundles and return deterministic outputs such as:
- mode,
- permissions,
- restrictions,
- payout state,
- alerts,
- next action,
- explanation package.

### 5.3 Account workflow services own ordered orchestration

Workflow services are responsible for:
- command validation,
- durable write sequencing,
- reloading affected bundles,
- invoking canonical evaluation,
- persisting derived system events and audit records,
- calculating invalidation targets,
- returning post-action summaries.

### 5.4 Screens consume workflow outputs

Screens later call these workflows and then consume refreshed read models.
They do not reproduce persistence ordering or consequence logic locally.

---

## 6. Canonical Step 6 Service Surface

Create the following implementation-facing service modules under `src/lib/services/`.

### 6.1 `accountLifecycleService.ts`
Owns:
- create account
- update account basics
- pause account
- resume account
- archive/retire account when allowed
- lifecycle stage updates when explicitly commanded

### 6.2 `profileAssignmentService.ts`
Owns:
- assign initial profile on account creation
- change governing profile version later
- close prior open assignment row
- validate family/version availability
- emit profile-change audit and timeline events

### 6.3 `accountEventWorkflowService.ts`
Owns:
- log win
- log loss
- log custom trade result
- log structured account event
- add note
- manual balance adjustment if allowed
- daily reset recording if supported at this layer

### 6.4 `payoutWorkflowService.ts`
Owns only the account-level payout actions needed for the core loop:
- request payout
- mark payout received
- create/update refund task facts where applicable

This service should **not** expand into the full Payouts screen yet.

### 6.5 `accountHistoryIntegrityService.ts`
Owns:
- history ordering normalization
- idempotency guards for repeated commands
- before/after comparison support for derived event persistence
- integrity warnings when timeline truth becomes partial or contradictory

### 6.6 `accountWorkflowTypes.ts`
Defines stable command/result types for all Step 6 services.

---

## 7. Canonical Command Types

The workflow layer should expose explicit command objects instead of loose ad hoc payloads.

### 7.1 Account creation command

```ts
CreateAccountCommand {
  firmId: string
  accountLabel: string
  externalAccountRef?: string | null
  lifecycleStage: LifecycleStage
  accountStatus?: AccountStatus
  startingBalanceCents: number
  currentBalanceCents?: number
  peakBalanceCents?: number
  daysTradedReference?: number | null
  lastPayoutDate?: string | null
  feeRefunded?: boolean
  manuallyPaused?: boolean
  initialRuleProfileId: string
  initialRuleProfileVersionId: string
  assignmentReason: string
  createdAt?: string
}
```

### 7.2 Profile assignment command

```ts
AssignRuleProfileCommand {
  accountId: string
  ruleProfileId: string
  ruleProfileVersionId: string
  assignedAt: string
  assignmentReason: string
  assignedBy: 'user' | 'system' | 'migration'
  notes?: string | null
}
```

### 7.3 Trade logging command

```ts
LogTradeResultCommand {
  accountId: string
  tradingTimestamp: string
  tradeDate: string
  session: TradeSession
  direction: TradeDirection
  resultType: 'win' | 'loss' | 'custom'
  pnlAmountCents: number
  points?: number | null
  riskUnitFraction?: number | null
  wasRuleFollowing?: boolean
  wasNearNews?: boolean
  setupTagId?: string | null
  screenshotPath?: string | null
  note?: string | null
  source: 'manual' | 'import' | 'system'
}
```

### 7.4 Add note command

```ts
AddAccountNoteCommand {
  accountId: string
  noteType: 'general' | 'risk' | 'payout' | 'admin' | 'system'
  body: string
  createdAt?: string
}
```

### 7.5 Pause/resume commands

```ts
PauseAccountCommand {
  accountId: string
  eventTimestamp: string
  reason: string
}

ResumeAccountCommand {
  accountId: string
  eventTimestamp: string
  reason: string
}
```

### 7.6 Payout commands

```ts
RequestPayoutCommand {
  accountId: string
  requestedAt: string
  amountRequestedCents: number
  expectedArrivalAt?: string | null
  notes?: string | null
}

MarkPayoutReceivedCommand {
  accountId: string
  payoutRequestId: string
  receivedAt: string
  amountReceivedCents?: number | null
  notes?: string | null
}
```

---

## 8. Canonical Workflow Result Envelope

Every meaningful Step 6 workflow should return one structured result envelope.

```ts
AccountWorkflowResult {
  accountId: string
  workflow: AccountWorkflowType
  persistedFactIds: string[]
  evaluation: AccountEvaluationResult | null
  derivedEvents: DerivedAccountSystemEvent[]
  invalidationKeys: RefreshKey[]
  consequenceSummary: AccountConsequenceSummary
  degradedState: WorkflowDegradedState | null
}
```

### 8.1 Consequence summary shape

```ts
AccountConsequenceSummary {
  headline: string
  changed: {
    modeChanged: boolean
    tradabilityChanged: boolean
    fullSizePermissionChanged: boolean
    payoutStateChanged: boolean
    alertsChanged: boolean
    livesChanged: boolean
  }
  before?: AccountOperationalSnapshot
  after?: AccountOperationalSnapshot
  nextRecommendedAction?: string | null
  explanationReasons: string[]
}
```

The workflow layer should return enough structured information for Step 7 screens to render clear “what changed” feedback without recreating comparison logic.

---

## 9. Event Model for Step 6

Step 6 must keep four concepts separate even if later screens display them together.

### 9.1 Durable fact events

These are persisted because the operator or system observed or committed them.
Examples:
- trade log row
- note row
- payout request row
- payout receipt update
- pause/resume fact
- account day-state fact
- profile assignment row
- balance snapshot row

### 9.2 Derived system events

These are persisted because the workflow discovered a meaningful operational transition after re-evaluation.
Examples:
- mode changed
- tradable status changed
- account entered stopped state
- payout readiness gained/lost
- full-size permission removed/restored
- alert triggered/resolved

These events are not the source of truth for mode or permissions; they are **explainability memory**.

### 9.3 Audit events

Audit events answer:
- what command ran,
- when,
- by whom/what,
- against which account,
- under which profile version,
- with which key payload.

### 9.4 Notes

Notes are durable contextual memory.
They do not directly change operational truth unless a separate structured event is also persisted.

---

## 10. Canonical Derived System Event Catalog

Step 6 should support at least the following derived event types.

### 10.1 Tactical posture events
- `mode_changed`
- `tradability_changed`
- `full_size_permission_changed`
- `fractional_only_changed`
- `restriction_activated`
- `restriction_resolved`

### 10.2 Payout posture events
- `payout_readiness_achieved`
- `payout_readiness_lost`
- `payout_request_pending`
- `payout_received_recorded`

### 10.3 Lifecycle/control events
- `profile_assignment_changed`
- `account_paused`
- `account_resumed`
- `lifecycle_stage_changed`

### 10.4 Attention/history events
- `alert_triggered`
- `alert_resolved`
- `history_integrity_warning`

These may be stored either as dedicated audit payloads and/or as alert/history facts, but their generation rules must be centralized in the workflow layer.

---

## 11. Canonical Persistence Order

For Step 6 workflows, use this exact order unless the workflow is explicitly read-only.

```text
1. validate command
2. load required stored bundle(s)
3. validate account + lifecycle + governing profile context
4. persist durable fact(s)
5. persist balance snapshot if the workflow changes monetary references
6. persist primary audit event for the command
7. reload affected stored bundle(s)
8. re-run canonical rule evaluation
9. compare before vs after operational posture
10. persist derived system events if meaningful transitions occurred
11. persist alert changes / resolutions if required
12. compute invalidation keys
13. return workflow result envelope
```

Never:
- evaluate before the durable fact is committed for live actions,
- claim success before writes are durable,
- skip before/after comparison and still persist system transitions,
- let UI components decide what changed.

---

## 12. Account Creation Workflow

### 12.1 Purpose
Create a usable account record with explicit profile governance and immediately evaluable state.

### 12.2 Required validations
- firm exists
- account label is unique
- lifecycle stage is valid
- initial profile family exists
- initial profile version exists and belongs to that family
- starting balance is positive
- current balance and peak balance are sane
- initial stage/profile combination is not contradictory

### 12.3 Canonical flow

```text
validate create command
-> insert account row
-> insert initial profile assignment row
-> insert initial account day-state row if required by current date boundary
-> insert initial balance snapshot
-> insert audit event: account_created
-> load evaluation input bundle
-> evaluate account
-> persist derived system events if needed
-> invalidate: dashboard, account:{id}, journal, alerts, payouts/calendar only if relevant
-> return account creation consequence summary
```

### 12.4 Required persisted facts
- `accounts`
- `account_rule_profile_assignments`
- optional `account_day_state`
- `balance_snapshots`
- `audit_events`

### 12.5 Required output
The result should include the newly governed account in a state that Step 7 screens can load directly without ad hoc repair logic.

---

## 13. Account Loading Workflow

### 13.1 Purpose
Load a live operational account bundle safely.

### 13.2 Read shape
The load path should combine:
- account row
- open profile assignment
- active profile version
- latest day-state
- recent payouts
- recent rotations
- upcoming news
- recent timeline facts
- recent alerts

### 13.3 Canonical flow

```text
load stored bundle
-> validate minimum integrity
-> resolve governing profile version
-> evaluate account
-> build read model
-> expose degraded marker if anything is partial or contradictory
```

### 13.4 Important rule
Loading is not a workflow mutation path. It must not silently repair broken data.
If integrity fails, Step 7 should render a degraded tactical state rather than fabricate certainty.

---

## 14. Profile Assignment Workflow

### 14.1 Purpose
Change the governing rule profile while preserving historical traceability.

### 14.2 Required validations
- account exists and is not retired in a way that forbids reassignment
- profile family exists
- profile version exists and belongs to family
- requested version is not stale/invalid
- new assignment is meaningfully different from current assignment
- assignment timestamp is valid relative to prior open assignment

### 14.3 Canonical flow

```text
validate assignment command
-> load account and current open assignment
-> close current open assignment row
-> insert new assignment row
-> update account currentRuleProfileId/currentRuleProfileVersionId
-> insert audit event: profile_assignment_changed
-> reload evaluation input bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> invalidate: account:{id}, dashboard, journal, alerts, payouts, calendar
-> return consequence summary
```

### 14.4 Required consequence handling
The system should explicitly report:
- governing profile version changed
- whether mode changed
- whether permissions changed
- whether payout/admin posture changed
- whether alerts changed

---

## 15. Trade Logging Workflow

### 15.1 Purpose
Record a meaningful trading outcome and update operational truth immediately.

### 15.2 Supported commands
- log win
- log loss
- log custom

### 15.3 Required validations
- account exists
- account is not archived/retired in a way that forbids logging
- governing profile is present
- lifecycle state permits logging
- numeric fields are sane
- trade timestamp and trade date are coherent
- custom trade payload is structured rather than freeform-only

### 15.4 Canonical flow

```text
validate trade log command
-> persist trade_logs row
-> update accounts.currentBalanceCents
-> update accounts.peakBalanceCents if new peak was reached
-> upsert latest account_day_state realized pnl if required
-> insert balance snapshot
-> insert audit event: trade_logged
-> reload evaluation bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> create/resolve alerts as needed
-> invalidate: account:{id}, dashboard, journal, alerts, payouts if payout posture changed, calendar if timing significance changed
-> return post-trade consequence summary
```

### 15.5 Required user-visible outputs later
- lives before/after
- mode before/after
- tradability before/after
- new restrictions or protections
- alert changes
- next recommended action

---

## 16. Note Workflow

### 16.1 Purpose
Attach contextual memory without silently mutating account truth.

### 16.2 Required validations
- account exists
- note body is non-empty
- note type is valid

### 16.3 Canonical flow

```text
validate note command
-> insert account_notes row
-> insert audit event: note_added
-> invalidate: account:{id}, journal
-> return note result envelope
```

### 16.4 Important rule
Notes should not trigger full account re-evaluation by default.
If a later product rule wants a note to affect mission priority or alerts, that must happen through an explicit separate workflow rule.

---

## 17. Pause and Resume Workflow

### 17.1 Purpose
Allow the operator to structurally remove or restore an account from tactical activity without ambiguity.

### 17.2 Required validations
- account exists
- requested transition is valid from current lifecycle/status
- repeated no-op commands are rejected or treated idempotently

### 17.3 Canonical pause flow

```text
validate pause command
-> update accounts.manuallyPaused = true
-> update accountStatus/lifecycle stage when doctrine requires it
-> insert audit event: account_paused
-> reload evaluation bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> invalidate: account:{id}, dashboard, alerts, journal, calendar, payouts if relevance changed
-> return pause consequence summary
```

### 17.4 Canonical resume flow

```text
validate resume command
-> update accounts.manuallyPaused = false
-> update accountStatus/lifecycle stage if needed
-> insert audit event: account_resumed
-> reload evaluation bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> invalidate: account:{id}, dashboard, alerts, journal, calendar, payouts if relevance changed
-> return resume consequence summary
```

---

## 18. Account Update and Recompute Workflow

### 18.1 Scope
This workflow covers direct fact changes such as:
- external account ref edits
- lifecycle stage corrections
- balance corrections
- notes summary edits if retained
- fee refund flag changes
- last payout date corrections

### 18.2 Doctrine
- durable fact changes are allowed,
- silent truth rewrites are not,
- material corrections must stay auditable.

### 18.3 Canonical flow

```text
validate update command
-> update allowed account fact fields
-> insert balance snapshot if monetary references changed
-> insert audit event: account_updated
-> reload evaluation bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> invalidate affected surfaces
-> return recompute summary
```

### 18.4 Important rule
Any update that changes monetary references or governing profile context must run a full post-write re-evaluation.

---

## 19. Payout Request and Receipt Workflow

Step 6 includes the account-level payout action layer, but not the full screen layer.

### 19.1 Request payout

```text
validate payout request against current evaluation
-> insert payout_requests row with status=requested
-> insert audit event: payout_requested
-> reload account + payout bundle
-> re-evaluate account
-> compare before vs after
-> persist derived payout/system events
-> invalidate: account:{id}, payouts, dashboard, alerts, journal, calendar if timing significance changed
-> return payout request summary
```

### 19.2 Mark payout received

```text
validate payout receipt command
-> update payout_requests row to paid
-> insert or update refund task fact if applicable
-> insert audit event: payout_received
-> reload account + payout bundle
-> re-evaluate account
-> compare before vs after
-> persist derived system events
-> invalidate: account:{id}, payouts, dashboard, alerts, journal, calendar if payout markers changed
-> return payout receipt summary
```

### 19.3 Important boundary
This service should not yet build the Payouts screen list logic; it should only make account-level payout actions trustworthy.

---

## 20. Account-Level History Integrity Rules

History integrity is one of Step 6’s core deliverables.

### 20.1 Every meaningful action must leave a trace
At minimum, a meaningful action should result in:
- one primary durable fact row,
- one audit event row,
- zero or more derived system events if posture changed.

### 20.2 Primary fact timestamps must be explicit
Trade, note, payout, reset, pause/resume, and profile assignment events must carry explicit operational timestamps.

### 20.3 Corrections must remain explainable
When correcting prior facts:
- avoid silent destructive overwrite where practical,
- preserve updated timestamps,
- add audit memory,
- optionally create correction events later if the product deepens revision history.

### 20.4 Profile-history trust must remain intact
A profile change should preserve:
- prior open assignment closure,
- new assignment start,
- audit trace,
- visibility of which version governed later evaluations.

### 20.5 Timeline ordering must be deterministic
When rendering or rebuilding account history later, sort precedence should be:
1. operational timestamp,
2. created-at fallback,
3. stable id tie-break where needed.

### 20.6 Derived system events must reference causal commands
Derived events should preserve enough payload to explain which command and evaluation delta triggered them.

### 20.7 Notes must remain notes
They may enrich history but must not stand in for missing structured events.

---

## 21. Before/After Comparison Contract

All recompute-triggering workflows should capture a comparable operational snapshot before and after evaluation.

```ts
AccountOperationalSnapshot {
  mode: string
  mayTrade: boolean
  mayTradeFullSize: boolean
  mayTradeFractionalOnly: boolean
  payoutState: string | null
  effectiveLives: number | null
  fractionalLives: number | null
  nextAction: string | null
  restrictionCodes: string[]
  alertCodes: string[]
}
```

This snapshot is used for:
- consequence summaries,
- derived system event generation,
- alert generation/resolution,
- later explainability in the Journal and Account Detail timeline.

---

## 22. Surface Invalidation Ownership

Step 6 workflows must emit invalidation keys, not mutate screen-local state directly.

### 22.1 Canonical keys
- `dashboard`
- `account:${accountId}`
- `journal`
- `payouts`
- `calendar`
- `alerts`

### 22.2 Expected invalidations by action

#### Create account
- dashboard
- account:{id}
- journal
- alerts when warnings exist
- payouts/calendar only if immediately relevant

#### Assign profile
- account:{id}
- dashboard
- journal
- alerts
- payouts
- calendar

#### Log trade result
- account:{id}
- dashboard
- journal
- alerts
- payouts if payout posture changed
- calendar if payout/rotation timing significance changed

#### Add note
- account:{id}
- journal

#### Pause / Resume
- account:{id}
- dashboard
- alerts
- journal
- calendar
- payouts if relevance changed

#### Request / Receive payout
- account:{id}
- payouts
- dashboard
- alerts
- journal
- calendar if timing significance changed

---

## 23. Required Repository Expansions for Step 6

The current scaffold repository surface is not yet enough for the full Step 6 workflow layer.
Add purpose-specific repository surfaces rather than generic catch-all helpers.

### 23.1 Account workflow repositories to add
- `accountNotesRepository`
- `tradeLogsRepository`
- `balanceSnapshotsRepository`
- `payoutRequestsRepository`
- `alertsRepository`
- `auditEventsRepository`
- `accountProfileAssignmentsRepository`
- optional `accountTimelineRepository` as a read-only composition helper

### 23.2 Minimum write methods needed
Examples:
- `createAccount()`
- `updateAccountFacts()`
- `closeOpenProfileAssignment()`
- `createProfileAssignment()`
- `insertTradeLog()`
- `insertBalanceSnapshot()`
- `upsertAccountDayState()`
- `insertAccountNote()`
- `insertAuditEvent()`
- `insertAlert()`
- `resolveAlert()`
- `createPayoutRequest()`
- `markPayoutPaid()`

These methods should remain boring and persistence-focused.

---

## 24. Recommended File Placement

```text
src/lib/services/
  accountWorkflowTypes.ts
  accountLifecycleService.ts
  profileAssignmentService.ts
  accountEventWorkflowService.ts
  payoutWorkflowService.ts
  accountHistoryIntegrityService.ts
  accountWorkflowHelpers.ts

src/lib/validation/
  accountWorkflow.ts
  tradeLogging.ts
  accountNotes.ts
  payoutWorkflow.ts
  profileAssignment.ts

 db/repositories/
  accountProfileAssignmentsRepository.ts
  tradeLogsRepository.ts
  balanceSnapshotsRepository.ts
  payoutRequestsRepository.ts
  accountNotesRepository.ts
  alertsRepository.ts
  auditEventsRepository.ts
  accountTimelineRepository.ts
```

This placement preserves the repo doctrine already established in prior steps.

---

## 25. Explicit Out of Scope for Step 6

Do **not** expand this step into:
- full Command Center rendering,
- full Account Detail rendering,
- Journal screen implementation,
- fleet analytics/reporting,
- deep calendar planning UI,
- simulation UI,
- settings/backup/export flows,
- custom dashboard design.

Step 6 is about workflow integrity first.

---

## 26. Step 6 Definition of Done

Step 6 is complete when all of the following are true:

1. Accounts can be created and loaded with explicit governing profile context.
2. Profile assignment changes are durable, validated, and historically traceable.
3. Wins, losses, and custom trade results can be logged as structured facts.
4. Notes can be attached without being mistaken for state-changing events.
5. Meaningful account actions trigger deterministic re-evaluation in the right order.
6. Derived system events and audit records preserve explainability.
7. Account-level history remains trustworthy and reconstructible.
8. Workflow services emit refresh targets rather than forcing screen-local repair.
9. Step 7 can build Command Center and Account Detail on top of these workflows without re-litigating ownership.

---

## 27. Final Statement

Step 6 is where Veradmin stops being only a rule-aware scaffold and becomes a usable operator tool.

If this layer is done well, the operator can take actions, trust that facts were persisted, trust that the account was re-evaluated through the canonical engine, and trust that the later screens will show one coherent truth.

That is the threshold this step is meant to cross.
