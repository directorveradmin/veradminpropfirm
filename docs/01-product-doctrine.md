# Veradmin Product Doctrine

Version: 1.0  
Status: Active  
Owner: Product / Architecture  
Applies To: All product, design, engineering, QA, and roadmap decisions

---

## 1. Purpose of This Document

This document defines the non-negotiable product doctrine for Veradmin.

It exists so that every future decision about features, interface, architecture, copy, workflow, logic, testing, or release quality can be judged against a single standard. Veradmin must not drift into being "just another dashboard," "just another trading journal," or "just another nice-looking desktop shell." It is being built as a tactical operating system for managing a fleet of prop-firm trading accounts.

This doctrine is not optional guidance. It is the governing philosophy of the product.

If a proposed feature, design, or code path conflicts with this doctrine, the doctrine wins.

---

## 2. Core Product Definition

**Veradmin is a tactical control system for multi-account prop trading operations.**

It is not primarily a journal.
It is not primarily a charting product.
It is not primarily a brokerage interface.
It is not primarily an analytics toy.
It is not primarily a SaaS product.

Its purpose is to help a single operator run a disciplined, repeatable, risk-aware prop-firm fleet with maximum clarity and minimum emotional interference.

Veradmin must answer these questions quickly and reliably:

1. What matters today?
2. Which accounts are tradable right now?
3. What size is allowed right now?
4. What must be protected instead of pushed?
5. What action should happen next?

If the product stops answering those questions clearly, it has failed its purpose.

---

## 3. Product Philosophy in One Sentence

**Veradmin converts emotionally dangerous trading decisions into constrained operational decisions.**

This is the central truth of the product.

The operator should not have to mentally juggle balance thresholds, trailing drawdown logic, daily stop logic, payout timing, phase status, and behavioral caution at the same time. Veradmin exists to turn that mental chaos into a structured operating environment.

---

## 4. Product Vision

The vision of Veradmin is to make prop-firm fleet management feel less like improvised retail trading and more like operating a disciplined control room.

The operator opens the app and immediately understands:

- what the fleet’s current condition is,
- what is safe,
- what is risky,
- what is approaching payout,
- what is near restriction,
- what must be avoided,
- and what the highest-priority action is.

The experience should feel calm, controlled, professional, and operational.

The goal is not excitement.
The goal is not stimulation.
The goal is not "more data."

The goal is **controlled execution and reliable operational awareness**.

---

## 5. The Non-Negotiable Product Truths

### 5.1 Veradmin is desktop-first

Veradmin is not designed first for phones, tablets, or browsers.

Its native home is a desktop environment where the operator opens the app the same way they open a trading terminal. This affects layout, interaction density, keyboard support, information hierarchy, and startup expectations.

### 5.2 Veradmin is local-first

The product must work without depending on internet availability.

Cloud sync may exist later, but the operator must be able to:

- open the app,
- view their fleet,
- log trades,
- compute rules,
- review alerts,
- and continue operating

even if the network is unavailable.

### 5.3 Veradmin is rule-engine-first

The UI is not the core of the system. The rule engine is.

If the interface looks beautiful but the rules are vague, inconsistent, or fragile, Veradmin is broken.
If the interface is plain but the rule engine is trustworthy and clear, the product still has value.

### 5.4 Veradmin is mode-driven

An account must not merely exist as a balance plus a few percentages.

Every account must exist in an operational mode.

Examples include:

- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

Modes are not cosmetic labels. They are behavioral constraints.

### 5.5 Veradmin is permission-centered

The product must always make explicit what is allowed, not just what exists.

It should answer:

- tradable or not,
- full-size or fractional-only,
- protected or active,
- eligible or ineligible,
- safe or unsafe,
- warning or lock state.

### 5.6 Veradmin is event-aware

The product must explain how the current state was reached.

A user must be able to answer:

- Why is this account in this mode?
- Why is this account not tradable?
- Why did this alert appear?
- Why is this payout available now?
- Why did the fleet health score worsen?

That requires event history, not only current-state storage.

### 5.7 Veradmin is operational, not theatrical

The product must feel premium and powerful, but not flashy, noisy, or overstimulating.

It should feel like a serious control surface.
It must never feel like a crypto casino dashboard.

