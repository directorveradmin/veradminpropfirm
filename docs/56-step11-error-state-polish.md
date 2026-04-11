# Step 11 — Error-State Polish and Calm Recovery Copy

Version: 1.0  
Status: Step 11 complete  
Scope: Onboarding-related error presentation, quiet-state copy, and operator-safe recovery wording  
Canonical inputs: `23-error-states-and-recovery-flows.md`, `22-onboarding-and-first-run-experience.md`, `24-data-migration-and-versioning-spec.md`, `step10_recovery_guidance.md`

---

## 1. Step 11 intent

This document turns Veradmin’s general error doctrine into concrete Step 11 copy and presentation rules for:
- first-run startup,
- onboarding path selection,
- example fleet loading,
- restore entry,
- quiet early states,
- and degraded administrative conditions that may appear during release hardening.

The goal is calm operational honesty.

---

## 2. Decisions frozen in Step 11

### 2.1 Error copy must answer four questions
Every important onboarding or continuity error should answer:
1. What happened?
2. What was affected?
3. What remains safe?
4. What should the operator do next?

### 2.2 The product must distinguish blocked action from changed state
If an operation did not begin or did not commit, say so explicitly.

### 2.3 Quiet states are not failure states
A healthy empty journal, empty payout panel, or empty calendar should feel complete and calm, not broken.

### 2.4 Trust uncertainty is stronger than normal failure
If integrity is uncertain, Veradmin should stop normal optimism and move into a clearly protected posture.

---

## 3. Step 11 error categories

## 3.1 Startup / integrity gate errors
Examples:
- migration failed,
- schema mismatch,
- protected recovery required,
- restore integrity uncertain after the last session.

## 3.2 First-run choice errors
Examples:
- onboarding state cannot be loaded,
- bootstrap metadata missing or invalid,
- selected path cannot continue.

## 3.3 Example fleet load errors
Examples:
- fixture manifest invalid,
- seed operation failed,
- local dataset not empty and load would replace current state,
- example fleet cannot be labeled correctly.

## 3.4 Restore-entry errors
Examples:
- backup preview unavailable,
- restore path blocked,
- safety backup precondition failed.

## 3.5 Quiet-state informational copy
Examples:
- no journal events yet,
- no payouts yet,
- no alerts yet,
- no rotation items yet.

---

## 4. Surface-selection rules

### Inline explanation
Use for:
- invalid first-run form fields,
- small save failures,
- quiet empty states,
- section-scoped admin issues.

### Banner or panel
Use for:
- example fleet load rejected,
- backup creation failed,
- diagnostics unavailable,
- restore blocked before overwrite.

### Dedicated recovery surface
Use for:
- migration failure,
- restore uncertainty,
- startup integrity uncertainty,
- any condition where tactical trust should pause.

---

## 5. Approved Step 11 copy patterns

## 5.1 Healthy quiet states
- `No journal history yet. Logged events will appear here.`
- `No payouts recorded yet.`
- `No rotation items are scheduled yet.`
- `No critical alerts right now.`

## 5.2 First-run informational copy
- `Choose a safe starting path.`
- `Load example fleet to learn Veradmin without using real accounts.`
- `Restore from backup if you are returning to existing local state.`

## 5.3 Example fleet blocked because local data exists
- `Example fleet was not loaded because this local dataset is not empty.`
- `Current local state remains in place.`
- `Create a backup first if you intend to replace the current dataset.`

## 5.4 Example fleet load failed
- `Example fleet could not be loaded.`
- `Current local state was not changed.`
- `Retry the load or review diagnostics before continuing.`

## 5.5 Restore entry blocked
- `Restore did not begin because the selected backup could not be verified.`
- `Current local state remains in place.`
- `Select another backup or review compatibility details.`

## 5.6 Migration / integrity uncertainty
- `Veradmin could not confirm local integrity after startup checks.`
- `Normal tactical use is paused until trust is re-established.`
- `Use recovery guidance before returning to fleet decisions.`

## 5.7 Administrative degradation that does not break tactical trust
- `Diagnostics summary is unavailable right now.`
- `Current tactical interpretation remains trusted.`
- `Retry diagnostics or continue with unaffected work.`

---

## 6. Disallowed copy patterns

Avoid:
- `Something went wrong`
- `Unknown error`
- `Proceed anyway`
- `Your data may be messed up`
- `Success!` for serious administrative operations
- blame language toward the operator

These patterns weaken trust or add noise.

---

## 7. Severity language for Step 11

### Low
Use quiet inline language.
Example:
`This field still needs a starting balance.`

### Medium
Use contained banner/panel language.
Example:
`Example fleet could not be loaded. Current local state was not changed.`

### High
Use stronger panel emphasis.
Example:
`Backup was not created. Live local state remains intact.`

### Critical
Use dedicated recovery language.
Example:
`Integrity could not be confirmed. Normal tactical use is paused.`

---

## 8. Error-state polish rules for onboarding flows

### Create first account
If validation fails:
- keep entered values where possible,
- identify the field that failed,
- explain why the field matters if the reason is non-obvious.

### Load example fleet
If load fails:
- say whether the current dataset changed,
- say whether the failure was pre-load or during load,
- point to the safest next action.

### Restore from backup
If restore path cannot continue:
- do not present restore as “partially successful” unless it truly was,
- preserve the Step 10 recovery vocabulary,
- and prefer safe refusal over optimistic guessing.

---

## 9. Quiet-state polish rules

Quiet states must feel like healthy calm, not unfinished product holes.

Rules:
- explain what will appear later,
- avoid empty gray boxes with no guidance,
- avoid faux urgency for absence of normal records,
- keep the tone sober.

---

## 10. Definition of done for Step 11 error-state polish

This polish pass is satisfied when:
1. important onboarding and recovery failures are honest and scoped,
2. blocked actions clearly say whether state changed,
3. quiet states feel complete rather than broken,
4. trust uncertainty uses stronger protected language,
5. administrative problems are not overstated as tactical failure when trust remains intact,
6. copy stays calm, plain, and actionable,
7. the product feels more trustworthy under failure than under vague success theater.
