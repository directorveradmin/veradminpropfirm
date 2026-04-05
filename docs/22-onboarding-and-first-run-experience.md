# Veradmin Onboarding and First-Run Experience

Version: 1.0  
Status: Active  
Owner: Product / UX / Engineering / Copy  
Applies To: First-run setup, onboarding flow, initial configuration, seeded examples, user education, and early trust-building

---

## 1. Purpose of This Document

This document defines how Veradmin should introduce itself to a first-time user and how the first-run experience should be structured.

Veradmin is not a generic productivity app.
It is a tactical operating system for managing a prop-firm fleet.
That means the first-run experience must do something difficult and important at the same time:

- make the app approachable,
- preserve its seriousness,
- teach its mental model,
- avoid overwhelming the user,
- and get the user to a trustworthy working state quickly.

This document exists so that onboarding is neither neglected nor turned into a fluffy marketing tour.

---

## 2. Onboarding Mission

The onboarding and first-run experience must do six things well:

1. Explain what Veradmin is in operational terms.
2. Introduce the product’s core mental model.
3. Help the user create or load their first meaningful account setup.
4. Avoid overwhelming them with every advanced concept at once.
5. Build trust in the product’s seriousness and clarity.
6. Get the user to the first “this is useful” moment quickly.

The goal is confidence, not novelty.

---

## 3. First-Run Principles

### 3.1 Serious but welcoming

The product should feel composed and helpful from the first screen.

### 3.2 Explain the mental model early

The user should learn quickly that Veradmin is about:
- fleet awareness
- state clarity
- rule-driven interpretation
- disciplined next-action guidance

### 3.3 Avoid long tutorial overload

Do not force the user through ten slides of generic onboarding.

### 3.4 Set up real value quickly

The fastest path to trust is seeing a real account or realistic example interpreted correctly.

### 3.5 Teach progressively

Advanced ideas such as modes, overlays, simulation, and payout nuances can be introduced gradually.

---

## 4. Key Concepts to Introduce Early

A new user should understand these concepts early:

- Veradmin is a tactical control system, not just a tracker.
- Accounts are interpreted through rules and profiles.
- “Lives” are standardized risk units.
- Accounts can be tradable, restricted, or stopped.
- Accounts exist in modes.
- The dashboard answers what matters today.
- Logging events changes operational truth.
- The product is local-first and stores data on the device.

Not every concept needs a long explanation immediately, but these ideas should appear clearly in first-run UX and help text.

---

## 5. First-Run States

The first-run experience should handle multiple entry cases.

### 5.1 Empty first-time user
No accounts, no history, no data.

### 5.2 User with manual setup intent
Wants to create real accounts immediately.

### 5.3 User who prefers example/demo data first
Wants to understand the product before trusting it with real data.

### 5.4 Returning user after reinstall or restore
Needs to reconnect with existing local state safely.

The onboarding system should support these states without confusion.

---

## 6. Recommended First-Run Flow

A good first-run flow may look like:

1. Welcome / product framing
2. Choose starting path:
   - create first account
   - load example fleet
   - restore from backup
3. Explain core mental model lightly
4. Guide initial setup
5. Land user on dashboard with meaningful state
6. Provide contextual guidance on first key interactions

This flow respects both speed and seriousness.

---

## 7. Welcome Screen Content

The welcome screen should answer:
- what Veradmin is
- what makes it different
- what the user can do next

Example themes:
- “Run your prop-firm fleet with rule-driven clarity.”
- “See what is tradable, what is protected, and what matters today.”
- “Start by creating your first account, loading an example fleet, or restoring existing data.”

The welcome screen should not sound promotional.
It should sound operational and clear.

---

## 8. Starting Path Options

### 8.1 Create First Account

For users ready to begin with real setup.

Should guide:
- firm
- stage
- account label
- starting balance
- profile assignment
- optional initial status fields

### 8.2 Load Example Fleet

For users who want to learn the product safely.

Example fleet should be realistic, not cartoonish.
It should demonstrate:
- varied modes
- payout-ready account
- restricted account
- active alerts
- meaningful journal history

### 8.3 Restore From Backup

For returning users or device migration.
This path should be serious, safe, and clearly separate from the “new setup” paths.

---

