# Veradmin Account Lifecycle and Modes

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Rule Engine / UX  
Applies To: Rule engine, UI state, account workflows, dashboard behavior, permissions, and operator guidance

---

## 1. Purpose of This Document

This document defines how accounts progress through lifecycle stages and how they occupy operational modes inside Veradmin.

This distinction is critical.

Veradmin must not treat an account as “just an entry with a balance.” An account has:

- a lifecycle stage,
- an operational mode,
- temporary restrictions,
- and current permissions.

These are not the same thing.

The purpose of this document is to prevent ambiguity by clearly defining:

- lifecycle stages
- modes
- restrictions
- precedence rules
- transitions
- user expectations
- UI requirements

---

## 2. Why This Matters

Without lifecycle and mode discipline, the operator is forced to interpret too much.

An account at +7% with payout eligibility should not feel like a fresh evaluation account.
An account with 0.7 effective lives should not be shown as “normal.”
An account stopped by the daily limit should not merely look “a little red.”

Veradmin exists to convert raw balance and drawdown facts into operational states the operator can understand immediately.

---

## 3. Core Distinctions

Every account in Veradmin must be described across four different dimensions.

## 3.1 Lifecycle stage

This describes where the account sits in its broader business journey.

Examples:

- Draft
- Imported
- Step 1
- Step 2
- Funded
- Live
- Retired
- Archived

## 3.2 Operational mode

This describes how the account should currently be handled.

Examples:

- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

## 3.3 Restrictions

These describe temporary or hard conditions affecting the account.

Examples:

- daily stop reached
- rotation off week
- news lock window active
- manually paused
- payout lock preference active

## 3.4 Permissions

These describe what the operator is allowed to do right now.

Examples:

- may trade full size
- may trade fractional only
- may request payout
- must not trade
- may resume after reset

The application must never collapse all of these into a single vague status label.

---

## 4. Lifecycle Stages

Lifecycle stage is durable and relatively slow-moving. It is not the same as daily operating condition.

## 4.1 Draft

Meaning:
An account record has been created but is not yet operationally ready.

Typical reasons:

- incomplete data entry
- rule profile not assigned
- starting balance not confirmed
- placeholder account before use

Expected behavior:

- not tradable
- visible only in setup/admin contexts
- strong warning that setup is incomplete

---

## 4.2 Imported

Meaning:
An account has been brought into the system but may not yet be fully normalized or activated.

Typical use cases:

- migration from spreadsheet
- onboarding a fleet from another tracker
- importing historical records

Expected behavior:

- may be inactive pending review
- should be validated before being trusted operationally
- should not silently enter Attack mode

---

## 4.3 Step 1

Meaning:
The account is in the first evaluation phase.

Characteristics:

- target-oriented
- more aggressive growth incentives may exist
- payout logic usually not yet active
- minimum day and phase target logic matter

Expected UI emphasis:

- target progress
- lives remaining
- phase-specific rules
- days traded

---

## 4.4 Step 2

Meaning:
The account is in the second evaluation phase.

Characteristics:

- often closer to completion
- target pressure remains, but preservation may become more important depending on rule profile
- payout logic may still be inactive

Expected UI emphasis:

- target proximity
- survivability
- mode shifts when close to completion

---

## 4.5 Funded

Meaning:
The account is funded and part of the real fleet operation.

Characteristics:

- payout logic active
- fee refund logic may matter
- calendar rotation may matter
- cash-flow behavior matters more

Expected UI emphasis:

- payout readiness
- preservation and payout protection decisions
- active vs rest week
- refund follow-up tasks

---

## 4.6 Live

Meaning:
The account is actively operating in the fleet and fully eligible for day-to-day tactical management.

Note:
In some implementations, `funded` and `live` may be represented separately; in others, `live` may function as a status rather than a phase. If both exist, the distinction must be explicit in code.

---

## 4.7 Retired

Meaning:
The account is no longer part of active operations but remains relevant for historical analysis.

Expected behavior:

- not tradable
- visible in history and reporting
- excluded from active fleet summaries unless requested

---

## 4.8 Archived

Meaning:
The account is intentionally removed from operational use and usually hidden from standard workflows.

Expected behavior:

- never tradable
- excluded from active dashboards by default
- recoverable through admin paths if needed

---

## 5. Operational Modes

Operational mode describes how the account should be handled right now.

Modes are computational outputs from the rule engine. They are not manual vibes.

## 5.1 Attack

Meaning:
The account is tradable under normal aggressive rules within doctrine.

Characteristics:

- sufficient lives remain
- no hard restriction dominates
- no payout protection requirement dominates
- no cooldown active

