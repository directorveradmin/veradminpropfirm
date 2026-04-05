# Veradmin Error States and Recovery Flows

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Operations  
Applies To: Error handling, failure presentation, degraded states, recovery UX, integrity warnings, and operator trust during abnormal conditions

---

## 1. Purpose of This Document

This document defines how Veradmin should behave when something goes wrong.

A tactical operating system is not judged only by how it performs when everything is normal.
It is also judged by how clearly, safely, and honestly it behaves when assumptions fail.

Veradmin will inevitably encounter abnormal states such as:
- invalid configuration
- missing data
- corrupted or incompatible backups
- failed exports
- migration issues
- restore problems
- inconsistent account state
- unavailable local resources
- unexpected runtime failures

This document exists so those moments do not turn Veradmin into a confusing or dangerous experience.
The user must never be left unsure whether the product can still be trusted, what was affected, and what to do next.

---

## 2. Error Handling Mission

The error and recovery layer must do six things well:

1. Protect trust by saying clearly what failed.
2. Protect integrity by preventing silent corruption or ambiguous state.
3. Preserve recoverability whenever possible.
4. Help the operator understand scope and severity.
5. Distinguish between tactical disruption and administrative disruption.
6. Provide the next safest action rather than generic failure noise.

The system should feel calm under failure, not brittle.

---

## 3. Core Principles

### 3.1 Never fail silently on meaningful operations

If an operation affects state, trust, persistence, backups, restores, or evaluations, the user should know whether it succeeded, failed, or only partially completed.

### 3.2 Explain the scope of impact

The product must help the user understand whether the failure affects:
- one account
- one action
- one export
- one view
- the whole local dataset
- or only a convenience function

### 3.3 Preserve state before destructive recovery actions

If recovery may overwrite or replace local state, the product must protect current state first whenever practical.

### 3.4 Distinguish error from uncertainty

Sometimes the product knows something failed.
Sometimes it knows it cannot verify correctness.
These should not be treated as the same thing.

### 3.5 Tactical continuity matters

Where possible, the product should degrade gracefully so the operator can still use unaffected parts of the system safely.

### 3.6 Recovery is part of UX, not just engineering

The recovery path must be understandable, not just technically present.

---

## 4. Error Categories

Veradmin should classify errors into stable operational categories.

### 4.1 Input and validation errors

Examples:
- invalid field values
- missing required fields
- incompatible rule profile assignment
- malformed custom event input

### 4.2 Domain state errors

Examples:
- inconsistent account state
- impossible lifecycle/mode combination
- invalid rule profile references
- missing supporting records required for evaluation

### 4.3 Persistence errors

Examples:
- local database write failure
- local file access issue
- backup file creation failure
- export destination unavailable

### 4.4 Recovery and restore errors

Examples:
- incompatible backup format
- corrupted backup
- failed restore verification
- interrupted restore flow

### 4.5 Migration and version errors

Examples:
- schema mismatch
- failed migration
- unsupported older state package
- partial upgrade state

### 4.6 Runtime UI/system errors

Examples:
- screen rendering failure
- feature module initialization failure
- desktop shell integration issue
- missing local resource

These categories help both diagnostics and user-facing explanation.

---

## 5. Severity Levels

Errors should be classified by operational severity.

### 5.1 Critical

The app cannot safely be trusted in some essential function until addressed.

Examples:
- corrupted local state
- failed migration with uncertain integrity
- rule engine cannot evaluate core account states
- restore may have partially overwritten data

### 5.2 High

A major feature is unavailable or unsafe, but the whole app may not be compromised.

Examples:
- backup creation failing consistently
- payout actions not persisting
- dashboard unable to load one major dataset
- account evaluation blocked for a subset of accounts

### 5.3 Medium

A meaningful workflow is impaired, but operational continuity remains mostly intact.

Examples:
- one export type failing
- one filter view breaking
- one account note flow failing while core state remains intact

### 5.4 Low

A localized non-critical issue with low operational danger.

Examples:
- cosmetic rendering issue
- minor formatting failure
- non-critical help panel bug

Severity must influence both presentation and release decisions.

---

## 6. Error Presentation Rules

Veradmin should present errors with:

- plain language
- clear scope
- severity-appropriate emphasis
- specific next steps when possible
- honest confidence level

A good error message should answer:
1. What happened?
2. What was affected?
3. What was not affected, if known?
4. What should the user do next?

Bad pattern:
- “Something went wrong.”

Better:
- “Backup could not be created because the destination folder is unavailable. Current local state was not modified.”

---

## 7. Tactical vs Administrative Failures

The product must distinguish between:

### 7.1 Tactical failures
Failures that affect current account interpretation or safe decision support.

Examples:
- account state cannot be evaluated
- dashboard summary cannot be trusted
- rule profile missing for active account

These should be elevated strongly.

### 7.2 Administrative failures
Failures that matter, but do not immediately invalidate tactical decision support.

Examples:
- export failed
- changelog panel unavailable
- backup reminder not loading
- optional diagnostics section unavailable

