# Veradmin Data Model

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Data Layer  
Applies To: SQLite schema, migrations, imports/exports, sync boundaries, auditability, and reporting

---

## 1. Purpose of This Document

This document defines the canonical data model for Veradmin.

It exists to ensure that the product is built on a stable, explainable, local-first foundation. Veradmin is not a disposable interface layered over loose JSON blobs. It is a tactical operating system that depends on trustworthy data relationships, derived state, and full historical explainability.

The data model must support:

- day-to-day operation
- account evaluation
- rule enforcement
- simulation
- journaling
- payout tracking
- calendar rotation
- alerts
- analytics
- audit history
- safe backup and restore
- future sync

---

## 2. Data Model Principles

### 2.1 Local-first source of truth

The canonical source of truth in v1 is the local database.

### 2.2 Event-aware, not just snapshot-aware

Current account state matters, but operational history matters too. The model must preserve enough event history to explain how a state was reached.

### 2.3 Separation of stored and derived data

Not every useful field belongs in storage. Many values should be computed from raw state and events.

### 2.4 Human recovery matters

The model must support export, restore, inspection, and manual repair if needed.

### 2.5 Versionability matters

Schema and rule profiles will evolve. The model must support migrations and historical understanding.

### 2.6 Future sync must not distort local semantics

Any future cloud layer must map onto the local data model, not redefine it.

---

## 3. Data Layer Responsibilities

The Veradmin data layer must support four kinds of information:

1. **Reference data**  
   Stable definitions such as firms, rule profiles, tags, and settings.

2. **Operational state**  
   Current account state, day state, rotation state, and payout state.

3. **Event history**  
   Trade logs, mode changes, notes, resets, payout requests, overrides, audit entries.

4. **Derived views**  
   Values calculated by the rule engine and then rendered by the UI.

---

## 4. Canonical Storage Strategy

V1 uses:

- SQLite as the local database
- Drizzle ORM or equivalent type-safe schema tooling
- migrations checked into the repo
- seed scripts checked into the repo
- export/import utilities for human recovery

The database file is an asset of operational significance and must be treated accordingly.

---

## 5. Entity Overview

The data model is organized into these core entities:

- firms
- firm_rule_profiles
- accounts
- account_day_state
- trade_logs
- balance_snapshots
- payout_requests
- refund_tasks
- news_events
- calendar_rotations
- alerts
- audit_events
- account_notes
- tags
- account_tag_links
- fleet_settings
- rule_snapshots
- imports_exports_log

Not all of these need to ship in the first coded migration, but the model should anticipate them from the start.

---

## 6. Reference Data Tables

## 6.1 `firms`

Purpose: store prop-firm identities.

Suggested fields:

- `id`
- `name`
- `slug`
- `status`
- `notes`
- `created_at`
- `updated_at`

Use this table to prevent repeated firm names from being scattered through account records.

---

## 6.2 `firm_rule_profiles`

Purpose: store rule packs used by the rule engine.

Suggested fields:

- `id`
- `firm_id`
- `name`
- `version`
- `is_active`
- `phase_type`
- `drawdown_type`
- `max_drawdown_mode` (absolute / percent)
- `max_drawdown_value`
- `daily_drawdown_mode` (absolute / percent)
- `daily_drawdown_value`
- `risk_unit_mode`
- `risk_unit_value`
- `minimum_trading_days`
- `profit_target_mode`
- `profit_target_value`
- `consistency_cap_mode`
- `consistency_cap_value`
- `payout_frequency_days`
- `payout_window_rules_json`
- `rotation_rules_json`
- `news_restriction_rules_json`
- `override_policy_json`
- `created_at`
- `updated_at`

This table is foundational. Rule logic must point to it rather than hard-coded assumptions.

---

## 6.3 `tags`

Purpose: normalized labels for trade setups, notes, or account classifications.

Suggested fields:

- `id`
- `scope` (`trade`, `account`, `note`, `system`)
- `name`
- `slug`
- `color_token`
- `created_at`

---

## 6.4 `fleet_settings`

Purpose: store operator-level defaults and app-wide settings.

Suggested fields:

- `id`
- `trading_day_boundary`
- `default_news_lock_minutes_before`
- `default_news_lock_minutes_after`
- `default_fractional_risk_policy`
- `backup_schedule`
- `theme_preference`
- `safety_preferences_json`
- `created_at`
- `updated_at`

There may only be one active settings row in v1.

---

## 7. Operational State Tables

## 7.1 `accounts`

Purpose: represent each managed account.

Suggested fields:

- `id`
- `firm_id`
- `rule_profile_id`
- `account_label`
- `external_account_ref`
- `phase` (`step1`, `step2`, `funded`, `live`, `retired`)
- `status` (`active`, `paused`, `stopped`, `breached`, `archived`)
- `starting_balance`
- `current_balance`
- `peak_balance`
- `daily_start_balance`
- `days_traded`
- `profit_target_progress`
- `last_payout_date`
- `fee_refunded`
- `manually_paused`
- `archived_at`
- `notes_summary`
- `created_at`
- `updated_at`

