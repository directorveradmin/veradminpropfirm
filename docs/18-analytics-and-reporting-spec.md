# Veradmin Analytics and Reporting Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Data / Engineering  
Applies To: Metrics, summaries, analytical views, fleet reporting, operational review, and historical performance interpretation

---

## 1. Purpose of This Document

This document defines how Veradmin should handle analytics and reporting.

Veradmin is not a toy analytics dashboard.
It is a tactical operating system.
That means analytics must serve disciplined decision-making and business awareness rather than vanity, entertainment, or chart overload.

This document exists so that:
- metrics are chosen intentionally,
- reports answer real operational questions,
- analytics remain subordinate to tactical clarity,
- and the product avoids becoming an over-decorated performance board.

---

## 2. Analytics Mission

Analytics in Veradmin must do four things well:

1. Help the operator review what happened.
2. Help the operator understand why it happened.
3. Help the operator improve fleet decisions over time.
4. Help the operator manage the fleet as a business, not just a set of trades.

Analytics should support learning, protection, and planning.

---

## 3. Analytics Principles

### 3.1 Operational relevance over novelty

Only include metrics that help explain state, behavior, risk, or business outcomes.

### 3.2 Interpretation before decoration

A number or chart should not exist unless the user can act on it or learn from it meaningfully.

### 3.3 Fleet-first perspective matters

Because Veradmin manages multiple accounts, analytics must operate at:
- fleet level
- segment level
- account level

### 3.4 History should support explanation

Reports should show not only outcomes, but state transitions, restrictions, and timing context when relevant.

### 3.5 Avoid vanity metrics

Analytics should not encourage ego-driven thinking or distorted behavior.

---

## 4. Analytics Categories

Veradmin should support at least the following categories.

### 4.1 Tactical analytics
Used to understand current and recent operating behavior.

Examples:
- current tradable count
- mode distribution
- restriction distribution
- alert frequency
- near-risk account count

### 4.2 Performance analytics
Used to understand trade and account outcomes.

Examples:
- wins/losses
- custom trade outcomes
- outcome distribution by session
- results by stage
- results by setup tag

### 4.3 Risk analytics
Used to understand fleet survivability and exposure.

Examples:
- lives distribution
- accounts near critical thresholds
- frequency of Preservation Mode
- frequency of daily stops
- proportion of fleet in restricted states

### 4.4 Business analytics
Used to understand payouts, cash-flow, and business-level operational value.

Examples:
- payout count
- pending payouts
- average payout cadence
- refund completion rate
- realized monthly income
- account cost vs payout relationship

### 4.5 Review analytics
Used in weekly or monthly review.

Examples:
- top operational errors
- most common blockers to payout readiness
- rotation load clustering
- repeated alert categories
- mode transition patterns

---

## 5. Reporting Levels

Reports should exist at different levels of zoom.

### 5.1 Fleet-level reports

Answer questions like:
- How healthy is the fleet overall?
- Are payouts smoothing out or clustering?
- Are too many accounts living in restricted modes?
- What did this week look like across the operation?

### 5.2 Segment-level reports

Segments may include:
- by firm
- by stage
- by mode
- by funded vs evaluation
- by time period

### 5.3 Account-level reports

Answer questions like:
- How has this account progressed?
- What triggered its recent state changes?
- Is this account repeatedly entering Preservation Mode?
- How close is it to payout behavior that needs protection?

---

## 6. Core v1 Metrics

Recommended v1 metric set:

### Fleet
- total accounts
- tradable accounts
- restricted accounts
- stopped accounts
- payout-ready accounts
- average effective lives
- fleet health score
- active alert count by severity

### Performance
- total wins
- total losses
- total custom outcomes
- win/loss ratio where meaningful
- result distribution by session
- result distribution by stage

### Risk
- number of accounts under 1 life
- number of accounts under defined preservation threshold
- daily stop count over selected period
- accounts in each mode

### Business
- payout-ready count
- payouts requested
- payouts received
- pending payout amount if tracked
- refund tasks open/completed
- realized monthly payout totals

These should be enough for meaningful review without bloating v1.

---

