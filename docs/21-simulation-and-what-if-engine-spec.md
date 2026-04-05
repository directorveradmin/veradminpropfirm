# Veradmin Simulation and What-If Engine Specification

Version: 1.0  
Status: Active  
Owner: Product / Rule Engine / UX / Engineering  
Applies To: Pre-trade simulation, scenario modeling, what-if analysis, decision support, and future state projection

---

## 1. Purpose of This Document

This document defines the simulation and what-if engine for Veradmin.

Simulation is one of the clearest ways Veradmin moves from being a tracker to being a tactical control system.
The operator does not only need to know what the current state is.
They also need to understand what likely state follows from the next action.

This document exists so that simulation is:
- deterministic,
- consistent with the real rule engine,
- explainable,
- operationally useful,
- and integrated into the product’s decision-support philosophy.

The simulation layer must never become a fantasy toy.
Its purpose is disciplined foresight.

---

## 2. Simulation Mission

The simulation system must help answer:

1. What happens to this account if I take one more loss?
2. What happens if I take one more win?
3. What happens if I log a custom outcome?
4. What mode will the account enter after the next event?
5. Will full-size remain allowed?
6. Will payout readiness be reached, lost, or preserved?
7. How would a sequence of events affect the fleet?
8. What is the safest next action under current constraints?

The system should allow the operator to see consequences before they commit.

---

## 3. Simulation Principles

### 3.1 Same engine, different mode

Simulation must use the same core logic model as real evaluation.
It should not invent a second interpretation system.

### 3.2 Explain outcomes, not just outputs

The user should not only see “mode changes to Preservation.”
They should see why.

### 3.3 Keep it practical

Simulation should focus on realistic short-horizon operational scenarios first.

### 3.4 Avoid false certainty

Simulation models configured rule consequences, not market prediction.
It should remain honest about that.

### 3.5 Fast enough to influence action

Simulation must be quick and friction-light enough to be used before or between trades.

---

## 4. Scope of v1 Simulation

Veradmin v1 simulation should prioritize short-horizon tactical questions.

Recommended v1 simulation scope:
- single next win
- single next loss
- single custom event
- short sequence of events
- payout request effect
- pause/resume effect
- daily reset effect where relevant

Deeper forecasting belongs later.
The first job is helping with next-action clarity.

---

## 5. Types of Simulation

### 5.1 Single-step simulation

Most important v1 use case.

Examples:
- simulate one loss
- simulate one win
- simulate one custom trade result
- simulate payout request
- simulate pause

### 5.2 Multi-step sequence simulation

Useful for reviewing short hypothetical paths.

Examples:
- loss -> loss
- win -> payout request
- loss -> fractional custom gain
- win -> win -> payout-ready

### 5.3 Fleet-level simulation

Useful later in v1 or post-v1 for business and rhythm planning.

Examples:
- rotate three funded accounts next week
- pause two accounts under preservation logic
- stagger payout requests differently
- compare two near-term operating plans

Fleet simulation should remain constrained and interpretable.

---

## 6. Simulation Inputs

The simulation engine should receive:

- current account state snapshot
- assigned rule profile
- relevant operator overlays
- chosen hypothetical action(s)
- simulation timestamp or day context
- optional baseline assumptions if custom event details matter

For fleet simulation, it may also receive:
- multiple account states
- calendar window
- rotation assumptions
- payout actions

Inputs must be explicit.
The operator should not be left guessing what assumptions the simulation used.

---

## 7. Simulation Actions for v1

Recommended core simulation actions:
- standard win
- standard loss
- custom trade result
- payout request
- payout received
- pause account
- resume account
- daily reset
- note-only event if needed for completeness, though it should not alter core state

Each action should clearly define:
- what changes in stored/derived terms
- whether it affects account balance
- whether it affects payout readiness
- whether it affects mode assignment
- whether it affects alert generation

---

## 8. Simulation Outputs

