# Veradmin Calendar and Rotation Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Operations  
Applies To: Calendar screen, rotation planning, account rhythm visualization, future load management, payout timing awareness, and week-over-week fleet scheduling

---

## 1. Purpose of This Document

This document defines the Calendar and Rotation screen in detail.

The Calendar and Rotation screen is where Veradmin’s time-based operational intelligence becomes visible.
It is not just a calendar.
It is the screen that helps the operator understand the rhythm of the fleet across days and weeks:
- active periods
- rest periods
- evaluation focus
- payout windows
- future admin tasks
- cluster risk
- operational load

This document exists so the calendar becomes a strategic planning surface rather than a decorative date grid.

---

## 2. Screen Mission

The Calendar and Rotation screen must answer:

1. Which accounts are active now?
2. Which accounts should rest now or soon?
3. What changes next week?
4. Where are payout windows clustering?
5. Where is operational load too heavy or too light?
6. Which future events matter for planning?

This screen exists to help the user manage fleet rhythm over time, not only today’s tactical state.

---

## 3. Primary User Scenarios

The screen must support at least:

### 3.1 Weekly planning
The user wants to see what the current and next week look like.

### 3.2 Rotation balancing
The user wants to identify too many active accounts in one period.

### 3.3 Payout clustering awareness
The user wants to see where payout timing becomes uneven.

### 3.4 Rest/protection planning
The user wants to preserve accounts and avoid over-concentration of active risk.

### 3.5 Evaluation prioritization
The user wants to see where evaluation accounts deserve focus relative to funded accounts.

### 3.6 Future admin awareness
The user wants to see upcoming tasks, windows, or important transitions.

---

## 4. Screen Structure

Recommended screen structure:

1. Calendar header and controls
2. Time-range selector
3. Fleet rhythm summary strip
4. Main calendar / lane view
5. Detail panel or side drawer
6. Upcoming events and clustering summary
7. Optional quick planning actions

This structure supports both overview and planning detail.

---

## 5. Calendar Header

Recommended contents:
- page title
- visible selected time range
- navigation between week / month / custom period
- quick filter entry point
- optional quick action for adding/editing schedule or note

The header should make it obvious which time window the user is evaluating.

---

## 6. Time Views

Recommended supported views:
- week view
- multi-week view
- month overview

Week and multi-week views should be the primary design target.
This product is about operational planning, so overly abstract year-style views are lower priority.

The chosen view should preserve readability of:
- active periods
- rest periods
- payout windows
- admin tasks
- warnings
- account grouping

---

## 7. Fleet Rhythm Summary Strip

This area should summarize the selected period.

Recommended metrics:
- active funded accounts
- resting funded accounts
- evaluation accounts needing focus
- payout windows in range
- heavy-load days/weeks
- light-load days/weeks
- unresolved scheduled admin items

The strip should help the user read the selected period before inspecting the full calendar lanes.

---

## 8. Main Calendar / Lane View

The main surface should emphasize time-based account behavior.

Recommended layout:
- each account or grouped account lane occupies a row
- time flows horizontally
- status periods are shown with clear visual states
- important events appear as markers or overlays

Useful visual categories:
- active week
- rest week
- payout protection period
- payout request window
- pending payout
- evaluation priority zone
- manual pause
- special warning marker

This should feel like operational rhythm, not like a generic appointment calendar.

---

## 9. Grouping Options

The calendar should support grouping by:
- funded vs evaluation
- firm
- stage
- mode
- custom operational grouping if added later

A good default is often:
- funded accounts first
- evaluation accounts below
- inactive or paused groups clearly separated

This preserves strategic clarity.

---

## 10. Rotation Logic Presentation

The screen must make rotation logic visible, not hidden in settings.

Examples of useful visual signals:
- 2-on / 1-off rhythm
- currently active cycle
- next rest period
- upcoming reactivation
- overlapping active-week concentration
- recommended spacing problem zones

The goal is to help the operator see rhythm, not just dates.

---

## 11. Payout Timing in the Calendar

The calendar should show payout-related timing meaningfully.