## 7. Reporting Surfaces

Analytics should appear in multiple forms.

### 7.1 Dashboard summary metrics
Compact, tactical, high-signal.

### 7.2 Dedicated reports or review screens
More interpretive and period-based.

### 7.3 Account detail metrics
Focused on one account’s trajectory.

### 7.4 Exported reports
Useful for review outside the app, accounting, or archival purposes.

Not every metric needs a chart.
Many important metrics are better expressed as structured summaries or tables.

---

## 8. Time Horizons for Analytics

Veradmin should support at least:
- today
- last 7 days
- last 30 days
- custom date range

Later, weekly and monthly review templates may become more formalized.

The time range must always be visible so interpretation stays anchored.

---

## 9. Charts and Visual Reporting Guidance

Charts should be used sparingly and purposefully.

Good chart candidates:
- payouts over time
- mode distribution over time
- alert category frequency
- account lifecycle timeline
- rotation load view
- session result comparison

Bad chart candidates:
- decorative graphs that duplicate obvious numbers
- highly dense chart dashboards that bury actions
- visualizations that encourage obsessive short-term emotional reading

Veradmin should remain operational first.

---

## 10. Weekly and Monthly Review Reporting

The product should eventually support lightweight review surfaces or exports that answer:

### Weekly review
- what changed this week
- which accounts improved
- which accounts became more fragile
- which payouts advanced
- what alert patterns repeated
- what operational mistakes or friction appeared

### Monthly review
- realized payouts
- average fleet health
- mode distribution trends
- stage progression
- account attrition or breach patterns
- refund completion performance
- business-level outcome summary

These reviews help turn Veradmin into a long-term operating companion.

---

## 11. Reporting and Explainability

Analytics must preserve context.

Examples:
- if an account spent time in Preservation Mode, the report should be able to explain that this was not just “underperformance,” but a result of rule and protection logic
- if payout volume dropped, the report may need to show whether fewer accounts were eligible or whether rotation policy shifted
- if alert frequency rose, the product should help classify whether they were news-driven, risk-driven, or admin-driven

Without context, reports become misleading.

---

## 12. Reporting for Business Operations

Because Veradmin also manages the fleet as a business, reporting should support:
- payout forecasting awareness
- unresolved admin task visibility
- refund status review
- cost vs payout interpretation where data is available
- cadence and clustering analysis

These views should help smooth operations rather than merely summarize them.

---

## 13. Exportable Reporting

Useful report exports may include:
- account timeline report
- payout history report
- journal activity report
- alert history report
- monthly business summary
- fleet health snapshot for a selected period

Exports should remain clear, labeled, and scoped.

---

## 14. Metrics Governance

Not every metric should be accepted into the product.

Before adding a metric, ask:
1. What decision or review question does it support?
2. Is it likely to improve operational clarity?
3. Could it distort behavior if overemphasized?
4. Does it duplicate other clearer measures?
5. Does it deserve persistent visibility, or only occasional reporting?

This governance matters because analytics creep can quietly damage the product.

---

## 15. Analytics Anti-Patterns to Avoid

Avoid:
- performance-brag metrics with little operational value
- chart overload
- unclear date ranges
- metrics that require deep mental decoding
- mixing tactical and reflective analytics without distinction
- presenting raw numbers without interpretation support
- using analytics to gamify risky behavior

---

## 16. Definition of Done for Analytics and Reporting

This spec is satisfied when:

1. Core reports answer real operational and business questions.
2. Metrics are scoped intentionally and explained clearly.
3. Fleet, segment, and account views are all supported meaningfully.
4. Analytics help review and planning without overwhelming tactical surfaces.
5. Charts are used purposefully, not decoratively.
6. Reports preserve enough context to avoid misleading interpretations.
7. The product supports learning and planning, not just display.

---

## 17. Future Considerations

Potential later additions:
- guided weekly review wizard
- anomaly detection
- AI-generated review summaries
- report scheduling
- custom report builder
- profitability vs rule-pressure overlays
- compare-period analysis
- operator-defined KPI panels

These are valuable later, but v1 must first establish disciplined, useful reporting.
