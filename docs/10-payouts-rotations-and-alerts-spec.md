# Veradmin Payouts, Rotations, and Alerts Specification

Version: 1.0  
Status: Active  
Owner: Product / Operations / Core Logic / UX  
Applies To: Payout workflow, funded-account rhythm, account rotation planning, reminders, warning systems, and operator attention management

---

## 1. Purpose of This Document

This document defines how Veradmin handles payout operations, funded-account rotation logic, and the alerting system.

These systems are essential because Veradmin is not merely a trade-state viewer.
It is a fleet operating system.

That means the app must help the operator manage:
- cash-flow timing,
- funded-account workload,
- account activation rhythm,
- payout readiness,
- refund opportunities,
- and urgent warnings that affect today’s decisions.

This document exists so these systems are built as coherent operational tools rather than as disconnected widgets.

---

## 2. Why These Systems Matter

A trader running one account may live mostly in trade outcomes.

A fleet operator must also manage:
- when accounts should be active,
- when they should be protected,
- when they should rest,
- when payouts should be requested,
- when refund tasks must be handled,
- when future cash flow becomes lumpy or smooth,
- and what urgent constraints apply today.

If Veradmin ignores these concerns, it remains incomplete as a tactical operating system.

---

## 3. System Overview

This document covers three linked systems:

### 3.1 Payouts
Tracks payout readiness, requests, receipts, and related administrative tasks.

### 3.2 Rotations
Tracks which accounts should be active, resting, cycled, or prioritized over time.

### 3.3 Alerts
Surfaces operationally meaningful warnings, restrictions, reminders, and future attention items.

These three systems must connect, not operate in isolation.

Examples:
- A payout-ready account may trigger an alert and influence rotation decisions.
- A funded account entering a rest week changes dashboard priorities.
- A news alert can override what would otherwise be a tradable account recommendation.

---

## 4. Payout System Mission

The payout system must answer:

1. Which accounts are payout-ready?
2. Which accounts are close to payout readiness?
3. Which payout windows are currently open?
4. Which payouts were requested and are still pending?
5. Which funds have been received?
6. Which admin tasks remain unresolved?
7. How does near-future cash flow look across the fleet?

The payout system is both tactical and business-facing.

---

## 5. Payout Concepts

Veradmin should distinguish at least the following payout states:

- not eligible
- approaching eligibility
- eligible now
- request submitted
- pending receipt
- received
- issue encountered
- refund pending
- refund completed

These states may vary by firm and rule profile, but the system must normalize them into an understandable internal model.

---

## 6. Payout Readiness Requirements

The rule engine or payout engine should evaluate readiness using structured conditions such as:

- profit threshold reached if applicable
- minimum trading days satisfied
- cooldown or waiting period satisfied
- no blocking restriction active
- account status still valid
- phase eligible for payout
- any firm-specific consistency conditions satisfied

Veradmin must not reduce payout readiness to a single simplistic boolean when more nuance exists.

Recommended model:
- readiness status
- readiness explanation
- blockers list
- next qualifying milestone

---

## 7. Payout View Specification

The Payouts surface should show:

### 7.1 Summary header
- total payout-ready accounts
- total pending payouts
- expected incoming amount
- unresolved refund/admin tasks
- projected near-term cash flow

### 7.2 Payout table or card list
For each relevant account show:
- account label
- firm
- current stage
- readiness state
- next payout date or window
- blockers if not ready
- requested date if submitted
- expected arrival date if pending
- amount if known
- refund task status

### 7.3 Detail panel
Selecting an account should show:
- readiness explanation
- historical payouts
- required remaining conditions
- related notes
- refund status
- administrative reminders

---

## 8. Payout Actions

Veradmin should support these structured payout actions:

- mark payout as requested
- mark payout as received
- record payout amount
- add payout note
- mark fee refund requested
- mark fee refund received
- flag payout issue
- resolve payout issue

These actions should create operational events and, where relevant, update related dashboard summaries and alerts.

---

## 9. Refund Task Handling

Refund tracking matters because it affects realized business value.

Refund tasks should be first-class operational items, not buried notes.

Each eligible refund task should support:
- account linkage
- trigger condition
- due / suggested date
- current status
- note history
- completion record

Refund tasks should appear in both:
- payout-related views
- mission/alert surfaces when relevant

---

## 10. Rotation System Mission

The rotation system must answer:

1. Which funded accounts should be active right now?
2. Which should be resting?
3. Which will rotate soon?
4. Where is operational load concentrated?
5. How can the fleet rhythm be smoothed over time?
6. Which weeks look heavy, light, or payout-dense?

Rotation is not merely a visual calendar.
It is an operational planning system.

---

## 11. Rotation Concepts

The system should support at least the following ideas:

- active trading week
- rest week
- evaluation focus period
- payout protection period
- paused period
- manual override period

Some operators may follow a 2-weeks-on / 1-week-off rhythm for funded accounts.
The product should support that kind of policy, but not hard-code one rigid universal behavior.

Rotation logic must be profile-driven and operator-aware.

---

## 12. Calendar and Rotation View Specification

The Calendar surface should show time-based fleet rhythm.

Recommended views:
- week view
- month overview
- account lane view
- filter by firm / stage / mode

Each account lane or row should show:
- active periods
- rest periods
- payout-related milestones
- manual notes
- pending changes
- unusual risk or lockout windows

