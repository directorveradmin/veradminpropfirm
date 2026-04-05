# Veradmin Settings, Backups, and Exports Specification

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Operations / UX  
Applies To: Settings surfaces, local persistence safeguards, backup policy, restore workflows, export formats, and operator trust mechanisms

---

## 1. Purpose of This Document

This document defines how Veradmin handles settings, backups, restore flows, and exports.

These systems are not secondary conveniences.
They are part of the product’s trust contract.

Veradmin is being built as a local-first tactical operating system for a prop-firm fleet.
That means the user must be able to trust that:

- core behavior is configurable in controlled ways,
- operational history is not fragile,
- local data can be backed up safely,
- mistakes and device failures are survivable,
- and important information can be exported without losing structure or meaning.

This document exists so that Veradmin does not become a beautiful but fragile shell.
If the operator cannot recover, inspect, transfer, or preserve the system’s memory, the product is incomplete.

---

## 2. Mission of This Layer

The settings, backups, and exports layer must do five things well:

1. Allow controlled system configuration without introducing operational chaos.
2. Protect the local-first source of truth with safe backup and restore behavior.
3. Make critical data portable and inspectable.
4. Preserve trust during errors, device changes, or accidental edits.
5. Separate low-frequency configuration work from high-frequency tactical work.

This layer should feel safe, quiet, and administrative.
It should not compete visually with the trading command surfaces.

---

## 3. Core Principles

### 3.1 Local trust comes first

In Veradmin v1, the local database is the source of truth.
Settings and backup workflows must reinforce this, not undermine it.

### 3.2 Recovery is a product feature

Backups and restore are not technical afterthoughts.
They are part of daily operational trust.

### 3.3 Settings should be disciplined, not sprawling

Not every preference deserves a setting.
Only settings that improve reliability, clarity, or appropriate customization should exist.

### 3.4 Export should preserve meaning

Exports should not merely dump raw values when structured context matters.
The user should be able to understand what was exported and why.

### 3.5 Dangerous actions require clarity

Restore, destructive reset, delete, and overwrite flows must be explicit, reversible where possible, and hard to trigger accidentally.

---

## 4. Settings Surface Mission

The Settings area exists for low-frequency configuration and system administration.

It should handle:
- fleet-level preferences
- app behavior
- rule profile administration entry points
- backup management
- export tools
- local system health indicators
- optional future sync settings
- application metadata and version information

The Settings area should not contain daily trading actions.
It is an administrative space, not a tactical space.

---

## 5. Settings Information Architecture

Recommended sections:

1. General
2. Fleet Defaults
3. Rule Profiles
4. Alerts and Notifications
5. Backups and Restore
6. Exports and Data Portability
7. System and Diagnostics
8. Future Sync and Integrations
9. About and Versioning

These sections may appear as a left-side internal settings navigation or segmented panels, but the structure should remain stable.

---

## 6. General Settings

General settings may include:
- app theme mode if theme switching is ever allowed
- startup behavior
- default landing screen
- date/time format
- currency display preferences
- compact vs standard density where appropriate
- keyboard shortcut enablement if added later

General settings must remain light.
Veradmin should not become a preference-heavy desktop shell.

---

## 7. Fleet Defaults Settings

These settings affect how new entities behave by default.

Possible examples:
- default account naming conventions
- preferred session labels
- standard note categories
- default custom event categories
- default simulation assumptions
- default news restriction windows if user chooses to define them globally

These defaults must be clearly distinguished from account-specific overrides.

---

## 8. Rule Profile Administration Entry

Settings should provide access to rule profile management, but rule editing must be deliberate.

Capabilities may include:
- view current firm rule profiles
- duplicate an existing profile
- create a new custom profile
- mark one as default for a given firm
- view profile version history if implemented
- test a profile against sample account scenarios

Rule profiles are sensitive because they affect operational truth.
Editing them must not feel casual.

---

## 9. Alerts and Notification Preferences

Veradmin v1 is local-first and desktop-first.
Notification behavior should therefore remain restrained and relevant.

Possible settings:
- enable desktop notifications
- suppress low-priority reminders
- define quiet hours for non-critical notifications
- choose which alert categories show badges vs panel entries
- choose whether certain reminders require acknowledgment

Critical safety alerts should not be fully suppressible if doing so would break doctrine.

---

## 10. Backup Mission

Backups exist to protect the product’s operational memory.

The user must not fear losing:
- account history
- journal entries
- payout history
- alert history
- rule profile associations
- notes
- admin records
- settings

If a machine fails or data becomes corrupted, recovery must be practical.

---

## 11. Backup Strategy for v1

Recommended v1 policy:

- automatic local backup on a regular schedule
- on-demand manual backup
- backup before dangerous restore or import operations
- clearly labeled backup files with timestamp and version metadata

