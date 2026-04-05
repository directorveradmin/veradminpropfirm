# Veradmin Trade Logging and Journaling Specification

Version: 1.0  
Status: Active  
Owner: Product / Core Logic / UX / Data  
Applies To: Trade entry, event capture, journaling UX, operational memory, auditability, and post-action state updates

---

## 1. Purpose of This Document

This document defines how Veradmin records trades, notes, account events, and journaling information.

Trade logging in Veradmin is not merely record keeping.
It is one of the product’s core control surfaces.

The moment a user logs a win, a loss, a payout, a pause, or an important note, Veradmin must not only store history. It must update the account’s current operational truth and preserve enough context to explain why that truth changed.

This document exists to prevent the journaling layer from becoming:
- a thin text diary,
- a disconnected spreadsheet,
- or a non-structured notes drawer.

Veradmin journaling must be structured, explainable, recoverable, and operationally useful.

---

## 2. Journaling Mission

The journaling layer must serve five purposes:

1. Preserve a trustworthy history of what happened.
2. Update system state safely after meaningful events.
3. Explain how current account status was reached.
4. Enable future review, analytics, and auditing.
5. Reduce memory burden on the operator.

If the operator has to remember key details outside Veradmin, journaling is incomplete.

---

## 3. Core Concepts

Veradmin should distinguish between four related but different concepts:

### 3.1 Trade log entry

A structured record of a trade outcome or trade-related action.

### 3.2 Journal note

A user-authored note tied to an account, event, date, or trade.

### 3.3 Operational event

A system-recognized state change such as:
- payout requested
- payout received
- mode changed
- account paused
- daily reset
- rule profile changed

### 3.4 Audit event

A low-level explainability record preserving who or what changed what, when, and why where possible.

These concepts may appear together in the UI, but they must not be collapsed into one ambiguous record type.

---

## 4. Journaling Principles

### 4.1 Structured first, freeform second

Important operational data should be captured in structured fields before optional notes.

### 4.2 Logging should be fast

The user should be able to log a standard win or loss quickly.
Fast logging is not a luxury. It is necessary for real daily use.

### 4.3 Every meaningful log should explain its consequences

After an event is logged, the app should show what changed:
- lives changed
- mode changed
- restriction activated
- payout state changed
- warning created

### 4.4 Journaling is operational, not performative

The purpose is not to create a pretty journal for later admiration.
The purpose is to preserve operational memory and state explainability.

### 4.5 History should support both quick review and deep inspection

The user should be able to glance at recent events but also drill into detail when needed.

---

## 5. Minimum Event Types for v1

Veradmin v1 should support at least the following loggable event types.

### 5.1 Trade result events
- win
- loss
- custom trade result

### 5.2 Non-trade account events
- note added
- payout requested
- payout received
- fee refund pending
- fee refund received
- account paused
- account resumed
- stage manually updated
- rule profile updated
- manual balance adjustment
- daily reset recorded
- manual warning acknowledgment

### 5.3 System-generated events
- mode changed
- tradable status changed
- full-size permission removed
- account stopped by daily restriction
- payout readiness achieved
- payout readiness lost
- alert generated
- alert resolved

---

## 6. Trade Logging Specification

### 6.1 Fast log actions

The product should support at minimum:
- Log Win
- Log Loss
- Log Custom

These actions must be accessible from:
- dashboard card quick actions
- account control view
- journal view
- possibly keyboard-driven command flow later

### 6.2 Win and loss logging defaults

A standard win/loss entry should populate known defaults where appropriate.
For example, if the system is configured around a standard risk unit and standard setup profile, the user should not be forced to repeatedly enter redundant information.

However, defaults must remain editable when:
- trade size differed
- trade was partial
- trade was cut early
- custom notes matter
- the event is being backfilled historically

### 6.3 Custom trade log entry

A custom entry is used when the outcome does not map cleanly to a standard full win or full loss.

Examples:
- partial win
- partial loss
- break-even
- manually closed early
- rule-compliant scratch trade
- exceptional firm-specific event

The custom log flow should still capture structured fields, not degrade into freeform text.

---

## 7. Required Trade Log Fields

At minimum, a trade-related log entry should support:

- account id
- timestamp
- session
- direction if useful
- outcome type
- points or unit result
- monetary result
- whether standard risk was used
- whether trade followed rules
- setup tag if used
- note
- source of entry (manual/import/system)
- created at
- updated at

Additional recommended fields:
- screenshot reference
- related news proximity flag
- trade sequence number for the day
- confidence label if user chooses to use it
- exit type
- custom risk multiplier