---

## 6. The Veradmin Doctrine Statements

These doctrine statements govern all product choices.

### Doctrine 1: Preserve the fleet before growing the fleet

The first responsibility of Veradmin is survival.

Any feature that increases visual excitement or surface-level productivity but weakens discipline, clarity, or survivability is a bad feature.

### Doctrine 2: Translate money risk into operational language

Raw balance and PnL data matter, but the product must translate them into immediately meaningful operating concepts.

The Lives system is the clearest example of this.
Instead of forcing the user to mentally interpret drawdown space, Veradmin expresses survivability as remaining operational bullets.

### Doctrine 3: Make the allowed action obvious

The operator must not need to infer what is appropriate.

The system should make it obvious whether the user should:

- trade,
- reduce size,
- protect gains,
- wait,
- stop,
- request payout,
- or rotate accounts.

### Doctrine 4: Prevent bad decisions before documenting them afterward

A journal that records mistakes is useful.
A tactical system that prevents avoidable mistakes is far more valuable.

Veradmin must favor pre-trade decision support, warnings, restrictions, previews, and simulation over purely historical reporting.

### Doctrine 5: Treat prop trading as an operational business, not a collection of trades

The fleet is the unit of management.
The account is the unit of execution.
The trade is the unit of event logging.

The product must support that hierarchy.

### Doctrine 6: Surface what matters today and hide what does not

The operator should not be buried in low-value detail.

Veradmin should elevate current mission-critical information and let secondary or historical data remain available but visually subordinate.

### Doctrine 7: Every account exists in a mode, not just a balance

A balance alone tells the user where they are.
A mode tells the user how they are supposed to behave.

### Doctrine 8: Every rule must be explicit, configurable, and auditable

If a rule affects behavior, it must be:

- defined,
- visible,
- versionable,
- testable,
- and explainable.

Hidden magic is not allowed.

### Doctrine 9: Calm authority beats feature clutter

More modules do not make the product better.
Clearer prioritization does.

### Doctrine 10: Trust is more important than novelty

The app must feel dependable.
The user should trust its answers before they admire its polish.

---

## 7. What Veradmin Is Not

To protect product integrity, Veradmin must explicitly reject these identities.

### Veradmin is not a broker terminal

It may calculate what is safe to do, but it is not responsible for order routing or market execution.

### Veradmin is not a charting platform

Charts may exist where useful, but charting is not the center of the experience.

### Veradmin is not a social or collaborative product in version 1

It is built first for a single disciplined operator.

### Veradmin is not a generic journaling app

Trade journaling is part of the system, but only as one layer of operational memory.

### Veradmin is not a mobile-first companion in version 1

Desktop reliability and speed matter more than broad device reach.

### Veradmin is not a cloud-first SaaS in version 1

It must not sacrifice local speed or control in order to feel more modern or "scalable."

---

## 8. The Primary User Model

### Primary User

The primary user is a single operator managing multiple prop-firm accounts under a structured, mostly mechanical execution approach.

The user cares about:

- drawdown safety,
- phase progression,
- payout timing,
- operational discipline,
- daily restrictions,
- cash flow smoothness,
- and avoiding emotional mistakes.

### User Priorities

From highest to lowest:

1. Survival of the fleet
2. Correct next action
3. Clarity of restrictions
4. Confidence in sizing
5. Payout readiness
6. Operational rhythm
7. Historical insight
8. Visual satisfaction

This priority order should shape the product.

---

## 9. Product Success Criteria

Veradmin succeeds when the user can do the following with minimal friction:

- open the app instantly,
- understand the current fleet condition in under 10 seconds,
- see which accounts are tradable and why,
- log a trade in seconds,
- understand the effect of that trade immediately,
- see mode changes immediately,
- trust the restriction logic,
- understand today’s mission,
- manage payout timing and fleet rotation,
- and use the app daily without workaround tools.

A beautiful product that fails these outcomes is not successful.

---

## 10. The Core Operating Loop

The product experience should revolve around this loop:

1. Open the app
2. Review fleet status
3. Review today’s mission
4. Select eligible account
5. Review pre-trade advisory
6. Act in market externally
7. Log trade or event
8. Let rule engine recalculate
9. Review new state
10. Continue or stop according to system guidance

