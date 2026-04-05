# Veradmin Implementation Sequencing and Build Order

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Engineering / Delivery  
Applies To: Feature sequencing, implementation order, milestone planning, repo execution discipline, and build-stage priorities

---

## 1. Purpose of This Document

This document defines the recommended implementation sequence for Veradmin.

Veradmin is a product with many interconnected systems:
- rule profiles
- rule engine
- accounts
- views
- journaling
- payouts
- rotations
- alerts
- backups
- exports
- reporting
- onboarding
- recovery flows

If implementation order is undisciplined, the project can easily turn into:
- scattered partial screens,
- duplicated logic,
- unstable architecture,
- and visible progress that is not actually trustworthy.

This document exists so the build order follows product leverage instead of temptation.

---

## 2. Sequencing Mission

The implementation order must do six things well:

1. Build trust before breadth.
2. Create usable increments instead of disconnected fragments.
3. Ensure later screens sit on stable underlying logic.
4. Reduce rework caused by premature UI work.
5. Make the first daily-driver version achievable.
6. Keep the repo aligned with the doctrine and architecture decisions.

This is not a generic roadmap.
It is the execution order for building the actual product.

---

## 3. Sequencing Principles

### 3.1 Foundations before surfaces

Do not build major screens before the data model, rule profiles, and evaluation pipeline are stable enough to support them.

### 3.2 High-leverage systems first

Prioritize what many future features depend on.

### 3.3 Tactical value before broad feature coverage

The Command Center, Account Detail, and logging flows matter earlier than lower-frequency administrative polish.

### 3.4 Local trust before convenience layers

Backups, restore, and integrity matter before optional sync or advanced AI features.

### 3.5 Daily-driver threshold matters

The product should reach “I can use this every day” as early as possible without cheating on trust.

---

## 4. Recommended Build Phases

Recommended implementation sequence:

### Phase 0: Repo and environment foundation
### Phase 1: Data model and rule-profile foundation
### Phase 2: Rule engine and derived state
### Phase 3: Core account workflows
### Phase 4: Command Center and Account Detail screens
### Phase 5: Journal and event history layer
### Phase 6: Payouts, alerts, and calendar layers
### Phase 7: Settings, backups, exports, and recovery
### Phase 8: Onboarding, fixtures, polish, and hardening
### Phase 9: Reporting, simulation depth, and post-v1 enhancements

This sequence aligns with the product’s logic.

---

## 5. Phase 0: Repo and Environment Foundation

Goal:
Establish a working desktop-local codebase with enough structure to support disciplined implementation.

Deliverables:
- repo initialized
- environment documented
- Tauri shell working
- app can launch locally
- core folder structure in place
- docs committed into repo
- database plumbing chosen
- basic linting/formatting/testing scaffold present

Definition of done:
The project boots cleanly and the repo reflects the product architecture.

---

## 6. Phase 1: Data Model and Rule-Profile Foundation

Goal:
Create the persistent and configuration layer that the rest of the product depends on.

Deliverables:
- schema for accounts, events, payouts, alerts, notes, settings, backups metadata, etc.
- rule profile schema
- profile versioning support
- fixture loading pipeline
- repository/data access patterns
- basic seed/example datasets

Definition of done:
The product can represent real accounts and policy environments cleanly, even before full UI exists.

---

## 7. Phase 2: Rule Engine and Derived State

Goal:
Make Veradmin capable of deciding operational truth.

Deliverables:
- Lives calculation
- mode assignment
- tradable/restricted/stopped logic
- payout-readiness evaluation
- alert-trigger outputs
- explanation outputs
- deterministic test coverage for key scenarios

Definition of done:
Given fixture data, the engine can produce believable and testable operational truth without UI improvisation.

This is one of the most important gates in the whole project.

---

## 8. Phase 3: Core Account Workflows

Goal:
Enable the minimal real-life account interaction loop.

Deliverables:
- create/load accounts
- assign profiles
- view account basics
- log win/loss/custom event
- add note
- see state recompute
- persist event history

Definition of done:
The app can already function as a very early local operator tool, even before the polished main screens are complete.

---

## 9. Phase 4: Command Center and Account Detail Screens

Goal:
Build the two most important tactical surfaces.

Deliverables:
- Command Center screen
- account cards
- mission panel
- fleet health strip
- alert summary integration
- Account Detail screen
- state summary
- permissions and restrictions
- why-this-state panel
- tactical action area

Definition of done:
The user can open the app, understand the fleet, inspect an account, and make/verify decisions with confidence.

This is the daily-driver threshold candidate.

---

## 10. Phase 5: Journal and Event History Layer

Goal:
Make the system’s memory visible and useful.