Examples:
- next eligible payout window
- request date
- received payout marker
- refund task due
- clustered payout week

These should be visually distinct from normal account activity so the user can read money timing at a glance.

---

## 12. Evaluation Account Context

Evaluation accounts should be visible, but not visually confuse the funded-account rhythm layer.

Recommended approach:
- separate section or lane group
- different visual treatment
- clear progress or target markers
- note stage progression and milestones

This helps the screen support both strategic funded rotation and evaluation progress planning.

---

## 13. Detail Drawer or Side Panel

Clicking a lane period or marker should reveal detail.

Recommended contents:
- account label
- period type
- start/end dates
- why this period exists
- linked payout/admin context
- linked notes
- related alerts if relevant
- quick action options
- quick link to Account Detail

The calendar should not trap the user in abstract colored bars with no explanation.

---

## 14. Planning Actions

Recommended actions from the calendar may include:
- add/edit rotation note
- mark/manual override of active/rest period
- open account
- open payout context
- open alert context
- compare selected week with next week
- jump to today

Even if v1 keeps actions light, the screen should still feel actionable.

---

## 15. Clustering and Load Awareness

One of the screen’s main values is helping the user see concentration problems.

Examples:
- too many active accounts in one week
- too many payout windows in the same period
- admin-heavy week
- weak coverage week
- evaluation work getting crowded out

The screen should provide visual and textual cues that help the operator plan smoother fleet rhythm.

---

## 16. Relationship to Other Screens

This screen should integrate naturally with:
- Command Center
- Account Detail
- Payouts
- Alerts
- Journal

Examples:
- clicking an account opens its detail screen
- payout window markers link to the Payouts screen
- alerts affecting future dates link to relevant alert detail
- Command Center summary widgets may deep-link into filtered calendar ranges

The calendar should be part of the operating system, not a disconnected planning page.

---

## 17. Empty and Quiet States

The screen must handle:
- very small fleet
- no rotation data yet
- no payout windows in range
- no special events in selected week
- onboarding example fleet
- mostly inactive fleet

These states should still feel meaningful and controlled.

Examples:
- “No special rotation changes in this period.”
- “No payout windows fall in the selected range.”
- “This account group is inactive during this week.”

---

## 18. Error and Degraded States

If calendar data is incomplete or inconsistent, the screen must say so explicitly.

Examples:
- missing schedule markers
- invalid date range data
- broken rotation references
- incomplete payout timing info
- lane rendering failure for one group

The user should know whether the issue affects one account, one week, or the screen’s broader trustworthiness.

---

## 19. UX Tone and Visual Feel

The Calendar and Rotation screen should feel:
- strategic
- calm
- structured
- temporal
- professional
- planning-oriented

It should not feel:
- like a consumer calendar app
- like a decorative Gantt clone with no meaning
- over-animated
- excessively abstract

The user should feel they are looking at the fleet’s rhythm, not just a date surface.

---

## 20. Anti-Patterns to Avoid

Avoid:
- generic month calendar as the primary interface
- no clear distinction between funded and evaluation timing
- visual overload from too many overlapping markers
- unexplained colored bars
- no sense of load/clustering
- making the calendar purely passive with no drill-down value
- burying payout timing in separate hidden sections

---

## 21. Definition of Done for the Calendar and Rotation Screen

This spec is satisfied when:

1. The user can understand current and near-future fleet rhythm clearly.
2. Active, resting, payout-related, and special periods are visually distinct.
3. Funded and evaluation planning are both supported meaningfully.
4. Clustering and load issues are easy to spot.
5. Drill-down provides explanation, not just dates.
6. The screen feels like a planning tool rather than a decorative calendar.
7. The Calendar and Rotation screen helps manage the fleet over time, not just in the present moment.

---

## 22. Future Considerations

Potential later additions:
- smarter rotation optimization hints
- compare-period planning views
- export calendar summary
- read-only weekly planning view for secondary screen use
- AI-assisted planning summaries

These are valuable later, but v1 must first make the screen a reliable rhythm and rotation tool.
