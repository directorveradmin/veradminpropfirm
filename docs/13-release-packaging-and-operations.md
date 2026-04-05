# Veradmin Release, Packaging, and Operations

Version: 1.0  
Status: Active  
Owner: Engineering / Product / Operations  
Applies To: Desktop packaging, versioning, release workflow, local installation, operational maintenance, and post-release discipline

---

## 1. Purpose of This Document

This document defines how Veradmin is packaged, released, installed, maintained, and operated as a real desktop tool.

Veradmin must not remain forever in “developer app” territory.
If it is going to function as the operator’s daily command terminal, it needs release discipline.

This document exists to define:
- how builds become release candidates,
- how desktop packages are created,
- how versions are labeled,
- how installations should behave,
- how post-release operations are handled,
- and how the product remains trustworthy after the first working build.

---

## 2. Release Mission

The release and operations layer must ensure that Veradmin feels like a serious, dependable desktop application.

That means:
- installation is straightforward,
- versioning is understandable,
- updates do not feel chaotic,
- release quality is gated,
- and the operator can trust what build they are using.

The goal is not just “make an executable.”
The goal is “ship a stable command tool.”

---

## 3. Packaging Principles

### 3.1 Desktop-first identity

Veradmin should ship as a native-feeling desktop application through Tauri packaging.

### 3.2 Stability before automation

Release automation is useful, but v1 should prioritize understandable, repeatable release steps over unnecessary complexity.

### 3.3 Version clarity matters

The operator should always know what version they are on and whether an upgrade changed behavior meaningfully.

### 3.4 Operational continuity matters

Releases must not casually jeopardize local state, backups, or trust.

### 3.5 Local state is precious

Install, update, and uninstall behavior must respect the fact that Veradmin stores valuable local operational history.

---

## 4. Release Channels

Recommended simple channel model for v1:

- Development
- Release Candidate
- Stable

### Development
Used for active building, experiments, and feature iteration.

### Release Candidate
Used for focused final testing of a build expected to become stable.

### Stable
The build trusted for real daily use.

This channel model is enough for a solo or small-team workflow without adding bureaucratic overhead.

---

## 5. Versioning Policy

Veradmin should use clear semantic-like versioning, for example:

- 0.x for pre-stable development
- 1.0 for first true stable daily-driver release
- 1.1, 1.2 for backward-compatible feature releases
- 1.0.1, 1.0.2 for patches

Version meaning should be documented and exposed in the app.

Recommended interpretation:
- major = structural or compatibility-level change
- minor = meaningful new capability without breaking normal usage
- patch = fixes and polish

---

## 6. Release Artifacts

Each stable or candidate release should produce at minimum:

- packaged desktop build for target operating system
- changelog entry
- version metadata
- integrity-tested backup behavior
- installation notes if needed

Where practical, artifacts should be organized consistently so the operator can find:
- latest stable
- previous stable
- current candidate

---

## 7. Operating System Targets

For v1, the product should prioritize the operator’s primary operating system first.

Recommended policy:
- ship first for the OS that will actually be used daily
- avoid pretending to support multiple OS targets before quality exists on the primary target

Later, cross-platform builds can be expanded once the product is stable.

---

## 8. Installation Behavior

Installation should feel simple and low-friction.

The user should be able to:
1. run installer or unpack app
2. launch Veradmin
3. see a stable desktop window
4. initialize or load local data safely

The app should not behave like a web app disguised as desktop software.
Launch should be fast and consistent.

---

## 9. First-Run Experience

The first-run experience should be clean and confidence-building.

Recommended first-run responsibilities:
- create local app data directories if needed
- initialize database if absent
- create default settings safely
- load seed/example content only if explicitly desired
- explain where backups or local data live if useful
- avoid overwhelming the user with setup noise

The first-run state should feel like a controlled initialization, not a half-built onboarding maze.

---

## 10. Upgrade Behavior

Upgrades are dangerous if handled casually.

Upgrade rules should include:
- preserve local data
- run migrations safely
- create a backup before major migration if possible
- show version change in app
- log upgrade event if useful
- warn when upgrade involves incompatible schema changes

The user must not fear that updating Veradmin will erase or destabilize history.

---

## 11. Changelog Discipline

Every meaningful release should have a changelog entry.

