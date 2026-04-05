# Veradmin Payouts Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Operations  
Applies To: Payouts screen, payout-readiness review, payout workflows, refund tasks, pending receipts, and business-level money operations

---

## 1. Purpose of This Document

This document defines the Payouts screen in detail.

The Payouts screen is where Veradmin’s business layer becomes tangible.
It is not just a place to list withdrawals.
It is the surface where the operator can understand:
- which accounts are payout-ready,
- what is blocking payout,
- what has already been requested,
- what is pending,
- and what administrative tasks still matter.

This document exists so the Payouts screen becomes a real operating surface for cash-flow management rather than a simple ledger page.

---

## 2. Screen Mission

The Payouts screen must answer:

1. Which accounts are payout-ready right now?
2. Which accounts are close, but not ready yet?
3. What blockers remain?
4. Which payout requests are pending?
5. Which receipts have arrived?
6. Which refund/admin tasks are unresolved?
7. What does near-term fleet cash flow look like?

The screen should help the operator manage the fleet as a business.

---

## 3. Primary User Scenarios

The Payouts screen must support at least:

### 3.1 Payout readiness scan
The user wants to know which accounts are ready for action.

### 3.2 Blocker review
The user wants to know why an account is not yet payout-ready.

### 3.3 Request workflow
The user wants to mark a payout as requested or received.

### 3.4 Refund/admin task handling
The user wants to resolve fee refund or payout-related admin items.

### 3.5 Cash-flow review
The user wants to understand the current payout pipeline.

### 3.6 Historical review
The user wants to look back at payout events across time.

---

## 4. Screen Structure

Recommended screen structure:

1. Payout header
2. Payout summary strip
3. Readiness and pending sections
4. Main payout table or card list
5. Detail panel or drawer
6. Refund/admin task panel
7. Historical payout section or linked view

The screen should surface action and status before lower-priority history.

---

## 5. Payout Header

Recommended contents:
- page title
- quick summary of ready / pending / received counts
- current date or time-range context
- optional quick action buttons
- filter controls entry point

This area should create immediate orientation.

---

## 6. Payout Summary Strip

Recommended top metrics:
- payout-ready accounts
- pending payout requests
- payouts received in selected period
- expected incoming amount if tracked
- unresolved refund tasks
- accounts approaching readiness

These metrics should help the operator read the screen before inspecting details.

---

## 7. Readiness Sections

The Payouts screen should make it easy to distinguish between different readiness states.

Recommended sections:
- Ready Now
- Approaching Readiness
- Pending Request
- Received Recently
- Blocked / Not Ready
- Refund/Admin Tasks

This can be implemented through segmented filters, grouped lists, or card sections depending on the final screen layout.

---

## 8. Main Payout List Requirements

Each payout row or card should show:
- account label
- firm
- lifecycle stage
- current mode if relevant
- payout state
- next eligible date or window
- blockers if not ready
- requested date if submitted
- expected arrival / pending status if tracked
- amount if known
- refund/admin indicator if relevant

The goal is not just to show “ready or not,” but to provide enough context for the next business action.

---

## 9. Payout Readiness Explanation

Every payout-ready or not-ready state should be explainable.

For each account, the screen should help answer:
- why is this account ready?
- why is it not ready?
- what remains?
- what changed recently?
- is protection recommended before requesting payout?

The detail view should expose:
- readiness explanation
- blockers list
- next milestone
- relevant recent events
- rule profile context if useful

---

## 10. Payout Actions

Recommended structured actions:
- Request Payout
- Mark Payout Received
- Add Payout Note
- Open Account Detail
- Mark Refund Requested
- Mark Refund Received
- Flag Issue
- Resolve Issue

These actions should be grouped logically and follow confirmation rules where appropriate.

---

## 11. Refund and Admin Tasks

Refund/admin tasks should be visible here as first-class items.

Recommended task types:
- fee refund pending
- refund requested
- refund received
- payout issue follow-up
- waiting-period reminder
- admin note pending

The screen should not force the operator to hunt for these tasks in unrelated areas.

---

## 12. Payout History

The screen should support inspection of payout history.

At minimum it should allow:
- viewing historical requests
- viewing historical receipts
- filtering by date/account/firm
- linking historical payout items to related account history
- exporting payout history if needed

History should support review without overpowering current action areas.

---

## 13. Cash-Flow Awareness

Where data is available, the screen should support near-term cash-flow understanding.

Examples:
- how many payouts are likely soon
- which pending requests represent the largest amounts
- where payouts are clustering
- where refund tasks still reduce realized value

This may be shown as:
- summary cards
- grouped sections
- lightweight charts or timeline aids
- weekly/monthly summary callouts

The screen should remain operational, not accounting-heavy.

---

## 14. Filtering and Search

Recommended filters:
- ready now
- pending
- received
- refund tasks
- by account
- by firm
- by stage
- by date range

Search may support:
- account label
- payout notes
- request status
- firm name

Filters should reduce scanning effort, not complicate the screen.

---

## 15. Relationship to Other Screens

The Payouts screen should integrate with:
- Account Detail
- Command Center
- Journal
- Calendar / Rotation
- Alerts

Examples:
- clicking an account opens Account Detail
- clicking a payout event may open related journal history
- payout-ready counts on the Command Center may deep-link here
- approaching payout windows may correlate with calendar planning

This keeps the business layer connected to the tactical layer.

---

## 16. Empty and Quiet States

The screen must handle:
- no payout-ready accounts
- no pending payouts
- no refund tasks
- no payout history in selected range

These quiet states should feel informative, not disappointing.

Examples:
- “No accounts are payout-ready right now.”
- “No pending payout requests.”
- “No refund tasks remain in this scope.”

---

## 17. Error and Degraded States

If the screen cannot trust some payout data, it must say so.

Examples:
- missing payout history
- invalid payout status references
- inconsistent account/profile linkage
- failed request logging
- pending state unavailable

The user should know whether the problem affects one payout item or the whole screen’s trustworthiness.

---

## 18. UX Tone and Visual Feel

The Payouts screen should feel:
- clear
- businesslike
- calm
- prioritized
- professional
- low-drama

It should not feel:
- like a bank statement clone
- like a casual admin tool
- overly celebratory about money movement
- visually disconnected from the rest of Veradmin

This is a disciplined operating surface, not a celebration panel.

---

## 19. Anti-Patterns to Avoid

Avoid:
- showing only a generic payout table with no readiness explanation
- burying blockers in hidden hover states
- mixing refund tasks into generic notes
- overemphasizing historical data above current actionable status
- making money amounts the only thing visually important
- forcing the user into Account Detail just to know why something is blocked

---

## 20. Definition of Done for the Payouts Screen

This spec is satisfied when:

1. The user can see which accounts are payout-ready immediately.
2. The user can understand blockers for not-ready accounts.
3. Pending and received payout states are easy to review.
4. Refund/admin tasks are visible and manageable.
5. The screen supports both current action and historical review.
6. The screen helps the operator understand near-term cash-flow posture.
7. The Payouts screen feels like a serious business operations tool.

---

## 21. Future Considerations

Potential later additions:
- payout forecasting panel
- cash-flow calendar overlays
- richer payout/export reports
- compare payout cadence across firms
- AI-assisted payout review summaries

These are valuable later, but v1 must first make the Payouts screen operationally decisive and clear.
