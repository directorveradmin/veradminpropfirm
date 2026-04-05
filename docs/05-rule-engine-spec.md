# Veradmin Rule Engine Specification

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Core Logic  
Applies To: Engineering, QA, data modeling, simulation, alerting, and all trading-state computations

---

## 1. Purpose of This Document

This document defines the rule engine contract for Veradmin.

The rule engine is the product’s operational brain. It is the layer that transforms raw account data, firm rules, day context, and proposed actions into clear operational answers. Every screen, alert, simulation, workflow, and recommendation in Veradmin must ultimately derive from this engine.

If the rule engine is wrong, the product is wrong.
If the rule engine is vague, the product becomes a tracker instead of a control system.
If the rule engine is inconsistent, the operator loses trust.

This document exists so that no one implements ad hoc calculations inside pages, widgets, or temporary helpers. All meaningful operational logic must flow through the same structured evaluation path.

---

## 2. Rule Engine Mission

The mission of the rule engine is to answer, with consistency and explainability:

1. Is this account tradable right now?
2. If tradable, what risk size is allowed right now?
3. What mode is the account currently in?
4. How many full and fractional lives remain?
5. What restrictions are currently active?
6. What warnings should be shown?
7. What is the next recommended action?
8. What would happen if a proposed action were taken?

This must be true for:

- dashboard summaries
- account detail screens
- pre-trade advisory
- scenario simulation
- payout workflows
- fleet health scoring
- end-of-day summaries
- exports and audit traces

---

## 3. Design Principles

### 3.1 Single source of truth

All operational decisions must be derived from the rule engine, not from duplicated UI logic.

### 3.2 Deterministic outputs

Given the same inputs, the engine must return the same outputs every time.

### 3.3 Explainable decisions

Every non-trivial decision must be traceable to reasons that can be shown to the user and inspected in logs.

### 3.4 Firm-profile-driven

The engine must not hard-code one prop firm’s rules into generic logic. It must evaluate accounts using rule profiles.

### 3.5 Mode-first interpretation

The engine should not stop at reporting raw thresholds. It must convert thresholds and account state into operational modes.

### 3.6 Safe-by-default

When information is missing, ambiguous, stale, or contradictory, the engine must favor caution and produce a warning rather than over-permissive behavior.

### 3.7 Simulation parity

The same engine used for live state evaluation must also power “what-if” simulation. There must not be a separate simulation math path.

---

## 4. What the Rule Engine Is Responsible For

The engine is responsible for computing and returning:

- effective breach floor
- daily stop floor
- current buffer to floor
- lives remaining
- fractional lives remaining
- payout readiness state
- consistency pressure state
- current operational mode
- tradable status
- maximum allowed risk size
- risk severity
- compliance severity
- active restrictions
- active warnings
- next best action
- hypothetical outcomes after a proposed event

It is also responsible for evaluating proposed actions such as:

- planned trade at full risk
- planned trade at fractional risk
- mark trade win
- mark trade loss
- log custom P/L
- payout request
- pause account
- resume account
- daily reset
- change rule profile

---

## 5. What the Rule Engine Is Not Responsible For

The engine does not:

- render components
- choose colors or icons
- save records directly to the database
- format human-facing copy beyond structured reasons and short labels
- decide window layout
- manage sync or transport
- replace the audit layer

It returns structured outputs. The application layer persists events. The UI layer renders states.

---

## 6. Inputs to the Engine

The engine must accept a normalized input object. No screen or caller should manually piece together calculations from partial fields.

### 6.1 Required input domains

#### A. Account snapshot

A point-in-time representation of the account:

- account id
- firm id / rule profile id
- account type / phase
- status
- starting balance
- current balance
- peak balance
- daily start balance
- last payout date
- current trading-day count
- total profit
- realized pnl today
- fee refund status
- manually paused flag
- archived / retired flag

#### B. Rule profile

The firm or strategy rule pack for that account:

- drawdown type (static / trailing)
- max drawdown amount or percentage
- daily drawdown amount or percentage
- fixed risk unit definition
- consistency cap rules
- minimum trading days
- phase targets
- payout cooldown or payout frequency rules
- payout protection preferences
- session restrictions if any
- news restrictions if user-imposed
- manual override permissions

#### C. Day context

The current operating context:

- current timestamp
- trading day boundary definition
- applicable news events and restriction windows
- whether a daily reset has occurred
- whether payout window is open
- whether the account is in an off-rotation period

#### D. Proposed action (optional)

If the engine is being used for advisory or simulation:

- action type
- proposed risk size
- expected P/L outcome if simulation
- note whether action is live or hypothetical

---

## 7. Core Output Contract

The engine must return one structured object with stable fields.

### 7.1 Output groups

#### A. Identity

- account id
- evaluation timestamp
- rule profile version
- evaluation mode (`live` or `simulation`)

