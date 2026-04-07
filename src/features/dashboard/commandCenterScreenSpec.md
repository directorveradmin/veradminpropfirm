# Step 7 Command Center Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering  
Applies To: `Dashboard` / `Command Center` only

---

## 1. Purpose

This artifact completes Step 7 by turning the Command Center doctrine into a build-ready screen specification.

It does not redesign Veradmin.
It does not implement Journal, Payouts, Calendar, or other major screens.
It defines the Dashboard as the fleet mission-control surface and the minimum wiring required so Command Center actions can consume Step 6 workflow results without guessing.

---

## 2. Step 7 Scope

In scope:
- shell / header
- Today’s Mission
- Fleet Health Strip
- Critical Alert Zone
- fleet account grid
- account card behavior
- dashboard sorting / filtering
- dashboard quick actions
- dashboard-specific empty, quiet, and degraded states
- Step 6 workflow-result consumption on the dashboard
- minimum Account Detail bridge only where needed for Command Center continuity

Out of scope:
- full Account Detail screen design
- full Journal, Payouts, Calendar, Alerts, or Settings behavior
- analytics-heavy chart modules
- alternate dashboard themes or personalization systems

---

## 3. Governing Decisions

1. Dashboard remains the default landing surface.
2. The primary organizing principle is tactical urgency, not raw metrics.
3. The screen reads top-down as: orientation -> mission -> fleet posture -> threats -> account actions.
4. Step 7 consumes Step 6 outputs; it does not recompute account truth locally.
5. Card density stays disciplined. Anything that makes scanning harder moves to drill-down or overflow.
6. Dashboard links preserve context when opening Alerts, Calendar, Payouts, Journal, or Account Detail.

---

## 4. Command Center Structure

## 4.1 Top shell / header

Purpose:
Provide immediate orientation without competing with Today’s Mission.

Required contents:
- `Dashboard` title
- current date
- fleet-wide status sentence
- unresolved critical count
- last refresh timestamp
- optional integrity/degraded banner slot
- reserved command/search affordance placeholder (non-primary in Step 7)

Header sentence pattern:
- `3 tradable · 2 restricted · 1 stopped`
- `No critical issues`
- `Partial fleet load — verify affected accounts`

Behavior:
- header remains fixed within the page column while scrolling the account grid
- critical count click deep-links to Alerts with `critical` filter
- degraded banner click deep-links to the relevant integrity or alert destination

## 4.2 Today’s Mission panel

This is the primary briefing block.

Layout:
- left: headline + posture summary
- right: short mission list and due-now items

Sections:
- `Primary posture`
- `Protect now`
- `Tradable candidates`
- `Time-sensitive admin`
- `System caveats`

Rules:
- maximum 6 mission items
- maximum 2 lines per item
- items sorted by tactical significance
- each item has one target destination or action
- no long-form prose

Mission item structure:
- label
- short reason
- severity
- target route or workflow
- optional affected account ids

Examples:
- `Protect Apex 12 — 0.8 effective lives remain`
- `News restriction near — 13:30 window affects 2 tradable accounts`
- `Request payout — 1 account is ready and still pending operator action`
- `Review integrity — 1 account has partial evaluation data`

## 4.3 Fleet Health Strip

Purpose:
Compact fleet-state metrics that reinforce the mission briefing.

Metrics:
- total accounts
- tradable
- restricted
- stopped
- payout-ready
- near-risk
- fleet health score

Rules:
- metric click applies dashboard filter or deep-link
- values are short and integer-first
- score is supportive, never dominant
- no duplicated explanation text inside the strip

Fleet health score:
- expressed as `0–100`
- shown only as a compact summary tile
- never used as the sole ranking input
- tooltip copy: `Composite tactical health based on tradability, active restrictions, payout posture, and unresolved alerts.`

## 4.4 Critical Alert Zone

Purpose:
Expose urgent threats or operator reminders that cannot be missed.

Ordering:
1. critical
2. high
3. medium
4. resolved/recently-cleared summaries only when useful

Alert row structure:
- severity badge
- title
- short message
- affected account or global scope label
- destination/action
- timestamp if relevant

Grouping:
- allowed for repeated alert types
- never allowed to hide a single critical account
- grouped rows must still expose account count and drill-down target

Examples:
- `Critical · Daily restriction active · 2 accounts should stop until reset`
- `High · Payout receipt follow-up due · 1 item needs admin confirmation`
- `High · Missing profile on active account · account cannot be trusted for action`

## 4.5 Fleet Account Grid

Default presentation:
- grouped by urgency bucket
- sorted by tactical decision relevance inside each group

Urgency buckets:
1. `Action now`
2. `Protect / monitor`
3. `Tradable candidates`
4. `Admin / payout attention`
5. `Quiet / no immediate action`

Grid rules:
- cards are large enough for rapid scan at desktop distance
- body click opens Account Detail
- keyboard focus mirrors click behavior
- selected card state is visible and persistent until navigation changes
- grid can collapse to 1-column or 2-column layouts on narrower desktop widths without changing information hierarchy

---

