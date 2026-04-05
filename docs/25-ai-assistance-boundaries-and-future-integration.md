# Veradmin AI Assistance Boundaries and Future Integration

Version: 1.0  
Status: Active  
Owner: Product / Architecture / UX / Engineering  
Applies To: AI-assisted summaries, recommendation layers, future copilots, automation boundaries, and the relationship between deterministic logic and probabilistic assistance

---

## 1. Purpose of This Document

This document defines how AI assistance may interact with Veradmin, what boundaries must never be crossed, and how future AI features should be integrated without weakening the product’s core trust model.

Veradmin is a tactical control system.
Its core value comes from deterministic, explainable, rule-driven interpretation of a prop-firm fleet.

AI may later improve:
- summaries
- explanations
- reporting
- prioritization guidance
- review assistance
- language generation
- future scenario narration

But AI must never replace the system’s deterministic source of truth.

This document exists so that AI becomes an enhancement layer, not a trust-destroying shortcut.

---

## 2. AI Mission in Veradmin

If AI is used, its role should be to:

1. Explain deterministic product state more clearly.
2. Summarize history and patterns efficiently.
3. Help the operator review and reflect.
4. Suggest questions, comparisons, or review angles.
5. Save time without introducing hidden authority.

AI should support clarity.
It should not become the product’s brain.

---

## 3. Core Principle: Deterministic truth, probabilistic assistance

Veradmin must maintain this hierarchy:

### 3.1 Deterministic layer
The authoritative source of operational truth.

Includes:
- rule engine
- state evaluation
- mode assignment
- tradable status
- lives calculation
- payout readiness evaluation
- alerts derived from configured rules
- simulation based on defined policy logic

### 3.2 AI assistance layer
A secondary interpretive layer.

May include:
- summaries
- explanations
- prioritization narratives
- review overviews
- report drafting
- suggested focal points

The deterministic layer decides what is true.
The AI layer may help explain or organize what is already true.

---

## 4. Boundaries AI Must Not Cross

AI must not:

- silently alter account state
- invent rule interpretations
- override deterministic rule engine outputs
- present speculative judgment as system truth
- change payout status or mode assignment on its own
- silently create or resolve alerts
- perform destructive actions without explicit user confirmation and deterministic guardrails
- hide uncertainty when summarizing incomplete information

If AI ever disagrees with deterministic state, deterministic state wins.

---

## 5. Safe Categories for AI Use

Strong candidates for safe AI assistance include:

### 5.1 Daily briefings
Examples:
- “Today’s highest-priority operational items”
- “Accounts most likely to require protection”
- “Unresolved admin items”

These should be grounded in deterministic product state.

### 5.2 Review summaries
Examples:
- weekly fleet summary
- monthly payout summary
- journal recap
- recurring alert pattern summary

### 5.3 Explanation support
Examples:
- translating engine outputs into more natural language
- summarizing why an account is in a mode
- turning event history into readable narrative

### 5.4 Reporting assistance
Examples:
- drafting management-style summaries from structured product data
- producing human-readable review notes

### 5.5 Guided reflection
Examples:
- “Would you like to compare accounts that entered Preservation Mode this week?”
- “Would you like a summary of unresolved refund tasks?”

These uses enhance understanding without replacing truth.

---

## 6. Unsafe or High-Risk AI Use Cases

High-risk candidates that should be delayed or restricted:

- autonomous account prioritization without explanation
- AI-generated rule profiles treated as active without validation
- AI “best next trade” language that feels predictive
- AI altering balances, payouts, or history
- AI deciding alert severity without transparent deterministic criteria
- AI-generated explanations that are not grounded in current product state
- freeform chat that appears authoritative while bypassing internal rules

These can easily damage trust if introduced carelessly.

---

## 7. Requirements for Grounded AI Assistance

When AI uses Veradmin state, it should be grounded in:
- current deterministic evaluation outputs
- explicit event history
- configured rule profiles
- selected date range and scope
- known account metadata
- clear user request

AI should not infer beyond what the product can support without making that uncertainty explicit.

---

## 8. Explainability Requirements for AI Outputs