The engine should return at least:

- resulting mode
- resulting tradable status
- resulting lives remaining
- resulting fractional lives
- resulting max safe lot size
- resulting payout readiness state
- resulting alerts or warnings
- resulting next recommended action
- explanation summary

For multi-step simulation, the engine should also return:
- step-by-step transitions
- branching points if relevant
- final state summary

---

## 9. Explanation Requirements

Simulation is only useful if it explains itself.

Examples of good explanation:
- “A full loss would reduce effective lives below the current preservation threshold, so the account would shift into Preservation Mode.”
- “A standard win would satisfy the configured payout readiness conditions under the current profile.”
- “A second loss in sequence would remove full-size permissions even though the account remains technically alive.”

The product should not output silent state transitions.

---

## 10. Simulation UX Requirements

The simulation surface should feel fast and focused.

Recommended entry points:
- account view
- dashboard quick action
- pre-trade advisory panel

Recommended UX structure:
1. current state summary
2. simulation action selector
3. assumptions if needed
4. result preview
5. explanation
6. optional compare against current state

The operator should be able to understand the delta between now and simulated next state immediately.

---

## 11. Compare View

Where possible, simulation should emphasize before/after comparison.

Useful comparisons:
- lives now vs simulated
- mode now vs simulated
- tradable state now vs simulated
- payout status now vs simulated
- warning state now vs simulated

This helps the operator focus on consequences rather than raw outputs.

---

## 12. Sequence Simulation Rules

Multi-step simulation should remain disciplined.

Rules:
- steps should be explicit and ordered
- intermediate state should be visible
- the engine should re-evaluate after each step
- explanations should reflect changing conditions
- assumptions should not be silently carried forward without clarity

This ensures simulation remains trustworthy rather than magical.

---

## 13. Relationship to Pre-Trade Advisory

Simulation is closely related to pre-trade advisory but not identical.

Pre-trade advisory answers:
- what is allowed now
- what is recommended now
- what constraints are active now

Simulation answers:
- what changes if a chosen action happens

These surfaces may be connected in the UI, but they should remain conceptually distinct.

---

## 14. Fleet-Level What-If Use Cases

Later or advanced v1 use cases may include:
- “If I protect these two accounts now, how many payout-ready accounts remain next week?”
- “If I rotate Account A off and Account B on, how does next week’s load change?”
- “If I request payouts on these accounts now, what does near-term cash flow look like?”

Fleet simulation should be used for planning, not decoration.

---

## 15. Simulation Data Integrity

Simulation must not mutate real state unless the user explicitly commits a real action.

Rules:
- simulated results are preview-only
- preview state must remain clearly marked as hypothetical
- no silent writes to the live account state
- clear exit or dismiss behavior
- no confusion between “preview” and “apply”

This distinction is critical.

---

## 16. Simulation Anti-Patterns to Avoid

Avoid:
- using a separate logic model from the real engine
- presenting simulation as prediction rather than rule consequence modeling
- mutating live state accidentally
- hiding assumptions
- making simulation visually flashy but explanatorily weak
- offering too many exotic scenario types before core short-horizon use cases are solid

---

## 17. Definition of Done for Simulation and What-If Engine

This spec is satisfied when:

1. Single-step what-if simulation works for core actions.
2. The same logic principles govern both live evaluation and simulation.
3. Results are explained clearly and honestly.
4. Before/after comparison is easy to understand.
5. Simulation is useful enough to influence real pre-trade decisions.
6. Multi-step simulation remains disciplined and interpretable.
7. Hypothetical state never silently corrupts live state.

---

## 18. Future Considerations

Potential later additions:
- branch comparison
- saved simulation presets
- scenario templates by firm/stage
- fleet optimization scenarios
- AI-assisted scenario explanation
- “best protective move” comparison views

These are valuable later, but v1 must first make short-horizon tactical simulation trustworthy and fast.
