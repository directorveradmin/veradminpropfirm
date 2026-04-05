# Veradmin Rule Profile Template and Firm Adaptation

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Rule Engine / Data  
Applies To: Firm rule profiles, account policy configuration, rule normalization, adaptation workflows, and future firm-specific extensibility

---

## 1. Purpose of This Document

This document defines how Veradmin should represent, store, normalize, and adapt rule profiles for different prop firms and account types.

Veradmin cannot be trustworthy if it treats every account as though it follows the same operating constraints.
Different firms, phases, payout policies, consistency rules, daily drawdown models, and account lifecycle conditions can produce meaningfully different operational truths.

This document exists so that:
- rule differences are modeled intentionally,
- firm-specific behavior is normalized into a stable internal language,
- the operator can adapt Veradmin to different firms without breaking doctrine,
- and future rule changes can be introduced in a disciplined, auditable way.

The purpose of rule profiles is not to glorify firm-specific complexity.
The purpose is to absorb that complexity so the operator sees a consistent tactical system.

---

## 2. Rule Profile Mission

The rule profile system must do five things well:

1. Represent real account policy differences in a structured way.
2. Normalize those policies into a stable internal decision model.
3. Allow safe reuse across many accounts.
4. Support evolution when firms change rules.
5. Keep account evaluation deterministic, explainable, and testable.

If profiles are vague or inconsistent, the entire rule engine becomes unreliable.

---

## 3. Core Principle: Normalize, Then Evaluate

Veradmin should not let each firm redefine the product’s language.

Instead, the product should:
1. ingest or configure firm-specific rules,
2. normalize them into internal canonical concepts,
3. then evaluate accounts through the shared rule engine.

That means the operator should still see stable Veradmin concepts like:
- tradable
- restricted
- stopped
- payout-ready
- mode
- hard breach floor
- daily restriction
- full-size allowed
- fractional-only
- next action

The internal operating language must stay stable even when underlying firm rules differ.

---

## 4. Scope of a Rule Profile

A rule profile should capture the operational policy for a specific account class or firm-phase combination.

Examples:
- Apex funded 200k profile
- Apex evaluation step 1 profile
- Firm X funded trailing-DD profile
- Firm Y static-DD evaluation profile

A profile should not represent a single account’s dynamic state.
It should represent the policy environment the account lives inside.

---

## 5. Canonical Rule Categories

Each rule profile should define structured values across at least the following categories.

### 5.1 Drawdown model
- static or trailing
- max drawdown amount or percentage
- daily drawdown amount or percentage if applicable
- reference basis for each threshold
- reset behavior if relevant

### 5.2 Profit and stage progression
- profit target requirements
- phase completion conditions
- pass/fail conditions
- stage-specific objectives

### 5.3 Payout policy
- payout eligibility requirements
- waiting periods
- payout cadence
- request windows
- payout protection implications if configured by operator

### 5.4 Consistency and concentration rules
- maximum permitted trade/day contribution if applicable
- restrictions around “one lucky trade” logic
- rolling calculation basis if applicable

### 5.5 Trading-day requirements
- minimum days traded
- qualifying day definitions if relevant
- reset or carry behavior

### 5.6 Pause and rotation compatibility
- whether the profile is eligible for funded rotation logic
- whether specific cooldown or rest assumptions are operator-defined overlays

### 5.7 Special restrictions
- weekend restrictions if relevant
- news constraints if firm-defined, though many news policies will remain operator overlays
- account-type-specific notes

---

## 6. Canonical Internal Fields

Internally, each profile should normalize into stable fields such as:

- profile id
- profile name
- firm name
- stage or account class
- drawdown type
- max drawdown definition
- daily drawdown definition
- payout policy object
- target policy object
- consistency policy object
- trading day policy object
- rotation eligibility flag
- operator overlay allowances
- profile version
- effective date
- active/inactive status

This structure allows the engine to reason systematically.

---

## 7. Required Separation: Firm Rules vs Operator Overlays

Veradmin must distinguish between:
- actual firm-imposed rules
- operator-imposed overlays or preferences

Examples of firm rules:
- trailing drawdown policy
- minimum trading days
- payout waiting period
- target threshold

Examples of operator overlays:
- preferred red-folder news avoidance window
- funded 2-on / 1-off schedule
- custom preservation threshold
- preferred rest behavior after payout
- custom alert priority tuning

This separation is essential.
Otherwise the user may confuse firm compliance with self-imposed tactical discipline.

---

## 8. Profile Versioning

Rule profiles must be versioned.

Why:
- firms can change policies
- the operator may adapt the profile over time
- historical events must remain explainable
- simulation and reporting may need to know which rule version was active when a state was evaluated

