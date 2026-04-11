# Step 12 â€” Reporting Surfaces and Review Export Blueprint

Version: 1.0
Status: Step 12 complete
Scope: Reflective reporting surfaces, review workflows, and report-scoped exports
Canonical inputs: `18-analytics-and-reporting-spec.md`, `19-roadmap-and-post-v1-evolution.md`, `25-ai-assistance-boundaries-and-future-integration.md`, `step10_backup_restore_export_blueprint.md`

## 1. Step 12 intent

This blueprint defines the Step 12 reporting layer as a reflective review surface that deepens Veradmin after the daily-driver core is already coherent.

It does **not** replace the Command Center.
It does **not** turn Veradmin into a vanity analytics dashboard.
It does **not** create a second hidden export system.

The reporting layer exists to answer:
- what changed over a selected period,
- why it changed,
- which accounts or segments need review,
- what the fleet looks like as a business,
- and what output should be exported intentionally.

## 2. Frozen decisions

### 2.1 Reporting stays subordinate to tactical truth
The Command Center, account detail, journal, alerts, payouts, and calendar remain the daily operational core.

### 2.2 Reporting should have a dedicated surface
A dedicated `Reports` or `Review` surface is preferred so tactical work stays fast and review work stays reflective.

### 2.3 Scope and time range must remain visible
Every report must show:
- date range,
- fleet / segment / account scope,
- meaningful filters.

### 2.4 Report export reuses Step 10 export doctrine
Reports do not get a second export system.
They reuse the governed export model:
- explicit scope,
- explicit format,
- explicit destination,
- visible result,
- no hidden side effects.

### 2.5 Charts are sparse and purposeful
Charts are allowed only when they clarify timing, clustering, distribution, or change.
They must not dominate the screen.

## 3. Recommended screen structure

1. Header and scope bar
2. Fleet snapshot strip
3. Tactical review section
4. Business review section
5. Segment / account comparison section
6. Export and portability section
7. Recent generated reviews

## 4. Frozen report families

### 4.1 Fleet health snapshot
Covers:
- tradable / restricted / stopped counts
- average effective lives
- payout-ready count
- alert burden

### 4.2 Tactical review report
Covers:
- mode changes
- restriction frequency
- preservation-sensitive accounts
- repeated tactical blockers

### 4.3 Business operations report
Covers:
- payouts requested
- payouts received
- pending payout / refund tasks
- realized payout totals when available

### 4.4 Account trajectory report
Covers:
- key events
- mode transitions
- life / room movement
- payout-readiness movement
- major alerts

### 4.5 Alert pattern review
Covers:
- alert counts by category and severity
- unresolved patterns
- resolved vs unresolved trend

### 4.6 Journal activity review
Covers:
- wins / losses / custom outcomes
- session distribution
- tag/category grouping

## 5. Export behavior

Step 12 freezes:
- CSV for spreadsheet inspection
- JSON for structured fidelity

Every report export must preserve:
- explicit scope,
- explicit format,
- explicit destination,
- explicit success/failure language.

## 6. Quiet and degraded states

Examples:
- `No records matched this review range. Adjust the date range or scope to inspect a broader period.`
- `Alert review data could not be loaded for this range. Current tactical interpretation remains trusted.`

## 7. Definition of done

This reporting layer is satisfied when:
1. reporting remains clearly separate from daily tactical work,
2. report families answer real review and business questions,
3. exports remain intentional and governed,
4. charts remain purposeful,
5. quiet and degraded states stay calm and explicit.