# Veradmin Testing and Quality Gates

Version: 1.0  
Status: Active  
Owner: Engineering / QA / Product / Architecture  
Applies To: Unit testing, integration testing, validation strategy, quality gates, release readiness, and operator trust

---

## 1. Purpose of This Document

This document defines how Veradmin is tested and what quality gates must be met before features, builds, or releases are considered trustworthy.

Veradmin cannot be judged only by whether it “runs.”
It must be judged by whether it reliably produces the right operational truth.

Because Veradmin is a tactical control system, errors are not cosmetic.
A wrong rule evaluation, a missing restriction, a broken mode transition, or a misleading state label can directly weaken the operator’s decision quality.

This document exists to ensure that:
- core logic is tested systematically,
- important workflows are validated end to end,
- regressions are caught early,
- quality is measured by trustworthiness rather than by superficial completeness,
- and releases are gated by evidence rather than optimism.

---

## 2. Quality Mission

Testing in Veradmin must answer:

1. Does the rule engine produce correct outputs?
2. Does the UI present those outputs clearly and consistently?
3. Do logging actions update state safely?
4. Do backups, restore, and exports behave reliably?
5. Can the operator trust the app in real daily use?

The goal of testing is not to maximize test count.
The goal is to preserve operational trust.

---

## 3. Quality Principles

### 3.1 Logic first

The rule engine, derived state, and mode transitions deserve the highest test priority.

### 3.2 Trust over novelty

A small, stable, trustworthy feature set is better than a broad but unreliable one.

### 3.3 Explainability matters

When tests fail, the failure should reveal something actionable and understandable.

### 3.4 Risk-based testing matters

The most dangerous behaviors must be tested most aggressively.

### 3.5 Realistic data matters

The app must be tested against realistic fleets, not only tiny synthetic toy examples.

---

## 4. Testing Layers

Veradmin should use multiple testing layers.

### 4.1 Unit tests

Purpose:
- validate deterministic pure logic
- confirm formulas, thresholds, modes, restrictions, and derived values

Highest priority targets:
- Lives calculations
- hard breach floor logic
- daily floor logic
- mode assignment
- tradable state
- payout readiness logic
- simulation outputs
- alert severity classification

### 4.2 Integration tests

Purpose:
- validate interactions between data layer, rule engine, and service layers

Examples:
- trade log triggers rule recomputation
- payout request updates payout state and alert state
- restore rehydrates state safely
- account stage change propagates to dashboard summaries

### 4.3 End-to-end tests

Purpose:
- validate full user workflows through the desktop UI

Examples:
- open app, inspect dashboard, open account, log loss, see mode shift
- create backup, restore backup, confirm data integrity
- request payout, mark received, see dashboard update

### 4.4 Manual scenario testing

Purpose:
- validate real operator experience and catch friction that automated tests miss

Examples:
- three-day live pilot with fake or real low-risk fleet data
- morning check workflow
- midday alert handling
- end-of-day review

---

## 5. Risk-Based Priority Areas

The highest-risk areas in Veradmin are:

1. Rule engine correctness
2. Mode transition correctness
3. Tradable/restricted/stopped labeling
4. Trade logging side effects
5. Payout readiness and payout status logic
6. Backup/restore integrity
7. Alert generation and resolution logic
8. Dashboard priority ordering for urgent states

These areas require stronger coverage than lower-risk cosmetic behavior.

---

## 6. Core Test Categories

### 6.1 Rule engine tests

Must cover:
- static drawdown accounts
- trailing drawdown accounts
- exact threshold boundaries
- just-above and just-below threshold cases
- fractional lives
- daily restriction dominance vs hard restriction dominance
- preservation / recovery / stopped mode transitions
- payout protection activation
- simulation scenarios after win/loss/custom event

### 6.2 Data model tests

Must cover:
- schema creation
- migrations
- seed data integrity
- valid/invalid enums
- event relationships
- backup/restore consistency
- export fidelity

### 6.3 UI behavior tests

Must cover:
- dashboard loading
- account drill-down
- quick actions visibility
- alert visibility by severity
- account card state accuracy
- explanation panel presence
- empty state handling

### 6.4 Journaling tests

Must cover:
- fast win/loss logging
- custom trade logging
- note creation
- timeline update
- correction workflows
- audit/event creation
- post-log explanation state

### 6.5 Payout, rotation, and alert tests

Must cover:
- payout readiness changes
- payout request flow
- refund task visibility
- calendar schedule rendering
- alert creation and resolution
- news restriction handling

---

## 7. Required Seed/Test Datasets

Veradmin should maintain multiple reusable datasets for testing.

### 7.1 Clean fleet dataset

A normal realistic set of accounts in healthy states.

Use for:
- UI sanity
- typical dashboard review
- normal user workflows

