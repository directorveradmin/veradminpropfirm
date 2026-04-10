# Step 11 — Release Hardening and Daily-Driver Criteria

Version: 1.0  
Status: Step 11 complete  
Scope: Hardening requirements, release-candidate judgment, and final daily-driver confidence criteria  
Canonical inputs: `13-release-packaging-and-operations.md`, `24-data-migration-and-versioning-spec.md`, `23-error-states-and-recovery-flows.md`, `43-daily-operator-workflow.md`, `37-implementation-sequencing-and-build-order.md`

---

## 1. Step 11 intent

This document defines what “hard enough to release” means for Veradmin at the end of Step 11.

Step 11 does not yet perform the full release/installer execution work of the final step.
Instead, it freezes the criteria that must already be true before Step 12 operationalizes packaging and ship discipline.

---

## 2. Decisions frozen in Step 11

### 2.1 Release readiness is a trust judgment
A build is release-ready only when it supports disciplined real use.
Packaging alone is never sufficient.

### 2.2 Daily-driver confidence is the standard
Step 11 is judged against the question:
`Would the operator genuinely choose this build for tomorrow’s real workflow?`

### 2.3 Hardening protects continuity, not just aesthetics
Hardening includes:
- startup safety,
- migration clarity,
- backup confidence,
- honest error behavior,
- clean first-run behavior,
- and stable package launch.

### 2.4 Post-v1 temptation remains out of scope
Do not spend Step 11 on:
- advanced analytics,
- sync,
- AI assistance layers,
- or broad customization.

This step protects the daily-driver core.

---

## 3. Release-hardening requirements frozen in Step 11

## 3.1 Startup trust gate
Before the app presents normal tactical work, it must know whether:
- the local dataset is healthy,
- migration succeeded,
- restore integrity is trusted,
- onboarding should appear,
- or recovery should take over.

## 3.2 First-run safety
The first-run flow must:
- present only trusted starting paths,
- avoid silent mutation,
- distinguish example data from real data,
- and route recovery work into the proper continuity surface.

## 3.3 Visible version context
The build should expose enough version context to support trust.

Minimum visible layers:
- app version,
- schema version,
- release channel / environment,
- migration outcome,
- backup compatibility context during restore flows.

## 3.4 Fixture discipline
Example/demo/onboarding fixture packs must be treated as governed assets.
They should validate, seed cleanly, and remain labeled.

## 3.5 Packaging preconditions
Before Step 12 turns packaging into a final operational workflow, Step 11 requires:
- web build succeeds,
- desktop build succeeds,
- packaged launch path is known,
- startup behavior after packaging is reviewed,
- version values stay aligned across package metadata.

## 3.6 Recovery honesty
Hardening is incomplete if errors remain vague.

Every trust-sensitive failure must clarify:
1. what happened,
2. what was affected,
3. what remains safe,
4. and what the next safest action is.

---

## 4. Daily-driver confidence criteria

Step 11 freezes the following daily-driver confidence criteria.

## 4.1 Morning open confidence
A release candidate passes only if the operator can:
- open Veradmin,
- orient quickly,
- identify what matters today,
- and understand whether any condition overrides normal work.

## 4.2 Fleet truth confidence
The operator must be able to distinguish:
- tradable accounts,
- preservation-sensitive accounts,
- payout-sensitive accounts,
- restricted accounts,
- stopped or breached accounts.

Any ambiguity here weakens daily-driver status.

## 4.3 Event-to-state confidence
When an operator logs a meaningful event, the product must feel aligned immediately.

The operator should not need to mentally reconstruct whether the app truly updated.

## 4.4 Business/admin confidence
Payout/admin context, settings, backups, and recovery must support the tactical workflow without derailing it.
Administrative surfaces should feel calm but real.

## 4.5 Continuity confidence
A daily-driver build must not make the operator fear:
- updating,
- launching,
- restoring,
- or creating a backup.

## 4.6 Restart confidence
The operator should be able to close and reopen the app without fearing hidden state drift or unexplained startup changes.

---

## 5. Step 11 release-candidate checklist

A build may be called Step 11 release-ready only when all of the following are true:

- onboarding path model is implemented or fully scaffolded with safe boundaries,
- onboarding fixture exists and validates,
- example data is labeled clearly,
- typecheck passes,
- automated test path is runnable,
- fixture seed flows work,
- desktop build launches,
- backup/restore doctrine is still preserved,
- no known critical trust-damaging defects remain,
- manual daily-driver review is passed honestly.

---

## 6. Go / no-go table

| Area | Go when | No-go when |
|---|---|---|
| Startup | migration/recovery state is explicit and safe | startup may mask integrity uncertainty |
| Onboarding | first-run paths are clear and bounded | onboarding can confuse or overwrite local truth |
| Example fleet | clearly labeled and educational | unlabeled, noisy, or merged into real state implicitly |
| Tactical reading | fleet/account states are believable | tradable vs restricted vs stopped is unreliable |
| Logging | visible state changes follow events quickly | logging can desynchronize visible truth |
| Continuity | backup/recovery wording is honest | restore/migration ambiguity remains optimistic |
| Packaging | build and launch are clean | packaged build launches into broken or misleading behavior |

---

## 7. Step 11 release notes obligations

Before Step 12 executes final release mechanics, Step 11 should already freeze the release-note expectations.

The first real release notes must explain:
- what changed meaningfully,
- what onboarding behavior exists,
- what backup/recovery behavior exists,
- what versions matter,
- and any known but accepted limitations.

A silent release is not a trustworthy release.

---

## 8. Unacceptable Step 11 anti-patterns

Avoid:
- calling the build “release-ready” because it visually looks complete,
- hiding missing test infrastructure behind optimistic language,
- adding post-v1 features instead of hardening the core,
- using the example fleet as a substitute for real release validation,
- packaging without verifying startup, backup, and first-run behavior.

---

## 9. What Step 12 should inherit from Step 11

Step 12 should inherit a stable hardening target, not a new product redesign.

That means Step 12 should receive:
- frozen onboarding decisions,
- frozen onboarding fixture pack,
- frozen release blockers,
- frozen daily-driver criteria,
- frozen error/recovery copy rules,
- and a clear verification path.

---

## 10. Definition of done for Step 11 hardening

Step 11 hardening is satisfied when:
1. the product can be judged honestly against daily-driver criteria,
2. onboarding, recovery, and startup behavior are trust-preserving,
3. version and continuity context are visible enough to support release confidence,
4. fixture loading and testing are part of the release conversation,
5. packaging preconditions are established before final release execution,
6. no critical trust-damaging defects are being waved through,
7. Step 12 can focus on packaging and final ship discipline rather than re-arguing product fundamentals.