Operator meaning:

- normal tactical opportunity
- full-size trading may be allowed
- still constrained by risk doctrine

---

## 5.2 Preservation
n
Meaning:
The account is healthy enough to operate, but current conditions call for protection over aggression.

Typical triggers:

- profit cushion worth protecting
- effective lives declining
- nearing meaningful threshold
- phase almost complete

Operator meaning:

- trade selectively
- avoid unnecessary aggression
- protect progress

---

## 5.3 Recovery

Meaning:
The account remains alive, but the operating posture should be defensive because survivability is weak.

Typical triggers:

- low effective lives
- recent drawdown damage
- one more normal loss would materially constrain the account

Operator meaning:

- caution
- often fractional risk only
- no casual trade-taking

---

## 5.4 Payout Protection

Meaning:
The account has reached or is near a payout-sensitive state where protecting the payout opportunity is more important than further pushing performance.

Typical triggers:

- payout eligible
- payout window open soon
- sufficient profit cushion achieved
- doctrine preference favors protection

Operator meaning:

- reduce unnecessary risk
- prioritize request workflow
- avoid turning a payday account into a damaged account

---

## 5.5 Cooldown

Meaning:
The account is temporarily non-tradable or discouraged from trading due to a temporary timing or discipline condition.

Typical triggers:

- daily reset pending
- user-imposed break
- session restriction
- rotation off period
- behavior lock after repeated discretionary deviation

Operator meaning:

- stop for now, not forever
- review after triggering condition expires

---

## 5.6 Stopped

Meaning:
The account is hard-stopped for the current operating context.

Typical triggers:

- daily stop reached
- hard operational lock
- system safety lock
- specific rule violation requiring halt

Operator meaning:

- no trading allowed now
- account may recover later depending on cause

---

## 5.7 Breached

Meaning:
The account has crossed its survivability limit and is no longer operationally alive.

Operator meaning:

- no trading
- remove from active tactical set
- handle as post-mortem, not active opportunity

---

## 6. Restrictions

Restrictions are separate from mode. They are active conditions the engine must evaluate.

Examples:

- manual pause
- daily stop reached
- news lock window active
- rotation off week
- payout request pending lock
- incomplete setup
- stale or missing data

Restrictions influence mode and permissions, but should still be visible in their own right.

---

## 7. Permissions

Permissions are the final practical translation of lifecycle, mode, and restrictions.

Examples:

- may trade full size
- may trade reduced size
- may request payout
- may not trade today
- may resume after reset
- may be reviewed but not modified

The operator should not have to infer permissions from mode alone. The system must state them clearly.

---

## 8. Mode Precedence Rules

When multiple candidate modes could apply, the engine must choose by precedence.

Suggested precedence order:

1. Breached
2. Stopped
3. Cooldown
4. Payout Protection
5. Recovery
6. Preservation
7. Attack

Why this matters:

- an account that is payout-ready but daily-stopped is Stopped, not Payout Protection
- an account in recovery but also in a cooldown window is Cooldown
- an account in strong profit but one loss from disaster may still be Recovery, not Attack

Precedence must be enforced in code and covered by tests.

---

## 9. Lifecycle Transition Rules

Lifecycle transitions are slower and more administrative than mode changes.

Common transitions:

- Draft → Imported
- Imported → Step 1
- Step 1 → Step 2
- Step 2 → Funded
- Funded → Retired
- Any active stage → Archived
- Any active stage → Breached (if breach is represented as status rather than phase)

Rules:

1. Lifecycle changes must be auditable.
2. Promotion between phases should be explicit, not implicit.
3. Historical meaning must be preserved.
4. Archived accounts should not silently re-enter active operation without an explicit action.

---

## 10. Mode Transition Rules

Mode transitions are more dynamic and may happen multiple times within a day.

Examples:

- Attack → Preservation after reaching meaningful progress
- Attack → Recovery after a damaging loss
- Recovery → Stopped after daily stop hit
- Preservation → Payout Protection when payout conditions are met
- Cooldown → Attack after restriction window ends and evaluation permits

Rules:

1. Every transition should be explainable.
2. Every persisted transition should create an audit event.
3. The UI should show when mode changed most recently and why.
4. Manual overrides must never erase the underlying computed recommendation.

---

## 11. Daily Lifecycle

Every account also moves through a daily operating cycle.

Suggested sequence:

1. Previous day closes
2. Daily state resets
3. New daily start balance becomes active
4. News windows for the day become evaluable
5. Trading activity changes realized daily P/L
6. Daily stop may become dominant
7. End-of-day summary and next-day readiness are produced

