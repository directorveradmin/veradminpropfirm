# Veradmin Dashboard and Navigation Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering  
Applies To: Home screen, account navigation, command surfaces, view hierarchy, interaction flow, and orientation logic

---

## 1. Purpose of This Document

This document defines the dashboard, navigation model, and command-surface behavior for Veradmin.

Its purpose is to remove ambiguity around what the user sees first, what information is prioritized, how screens connect, how quickly an operator can orient themselves, and how navigation should reinforce the product doctrine.

Veradmin is not a content-rich website that invites casual exploration.
It is a tactical desktop operating surface for a trading fleet.

That means the dashboard and navigation must serve clarity before feature density.

The dashboard is not merely a visual summary.
It is the primary command surface of the product.

Navigation is not merely a menu system.
It is the route by which the operator moves from fleet-level awareness to account-level decision quality.

If this layer is weak, the product feels like a tracker.
If this layer is strong, the product feels like an operating system.

---

## 2. Dashboard Mission

The dashboard must answer, within seconds:

1. What matters today?
2. Which accounts are tradable right now?
3. Which accounts are restricted, protected, or stopped?
4. Which actions require attention now?
5. What should the operator do next?

The dashboard must make the operator feel oriented, not overloaded.

The home screen must not attempt to display every possible metric.
It must present the most operationally relevant information first, and reveal depth only when requested.

---

## 3. Core Navigation Principles

### 3.1 Home is mission control

The home screen is the product’s command center.
It is the first screen the user sees when opening the app and the screen they should feel comfortable returning to repeatedly throughout the day.

### 3.2 Navigation must follow operational scale

Navigation should move from broad to specific:

- fleet
- segment
- account
- action
- history/detail

This means the dashboard should always make it easy to move from:
- overall fleet condition,
- to a category of accounts,
- to a single account,
- to a tactical action,
- to the deeper explanatory context behind that action.

### 3.3 The app should feel shallow, not labyrinthine

The user should not need to pass through multiple layers of navigation to answer core operational questions.
Important information should be within one or two interactions from the home screen.

### 3.4 Persistent orientation matters

At all times the user should know:
- where they are,
- what entity they are viewing,
- what state it is in,
- and how to return to fleet context.

### 3.5 Command over browsing

Navigation should support command actions more than exploratory browsing.
This means quick actions, drill-downs, filters, and compact contextual panels are preferred over sprawling multi-page hierarchies.

---

## 4. Primary Information Architecture

Veradmin v1 should have the following primary product surfaces.

### 4.1 Fleet Command Dashboard

The default home screen and most important surface in the app.

Purpose:
- immediate fleet awareness
- attention prioritization
- quick account access
- tactical quick actions
- system-level warnings

### 4.2 Account Control View

A dedicated operational view for a single account.

Purpose:
- understand full state of one account
- review permissions and restrictions
- log events
- inspect timeline/history
- review payout and compliance position

### 4.3 Trade Logging and Journal Surface

The action surface for adding wins, losses, custom events, notes, and trade metadata.

Purpose:
- preserve operational memory
- update state safely
- explain what changed
- keep history recoverable

### 4.4 Rotation, Payout, and Alerts Surface

A business-operations layer showing payout timing, schedule rhythm, reminders, and warning queues.

Purpose:
- manage the fleet as a business
- smooth operational load
- see tomorrow and next week, not just the current minute

### 4.5 Settings and System Surface

A low-frequency surface for local configuration, exports, backups, rule profile administration, and system health.

Purpose:
- keep v1 operationally safe
- centralize low-frequency administrative actions
- avoid scattering setup logic throughout the app

---

## 5. Recommended Primary Navigation Model

Veradmin should use a left-side primary navigation rail or sidebar in desktop mode.

Recommended top-level destinations:

1. Dashboard
2. Accounts
3. Journal
4. Payouts
5. Calendar
6. Alerts
7. Settings

This list may be collapsed visually in some layouts, but these conceptual destinations should remain stable.

Recommended behavior:
- Dashboard is the default landing view.
- Accounts provides filtered access to all accounts, even outside current dashboard focus.
- Journal centralizes event history and logging access.
- Payouts shows money operations and readiness.
- Calendar shows rotation logic and future load.
- Alerts shows system warnings and unresolved attention items.
- Settings should be quiet and clearly separated from tactical surfaces.

---

## 6. Dashboard Layout Specification

The dashboard must be structured vertically from highest urgency to lower urgency.

Recommended order:

### 6.1 Top status bar

Contains:
- current date
- current app mode / environment indicator if needed
- fleet-level quick status
- unresolved critical alert count
- backup/sync state if relevant
- global search or command trigger if added later

This bar should be quiet, compact, and always visible.

### 6.2 Today’s Mission panel

This is the first true content block and should answer:
- critical things to avoid
- must-handle items
- payout actions due
- accounts requiring protection
- accounts prioritized for use

It should feel like a concise mission briefing.

The user should be able to understand today’s operating posture from this panel alone.

### 6.3 Fleet health strip

A compact summary row showing:
- total active accounts
- tradable accounts
- restricted accounts
- stopped accounts
- payout-ready accounts
- accounts near critical risk
- overall fleet health score

This section should support hover or click for drill-down, but remain readable in one glance.

### 6.4 Alert strip or card stack

This area surfaces urgent warnings such as:
- daily stop triggered
- red-folder news approaching
- payout request windows open
- account close to hard breach
- missing required data
- unresolved refund tasks

Critical alerts should never be hidden below lower-value analytics.

### 6.5 Fleet account grid

This is the main body of the dashboard.
It should present account cards in a responsive grid that is optimized for desktop widths.

Cards must be scannable, consistent, and sortable/filterable.

