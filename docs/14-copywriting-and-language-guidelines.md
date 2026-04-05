# Veradmin Copywriting and Language Guidelines

Version: 1.0  
Status: Active  
Owner: Product / UX Writing / Design / Engineering  
Applies To: UI copy, labels, alerts, explanations, onboarding text, confirmations, empty states, and all in-product language

---

## 1. Purpose of This Document

This document defines how Veradmin should speak.

Veradmin is not only a product of rules, screens, and calculations.
It is also a product of language.

The words the product uses shape how the operator thinks, feels, and acts.
If the copy is vague, dramatic, noisy, overconfident, or inconsistent, the system loses authority.
If the copy is calm, precise, and operationally useful, the system reinforces discipline.

This document exists so that Veradmin’s language remains aligned with its doctrine:
clear, restrained, authoritative, and action-guiding.

---

## 2. Language Mission

The language in Veradmin must do five things well:

1. Reduce ambiguity.
2. Reinforce disciplined decision-making.
3. Explain state without emotional manipulation.
4. Make the next action obvious.
5. Preserve trust under pressure.

Veradmin should sound like a calm tactical operating system, not a hype-driven trading app.

---

## 3. Tone of Voice

Veradmin’s tone should be:

- calm
- precise
- serious
- professional
- operational
- restrained
- quietly authoritative

It should not sound:
- promotional
- theatrical
- slang-heavy
- emotionally loaded
- sarcastic
- overly clever
- hyper-technical without reason

The product should feel like a composed mission console.
It should never feel like social-media trading culture inside a desktop app.

---

## 4. Core Writing Principles

### 4.1 Say what is true

Copy must describe actual system state, not optimistic interpretation.

### 4.2 Prefer operational language over emotional language

Bad:
- “You’re in danger!”
- “Amazing performance”
- “Crushing it”

Better:
- “Daily restriction active”
- “Payout-ready”
- “Mode changed to Preservation”
- “Only fractional risk remains”

### 4.3 Make the next action visible

Whenever the system surfaces something important, it should help answer:
- what happened,
- why it matters,
- and what the operator should do next.

### 4.4 Be brief, but not cryptic

The copy should be concise without becoming mysterious.

### 4.5 Avoid fake certainty

If a recommendation is based on configured policy or internal assumptions, the copy should reflect that honestly.

---

## 5. Product Voice by Context

Different surfaces need slightly different language behavior.

### 5.1 Dashboard language

Purpose:
- orient quickly
- surface priority
- reduce scanning effort

Style:
- short
- high-signal
- compact
- state-first

Examples:
- “3 accounts tradable”
- “2 accounts near daily restriction”
- “1 payout request due”
- “News restriction active at 13:30”

### 5.2 Account view language

Purpose:
- explain current state
- show permissions and restrictions
- provide deeper context

Style:
- clear
- explanatory
- slightly more complete than dashboard copy

Examples:
- “This account is in Preservation Mode because payout eligibility is near and effective risk space is reduced.”
- “Full-size risk is not allowed because the daily limit is now more restrictive than the hard account limit.”

### 5.3 Alerts language

Purpose:
- force attention without panic
- differentiate urgency

Style:
- direct
- plain
- severity-aware

Examples:
- Critical: “Daily restriction triggered. Trading should stop until reset.”
- High: “High-impact news window begins in 20 minutes.”
- Medium: “Refund task still unresolved.”

### 5.4 Confirmation language

Purpose:
- prevent accidental destructive actions

Style:
- explicit
- consequence-aware
- not overdramatic

Example:
- “Restore this backup? Your current local state will be preserved in a safety backup before restore continues.”

### 5.5 Empty-state language

Purpose:
- reassure and guide
- avoid broken-product feeling

Style:
- calm
- clear
- lightly helpful

Examples:
- “No active alerts right now.”
- “No payout-ready accounts yet.”
- “No events match this filter.”

---

## 6. Terminology Rules

Veradmin must use a stable internal vocabulary.

Preferred terms:
- account
- fleet
- mode
- stage
- tradable
- restricted
- stopped
- payout-ready
- lives
- fractional risk
- daily restriction
- hard breach floor
- next action
- mission
- note
- event
- audit history

Avoid needless synonyms for core terms.
For example, do not mix:
- “bullets,” “lives,” “shots,” and “risk units” interchangeably in the UI

The product may explain that “Lives” means standardized risk units, but the chosen term must remain stable.

---

## 7. Naming Conventions for UI Labels

### 7.1 Prefer nouns for destinations

