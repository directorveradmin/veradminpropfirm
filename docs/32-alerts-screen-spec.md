# Veradmin Alerts Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Operations  
Applies To: Alerts screen, alert browsing, severity grouping, alert detail, acknowledgment flows, and attention management across the fleet

---

## 1. Purpose of This Document

This document defines the Alerts screen in detail.

The Alerts screen is the focused attention-management surface of Veradmin.
It is where the operator can review, sort, understand, acknowledge, and resolve the warnings, reminders, and critical signals that the rest of the system surfaces across tactical and administrative flows.

This document exists so the Alerts screen becomes:
- a true attention-control tool,
- a place where urgency is clearly organized,
- a place where the operator can act on what matters,
- and a trustworthy companion to the Command Center rather than a noisy duplicate.

The Alerts screen must not become:
- a dumping ground for every low-value notification,
- an unreadable inbox,
- or a wall of undifferentiated warning colors.

---

## 2. Screen Mission

The Alerts screen must answer:

1. What needs attention right now?
2. What is critical versus merely useful to remember?
3. Which alerts affect tactical decisions today?
4. Which alerts affect business/admin follow-through?
5. What has been resolved, and what remains open?
6. What action should the operator take next for a given alert?

The purpose of this screen is not volume.
The purpose is structured attention.

---

## 3. Primary User Scenarios

The Alerts screen must support at least:

### 3.1 Critical alert review
The user wants to inspect the most urgent issues first.

### 3.2 Tactical filtering
The user wants to see only account/risk-related warnings.

### 3.3 Administrative follow-up
The user wants to review payout/refund/admin reminders.

### 3.4 Resolution workflow
The user wants to acknowledge, resolve, or review the status of alerts.

### 3.5 Audit of recent warnings
The user wants to see what recently triggered across the fleet.

### 3.6 Quiet-day confirmation
The user wants reassurance that no important unresolved issues exist.

---

## 4. Screen Structure

Recommended screen structure:

1. Alerts header
2. Summary strip
3. Severity tabs or grouped sections
4. Main alerts list
5. Alert detail panel or drawer
6. Resolution history or resolved filter area
7. Optional related action shortcuts

This structure keeps urgency first and detail accessible.

---

## 5. Alerts Header

Recommended contents:
- page title
- unresolved critical count
- total open alerts count
- current filter/scope summary
- quick controls for filtering by severity or category
- optional “Show Resolved” toggle

The header should create immediate clarity about current fleet attention load.

---

## 6. Alerts Summary Strip

Recommended top metrics:
- critical open alerts
- high-priority open alerts
- medium/low reminders
- tactical alerts
- admin alerts
- resolved in selected period

This strip should help the operator quickly understand whether the screen requires deep review or only light confirmation.

---

## 7. Severity Grouping Model

The screen should make severity visually and structurally obvious.

Recommended default grouping:
- Critical
- High
- Medium
- Low
- Resolved

Alternative implementations may use tabs, accordions, or grouped lists, but the user must never struggle to tell severity classes apart.

Critical and high alerts should appear first by default.

---

## 8. Alert Categories

Recommended category groupings:
- Risk / Drawdown
- Mode / Restrictions
- Payout / Refund
- Calendar / Rotation
- News / Time-based
- Data / Integrity
- System / Recovery
- Informational Review

Category labels should remain stable and useful.
They help the operator decide which alerts belong to current tactical work versus later admin work.

---

## 9. Main Alerts List Requirements

Each alert row or card should show:
- severity
- category
- concise title
- affected account or entity if relevant
- timestamp or relevant time window
- current status (open/resolved/acknowledged if used)
- short explanation
- primary recommended action or quick action affordance

The main list should support high scanning efficiency.
The operator should not need to open every alert to know whether it matters right now.

---

## 10. Alert Detail View

Selecting an alert should open a detail panel or drawer.

Recommended detail contents:
- full title
- severity
- category
- status
- created time
- source (rule engine/system/manual/admin)
- affected account/entity
- explanation of what triggered it
- why it matters
- related current state if relevant
- recommended next action
- resolution controls if appropriate
- links to related screens

