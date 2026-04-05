# Veradmin Journal Screen Specification

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Data  
Applies To: Journal screen, event history browsing, trade/event filtering, timeline inspection, note review, and account-history workflows

---

## 1. Purpose of This Document

This document defines the Journal screen in detail.

The Journal screen is where Veradmin’s operational memory becomes visible and usable.
It is not merely a trade list.
It is the system-wide history surface where the operator can review what happened, when it happened, why it matters, and how current state was reached.

This document exists so the Journal screen becomes:
- readable,
- structured,
- useful for both quick review and deep investigation,
- and aligned with Veradmin’s doctrine of explainable tactical control.

The Journal screen must not become:
- a generic activity log,
- a cluttered spreadsheet,
- or a loose note feed with inconsistent meaning.

---

## 2. Screen Mission

The Journal screen must answer:

1. What happened recently across the fleet?
2. What happened to a specific account over time?
3. Which events changed operational state meaningfully?
4. Where are the important notes, payouts, warnings, and transitions?
5. How do I inspect history without losing structure?

The Journal screen exists to reduce memory burden and increase explainability.

---

## 3. Primary User Scenarios

The Journal screen must support at least:

### 3.1 Recent activity review
The user wants to know what changed today or recently.

### 3.2 Account investigation
The user wants to inspect one account’s history in depth.

### 3.3 Event-type review
The user wants to view only payouts, only notes, only trade outcomes, or only transitions.

### 3.4 Operational audit
The user wants to understand why a current state exists.

### 3.5 Review workflow
The user wants to use the journal as part of end-of-day or weekly review.

### 3.6 Search and recovery of context
The user remembers an event, note, or status change and wants to find it quickly.

---

## 4. Screen Structure

Recommended screen hierarchy:

1. Journal header and controls
2. Filter and search bar
3. Summary strip or review context
4. Main event list / timeline
5. Event detail panel or drawer
6. Optional account context panel

This structure supports both scanning and investigation.

---

## 5. Journal Header

The header should make the screen’s role obvious.

Recommended contents:
- page title
- current selected scope or filter summary
- export access if appropriate
- quick “Add Note” or “Log Event” shortcut if allowed here
- visible date-range context when relevant

The header should feel operational, not editorial.

---

## 6. Filter and Search Controls

The Journal screen must support efficient filtering.

Recommended filters:
- all events
- trade results
- notes
- payouts
- admin events
- alerts
- mode transitions
- system events
- by account
- by firm
- by stage
- by date range

Search should support:
- note text
- account label
- event labels
- payout/admin keywords where possible

The active filter state must be clearly visible.

---

## 7. Summary Strip or Review Context

At the top of the journal, a compact review strip may show:
- number of events in current scope
- most recent event time
- number of affected accounts
- event-type distribution in selected range
- unresolved notable items if relevant

This should help the user orient to what they are looking at, without overpowering the history itself.

---

## 8. Main Event List

The Journal’s main body should be an event list or structured timeline.

Each entry should clearly show:
- timestamp
- event type
- account label
- short summary
- visual severity or relevance marker if applicable
- whether the event affected state meaningfully
- expandable detail affordance

The event list should support dense information, but remain easy to scan.

---

## 9. Event Categories and Presentation

Recommended event categories include:
- win
- loss
- custom trade result
- note
- payout request
- payout received
- refund task / refund received
- pause / resume
- mode change
- restriction triggered
- reset
- profile change
- system warning or integrity event

Each category should have stable visual treatment and copy patterns.
A user should be able to recognize event type quickly.

---

## 10. Event Detail View

Clicking or expanding an event should reveal meaningful detail.

Recommended event detail fields:
- full timestamp
- account reference
- event type
- structured fields relevant to that event
- note content if applicable
- state effect summary
- related warnings triggered or resolved
- before/after values if useful
- source (manual/system/import/restore) where relevant

The detail view should explain the event, not just repeat the summary line.

---

## 11. Account Context Within the Journal

When the journal is filtered to a specific account, the screen should help the user stay anchored.

Recommended account context:
- account header summary
- current mode
- current tradable status
- quick link back to Account Detail screen
- account-specific date range summary
- count of events in selected range

This helps the Journal function as part of a deeper account investigation flow.

---

## 12. Notes in the Journal

Notes are one of the Journal’s most useful but potentially messy elements.

Rules:
- notes should appear as structured event entries
- note category should be visible if used
- long notes should be previewed with expansion
- notes should remain distinct from trade outcomes and admin actions
- note timestamps and account association must be explicit

Notes should enrich history, not blur it.

---

## 13. Trade Results in the Journal

Trade result entries should be more informative than raw P/L rows.

Recommended visible elements:
- win/loss/custom result type
- standardized unit effect if relevant
- monetary result if tracked
- session label
- rule-following indicator if used
- short note or tag preview
- resulting state effect if meaningful

The Journal should show not only that a trade occurred, but whether it mattered structurally.

---

## 14. Journal as Timeline vs Journal as Table

The Journal may support a hybrid presentation, but its primary mental model should remain “structured operational timeline.”

A table view may be useful for some scopes or exports, but the screen should prioritize:
- sequence
- event meaning
- drill-down clarity

Veradmin’s Journal is primarily about narrative structure and explainability, not just row density.

---

## 15. Navigation Relationships

The Journal should connect naturally to:
- Command Center
- Account Detail
- Payouts
- Alerts
- specific filtered review flows

Examples:
- clicking an account opens Account Detail
- clicking a payout event may open Payouts detail
- clicking a mode transition may show related explanation context
- clicking alert-linked event may reveal alert context

The screen should feel integrated, not isolated.

---

## 16. Empty and Quiet States

The Journal screen must handle low-activity states gracefully.

Examples:
- no events in this range
- no notes for this account
- no payouts in current scope
- no results matching this filter

These states should feel calm and informative, not broken.

Examples:
- “No journal entries match this filter.”
- “No payout events were recorded in this date range.”
- “This account has no notes yet.”

---

## 17. Error and Degraded States

If part of the Journal cannot load reliably, the screen must say so explicitly.

Examples:
- note content unavailable
- event history partially unavailable
- account reference missing
- system event rendering failed
- date range query failed

The Journal should never silently omit meaningful history if it knows something is missing.

---

## 18. UX Tone and Visual Feel

The Journal should feel:
- readable
- serious
- structured
- calm
- investigative
- precise

It should not feel:
- noisy
- like a chat app
- like a BI report masquerading as history
- overly decorative
- difficult to scan

The Journal is operational memory made visible.

---

## 19. Anti-Patterns to Avoid

Avoid:
- mixing all event types into visually identical rows
- hiding timestamps or account references
- making note content dominate the screen
- building only a table with no event meaning cues
- making it hard to filter by account or date
- burying event detail under too many clicks
- treating the Journal as an afterthought compared with the dashboard

---

## 20. Definition of Done for the Journal Screen

This spec is satisfied when:

1. The user can review recent history across the fleet clearly.
2. The user can investigate one account’s event history in depth.
3. Filters and search support real review workflows.
4. Event categories remain structured and understandable.
5. Notes, payouts, transitions, and trade results are all usable in one coherent system.
6. The screen supports explainability, not just archival storage.
7. The Journal feels like trustworthy operational memory, not a random activity feed.

---

## 21. Future Considerations

Potential later additions:
- saved journal filters
- compare-account history views
- review mode for weekly/monthly summaries
- richer note categorization
- print/export-friendly timeline layouts
- AI-assisted historical summaries

These are valuable later, but v1 must first make the Journal screen structured and genuinely useful.
