# Veradmin Daily Operator Workflow

Version: 1.0  
Status: Active  
Owner: Product / UX / Operations / Engineering  
Applies To: Daily use loop, dashboard-first product behavior, morning flow, mid-session use, post-event checks, and end-of-day operating discipline

---

## 1. Purpose of This Document

This document defines the canonical daily operator workflow for Veradmin.

Veradmin is meant to be opened and used like a command terminal for a prop-firm fleet. That means the product needs a clear day-to-day operating flow that reflects real user behavior, organizes screen priorities, and anchors the build around practical use instead of abstract features.

---

## 2. High-Level Daily Workflow

The canonical daily flow is:

1. open Veradmin
2. orient using the Command Center
3. inspect critical alerts and today’s mission
4. identify tradable or priority accounts
5. inspect a chosen account in detail
6. act or log an event
7. review resulting state changes
8. inspect business/admin items if relevant
9. review future rhythm if needed
10. finish with end-of-day state awareness

This is the product’s primary behavioral loop in user terms.

---

## 3. Stage 1: Open and Orient

### Goal
Get immediate clarity about the fleet.

### User action
Open Veradmin and land on the Dashboard / Command Center.

### Product responsibilities
- show Today’s Mission
- show Fleet Health Strip
- show critical alerts
- show account grid in useful priority order
- show relevant payout/admin signals if needed today

### Success condition
The user understands what matters today in under a minute, ideally in seconds.

---

## 4. Stage 2: Attention Triage

### Goal
Determine whether any urgent condition should override normal operation.

### User action
Inspect:
- Critical alerts
- High-priority alerts
- top mission items

### Product responsibilities
- make severity obvious
- distinguish tactical danger from administrative reminders
- provide quick drill-down paths to relevant screens/entities

### Success condition
The user knows whether to stop and inspect, handle a task now, proceed to account selection, or defer non-urgent items.

---

## 5. Stage 3: Account Prioritization

### Goal
Identify which account(s) deserve focus.

### User action
Review:
- account cards
- mission panel recommendations
- relevant filters
- alert-linked account items

### Product responsibilities
- clearly distinguish tradable vs restricted vs stopped
- show lives and key next milestone
- expose useful quick actions
- allow direct transition into Account Detail

### Success condition
The user can choose a candidate account without guessing blindly.

---

## 6. Stage 4: Focused Account Inspection

### Goal
Validate whether the chosen account should actually be used.

### User action
Open Account Detail and inspect:
- current state summary
- permissions and restrictions
- why-this-state explanation
- payout/admin context if relevant
- simulation if needed

### Product responsibilities
- explain current tactical posture clearly
- show what is allowed
- show what is not allowed
- provide a safe path into simulation and event logging

### Success condition
The user either confirms the account as suitable or rejects it and returns to fleet context with clarity.

---

## 7. Stage 5: Action or Event Logging

### Goal
Capture what happened and keep the product’s memory and state aligned.

### User action
Use:
- Log Win
- Log Loss
- Log Custom
- Add Note
- Request Payout
- Pause / Resume

### Product responsibilities
- validate input
- persist event
- recompute state
- refresh dashboard/account context
- show what changed

### Success condition
The user trusts that the event was recorded and the system state now reflects it.

---

## 8. Stage 6: Post-Action Consequence Review

### Goal
Verify the operational impact of what just happened.

### User action
Review:
- updated lives
- updated mode
- tradable status
- alert changes
- next recommended action

### Product responsibilities
- make state changes visible immediately
- explain any new restriction or mode shift
- support drill-down into Journal or simulation if needed

### Success condition
The user understands the new state without mentally reconstructing it from raw values.

---

## 9. Stage 7: Mid-Day or Mid-Session Re-Check

### Goal
Re-orient after one or more actions.

### Product responsibilities
- refresh mission priorities
- update alert posture
- re-order account priorities if needed
- preserve continuity rather than forcing re-analysis from scratch

---

## 10. Stage 8: Business/Admin Check

### Goal
Handle or review non-trade items that affect the fleet today.

### User action
Open:
- Payouts screen
- Alerts screen
- Settings/Backup if needed
- Journal for history confirmation if needed

Typical reasons:
- payout request due
- refund task unresolved
- admin reminder present
- export or backup desired

---

## 11. Stage 9: Future Planning Check

### Goal
Understand near-future rhythm and load when relevant.

### User action
Open Calendar / Rotation screen.

Possible reasons:
- too many active accounts this week
- next payout cluster needs review
- rest periods or rotation shifts matter
- evaluation focus planning needed

---

## 12. Stage 10: End-of-Day Review

### Goal
End the operating day with clarity about what changed and what matters next.

### User action
Return to Dashboard and/or Journal.

Review:
- what changed today
- which accounts moved modes
- which alerts remain
- what tomorrow may require
- whether payouts/admin tasks remain unresolved

---

## 13. Daily Workflow Summary

1. Open app  
2. Read mission and critical alerts  
3. Identify priority accounts  
4. Inspect chosen account  
5. Log event / act  
6. Review state change  
7. Re-orient at fleet level  
8. Handle payout/admin tasks if relevant  
9. Review near-future rhythm if relevant  
10. End day with final state awareness  

---

## 14. Definition of Done

This specification is satisfied when:
1. The product supports a clear daily rhythm from opening to end-of-day review.
2. The Dashboard acts as true mission control.
3. Account selection and inspection feel efficient.
4. Event logging and state recompute feel immediate and trustworthy.
5. Business/admin checks fit into the day without derailing tactical use.
6. Near-future planning has a clear place in the workflow.
7. The product genuinely supports disciplined daily operation.
