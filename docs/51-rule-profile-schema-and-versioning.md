# Veradmin Step 3: Rule Profile Schema and Versioning

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Rule Engine / Data  
Applies To: Rule profile persistence, versioning, validation, adaptation workflow, and account assignment traceability

---

## 1. Purpose

This document turns the canonical rule-profile doctrine into an implementation-ready persistence and validation shape for Step 3.

The goal is not to implement evaluation.
The goal is to make policy environments structured, versioned, assignable, and testable.

---

## 2. Canonical Modeling Rule

The system should model a rule profile in three layers:

1. **Profile family identity**  
   Stable concept such as “Funded Trailing” or “Evaluation Static Target”.

2. **Profile version**  
   Immutable effective-dated version of that family.

3. **Profile assignment**  
   Which account was governed by which version, when, and why.

This prevents silent mutation of the policy environment.

---

## 3. Schema Shape

## 3.1 `rule_profiles`

Purpose: stable profile family metadata.

Suggested fields:
- `id`
- `firm_id`
- `profile_key`
- `name`
- `stage_type`
- `account_class`
- `status`
- `description`
- `created_at`
- `updated_at`

### Notes
- `profile_key` should be stable and human-readable.
- Example: `funded_trailing`, `eval_static_target`, `funded_consistency`.
- Do not encode version numbers into this table.

## 3.2 `rule_profile_versions`

Purpose: immutable normalized rule payload plus version metadata.

Suggested fields:
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

### Notes
- `firm_rules_json` is the full structured rule payload.
- `operator_overlay_compatibility_json` documents what overlays may be layered later.
- `normalized_summary_json` is not for UI chrome; it is a compact normalized summary used by repositories/services to avoid reparsing unstructured blobs.
- Rows should be treated as immutable except for controlled activation/retirement metadata.

## 3.3 `account_rule_profile_assignments`

Purpose: preserve assignment history and assignment reasons.

Suggested fields:
- `id`
- `account_id`
- `rule_profile_id`
- `rule_profile_version_id`
- `assigned_at`
- `ended_at` nullable
- `assignment_reason`
- `assigned_by`
- `notes`
- `created_at`

### Notes
- An account should have exactly one open assignment at a time.
- Current account pointers should mirror the open assignment for fast load paths.

---

## 4. Canonical Payload Shape for `firm_rules_json`

The payload should remain schema-validated and should use these sections.

### 4.1 Metadata
- profile key
- display name
- firm label
- stage type
- account class
- profile family status

### 4.2 Drawdown rules
- drawdown type (`static`, `trailing`)
- max drawdown mode/value
- max drawdown reference basis
- daily drawdown enabled flag
- daily drawdown mode/value
- daily drawdown reference basis
- reset behavior

### 4.3 Stage/target rules
- stage progression type
- profit target mode/value
- pass conditions
- fail conditions
- phase completion notes

### 4.4 Trading day rules
- minimum trading days enabled flag
- minimum trading days value
- qualifying day definition
- carry/reset notes

### 4.5 Payout rules
- payout eligibility enabled flag
- waiting period days
- payout cadence days
- payout request window rules
- payout blocker rules
- payout protection relevance flag

### 4.6 Consistency/concentration rules
- consistency enabled flag
- consistency cap mode/value
- basis type (`single_trade`, `single_day`, `rolling_window`)
- rolling window size if applicable

### 4.7 Rotation and eligibility flags
- funded rotation eligible
- cooldown compatible
- operator rest overlay allowed

### 4.8 Restriction notes
- weekend restriction flags
- firm-defined news restriction flags
- special notes/exceptions

### 4.9 Version metadata
- version number
- version label
- effective dates
- supersedes reference
- notes

---

## 5. Required Separation: Firm Rules vs Operator Overlays

Step 3 must keep these distinct even before overlay logic is implemented.

### Firm-enforced
- drawdown and floor definitions
- minimum trading days
- payout waiting periods
- phase progression thresholds
- firm-defined consistency policies

### Operator overlay compatibility only
- custom preservation triggers
- red-folder avoidance policy beyond firm requirement
- funded rotation rhythm preferences
- alert tuning preferences
- voluntary cooldown packs

Store operator overlay **compatibility** in Step 3.
Do not implement active overlay combination logic yet.
That belongs after the rule engine foundation exists.

---

## 6. Versioning Rules

Versioning rules for Step 3:

1. A version row is immutable for rule content once active.
2. New firm-policy changes create a new `rule_profile_versions` row.
3. `supersedes_version_id` should point to the prior version when applicable.
4. Historical account assignments must remain attached to prior version rows.
5. Reassigning an account to a new version must create:
   - a new assignment row
   - an audit event
   - optional explanatory note if migrated manually

---

## 7. Validation Rules

Validation should happen in two layers.

## 7.1 Zod/application validation

Reject profiles when:
- required sections are missing
- drawdown type is trailing but no reference basis exists
- payout cadence exists with no payout eligibility structure
- consistency is enabled without threshold basis
- numeric values are negative or nonsensical
- version metadata is missing
- stage type or firm context is absent

## 7.2 Database-level validation

Enforce where practical:
- unique `profile_key` per firm
- unique `version_number` within a profile family
- one active version per profile family when that is the chosen policy
- foreign key integrity from account -> profile/version
- `effective_to >= effective_from` when present

---

## 8. Assignment Rules for Accounts

The `accounts` table should hold:
- `rule_profile_id`
- `rule_profile_version_id`

These are current pointers only.
The assignment table remains the history source.

Account assignment rules:
- every evaluable account must have a profile version
- draft/import-incomplete accounts may exist temporarily without one, but must be blocked from evaluation
- changing profile version is a meaningful event
- services must not silently overwrite current profile version without an assignment record

---

## 9. Testing Expectations for Step 4 Consumers

When Step 4 begins, each profile version should already be test-ready against:
- normal-case scenario
- near-threshold scenario
- payout-ready scenario
- breached/stopped scenario
- stage-progression scenario
- alert-generation scenario

The schema should make these fixture bindings straightforward rather than ad hoc.

---

## 10. Recommended Example Profile Set for Seeds

Recommended initial example families:
- `funded_trailing`
- `eval_static_target`
- `funded_static`
- `funded_consistency`
- `funded_min_days`
- `funded_payout_window`

Version labels can begin with `v1`.
Use example family names instead of real firm names where maintenance burden would be higher than benefit.

---

## 11. What Step 3 Explicitly Does Not Need Yet

Not required in this step:
- overlay resolution engine
- profile comparison UI
- profile migration assistant
- import-from-external-firm-source tools
- automatic profile explanation copy for screens

Those can come later.
The persistence and validation foundation comes first.

---

## 12. Final Statement

A rule profile is not just a JSON blob with numbers.
In Veradmin it is the governing policy environment for account truth.
Step 3 is complete only when that environment is structured, versioned, validated, and historically traceable.
