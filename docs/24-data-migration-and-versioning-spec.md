# Veradmin Data Migration and Versioning Specification

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering / Operations / Product  
Applies To: Schema evolution, data compatibility, rule/profile versioning, upgrades, backups, restore compatibility, and long-term state integrity

---

## 1. Purpose of This Document

This document defines how Veradmin should evolve its data safely over time.

Veradmin is local-first, stateful, and history-aware.
That means versioning and migration are not side concerns.
They are part of the product’s long-term trust model.

As Veradmin grows, it will likely change:
- schema structure
- rule profile shapes
- stored settings
- event models
- export formats
- backup metadata
- interpretation logic around historical data

This document exists so those changes happen deliberately, safely, and transparently.

---

## 2. Migration and Versioning Mission

This layer must do six things well:

1. Allow the product to evolve without sacrificing local trust.
2. Preserve historical meaning across versions where possible.
3. Prevent silent reinterpretation of important past state.
4. Make upgrades recoverable and understandable.
5. Keep backups and exports compatible or explicitly bounded.
6. Distinguish between schema changes, rule changes, and product behavior changes.

The user should never feel that history became untrustworthy simply because the app was updated.

---

## 3. Core Principles

### 3.1 Version everything that changes meaningfully

At minimum, Veradmin should version:
- application releases
- schema state
- rule profiles
- export formats
- backup package formats

### 3.2 Preserve meaning, not just data

A migration is not successful merely because rows still exist.
It is successful when the data still means what the product says it means.

### 3.3 Back up before risk

Any migration with non-trivial risk should create or verify a safety backup.

### 3.4 Be explicit about incompatibility

If a version cannot safely load older or newer data, say so clearly.
Do not attempt magical silent reinterpretation.

### 3.5 Historical trust matters

When rules or models change, the system must remain able to explain what governed historical states and events.

---

## 4. Version Layers

Veradmin should distinguish between several different kinds of versioning.

### 4.1 App version
Represents the packaged release version visible to the user.

### 4.2 Schema version
Represents the shape of the local database and related persistence structures.

### 4.3 Rule profile version
Represents the version of a governing policy profile assigned to accounts.

### 4.4 Backup format version
Represents the structure and compatibility expectations of backup packages.

### 4.5 Export format version
Represents the structure of exported machine-readable data for portability and reporting.

These layers are related but not interchangeable.

---

## 5. Schema Migration Mission

Schema migrations exist to move the persistent data model forward safely.

They must:
- be ordered
- be reproducible
- be testable
- be traceable
- fail safely

Schema migration should never feel like hidden magic.
It is a trust-sensitive operation.

---

## 6. Types of Data Changes

Veradmin may encounter several classes of change.

### 6.1 Additive changes
Examples:
- new optional fields
- new tables
- new indexes
- new event categories

Usually lower risk, but still require compatibility discipline.

### 6.2 Transformative changes
Examples:
- splitting one table into multiple concerns
- normalizing previously embedded data
- changing relationships
- replacing legacy structures

Higher risk and require stronger testing and recovery readiness.

### 6.3 Semantic changes
Examples:
- changed meaning of a field
- changed interpretation of a threshold
- changed rules around payout readiness
- changed mode assignment logic

These may be more dangerous than structural changes because they affect meaning.

### 6.4 Removal or deprecation changes
Examples:
- retired columns
- obsolete settings
- replaced backup fields
- legacy event types

These require explicit deprecation strategy, not just disappearance.

---

## 7. Migration Workflow Requirements

A safe migration workflow should include:

1. detect current version state
2. determine required migration path
3. validate compatibility assumptions
4. create or verify safety backup for risky upgrades
5. apply migration steps in order
6. run post-migration validation
7. record successful migration state
8. stop safely if integrity cannot be confirmed

If a migration cannot confidently preserve trust, the product should refuse normal startup and move into a controlled recovery flow.

---

## 8. Post-Migration Validation

After migration, the system should validate enough to detect obvious trust failures.

Examples:
- required tables and indexes present
- critical relationships intact
- expected version state recorded
- essential account records still evaluable
- rule profile references valid
- recent history readable
- backup metadata sane if relevant

