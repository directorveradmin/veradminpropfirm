# Veradmin Account Detail Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Rule Engine  
Applies To: Single-account operational view, detail layout, state explanation, event history, permissions, and account-level tactical decision support

---

## 1. Purpose of This Document

This document defines the Account Detail screen in detail.

The Account Detail screen is the second most important screen in Veradmin after the Command Center.
It is where the user drills down from fleet-level awareness into one account’s full operational truth.

This screen must not merely dump raw fields.
It must explain the account as an operating entity:
- what it is
- what state it is in
- what rules govern it
- what restrictions are active
- what has happened recently
- and what the user can safely do next

This document exists so the Account Detail screen becomes a trustworthy tactical view, not a data clutter page.

---

## 2. Screen Mission

The Account Detail screen must answer:

1. What is the account’s current operational state?
2. Why is it in that state?
3. What is currently allowed?
4. What is currently restricted?
5. What changed recently?
6. What should happen next?
7. Which actions can the operator take right now?

If the Command Center says “look here,” the Account Detail screen must resolve the uncertainty fully.

---

## 3. Primary User Scenarios

This screen must support at least:

### 3.1 Focused pre-trade review
The user wants to understand whether this specific account should be used now.

### 3.2 Post-trade consequence review
The user has just logged an event and wants to see how state changed.

### 3.3 Restriction explanation
The user needs to know why the account is limited, stopped, or protected.

### 3.4 Payout readiness review
The user needs to know whether the account is payout-ready and what blockers remain.

### 3.5 Timeline inspection
The user wants to understand what led to the current state.

### 3.6 Tactical simulation entry
The user wants to test what happens after the next possible event.

---

## 4. Screen Structure

Recommended top-to-bottom structure:

1. Account header
2. Current State Summary
3. Permissions and Restrictions
4. Why This State / Rule Explanation
5. Tactical Actions
6. Journal and Timeline
7. Payout and Admin Context
8. Secondary metadata and low-frequency details

This order is deliberate.
The current operational truth should appear before historical or administrative depth.

---

## 5. Account Header

The header should identify the account clearly and immediately.

Recommended contents:
- account label
- firm
- lifecycle stage
- current mode
- tradable/restricted/stopped badge
- key alert badge if present
- optional profile reference
- compact quick actions

The header should feel stable and strong, not overloaded.

---

## 6. Current State Summary Panel

This is the core account snapshot.

Recommended contents:
- starting balance
- current balance
- peak balance if relevant
- hard breach floor
- daily restriction floor
- lives remaining
- fractional lives remaining
- max safe lot size now
- risk severity
- next recommended action

This panel should be visually prominent and easy to scan.

It should not force the user to compute what the account’s condition means.
It should translate condition into readable operational truth.

---

## 7. Permissions and Restrictions Panel

This panel should answer:
- can I trade this account right now?
- can I use full size?
- am I restricted to fractional size?
- is payout protection active?
- is a daily restriction currently controlling behavior?
- is a news or overlay restriction active?
- is the account paused or stopped?

This panel must be explicit.
The user should not infer permissions from scattered numbers.

---

## 8. Why This State Panel

This is one of the most important trust-building panels in the product.

Purpose:
- explain why the current mode was assigned
- explain which conditions are currently dominant
- explain what event most recently changed state
- explain what future condition would change it again

Examples:
- “This account is in Preservation Mode because effective lives are below the configured protection threshold.”
- “Full-size risk is not allowed because the daily restriction is currently tighter than the hard account floor.”
- “Payout-readiness is blocked because minimum trading days have not yet been satisfied.”

This panel turns Veradmin from a calculator into an explainable operating system.

---

## 9. Tactical Actions Area

The Account Detail screen should give direct access to the account’s key actions.

Recommended actions:
- Log Win
- Log Loss
- Log Custom
- Add Note
- Request Payout
- Mark Payout Received
- Pause / Resume
- Open Simulation
- Open Full Journal
- Open Profile Summary if useful