### 7.2 Edge-case fleet dataset

Accounts near thresholds or in unusual conditions.

Examples:
- exactly zero lives
- exactly one fractional life
- payout ready but paused
- daily stop triggered and unresolved
- balance at hard floor boundary
- newly restored account state

### 7.3 Messy fleet dataset

Accounts representing real-world disorder.

Examples:
- missing notes
- many alerts
- mixed firms and stages
- paused and resumed histories
- repeated payout records
- custom event-heavy timelines

These datasets should be easy to load locally and used often.

---

## 8. Quality Gates

Veradmin should move through clear quality gates rather than vague feelings of progress.

### Gate 1: Product Logic Ready

Criteria:
- doctrine and MVP scope defined
- rule model documented
- account lifecycle and modes documented
- no major ambiguity about operational truth

### Gate 2: Engine Validated

Criteria:
- core rule engine tests passing
- boundary cases covered
- mode outputs explainable
- seeded scenarios produce expected results

### Gate 3: Daily Driver MVP

Criteria:
- dashboard usable
- account detail usable
- trade logging works
- journaling works
- state updates immediately
- basic alerts functional
- no critical data loss issues

### Gate 4: Tactical Assistant Quality

Criteria:
- simulation works
- pre-trade advisory works
- mission panel feels useful
- recommendations are consistent with engine outputs

### Gate 5: Business Operations Quality

Criteria:
- payouts usable
- rotation calendar usable
- alerts useful and low-noise
- export functions trustworthy

### Gate 6: Production Trust

Criteria:
- backup/restore works
- release packaging works
- no high-severity known defects
- operator can rely on app for real daily use

---

## 9. Severity Model for Defects

Recommended defect severity levels:

### Critical
A defect that can mislead operational decisions or corrupt trust.
Examples:
- wrong tradable state
- wrong mode
- incorrect floor logic
- backup restore corruption
- silent data loss

### High
A serious feature failure that materially weakens usefulness.
Examples:
- payout workflow broken
- alert severity wrong
- account view missing important state
- trade log not updating timeline correctly

### Medium
A meaningful issue with workaround.
Examples:
- filter misbehavior
- export formatting issues
- minor incorrect labels in non-critical contexts

### Low
Cosmetic or convenience issue with no meaningful operational danger.
Examples:
- spacing issue
- minor visual inconsistency
- non-blocking copy issue

Critical defects block release.
High defects should generally block release unless tightly scoped and explicitly accepted.
Medium and low defects are triaged based on impact and schedule.

---

## 10. Release Blocking Rules

A release must not be approved if any of the following remain unresolved:

- rule engine produces known incorrect operational states
- account mode transitions are unreliable
- logging a trade can silently corrupt or desynchronize state
- backup/restore is not trustworthy
- critical alerts can be hidden or missed due to UI failure
- significant data loss bug exists
- seeded edge-case testing has not been completed

This product must prefer delay over false trust.

---

## 11. Manual Acceptance Checklist

Before marking a milestone complete, a human reviewer should confirm at minimum:

- dashboard feels oriented and useful
- account states are readable and believable
- quick logging is actually quick
- alerts are meaningful, not noisy
- payout state is understandable
- restore feels safe and clear
- exports are usable
- no workflow requires remembering hidden app behavior

Manual review matters because some failures are about confidence and clarity, not only correctness.

---

## 12. Test Environment Requirements

The project should support:
- local automated test execution
- seeded local database setup
- deterministic rule test fixtures
- repeatable UI test setup where practical
- documented commands for running tests

The goal is to make quality repeatable, not heroic.

---

## 13. Test Documentation Requirements

Each major domain should have:
- what is being tested
- why it matters
- what fixtures are used
- what known exclusions remain
- how to interpret failures

Testing without documentation often degrades into brittle rituals.

---

## 14. Anti-Patterns to Avoid

Avoid:
- judging readiness by how pretty the UI looks
- shipping logic changes without scenario tests
- relying only on manual testing for rule behavior
- testing only happy paths
- treating seed data as disposable
- hiding known high-severity issues behind optimism
- confusing activity with quality

---

## 15. Definition of Done for Testing and Quality Gates

This specification is satisfied when:

1. Core logic is systematically tested.
2. Important workflows are covered across multiple testing layers.
3. Quality gates are explicit and used in practice.
4. Critical defects block release.
5. Realistic datasets are used repeatedly.
6. Manual acceptance validates usability and trust, not just correctness.
7. The team can justify why a build deserves daily use.

---

## 16. Future Considerations

Potential later additions:
- mutation testing for rule engine
- visual regression testing
- telemetry-informed quality review
- automated fixture generation
- property-based testing for rules
- beta channel quality gates
- cross-device sync verification if sync is added later

These are valuable later, but v1 must first achieve deterministic trust.
