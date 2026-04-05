# Veradmin MVP Scope

Version: 1.0  
Status: Active  
Owner: Product / Delivery  
Purpose: Define exactly what belongs in Veradmin v1 daily-driver MVP, what is delayed, and how completion is measured

---

## 1. Purpose of This Document

This document defines the minimum viable product scope for Veradmin.

Its purpose is not to describe the final dream product in full. Its purpose is to protect delivery quality by answering:

- what must be built now,
- what may be added later,
- what is explicitly out of scope,
- and what "done" means for the first version that deserves daily use.

The MVP must be good enough to operate real accounts with confidence.
It must not attempt to solve every future possibility.

---

## 2. MVP Definition

**Veradmin MVP is the first local desktop release that a disciplined single operator can use daily to manage a real prop-firm account fleet with trustworthy rule logic, clear account states, fast trade logging, and immediate operational awareness.**

That means the MVP must already support:

- fleet overview,
- account detail,
- rules and restrictions,
- Lives computation,
- modes,
- trade/event logging,
- daily mission awareness,
- essential alerts,
- and trustworthy persistence.

If the app cannot safely guide daily decisions, it is not an MVP yet.

---

## 3. MVP Objectives

The MVP has five objectives.

### Objective 1: Become a daily driver

The user should be able to open Veradmin every morning and use it instead of relying on scattered notes, mental math, and multiple side tools.

### Objective 2: Make operational status obvious

The user should quickly understand which accounts are:

- tradable,
- protected,
- restricted,
- near payout,
- near stop,
- or effectively inactive.

### Objective 3: Make post-trade updating fast and trustworthy

After a trade or major account event, the user should be able to log it quickly and immediately see the new operational state.

### Objective 4: Enforce the tactical model

The MVP must reflect the product doctrine:
rule-engine-first, local-first, permission-centered, and mode-driven.

### Objective 5: Create a stable base for later intelligence and cloud features

The MVP must be architected well enough to support simulation, analytics, cloud sync, and optional AI features later without rewrites.

---

## 4. MVP User

### Primary user

A single desktop-based operator managing multiple prop-firm accounts under a structured risk framework.

### User constraints

The MVP assumes the user:

- wants fast startup,
- does not want login friction,
- values local reliability,
- operates alone,
- can manually log events,
- and needs trust more than novelty.

### User behaviors the MVP must support

- reviewing the fleet at the start of the day,
- selecting which account to focus on,
- checking whether an account is allowed to trade,
- understanding mode and Lives,
- logging wins/losses/custom events,
- checking payout readiness,
- and reviewing alerts and daily priorities.

---

## 5. MVP Principles

The MVP must obey these principles.

1. Local-first over cloud-first
2. Rules before polish
3. Trust before feature count
4. Clarity before customization
5. Daily usefulness before future scalability
6. Strong foundations before optional integrations

---

## 6. What the MVP Includes

The MVP includes the following major systems.

### 6.1 Fleet Command Home

This is the primary landing screen.

It must show:

- fleet status summary,
- today's mission panel,
- active alerts,
- account card grid,
- quick visual indication of tradable vs non-tradable accounts,
- account phase,
- account mode,
- Lives,
- and next milestone (such as payout, days left, or restriction state).

This screen must answer the operator’s first question:
"What matters right now?"

### 6.2 Account Detail View

Clicking an account must open a detailed operational page.

At minimum it must show:

- firm name,
- account label,
- account phase,
- current balance,
- starting balance,
- peak balance if applicable,
- effective floor,
- daily floor,
- Lives,
- fractional Lives if relevant,
- operating mode,
- tradable status,
- key warnings,
- next payout milestone,
- days traded / days required,
- recent events,
- notes,
- and quick actions.

This page must feel like the command center for that account.

### 6.3 Rule Engine

The MVP must include a real rule engine, not just UI calculations.

It must support:

- static drawdown logic,
- trailing drawdown logic,
- daily stop logic,
- phase-aware milestones,
- payout readiness logic,
- account modes,
- full-size vs fractional-only status,
- restriction explanation,
- and next-action guidance at a basic level.

The rule engine must be deterministic and testable.

### 6.4 Lives System

The MVP must fully implement the Lives concept.

It must include:

