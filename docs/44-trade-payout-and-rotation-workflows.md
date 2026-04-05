# Veradmin Trade, Payout, and Rotation Workflows

Version: 1.0  
Status: Active  
Owner: Product / Operations / Engineering / UX  
Applies To: Structured event flows, action-to-state transitions, payout management flow, rotation planning flow, and workflow-level implementation alignment

---

## 1. Purpose of This Document

This document defines the three most important operational workflows that sit underneath daily use:

1. trade logging workflow
2. payout workflow
3. calendar/rotation workflow

These workflows already have supporting specs across the repo, but Step 1 requires them to be formalized as explicit operational sequences.

---

# Part I — Trade Logging Workflow

## 2. Trade Logging Workflow Purpose

Trade logging is where the user records a meaningful trading event and expects Veradmin to update the account’s operational truth immediately and safely.

---

## 3. Canonical Trade Logging Workflow

### Step 1: User initiates log action
Entry points may include:
- Dashboard quick action
- Account Detail action area
- Journal screen

Supported actions:
- Log Win
- Log Loss
- Log Custom

### Step 2: Product opens structured log flow
For standard win/loss:
- minimal structured input
- prefilled defaults where safe

For custom:
- richer structured form

### Step 3: Product validates input
Checks may include:
- account exists
- event type valid
- required values present
- numeric values sane
- profile and lifecycle context still valid

### Step 4: Product persists the event
The structured trade event is written to durable local state.

### Step 5: Product triggers rule re-evaluation
The affected account is re-evaluated through the canonical rule order.

This may change:
- lives
- restrictions
- permissions
- mode
- payout readiness
- alerts
- next action

### Step 6: Product records any derived system events
Examples:
- mode changed
- account stopped
- payout-readiness achieved
- alert triggered
- alert resolved

### Step 7: Product refreshes affected views
At minimum:
- Account Detail
- Dashboard summaries
- relevant alert state
- journal/timeline

### Step 8: Product shows post-action consequence summary
The user should see:
- what changed
- why it changed
- what the new posture is
- what they should do next

---

## 4. Trade Logging Workflow Outputs

The workflow should produce:
- persisted trade event
- refreshed derived account state
- updated timeline entry
- updated mission/dashboard state if relevant
- updated alerts if relevant
- visible explanation of consequence

---

# Part II — Payout Workflow

## 5. Payout Workflow Purpose

The payout workflow governs the lifecycle of payout-related business actions for an account.

It must support:
- readiness review
- blocker explanation
- request action
- pending tracking
- receipt confirmation
- refund/admin follow-through

---

## 6. Canonical Payout Workflow

### Step 1: Product evaluates payout readiness
Using current state, lifecycle, and profile, determine:
- ready now
- approaching readiness
- blocked/not ready
- pending
- received

### Step 2: User reviews payout context
Entry points:
- Dashboard mission item
- Payouts screen
- Account Detail payout section
- Alert deep-link

### Step 3: User initiates payout request action
If appropriate, the operator chooses Request Payout.

### Step 4: Product validates request context
Checks may include:
- account eligible
- no blocking condition remains
- payout not already pending if invalid
- state still current

### Step 5: Product persists payout request event
The request is recorded in structured business history.

### Step 6: Product refreshes payout state
Views update to show:
- request pending
- expected arrival if tracked
- admin/refund tasks if relevant
- changed mission/alert posture if relevant

### Step 7: User later marks payout received
The workflow supports receipt confirmation.

### Step 8: Product persists receipt event
The receipt is stored and linked to account and payout history.

### Step 9: Refund/admin follow-up is managed
If relevant, continue into:
- refund requested
- refund received
- admin issue flagged/resolved

### Step 10: Product updates all related surfaces
Affected surfaces may include:
- Dashboard
- Payouts
- Account Detail
- Journal
- Alerts
- Calendar if timing significance changes

---

## 7. Payout Workflow Outputs

The workflow should produce:
- payout-readiness explanation
- payout request event
- payout receipt event if applicable
- refund/admin event chain where needed
- updated business summaries
- updated dashboard and alert posture

---

# Part III — Calendar and Rotation Workflow

## 8. Rotation Workflow Purpose

The rotation workflow governs how the operator plans and understands:
- active weeks
- rest weeks
- evaluation focus
- payout clustering
- future operating load

This workflow is about strategic rhythm, not just date display.

---

## 9. Canonical Rotation Workflow

### Step 1: Product builds the current and future period model
Using account state, lifecycle, payout context, and any defined rotation overlays.

### Step 2: Product presents the selected time range
Usually:
- current week
- next week
- multi-week planning window
- month view

### Step 3: User reviews account lanes and future markers
The screen should make visible:
- active periods
- rest periods
- payout windows
- admin tasks
- evaluation focus zones
- clustering problems

### Step 4: User inspects a period or account
Detail panel reveals:
- why this period is active/resting
- related account context
- related payout context
- related alerts if relevant

### Step 5: User optionally applies or records planning action
Examples:
- manual pause or override
- planning note
- review handoff to Account Detail or Payouts

### Step 6: Product persists any structural planning event
If the operator changes something meaningful, it must be recorded.

### Step 7: Product refreshes affected views
Affected surfaces may include:
- Dashboard mission items
- Calendar summaries
- Account Detail context
- Alerts if future or current attention changes
- Payout context if timing implications change

---

## 10. Shared Workflow Rules

Across trade, payout, and rotation workflows:
- structured input beats ad hoc notes
- persistence happens before claiming success
- rule re-evaluation happens after meaningful state changes
- derived events and alerts are part of the workflow, not side trivia
- affected screens must refresh coherently
- explanations must show what changed and why

---

## 11. Definition of Done

This specification is satisfied when:
1. The trade workflow is explicit, safe, and consequence-aware.
2. The payout workflow captures business actions clearly and structurally.
3. The rotation workflow supports strategic time-based planning.
4. Persistence, re-evaluation, and UI refresh happen in the right order.
5. Journal/history captures the important outcomes of all three workflows.
6. Errors and failed writes remain visible and trustworthy.
7. Contributors can implement and QA these flows without ambiguity.