This view is important because alerts must be explainable, not merely alarming.

---

## 11. Resolution and Acknowledgment Behavior

The Alerts screen should support meaningful state transitions.

Recommended actions:
- Acknowledge
- Resolve
- Open related account
- Open related payout/admin context
- Open related journal/history
- Retry/recheck if system-driven and appropriate

Rules:
- not every alert should need acknowledgment
- some alerts should auto-resolve when the governing state changes
- some admin reminders may need explicit user resolution
- resolution should preserve history

The UI must make it clear whether an alert is:
- open,
- acknowledged but unresolved,
- or resolved.

---

## 12. Tactical vs Administrative Presentation

The screen should help the user distinguish between tactical danger and admin follow-through.

Tactical examples:
- daily restriction triggered
- account near critical lives threshold
- full-size permission lost
- high-impact news approaching

Administrative examples:
- payout request due
- refund task unresolved
- rotation note pending
- export reminder or maintenance warning

These may coexist on the screen, but should not compete visually as if they were identical.

---

## 13. Related Action Shortcuts

Alerts should act as navigational bridges.

Useful shortcuts:
- Open Account Detail
- Open Payouts screen
- Open Calendar context
- Open Journal history
- Resolve Alert
- Add Note
- Open simulation if the alert relates to a future risk condition

This prevents the Alerts screen from becoming passive.

---

## 14. Time and Freshness Presentation

Alerts must be anchored in time.

Show clearly:
- when alert was created
- whether it is tied to a current or future window
- whether it is stale
- whether the underlying condition may already have changed

This helps prevent alert fatigue and stale-warning confusion.

---

## 15. Search and Filters

Recommended filters:
- severity
- category
- account
- firm
- open/resolved
- tactical/admin
- date range

Search may include:
- account label
- alert title
- alert explanation text
- category names

The active filter state must be obvious.

---

## 16. Resolved Alerts View

Resolved alerts should remain available but out of the main critical path.

Recommended behavior:
- hidden from default tactical focus unless requested
- searchable/filterable
- visible in detail with resolution timestamp and method
- useful for audit and review

Resolved alerts are part of system memory, not clutter to be discarded.

---

## 17. Empty and Quiet States

The Alerts screen must handle:
- no open alerts
- no critical alerts
- no alerts in current filter
- no recent resolved alerts

These states should feel calm and trustworthy.

Examples:
- “No open critical alerts.”
- “No alerts match this filter.”
- “No unresolved admin reminders.”

Quiet should feel like confirmation, not emptiness.

---

## 18. Error and Degraded States

If alert data is incomplete or inconsistent, the screen must say so.

Examples:
- source references missing
- account linkage missing
- resolution state unavailable
- partial alert history unavailable

The user should know whether the issue affects one alert, one category, or the whole alert surface.

---

## 19. UX Tone and Visual Feel

The Alerts screen should feel:
- sharp
- serious
- clear
- prioritized
- calm under urgency

It should not feel:
- like a generic notification inbox
- over-animated
- alarmist
- noisy
- visually exhausting

The purpose is attention control, not stress amplification.

---

## 20. Anti-Patterns to Avoid

Avoid:
- identical styling for critical and low-value reminders
- forcing the user to open alerts to know what they affect
- mixing resolved and open alerts without clear distinction
- making alerts feel like social notifications
- creating too many alert categories with unclear meaning
- burying action paths
- allowing stale alerts to linger without context

---

## 21. Definition of Done for the Alerts Screen

This spec is satisfied when:

1. The user can see what needs attention right now immediately.
2. Severity and category are clearly distinguishable.
3. Alerts are actionable, not just visible.
4. Resolution and acknowledgment behavior is understandable.
5. Tactical and administrative alerts can coexist without confusion.
6. The screen supports both live use and historical review.
7. The Alerts screen genuinely improves attention quality across the fleet.

---

## 22. Future Considerations

Potential later additions:
- smarter deduplication
- grouped alert bundles by account or time window
- digest mode
- compare this week’s alerts vs last week’s alerts
- AI-assisted alert summary

These are valuable later, but v1 must first make the Alerts screen clear, calm, and operationally useful.