- current Lives,
- zero-floor clamping,
- support for static and trailing floor logic,
- fractional interpretation support,
- and immediate recalculation after logged changes.

The Lives model must remain central, visible, and mathematically consistent.

### 6.5 Modes

The MVP must include operating modes.

Minimum required modes:

- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

Each mode must have:

- entry logic,
- display style,
- plain-language explanation,
- and expected behavior.

### 6.6 Trade and Event Logging

The MVP must support fast logging of:

- win,
- loss,
- custom trade,
- manual pause,
- payout request,
- payout received,
- fee refund marked,
- note added,
- and manual account update if needed.

Trade log entries should include:

- timestamp,
- account,
- event type,
- P/L or event payload,
- note field,
- optional session,
- optional setup tag,
- and source of change.

### 6.7 Alerts

The MVP must include core alerts.

Required alert categories:

- hard stop / blocked
- daily stop reached
- account near critical threshold
- payout ready
- payout approaching
- refund reminder
- manual attention required
- news restriction warning if configured

Alerts must be prioritized and actionable.

### 6.8 Notes and Audit Memory

The MVP must preserve enough history to explain current state.

At minimum it must store:

- trade events,
- payout-related events,
- mode changes,
- pause/resume actions,
- note entries,
- and other state transitions.

### 6.9 Local Persistence

The MVP must persist all core data locally using SQLite.

The user must be able to close and reopen the app without losing state.

### 6.10 Seed Data and Demo Fleet

The MVP must include seed scripts and demo data so that:

- development is realistic,
- testing is repeatable,
- and the UI can be evaluated against a representative fleet.

---

## 7. MVP Must / Should / Could Matrix

## Must Have

These are required for the MVP to count as valid.

- Local desktop shell via Tauri
- Next.js frontend with a stable dark UI baseline
- SQLite persistence
- Database schema and migrations
- Rule engine core
- Static and trailing drawdown support
- Daily stop support
- Lives system
- Modes
- Fleet Command home
- Account detail screen
- Trade/event logging
- Essential alerts
- Basic notes and audit trail
- Seed data
- Export or backup path
- Unit tests for rule engine core

## Should Have

These are highly desirable and should be included if delivery remains controlled.

- Session tags on trades
- Setup tags
- Today’s mission panel with priority ordering
- Fleet health score v1
- News-event input and warnings
- Basic payout workflow state tracking
- Simple CSV export
- Keyboard shortcuts for major actions
- Search/filter/sort for account grid
- Empty-state guidance

## Could Have

These are welcome if cheap and low-risk, but not required for MVP signoff.

- Sparkline visuals
- Small performance charts
- Theme fine-tuning options
- Custom dashboard density presets
- Advanced filtering chips
- Multiple notes types
- Read-only summary overlays
- Optional onboarding wizard

---

## 8. What the MVP Explicitly Excludes

The following do **not** belong in MVP unless requirements change.

### Excluded for v1

- cloud-first sync
- required user login/auth
- public SaaS behavior
- multi-user accounts
- mobile companion app
- broker/API order execution
- social sharing
- complex permissions system
- heavy analytics dashboards
- advanced AI copilots
- automatic data import from external firms
- collaborative workflows
- marketplace or commercial billing
- plugin architecture

### Delayed until later

- optional Supabase sync
- encrypted remote backups
- mobile read-only companion
- advanced AI daily briefing
- smart payout optimization engine
- smart fleet rebalance suggestions
- team features
- public productization

---

## 9. MVP Functional Requirements

### 9.1 Startup

The app must open locally in desktop form with no login requirement.

### 9.2 Fleet Summary

The home screen must summarize the fleet in a way that makes the operator’s current situation obvious.

### 9.3 Account Eligibility

Every account must clearly communicate whether it is tradable and, if not, why not.

### 9.4 Immediate Recalculation

Any logged event that affects balances, rules, mode, or payout readiness must trigger immediate recalculation.

### 9.5 Persisted History

The system must preserve logged events across sessions.

### 9.6 Clear Restrictions

The user must not need to infer whether they are allowed to trade at full size, fractional size, or not at all.

### 9.7 Mode Visibility

Mode must be visible both on the account card and inside account detail.

### 9.8 Explainability

The system must provide at least a basic explanation for key restriction states.

---

## 10. MVP Non-Functional Requirements

