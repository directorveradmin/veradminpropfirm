# Veradmin Step 3: Data Model Implementation Guide

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Data / Engineering  
Applies To: Step 3 schema refinement, entity relationships, migration planning, and Step 4 readiness

---

## 1. Purpose

This document completes Step 3 of 12 for Veradmin.

Its job is to turn the canonical data-model, rule-profile, fixture, and repository docs into an implementation-ready persistence foundation inside the Step 2 scaffold.

This step does **not** implement the rule engine.
It does **not** implement major screens.
It does **not** redesign the product.
It refines the persistence layer so Step 4 can consume clean, trustworthy inputs.

---

## 2. Governing Constraints Carried Forward

Step 3 must preserve the following:

- Veradmin remains **desktop-first** and **local-first**.
- SQLite remains the canonical v1 source of truth.
- `db/` remains the persistence boundary.
- Tauri remains a shell/platform boundary, not a rule-semantics layer.
- Stored facts, rule profiles, deterministic evaluation, and UI view-models remain distinct.
- The rule engine is still deferred to the next step.

### Supabase treatment in Step 3

A Supabase project may exist for future sync, testing, or backup workflows, but it is **not** the canonical source of truth in Step 3.
The schema should therefore be authored against SQLite-first semantics and local migrations.
Any future Supabase use must adapt to this model rather than redefining it.

---

## 3. Step 3 Scope

This step covers:

- schema refinement
- entity and relationship decisions
- migration grouping guidance
- repository/query boundaries
- stored vs derived rules
- validation responsibilities
- fixture categories and seed guidance
- profile versioning and assignment traceability

This step does **not** cover:

- lives calculations
- mode assignment
- payout-readiness logic
- alert derivation logic
- screen implementation
- sync architecture

---

## 4. Canonical Persistence Shape for Step 3

The persistence layer should be split into five conceptual groups.

### 4.1 Reference/configuration
- `firms`
- `rule_profiles`
- `rule_profile_versions`
- `tags`
- `fleet_settings`

### 4.2 Current operational state
- `accounts`
- `account_day_state`
- `calendar_rotations`

### 4.3 Event/history
- `trade_logs`
- `balance_snapshots`
- `payout_requests`
- `refund_tasks`
- `account_notes`
- `audit_events`
- `imports_exports_log`

### 4.4 Operator-entered timing constraints
- `news_events`

### 4.5 Link/history tables
- `account_tag_links`
- `account_rule_profile_assignments`

This shape keeps durable facts and assignment history explicit without prematurely storing engine truth.

---

## 5. Key Schema Refinement Decisions

## 5.1 Split profile identity from profile version

The earlier canonical docs describe `firm_rule_profiles` with embedded version fields.
Step 3 refines that into two tables:

### `rule_profiles`
Stable profile family identity.
Examples:
- funded trailing profile family
- evaluation static target profile family
- funded consistency profile family

Suggested columns:
- `id`
- `firm_id`
- `profile_key` (stable slug)
- `name`
- `stage_type`
- `account_class`
- `status` (`draft`, `active`, `retired`)
- `created_at`
- `updated_at`

### `rule_profile_versions`
Immutable effective-dated version rows.
Suggested columns:
- `id`
- `rule_profile_id`
- `version_number`
- `version_label`
- `is_active`
- `effective_from`
- `effective_to` nullable
- `supersedes_version_id` nullable
- `firm_rules_json`
- `operator_overlay_compatibility_json`
- `normalized_summary_json`
- `notes`
- `created_at`
- `updated_at`

Why this refinement matters:
- preserves historical trust
- makes profile changes auditable
- lets accounts point to the exact governing version
- avoids mutable profile blobs silently rewriting history

## 5.2 Add explicit account profile assignment history

Use `account_rule_profile_assignments` rather than relying only on the current account row.

Suggested columns:
- `id`
- `account_id`
- `rule_profile_id`
- `rule_profile_version_id`
- `assigned_at`
- `ended_at` nullable
- `assignment_reason`
- `assigned_by` (`user`, `system`, `migration`)
- `notes`
- `created_at`

The `accounts` table should still keep current foreign keys for efficient reads, but assignment history must also exist.

## 5.3 Keep accounts focused on durable state, not engine outputs

`accounts` should store durable account facts and current monetary references.
It should **not** become a cache dump for engine conclusions.

Recommended stored fields:
- identity and ownership
- firm/profile/version foreign keys
- account label and external ref
- lifecycle stage
- coarse account status
- starting balance
- current balance
- peak balance
- manual pause state
- archived/breached timestamps where applicable
- created/updated timestamps

Recommended removals from authoritative storage in v1:
- `profit_target_progress`
- `lives_remaining`
- `effective_mode`
- `tradable`
- `payout_ready`
- `next_action`

`days_traded` may be stored only if it is a durable imported/manual reference.
If it is always reconstructable from qualifying day rules later, the engine should treat it as a reference input rather than a UI shortcut.

## 5.4 Keep `account_day_state` as the daily reset boundary

`account_day_state` should be one row per account per trading date.
This table is the correct place for:
- trading date
- day-start balance
- realized P/L for the date
- reset completion timestamp
- notes about incomplete/reset anomalies

