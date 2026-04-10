# Step 10 — Backup, Restore, and Export Screen Blueprint

Version: 1.0  
Status: Step 10 complete  
Scope: Dedicated protection, recovery, and portability screen  
Canonical inputs: `11-settings-backups-and-exports-spec.md`, `34-backup-restore-and-export-screen-spec.md`, `23-error-states-and-recovery-flows.md`, `24-data-migration-and-versioning-spec.md`, `17-security-and-local-data-protection.md`, `handoff_step_9_to_step_10.md`

---

## 1. Step 10 intent

This blueprint defines the dedicated Backup, Restore, and Export screen as Veradmin’s continuity and recoverability surface.

It exists to answer:

- is local history protected,
- when was the last backup created,
- how can a new backup be created now,
- how can a restore happen without silent loss,
- how can data be exported intentionally,
- and what compatibility context matters.

This screen is safety-first and trust-sensitive.

---

## 2. Decisions frozen in Step 10

### 2.1 Protection comes first
The screen order is fixed:

1. header
2. protection summary strip
3. backup section
4. restore section
5. export section
6. version and compatibility panel
7. recent operations history

This order reinforces protection first, recovery second, portability third.

### 2.2 Restore is never blind
A restore cannot begin without:
- backup selection,
- metadata preview,
- compatibility review,
- impact summary,
- explicit statement that current local state will be affected,
- automatic safety-backup intent,
- explicit confirm language.

### 2.3 Safety backup before restore is mandatory
Before restore execution, Veradmin creates a safety backup of current local state whenever practical.
If that safety backup fails, restore does not proceed.

### 2.4 Incompatibility is explicit
The screen does not guess silently.
Selected backups are classified as:
- compatible,
- compatible after restore plus migration,
- review required,
- unsupported,
- uncertain integrity.

If the state is unsupported or uncertain, restore is blocked.

### 2.5 Exports are intentional
Export follows a visible sequence:
1. choose scope
2. choose format
3. review inclusion
4. choose destination
5. execute export
6. see success or failure clearly

### 2.6 Operations history is part of trust
Backup creation, restore attempts, restore results, export results, and major safety failures appear in recent operations.

---

## 3. Screen structure

## 3.1 Header
Contents:
- page title: `Backup, Restore, and Export`
- one-line purpose summary
- protection status badge
- quick `Create Backup Now` action
- clear separation between routine safe actions and risky recovery actions

## 3.2 Protection summary strip
Required summary cards:
- last successful backup
- retained backups
- current schema version
- last export
- most recent restore event
- active warning / integrity summary

Each card should be readable in one glance.

## 3.3 Backup section
Required content:
- Create Backup Now
- backup destination summary
- explanatory text about included content
- recent backup list
- optional note support if implemented later
- status of latest backup attempt

Backup copy should state that a full backup contains:
- local database history,
- settings metadata,
- rule profile references,
- administrative records needed for restore.

## 3.4 Restore section
Required content:
- selectable backup list or source picker
- preview pane
- compatibility panel
- affected-state summary
- safety-backup statement
- explicit confirm controls
- visible blocked state when restore is unsafe

## 3.5 Export section
Required content:
- export scopes
- supported formats
- destination path summary
- inclusion review
- recent export summary
- success or failure result copy

## 3.6 Version and compatibility panel
Required content:
- current app version
- current schema version
- backup format version
- export format version
- last migration result
- compatibility interpretation for selected backup
- note if a post-restore migration would be required

## 3.7 Recent operations history
Required operation types:
- backup created
- backup failed
- restore started
- restore blocked
- restore succeeded
- restore failed
- export created
- export failed
- safety backup failed
- integrity review required

---

## 4. Backup section behavior

### 4.1 Manual backup creation
`Create Backup Now` must be easy to reach.

Required behavior:
- clearly shows destination summary,
- indicates what is included,
- returns success or failure explicitly,
- logs the operation,
- never implies that backup happened if it did not.

### 4.2 Backup record display
Each visible backup record includes:
- timestamp
- backup type
- app version
- schema version
- backup format version
- size when useful
- note when present
- status
- restorable eligibility

### 4.3 Protection health states

#### Healthy
Recent successful backup exists and no integrity warnings are active.

#### Attention
Backup is stale, destination is unavailable, or retention is below target.

#### Critical
Backups cannot be trusted, recent backup creation repeatedly failed, or integrity status is uncertain.

Health state affects emphasis, but the tone remains calm and explanatory.

---

## 5. Restore section behavior

## 5.1 Restore flow sequence
Step 10 freezes the restore sequence as:

1. select backup source
2. inspect metadata
3. inspect compatibility
4. inspect impact summary
5. confirm that a safety backup will be created first
6. create safety backup
7. execute restore
8. run post-restore validation
9. show success, failure, or protected recovery result

## 5.2 Restore preview requirements
Before restore, the screen shows:

