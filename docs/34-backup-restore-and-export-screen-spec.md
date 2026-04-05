# Veradmin Backup, Restore, and Export Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Operations  
Applies To: Backup screen, restore workflow, export workflow, data portability, safety confirmations, and recovery-related UI

---

## 1. Purpose of This Document

This document defines the dedicated Backup, Restore, and Export screen in detail.

This screen is one of the most trust-sensitive surfaces in Veradmin.
It governs the user’s ability to:
- preserve local history,
- recover from problems,
- move data safely,
- and maintain confidence that the system’s memory is durable.

This document exists so the screen becomes:
- safe,
- explicit,
- understandable,
- and aligned with Veradmin’s local-first philosophy.

This surface must not become:
- a confusing file operations panel,
- a technical graveyard of hidden options,
- or a place where destructive actions feel too easy.

---

## 2. Screen Mission

The Backup, Restore, and Export screen must answer:

1. Is my local history protected?
2. When was the last backup created?
3. How do I create a new backup safely?
4. How do I restore from backup without risking silent loss?
5. How do I export data intentionally and clearly?
6. What versions and compatibility details matter?

This screen is about confidence and recoverability.

---

## 3. Primary User Scenarios

The screen must support at least:

### 3.1 Routine backup creation
The user wants to create a backup now.

### 3.2 Backup health check
The user wants to confirm backups are recent and available.

### 3.3 Restore from backup
The user wants to recover previous state safely.

### 3.4 Export selected data
The user wants a CSV/JSON export for review, archival, or external analysis.

### 3.5 Version and compatibility check
The user wants to know whether a backup or export is compatible.

### 3.6 Recovery after issue
The user needs a guided path back to a trusted state.

---

## 4. Screen Structure

Recommended structure:

1. Screen header
2. Protection summary strip
3. Backup section
4. Restore section
5. Export section
6. Version/compatibility info panel
7. History or recent operations log

This order reinforces the idea that:
- protection comes first,
- recovery comes second,
- portability comes third.

---

## 5. Screen Header

Recommended contents:
- page title
- short purpose summary
- current local protection status badge if useful
- quick “Create Backup Now” action
- clear separation between safe and risky actions

The header should communicate seriousness and clarity.

---

## 6. Protection Summary Strip

Recommended top summary items:
- last successful backup time
- number of retained backups if tracked
- current schema/version summary
- last export time if useful
- most recent restore event if relevant
- any current warnings about backup/restore integrity

This gives the user immediate confidence or immediate clarity about gaps.

---

## 7. Backup Section

This section should support safe routine protection.

Recommended contents:
- Create Backup Now button
- last successful backup summary
- backup destination/location summary
- retained backup list or recent backup list
- optional note field if backup notes are supported
- explanatory text about what the backup contains

The section should clearly state:
- whether the backup includes full local history,
- whether settings are included,
- and whether the backup is suitable for full restore.

---

## 8. Backup List or History

If the product shows backup history, each entry should include:
- timestamp
- backup type
- version metadata
- size if useful
- note if any
- status
- action options such as inspect/select for restore

The backup list should be readable and trustworthy, not raw and technical.

---

## 9. Restore Section

This section is one of the most sensitive in the entire product.

It should support:
- selecting a backup source
- previewing backup metadata
- compatibility review
- warning the user about overwrite implications
- creating a safety backup of current state before restore
- executing restore
- showing result clearly

Restore must feel deliberate and safe.

---

## 10. Restore Preview Requirements

Before a restore proceeds, the screen should show:
- backup timestamp
- backup version info
- schema/version compatibility
- what current state will be affected
- whether a safety backup will be created first
- any risk warnings or incompatibility notes

The user should know what they are about to do.
Restore should never feel blind.

---

## 11. Restore Confirmation Language

Restore confirmation should be:
- plain
- specific
- consequence-aware
- calm

Good example:
- “Restore this backup? A safety backup of your current local state will be created before the restore begins.”

Bad example:
- “Are you sure?”
- “Proceed?”

The button labels should also be explicit.

---

## 12. Export Section

The Export section supports data portability and structured external review.

Recommended capabilities:
- export all data
- export account-specific data
- export journal range
- export payouts
- export alerts
- choose format (CSV / JSON)
- choose destination path if supported
- show what the export includes

This section should prioritize intentionality.
The user should always know what is being exported.

---

## 13. Export Flow Requirements

A good export flow should include:
1. choose export scope
2. choose format
3. review what is included
4. choose destination if relevant
5. execute export
6. show success/failure clearly

Export should not happen as a hidden side effect of another action.

---

## 14. Version and Compatibility Panel

This screen should expose key version information relevant to backup/restore/export safety.

Recommended contents:
- current app version
- current schema version
- backup format version
- export format version
- last migration outcome if relevant
- compatibility notes when a selected backup is older/newer than expected

This panel helps users and reviewers trust the recovery process.

---

## 15. Recent Operations History

The screen may show recent relevant operations such as:
- backup created
- backup failed
- restore attempted
- restore succeeded
- restore failed
- export created
- export failed

This history supports trust, diagnostics, and recovery review.

---

## 16. Relationship to Other Screens

This screen should connect naturally with:
- Settings
- Diagnostics
- Error/Recovery flows
- Release/version info
- Journal if operation history is surfaced there as well

Examples:
- Settings links here for deeper backup/export work
- critical recovery errors may direct the user here
- restore completion may link back to Command Center or a recovery summary

This screen should feel integrated, not hidden.

---

## 17. Empty, Quiet, and Healthy States

The screen should handle:
- first install with no backups yet
- healthy recent backup state
- no exports created yet
- no restore history
- onboarding/demo state

Examples:
- “No backups created yet.”
- “No exports have been created yet.”
- “Your latest backup was created today.”

Healthy quiet states should reinforce calm trust.

---

## 18. Error and Degraded States

If a backup, restore, or export operation fails or becomes uncertain, the screen must handle it carefully.

Examples:
- backup destination unavailable
- restore file incompatible
- backup list partially unreadable
- export failed
- schema mismatch warning
- safety backup failed before restore attempt

The user should know:
- what failed,
- what did not fail,
- and what the safest next action is.

This screen should embody the product’s recovery philosophy.

---

## 19. UX Tone and Visual Feel

This screen should feel:
- safe
- explicit
- calm
- technical only where needed
- trustworthy
- low-drama

It should not feel:
- intimidating
- hidden
- casual about destructive operations
- overcomplicated by file jargon
- like a raw developer tool

This is a safety and continuity surface.

---

## 20. Anti-Patterns to Avoid

Avoid:
- restore with no preview
- destructive action buttons with vague labels
- hidden version/compatibility information
- export flows that do not clearly say what is included
- backup history that is unreadable or unlabeled
- mixing risky and harmless actions visually as though they are equivalent
- burying the create-backup action behind too many layers

---

## 21. Definition of Done for the Backup, Restore, and Export Screen

This spec is satisfied when:

1. The user can assess local protection status quickly.
2. Backup creation is easy and trustworthy.
3. Restore is previewed, confirmed, and safety-protected.
4. Exports are structured, intentional, and understandable.
5. Version and compatibility context is visible where it matters.
6. The screen supports both routine safety and abnormal recovery.
7. The screen reinforces the sense that Veradmin’s memory is durable and recoverable.

---

## 22. Future Considerations

Potential later additions:
- encrypted backup controls
- destination presets
- scheduled backup management
- partial restore
- archive viewer
- guided recovery wizard
- cloud backup targets if ever added

These are valuable later, but v1 must first make the screen a clear and trustworthy safety surface.