Do **not** store derived daily tradability or tactical mode here as authoritative truth.

## 5.5 Keep `balance_snapshots` event-oriented

`balance_snapshots` should exist to make reconstruction and audit easier.
Create snapshots on meaningful write moments such as:
- trade/event write
- payout state change
- manual correction
- import/restore
- profile reassignment if balance-related references change

## 5.6 Keep `audit_events` mandatory for meaningful writes

Any meaningful write in Step 4 and later should emit an audit event.
That includes:
- profile assignment
- trade log creation
- payout request changes
- pause/resume
- restore/import
- manual balance correction

---

## 6. Recommended Initial Entity Set for the First Coded Migration

Step 3 should treat the following as the first-class migration target:

1. `firms`
2. `rule_profiles`
3. `rule_profile_versions`
4. `accounts`
5. `account_rule_profile_assignments`
6. `account_day_state`
7. `trade_logs`
8. `balance_snapshots`
9. `payout_requests`
10. `refund_tasks`
11. `news_events`
12. `calendar_rotations`
13. `alerts`
14. `audit_events`
15. `account_notes`
16. `tags`
17. `account_tag_links`
18. `fleet_settings`
19. `imports_exports_log`

### Deferred from initial migration unless immediately needed
- `rule_snapshots`

Reason:
The versioned-profile table plus assignment history already preserve the core trust boundary needed for Step 4.
If a later step requires evaluation-time frozen snapshots beyond version history, `rule_snapshots` can be added deliberately.

---

## 7. Relationship Model

Primary relationships should be:

- one `firm` -> many `rule_profiles`
- one `rule_profile` -> many `rule_profile_versions`
- one `rule_profile_version` -> many `accounts` as current governing version
- one `account` -> many `account_rule_profile_assignments`
- one `account` -> many `trade_logs`
- one `account` -> many `balance_snapshots`
- one `account` -> many `payout_requests`
- one `account` -> many `refund_tasks`
- one `account` -> many `calendar_rotations`
- one `account` -> many `alerts`
- one `account` -> many `account_notes`
- one `account` -> many `audit_events`
- one `account` -> many `account_tag_links`
- one `tag` -> many `account_tag_links`
- one `fleet_settings` active row for the installation

Foreign keys should be enforced wherever possible.
Soft ambiguity is not acceptable at the persistence boundary.

---

## 8. Migration Grouping Guidance

To keep Step 3 implementation calm, migrations should be grouped by dependency order.

### Migration group A: core reference/config
- `firms`
- `rule_profiles`
- `rule_profile_versions`
- `tags`
- `fleet_settings`

### Migration group B: accounts and assignment history
- `accounts`
- `account_rule_profile_assignments`
- `account_day_state`

### Migration group C: event/history
- `trade_logs`
- `balance_snapshots`
- `payout_requests`
- `refund_tasks`
- `account_notes`
- `audit_events`

### Migration group D: timing and attention layers
- `news_events`
- `calendar_rotations`
- `alerts`
- `imports_exports_log`
- `account_tag_links`

This lets Step 4 begin consuming stable records without needing every later feature surface.

---

## 9. Indexing Guidance

Create indexes intentionally around the read paths the next step will need.

Recommended initial indexes:
- `rule_profiles(firm_id, profile_key)` unique
- `rule_profile_versions(rule_profile_id, version_number)` unique
- `rule_profile_versions(rule_profile_id, is_active)`
- `accounts(rule_profile_version_id)`
- `accounts(firm_id, lifecycle_stage, account_status)`
- `account_rule_profile_assignments(account_id, assigned_at desc)`
- `trade_logs(account_id, trading_timestamp desc)`
- `balance_snapshots(account_id, snapshot_timestamp desc)`
- `payout_requests(account_id, requested_at desc)`
- `audit_events(account_id, event_timestamp desc)`
- `calendar_rotations(account_id, window_start)`
- `alerts(account_id, status, severity)`
- `news_events(event_timestamp)`

---

## 10. Naming and Type Discipline

Use boring, explicit names.

Rules:
- singular TS schema objects, plural table names
- `*_id` foreign key naming
- `*_at` timestamps in UTC ISO strings or database timestamps
- `*_json` suffix only for structured objects that remain validated
- no magic strings in application logic
- enums must be centralized and reused by schema + validation + services

Use integer cents or precise decimals consistently for money.
Do not mix floating arithmetic conventions across tables.

---

## 11. Step 3 Definition of Done

Step 3 is complete when all of the following are true:

1. The database shape reflects the doctrine without storing engine truth.
2. Rule profiles are versioned and accounts can point to exact governing versions.
3. Assignment history is explicit.
4. Event/history tables exist for explainability.
5. Seeds and fixtures have a documented home and purpose.
6. Repository contracts can serve Step 4 without leaking UI logic.
7. Stored vs derived boundaries are frozen clearly enough that Step 4 does not have to re-litigate them.

---

## 12. Final Statement

Step 3 should make Veradmin’s memory trustworthy before Veradmin’s reasoning is implemented.
The next step can now focus on deterministic evaluation because the persistent facts, profile identity, and history model are no longer ambiguous.
