# Step 10 — Settings Screen Blueprint

Version: 1.0  
Status: Step 10 complete  
Scope: Settings screen only  
Canonical inputs: `11-settings-backups-and-exports-spec.md`, `33-settings-screen-spec.md`, `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `17-security-and-local-data-protection.md`, `handoff_step_9_to_step_10.md`

---

## 1. Step 10 intent

This blueprint defines the Settings screen as Veradmin’s calm administrative surface.

It is not a tactical workspace.
It is not a place for daily account actions.
It is not a developer console.

The screen exists to help the operator answer:

- how the product is configured,
- which defaults can be changed safely,
- where lower-frequency administrative tools live,
- what version and diagnostic context matters,
- and how to enter backup, restore, export, and recovery work without mixing that work into daily trading surfaces.

---

## 2. Decisions frozen in Step 10

### 2.1 Administrative, not tactical
Settings is explicitly separated from tactical surfaces such as Command Center, fleet review, account detail, journal, alerts, payouts, and calendar rotation.

Rules:
- no daily trading commands live here,
- no account-state mutation actions live here,
- no fast tactical summaries compete visually with the content,
- no raw developer diagnostics dominate the screen.

### 2.2 Stable internal navigation
The Settings screen uses a persistent left-side internal navigation on desktop with a fixed section order:

1. General
2. Fleet Defaults
3. Rule Profiles
4. Alerts and Notifications
5. Backups and Restore
6. Exports and Data Portability
7. System and Diagnostics
8. About and Version

This order must remain stable so the screen becomes familiar over time.

### 2.3 Summary-entry model for sensitive domains
Settings provides safe summaries and entry points for:
- rule profile administration,
- backups and restore,
- exports and portability,
- diagnostics.

Detailed restore/export workflows live in the dedicated Backup, Restore, and Export screen.
Settings acts as a governance hub, not the only place where dangerous work happens.

### 2.4 Controlled save model
Settings behavior is intentionally explicit:

- low-risk display preferences may apply immediately,
- operational defaults stage locally until Save is pressed,
- high-impact actions never masquerade as normal field edits,
- reset or restore-default actions require consequence-aware confirmation.

### 2.5 Quiet but visible diagnostics
Version and diagnostics context is always visible in two places:
- a quiet header/footer metadata surface,
- the System and Diagnostics section.

This information must not be hidden behind developer-only tooling.

### 2.6 Settings remains disciplined
Only settings that improve reliability, clarity, or appropriate customization belong here.
Future toggles and experimental controls must not be added casually.

---

## 3. Screen structure

### 3.1 Header
The header contains:

- page title: `Settings`
- one-line mission summary
- environment badge
- version badge
- unsaved changes indicator when relevant
- quick actions:
  - Save changes
  - Restore section defaults
  - Open Backup Center

The header must orient the operator without feeling like a hero banner.

### 3.2 Left navigation rail
Desktop layout uses a compact rail with:
- section labels,
- current section highlight,
- optional small status dots for warnings,
- no deep nesting.

### 3.3 Main content column
The main content area uses stacked administrative cards inside the currently selected section.
Cards should feel quiet, readable, and consequence-aware.

### 3.4 Explanation lane
Inline explanation belongs close to each field or action.
Long explanation text should not be pushed into distant modals unless the action is truly high impact.

### 3.5 Footer system strip
A quiet footer strip shows:
- app version,
- schema version,
- backup format version,
- export format version,
- release channel,
- last migration outcome,
- local integrity summary.

---

## 4. Section specification

## 4.1 General

Purpose:
Broad application behavior that affects interface expectations rather than domain truth.

Recommended controls:
- default landing surface
- date/time display format
- visual density preference
- open last visited administrative section on return
- desktop notification enablement summary
- low-risk interface behavior preferences

Behavior:
- display-only changes may apply immediately,
- the screen must label them as applied immediately,
- invalid values never appear committed if not accepted.

Not allowed:
- tactical decision shortcuts,
- hidden experimental flags without explicit labeling.

## 4.2 Fleet Defaults

Purpose:
Reduce repetitive setup while preserving account-level control.

Recommended controls:
- default account naming pattern
- default session labels
- default note categories
- default custom event tags
- default operator overlay labels
- default news restriction window overlay

Behavior:
- these are staged until Save,
- section save confirmation should say these affect future defaults, not historical truth,
- account-specific overrides remain stronger than defaults.

## 4.3 Rule Profiles

Purpose:
Expose deliberate rule-profile administration entry points without casual inline editing.

Required summary information:
- active profile count
- preferred profile by firm or class where relevant
- profile version visibility
- recent profile changes or deactivations if tracked

Allowed actions:
- view profiles
- inspect profile versions
- duplicate profile
- create profile
- set preferred profile
- open version history / explanation

Rules:
- profile editing should feel deliberate,
- unsafe edits must validate before save,
- historical profile meaning must remain traceable,
- Settings should frame profiles as governing interpretation, not cosmetic labels.

## 4.4 Alerts and Notifications

Purpose:
Tune presentation and convenience while preserving doctrine.

Recommended controls:
- enable desktop notifications
- suppress low-priority reminders
- group low-severity alerts
- show resolved alerts by default
- require acknowledgement for selected reminder categories where allowed
- quiet hours for non-critical reminders

Rules:
- critical safety alerts must not be fully trivialized,
- presentation preferences must not destroy core alert truth.

## 4.5 Backups and Restore

Purpose:
Provide a quiet summary and clear gateway into the protection/recovery layer.

Required summary information:
- last successful backup time
- protection health
- retained backup count
- backup path summary
- last restore event if any
- one-click entry into Backup Center
- warning language near restore entry

Allowed actions:
- Create backup now
- Open Backup Center
- View recent protection events

Restore is not executed from this summary card.
The summary card must route into the dedicated protection screen.

## 4.6 Exports and Data Portability

Purpose:
Summarize portability capability without crowding the main screen.

Required summary information:
- supported formats
- most recent export
- quick export options
- export destination summary if available
- entry into full export workflow

Rules:
- export must remain intentional,
- the user must know what is being exported,
- exports should not be hidden side effects of another action.

## 4.7 System and Diagnostics

Purpose:
Support trust, troubleshooting, and version clarity.

Required contents:
- app version
- schema version
- backup format version
- export format version
- release channel or environment
- last migration outcome
- local database path summary
- backup path summary
- integrity-check summary
- recent critical warnings
- diagnostics entry point

Behavior:
- administrative failures should remain explicit but calm,
- unavailable diagnostics must show scope clearly,
- this section is readable by a serious operator, not only a developer.

## 4.8 About and Version

Purpose:
Make Veradmin feel maintained and accountable.

Contents:
- product name
- visible version number
- release channel
- documentation entry
- changelog entry
- copyright / ownership label if desired

---

## 5. Save, validation, and defaults behavior

### 5.1 Field behavior classes

Step 10 freezes three field behavior classes:

#### A. Applies immediately
Used only for low-risk display or convenience controls.

Examples:
- interface density
- date/time format
- open-last-section preference

Required UX:
- field shows `Applies immediately`,
- quick confirmation appears inline,
- failure state says the change was not committed.

#### B. Staged until Save
Used for operational defaults and preference sets that change product behavior indirectly.

Examples:
- fleet defaults
- alert grouping
- notification quiet hours
- default overlays

Required UX:
- dirty-state indicator appears in header,
- Save and Revert actions appear clearly,
- section-level validation runs before commit.

#### C. Action-only / confirmed
Used for higher-impact controls.

Examples:
- restore defaults
- set preferred profile
- open restore flow
- delete demo/example data if ever allowed later

Required UX:
- explicit button labels,
- consequence-aware confirmation copy,
- logged result in diagnostics or recent operations where relevant.

### 5.2 Restore defaults behavior
Settings supports:
- section-level restore defaults,
- full-screen restore defaults only behind stronger confirmation.

The copy must explain whether:
- only presentation settings are reset,
- future default behavior is reset,
- or broader administrative configuration is reset.

### 5.3 Validation rules
Validation must:
- identify the field or rule that failed,
- preserve user input where possible,
- avoid punishing re-entry,
- never claim a save succeeded if it did not.

---

## 6. Diagnostics and version surface behavior

### 6.1 Always visible metadata
The screen must always provide access to:
- app version,
- schema version,
- last migration result,
- integrity status,
- last successful backup timestamp.

### 6.2 Version layering
The screen must distinguish between:
- app version,
- schema version,
- backup format version,
- export format version,
- rule profile version where applicable.

These are related, but not interchangeable.

### 6.3 Compatibility language
Compatibility messages use a bounded vocabulary:

- Compatible
- Compatible after restore + migration
- Review required
- Unsupported
- Uncertain integrity

This vocabulary should also be shared with the Backup Center.

---

## 7. Quiet, empty, and degraded states

### 7.1 Quiet healthy state
Examples:
- defaults unchanged,
- no custom profiles yet,
- no export history,
- diagnostics healthy,
- no integrity warnings.

Quiet states should feel complete, not abandoned.

### 7.2 Section-scoped degraded state
Examples:
- backup summary unavailable,
- profile metadata unavailable,
- diagnostics check stale,
- settings file partially loaded.

Required behavior:
- explain scope,
- say what remains safe,
- provide the next safest action,
- avoid escalating an administrative issue as though tactical truth is broken unless it actually is.

### 7.3 Screen-wide critical state
If settings integrity is uncertain in a way that affects trust, the screen must:
- stop pretending the current configuration is reliable,
- show a stronger warning panel,
- point toward diagnostics and recovery surfaces,
- avoid permitting risky administrative changes until confidence returns.

---

## 8. Separation from tactical surfaces

Step 10 explicitly freezes the separation boundary:

Settings must not:
- expose daily trading actions,
- become a shortcut list for account mutations,
- visually reuse the urgency model of tactical alerts,
- bury important recovery tools under tactical views,
- act as a mixed control surface for both governance and active execution.

Settings may link to other screens, but it does not compete with them.

---

## 9. Copywriting rules

The Settings screen should sound:
- calm,
- precise,
- deliberate,
- operational,
- sober.

Avoid:
- playful microcopy,
- vague “saved” states without scope,
- developer jargon as primary UI language,
- theatrical warnings for normal operations.

Examples:
- `Desktop notifications apply immediately.`
- `Fleet defaults are staged until you save changes.`
- `Opening Backup Center will take you to protection and recovery tools.`
- `Diagnostics summary could not be loaded. Current settings remain editable.`

---

## 10. Definition of done for this Step 10 surface

This Settings blueprint is satisfied when:

1. the operator can review configuration safely,
2. the screen has stable internal navigation,
3. lower-frequency administrative domains have clear entry points,
4. high-impact changes feel deliberate,
5. save/apply behavior is explicit,
6. diagnostics and version information are visible,
7. the screen remains clearly separate from tactical daily-use surfaces.
