# Veradmin Rule Evaluation Order

Version: 1.0  
Status: Active  
Owner: Architecture / Rule Engine / Product / QA  
Applies To: Deterministic account evaluation, rule engine execution order, simulation consistency, alert derivation, and explanation logic

---

## 1. Purpose of This Document

This document defines the canonical rule-evaluation order for Veradmin.

The product’s outputs must be deterministic and consistent across Dashboard, Account Detail, Alerts, Payouts, Calendar, Simulation, Reporting, and future explanation layers. That only happens if Veradmin has a fixed, explicit rule-evaluation sequence.

---

## 2. Canonical Ordered Evaluation Steps

### Step 1: Validate account integrity
Confirm the account has the minimum data required for trustworthy evaluation.

Examples:
- account exists
- lifecycle stage known
- assigned rule profile exists
- critical balance/reference fields present
- no impossible or contradictory values

### Step 2: Resolve governing lifecycle stage
Determine the lifecycle stage such as Draft, Evaluation / Step 1, Evaluation / Step 2, Funded / Active, Funded / Payout Active, Paused / Inactive, Breached / Failed, or Retired / Archived.

### Step 3: Resolve governing rule profile and applicable overlays
Determine:
- active firm rule profile
- active profile version
- applicable operator overlays
- whether overlays are allowed
- whether profile state is invalid or stale

### Step 4: Resolve broad activity eligibility
Catch high-level participation constraints early, such as archived, paused, invalid-profile, or terminal lifecycle states.

### Step 5: Resolve baseline monetary/risk references
Determine:
- starting balance
- current balance
- peak balance if relevant
- daily start balance if relevant
- standardized risk basis
- payout-related dates if needed

### Step 6: Compute hard floor
Determine the hard operating floor under the governing profile.

### Step 7: Compute daily floor
Determine the current daily or short-horizon operating restriction floor.

### Step 8: Resolve effective floor dominance
Determine which floor is tighter and which one currently dominates tactical behavior.

### Step 9: Compute lives and fractional lives
Translate raw monetary space into operational survivability language.

### Step 10: Evaluate progression and stage conditions
Determine:
- target progress
- evaluation progression
- minimum trading day status
- stage completion state

### Step 11: Evaluate payout state
Determine:
- payout relevance
- payout readiness
- payout blockers
- payout-window status
- payout protection relevance

### Step 12: Resolve terminal failure conditions
Determine whether the account should now be considered Breached / Failed.

### Step 13: Resolve non-terminal restriction states
Determine restrictions such as:
- daily restriction active
- full-size not allowed
- payout-sensitive protection trigger
- pause or cooldown influence
- active news/time restriction if supported

### Step 14: Resolve dominant tactical mode
Assign the primary mode: Attack, Preservation, Recovery, Payout Protection, Cooldown, Stopped, or Breached.

### Step 15: Resolve permissions
Determine explicitly:
- tradable or not
- full-size allowed or not
- fractional-only or not
- payout request allowed or not

### Step 16: Derive alerts
Generate or refresh alerts based on terminal failure, stop state, threshold proximity, payout/admin timing, news windows, integrity issues, or meaningful state changes.

### Step 17: Generate next recommended action
Determine the tactical or operational next step.

Examples:
- tradable candidate
- protect and do not push
- stop until reset
- request payout
- review blocker
- inspect timeline

### Step 18: Generate explanation package
Produce explanation-ready outputs such as:
- why-this-state reasons
- dominant restriction reason
- why payout is blocked
- why mode changed
- why the account is or is not tradable
- before/after deltas for simulation

---

## 3. Evaluation Order Summary Table

1. validate account integrity  
2. resolve lifecycle  
3. resolve profile and overlays  
4. resolve broad activity eligibility  
5. resolve baseline references  
6. compute hard floor  
7. compute daily floor  
8. resolve effective floor dominance  
9. compute lives  
10. evaluate progression/stage conditions  
11. evaluate payout state  
12. resolve terminal failure  
13. resolve non-terminal restrictions  
14. resolve dominant mode  
15. resolve permissions  
16. derive alerts  
17. derive next recommended action  
18. build explanation outputs  

---

## 4. Why This Order Matters

This order prevents common mistakes such as:
- assigning mode before knowing payout state
- generating alerts before permissions are resolved
- computing permissions before terminal failure is known
- calculating lives from inconsistent references
- letting screens decide their own precedence

It also ensures simulation can reuse the same engine path.

---

## 5. Definition of Done

This specification is satisfied when:
1. The rule engine has a fixed, documented order.
2. Contributors can see why each step comes where it does.
3. Different screens no longer need to guess or duplicate logic.
4. Simulation can reuse the same order safely.
5. Alert, mode, and permission outputs come from the same deterministic path.
6. QA can validate engine behavior against the documented sequence.
7. The product has one canonical operational truth pipeline.