This table stores durable account attributes and current core balances.

It should not store every derived field the UI might want.

---

## 7.2 `account_day_state`

Purpose: store per-account day-boundary state when daily logic matters.

Suggested fields:

- `id`
- `account_id`
- `trading_date`
- `day_start_balance`
- `realized_pnl_today`
- `daily_floor_cached`
- `daily_status`
- `reset_completed_at`
- `created_at`
- `updated_at`

This isolates daily-state tracking from the main account record and makes reset behavior easier to reason about.

---

## 7.3 `calendar_rotations`

Purpose: store active and planned rotation windows.

Suggested fields:

- `id`
- `account_id`
- `rotation_type`
- `window_start`
- `window_end`
- `state` (`active`, `inactive`, `planned`, `completed`, `skipped`)
- `reason`
- `created_at`
- `updated_at`

This table enables the Revolving Door system and future planning.

---

## 7.4 `alerts`

Purpose: persist non-transient alerts when needed.

Suggested fields:

- `id`
- `account_id` nullable
- `type`
- `severity`
- `status` (`active`, `dismissed`, `resolved`)
- `title`
- `message`
- `source`
- `source_ref_id`
- `created_at`
- `resolved_at`

Not every UI warning needs to be persisted, but meaningful operational alerts should be storable.

---

## 8. Event and History Tables

## 8.1 `trade_logs`

Purpose: store individual trade outcomes and metadata.

Suggested fields:

- `id`
- `account_id`
- `trading_timestamp`
- `trade_date`
- `session`
- `direction`
- `result_type` (`win`, `loss`, `custom`)
- `points`
- `pnl_amount`
- `risk_unit_fraction`
- `was_rule_following`
- `was_near_news`
- `setup_tag_id` nullable
- `screenshot_path` nullable
- `note`
- `created_at`

This table is central to both journaling and later analytics.

---

## 8.2 `balance_snapshots`

Purpose: store periodic or event-driven balance state snapshots.

Suggested fields:

- `id`
- `account_id`
- `snapshot_timestamp`
- `current_balance`
- `peak_balance`
- `daily_start_balance`
- `snapshot_reason`
- `created_at`

Snapshots make historical reconstruction easier and reduce reliance on replaying every trade for certain analyses.

---

## 8.3 `payout_requests`

Purpose: store payout workflow history.

Suggested fields:

- `id`
- `account_id`
- `requested_at`
- `expected_arrival_at`
- `received_at`
- `amount_requested`
- `amount_received`
- `status` (`planned`, `requested`, `processing`, `paid`, `rejected`, `cancelled`)
- `notes`
- `created_at`
- `updated_at`

This table converts cash-flow management into something explicit and operable.

---

## 8.4 `refund_tasks`

Purpose: track fee-refund follow-ups.

Suggested fields:

- `id`
- `account_id`
- `triggered_at`
- `status` (`pending`, `contacted`, `received`, `dismissed`)
- `resolution_note`
- `created_at`
- `updated_at`

---

## 8.5 `news_events`

Purpose: store user-entered red-folder news and restriction windows.

Suggested fields:

- `id`
- `event_timestamp`
- `title`
- `impact_level`
- `asset_scope`
- `lock_minutes_before`
- `lock_minutes_after`
- `notes`
- `created_at`
- `updated_at`

---

## 8.6 `account_notes`

Purpose: store freeform account-level notes.

Suggested fields:

- `id`
- `account_id`
- `note_type`
- `body`
- `created_at`
- `updated_at`

---

## 8.7 `audit_events`

Purpose: preserve the operational trail.

Suggested fields:

- `id`
- `account_id` nullable
- `event_type`
- `event_timestamp`
- `actor_type` (`user`, `system`, `migration`, `sync`)
- `summary`
- `payload_json`
- `rule_profile_version`
- `created_at`

This is one of the most important tables in Veradmin.

It answers the question: “Why is this account in this state?”

---

## 8.8 `rule_snapshots`

Purpose: preserve rule profile state as evaluated at meaningful moments.

Suggested fields:

- `id`
- `rule_profile_id`
- `version`
- `snapshot_json`
- `captured_at`

This is important because firm rules and strategy policies can evolve. Without snapshots, historical decisions become hard to explain.

---

## 8.9 `imports_exports_log`

Purpose: store history of data import/export operations.

Suggested fields:

- `id`
- `operation_type` (`import`, `export`, `backup`, `restore`)
- `file_path`
- `status`
- `summary`
- `created_at`

This helps with operational trust and recovery tracing.

---

## 9. Relationship Model

Primary relationships:

- one firm has many rule profiles
- one rule profile can be used by many accounts
- one account has many trade logs
- one account has many balance snapshots
- one account has many payout requests
- one account has many notes
- one account has many audit events
- one account has many rotation windows
- one account may have many alerts over time
- one setup tag can be linked to many trade logs

The schema should prefer foreign keys and explicit relationship integrity where practical.

---

## 10. Stored vs Derived Data

This distinction is critical.

### 10.1 Store directly

Store things that are durable facts or events:

