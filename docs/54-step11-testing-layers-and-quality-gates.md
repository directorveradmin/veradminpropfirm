# Step 11 — Testing Layers and Quality Gates

Version: 1.0  
Status: Step 11 complete  
Scope: Practical test layering, fixture validation, hardening checks, and go/no-go gates for first daily-driver readiness  
Canonical inputs: `12-testing-and-quality-gates.md`, `26-example-rule-profiles-and-fixtures.md`, `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `43-daily-operator-workflow.md`

---

## 1. Step 11 intent

This document turns Veradmin’s broad testing doctrine into a concrete Step 11 quality model.

Step 11 is where the product stops being merely “built” and starts becoming teachable, testable, and release-worthy.

The goal is not test-count theater.
The goal is evidence that Veradmin can support real daily use without weakening trust.

---

## 2. Decisions frozen in Step 11

### 2.1 Trust-critical logic remains first priority
The most important tests remain the ones that protect operational truth:
- rule outputs,
- mode transitions,
- tradable / restricted / stopped labeling,
- logging side effects,
- payout/business state,
- backup/restore integrity,
- onboarding data loading,
- migration safety.

### 2.2 Fixtures are first-class test assets
The product should repeatedly validate against:
- demo fixture,
- edge fixture,
- onboarding fixture,
- and broken/conflict fixture families when they exist.

### 2.3 Quality is layered
Step 11 freezes four layers for v1:
1. deterministic unit tests,
2. repository/service integration tests,
3. workflow smoke validation,
4. manual operator confidence review.

### 2.4 A build is not trusted because it packages
Release readiness requires passing quality gates, not merely producing an executable.

---

## 3. Step 11 testing layers

## 3.1 Layer A — deterministic unit tests
Purpose:
Validate small, stable contracts quickly.

Highest-priority Step 11 targets:
- fixture manifest validation,
- rule boundary calculations,
- mode mappers,
- alert severity mapping,
- view-model shaping rules,
- migration / compatibility helper logic.

Minimum Step 11 additions:
- onboarding fixture manifest contract test,
- demo / edge fixture manifest contract tests if not already present,
- tests for any onboarding-state reducers or bootstrap helpers when implemented.

## 3.2 Layer B — integration tests
Purpose:
Validate that persistence, fixtures, repositories, and service slices behave together correctly.

Priority flows:
- database migration boots cleanly,
- demo / edge / onboarding fixture seed path succeeds,
- restore / backup metadata paths remain parseable,
- account state recompute paths stay aligned after logging or seeding,
- rule profile references remain valid after load.

## 3.3 Layer C — workflow smoke validation
Purpose:
Validate the important operator loops without pretending v1 has infinite automation.

Required Step 11 smoke targets:
- first launch with empty dataset,
- first launch with onboarding example fleet,
- restore entry from first-run,
- dashboard open and orient,
- open one account and inspect state,
- log one event and confirm visible state change,
- open settings / backups surfaces,
- backup creation path,
- packaged desktop app launch.

## 3.4 Layer D — manual operator confidence review
Purpose:
Catch the failures that feel technically “fine” but operationally untrustworthy.

Required Step 11 manual review questions:
- Does the morning open feel immediate and clear?
- Are stopped vs tradable states unmistakable?
- Does example onboarding actually teach the product?
- Do error messages say what stayed safe?
- Does backup/restore language feel consequence-aware?
- Would an operator trust this build for tomorrow morning?

---

## 4. Step 11 minimum command surface

The repo should support a repeatable pre-release check path.

Recommended minimum command sequence:
1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm db:migrate`
4. onboarding fixture seed command or `pnpm tsx ./scripts/db/seed-onboarding.ts`
5. `pnpm db:seed:demo`
6. `pnpm db:seed:edge`
7. `pnpm build:web`
8. `pnpm build:desktop`

If any of these commands are not yet wired in the repo, that is a real hardening gap, not a cosmetic TODO.