A useful changelog should include:
- version
- date
- key additions
- key fixes
- behavior changes that affect interpretation or workflow
- migration notes if relevant

Changelogs are part of trust.
They tell the operator whether new behavior is intended or accidental.

---

## 12. Release Readiness Checklist

Before a build becomes a release candidate or stable release, confirm:

- quality gates passed
- critical defects resolved
- backups working
- restore tested
- package launches cleanly
- version shown correctly in app
- changelog prepared
- seeded sanity review performed
- no known high-risk regressions remain

A build is not stable because it was packaged.
It is stable because it survived scrutiny.

---

## 13. Stable Release Criteria

A build should be labeled stable only if:

1. Core dashboard is trustworthy.
2. Account state and mode logic are correct.
3. Trade logging is reliable.
4. Backup and restore are operational.
5. Packaging and installation are clean.
6. Known issues are not severe enough to mislead daily operation.
7. The operator would genuinely choose it for real use.

This standard must remain high.

---

## 14. Operational Maintenance Responsibilities

After release, Veradmin still requires operational discipline.

Maintenance work includes:
- reviewing defects
- triaging usability friction
- monitoring migration safety across versions
- ensuring backup behavior remains valid
- updating documentation
- preserving release artifacts
- pruning abandoned experimental branches or features

A working release is not the end of operations.
It is the start of maintenance responsibility.

---

## 15. Issue Handling Policy

When a post-release issue is discovered, the response should depend on severity.

### Critical issue
Examples:
- incorrect rule state
- data corruption
- restore failure
- packaging that breaks startup

Response:
- stop treating build as stable
- create urgent patch plan
- communicate clearly in changelog/notes if relevant

### High issue
Examples:
- payout workflow failure
- incorrect alert presentation in important cases
- serious usability regression

Response:
- prioritize next patch or minor release quickly

### Medium/Low issue
Examples:
- cosmetic bugs
- non-critical layout problems
- minor export imperfections

Response:
- batch into planned maintenance release

---

## 16. Operational Logs and Diagnostics

Release builds should support enough diagnostics to aid trust and troubleshooting.

Recommended operational visibility:
- current version
- schema version
- last backup timestamp
- recent critical system messages
- app environment/channel
- path to logs or data if appropriate

The goal is not to expose raw internals everywhere.
The goal is to make operational troubleshooting possible.

---

## 17. Documentation Obligations Per Release

Every stable release should update or confirm:
- doctrine if unchanged or changed
- MVP or scope notes if affected
- relevant spec docs if behavior changed
- changelog
- installation/update notes if needed

Release discipline includes documentation discipline.

---

## 18. Backup and Release Relationship

No release process should ignore backup safety.

Recommended rules:
- backup or verify backup behavior before stable release signoff
- when shipping schema changes, test backup-restore-upgrade sequences
- if migration risk exists, document it explicitly

The product’s memory must survive product evolution.

---

## 19. Uninstall and Reinstall Philosophy

Veradmin should define how uninstall affects local data.

Recommended policy:
- uninstall should not silently destroy user data unless explicitly chosen
- reinstall should be able to reconnect to retained data or offer safe recovery paths
- documentation should explain where data lives

Even if not fully automated in v1, this behavior must be understood and documented.

---

## 20. Release Anti-Patterns to Avoid

Avoid:
- shipping “stable” builds with known trust-damaging bugs
- unclear version numbers
- hidden migration behavior
- no changelog
- treating local data as disposable
- cross-platform packaging before primary platform quality exists
- relying on memory instead of a release checklist
- packaging without verifying startup, backups, and core flows

---

## 21. Definition of Done for Release, Packaging, and Operations

This specification is satisfied when:

1. Veradmin can be packaged into a dependable desktop build.
2. Installation and launch are low-friction.
3. Versions are labeled clearly.
4. Releases follow explicit checklists and quality gates.
5. Upgrades preserve local trust and data continuity.
6. Changelogs and operational notes are maintained.
7. The app behaves like a serious desktop tool, not an endlessly provisional prototype.

---

## 22. Future Considerations

Potential later additions:
- auto-update channel
- signed installers
- multi-OS release pipeline
- staged rollout process
- automated artifact publishing
- built-in update checker
- rollback support
- encrypted local storage enhancements

These are valuable later, but v1 must first achieve packaging clarity, operational discipline, and trust-preserving updates.