#### B. Derived thresholds

- effective max floor
- effective daily floor
- current max buffer
- current daily buffer
- full risk amount
- currently allowed risk amount

#### C. Lives

- full lives remaining
- fractional lives remaining
- max-limited lives
- daily-limited lives
- effective lives (the more restrictive result)

#### D. State

- tradable status
- mode
- payout state
- consistency state
- restriction state
- warning state
- breach state

#### E. Permissions

- may trade
- may trade full size
- may trade fractional only
- must not trade
- may request payout
- may resume
- may override

#### F. Recommendations

- next best action
- priority level
- short reason summary
- detailed reasons list

#### G. Simulation diff (if applicable)

- prior mode vs projected mode
- prior lives vs projected lives
- prior payout state vs projected payout state
- newly triggered warnings
- newly triggered restrictions

---

## 8. Evaluation Order

The order of operations is critical. The engine must evaluate in a fixed sequence.

### Step 1: Normalize inputs

- validate required fields
- coerce numeric types
- resolve rule profile defaults
- confirm current day boundary
- flag missing or stale data

### Step 2: Compute base thresholds

Determine:

- effective max floor
- effective daily floor
- current max buffer
- current daily buffer

This step must respect static vs trailing logic.

### Step 3: Compute risk unit

Determine the full standard risk unit for the account.

Veradmin’s doctrine assumes fixed-risk units derived from starting balance, unless an explicit strategy variation is introduced later. This must be rule-profile-driven, not scattered through the UI.

### Step 4: Compute lives

Using the current buffers and full risk amount, compute:

- total lives to max floor
- daily lives to daily stop
- effective lives as the most restrictive condition

### Step 5: Compute hard restriction states

Determine whether any hard stop is active:

- account breached
- daily stop reached
- account manually paused
- account in off-rotation window
- account archived or retired
- required data missing

Hard restrictions should be evaluated before softer recommendations.

### Step 6: Compute compliance states

Determine:

- consistency pressure
- minimum day progress
- payout readiness
- fee refund follow-up state
- phase target progress

### Step 7: Determine operational mode

Use thresholds, restrictions, and compliance states to assign one operational mode.

Mode selection must be deterministic and precedence-based. See mode precedence in the lifecycle document.

### Step 8: Determine permissions

Convert mode and restrictions into operator permissions:

- tradable / non-tradable
- full-size / fractional-only
- protect / push / stop

### Step 9: Produce warnings and reasons

Generate structured reasons with identifiers, severity, and human-readable explanation.

### Step 10: Produce recommendations

Return the next best action, not just the raw account state.

---

## 9. Threshold Logic

### 9.1 Max floor

The max floor is the floor that determines whether the account survives overall.

- For static drawdown, it is anchored to starting balance and allowed loss.
- For trailing drawdown, it must be anchored to the effective peak balance according to the firm rule profile.

### 9.2 Daily floor

The daily floor is the floor that determines whether the account may continue trading within the current day.

The daily floor is typically anchored to the daily start balance and must reset according to the account’s trading-day boundary rules.

### 9.3 Full risk unit

The full risk unit represents one full “life.”

The product doctrine assumes a standard full risk unit so that the operator thinks in operational bullets rather than raw cash risk. Any future risk variations must still map cleanly to the same conceptual system.

### 9.4 Effective lives

Effective lives are not simply the lives to the max floor. They must be constrained by whichever of the following is more restrictive:

- max floor
- daily floor
- mode-based restriction
- payout protection restriction
- manual operational lock

---

## 10. Mode Determination

The mode system belongs to the lifecycle document, but the rule engine is responsible for assigning the active mode.

At minimum the engine must be able to return:

- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

Mode must be assigned by precedence, not by loose interpretation.

For example:

- Breached overrides every other mode.
- Stopped overrides Recovery, Preservation, and Attack.
- Payout Protection may override Attack.
- Recovery may override Attack when effective lives are too low.

Modes are not visual labels. They are computational states.

---

## 11. Permissions Matrix

The engine must convert operational mode into permissions.

Examples:

### Attack

- may trade: yes
- full size allowed: yes
- fractional only: no
- payout request: maybe, depending on payout state

### Preservation
n
- may trade: yes
- full size allowed: maybe, depending on effective lives
- emphasis: protect gains, avoid over-pushing

### Recovery

- may trade: maybe
- full size allowed: usually no
- fractional-only: often yes
- advisory: reduce aggression

### Payout Protection

- may trade: yes or no depending on doctrine setting
- allowed size: often reduced
- recommendation: protect threshold, prioritize payout workflow

### Cooldown

- may trade: no
- reason: temporal, rule-based, or behavioral

### Stopped

- may trade: no
- reason: daily stop, hard restriction, or system lock

### Breached

- may trade: no
- reason: account no longer viable

This matrix must be implemented in code rather than left as UI interpretation.