Migration should not be considered complete until post-validation passes.

---

## 9. Migration Logging

Migration events should be recorded in a disciplined way.

Recommended metadata:
- from version
- to version
- timestamp
- migration result
- whether safety backup was created
- validation outcome
- error summary if failed

This helps diagnostics and supports recovery.

---

## 10. Backup Compatibility Rules

Backups should declare the version information needed for safe restore.

At minimum:
- app version
- schema version
- backup format version
- creation timestamp

Restore logic should use this metadata to determine:
- safe to restore directly
- requires migration after restore
- unsupported or unsafe

The product must not guess silently when compatibility is ambiguous.

---

## 11. Export Compatibility Rules

Exports are different from backups.

Rules:
- export format should be versioned
- changes in field meaning should be documented
- machine-readable exports should remain parseable and self-describing
- broad export consumers should not be broken casually across releases

CSV may be more human-oriented and looser.
JSON or structured exports should be stricter and versioned explicitly.

---

## 12. Rule Profile and Historical Versioning

Rule profile changes can alter interpretation even when schema stays the same.

Therefore:
- rule profile versions must be traceable
- accounts should preserve profile assignment history where relevant
- historical reports should be able to explain which profile version governed a state or event
- changes in operator overlays should also be tracked when they materially alter interpretation

This prevents “the past changed because the config changed” confusion.

---

## 13. Handling Semantic Drift

Some of the most dangerous problems are not technical failures, but semantic drift.

Examples:
- a field still loads, but now means something different
- a mode name stays the same, but triggers under different conditions
- payout readiness labels survive, but their logic changed

To manage semantic drift:
- document behavior changes
- version governing rules
- update relevant docs
- note significant interpretation changes in changelog and release notes
- avoid silent relabeling of old history under new meaning unless explicitly intended

---

## 14. Forward and Backward Compatibility Philosophy

Veradmin does not need infinite compatibility.
It needs explicit compatibility.

Recommended philosophy:
- support clear forward migration from recent stable versions
- support restore from known backup versions according to documented compatibility rules
- reject incompatible or unsafe states explicitly
- prefer safe refusal over risky best-effort reinterpretation

This is more honest and more trustworthy.

---

## 15. Migration Testing Requirements

Every meaningful migration should be tested against:
- clean dataset
- edge-case dataset
- messy dataset
- backup restore flow if relevant
- rollback or failure handling path if applicable

Tests should confirm not just that migration “runs,” but that the resulting system still tells the truth.

---

## 16. Version Visibility in the Product

The user should be able to see enough version information to trust the product.

Recommended visible information:
- current app version
- schema version in diagnostics/settings
- last migration outcome if relevant
- backup version information during restore preview

The app should not bury all version information behind developer-only tooling.

---

## 17. Documentation Duties for Version Changes

When version changes affect meaningfully:
- schema
- rule semantics
- backup/restore behavior
- exports
- UI interpretation of state

then relevant repo docs must be updated.

Migration discipline and documentation discipline are linked.
A migration is not fully done if the docs lie afterward.

---

## 18. Anti-Patterns to Avoid

Avoid:
- silent breaking schema changes
- assuming old backups will “probably work”
- changing field meaning without version tracking
- treating app version as sufficient for all compatibility questions
- performing risky migration without backup safeguards
- rewriting history unintentionally under new logic
- hiding migration failures behind generic startup errors

---

## 19. Definition of Done for Data Migration and Versioning

This spec is satisfied when:

1. Meaningful version layers are clearly separated.
2. Schema migrations are ordered, reproducible, and validated.
3. Safety backups protect risky upgrades.
4. Backups and exports carry explicit compatibility metadata.
5. Rule/profile versioning preserves historical trust.
6. Semantic changes are documented instead of silently absorbed.
7. The user can update Veradmin without fearing invisible data meaning loss.

---

## 20. Future Considerations

Potential later additions:
- formal migration assistant
- rollback helper for failed upgrades
- archive-mode loader for legacy backups
- compatibility matrix documentation
- richer diff tooling for profile/version changes
- automated migration verification suites

These are valuable later, but v1 must first make evolution safe, explicit, and explainable.