- balances as recorded
- trade results
- payout requests
- notes
- alerts
- snapshots
- timestamps
- user-entered news
- manual pauses
- rule profile assignments

### 10.2 Derive dynamically

Do not store as primary truth:

- lives remaining
- effective mode
- tradable status
- payout readiness
- risk severity
- compliance severity
- next best action
- account permission state

These should be computed by the rule engine from stored facts.

### 10.3 Cache only when justified

If performance later requires caching a derived field, do so intentionally and document the invalidation rules.

---

## 11. Enumerations

Use strong enums or equivalent type-safe value sets for:

- account phase
- account status
- drawdown type
- payout status
- alert severity
- trade result type
- session
- direction
- mode
- event type
- note type
- rotation state

Magic strings scattered through the codebase are prohibited.

---

## 12. Migration Strategy

Every schema change must be migration-driven.

Rules:

1. No manual production schema edits.
2. Every migration must be checked into version control.
3. Migrations must be reversible where practical.
4. Seed scripts must be kept in sync with schema evolution.
5. Migration notes must explain any breaking data assumptions.

---

## 13. Seed Data Requirements

Seed data is mandatory.

The repo should include at least three seed fleet configurations:

### 13.1 Normal fleet

A realistic mixed fleet with:

- multiple firms
- step accounts
- funded accounts
- static and trailing profiles
- mixed payout readiness states

### 13.2 Messy fleet

A fleet with:

- incomplete fields
- paused accounts
- outdated notes
- inconsistent day states
- refund tasks pending

### 13.3 Edge-case fleet

A fleet with:

- balances exactly on floor
- one cent above floor
- one cent below floor
- zero-trade accounts
- nearly reached consistency caps
- same-day payout and restriction collisions

These are essential for UI validation and rule-engine testing.

---

## 14. Backups, Restore, and Export

Because Veradmin is local-first, the data model must support safe human recovery.

### 14.1 Required export formats

At minimum:

- full database backup
- JSON export for selected accounts or system snapshots
- CSV export for trade logs and payout history

### 14.2 Restore requirements

The system should be able to:

- restore from full backup
- import validated data sets
- reject malformed imports safely
- log restore operations

### 14.3 Human readability

Not every backup must be human-readable, but at least some exports should be inspectable without proprietary tooling.

---

## 15. Future Sync Boundary

Cloud sync is out of scope for the source-of-truth design in v1, but the model should prepare for it.

The sync boundary should treat local records as authoritative until a sync strategy is explicitly designed.

Important future considerations:

- stable ids
- created/updated timestamps
- soft deletes where needed
- sync conflict policy
- audit preservation

Do not deform the local data model just to make hypothetical sync easier.

---

## 16. Performance and Indexing Guidance

Likely indexes:

- `accounts(rule_profile_id)`
- `trade_logs(account_id, trading_timestamp)`
- `balance_snapshots(account_id, snapshot_timestamp)`
- `payout_requests(account_id, requested_at)`
- `audit_events(account_id, event_timestamp)`
- `calendar_rotations(account_id, window_start)`
- `alerts(status, severity)`
- `news_events(event_timestamp)`

The goal is not premature optimization. It is preserving fast local response as the fleet grows and history accumulates.

---

## 17. Data Quality Rules

The app should enforce some invariants where possible.

Examples:

- current balance cannot be null for active accounts
- peak balance cannot be below starting balance when a trailing profile requires otherwise without explanation
- daily start balance must exist for accounts subject to daily stop logic
- payout amounts must be non-negative
- balance snapshots must have timestamps
- archived accounts should not be tradable

Some of these can be enforced at the database layer, others in service logic.

---

## 18. Suggested Repo Structure

```text
db/
  schema/
    firms.ts
    ruleProfiles.ts
    accounts.ts
    trades.ts
    payouts.ts
    alerts.ts
    audit.ts
    settings.ts
  migrations/
  seeds/
    normalFleet.ts
    messyFleet.ts
    edgeCases.ts
  exports/
  backups/
```

---

## 19. Data Model Anti-Patterns to Avoid

1. Storing UI-only concepts as durable truth.
2. Recomputing history from lossy aggregates.
3. Keeping rule logic in JSON blobs with no version discipline.
4. Treating notes as the place where structured operational meaning lives.
5. Building exports too late.
6. Allowing page components to mutate core records directly without service boundaries.
7. Storing too many derived flags that can drift out of sync.

---

## 20. Definition of Done

The data model is considered production-ready when:

- core entities are normalized and migration-backed
- seed data covers normal, messy, and edge scenarios
- stored vs derived boundaries are explicit
- exports and backups exist
- audit history can explain account state transitions
- the rule engine can evaluate all seeded records cleanly
- future sync remains possible without corrupting local-first semantics

---

## 21. Final Standard

The Veradmin data model must feel boring in the best possible way.

It should be stable.
It should be understandable.
It should be recoverable.
It should be difficult to corrupt accidentally.
It should make rule evaluation and operator trust stronger, not weaker.

If someone opens the repo months later and can clearly understand what is stored, what is derived, and how operational truth flows through the system, then this document has been implemented correctly.
