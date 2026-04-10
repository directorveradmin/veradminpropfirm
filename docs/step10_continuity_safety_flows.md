# Step 10 — Continuity and Safety Flows

Version: 1.0  
Status: Step 10 complete  
Scope: Administrative continuity flows, not onboarding or release hardening  
Canonical inputs: `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `17-security-and-local-data-protection.md`, `33-settings-screen-spec.md`, `34-backup-restore-and-export-screen-spec.md`

---

## 1. Flow design principles

All Step 10 continuity flows follow the same trust rules:

- meaningful operations never fail silently,
- scope of impact is always named,
- current local state is preserved before destructive recovery actions when practical,
- tactical disruption is distinguished from administrative inconvenience,
- next safest action is always visible,
- recovery language is calm and specific.

---

## 2. Severity and scope vocabulary

### Severity vocabulary
- Low
- Medium
- High
- Critical

### Scope vocabulary
- one field
- one section
- one export
- one backup operation
- one restore attempt
- one account subset
- full local dataset
- trust uncertain

### Confidence vocabulary
- confirmed safe
- confirmed failed
- review required
- trust uncertain

---

## 3. Step 10 flow set

## Flow 1 — Save staged settings

**Trigger**  
Operator changes staged settings in General, Fleet Defaults, or Alerts and presses Save.

**Guardrails**  
- validate fields before commit,
- preserve invalid input in the form,
- do not show success if persistence fails.

**Success result**  
- success banner names affected section scope,
- unsaved indicator clears,
- recent administrative operation may be logged.

**Failure result**  
- explain which section failed,
- state that uncommitted changes remain in the screen,
- state whether stored configuration stayed unchanged.

**Safe next actions**  
Retry save, correct invalid values, or revert staged edits.

---

## Flow 2 — Restore section defaults

**Trigger**  
Operator activates `Restore section defaults`.

**Guardrails**  
- confirmation copy names the section,
- restore-default behavior does not silently widen scope,
- current staged edits are not discarded without explicit warning.

**Success result**  
Section returns to defaults and the screen states whether those defaults were applied immediately or staged.

**Failure result**  
Current stored settings remain unchanged and the operator sees the reason.

**Safe next actions**  
Retry, cancel, or review diagnostics if configuration source is unavailable.

---

## Flow 3 — Manual backup creation

**Trigger**  
Operator presses `Create Backup Now` from Settings summary or Backup Center header.

**Guardrails**  
- destination summary visible,
- included content described,
- result logged.

**Success result**  
Operation history records backup creation with timestamp, type, and version metadata.

**Failure result**  
Message states backup was not created and that live local state remains intact.

**Safe next actions**  
Retry, change destination when supported, or review diagnostics if repeated.

---

## Flow 4 — Backup health degraded

**Trigger**  
Backup freshness, retention, destination access, or verification status falls below acceptable state.

**Guardrails**  
- present as administrative warning, not tactical panic,
- say whether tactical surfaces remain safe.

**Visible state**  
Protection summary changes to `Attention` or `Critical`.

**Safe next actions**  
Create a fresh backup now, inspect recent failures, review destination/path availability.

---

## Flow 5 — Restore preview and compatibility review

**Trigger**  
Operator selects a backup for restore.

**Guardrails**  
- no state mutation yet,
- preview includes timestamp, type, versions, compatibility, impact summary, and safety-backup statement.

**Possible outcomes**  
- compatible,
- compatible after restore + migration,
- review required,
- unsupported,
- uncertain integrity.

**Safe next actions**  
Proceed only if the preview is compatible and the operator accepts the impact.

---

## Flow 6 — Restore blocked before overwrite

**Trigger**  
Restore cannot proceed because metadata, compatibility, integrity, or safety-backup preconditions fail.

**Guardrails**  
- current local state remains untouched,
- explicit statement that restore did not begin.

**Visible state**  
Blocked restore panel with clear reason and suggested next step.

**Safe next actions**  
Select another backup, fix destination/path issue, create manual backup, or review diagnostics.

---

## Flow 7 — Safety backup before restore

**Trigger**  
Operator confirms restore and the system begins pre-restore protection.

**Guardrails**  
- safety backup must succeed before restore continues,
- failure aborts restore.

**Success result**  
Safety backup event recorded, restore may proceed.

**Failure result**  
Restore stops, current local state remains active, and the user is told no overwrite occurred.

**Safe next actions**  
Retry safety backup, choose different backup source, inspect storage path.

---

## Flow 8 — Restore succeeds

**Trigger**  
Restore completes and post-restore validation passes.

**Guardrails**  
- refresh runtime state,
- surface validation outcome,
- preserve restore event in history.

**Success result**  
Result panel states restore source, completion time, and whether migration ran.

**Safe next actions**  
Return to Settings, Command Center, or diagnostics summary.

---

## Flow 9 — Restore fails after start but before confirmed trust

**Trigger**  
Restore begins but validation cannot confirm a trusted end state.

**Guardrails**  
- do not claim success,
- do not resume normal operation casually.

**Visible state**  
Protected recovery state with integrity uncertainty notice.

**Safe next actions**  
Use diagnostics, evaluate whether to restore from the safety backup, avoid tactical decisions until trust is re-established.

---

## Flow 10 — Export success / failure

**Trigger**  
Operator executes an export.

**Guardrails**  
- export scope, format, and destination are shown before execution,
- exports are never hidden side effects.

**Success result**  
Export result names scope, format, and destination summary.

**Failure result**  
Message states export file was not produced and live state remains unchanged.

**Safe next actions**  
Retry export, choose another destination, narrow scope if needed.

---

## Flow 11 — Diagnostics unavailable

**Trigger**  
System diagnostics summary cannot load.

**Guardrails**  
- clearly scope the issue as administrative unless broader trust is affected,
- do not hide backup and settings actions automatically unless integrity is uncertain.

**Visible state**  
Section-scoped degraded panel.

**Safe next actions**  
Retry diagnostics load, continue with unaffected administrative work, or open recovery guidance if the failure repeats.

---

## Flow 12 — Startup migration / compatibility failure

**Trigger**  
App launch detects schema mismatch, failed migration, or unsupported state package.

**Guardrails**  
- stop normal operation when integrity is uncertain,
- preserve logs and safety backup when practical,
- avoid silent reinterpretation.

**Visible state**  
Controlled recovery entry rather than normal startup.

**Safe next actions**  
Review migration result, restore from trusted backup, or remain in protected recovery until trust is confirmed.

---

## 4. Flow matrix

| Flow | Category | Severity ceiling | Affected scope | Tactical use remains safe? | Required log record |
|---|---|---:|---|---|---|
| Save staged settings | Validation / persistence | Medium | section | Yes, unless settings alter trust-critical defaults and commit is uncertain | yes |
| Restore section defaults | Validation / config | Medium | section | Yes | yes |
| Manual backup creation | Persistence | High | backup operation | Usually yes | yes |
| Backup health degraded | Administrative continuity | High | protection layer | Usually yes, but risky actions warn more strongly | yes |
| Restore preview | Recovery review | Medium | selected backup | Yes, because no mutation yet | optional |
| Restore blocked | Recovery / compatibility | High | restore attempt | Yes, current state unchanged | yes |
| Safety backup failure | Persistence / recovery | High | restore attempt | Yes, current state unchanged | yes |
| Restore succeeds | Recovery | High | full local dataset | Yes, after validation passes | yes |
| Restore uncertain / partial | Recovery / integrity | Critical | trust uncertain | No, tactical trust is suspended | yes |
| Export success/failure | Portability | Medium | export operation | Yes | yes |
| Diagnostics unavailable | Administrative | Medium | diagnostics section | Usually yes | optional |
| Migration failure on startup | Migration / integrity | Critical | full local dataset | No, until trust restored | yes |

---

## 5. Copy rules by flow state

### Healthy completion
Use calm confirmation:
- `Backup created successfully.`
- `Settings were saved.`
- `Export completed.`

### Failed but contained
Name what stayed safe:
- `Export failed. Live local state was not changed.`
- `Restore did not begin. Current local state remains in place.`

### Trust uncertain
Use stronger but still calm language:
- `Restore may have partially affected local state. Veradmin is in protected recovery until integrity is confirmed.`

---

## 6. Flow boundaries

Step 10 intentionally does **not** include:
- onboarding helpers,
- release-hardening implementation,
- automatic cloud sync,
- full import assistant,
- multi-device reconciliation.

This step only defines and scaffolds the local continuity layer.