## 5. Account Card Specification

## 5.1 Required card content

Always visible:
- account label
- firm label
- lifecycle stage
- mode
- operational state (`Tradable`, `Restricted`, `Stopped`)
- effective lives remaining
- next milestone / next action
- top warning badge(s)
- two quick actions max on the face

Optional compact details:
- current balance
- hard breach floor
- payout readiness
- daily restriction summary
- last meaningful event timestamp

## 5.2 Card state styling

States:
- default
- hover
- selected
- restricted
- stopped
- payout-ready
- critical-risk
- degraded-data

Visual rules:
- state is communicated by badge, border treatment, and short label
- color alone is never the only carrier of meaning
- critical-risk cards do not pulse or animate aggressively
- degraded-data cards use explicit copy such as `Evaluation incomplete`

## 5.3 Card click map

- card body -> open Account Detail
- mode badge -> no click in Step 7
- alert badge -> open Account Detail with `why-this-state` section active
- payout badge -> deep-link to Payouts scoped to account
- note/count affordances, if shown -> Journal filtered to account
- quick action buttons -> open modal/drawer without navigating away by default

## 5.4 Face quick actions

Exactly two visible slots:
- Slot A: context-sensitive primary action
- Slot B: overflow menu trigger

Context-sensitive Slot A priority:
1. `Resume` if manually paused and resumable
2. `Request Payout` if payout-ready and allowed
3. `Log Win` if tradable and recent workflow pattern suggests win/loss logging is the dominant action
4. `Log Loss` if tradable and operator last used loss logging on this account
5. `Open` if no higher-value action applies

Overflow actions:
- Open Account
- Log Win
- Log Loss
- Log Custom Event
- Add Note
- Request Payout
- Pause / Resume
- Open Simulation

Rules:
- disabled actions stay visible when important for explanation
- disabled actions include a short reason
- destructive / high-impact actions use confirmation modals where doctrine requires it

---

## 6. Sorting, Grouping, and Filtering

## 6.1 Default grouping

Default: `urgency`

Other available groupings:
- mode
- stage
- firm

Switching grouping:
- preserves active filters
- preserves current sort within each group where possible
- does not create a separate screen state outside Dashboard

## 6.2 Default sort inside groups

Sort priority:
1. critical alerts present
2. may-trade false but operator action required
3. payout-ready with pending operator action
4. fewer effective lives remaining
5. current tradability
6. state-affecting event recency
7. stable label tie-break

This keeps the grid decision-first rather than aesthetically sorted.

## 6.3 Filter bar

Visible controls:
- `All`
- `Tradable`
- `Payout-ready`
- `Near-risk`
- firm select
- stage select
- mode select
- optional `More filters` drawer trigger for future expansion

Rules:
- active filter count is always visible
- filter chips are reversible in one click
- filter-empty results return a composed no-results state, not a blank grid
- filter state survives drill-down and browser/app back navigation where feasible

## 6.4 Search

Step 7 supports only lightweight account search if already available in shell primitives.
Search is supportive, not the primary organizing tool.

---

## 7. Quick Action and Workflow Handling

## 7.1 Invocation model

Dashboard actions must call Step 6 services through the Step 6 integrator.
The dashboard never mutates account truth directly.

## 7.2 Result handling contract

After a workflow returns:
1. show consequence toast/callout from `AccountConsequenceSummary`
2. record derived event summaries for the account card if present
3. apply invalidation keys
4. rebuild affected Step 5 / Step 7 read models
5. refresh visible dashboard sections in-place
6. preserve user context where possible

## 7.3 Post-action feedback

Required confirmation payload:
- headline
- changed fields
- alerts created / resolved summary
- next recommended action
- optional deep-link to Account Detail or Journal

Examples:
- `Apex 12 moved to Preservation Mode`
- `Tradability removed. Daily restriction is now active.`
- `Payout request recorded. Dashboard and payouts state refreshed.`

## 7.4 No-guess rule

Dashboard must use workflow outputs directly for:
- what changed
- alert deltas
- mode delta
- tradability delta
- lives delta
- degraded markers

Dashboard must not infer any of those from balance movement alone.

---

## 8. Dashboard View-Model Refinement

## 8.1 Screen model root

`CommandCenterScreenViewModel`
- `header`
- `mission`
- `fleetHealth`
- `criticalAlerts`
- `grid`
- `secondarySummary`
- `state`

## 8.2 Header model

`CommandCenterHeaderViewModel`
- `title`
- `asOfLabel`
- `fleetStatusSentence`
- `criticalCount`
- `lastRefreshLabel`
- `degradedBanner`
- `availableQuickGlobalLinks`

## 8.3 Mission model

`TodaysMissionPanelViewModel`
- `headline`
- `posture`
- `items`
- `quietSummary`
- `degradedSummary`

Mission items are assembled from deterministic evaluation outputs plus alert posture, not from screen heuristics.

## 8.4 Fleet health model

`FleetHealthStripViewModel`
- `metrics[]`
- `score`
- `scoreExplanation`

Each metric includes:
- label
- value
- tone
- target filter/deep-link
- optional tooltip