## 9. Early Education: Mental Model Cards or Panels

Instead of a long tutorial, Veradmin should use compact teaching surfaces.

Recommended early concepts to explain:
- Lives
- Modes
- Tradable vs restricted
- Dashboard mission
- Logging events and state updates

These can appear as:
- lightweight cards
- dismissible tips
- side panels
- contextual empty-state explanations

Teaching should be embedded in use, not isolated as a lecture.

---

## 10. Creating the First Account

The first account setup flow should be highly guided but not bloated.

Required fields may include:
- account label
- firm
- stage
- rule profile
- starting balance
- current balance if needed
- peak balance if relevant for trailing logic
- important dates if needed for payout/day requirements

The flow should explain why key fields matter.
For example:
- starting balance matters for standardized risk and lives
- profile determines how the system interprets the account
- peak balance matters for trailing models

The user should not feel like they are filling a tax form.

---

## 11. Example Fleet Design

The example fleet is an educational tool, not filler data.

It should include:
- one healthy tradable account
- one account in Preservation Mode
- one payout-ready account
- one restricted or stopped account
- a few alert examples
- some timeline/journal history
- payout/admin examples

This helps the user understand the product quickly.

The example fleet should clearly be labeled as example data.

---

## 12. Landing the User on the Dashboard

After setup or example load, the product should land the user on a dashboard that already feels meaningful.

The user should see:
- a mission panel
- a few account cards
- at least one clear state difference
- one or two visible next actions
- calm explanation of what they are looking at

The first dashboard should create the first moment of value:
“I understand what this product is doing for me.”

---

## 13. Contextual Guidance After First Run

After the user lands in the app, guidance should become contextual.

Examples:
- first time opening an account detail view
- first time logging a win/loss
- first time viewing simulation
- first time seeing payout-ready state
- first time encountering a critical alert

These should be short, dismissible, and relevant to the action at hand.

---

## 14. Onboarding for Advanced Concepts

Some ideas should be introduced only when the user is ready.

Examples:
- operator overlays
- custom profiles
- advanced payout nuance
- deeper reporting
- simulation sequences
- backups and exports
- diagnostics

The first-run experience should not teach everything at once.

---

## 15. First-Run Tone and Language

The first-run experience should sound:
- calm
- guiding
- precise
- respectful of the user’s intelligence

Avoid:
- hype copy
- gamified encouragement
- over-cheerful tutorials
- “congratulations” noise for basic setup tasks
- jargon without explanation

The user should feel they are entering a serious operating tool.

---

## 16. Empty-State Design After First Run

If the user skips example data and only creates one account, the app should still handle early emptiness well.

Examples:
- no journal history yet
- no payouts yet
- no alerts yet
- only one account
- no calendar data yet

These quiet states should reassure and guide rather than feel incomplete.

---

## 17. Returning User Experience

If the user already has local data or restores from backup, onboarding should not repeat like a consumer app tutorial.

Instead, the product should:
- recognize existing state
- offer a clean return path
- show version changes if relevant
- surface restore success clearly
- avoid patronizing first-run tips unless explicitly re-enabled

Respect for returning users matters.

---

## 18. Onboarding Anti-Patterns to Avoid

Avoid:
- long multi-screen tutorial decks
- generic productivity-app welcome clichés
- empty dashboard with no guidance
- fake example data that teaches nothing
- forcing too many initial fields before value appears
- explaining every advanced concept up front
- making restore feel like a hidden side path

---

## 19. Definition of Done for Onboarding and First-Run Experience

This spec is satisfied when:

1. A first-time user quickly understands what Veradmin is for.
2. The product’s core mental model is introduced clearly.
3. The user can create a real account, load example data, or restore safely.
4. The first dashboard experience feels meaningful, not empty.
5. Guidance is contextual and progressive rather than overwhelming.
6. Returning users are treated differently from brand-new users where appropriate.
7. The first-run experience builds trust in Veradmin as a serious tactical tool.

---

## 20. Future Considerations

Potential later additions:
- interactive setup checklist
- optional guided mode for first-week use
- onboarding completion status
- tailored first-run depending on profile type
- first-review walkthrough after seven days
- video or doc links embedded in help surfaces

These are valuable later, but v1 must first make the first-run experience clear, calm, and useful.