---

## 5. Step 11 gate model

## Gate 1 — Onboarding Safe
Criteria:
- first-run path selection is clear,
- example fleet loads intentionally,
- returning users skip consumer-style re-onboarding,
- onboarding failures explain whether current local state changed.

## Gate 2 — Fixtures Trusted
Criteria:
- onboarding fixture manifest validates,
- fixture seed path succeeds,
- fixture contents remain believable and compact,
- example data stays clearly separated from real data.

## Gate 3 — Tactical Truth Stable
Criteria:
- the app can show meaningful fleet/account states,
- terminal accounts are clearly terminal,
- preservation-sensitive examples do not read as “healthy,”
- logging or replayed state changes do not desynchronize visible truth.

## Gate 4 — Continuity Safe
Criteria:
- backup / restore language is explicit,
- migration compatibility is visible,
- trust uncertainty blocks false optimism,
- admin failures remain scoped as admin unless tactical trust is affected.

## Gate 5 — Release Candidate Ready
Criteria:
- typecheck and automated tests pass,
- fixture seed flows work,
- desktop build launches,
- no critical defects remain,
- manual daily-driver review is passed honestly.

---

## 6. Release blockers frozen in Step 11

A build must not be treated as release-ready if any of the following remain true:
- wrong tradable / restricted / stopped state is known,
- onboarding can silently overwrite or confuse local truth,
- backup / restore trust is weak or ambiguous,
- migration safety has not been validated,
- example fleet is unlabeled or behaves like real data,
- critical alerts or terminal states can be missed,
- automated testing is declared in the repo but cannot actually be executed.

---

## 7. Severity model for Step 11 signoff

### Critical
Blocks release immediately.
Examples:
- wrong operational state,
- restore integrity uncertainty without recovery containment,
- silent onboarding overwrite of existing local data,
- package launches into a broken or misleading state.

### High
Usually blocks release unless explicitly and narrowly accepted.
Examples:
- payout/admin teaching path broken in onboarding,
- important alerts missing from example fleet or real surfaces,
- build works but backup workflow fails.

### Medium
Triaged with a workaround.
Examples:
- non-critical layout weakness,
- low-scope filter issues,
- copy inconsistency that does not change meaning.

### Low
Polish-only.
Examples:
- spacing,
- icon mismatch,
- minor non-critical wording issue.

---

## 8. Step 11 implementation recommendations

Recommended repo additions for this phase:
- a dedicated onboarding fixture file,
- a dedicated onboarding seed script,
- at least one fixture-manifest contract test,
- a Step 11 verification script,
- package-level confirmation that the test runner actually exists.

If the repo advertises `pnpm test` but the test runner dependency is missing, Step 11 is not fully hard-wired yet.

---

## 9. Manual signoff checklist

Before Step 11 is called done, a human reviewer should confirm:
- first-run choice feels clean and serious,
- example fleet explains the product in under five minutes,
- one account can be understood without guesswork,
- stopped states feel unmistakable,
- state changes feel immediate and believable,
- backup/recovery wording is calm and precise,
- the desktop build feels like a real tool rather than a dev shell.

---

## 10. Step 11 boundaries

This step intentionally does **not** require:
- broad analytics coverage,
- cloud sync verification,
- AI copilot testing,
- post-v1 reporting suites,
- large-scale perf benchmarking beyond sanity checks.

Those belong later.

---

## 11. Definition of done for Step 11 testing and gates

This Step 11 test model is satisfied when:
1. the onboarding path is testable and not only described,
2. the onboarding fixture is treated as a contract, not ad hoc sample data,
3. the repo has a repeatable path for typecheck, test, seed, and build validation,
4. release blockers are explicit and actually used,
5. manual review checks operator confidence rather than superficial completeness,
6. a build can be rejected honestly when trust is weak,
7. the project has evidence for release readiness instead of optimism.
