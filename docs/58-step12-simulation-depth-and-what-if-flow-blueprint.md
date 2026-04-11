# Step 12 â€” Simulation Depth and What-If Flow Blueprint

Version: 1.0
Status: Step 12 complete
Scope: Deeper what-if flows, short-sequence simulation, and bounded fleet planning
Canonical inputs: `21-simulation-and-what-if-engine-spec.md`, `19-roadmap-and-post-v1-evolution.md`, `25-ai-assistance-boundaries-and-future-integration.md`

## 1. Step 12 intent

This blueprint defines how Veradmin deepens simulation after the daily-driver core is already stable.

It does **not** invent a second rule model.
It does **not** convert simulation into market prediction.
It does **not** allow hypothetical state to leak into live truth.

## 2. Frozen decisions

### 2.1 Same engine, deeper surface
Simulation must continue using the same deterministic evaluation principles as live account state.

### 2.2 Short-horizon value remains first
The most important questions remain:
- one more loss,
- one more win,
- one custom result,
- one payout/admin action,
- one pause/resume decision,
- one daily reset.

### 2.3 Multi-step sequences are bounded
Recommended first ceiling:
- 2 to 5 explicit steps.

### 2.4 Policy and administrative actions belong in simulation
Simulation should cover:
- payout request
- payout received
- pause
- resume
- daily reset

### 2.5 Before/after comparison is mandatory
The operator should immediately understand:
- what changed,
- what stayed the same,
- why the change happened,
- and what the next protective action may be.

### 2.6 Fleet planning simulation remains bounded
Allowed future uses:
- payout timing,
- rotation timing,
- pause / protect plans,
- clustered operational load.

## 3. Primary surface order

1. current state baseline
2. action type selector
3. assumptions panel
4. single-step or sequence builder
5. before/after comparison
6. explanation lane
7. step-by-step transition table

## 4. Frozen simulation action set

### 4.1 Trade-result actions
- standard win
- standard loss
- custom trade result

### 4.2 Policy/admin actions
- payout request
- payout received
- pause account
- resume account
- daily reset

## 5. Output contract

Simulation should return or display:
- resulting mode
- resulting tradable status
- resulting effective lives
- resulting payout-readiness state
- resulting alerts or warnings
- resulting restrictions or permissions
- resulting next recommended action
- explanation summary

For sequences, also show:
- per-step transitions,
- intermediate state,
- final state summary.

## 6. Sequence rules

- steps are explicit and ordered,
- the engine re-evaluates after every step,
- intermediate state stays visible,
- assumptions stay inspectable.

## 7. Guardrails

- simulation remains consequence modeling, not prediction,
- simulation never mutates live state silently,
- degraded simulation must not be confused with degraded live tactical truth.

## 8. Definition of done

This layer is satisfied when:
1. single-step and short-sequence scenarios are both clearly defined,
2. before/after deltas are easy to inspect,
3. policy/admin actions are modeled honestly,
4. fleet what-if stays bounded and explainable,
5. hypothetical state never mutates live truth.