---

## 12. Warning and Severity Model

Warnings must be structured objects with stable categories.

### 12.1 Warning fields

Each warning should include:

- warning code
- severity (`info`, `caution`, `danger`, `lock`)
- title
- explanation
- optional remediation

### 12.2 Suggested warning categories

- low effective lives
- daily restriction dominant
- near hard breach
- payout eligible
- payout protection recommended
- consistency risk elevated
- trading-day minimum incomplete
- rotation off week
- refund follow-up pending
- rule profile incomplete
- stale data detected
- manual override active
- news lock window active

---

## 13. Recommendation Model

The engine must always try to return one best next action.

Examples:

- `trade_full_size`
- `trade_fractional_only`
- `do_not_trade`
- `request_payout`
- `protect_account`
- `pause_until_reset`
- `review_rule_profile`
- `complete_minimum_day`
- `log_missing_day_start`

Recommendations must include reason identifiers so the UI can explain them.

---

## 14. Simulation Requirements

Simulation is not optional. It is one of Veradmin’s key differentiators.

The engine must support simulation of:

- one full loss
- one full win
- a custom P/L result
- payout request effect
- next-day reset effect
- rotation status change
- manual mode override

The simulation must use the same logic path as live evaluation.

Simulation output must show:

- what changes
- what does not change
- what new warnings appear
- whether the account becomes safer or more constrained

---

## 15. Missing Data and Ambiguity Handling

The engine must never silently ignore missing critical fields.

### 15.1 Examples of critical missing data

- current balance missing
- starting balance missing
- peak balance missing for trailing accounts
- daily start balance missing when daily evaluation is required
- rule profile missing
- payout cadence undefined for payout calculations

### 15.2 Safe behavior

When critical data is missing, the engine must:

- produce a warning
- reduce trust in permissions
- avoid over-permissive outputs
- explain why the result is degraded

---

## 16. Auditability Requirements

Every engine evaluation that results in a persisted operator action should store enough detail to explain later:

- the input snapshot reference
- the rule profile version
- the returned mode
- the returned permissions
- the reasons and warnings
- the recommendation given

This is required for trust, debugging, and future incident review.

---

## 17. Testing Requirements

The rule engine must have a dedicated test matrix.

### 17.1 Unit tests

- static drawdown calculations
- trailing drawdown calculations
- daily floor calculations
- full and fractional lives calculations
- minimum day progress
- payout readiness
- consistency thresholds
- manual pause behavior
- mode precedence

### 17.2 Scenario tests

- fresh Step 1 account
- Step 2 near target
- funded account close to payout
- account with 0.8 effective lives
- account halted by daily limit but not max limit
- account in off-rotation week
- payout-ready account with refund pending
- simulated one-loss transition into Recovery
- simulated one-win transition into Payout Protection

### 17.3 Edge tests

- exact value on floor
- exact value one cent above floor
- exact value one cent below floor
- zero trades recorded
- rule profile partially missing
- stale daily start value

---

## 18. Implementation Guidance

Suggested directory structure:

```text
lib/
  rules/
    engine.ts
    types.ts
    calculators.ts
    restrictions.ts
    modes.ts
    permissions.ts
    warnings.ts
    recommendations.ts
    simulation.ts
    test-fixtures/
```

### 18.1 Separation expectations

- `calculators.ts` handles threshold and lives math
- `restrictions.ts` detects hard and soft restriction states
- `modes.ts` applies precedence rules
- `permissions.ts` converts mode to allowed actions
- `warnings.ts` produces structured warnings
- `recommendations.ts` returns next best action
- `simulation.ts` wraps hypothetical evaluation using the same engine

---

## 19. Non-Negotiable Rules for Engineers

1. No account-state math may be hard-coded inside React components.
2. No dashboard widget may invent its own “quick logic.”
3. No simulation path may use different calculations than live evaluation.
4. Any new rule must be added to the engine contract and tested.
5. Any manual override must be visible and auditable.
6. If two rules conflict, the more restrictive safe behavior wins unless doctrine explicitly says otherwise.

---

## 20. Definition of Done

The rule engine is considered production-ready when:

- it can fully evaluate seeded fleets with multiple firms and phases
- all account detail screens use engine outputs rather than duplicated logic
- simulation and live evaluation match in method
- mode assignment is deterministic
- warnings are structured and explainable
- all critical paths have automated tests
- missing data produces safe degraded behavior
- every major operator action can be traced back to an evaluation result

---

## 21. Final Standard

Veradmin’s rule engine must feel like a trustworthy tactical analyst living beneath the interface.

It should not merely report balances.
It should interpret survivability, restrictions, and permissions with precision.
It should reduce emotional ambiguity.
It should make the allowed action obvious.

If the rule engine becomes strong enough that the operator trusts it before trusting their own impulse, then this document has been implemented correctly.
