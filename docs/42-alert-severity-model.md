# Veradmin Alert Severity Model

Version: 1.0  
Status: Active  
Owner: Product / UX / Rule Engine / Engineering  
Applies To: Alert creation, severity assignment, alert presentation, dashboard priority, alert-screen grouping, and operator attention management

---

## 1. Purpose of This Document

This document defines the canonical alert severity model for Veradmin.

Alerts are one of the main ways the product manages operator attention. If severity is inconsistent, noisy, or vague, the product weakens rather than improves decision quality.

---

## 2. Canonical Severity Levels

Recommended severity levels:

1. Critical
2. High
3. Medium
4. Low
5. Resolved

---

## 3. Severity Definitions

### Critical
An alert representing a condition that directly threatens safe operation, trustworthy interpretation, or immediate tactical use.

Examples:
- daily restriction triggered
- account hard-breach condition reached
- active account missing governing rule profile
- critical restore/migration uncertainty

Dashboard behavior:
- highest visibility
- top alert zone
- strong mission-panel influence

### High
An alert that should be handled soon because it meaningfully affects tactical or business posture, but is not the most severe immediate threat.

Examples:
- high-impact news window approaching
- account near critical lives threshold
- payout request window open
- refund/admin action due
- full-size permission lost

Dashboard behavior:
- strongly visible
- important but below critical

### Medium
An alert that matters, but does not require urgent interruption.

Examples:
- approaching payout readiness
- future rotation shift needing awareness
- non-urgent state change

### Low
A reminder or informational item with limited urgency and low tactical impact.

Examples:
- low-priority admin reminder
- quiet informational notice

### Resolved
An alert that once mattered but is no longer active. It remains for history and review.

---

## 4. Severity Assignment Criteria

Severity should be assigned based on:
- immediacy
- tactical impact
- business/admin impact
- degree of action constraint
- trust/integrity implications
- reversibility
- whether the condition is active now or merely approaching

---

## 5. Tactical vs Administrative Severity

Urgency and category are not the same thing.

Examples:
- a tactical risk alert may be Critical
- a payout request reminder may be High
- a refund reminder may be High or Medium depending on timing
- a future calendar shift may be Medium
- a low-impact informational item may be Low

---

## 6. Example Severity Assignments

### Critical
- “Daily restriction triggered”
- “Account breached”
- “Rule profile missing on active account”
- “Restore integrity uncertain”

### High
- “High-impact news window begins in 20 minutes”
- “Only fractional risk remains”
- “Payout request due now”
- “Refund task unresolved and due”

### Medium
- “Account approaching payout readiness”
- “Rotation change begins tomorrow”
- “Evaluation progress milestone reached”

### Low
- “Recent note added”
- “Informational summary reminder”

### Resolved
- “Daily restriction no longer active”
- “Refund received”
- “Payout request completed”

---

## 7. UI Treatment Rules

Severity should influence:
- position on Dashboard
- color semantics
- grouping on Alerts screen
- mission-panel inclusion
- badge prominence
- whether acknowledgment controls are visible

Recommended behavior:
- Critical: highest emphasis
- High: strong emphasis
- Medium: moderate emphasis
- Low: subdued emphasis
- Resolved: history only

---

## 8. Definition of Done

This specification is satisfied when:
1. Veradmin has a stable severity model.
2. Alert urgency is understandable and consistent.
3. Dashboard and Alerts screen use the same severity logic.
4. Tactical and administrative alerts are prioritized correctly.
5. Resolution behavior remains clear.
6. Contributors can classify new alerts without inventing new schemes.
7. The product manages attention better than a generic notification system.