These should be clear but not over-escalated.

---

## 8. Recovery Flow Principles

Every meaningful failure should have one of these outcomes:

1. Immediate correction in place
2. Retry safely
3. Fallback to safe degraded mode
4. Escalation to restore or manual intervention
5. Block action because proceeding would weaken trust

The system should prefer safe refusal over risky ambiguity.

---

## 9. Degraded Mode Behavior

If part of the system fails, Veradmin should degrade intentionally.

Examples:
- if exports fail, tactical views may still work
- if one account record is inconsistent, the rest of the fleet may still load with a clear warning
- if backups are unavailable, the app may still function, but high-impact operations may warn more aggressively
- if a migration cannot confirm safety, the app may stop normal operation and present a controlled recovery path

Degraded mode should be explicit.
The user should know what remains safe to do.

---

## 10. Recovery Flows by Category

### 10.1 Validation failure flow

Used when the user enters invalid or incomplete information.

Requirements:
- explain which field or concept failed
- preserve user input where possible
- allow correction without re-entering everything
- avoid punitive reset behavior

### 10.2 Persistence failure flow

Used when state cannot be written safely.

Requirements:
- do not falsely confirm success
- keep UI and stored state aligned
- explain that current action was not committed
- allow retry
- surface whether local state remains unchanged

### 10.3 Backup failure flow

Requirements:
- state clearly that backup was not created
- explain whether live data remains intact
- offer retry or alternate destination if supported
- log the failure in diagnostics/history if useful

### 10.4 Restore failure flow

Requirements:
- explain whether current state was preserved
- explain whether restore was rejected before changes or failed during process
- if partial failure is possible, move into clearly marked protected recovery state
- guide user toward the safest next step

### 10.5 Migration failure flow

Requirements:
- do not continue normal operation if integrity is uncertain
- explain version mismatch or migration error clearly
- offer recovery path such as restore or rollback if available
- preserve logs and safety backup if possible

---

## 11. Error States in the UI

Important views should have explicit error-state designs.

### 11.1 Dashboard error states

Examples:
- partial fleet load failure
- mission panel unavailable
- alert stream unavailable
- summary metrics degraded

The dashboard should never pretend everything is normal if important data is missing.

### 11.2 Account view error states

Examples:
- rule profile missing
- evaluation failed
- journal load failed
- account history inconsistent

The account view should explain whether the account is currently safe to interpret or not.

### 11.3 Settings/backup/export error states

These should be quieter but still explicit.
Administrative failures should not masquerade as successful completion.

---

## 12. Recovery Surfaces

Recovery should not depend only on generic dialogs.

Recommended recovery surfaces:
- inline error panels
- dedicated recovery screen for critical system issues
- contextual retry controls
- guided restore flow
- diagnostics pointer when needed
- safe “return to trusted state” navigation options

The system should guide recovery without forcing technical reasoning on the user.

---

## 13. Error Logging and Diagnostics

Errors should be captured in a disciplined way for local troubleshooting.

Recommended captured information:
- timestamp
- category
- severity
- operation attempted
- affected entity if relevant
- user-visible message
- technical detail stored separately where appropriate
- recovery action attempted
- final outcome if known

Diagnostics should help explain issues without becoming noisy or privacy-invasive.

---

## 14. Copywriting Rules for Error States

Error copy should be:
- plain
- specific
- non-theatrical
- calm
- actionable

Avoid:
- blame language
- fake urgency
- vague “unexpected error” overuse
- internal jargon that hides meaning

The tone should say:
“The system detected something important and is handling it carefully.”

---

## 15. Manual Recovery Guidance

Some failures may require user action outside one click.

Examples:
- choosing another backup file
- correcting a malformed rule profile
- restoring from a safety backup
- moving export location
- reassigning a missing account profile

When manual action is needed, the instructions should be concise and stepwise.

---

## 16. Anti-Patterns to Avoid

Avoid:
- silent failures
- optimistic success messages after failed writes
- continuing normal operation under uncertain integrity
- presenting the same visual style for minor and critical failures
- destructive recovery with unclear consequences
- making recovery depend on hidden files or tribal knowledge
- overloading the user with raw stack-trace style language in normal UI

---

## 17. Definition of Done for Error States and Recovery Flows

This spec is satisfied when:

1. Important failures are visible and honest.
2. Severity and scope are clearly communicated.
3. The product distinguishes tactical danger from administrative inconvenience.
4. Safe recovery paths exist for meaningful failure classes.
5. Degraded mode is explicit and trustworthy.
6. Recovery UX is understandable by a serious non-technical operator.
7. The system preserves trust even when something goes wrong.

---

## 18. Future Considerations

Potential later additions:
- guided recovery wizard
- health diagnostics dashboard
- automatic integrity checks after restart
- structured bug report export
- rollback helper after failed upgrades
- protected read-only mode when trust is uncertain

These are valuable later, but v1 must first make failure handling honest, safe, and calm.
