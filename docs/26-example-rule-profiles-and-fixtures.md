# Veradmin Example Rule Profiles and Fixtures

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Rule Engine / QA  
Applies To: Development fixtures, test data, example rule profiles, seeded demo fleets, validation scenarios, and rule-engine confidence building

---

## 1. Purpose of This Document

This document defines how Veradmin should use example rule profiles and seeded fixtures to support development, testing, onboarding, and operational trust.

The Veradmin rule engine is only as trustworthy as the scenarios used to validate it.
A clean rule model is necessary, but not sufficient.
The product also needs realistic, structured example profiles and fixture datasets that make it possible to test:
- normal states
- edge states
- payout states
- recovery states
- invalid states
- lifecycle transitions
- mode changes
- alert behavior
- simulation quality

This document exists so that example profiles and fixtures are treated as first-class product assets rather than temporary developer scraps.

---

## 2. Mission of Example Profiles and Fixtures

The example profile and fixture system must do six things well:

1. Provide realistic development and QA datasets.
2. Validate rule-engine correctness across meaningful scenarios.
3. Support onboarding and example-fleet loading.
4. Make edge-case behavior easy to test repeatedly.
5. Help explain how Veradmin interprets different firms and account types.
6. Reduce ambiguity during implementation by providing concrete reference cases.

The point is not to mirror every firm in existence immediately.
The point is to create structured, trustworthy examples that anchor product behavior.

---

## 3. Fixture Principles

### 3.1 Realistic enough to matter

Fixtures should feel believable in the context of prop-firm fleet management.

### 3.2 Structured enough to repeat

Fixtures should be machine-loadable, versioned, and consistent across environments.

### 3.3 Diverse enough to stress the system

A single “happy path” fixture set is not enough.

### 3.4 Explicitly labeled

Example/demo profiles must be clearly marked as:
- example only
- development fixture
- onboarding demo
- QA scenario

### 3.5 Separate example from production truth

Example fixtures help the product, but must not silently masquerade as the user’s real live data.

---

## 4. Types of Profiles and Fixtures

Veradmin should support at least four categories.

### 4.1 Example rule profiles

These are representative rule profiles used to:
- test the engine
- demonstrate firm/profile adaptation
- support onboarding demos
- anchor documentation examples

### 4.2 Seeded fleet fixtures

These are whole-account datasets used in:
- local development
- QA
- example fleets
- first-run learning

### 4.3 Edge-case fixtures

These are designed to hit thresholds, restrictions, transitions, and failure-sensitive logic.

### 4.4 Invalid or conflict fixtures

These are intentionally broken or contradictory inputs used to validate error handling, migration safety, and defensive logic.

---

## 5. Recommended Example Rule Profile Set

Veradmin should include a small, carefully chosen set of example profiles.

Recommended initial set:

1. Funded trailing-drawdown profile
2. Evaluation step profile with target requirements
3. Static drawdown funded profile
4. Profile with consistency constraint enabled
5. Profile with minimum trading day emphasis
6. Profile designed to test payout-window logic

These do not need to correspond one-to-one to public firm names in documentation if that creates maintenance burden.
They can be labeled more abstractly if desired, such as:
- `funded_trailing_v1`
- `eval_static_target_v1`
- `funded_consistency_v1`

What matters is behavioral coverage.

---

## 6. Example Rule Profile Requirements

Each example rule profile should include:

- profile id
- profile name
- firm label or example family name
- stage or class
- drawdown rules
- target rules
- payout rules
- consistency rules if applicable
- trading-day rules if applicable
- notes on intended behavior
- version metadata

Each profile should also document what it is good for testing.

Example:
- good for testing trailing drawdown
- good for testing payout-readiness progression
- good for testing consistency alerts
- good for testing fractional-only transitions

---

## 7. Seeded Fleet Fixture Categories

Recommended seeded fleet packs:

### 7.1 Clean fleet
A realistic, well-behaved set of accounts with no major issues.

Purpose:
- UI development
- normal-flow demos
- basic dashboard validation

Recommended contents:
- healthy tradable funded account
- payout-ready account
- active evaluation account
- account in Preservation Mode
- minimal but meaningful journal history

### 7.2 Edge fleet
A set of accounts near critical thresholds.

Purpose:
- QA
- rule-engine threshold validation
- explanation testing

Recommended contents:
- account at exactly 1.0 life
- account below full-size threshold but still alive
- account near daily restriction
- account just becoming payout-ready
- account transitioning between lifecycle stages

### 7.3 Stress fleet
A larger mixed fleet with many accounts.

Purpose:
- performance testing
- dashboard grouping behavior
- fleet-level analytics and alerts

