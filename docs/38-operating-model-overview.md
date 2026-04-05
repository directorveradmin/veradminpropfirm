# Veradmin Operating Model Overview

Version: 1.0  
Status: Active  
Owner: Product / Architecture / UX / Engineering  
Applies To: Step 1 operating-model definition, system behavior grounding, implementation alignment, and cross-document interpretation

---

## 1. Purpose of This Document

This document is the canonical operating-model overview for Veradmin.

Its purpose is to compress the broader repo documentation into one explicit operational model that engineers, designers, QA, and future contributors can use as the governing mental model before major implementation begins.

Veradmin already has doctrine, architecture, UX, data, and workflow documents. This document does not replace those. Instead, it acts as the formal Step 1 synthesis that turns those materials into a compact operating model.

This document exists so that no one building Veradmin has to guess:

- what the system is fundamentally doing
- what the core objects are
- how accounts move
- how modes work
- how the engine resolves truth
- what the operator does every day
- and where tactical, business, and safety layers meet

---

## 2. Core Product Definition

**Veradmin is a tactical operating system for managing a fleet of prop-firm trading accounts.**

It is not a generic dashboard. It is not merely a journal. It is not primarily an analytics product. It is not primarily a charting tool. It is not primarily a brokerage interface.

It exists to convert raw balances, rule profiles, event history, payout timing, and operational context into clear decisions about:

- what is tradable
- what is restricted
- what must be protected
- what is close to payout
- what action matters next
- and what future rhythm the fleet should follow

---

## 3. The Core Operating Loop

At the highest level, Veradmin runs one repeating loop:

1. load persistent fleet state
2. evaluate each account through the rule engine
3. derive account permissions, restrictions, and mode
4. aggregate fleet-level summaries
5. present mission control to the operator
6. operator performs an action or logs an event
7. event is persisted
8. rule engine re-evaluates
9. mission, account state, alerts, and business context update

This loop is the product. Every screen, workflow, and future enhancement should support this loop rather than bypass it.

---

## 4. The Four Core Dimensions of an Account

Every account in Veradmin must be interpreted through four distinct dimensions.

### 4.1 Lifecycle stage
Where the account sits in its broader account journey.

Examples:
- Evaluation / Step 1
- Evaluation / Step 2
- Funded
- Paused / Retired if treated as lifecycle state in a given implementation
- Breached / Closed

### 4.2 Operational mode
How the account should currently be treated tactically.

Examples:
- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

### 4.3 Restrictions and permissions
What the operator is currently allowed or not allowed to do.

Examples:
- tradable
- fractional-only
- payout-protected
- daily restriction active
- paused by policy
- stopped

### 4.4 Current business/admin context
Whether the account is close to payout, admin action, refund workflow, or rotation shift.

These four dimensions are related, but they are not interchangeable. The product must preserve their distinction everywhere.

---

## 5. The Core System Layers

Veradmin’s operating model depends on six product layers.

1. **Persistence layer**: stores accounts, journal events, payout records, notes, alerts, settings, backup metadata, and profile assignments.
2. **Rule profile layer**: defines the policy environment the account lives inside.
3. **Rule engine layer**: transforms stored facts plus policy into current operational truth.
4. **View-model layer**: shapes operational truth into screen-friendly presentation.
5. **Screen/workflow layer**: lets the operator inspect, act, and review.
6. **Safety and continuity layer**: protects memory, recovery, diagnostics, backups, exports, and version evolution.

---

## 6. Canonical Questions Veradmin Must Always Answer

### Fleet-level
- What matters today?
- Which accounts are currently tradable?
- Which accounts require protection?
- Which accounts are payout-ready?
- Which warnings are critical right now?
- What does the near-future operating rhythm look like?

### Account-level
- What state is this account in?
- Why is it in that state?
- What is allowed right now?
- What is restricted right now?
- What changed recently?
- What action should happen next?
- What would happen after one more win or loss?

If the product cannot answer these, it is not functioning as intended.

---

## 7. The Operator’s Mental Model

The operator should experience Veradmin through a clean mental model:

- **The Dashboard is mission control**
- **Each account is an operating unit**
- **Modes describe tactical posture**
- **Restrictions define permissions**
- **Journal explains how state was reached**
- **Payouts show business posture**
- **Calendar shows fleet rhythm**
- **Alerts manage attention**
- **Settings and safety screens protect continuity**

The product should reduce interpretation burden, not increase it.

---

## 8. The Core Truth Hierarchy

Veradmin must preserve this truth hierarchy:

1. stored facts
2. rule profile and overlays
3. deterministic engine evaluation
4. screen-specific view models
5. UI presentation

This means:
- UI never decides business truth
- view models never invent rule semantics
- screens never re-implement their own version of account logic
- AI, later, may explain truth but never replace it

---

## 9. Event-Driven Operating Model

Veradmin is not only a snapshot system. It is an event-aware system.

Important events include:
- win
- loss
- custom outcome
- note
- payout requested
- payout received
- refund requested/received
- pause/resume
- reset
- mode change
- alert creation/resolution
- profile change
- migration / restore / backup events where relevant

Current state matters. But current state without explainable event history is incomplete.

---

## 10. The Daily Operating Horizon

Veradmin should optimize for three time horizons simultaneously.

### 10.1 Immediate horizon
What matters now and what can be done now.

### 10.2 Short horizon
What happens after the next one or two meaningful events.

### 10.3 Near-future planning horizon
What matters over the next days and weeks for payouts, rotations, and admin tasks.

The product should not get lost in distant speculation. Its power is disciplined present and near-future control.

---

## 11. Tactical vs Business vs Safety Surfaces

Veradmin has three broad classes of surface:

### Tactical
Dashboard, Account Detail, Simulation, Alerts

### Business
Payouts, Calendar/Rotation, Reporting

### Safety/Administrative
Settings, Backup/Restore/Export, Diagnostics, Versioning/Recovery

These layers should connect, but each should retain its purpose and tone.

---

## 12. What Step 1 Completion Means

Step 1 is complete when the product has:

- a lifecycle map
- a mode map
- a fixed rule-evaluation order
- an alert-severity model
- a daily operator workflow
- a trade logging workflow
- a payout workflow
- a calendar/rotation workflow

Those documents together freeze the operating model. They do not finish the product. They make the product buildable without conceptual drift.

---

## 13. Definition of Done for the Operating Model Overview

This document is complete when:

1. It gives a contributor the whole-product operating picture.
2. It explains the system without contradicting deeper repo docs.
3. It clearly states what dimensions define an account.
4. It anchors the truth hierarchy.
5. It explains how state, events, and workflows fit together.
6. It defines what Step 1 completion actually means.
7. It reduces interpretation drift for implementation.
