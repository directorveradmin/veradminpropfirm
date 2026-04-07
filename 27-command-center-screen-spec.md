# Veradmin Command Center Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering  
Applies To: Dashboard home screen, fleet command center, mission panel, alert prioritization, account grid, and high-frequency operator workflow

---

## 1. Purpose of This Document

This document defines the Veradmin Command Center screen in detail.

The Command Center is the most important screen in the entire product.
It is the operating surface the user should trust every day before, during, and after trading activity.

This screen must not become:
- a generic dashboard,
- a chart collage,
- a summary toy,
- or a pretty spreadsheet.

It must function as mission control for the fleet.

This document exists so the screen is implemented with the right priority, interaction logic, hierarchy, and emotional tone.

---

## 2. Screen Mission

The Command Center must answer, in seconds:

1. What matters today?
2. Which accounts are currently tradable?
3. Which accounts require protection?
4. Which accounts are restricted or stopped?
5. Which actions need attention now?
6. What should the operator do next?

If the user opens Veradmin and still feels mentally scattered, the Command Center has failed.

---

## 3. Primary User Scenarios

The Command Center must support at least these high-frequency scenarios:

### 3.1 Morning opening check
The user launches Veradmin and orients for the day.

### 3.2 Pre-trade review
The user wants to know which accounts are operationally strongest or most appropriate.

### 3.3 Mid-session update
The user logs an event and returns to see what changed across the fleet.

### 3.4 Risk check
The user wants to identify accounts nearing critical thresholds.

### 3.5 Admin check
The user wants to spot payout, refund, alert, or rotation tasks requiring action.

### 3.6 End-of-day review
The user wants a fast sense of what changed and what tomorrow may require.

---

## 4. Screen Hierarchy

The Command Center should be structured from highest tactical importance to lower supporting information.

Recommended order:

1. Status and shell layer
2. Todayâ€™s Mission
3. Fleet Health Strip
4. Critical Alerts / Priority Warnings
5. Fleet Account Grid
6. Secondary operational summaries
7. Optional lower-priority review snippets

This order is deliberate.
Urgency and action should live above general metrics.

---

## 5. Top Shell Area

The top shell should remain compact and stable.

Recommended contents:
- page title or brand/title lockup
- current date
- quick global status indicators
- navigation context
- possible global search or quick command entry later
- unresolved critical item count if appropriate

This area should support orientation without competing with the mission panel.

---

## 6. Todayâ€™s Mission Panel

This is the single most important content block on the screen.

Purpose:
- summarize todayâ€™s operational posture
- present must-handle items
- reduce scanning effort
- direct the user toward the safest next actions

Recommended contents:
- top 3â€“6 mission items
- accounts to protect
- accounts currently prioritized
- news avoidance windows
- payout/admin tasks due
- critical restrictions or system caveats

This panel should read like a short mission briefing, not a paragraph-heavy explanation wall.

---

## 7. Fleet Health Strip

The Fleet Health Strip is the compact â€œstate of the fleetâ€ band.

Recommended metrics:
- total accounts
- tradable accounts
- restricted accounts
- stopped accounts
- payout-ready accounts
- accounts under defined lives threshold
- overall fleet health score

Rules:
- metrics should be scannable
- each metric may link to filtered views
- do not overload the strip with low-value numbers
- the strip should reinforce the mission panel, not duplicate it uselessly

---

## 8. Critical Alerts and Priority Warning Zone

This zone surfaces current operational threats or urgent reminders.

Examples:
- daily restriction triggered
- account at critical lives threshold
- payout request due now
- high-impact news window near
- restore or integrity issue
- unresolved refund task
- missing profile on active account

Rules:
- highest-severity alerts should appear first
- grouping is allowed, but not at the cost of hiding urgency
- the user should be able to click through to the relevant detail
- critical warnings should not be visually buried below neutral summaries

---

## 9. Fleet Account Grid

This is the main working body of the Command Center.

The grid should:
- present all active relevant accounts
- support meaningful scanning
- allow drill-down into account detail
- support quick actions
- support filtering/grouping without losing clarity