The system must clearly distinguish between:

- the account’s durable lifecycle stage
- the account’s current mode
- the account’s daily condition

---

## 12. Payout-Related States

Payout status is not exactly the same as mode, but it influences mode.

Possible payout states:

- not eligible
- approaching eligibility
- eligible
- request recommended
- request pending
- paid
- rejected / follow-up needed

When payout logic becomes dominant, the account may transition into Payout Protection mode.

---

## 13. Manual Overrides

Veradmin may allow manual overrides, but only within strict rules.

### 13.1 Allowed override concepts

Examples:

- manually pause account
- manually resume account
- mark account retired
- suppress non-critical alert temporarily
- manually assign special note or hold reason

### 13.2 Forbidden override concepts

Examples:

- silently pretending a breached account is healthy
- bypassing history
- replacing computed mode without trace
- hiding active hard restrictions

### 13.3 Override rules

- overrides must be auditable
- overrides must have reason text
- the computed state should still be preserved underneath
- the UI should distinguish “computed state” from “operator override”

---

## 14. UI Expectations

The UI must visibly separate:

- lifecycle stage
- operational mode
- restrictions
- permissions

Example account header:

- Phase: Funded
- Mode: Payout Protection
- Restrictions: News Lock in 18 min
- Permissions: Fractional only / Payout request allowed

This makes the app readable at a glance.

### 14.1 Dashboard expectations

Collapsed account cards should show at minimum:

- account label
- lifecycle phase
- mode
- lives remaining
- tradable / stopped state
- next milestone or payout cue

### 14.2 Account detail expectations

The detail page should show:

- full phase context
- why the current mode was chosen
- which restrictions are active
- what the permissions are
- what would change after one win or one loss

---

## 15. Analytics Expectations

Later analytics should respect these distinctions too.

Examples:

- win rate by lifecycle phase
- survival by mode
- average time spent in Recovery
- payouts achieved after entering Payout Protection
- number of operator overrides per account

The product should eventually help answer whether its own mode system is improving behavior.

---

## 16. Example Interpretations

### Example A

Account phase: Step 1  
Effective lives: 3.4  
No restrictions  
Target still distant

Likely mode: Attack

### Example B

Account phase: Funded  
Profit cushion strong  
Payout window near  
One unnecessary loss could reduce payout safety

Likely mode: Payout Protection

### Example C

Account phase: Step 2  
Effective lives: 0.8  
No hard stop yet

Likely mode: Recovery

### Example D

Account phase: Funded  
Daily floor reached today  
Overall account still alive

Likely mode: Stopped

### Example E

Account phase: Funded  
Rotation off week  
No drawdown issue

Likely mode: Cooldown

### Example F

Account phase: Any  
Current balance below effective max floor

Likely mode: Breached

---

## 17. Implementation Guidance

Suggested modules:

```text
lib/
  lifecycle/
    phases.ts
    modes.ts
    restrictions.ts
    permissions.ts
    transitions.ts
```

Responsibilities:

- `phases.ts` defines lifecycle types and allowed lifecycle transitions
- `modes.ts` defines mode precedence and descriptors
- `restrictions.ts` defines restriction categories and evaluation helpers
- `permissions.ts` maps computed state to actionable permissions
- `transitions.ts` handles persisted transition event creation rules

---

## 18. Testing Requirements

Minimum tests should cover:

- mode precedence
- lifecycle transition validity
- permission mapping per mode
- payout protection entry
- cooldown expiry behavior
- daily stop forcing Stopped
- breach forcing Breached
- manual override audit creation

---

## 19. Anti-Patterns to Avoid

1. Using one generic `status` field to represent everything.
2. Treating mode as a purely visual badge.
3. Allowing UI components to invent mode meaning.
4. Allowing lifecycle changes without audit history.
5. Hiding restrictions behind color alone.
6. Letting overrides replace truth instead of layering on top of it.

---

## 20. Definition of Done

This lifecycle and mode system is considered correctly implemented when:

- every account clearly has a lifecycle stage
- every evaluated account clearly has one active mode
- restrictions are visible and auditable
- permissions are explicit
- mode changes are explainable
- precedence is deterministic
- UI reflects the distinctions cleanly
- the operator can understand what the account is, what state it is in, and what may be done next without guesswork

---

## 21. Final Standard

An operator should be able to open Veradmin, look at an account, and instantly understand three separate truths:

1. what this account is in the business lifecycle,
2. what condition it is in operationally,
3. what is allowed right now.

If those truths blur together, confusion returns.
If they remain distinct and clear, Veradmin behaves like the tactical operating system it is supposed to be.
