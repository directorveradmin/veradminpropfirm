# Veradmin Step 3: Fixture Categories and Seed Guidance

Version: 1.0  
Status: Active  
Owner: Product / Architecture / QA / Engineering  
Applies To: Fixture packs, example rule profiles, seed workflows, validation scenarios, and Step 4 readiness

---

## 1. Purpose

This document turns the canonical fixture doctrine into a concrete Step 3 loading and organization plan.

The goal is to make rule-profile and data-model work testable before the rule engine is built.

---

## 2. Governing Rule

Fixtures are product assets, not disposable developer scraps.
They must be:
- named
- versioned
- documented
- loadable
- safe to reset
- useful for both tests and future UI work

---

## 3. Canonical Repo Layout Under `db/fixtures/`

Recommended structure:

```text
db/
  fixtures/
    profiles/
      families/
      versions/
    fleets/
      demo/
      edge/
      messy/
      stress/
      onboarding/
      broken/
    manifests/
```

### Meaning
- `profiles/families/`: stable profile family metadata examples
- `profiles/versions/`: versioned rule payload examples
- `fleets/*`: account/event datasets grouped by purpose
- `manifests/`: fixture metadata files describing contents and intended use

---

## 4. Seed Script Discipline

Step 2 already froze the narrow script surface:
- `pnpm db:seed:demo`
- `pnpm db:seed:edge`

Step 3 should preserve that calm surface.

### Therefore
- `demo` remains the main mixed realistic fleet
- `edge` remains the threshold and failure-sensitive fleet
- `messy`, `stress`, `onboarding`, and `broken` should exist as fixture packs and test assets, but do not need first-class package scripts yet

This avoids command sprawl while still preparing broader fixture coverage.

---

## 5. Required Fixture Packs

## 5.1 Demo fleet

Purpose:
- daily development baseline
- normal-flow checks
- basic repository/service integration checks later
- future dashboard/account-detail realism

Recommended contents:
- 2 firms or example firm families
- 5 to 8 accounts
- at least one funded trailing account
- at least one evaluation account
- at least one payout-ready or near-payout account
- at least one preservation-sensitive account
- small but meaningful trade history
- at least one open alert
- at least one note and one payout record

## 5.2 Edge fleet

Purpose:
- deterministic threshold validation
- exact-floor and near-floor tests
- Step 4 rule output confidence

Required cases:
- balance exactly on hard floor
- one cent above hard floor
- one cent below hard floor
- daily restriction edge
- zero-trade account
- minimum trading day edge
- consistency-cap edge
- payout-window collision edge

## 5.3 Messy fleet

Purpose:
- recovery and diagnostics behavior
- import-cleanup thinking
- resilience against partial or stale records

Recommended cases:
- paused account
- archived account with recent note history
- incomplete day state
- pending refund task
- stale payout request
- conflicting note/account summary signals

## 5.4 Stress fleet

Purpose:
- larger mixed-load checks
- list/query/index sanity
- future command-center grouping tests

Recommended cases:
- 15+ accounts
- multiple firms
- multiple lifecycle stages
- many overlapping alerts and payout windows
- several rotations

## 5.5 Onboarding fleet

Purpose:
- first-run educational example
- calm, visually varied, compact data pack

Recommended cases:
- one clearly tradable account
- one preservation account
- one payout-ready account
- one stopped/restricted account
- one future rotation/payout reminder case

## 5.6 Broken fleet

Purpose:
- validation and defensive behavior only
- should not load into normal dev workflows silently

Recommended cases:
- missing profile version
- invalid balance relationship
- impossible lifecycle/status combination
- incompatible fixture version marker
- broken payout references

---

## 6. Example Profile Coverage Required in Fixtures

Fixtures should be built around a small example profile library.

Recommended initial examples:
- `funded_trailing_v1`
- `eval_static_target_v1`
- `funded_static_v1`
- `funded_consistency_v1`
- `funded_min_days_v1`
- `funded_payout_window_v1`

The goal is behavior coverage, not public-firm exhaustiveness.

---

## 7. Fixture Metadata Contract

Every fixture pack should include a manifest with fields such as:
- `fixture_id`
- `fixture_name`
- `purpose`
- `fixture_category`
- `version`
- `schema_compatibility`
- `created_at`
- `contains_profiles`
- `contains_accounts`
- `contains_alerts`
- `contains_payouts`
- `contains_known_edges`
- `notes`

This makes fixture selection explicit and reduces mystery data.

---

## 8. Loading Order Guidance

A seed loader should insert data in this order:

1. firms
2. rule profile families
3. rule profile versions
4. fleet settings
5. tags
6. accounts
7. profile assignments
8. account day state
9. trade logs
10. balance snapshots
11. payout requests
12. refund tasks
13. rotations
14. alerts
15. notes
16. audit events
17. account-tag links
18. import/export logs if needed for scenario completeness

This order matches foreign-key dependencies and future event reconstruction needs.

---

## 9. Validation Requirements for Fixture Packs

Before a fixture pack is accepted, it should be checked for:
- schema validity
- referential integrity
- valid current profile assignments
- exactly one active assignment per account
- no impossible timestamps
- known expected counts
- known expected threshold cases documented in the manifest

For broken fixtures, the manifest should state which validation is expected to fail.

---

## 10. Recommended Seed Ownership Boundaries

### `db/seeds/`
Holds seed loaders and composable insertion helpers.

### `db/fixtures/`
Holds source fixture data and manifests.

### `tests/fixtures/`
Holds test-specific transformed or minimal fixture helpers derived from canonical fixture packs when needed.

Do not hard-code fleet data inside components or service tests if it belongs in canonical fixtures.

---

## 11. Step 4 Readiness Notes

The next step should be able to use fixtures to validate:
- lives calculations
- hard/daily floor handling
- payout readiness logic
- restriction states
- mode selection
- next-action guidance
- explanation output quality

If a fixture pack cannot support those checks, it is too weak.

---

## 12. Final Statement

Veradmin should be built against realistic fleets from the beginning.
Fixture discipline is not extra polish.
It is part of how the product earns trust.