## 8.5 Alerts model

`CriticalAlertZoneViewModel`
- `items[]`
- `grouped`
- `hasCritical`
- `quietMessage`

## 8.6 Grid model

`AccountGridViewModel`
- `groupBy`
- `sortBy`
- `activeFilters`
- `groups[]`
- `emptyState`

## 8.7 Card model

`CommandCenterAccountCardViewModel`
- `accountId`
- `accountLabel`
- `firmLabel`
- `stageLabel`
- `modeLabel`
- `stateLabel`
- `effectiveLivesLabel`
- `nextMilestoneLabel`
- `warningBadges[]`
- `quickActions[]`
- `balanceLabel?`
- `hardBreachFloorLabel?`
- `payoutReadinessLabel?`
- `lastMeaningfulEventLabel?`
- `visualState`
- `degradedReason?`

## 8.8 Secondary summary model

Step 7 keeps this lightweight:
- upcoming payouts
- near-term rotation changes
- unresolved admin tasks
- recent meaningful changes

It must stay subordinate to mission, alerts, and account grid.

---

## 9. Empty, Quiet, and Degraded States

## 9.1 Empty fleet

Use when no active accounts exist.

Primary copy:
- `No accounts in the fleet yet.`
- `Create the first account to establish today’s mission.`

Actions:
- `Create Account`

What still renders:
- shell/header
- empty mission panel
- empty grid state
- no fake metrics

## 9.2 Quiet day

Use when fleet is healthy and no urgent items exist.

Primary copy:
- `Nothing urgent right now.`
- `Tradable accounts remain available under current constraints.`

Behavior:
- mission panel still renders with 1–3 calm items
- alert zone collapses to quiet confirmation
- grid still ranks tradable candidates first

## 9.3 Filter-empty state

Primary copy:
- `No accounts match the current filters.`
- `Clear one or more filters to restore fleet visibility.`

Action:
- `Clear filters`

## 9.4 Single-account fleet

Dashboard still renders full structure.
Do not special-case into a different screen.
Mission panel and grid simply become more focused.

## 9.5 Partial account load

Use when one or more accounts could not be evaluated or loaded fully.

Required behavior:
- degraded header banner
- degraded mission item if relevant
- affected cards move into `Protect / monitor` or `Admin / payout attention` depending on severity
- card shows `Evaluation incomplete`

## 9.6 Mission panel unavailable

Fallback:
- render shell, fleet strip, alerts, and grid
- show inline message: `Mission briefing unavailable. Use fleet alerts and account posture until refresh succeeds.`

## 9.7 Alert service degraded

Behavior:
- explicit banner
- do not claim `No active alerts`
- account cards still show locally available warning badges when present

## 9.8 Integrity uncertainty

When history integrity or profile integrity is compromised:
- show explicit degraded banner
- affected cards cannot be presented as fully trustworthy tradable candidates
- deep-link to the affected account or integrity destination

---

## 10. Navigation and Context Preservation

1. Dashboard is the default landing screen.
2. Account card click opens Account Detail.
3. Mission items deep-link with preserved scope:
   - alerts -> critical-only or relevant severity
   - payouts -> payout-ready or pending
   - calendar -> relevant week/window
   - journal -> filtered to account/date if applicable
4. Return to Dashboard preserves active grouping and filters where possible.
5. Quick actions prefer modals/drawers over full navigation when the operator should remain in fleet context.

---

## 11. Minimal Account Detail Bridge for Step 7

Because the dashboard opens Account Detail and some post-action flows need an immediate deeper explanation, Step 7 defines only the minimum bridge contract.

Required bridge payload:
- account identity header
- why-this-state summary
- latest consequence summary from Step 6 if opened immediately after an action
- active alerts
- recent timeline slice
- return path back to Dashboard preserving filter/group context

This is not the full Account Detail screen spec.
It exists only so the Command Center has a coherent drill-down target.

---

## 12. Implementation Notes Against Current Repo Shape

The public repo currently exposes placeholder-only `src/lib/services`, `src/lib/view-models`, and `src/features/dashboard` directories.
That means Step 7 should be added as new files within the existing scaffold rather than as a patch against already-present dashboard implementation files.

Recommended placement:
- `src/features/dashboard/commandCenterScreen.tsx`
- `src/features/dashboard/commandCenterController.ts`
- `src/features/dashboard/commandCenterActions.ts`
- `src/lib/view-models/dashboard/commandCenterViewModels.ts`
- `src/lib/view-models/dashboard/commandCenterMapper.ts`

---

## 13. Definition of Done for Step 7

Step 7 is complete when:
1. Dashboard opens as a composed mission-control surface.
2. The operator can understand what matters today in seconds.
3. Tradable, restricted, stopped, and degraded accounts are easy to distinguish.
4. Command Center actions consume Step 6 workflow outputs without local guesswork.
5. Refresh behavior follows Step 6 invalidation keys.
6. Quiet and degraded conditions remain trustworthy.
7. The dashboard feels like fleet mission control, not a generic BI dashboard.