### 10.1 Speed

The app must feel fast on desktop.
Primary screens should load quickly enough to feel immediate in normal use.

### 10.2 Reliability

Core rule outputs must be consistent and deterministic.

### 10.3 Local Trust

The app must remain usable offline.

### 10.4 Clarity

Information hierarchy must support quick operational understanding.

### 10.5 Maintainability

The architecture must support future growth without major rewrites.

### 10.6 Testability

Rule logic and critical transforms must be covered by automated tests.

---

## 11. MVP Definition of Done

The MVP is done only when all of the following are true:

1. The app opens as a desktop application.
2. A demo fleet can be seeded locally.
3. The user can review the fleet and identify tradable accounts instantly.
4. The user can click into an account and see full operational detail.
5. The rule engine correctly handles static vs trailing logic.
6. The Lives system behaves correctly.
7. Modes behave predictably and visibly.
8. Logging a win, loss, or custom event recalculates state immediately.
9. Alerts surface the right issues.
10. A basic event trail exists.
11. Data survives app restart.
12. Backups or exports exist in some form.
13. Critical rule-engine tests pass.
14. Edge-case test accounts have been reviewed manually.
15. The user would trust the app enough to use it for daily operations.

If even one of these fails in a meaningful way, the MVP is not done.

---

## 12. MVP Screen Inventory

The MVP screen set should stay small.

### Required screens

1. Home / Fleet Command
2. Account Detail
3. Event Logging modal or panel
4. Settings / rule-profile management (minimal)
5. Export / backup access point (minimal)

### Optional for MVP if time allows

6. Basic payout console
7. Basic notes view
8. Basic audit/event timeline view

### Not required for MVP

- advanced analytics center
- full calendar intelligence module
- AI briefing center
- cloud sync management center

---

## 13. MVP Data Requirements

At minimum, the MVP data layer must support:

- accounts
- firm rule profiles
- account modes
- balance snapshots or equivalent current-state support
- event/trade logs
- payout events
- refund state
- notes
- alerts
- app/fleet settings

It must distinguish between:

- stored facts
- computed outputs
- event history

This prevents logic drift and future refactor pain.

---

## 14. MVP QA Requirements

Before MVP signoff, QA must include:

### Automated testing

- Lives calculations
- floor logic
- static vs trailing logic
- daily stop logic
- mode transitions
- payout readiness logic if included
- edge clamping / exact-threshold cases

### Manual testing

- normal fleet
- mixed-firm fleet
- messy fleet
- edge-case fleet

### Workflow testing

- morning open
- select account
- log win
- log loss
- switch from tradable to restricted
- payout-ready transition
- app close and reopen
- export/backup flow

---

## 15. MVP Exit Criteria by Gate

### Gate A: Foundations Ready

- repo created
- desktop shell running
- local DB connected
- seed data working

### Gate B: Engine Ready

- schemas defined
- rule engine working
- automated tests passing

### Gate C: Daily Driver Ready

- Fleet Command and Account Detail usable
- logging works
- alerts visible
- state persists

### Gate D: Trustworthy MVP

- operator workflow validated
- critical edge cases handled
- export/backup exists
- real daily-use confidence achieved

---

## 16. Risks to MVP Success

These are the main threats to delivery.

### Risk 1: Scope drift

Trying to add cloud sync, advanced analytics, or AI too early.

### Risk 2: UI-first development

Building polished screens before the rule engine is stable.

### Risk 3: Weak test coverage

Trust collapses if the app gives ambiguous or incorrect restriction states.

### Risk 4: Overcomplicated settings

Too much configurability too early can weaken clarity.

### Risk 5: Missing operational realism

If development does not use seeded realistic fleets, the product may look finished but fail under real usage.

---

## 17. Post-MVP Priorities

Once the MVP is complete and trusted, the next priorities should be:

1. pre-trade advisory expansion
2. scenario simulator
3. richer payout console
4. rotation/calendar intelligence
5. improved fleet health intelligence
6. backup hardening
7. optional cloud sync
8. optional AI briefing layer

Not before.

---

## 18. Final Statement

The MVP is not "the smallest thing that runs."

It is the smallest version of Veradmin that deserves to be trusted in daily prop-firm fleet operations.

That is the standard this scope document protects.