Deliverables:
- Journal screen
- event categories
- filters and search
- account-scoped history views
- detail drawer/panel
- note and event visibility
- timeline linkage from Account Detail

Definition of done:
The user can answer “how did this state happen?” without leaving the product’s structured logic.

---

## 11. Phase 6: Payouts, Alerts, and Calendar Layers

Goal:
Complete the business and time-based operational surfaces.

Deliverables:
- Payouts screen
- refund/admin task handling
- Alerts screen
- severity grouping and resolution flow
- Calendar/Rotation screen
- load/clustering visibility
- links between these screens and the Dashboard

Definition of done:
The product now supports tactical use, business follow-through, and planning over time.

---

## 12. Phase 7: Settings, Backups, Exports, and Recovery

Goal:
Make the app safe and sustainable as a long-lived local tool.

Deliverables:
- Settings screen
- Backup/Restore/Export screen
- backup creation
- restore preview and confirmation
- export flows
- diagnostics exposure
- explicit recovery/error handling for these flows

Definition of done:
The user can protect, recover, and inspect the product’s memory with confidence.

---

## 13. Phase 8: Onboarding, Fixtures, Polish, and Hardening

Goal:
Move from “usable by builder” to “clean, teachable, and robust.”

Deliverables:
- first-run flow
- example fleet onboarding
- empty/quiet state polish
- fixture cleanup and validation
- performance and interaction polish
- error state polish
- copywriting consistency pass
- release-readiness hardening

Definition of done:
The product feels coherent and teachable, not just functional.

---

## 14. Phase 9: Reporting, Simulation Depth, and Post-v1 Enhancements

Goal:
Deepen the product once the foundation is already trusted.

Deliverables:
- reporting surfaces or exports
- richer simulation workflows
- advanced review tools
- optional AI assistance where grounded
- post-v1 roadmap items consistent with doctrine

Definition of done:
Enhancements deepen value without destabilizing the daily-driver core.

---

## 15. Recommended Intra-Phase Build Order

Within each phase, implementation should generally follow:

1. domain/data contract
2. validation
3. service/rule logic
4. tests
5. view-model shaping
6. screen/component integration
7. copy/UX refinement
8. recovery/error handling
9. fixture validation

This avoids “screen first, truth later” implementation drift.

---

## 16. High-Risk Areas That Must Come Earlier Than They Seem

Some systems feel “backend” or “secondary” but actually deserve early attention:

- rule profile versioning
- fixture quality
- event logging correctness
- degraded/error state modeling
- state/view-model separation
- migration/version awareness
- backup safety assumptions

If these are delayed too much, rework grows sharply.

---

## 17. Features That Should Be Delayed Even If Tempting

These should generally come later:
- fancy charts
- broad analytics surfaces
- sync
- AI copilot features
- overly flexible dashboard customization
- advanced import tools
- heavy notification systems
- multi-user or collaboration logic

The product should earn those layers after the core is trustworthy.

---

## 18. Build Order Anti-Patterns to Avoid

Avoid:
- building many screens before rule truth is stable
- implementing ad hoc logic inside UI components “just to move faster”
- delaying fixture/test infrastructure until the end
- building sync before local trust
- polishing weak foundations instead of fixing them
- treating backups/recovery as post-launch concerns
- letting roadmap temptation override architecture order

---

## 19. Milestone Quality Gates

Recommended milestone gates:

### Gate A: Foundation Ready
Repo, schema, profiles, fixtures exist.

### Gate B: Operational Truth Ready
Rule engine and key derived state are trustworthy.

### Gate C: Daily Driver Ready
Command Center + Account Detail + event logging are genuinely usable.

### Gate D: Business Layer Ready
Payouts, Alerts, Calendar are useful and connected.

### Gate E: Trust Layer Ready
Settings, backups, exports, recovery, and diagnostics are safe.

### Gate F: Release Candidate Ready
Onboarding, polish, testing, and hardening support real use.

These gates matter more than arbitrary percentage completion.

---

## 20. Definition of Done for Implementation Sequencing and Build Order

This spec is satisfied when:

1. The build order follows dependency logic rather than screen temptation.
2. High-leverage core systems come before lower-value polish.
3. The daily-driver threshold is reached intentionally and honestly.
4. Trust layers are built before risky expansion layers.
5. The product grows in coherent milestones rather than random feature bursts.
6. Future contributors can see not only what to build, but when and why.
7. The implementation sequence protects Veradmin’s doctrine all the way to release.

---

## 21. Future Considerations

Potential later additions:
- sprint-level breakdowns
- task-level dependency graph
- milestone burndown artifacts
- explicit checklists per phase
- issue labels tied to build phases

These are valuable later, but v1 must first establish a disciplined and doctrine-aligned build order.