Recommended default groupings:
- by mode
- by stage
- by firm
- or by urgency score

Recommended default sort:
- most urgent / most decision-relevant first

The grid must feel like a command surface, not a list of tiny unreadable cards.

---

## 10. Account Card Requirements Within the Command Center

Each card in the Command Center should show at minimum:
- account label
- firm or group label
- stage
- mode
- tradable/restricted/stopped state
- lives remaining
- key next milestone
- quick warning badge(s)
- one or two quick actions

Optional expanded quick view may also include:
- current balance
- hard breach floor
- daily restriction summary
- payout-readiness indicator
- max lot size
- most recent meaningful event

Cards should prioritize clarity and scannability over density.

---

## 11. Secondary Operational Summary Area

Below the main fleet grid or alongside it in wider layouts, the screen may include:
- upcoming payouts
- near-term rotation changes
- recent event summary
- unresolved admin tasks
- low-priority reminders

These elements are useful, but should not compete with tactical decision priority.

---

## 12. Filtering and View Controls

The Command Center should support lightweight, meaningful filters.

Recommended filters:
- all accounts
- tradable only
- payout-ready only
- near-risk only
- by firm
- by stage
- by mode

Rules:
- filters should be visible
- filter state should be obvious
- filtered views should still feel like the Command Center, not like a separate data app
- filters should help attention, not clutter it

---

## 13. Quick Actions on the Command Center

Recommended quick actions:
- open account
- log win
- log loss
- log custom event
- add note
- request payout
- pause/resume account
- open simulation

These should be available without forcing deep navigation, but must still respect confirmation and safety rules where needed.

---

## 14. Refresh and State Update Behavior

After any meaningful action, the Command Center should update clearly and quickly.

Examples of changes that must update:
- lives changes
- mode changes
- tradable state changes
- alert changes
- payout status changes
- mission panel priorities
- fleet health metrics

The user should feel that the screen is the living command surface of the system.

---

## 15. Empty and Quiet States

The Command Center must also work on quiet days.

Examples:
- no critical alerts
- few accounts
- no payouts due
- no news restrictions
- one-account fleet
- demo/onboarding view

Quiet states should feel composed, not empty or broken.

The screen should still answer:
â€œWhat matters today?â€ even if the answer is â€œnothing urgent.â€

---

## 16. Error and Degraded States

If the screen cannot fully trust its own data, it must say so.

Examples:
- some accounts failed to load
- mission panel unavailable
- rule evaluation unavailable for a subset of accounts
- alert service degraded
- restore or migration integrity uncertainty

The Command Center must never pretend to be authoritative if it cannot verify critical information.

---

## 17. Tone and Visual Feel

The Command Center should feel:
- calm
- sharp
- premium
- serious
- actionable
- low-noise

It should not feel:
- flashy
- crypto-like
- overcrowded
- gamified
- overly analytical at the expense of action

This is mission control, not entertainment.

---

## 18. Screen Anti-Patterns to Avoid

Avoid:
- putting charts above todayâ€™s tactical priorities
- burying critical warnings below the fold
- making every metric equally prominent
- overloading cards with tiny unreadable values
- creating multiple competing summary areas
- requiring many clicks to determine which accounts are tradable
- turning the Command Center into a generic BI dashboard

---

## 19. Definition of Done for the Command Center Screen

This spec is satisfied when:

1. The user can open Veradmin and orient in seconds.
2. The screen clearly identifies what matters today.
3. Tradable, protected, restricted, and stopped accounts are easy to distinguish.
4. Critical warnings are impossible to miss.
5. The fleet grid feels useful and actionable.
6. Quick actions reduce friction without weakening safety.
7. The Command Center genuinely feels like mission control for the fleet.

---

## 20. Future Considerations

Potential later additions:
- command palette integration
- configurable mission modules
- saved filtered views
- second-screen summary mode
- richer fleet comparison widgets

These are valuable later, but v1 must first make the Command Center tactically excellent.
