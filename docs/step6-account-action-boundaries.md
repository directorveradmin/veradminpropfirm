# Step 6 Account Action Boundaries

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Product

---

## 1. Purpose

This artifact freezes the action boundaries for Step 6 so the workflow layer stays disciplined and Step 7 does not accidentally turn screens into mini workflow engines.

---

## 2. Boundary Principles

1. **Actions write facts, not interpretations.**
2. **Recompute happens after durable writes, not before.**
3. **Notes are contextual memory, not hidden state mutations.**
4. **Profile governance changes are high-impact actions.**
5. **All meaningful actions must be auditable.**
6. **Action handlers return invalidation scope instead of pushing UI state directly.**

---

## 3. Account Creation Boundary

### In scope
- insert account
- assign initial rule profile version
- create initial snapshot
- initialize day-state when required
- evaluate created account
- emit audit/system events

### Must not do
- create screen-specific defaults
- generate dashboard card copy
- guess later mission priorities in the service

### Tables touched
- `accounts`
- `account_rule_profile_assignments`
- optional `account_day_state`
- `balance_snapshots`
- `audit_events`
- alerts only if evaluation requires them

---

## 4. Account Loading Boundary

### In scope
- fetch stored bundle
- resolve governing profile version
- evaluate account
- return degraded markers

### Must not do
- repair invalid data silently
- overwrite pointers or balances during load
- treat missing history as healthy

### Tables read
- `accounts`
- `account_rule_profile_assignments`
- `account_day_state`
- `payout_requests`
- `calendar_rotations`
- `news_events`
- timeline-supporting tables as needed

---

## 5. Profile Assignment Boundary

### In scope
- validate requested profile family/version
- close prior open assignment
- open new assignment
- update account current profile pointers
- re-evaluate account
- persist profile-change audit/system events

### Must not do
- rewrite historical trade facts under the new profile
- hide which version became active
- bypass re-evaluation

### Tables touched
- `account_rule_profile_assignments`
- `accounts`
- `audit_events`
- `alerts` as needed after evaluation

---

## 6. Trade Logging Boundary

### In scope
- structured win/loss/custom logging
- balance mutation
- peak update if needed
- day-state update if needed
- snapshot creation
- full post-write recompute
- alert and system-event persistence

### Must not do
- accept freeform-only trade records as the primary event model
- let the UI perform monetary mutation locally
- skip snapshots after monetary changes

### Tables touched
- `trade_logs`
- `accounts`
- `account_day_state`
- `balance_snapshots`
- `audit_events`
- `alerts` if needed

---

## 7. Notes Boundary

### In scope
- add structured note
- classify note type
- attach note to account
- add audit trace

### Must not do
- change balances
- change mode
- change permissions
- trigger full recompute by default
- stand in for payout/trade/control events

### Tables touched
- `account_notes`
- `audit_events`

---

## 8. Pause / Resume Boundary

### In scope
- toggle manual pause fact
- update account status/lifecycle when doctrine requires it
- re-evaluate account
- emit system transitions and alerts

### Must not do
- fake a temporary UI-only pause state
- leave the account in stale tradability after the write

### Tables touched
- `accounts`
- `audit_events`
- `alerts` as needed

---

## 9. Account Update Boundary

### In scope
- update allowed durable facts
- snapshot when monetary references change
- re-evaluate when the changed facts affect operational truth
- preserve auditability

### Must not do
- overwrite derived truth columns as if they were authoritative
- silently reinterpret the account without storing the fact change

### Tables touched
- `accounts`
- optional `balance_snapshots`
- `audit_events`
- alerts if needed

---

## 10. Payout Request Boundary

### In scope
- validate payout action against current evaluation
- insert payout request fact
- re-evaluate account/payout posture
- emit payout/system transitions

### Must not do
- implement the whole Payouts surface
- bypass readiness validation
- use notes as payout fact substitutes

### Tables touched
- `payout_requests`
- `audit_events`
- `alerts` as needed

---

## 11. Mark Payout Received Boundary

### In scope
- mark payout received on an existing payout request
- persist refund/admin follow-up facts if doctrine requires
- re-evaluate account
- emit payout/system transitions

### Must not do
- silently create receipt history without linking to a payout request
- skip follow-up auditability

### Tables touched
- `payout_requests`
- optional `refund_tasks`
- `audit_events`
- `alerts` as needed

---

## 12. History Integrity Boundary

### In scope
- detect timeline contradictions
- surface integrity markers
- preserve causal links between fact events and derived system events

### Must not do
- silently suppress broken ordering
- pretend partial history is complete

### Tables touched
- read-only across timeline tables
- optional `alerts`/`audit_events` if integrity warning persistence is enabled

---

## 13. Screen Boundary for Step 7

Step 7 may:
- invoke workflow services,
- render workflow outputs,
- display consequence summaries,
- trigger read-model refresh using returned invalidation keys,
- manage local UI state.

Step 7 may not:
- write directly to raw tables from components,
- decide mode transitions locally,
- infer what changed from balances alone,
- invent timeline events that were not persisted.

---

## 14. Out-of-Scope Boundaries Preserved

Still out of scope after Step 6:
- full Journal screen behavior
- full Payouts screen grouping logic
- Calendar/Rotation screen rendering
- backup/export/recovery surfaces
- advanced simulation UX
- reporting/analytics

---

## 15. Final Statement

These boundaries protect Veradmin from a common failure mode:

building visible screens that appear interactive, but are actually hiding fractured workflow truth underneath.

Step 6 avoids that by making the action layer explicit before the major screens are completed.