Good:
- Dashboard
- Accounts
- Journal
- Payouts
- Calendar
- Alerts
- Settings

### 7.2 Prefer verbs for actions

Good:
- Log Win
- Log Loss
- Add Note
- Request Payout
- Create Backup
- Restore Backup

### 7.3 Prefer explicit labels over clever ones

Bad:
- “Launch Pad”
- “Pulse”
- “Money Zone”

Better:
- “Dashboard”
- “Fleet Health”
- “Payouts”

Veradmin should feel clear, not branded-to-death.

---

## 8. Writing for State and Mode

Modes and state labels must be extremely consistent.

Recommended mode labels:
- Attack
- Preservation
- Recovery
- Payout Protection
- Cooldown
- Stopped
- Breached

Rules:
- capitalize mode names consistently
- avoid playful renaming
- ensure each mode has one canonical explanation

Each mode should be paired with a short explanatory sentence pattern.

Examples:
- “Attack Mode: full-size deployment remains allowed under current constraints.”
- “Preservation Mode: capital protection takes priority over growth under current state.”
- “Cooldown Mode: this account is temporarily inactive under policy or restriction.”
- “Stopped: trading is currently not allowed.”

---

## 9. Writing for Numbers and Thresholds

When presenting numbers:
- include units where needed
- avoid forcing the user to interpret naked values
- prefer labels that explain the number’s role

Bad:
- “1.2”
- “-3%”
- “1500”

Better:
- “1.2 effective lives”
- “3% daily threshold”
- “1500-point standard distance”

If decimals are shown, they should be intentional and meaningful.
Do not over-precision the interface.

---

## 10. Writing for Recommendations

Recommendations must sound helpful but not omniscient.

Bad:
- “You should definitely trade this account now.”
- “This is the best account.”

Better:
- “This account currently has the strongest operational posture.”
- “This account is currently prioritized based on configured rules.”
- “Protection is recommended here.”
- “Fractional-only execution is advised under current constraints.”

The product should feel smart and disciplined, not bossy or magical.

---

## 11. Writing for Errors

Errors must be:
- plain
- specific
- actionable where possible

Bad:
- “Something went wrong.”
- “Operation failed.”

Better:
- “Backup could not be created because the destination path is unavailable.”
- “Restore was stopped because the selected backup uses an incompatible schema version.”
- “This event could not be saved because the account reference is missing.”

Do not blame the user unless the user’s action actually caused the issue.

---

## 12. Writing for Destructive Actions

Destructive or high-impact actions require stronger language.

Examples:
- delete account
- restore backup
- overwrite settings
- remove history
- reset local data

Guidelines:
- explain impact clearly
- confirm the action explicitly
- offer safe alternatives when possible
- avoid vague confirmation buttons like “Yes” when the consequence is meaningful

Prefer:
- “Restore Backup”
- “Delete Account”
- “Overwrite Current State”

---

## 13. Help Text and Explanatory Copy

Help text should exist where:
- a concept may be misunderstood
- a system label needs grounding
- a threshold is important
- a setting can alter behavior meaningfully

Good help text is:
- brief
- specific
- adjacent to the concept
- written in plain language

Bad help text is:
- long essays hidden everywhere
- generic repeated explanations
- jargon-heavy internal language

---

## 14. Empty States, Quiet States, and Non-Urgent Messaging

Veradmin must handle calm conditions gracefully.

Examples:
- “No active alerts.”
- “No unresolved payout tasks.”
- “No journal entries for this account yet.”

These states should feel:
- reassuring
- controlled
- complete

They should not feel like missing content or unfinished design.

---

## 15. Anti-Patterns to Avoid

Avoid:
- hype language
- slang
- motivational clichés
- emotionally manipulative warnings
- jargon where plain language works
- synonym drift for core concepts
- ambiguous labels
- cute metaphors where system clarity matters
- overlong explanatory paragraphs in tactical surfaces

---

## 16. Definition of Done for Copywriting and Language

This spec is satisfied when:

1. Core product terms are stable and consistent.
2. The app sounds calm and authoritative across all screens.
3. States, modes, actions, and restrictions are described clearly.
4. Alerts feel urgent when needed without becoming theatrical.
5. Errors are actionable and understandable.
6. Recommendations are disciplined, not overconfident.
7. The product’s language reinforces trust and operational clarity.

---

## 17. Future Considerations

Potential later additions:
- localization/internationalization guidelines
- voice/tone rules for AI-generated briefings
- glossary and tooltips index
- accessibility language checks
- reading-level audit for critical states

These are valuable later, but v1 must first sound consistent, disciplined, and trustworthy.