Minimum recommended behavior:
- backup on app close or daily cadence
- keep a rolling set of recent backups
- allow manual “Create Backup Now” action

Backups should be stored in a predictable, user-visible location or at least an inspectable configured path.

---

## 12. Backup Types

Veradmin should support at least:

### 12.1 Full application backup
Contains:
- local database
- settings metadata
- rule profile references
- important app configuration

### 12.2 Export-oriented backup
A more portable data package intended for migration, inspection, or archiving.

These are related but not identical.
A full backup prioritizes full fidelity.
An export prioritizes portability and clarity.

---

## 13. Backup Metadata Requirements

Every backup should store or expose:
- created timestamp
- app version
- schema version
- backup type
- device identifier if useful
- checksum or integrity marker if implemented
- optional user note

This matters because restore behavior must be explainable.

---

## 14. Restore Workflow Specification

Restore is one of the highest-trust workflows in the product.

The restore flow must include:
1. backup selection
2. preview or summary of what is being restored
3. warning that current local state will be affected
4. automatic safety backup of current state before restore
5. restore execution
6. success/failure confirmation
7. post-restore state refresh and integrity check

The user should not be allowed to restore blindly without understanding the impact.

---

## 15. Restore Safety Rules

Required rules:
- always back up current state before restore
- show version mismatch warnings
- warn about possible incompatible schema versions
- confirm destructive overwrite clearly
- preserve logs of restore actions in system history where appropriate

Restore should feel safe, not casual.

---

## 16. Export Mission

Exports allow the operator to:
- archive history
- inspect data outside the app
- provide information to accountants or collaborators
- migrate data later
- create human-readable reports
- perform manual validation if necessary

The export system must support both operational and administrative use cases.

---

## 17. Supported Export Types

Recommended export formats for v1:
- CSV
- JSON

Recommended export scopes:
- full dataset export
- account-specific export
- date-range journal export
- payouts-only export
- alerts export
- notes export
- settings summary export where useful

CSV is ideal for spreadsheet inspection.
JSON is ideal for fidelity and migration.

---

## 18. Export Design Requirements

Exports should be:
- clearly named
- timestamped
- schema-aware
- scoped intentionally
- documented enough to be understandable later

The app should not produce mysterious files with ambiguous columns.

Where possible, export actions should include:
- what is being exported
- date range if relevant
- format
- destination path
- success confirmation

---

## 19. Import Policy for v1

Full import may be limited in v1, but the product should still define import philosophy.

Recommended v1 position:
- support restore from internal backups
- delay broad arbitrary CSV import until rules are fully defined
- if any import is allowed, clearly mark imported records with source metadata

Uncontrolled import can damage trust if it creates inconsistent history.

---

## 20. System and Diagnostics Section

The Settings area should include a quiet diagnostics section showing:
- app version
- schema version
- last backup timestamp
- backup path or backup summary
- local database path if appropriate
- last integrity check if implemented
- sync status if future sync is enabled later
- recent critical system warnings

This section should help recovery and troubleshooting without overwhelming normal users.

---

## 21. About and Versioning Section

The product should expose:
- app name
- version number
- release channel if used
- changelog entry point
- copyright/ownership if desired
- support or documentation entry points if applicable

This matters because the app should feel like a maintained operational tool, not an anonymous prototype.

---

## 22. UX Rules for This Layer

The Settings/Backups/Exports layer should feel:
- calm
- administrative
- trustworthy
- explicit
- non-urgent unless something is wrong

It should avoid:
- flashy visuals
- oversized warnings for normal operations
- hidden destructive actions
- ambiguous file names
- unexplained technical jargon

Dangerous actions should use confirmation language that explains consequences in plain terms.

---

## 23. Anti-Patterns to Avoid

Avoid:
- hiding backups in inaccessible paths with no visibility
- allowing destructive restore with one click
- mixing tactical and administrative actions in the same surface
- creating too many preference toggles
- exporting raw internals with no structure or labeling
- allowing silent overwrite of important local state
- treating recovery as a developer-only concern

---

## 24. Definition of Done for Settings, Backups, and Exports

This specification is satisfied when:

1. The user can configure core non-dangerous preferences clearly.
2. Local backups happen reliably and can also be created manually.
3. Restore is safe, explicit, and explainable.
4. Exports are structured, useful, and clearly labeled.
5. Diagnostics expose enough information for trust and troubleshooting.
6. Administrative actions remain separate from tactical daily use.
7. The user feels that Veradmin’s memory is durable, portable, and recoverable.

---

## 25. Future Considerations

Potential later additions:
- encrypted backups
- cloud backup targets
- backup retention policies
- partial restore
- scheduled exports
- read-only archive mode
- import assistant with validation
- migration assistant for future sync or multi-device operation

These are valuable later, but v1 must first establish safe local trust.