- backup timestamp
- backup type
- app version captured by the backup
- schema version captured by the backup
- backup format version
- compatibility class
- whether post-restore migration is expected
- which current state will be affected
- whether current state remains untouched if the flow is cancelled
- whether a safety backup will be created before restore

## 5.3 Confirmation language
Confirmation copy must be plain and consequence-aware.

Approved pattern:
`Restore this backup? A safety backup of your current local state will be created before restore begins.`

Button labels:
- `Create safety backup and restore`
- `Cancel restore`

Disallowed pattern:
- `Proceed`
- `Continue`
- `Are you sure?`

## 5.4 Compatibility classes

### Compatible
Safe to restore directly.

### Compatible after restore + migration
Restore can proceed, but post-restore migration must run and be validated.

### Review required
Metadata is incomplete or unusual. Restore is paused for operator review.

### Unsupported
Known version mismatch or format incompatibility prevents safe restore.

### Uncertain integrity
Backup or current state cannot be trusted enough to proceed safely.

## 5.5 Restore blocked states
Restore is blocked when:
- safety backup cannot be created,
- backup metadata is unreadable,
- compatibility is unsupported,
- integrity confidence is uncertain,
- the selected source is corrupted.

Blocked state must say:
- what failed,
- whether current state remains untouched,
- what the safest next step is.

## 5.6 Protected recovery state
If restore may have partially affected local state and integrity cannot be confirmed, the product moves into a clearly marked protected recovery state.

Protected recovery state rules:
- do not pretend restore succeeded,
- do not resume normal operation casually,
- explain that trust is uncertain,
- point the operator toward diagnostics and recovery guidance,
- preserve operation logs.

---

## 6. Export section behavior

## 6.1 Supported Step 10 export scopes
Step 10 freezes the following scope surface:

- full dataset export
- account-specific export
- journal date-range export
- payouts export
- alerts export
- notes export
- settings summary export

## 6.2 Supported formats
- CSV for spreadsheet inspection
- JSON for higher-fidelity structured export

## 6.3 Export flow requirements
Every export follows:

1. choose scope
2. choose format
3. review what is included
4. choose destination
5. execute export
6. show success or failure
7. log the outcome

## 6.4 Export result language
Success must say:
- what scope was exported,
- in which format,
- to which destination summary.

Failure must say:
- what failed,
- whether live local state remains intact,
- whether retry is safe.

---

## 7. Version and compatibility surface behavior

### 7.1 Visible layers
The screen distinguishes:
- app version
- schema version
- backup format version
- export format version

### 7.2 Compatibility interpretation rules
A selected backup is evaluated against current runtime information using version metadata.

Rules:
- app version alone is not enough,
- schema and backup format must be compared explicitly,
- unknown metadata means review or block, not silent optimism,
- post-restore migration must be surfaced before confirmation.

### 7.3 Migration visibility
The panel also shows:
- last migration outcome,
- whether the currently selected backup would require migration,
- whether the migration path is known or unsupported.

---

## 8. Error and degraded states

## 8.1 Backup failure
Message must say:
- backup was not created,
- current local state was not modified,
- retry or alternate destination can be attempted if supported.

## 8.2 Restore rejection before overwrite
Message must say:
- restore did not begin,
- current local state remains in place,
- the rejection reason,
- the next safest action.

## 8.3 Restore failure after safety backup but before commit
Message must say:
- safety backup was created,
- selected restore did not complete,
- current runtime may still be on pre-restore state if confirmed,
- diagnostics review is recommended.

## 8.4 Restore uncertain / partial
Message must say:
- state may have been partially affected,
- normal trust is suspended,
- protected recovery mode is active,
- use diagnostics and recovery guidance before returning to tactical work.

## 8.5 Export failure
Message must say:
- export file was not produced,
- live state remains intact,
- retry is safe if destination/path issue is resolved.

---

## 9. Relationship to Settings

Settings contains summary cards and entry points.
The Backup, Restore, and Export screen contains the full workflows.

This keeps high-impact recovery work separate from general administrative configuration.

---

## 10. Copywriting rules

The screen should sound:
- calm,
- explicit,
- trustworthy,
- technical only where needed.

Examples:
- `This backup contains full local history and settings metadata.`
- `Restore is blocked because the selected backup format is unsupported. Current local state was not changed.`
- `Export failed because the destination folder is unavailable. Live local state remains intact.`

Avoid:
- vague warnings,
- hidden consequences,
- raw file-jargon overload,
- dramatic failure language.

---

## 11. Definition of done for this Step 10 surface

This blueprint is satisfied when:

1. protection status is visible quickly,
2. backup creation is routine and trustworthy,
3. restore is previewed, safety-protected, and consequence-aware,
4. exports are intentional and well scoped,
5. compatibility and version context are visible,
6. recent operations help explain trust and recovery,
7. the screen behaves like a continuity surface rather than a raw file manager.