Recommended default grouping options:
- by phase
- by firm
- by mode
- by risk severity

Recommended default sort:
- most urgent first

### 6.6 Bottom secondary intelligence area

This can include:
- upcoming payouts
- near-future rotation changes
- recent activity summary
- unresolved notes/tasks
- optional analytics snippets

These are useful, but should never compete with the dashboard’s upper tactical layers.

---

## 7. Account Card Specification

Account cards are the backbone of the dashboard.

Each card must support two viewing states:

### 7.1 Collapsed card

Required content:
- account label
- firm name
- lifecycle stage
- current mode
- tradable / restricted / stopped badge
- lives remaining
- next milestone (payout, target, reset, or warning)
- primary quick action access

Collapsed cards are for scanning.
They should not overwhelm the user with details.

### 7.2 Expanded quick view

When expanded, the card may reveal:
- starting balance
- current balance
- breach floor
- daily floor
- max lot size now
- consistency pressure
- days traded vs required
- next payout date
- current warnings
- recent event summary
- quick action buttons

Expanded cards are still dashboard cards, not full account pages.
They should remain concise.

### 7.3 Card interaction rules

Single click:
- opens account control view

Optional inline expand:
- reveals expanded quick view without full navigation

Right-click or overflow menu:
- contextual actions such as pause, add note, open journal, copy summary, mark payout requested

Double-click behavior should generally be avoided unless it adds clear value.

---

## 8. Account Control View Specification

The account view is the detailed operational screen for one account.

It should be structured as follows:

### 8.1 Header

Contains:
- account label
- firm
- stage
- current mode
- tradable status
- key warning badge(s)
- quick actions

### 8.2 State summary panel

Contains:
- current balance
- starting balance
- peak balance
- hard breach floor
- daily stop floor
- lives remaining
- fractional lives remaining
- max lot size
- risk severity
- next recommended action

### 8.3 Restriction and permission panel

Contains:
- whether account is tradable
- whether full size is allowed
- whether only fractional size is allowed
- whether payout protection is active
- whether daily limit is the controlling restriction
- whether news restriction is currently active

### 8.4 Rule explanation panel

Contains:
- why the account is in its current mode
- which conditions triggered the mode
- what event most recently changed state
- what future event would change it again

This panel is essential for trust.

### 8.5 Journal and timeline panel

Contains:
- recent trades
- notes
- payout events
- mode transitions
- resets
- audit items

### 8.6 Tactical action area

Contains:
- Log Win
- Log Loss
- Log Custom
- Add Note
- Request Payout
- Mark Paused / Resume
- View Simulation

---

## 9. Navigation Between Surfaces

### 9.1 Dashboard to account

The primary movement pattern in Veradmin is from dashboard card to account control view.

This transition must feel fast and predictable.

### 9.2 Account to journal

Every account should provide direct access to relevant journal entries, not require the user to go hunting through a generic log screen.

### 9.3 Dashboard to payout/calendar/alerts

The user should be able to jump from a summary indicator directly into the relevant operational screen:
- payout-ready count -> Payouts view
- alert count -> Alerts view
- rotation indicator -> Calendar view

### 9.4 Search and filters

Search and filtering should exist where they reduce friction:
- account list
- journal
- alerts
- payout table

However, search should not replace strong information architecture.

---

## 10. Recommended Dashboard Filters

The dashboard should support lightweight filters that do not destabilize orientation.

Recommended filters:
- all accounts
- tradable only
- payout-ready only
- near-risk accounts
- by firm
- by stage
- by mode

Filter controls should be persistent enough to be useful, but obvious enough that the user understands when a filtered view is active.

---

## 11. Recommended Quick Actions

Quick actions are important because Veradmin is command-oriented.

Recommended quick actions from the dashboard:
- open account
- log win
- log loss
- log custom event
- add note
- request payout
- pause/resume account
- view simulation

These actions must be protected by clear confirmations when they alter state significantly.

---

## 12. Empty States and Quiet States

The app must handle calm days well, not only critical days.

Examples:
- no active alerts
- no payouts due
- no tradable accounts
- no news restrictions today
- empty journal for a new account
- no filtered accounts matching current filter

Empty states should never feel broken.
They should explain the quiet condition and, where useful, suggest the next action.

---

## 13. Critical State Behavior

When the system detects urgent situations, the dashboard must elevate them clearly.

Examples:
- account at or below allowed daily threshold
- hard breach imminent
- payout request due and expiring
- missing rule profile data
- invalid or stale daily reset

Critical states should change presentation priority, not merely add a small badge.

The app should remain calm, but the priority shift must be unmistakable.

---

## 14. Navigation Anti-Patterns to Avoid

Veradmin must avoid:
- deep nested menus
- ambiguous labels
- tabs inside tabs inside cards
- mixing low-frequency settings into tactical views
- burying critical warnings under charts
- using visual novelty instead of hierarchy
- forcing the operator to interpret raw numbers without state labels
- turning the dashboard into a dense spreadsheet clone

---

## 15. Definition of Done for Dashboard and Navigation

This spec is satisfied when:

1. A new user can open the app and understand the fleet posture quickly.
2. A daily user can identify tradable accounts in seconds.
3. Critical warnings are impossible to miss.
4. Movement from fleet view to account action feels fast and obvious.
5. The dashboard feels like mission control, not an analytics board.
6. Navigation remains shallow, consistent, and operationally driven.
7. The interface reinforces doctrine: clarity, discipline, and action guidance.

---

## 16. Future Considerations

Potential later additions:
- keyboard command palette
- saved dashboard views
- custom multi-monitor layouts
- dockable panels
- read-only second-screen mode
- advanced cross-account comparison mode

These may be useful later, but must not complicate v1.