Actions should be clearly grouped:
- trading/event actions
- payout/admin actions
- account-control actions

This helps reduce accidental misuse.

---

## 10. Journal and Timeline Panel

The account timeline should show the account’s recent operational story.

Recommended event types:
- trades
- custom outcomes
- notes
- payout actions
- refund tasks
- mode transitions
- restrictions triggered
- resets
- profile changes
- alert acknowledgments where relevant

The timeline should prioritize:
- recency
- readability
- event type clarity
- timestamp clarity
- quick drill-down into details

The user should be able to answer:
“How did this account get here?”

---

## 11. Payout and Admin Context

The Account Detail screen should include a dedicated area for payout and admin context.

Recommended contents:
- payout readiness status
- blockers if not ready
- next eligible payout date/window
- request status if already requested
- expected arrival or pending status
- refund status
- notes related to admin workflow

This keeps business logic visible without overwhelming the main tactical panels.

---

## 12. Simulation Entry Point

The screen should provide a clear route into simulation.

A good simulation entry should:
- start from the current account state
- make the before/after delta obvious
- allow quick testing of one win/loss or short sequence
- return to the live account view cleanly without confusion

Simulation should feel like an extension of account understanding, not a separate unrelated tool.

---

## 13. Secondary Metadata Area

Lower-priority information may appear in a less prominent section.

Examples:
- assigned rule profile and version
- account creation date
- last reset timestamp
- notes category summary
- export/account archive actions
- diagnostics summary where appropriate

This information matters, but should not push current tactical truth downward.

---

## 14. Layout Considerations

On wider desktop layouts, the screen may use columns.

Recommended pattern:
- left/main column for state, explanation, and actions
- right/supporting column for timeline, payout context, and metadata
- or vice versa depending on visual design

Regardless of layout, the reading order should still prioritize current state over administrative detail.

---

## 15. Refresh and Post-Action Behavior

After logging an event or taking another account action, the screen should refresh clearly.

Changes that should update visibly:
- mode
- lives
- tradable status
- next action
- alert state
- timeline
- payout/admin state if relevant

The user should not need to manually reload or mentally reconcile inconsistent panels.

---

## 16. Error and Degraded States

If the product cannot trust part of the account view, the screen must say so explicitly.

Examples:
- rule profile missing
- evaluation failed
- timeline partially unavailable
- payout state invalid
- post-migration uncertainty on historical records

The screen should make clear whether the account is still safe to interpret tactically or not.

---

## 17. Tone and Visual Feel

The Account Detail screen should feel:
- exact
- calm
- explanatory
- serious
- trustworthy

It should avoid feeling:
- dense for density’s sake
- over-tabbed
- chart-heavy
- jargon-heavy
- emotionally loaded

The screen should reward focused attention, not punish it.

---

## 18. Screen Anti-Patterns to Avoid

Avoid:
- dumping raw database fields without interpretation
- burying permissions and restrictions under the fold
- making the user infer mode from numbers alone
- hiding “why” explanations
- collapsing payout/admin context into generic notes only
- mixing high-priority current-state info with low-priority metadata
- making the timeline unreadable or over-compressed

---

## 19. Definition of Done for the Account Detail Screen

This spec is satisfied when:

1. The user can fully understand one account’s state from this screen.
2. The screen clearly explains what is allowed and why.
3. Current-state interpretation is visually prioritized.
4. Timeline and admin context are available without overpowering tactical content.
5. Actions are easy to access and grouped logically.
6. Post-action refresh makes changes obvious.
7. The screen feels like a trustworthy tactical dossier for one account.

---

## 20. Future Considerations

Potential later additions:
- compare this account with another account
- split history by category
- richer profile insight panel
- direct review summary generation
- extended simulation drawer
- printable/exportable account report

These are valuable later, but v1 must first make the Account Detail screen operationally excellent.