Every important AI-assisted output should be explainable in terms of product state.

Examples:
- if AI says an account should be protected, it should be because the deterministic layer already indicates reduced lives, restrictive mode, payout proximity, or alert condition
- if AI says a week looks heavy operationally, it should be because the calendar and rotation layer already show clustered load or admin actions

The operator should always be able to inspect the underlying state behind an AI summary.

---

## 9. Tone and Copy Requirements for AI

AI-generated language inside Veradmin should follow the same copywriting rules as the rest of the product:
- calm
- clear
- non-hype
- serious
- transparent
- operational

AI must not:
- sound like a motivational trading influencer
- exaggerate confidence
- use dramatic risk language
- present guesses as facts
- become verbose when concise clarity is better

AI should feel like a disciplined assistant, not a personality overlay.

---

## 10. UX Placement of AI Features

If AI features are added, they should appear in clearly bounded places.

Good candidates:
- morning brief panel
- review summary drawer
- optional “summarize this account timeline” action
- optional “draft weekly report” action
- optional “explain this state” helper

AI should not dominate core tactical surfaces.
The dashboard must remain understandable even with AI disabled.

---

## 11. Opt-In and Visibility Rules

AI assistance should be:
- clearly labeled
- optional where appropriate
- visually distinct from deterministic state
- dismissible if used in briefing or helper surfaces

The user should always know:
- when content was AI-generated
- what source state it is based on
- whether it is summary/explanation vs authoritative evaluation

Hidden AI authorship would weaken trust.

---

## 12. Data Safety Considerations for AI

If AI processing ever extends beyond purely local deterministic rendering, the product must think carefully about:
- what data is being sent out
- whether note text is included
- whether payout data is included
- whether historical exports or journal details are included
- how privacy and security posture change

A future AI integration must not quietly violate the local-first trust model.

If external AI is added later, the boundaries must be explicit and user-visible.

---

## 13. AI and Simulation

AI may help explain simulations, but it must not replace them.

Safe use:
- summarize likely consequences already returned by the simulation engine
- compare simulation branches in natural language
- draft a short recommendation based on deterministic simulation outputs

Unsafe use:
- inventing scenario outcomes not produced by the engine
- making predictive claims about markets
- presenting probability estimates without an actual deterministic basis

Simulation remains a product logic feature first.

---

## 14. AI and Reporting

AI can add major value in reporting if grounded correctly.

Examples:
- turning structured analytics into readable weekly summaries
- summarizing payout and admin posture
- drafting month-end reflections
- highlighting repeated warning patterns across accounts

AI-generated reports should always remain traceable to structured data.

---

## 15. AI Governance Questions

Before adding any AI feature, ask:

1. What deterministic data grounds this feature?
2. What user problem does it solve faster or better?
3. Could this feature mislead the operator if phrased badly?
4. Does the user clearly know what is authoritative vs assistive?
5. Does this increase or decrease trust?
6. Can the feature be turned off without harming core usability?
7. What security/privacy boundary changes does it introduce?

These questions should gate AI expansion.

---

## 16. Anti-Patterns to Avoid

Avoid:
- making AI seem like the source of product truth
- ambiguous AI-generated recommendations without grounding
- chat-based interfaces that bypass deterministic surfaces
- importing hype or pseudo-expertise tone
- auto-actions based on AI without hard deterministic guardrails
- adding AI because it feels modern rather than useful

---

## 17. Definition of Done for AI Assistance Boundaries and Future Integration

This spec is satisfied when:

1. Deterministic logic remains the authoritative source of truth.
2. AI is constrained to safe supportive roles.
3. AI outputs are grounded, labeled, and explainable.
4. AI never silently mutates core state.
5. The user can distinguish assistance from evaluation.
6. Potential privacy/security impacts are treated explicitly.
7. The product stays trustworthy even as AI features are added.

---

## 18. Future Considerations

Potential later additions:
- local-only AI summaries
- externally powered review assistant with explicit data controls
- guided weekly review drafting
- explanation copilot for rule outputs
- bounded natural-language query over local structured state
- AI-assisted documentation generation from fleet history

These are valuable later, but only if deterministic trust remains primary.