Recommended contents:
- multiple firms
- multiple stages
- several alert states
- several payout states
- overlapping rotation schedules

### 7.4 Broken/conflict fleet
A deliberately inconsistent data pack.

Purpose:
- recovery testing
- diagnostics behavior
- validation failures
- error-state design

Recommended contents:
- missing rule profile
- impossible lifecycle/mode combination
- invalid balance relationships
- broken payout references
- stale or incompatible version marker

---

## 8. Fixture Design for Onboarding

The onboarding example fleet should be a special-purpose fixture pack.

It should be:
- educational
- calm
- realistic
- compact
- visually varied enough to teach the product quickly

Recommended onboarding example fleet:
- one clearly tradable account
- one Preservation Mode account
- one payout-ready account
- one restricted/stopped account
- one future-oriented reminder or rotation example
- some clean journal and alert history

This fixture is not for exhaustive QA.
It is for first-run product understanding.

---

## 9. Fixture Design for Simulation

Simulation needs targeted fixture inputs.

Recommended simulation-specific fixtures:
- one standard win/loss account
- one near-preservation threshold account
- one payout-edge account
- one account where a single loss changes permissions
- one account where a single win changes payout-readiness

These should be used repeatedly to validate:
- before/after outputs
- explanation quality
- sequence simulation consistency
- multi-step state transitions

---

## 10. Fixture Design for Payout and Rotation

Payout and rotation features need dedicated example data.

Recommended fixture cases:
- payout-ready funded account
- payout requested but not received
- payout received with refund pending
- funded account in rest week
- funded account entering active week tomorrow
- evaluation accounts clustered with different progress
- overlapping payout windows
- rotation-heavy week vs light week

This supports dashboard mission panels, calendar views, alerts, and review reports.

---

## 11. Fixture Metadata

Every fixture package should carry metadata such as:

- fixture id
- fixture name
- purpose
- intended test/use case
- version
- creation date
- compatible schema version if needed
- notes

This helps prevent confusion when multiple fixture sets exist.

---

## 12. Fixture Loading Workflows

Fixture loading should support multiple contexts.

### 12.1 Development load
For local dev environment setup.

### 12.2 QA load
For repeated automated/manual scenario validation.

### 12.3 Onboarding demo load
For first-run learning mode.

### 12.4 Recovery or migration validation load
For verifying version and restore behavior.

The product or scripts should make clear which fixture set is being loaded and why.

---

## 13. Fixture Storage and Repo Organization

Recommended organization:
- keep fixture definitions in a clear, versioned location
- separate example rule profiles from seeded account datasets
- separate valid fixtures from intentionally broken fixtures
- document the intended use of each set

Suggested structure:
- `db/fixtures/profiles/`
- `db/fixtures/fleets/`
- `db/fixtures/edge/`
- `db/fixtures/broken/`
- `db/fixtures/onboarding/`

The exact path may vary, but the separation should remain clear.

---

## 14. Fixture Validation Requirements

Fixtures should not just be stored.
They should be validated.

Recommended checks:
- schema validity
- referential integrity
- valid profile assignments
- expected mode outputs where relevant
- expected alert outputs where relevant
- expected dashboard counts for known fixture sets

Fixtures become far more useful when they behave like reliable contracts.

---

## 15. Fixture Documentation Requirements

Each major fixture should document:
- what it contains
- why it exists
- what behaviors it is supposed to trigger
- which screens or systems it is ideal for testing
- which edge cases it targets

The goal is to reduce “mystery datasets” in the repo.

---

## 16. Anti-Patterns to Avoid

Avoid:
- one giant undifferentiated fixture blob
- unlabeled example data
- fake onboarding data that teaches nothing
- fixtures that drift out of sync with schema and docs
- hard-coded fixtures buried in UI components
- using real user-like sensitive data as development fixtures
- broken fixtures with no documented purpose

---

## 17. Definition of Done for Example Rule Profiles and Fixtures

This spec is satisfied when:

1. A small but meaningful set of example rule profiles exists.
2. Seeded fleets cover normal, edge, stress, and broken scenarios.
3. Onboarding has a dedicated educational example fleet.
4. Fixtures are versioned, documented, and easy to load.
5. Fixtures are used in testing, not merely stored.
6. Rule-engine and screen behavior can be validated against known scenarios.
7. The repo contains concrete examples that reduce ambiguity during development.

---

## 18. Future Considerations

Potential later additions:
- fixture comparison tools
- auto-generated scenario matrices
- profile/fixture playground
- scenario pack library by feature area
- documented “golden fixtures” for CI validation

These are valuable later, but v1 must first establish a disciplined, reusable fixture foundation.