Evaluation accounts may appear in a separate section or lane grouping so they do not visually compete with funded operations.

---

## 13. Rotation Planning Functions

The product should help the operator see:
- too many accounts active in the same week
- too many payout windows landing together
- weeks with underused capacity
- accounts that should be protected rather than pushed
- where a manual shift may smooth operations

In v1 this may be mostly visual and descriptive rather than automatically optimized.
But the groundwork should be designed for future intelligent suggestions.

---

## 14. Alerts System Mission

The alert system must surface what the operator must notice now or soon.

Its job is not to create noise.
Its job is to preserve attention quality.

Alerts should exist to prevent misses, not to create a permanent red wall.

---

## 15. Alert Categories

Recommended categories:

### 15.1 Critical alerts
Immediate operational or safety risk:
- account hard-risk imminent
- daily stop triggered
- required data invalid
- payout issue blocking action
- corrupted or missing essential state

### 15.2 High-priority warnings
Action should be taken soon:
- red-folder news approaching
- payout request window open
- lives near critical threshold
- refund task due
- account nearing preservation threshold

### 15.3 Informational reminders
Useful but not urgent:
- scheduled rest week begins tomorrow
- evaluation day count milestone reached
- payout likely within next few days
- recently resolved issue logged

---

## 16. Alert Severity Model

Alerts should have explicit severity levels and behavior rules.

Recommended levels:
- critical
- high
- medium
- low
- resolved

Each alert should store:
- category
- severity
- title
- message
- linked entity
- created time
- status
- resolution state
- source (system, rule engine, user)

The UI should never treat all alerts as visually equal.

---

## 17. Alert Sources

Alerts may be created by:
- rule engine
- payout evaluation
- rotation schedule
- news calendar input
- manual user entry
- system integrity checks

This source should be visible or at least queryable for explainability.

---

## 18. News and Time-Based Restrictions

Veradmin should support operator-entered high-impact news events.

At minimum the system should allow:
- event title
- date
- time
- severity / impact
- related instrument if relevant
- custom avoidance window

These events should be able to influence:
- dashboard mission panel
- alerts
- pre-trade advisory
- account recommendation quality

The product should not pretend to know the operator’s exact trading policy automatically.
It should reflect the configured policy consistently.

---

## 19. Alert Presentation Rules

Critical and high-priority alerts should appear in:
- dashboard alert strip
- relevant account view
- dedicated Alerts screen

Lower-priority reminders may appear in:
- daily mission
- account details
- calendar indicators
- journal timelines

Alert overload must be avoided.
Grouping, collapsing, and deduplication matter.

---

## 20. Alert Resolution Behavior

Not every alert should disappear automatically.
Some should require acknowledgment or resolution.

Recommended patterns:
- auto-resolve when state condition no longer applies
- user-resolve for reminder or admin tasks
- system-mark-resolved but retain history

Resolved alerts should remain searchable for auditability, even if hidden from default tactical views.

---

## 21. Relationship Between Payouts, Rotations, and Alerts

These systems must be connected.

Examples:
- payout-ready state creates alert
- payout request may change next mission priorities
- entering payout protection mode may affect rotation desirability
- upcoming rest week may reduce urgency on a tradable account
- unresolved refund task should be visible in both payout and alert contexts
- news alert may override a rotation recommendation for a given day

The implementation should not duplicate logic independently across three separate screens.
Shared domain services or engine outputs should power these surfaces.

---

## 22. Recommended Dashboard Integrations

The dashboard should integrate these systems lightly but meaningfully.

Recommended blocks:
- payout-ready summary
- pending payouts summary
- upcoming rotation change summary
- top alerts
- “today avoid these windows” news summary
- “accounts to protect” signal list

These should direct the user to deeper views when needed.

---

## 23. Data and Event Requirements

The product should store enough history to explain:
- when an account became payout-ready
- when payout was requested
- when payout arrived
- when refund became due and when completed
- when an account entered or left an active rotation period
- when alerts were created, acknowledged, and resolved

This supports auditability, review, and future analytics.

---

## 24. Anti-Patterns to Avoid

Avoid:
- treating payout readiness as a vague label with no explanation
- hard-coding one rotation style with no flexibility
- flooding the user with low-value alerts
- mixing reminders and critical warnings visually
- storing payout/admin milestones only in notes
- building a calendar that is pretty but operationally empty
- making alerts disappear without historical trace

---

## 25. Definition of Done for Payouts, Rotations, and Alerts

This spec is satisfied when:

1. The user can see which accounts are payout-ready and why.
2. Payout actions and refund tasks are tracked clearly.
3. Rotation schedules make account rhythm visible and useful.
4. Alerts surface what matters without overwhelming the user.
5. These systems influence dashboard priorities appropriately.
6. Operational history is preserved across payouts, schedule changes, and warnings.
7. The user can manage the fleet as a business, not merely as a set of balances.

---

## 26. Future Considerations

Potential later additions:
- automatic payout forecasting
- smarter stagger suggestions
- calendar optimization recommendations
- read-only mobile reminder mode
- external calendar export
- alert bundles by time window
- AI-generated morning briefings based on alerts, payouts, and rotations

These are strong future extensions, but v1 should first achieve operational clarity, trust, and low-noise usefulness.
