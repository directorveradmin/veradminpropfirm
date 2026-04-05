# Veradmin Step 3: Repositories, Validation, and Stored-vs-Derived Boundaries

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Data / Domain  
Applies To: Repository contracts, query boundaries, validation placement, and data responsibility rules

---

## 1. Purpose

This document freezes the Step 3 boundaries that prevent persistence, domain evaluation, and UI behavior from collapsing into each other.

Step 4 should inherit these rules rather than renegotiating them.

---

## 2. Repository Boundary Rule

Repositories own persistence access.
They do **not** own domain truth.

Repositories may:
- load tables and explicit joins
- apply filters, ordering, and pagination
- assemble evaluation input records from stored facts
- persist durable facts/events
- return typed records for services/domain consumption

Repositories may **not**:
- decide tradability
- assign tactical mode
- decide payout readiness
- decide alert severity semantics
- generate UI copy
- invent view models

---

## 3. Recommended Repository Surface

Use boring, purpose-specific repository contracts.

Recommended initial contracts:
- `firmsRepository`
- `ruleProfilesRepository`
- `ruleProfileVersionsRepository`
- `accountsRepository`
- `accountProfileAssignmentsRepository`
- `accountDayStateRepository`
- `tradeLogsRepository`
- `balanceSnapshotsRepository`
- `payoutRequestsRepository`
- `refundTasksRepository`
- `newsEventsRepository`
- `calendarRotationsRepository`
- `alertsRepository`
- `auditEventsRepository`
- `accountNotesRepository`
- `tagsRepository`
- `fleetSettingsRepository`
- `importsExportsLogRepository`

This is a contract list, not a promise that every repository needs a large API immediately.

---

## 4. High-Value Query Shapes for Step 4

The next step will need stable read shapes.
Prepare repositories for these patterns.

### 4.1 Evaluation input bundle

A service should be able to ask for a single typed bundle containing:
- account
- governing profile version
- current/open profile assignment
- current day state
- recent payout records relevant to readiness
- relevant news windows if applicable
- relevant rotation/cooldown windows if applicable

This bundle is still **stored facts only**.
No derived permissions should be returned as truth.

### 4.2 Account timeline bundle

For explanation/history later, services should be able to load:
- recent trade logs
- recent snapshots
- recent notes
- recent audit events
- recent alerts

### 4.3 Fleet summary raw bundle

For later command-center shaping, repositories may return raw grouped records such as:
- active accounts by lifecycle stage
- open alerts by severity/status
- payout requests by status

But final tactical interpretation still belongs to domain/services/view-model layers.

---

## 5. Validation Placement

Validation should happen in three places.

## 5.1 Schema/database validation

Good for:
- foreign keys
- uniqueness
- not-null requirements
- check constraints
- partial unique indexes where supported/practical

Examples:
- one active fleet settings row
- non-negative payout amounts
- unique profile version per family/version number
- valid foreign keys for current profile version

## 5.2 Zod/input validation

Good for:
- UI submissions
- import payloads
- rule profile edits
- seed/fixture manifests
- service command inputs

Examples:
- trade log input shape
- payout request payload
- account create/update command
- profile version JSON payload
- fixture manifest contract

## 5.3 Service-layer invariant checks

Good for multi-record or workflow rules.

Examples:
- archived accounts cannot receive new trade events
- profile reassignment must close prior open assignment
- meaningful writes must emit audit events
- balance correction should create snapshot + audit entry
- restore/import should create import/export log entry

---

## 6. Stored vs Derived Boundary

The most important Step 3 rule:

**Store facts. Derive operational truth.**

## 6.1 Store as durable truth

Store these directly:
- firm identities
- profile families and profile versions
- profile assignments
- account labels and external refs
- lifecycle stage where it is a durable operational fact
- coarse account status such as paused/archived/breached when explicitly observed
- balances and balance snapshots
- operator-entered day-state references
- payout requests and refund tasks
- notes
- alerts as persisted attention records
- rotations
- news windows
- audit events
- import/export/backup history

## 6.2 Derive dynamically in Step 4+

Do **not** store these as authoritative fields:
- lives remaining
- fractional lives
- effective hard floor
- dominant floor
- current mode
- tradable flag
- full-size allowed flag
- fractional-only flag
- payout-ready flag
- payout-blocked explanation
- alert-generation reasoning
- next recommended action
- fleet health score

## 6.3 Cache later only if justified

If future performance requires caching, cached fields must be:
- clearly documented as cache, not source of truth
- recomputable from stored facts
- invalidated through explicit service rules

---

## 7. Service Layer Responsibility Rule

Services are the orchestrators between repositories and the future domain engine.

Examples of correct service responsibilities:
- create account with initial assignment + audit
- log trade event + snapshot + audit
- change profile assignment + audit
- mark payout requested/received + snapshot + audit
- restore/import + validation + logs

Services should call repositories and later the rule engine, but should not hide raw SQL or UI behavior inside themselves.

---

## 8. View-Model Boundary Rule

`src/lib/view-models/` should only consume:
- stored facts already loaded
- engine outputs already computed
- service-assembled summaries

View models should never backfill missing persistence truth or invent rule semantics.

---

## 9. Supabase Boundary Rule

Because local-first is frozen, no repository should assume network access.

If Supabase is connected later, it must sit behind a deliberate adapter boundary for one of these purposes only:
- optional sync
- optional backup/export target
- remote test harness

It must not replace local SQLite as the canonical source of truth for Step 3 or Step 4.

---

## 10. Implementation Notes for Folder Placement

Suggested placement:

```text
src/lib/validation/
  accounts.ts
  ruleProfiles.ts
  trades.ts
  payouts.ts
  fixtures.ts

src/lib/services/
  accountLifecycleService.ts
  tradeLoggingService.ts
  profileAssignmentService.ts
  payoutWorkflowService.ts
  importExportService.ts

 db/repositories/
  accountsRepository.ts
  ruleProfilesRepository.ts
  tradeLogsRepository.ts
  ...
```

The exact filenames can vary, but the boundary ownership should not.

---

## 11. Step 3 Definition of Done

This document is satisfied when:

1. Repositories are clearly prevented from becoming ad hoc rule engines.
2. Validation responsibilities are split cleanly across DB, Zod, and services.
3. Stored vs derived boundaries are explicit enough for Step 4 to start safely.
4. Services have a clear orchestration role.
5. Supabase or any later sync path cannot distort the local-first truth hierarchy.

---

## 12. Final Statement

If the database starts deciding tactics, or the UI starts storing interpretations as truth, Veradmin will drift quickly.
Step 3 is the point where those drifts must be prevented on purpose.
