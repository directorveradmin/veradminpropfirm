# Veradmin Navigation Map and User Flows

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering  
Applies To: Global navigation, cross-screen movement, primary user journeys, drill-down logic, flow consistency, and interaction architecture

---

## 1. Purpose of This Document

This document defines the navigation map and primary user flows for Veradmin.

Veradmin is not a content browser.
It is a tactical operating system.
That means navigation is not merely about moving between screens.
It is about preserving orientation while the operator moves between:
- fleet-level awareness,
- account-level inspection,
- action execution,
- historical explanation,
- business operations,
- and safety/recovery tooling.

This document exists so that the product’s movement model remains coherent, shallow, and operationally useful.
Without this layer, even strong screens can become disconnected, repetitive, or mentally expensive to use.

---

## 2. Navigation Mission

The navigation system must do six things well:

1. Keep the user oriented at all times.
2. Make high-frequency flows fast and predictable.
3. Allow deep inspection without becoming maze-like.
4. Connect tactical, historical, and administrative surfaces coherently.
5. Preserve context when drilling into detail.
6. Support the Command Center-first philosophy of the product.

Navigation must feel like movement within one operating environment, not jumping between unrelated tools.

---

## 3. Core Navigation Principles

### 3.1 Fleet first, then drill down

The natural movement pattern of Veradmin should generally be:
- Command Center
- specific screen or filter
- account detail
- focused action or history
- return to fleet context

### 3.2 One product, not many mini-apps

The major screens may differ in purpose, but they must still feel like connected parts of one operating system.

### 3.3 Preserve the why of movement

When the user moves from one screen to another, the reason for the movement should remain obvious.
For example:
- from alert to affected account
- from payout item to payout history
- from account state to timeline explanation
- from mission item to relevant filtered view

### 3.4 Shallow beats deep

The product should prefer:
- clear top-level sections,
- contextual drill-down,
- drawers/panels when appropriate,
- and predictable return paths

over deeply nested page trees.

### 3.5 Tactical continuity matters

High-frequency actions should not require the user to mentally “start over” on every screen.

---

## 4. Top-Level Navigation Map

Recommended primary destinations:

1. Dashboard
2. Accounts
3. Journal
4. Payouts
5. Calendar
6. Alerts
7. Settings

These destinations are enough to structure the product cleanly without diluting attention.

Suggested purpose of each:
- **Dashboard**: mission control
- **Accounts**: all-account access and filtering
- **Journal**: operational memory
- **Payouts**: business and payout operations
- **Calendar**: time-based planning and rotation
- **Alerts**: attention management
- **Settings**: administrative governance

This list should remain stable unless the product changes meaningfully.

---

## 5. Secondary and Contextual Navigation

Not all navigation belongs in the primary sidebar.

Contextual navigation may include:
- account tabs or sub-sections
- linked event/history views
- detail drawers
- quick links from alerts to related entities
- links from summary strips to filtered views
- return-to-origin affordances

Rules:
- contextual navigation should feel supportive, not competing with primary navigation
- the user should never lose awareness of the broader screen context
- drawers and detail panes should be preferred where they reduce navigation thrash

---

## 6. Recommended Global Navigation Structure

### 6.1 Persistent left navigation rail or sidebar

Should be present on desktop layouts and include:
- top-level destinations
- clear active state
- stable icon + label pairs
- no unnecessary reordering

### 6.2 Consistent page header pattern

Every top-level screen should have:
- page title
- local controls
- current context indicator
- possibly summary metrics or quick actions

### 6.3 Return paths

The user should always be able to return from:
- account detail
- alert detail
- payout detail
- timeline drill-down
- restore/recovery flows

without confusion.

---

## 7. Primary User Flow: Morning Opening Check

Goal:
Orient the operator quickly at the start of the day.

Recommended flow:
1. Open Veradmin -> Dashboard
2. Read Today’s Mission
3. Review Fleet Health Strip
4. Inspect critical alerts if present
5. Open prioritized account(s)
6. Review permissions and current mode
7. Possibly open Calendar or Payouts if business/admin context matters today

This is one of the most important flows in the whole product.

Navigation requirements:
- Dashboard must be default landing point
- critical items must deep-link efficiently
- return to Dashboard must remain easy

---

## 8. Primary User Flow: Pre-Trade Account Selection

Goal:
Choose a suitable account for action.

Recommended flow:
1. Dashboard shows tradable candidates
2. User clicks account card
3. Account Detail opens
4. User reviews permissions, restrictions, and explanation
5. User opens simulation if needed
6. User decides whether to log action later or return to Dashboard

Optional alternative:
- Dashboard -> filtered Accounts view -> Account Detail

Navigation requirements:
- minimal friction
- strong continuity from card to detail
- account detail should clearly justify the navigation

---

## 9. Primary User Flow: Post-Trade State Verification

Goal:
Confirm what changed after an event.

Recommended flow:
1. User logs win/loss/custom event from Dashboard or Account Detail
2. Product confirms event
3. Account Detail or Dashboard refreshes visibly
4. User reviews changed mode, lives, restrictions, next action
5. Optional drill into Journal entry or simulation follow-up

Navigation requirements:
- no manual reload feel
- clear “what changed” communication
- immediate path to deeper explanation

---

## 10. Primary User Flow: Account Investigation