Recommended versioning fields:
- profile version
- effective date
- created at
- updated at
- supersedes profile id/version if relevant
- notes

An account should maintain a clear relationship to the profile version that governed it at any given time.

---

## 9. Rule Profile Template Structure

A rule profile template should be designed to be:
- human-readable
- machine-validated
- testable
- extensible without chaos

Recommended sections:

1. Metadata
2. Drawdown rules
3. Stage and target rules
4. Trading day rules
5. Payout rules
6. Consistency rules
7. Rotation/eligibility flags
8. Operator overlay compatibility
9. Notes and exceptions
10. Version metadata

This can be represented as JSON, typed config, or another structured format, but it must remain schema-validated.

---

## 10. Example Conceptual Template

A conceptual rule profile should be able to answer questions like:

- What is the max loss model?
- What is the daily loss model?
- What value is used as the reference basis?
- What makes the account payout-ready?
- What conditions block payout?
- What stage progression rules apply?
- What concentration or consistency rules matter?
- Which warnings should become high-priority under this profile?
- Are operator overlays permitted or relevant?

The exact storage syntax matters less than completeness and clarity.

---

## 11. Firm Adaptation Workflow

When adapting Veradmin to a new firm or account type, the workflow should be:

1. Gather official firm rules.
2. Translate them into structured profile fields.
3. Separate firm-enforced rules from operator overlays.
4. Validate the profile shape against schema.
5. Test the profile against scenario fixtures.
6. Review generated explanations for clarity.
7. Mark profile active only after passing validation and scenario review.

Adaptation should never be a casual “just type in a few numbers” process if the rules meaningfully affect interpretation.

---

## 12. Validation Requirements

Each rule profile should be validated for:

- required fields present
- internal consistency
- valid enum values
- meaningful numeric ranges
- mutually incompatible settings
- unsupported combinations clearly rejected
- version metadata present

Examples of invalid configurations:
- trailing profile with no trailing reference logic
- payout frequency defined with no payout readiness conditions
- consistency rule enabled with no threshold basis
- negative or nonsensical thresholds
- profile marked active without stage or firm context

---

## 13. Rule Profile Testing Requirements

Every new or changed profile should be tested against scenario fixtures.

At minimum:
- normal-case scenario
- near-threshold scenario
- payout-ready scenario
- breached/stopped scenario
- stage-progression scenario
- alert-generation scenario

The goal is not merely that the profile passes schema validation.
The goal is that it produces sensible operational truth in the engine.

---

## 14. UI Presentation of Profiles

The operator should not have to inspect raw config files to understand what profile is governing an account.

The UI should support:
- viewing the current assigned profile
- seeing the profile version
- reading a summary of key rule categories
- understanding which parts are firm rules vs operator overlays
- identifying when a profile has changed or become outdated

The UI should present rule profiles as administrative artifacts, not daily tactical surfaces.

---

## 15. Profile Assignment Rules

Each account should be assigned one active rule profile at a time for core evaluation.

If multiple layers exist, they should be explicit:
- core firm profile
- optional operator overlay pack

The engine should never have to guess which policy is primary.

Assignment actions should be logged.
Changing a profile on an existing account is a meaningful event and must preserve traceability.

---

## 16. Backward Compatibility and Historical Trust

When a rule profile changes, Veradmin must preserve historical trust.

That means:
- historical events remain attached to prior operational context where needed
- reports should not silently reinterpret the past under new rules unless explicitly intended
- migrations should be deliberate

If a firm changes a rule, the system must be able to say:
“This account is now governed by profile version X, which replaced version Y on this date.”

---

## 17. Anti-Patterns to Avoid

Avoid:
- hard-coding firm logic deep inside UI code
- mixing firm rules and operator preferences into one unstructured blob
- editing profiles casually without versioning
- treating all firms as minor numeric variants when policy semantics differ
- skipping scenario validation for profile changes
- using ambiguous labels that hide what the rule actually means

---

## 18. Definition of Done for Rule Profile Template and Firm Adaptation

This spec is satisfied when:

1. Firm policies can be represented in a structured, validated profile.
2. Profiles normalize into stable Veradmin concepts.
3. Firm rules remain distinct from operator overlays.
4. Profile assignment is explicit and traceable.
5. Versioning preserves historical trust.
6. New profiles can be adapted and tested without ad hoc code changes.
7. The operator can understand what policy environment governs each account.

---

## 19. Future Considerations

Potential later additions:
- profile comparison tools
- profile migration assistant
- profile library and templates
- import from structured external rule sources
- operator overlay presets
- advanced compatibility tests across profile versions

These are valuable later, but v1 must first make profiles structured, trustworthy, and explainable.