Not all fields must be visible in the fastest entry flow, but the model should support them.

---

## 8. Trade Logging UX Flows

### 8.1 One-click win/loss flow

Best for fast daily use.

Flow:
1. User selects account.
2. User clicks Log Win or Log Loss.
3. Compact panel appears with key editable fields.
4. User confirms.
5. System stores event.
6. Rule engine recalculates.
7. App shows result summary:
   - lives before and after
   - mode change if any
   - new warnings if any
   - updated next action

### 8.2 Custom trade flow

Flow:
1. User chooses Log Custom.
2. Form asks for structured fields.
3. User enters the relevant outcome.
4. System validates.
5. Rule engine recalculates against updated balances/state assumptions.
6. App presents impact summary.

### 8.3 Add note flow

Flow:
1. User selects Add Note from account or journal.
2. Note can be typed quickly.
3. User may attach category or tag.
4. Note is stored as its own record and linked to account or event.

Notes should never be the only way important events are captured.

---

## 9. Post-Log Feedback Requirements

After a user logs an event, Veradmin must provide immediate feedback.

Required feedback:
- success confirmation
- what changed
- whether mode changed
- whether tradability changed
- whether lives changed
- whether a new alert was triggered
- where the account now stands operationally

The user should never have to infer downstream consequences from raw balance changes alone.

---

## 10. Journal View Specification

The journal view is the operator’s operational memory interface.

It should support:
- chronological review
- account filtering
- event type filtering
- date range filtering
- search
- drill-down detail
- export

The journal should be useful in two modes:

### 10.1 Quick review mode
A fast stream of recent relevant activity.

### 10.2 Investigative mode
A deeper view where the user can answer:
- what happened to this account last week?
- when did this account enter Preservation Mode?
- which trade pushed it below full-size permissions?
- when was payout requested?

---

## 11. Timeline Behavior

Each account should have a dedicated timeline that merges:
- trade events
- notes
- payout events
- mode changes
- restrictions triggered
- system milestones

This timeline is one of the main ways Veradmin earns trust.
It should make the account’s recent journey understandable.

---

## 12. Notes Specification

Notes are important, but they must be disciplined.

Recommended note categories:
- setup note
- rule note
- payout/admin note
- psychological note
- technical/platform note
- follow-up reminder

Notes should be:
- timestamped
- attributed
- editable with history if necessary
- linkable to relevant account and event context

Notes should not silently mutate operational truth.
If a note implies a state change, that state change should be recorded as an event, not just described in prose.

---

## 13. Journaling and Rule Engine Relationship

Not every note changes state.
But many structured events do.

The rule engine must react to relevant events such as:
- trade logged
- payout requested
- payout received
- manual adjustment
- stage changed
- reset recorded

The journaling layer is therefore upstream of state recomputation in many flows.

This relationship must be explicit in implementation.
UI components must not attempt ad hoc recalculation logic on their own.

---

## 14. Edit and Correction Behavior

People will make mistakes while logging.
The product must support safe correction.

Rules:
- corrections should preserve history where practical
- destructive silent overwrite should be avoided
- corrected entries should either:
  - create a correction event, or
  - preserve modified timestamps and revision metadata

The user should be able to trust that the journal is explainable even when corrections happen.

---

## 15. Import, Export, and Recovery

The journaling system should support:
- CSV export
- JSON export
- account-specific export
- date-range export

Later, import support may be added for historical data, but imports must be clearly tagged so the source of the data is visible.

Recovery matters because journaling is part of the product’s memory.
Losing it weakens trust and review quality.

---

## 16. Journaling Anti-Patterns to Avoid

Avoid:
- freeform text as the primary record
- hidden side effects after logging
- making the user re-enter obvious defaults constantly
- mixing notes and trade outcomes in one ambiguous entry model
- allowing major event edits without traceability
- burying the account timeline under generic analytics
- treating journaling as a secondary afterthought

---

## 17. Definition of Done for Trade Logging and Journaling

This spec is satisfied when:

1. The user can log standard outcomes quickly.
2. Custom outcomes are supported without breaking structure.
3. Every important event is preserved in history.
4. Post-log state changes are shown immediately and clearly.
5. The journal helps explain current state, not just archive the past.
6. Notes are useful without replacing structured operational records.
7. Review, filtering, search, and export work for real daily use.

---

## 18. Future Considerations

Potential later additions:
- screenshot gallery per trade
- broker/platform import helpers
- voice note attachment
- sentiment tagging
- end-of-day review templates
- AI-assisted journal summaries
- recurring checklist records

These are valuable later, but v1 should first nail speed, structure, and explainability.