Every major screen and feature should support this loop.

---

## 11. Decision Hierarchy

When priorities conflict, decisions should be resolved in this order:

1. Product doctrine
2. Rule engine correctness
3. Operational clarity
4. Speed and reliability
5. UX elegance
6. Convenience features
7. Cosmetic preferences

This means, for example:

- a slower but clearer interaction may beat a prettier but vague interaction,
- a more explicit status panel may beat a more minimal layout,
- and a more trustworthy local workflow beats a more fashionable cloud dependency.

---

## 12. Doctrine Tests for New Features

Before adding any feature, ask these questions:

1. Does this reduce emotional decision-making?
2. Does this improve operational clarity?
3. Does this help the user know what to do next?
4. Does this protect the fleet?
5. Does this preserve trust in the system?
6. Is this better handled locally rather than through added network dependence?
7. Does this belong in version 1?
8. Will this create clutter or noise on the main surface?
9. Can this feature be explained simply to a disciplined operator?
10. Will this feature still matter after the novelty wears off?

If the answer is weak, the feature should be delayed or rejected.

---

## 13. Anti-Goals

The following are anti-goals for Veradmin v1:

- maximizing the number of features
- designing for viral appeal
- building a multi-user team product
- building a public SaaS before the operator workflow is excellent
- adding cloud sync before local trust is strong
- building mobile-first views before desktop is finished
- overinvesting in charts while underinvesting in rules
- collecting lots of data without clear operational use
- building excessive settings that weaken clarity
- letting aesthetic experimentation compromise authority

---

## 14. The Role of the Lives System

The Lives system deserves special protection because it is the clearest expression of the product’s doctrine.

Lives are not a gimmick.
They are a language for survival.

They should:

- stay mathematically grounded,
- remain central to account understanding,
- be displayed consistently,
- be connected to modes and warnings,
- and be usable in simulation as well as current state.

The product should never bury Lives behind secondary tabs or abstract them away into generic percentages.

---

## 15. The Role of Modes

Modes are the behavioral bridge between account state and operator action.

They exist so that the product can move beyond passive measurement and into tactical guidance.

Each mode must have:

- explicit entry conditions,
- optional exit conditions,
- visual identity,
- behavioral recommendations,
- and operational consequences.

Example:
A Preservation Mode label without restrictions and guidance is incomplete.
A Preservation Mode state that says "fractional only, avoid aggressive pushes, payout proximity high" is useful.

---

## 16. The Role of Alerts

Alerts must be meaningful, prioritized, and actionable.

Veradmin should not create vague or noisy alerts.

Every alert should answer:

- What happened?
- Why does it matter?
- What severity is it?
- What should the user do next?
- Is it blocking, cautionary, or informational?

Alert fatigue is a product failure.

---

## 17. The Role of History and Auditability

The product must preserve enough event history to support trust and explanation.

At minimum, the system must eventually be able to explain:

- why balances changed,
- why modes changed,
- why a payout became available,
- why a stop occurred,
- why the fleet health changed,
- and what changed over time.

Historical memory is not a luxury. It is essential to product trust.

---

## 18. Release Quality Doctrine

A release is not ready because it runs.
A release is ready when it is trustworthy for real use.

Before any release is called usable, it must satisfy:

- core rule logic validated,
- edge-case tests passed,
- seed data available,
- backup/export path defined,
- empty and error states handled,
- daily workflow friction reviewed,
- and no critical ambiguity in account permission states.

---

## 19. Final Product Standard

If Veradmin becomes truly successful, the user should feel:

- calmer after opening it,
- clearer about what to do,
- less likely to overtrade,
- less likely to violate rules,
- better able to manage payout rhythm,
- and more in control of the fleet as a business.

That is the standard.

Not just "looks premium."
Not just "tracks accounts."
Not just "runs on desktop."

It must function as a disciplined operational environment.

---

## 20. Final Statement

Veradmin must be built and judged as a tactical operating system.

Everything else is secondary.

If the product remains faithful to this doctrine, every future decision becomes easier:
the roadmap becomes clearer,
the scope becomes defendable,
the UX becomes calmer,
the architecture becomes cleaner,
and the final product becomes worthy of daily trust.