Goal:
Understand why an account is in its current state.

Recommended flow:
1. Dashboard or Alerts -> open account
2. Account Detail -> Why This State panel
3. Timeline / Journal section
4. Possibly open Journal screen filtered to that account
5. Return to Account Detail or back to Dashboard

Navigation requirements:
- timeline and journal should be connected, not duplicated ambiguously
- context should persist when moving between account and journal history
- account identity should stay visually anchored

---

## 11. Primary User Flow: Payout Review and Action

Goal:
Understand payout readiness and execute payout-related actions.

Recommended flow:
1. Dashboard summary or mission panel -> Payouts
2. Payouts screen -> inspect ready accounts
3. Open detail or directly take structured action
4. Possibly open related Account Detail or Journal history
5. Return to Payouts or Dashboard

Navigation requirements:
- payout readiness counts should deep-link to scoped views
- payout item detail must connect to account and history
- admin tasks should be actionable without excessive drill-down

---

## 12. Primary User Flow: Rotation and Planning Review

Goal:
Understand future operational rhythm.

Recommended flow:
1. Dashboard or mission item -> Calendar
2. Review active/rest cadence and future windows
3. Inspect a period or account lane
4. Possibly jump to Payouts or Account Detail
5. Return to Calendar or Dashboard

Navigation requirements:
- calendar context must remain stable during detail inspection
- date scope must remain visible
- drill-down should preserve time context

---

## 13. Primary User Flow: Alert Triage

Goal:
Review urgent and important items in structured order.

Recommended flow:
1. Dashboard alert zone -> Alerts screen
2. Filter by severity or category
3. Open alert detail
4. Jump to related account, payout item, or calendar context
5. Resolve/acknowledge if appropriate
6. Return to Alerts with context preserved

Navigation requirements:
- severity grouping should reduce scanning cost
- linked entity navigation must be precise
- return path should feel natural

---

## 14. Primary User Flow: Backup / Restore / Export Safety

Goal:
Protect or recover the product’s memory.

Recommended flow:
1. Settings -> Backup/Restore/Export screen
2. Create backup or inspect backup state
3. If restoring: preview -> confirm -> safety backup -> restore -> result
4. Return to Dashboard or remain in safety context

Navigation requirements:
- safety surfaces should feel clearly separate from tactical ones
- return to stable working context should be obvious after success
- error paths should not dump the user into a dead end

---

## 15. Screen-to-Screen Relationship Map

Recommended major relationships:

- **Dashboard -> Account Detail**
- **Dashboard -> Alerts**
- **Dashboard -> Payouts**
- **Dashboard -> Calendar**
- **Dashboard -> Journal**
- **Alerts -> Account Detail**
- **Alerts -> Payouts**
- **Alerts -> Calendar**
- **Payouts -> Account Detail**
- **Payouts -> Journal**
- **Calendar -> Account Detail**
- **Calendar -> Payouts**
- **Account Detail -> Journal**
- **Account Detail -> Simulation**
- **Settings -> Backup/Restore/Export**

These relationships should be explicit in both UX design and implementation.

---

## 16. Context Preservation Rules

When moving between screens, the app should preserve useful context where practical.

Examples:
- opening Journal from Account Detail should preserve account filter
- opening Alerts from Dashboard critical count should preserve critical-only view
- opening Payouts from mission panel should preserve ready-or-pending context
- opening Calendar from an account-specific future item may focus that account or period

Context preservation reduces cognitive resets.

---

## 17. Deep-Linking and Filtered Entry States

The product should support “smart entry” into screens.

Examples:
- Alerts screen opened already filtered to critical
- Journal opened filtered to one account and one date range
- Payouts opened filtered to payout-ready
- Calendar opened to current week or highlighted future window

These entry states improve operational speed and reinforce why the user navigated there in the first place.

---

## 18. Modal, Drawer, and Full-Screen Decision Rules

Not every interaction requires a full page transition.

Recommended approach:
- use **drawers or detail panes** for inspections that benefit from preserving parent context
- use **modals** for focused, high-signal actions like logging an event or confirming a dangerous change
- use **full-screen/top-level transitions** for major operating surfaces like Dashboard, Journal, Payouts, Calendar, Settings

This keeps the product feeling coherent instead of overly fragmented.

---

## 19. Navigation Anti-Patterns to Avoid

Avoid:
- deep nested navigation trees
- ambiguous top-level destinations
- duplicate destinations that mean nearly the same thing
- losing filter or time context on drill-down
- opening every detail in a new full-screen path unnecessarily
- trapping the user in modal chains
- forcing the user to remember where they came from

---

## 20. Definition of Done for Navigation Map and User Flows

This spec is satisfied when:

1. The user can move through all major daily workflows without confusion.
2. Fleet -> account -> action -> explanation flows feel natural.
3. Context is preserved across important drill-downs.
4. The product feels shallow, connected, and command-oriented.
5. Major screens reinforce each other instead of duplicating or competing.
6. Return paths are always clear.
7. Navigation supports tactical clarity rather than feature sprawl.

---

## 21. Future Considerations

Potential later additions:
- command palette navigation
- keyboard-first flow support
- saved scoped views
- multi-monitor navigation modes
- read-only companion routes

These are valuable later, but v1 must first make core user flows fast and dependable.
