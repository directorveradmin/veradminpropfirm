# Veradmin Design System Tokens and Components

Version: 1.0  
Status: Active  
Owner: Design / UX / Frontend Engineering  
Applies To: Visual tokens, spacing, typography, color system, component patterns, interaction states, and UI consistency

---

## 1. Purpose of This Document

This document defines the design system layer for Veradmin.

Its purpose is to turn the UX principles into a repeatable visual and interaction system that engineering can build without guesswork and design can evolve without inconsistency.

Veradmin should not be designed one screen at a time through improvised styling.
It needs a stable system of tokens, component behaviors, and visual rules.

This document exists so the product feels like one coherent operating surface.

---

## 2. Design System Mission

The design system must help Veradmin feel:

- calm
- premium
- restrained
- authoritative
- fast to scan
- consistent under pressure

Its role is not to make the app flashy.
Its role is to make clarity reusable.

---

## 3. System Principles

### 3.1 Semantics before decoration

Tokens and components should reflect meaning, not trend aesthetics.

### 3.2 Reuse before invention

If an existing component can solve the problem cleanly, it should be reused before a new one is created.

### 3.3 Hierarchy before density

The interface should make priority obvious even in data-rich views.

### 3.4 States must be visible

Every important component state must have a clear visual expression.

### 3.5 Motion should be restrained

Transitions should support orientation, not spectacle.

---

## 4. Design Token Categories

Veradmin should maintain tokens for at least:

- color
- typography
- spacing
- radius
- shadow
- border
- opacity
- z-index/layering
- motion
- semantic state

These should be expressed in a form engineering can use consistently, ideally as theme variables or tokens in code.

---

## 5. Color System

The color system should be semantic, not merely decorative.

Recommended semantic roles:

### 5.1 Background tokens
- app background
- elevated surface background
- secondary panel background
- overlay background

### 5.2 Text tokens
- primary text
- secondary text
- muted text
- inverted text

### 5.3 Border tokens
- subtle border
- standard border
- emphasis border

### 5.4 State tokens
- neutral
- success
- caution
- danger
- informational
- selected/focus

### 5.5 Brand/identity accent
- gold / XAU identity accent

Recommended practical palette direction:
- dark graphite / deep charcoal base
- muted steel-blue neutrals
- gold accent for XAU identity and payout emphasis
- controlled green for safe/completed states
- amber for caution
- red for stop/breach risk
- limited cyan or violet only if needed for informational overlays

The palette must remain restrained.
Neon overload is explicitly discouraged.

---

## 6. Typography System

Typography should optimize legibility, scanning, and command-surface hierarchy.

Recommended roles:
- display title
- page title
- section title
- card title
- metric value
- body text
- caption
- badge/label text
- monospace or tabular numeric style for critical metrics if useful

Rules:
- avoid excessive font variety
- prioritize legibility at desktop operating distances
- ensure numbers align cleanly
- preserve hierarchy through size, weight, and spacing

The system should feel serious and functional, not editorial or playful.

---

## 7. Spacing System

Spacing should be tokenized and used consistently.

Recommended approach:
- define a scale for tight, standard, and roomy spacing
- use consistent spacing between:
  - panels
  - card internals
  - label/value groupings
  - action rows
  - dashboard sections

Crowded spacing weakens calm.
Overly loose spacing weakens information density.
Veradmin should sit in the middle: spacious enough to breathe, dense enough for serious use.

---

## 8. Radius, Borders, and Shadows

Veradmin should feel premium and structured, not glassy or overly soft.

Recommended direction:
- moderate radius for cards and panels
- sharper radius for compact data surfaces where useful
- subtle shadows on elevated surfaces only
- borders should carry more of the separation work than dramatic shadows

Avoid:
- excessive blur
- oversized glow effects
- floating UI that feels disconnected from structure

---

## 9. Motion and Interaction Timing

Motion should support:
- expansion/collapse
- navigation continuity
- modal clarity
- hover and focus feedback
- loading transitions

Rules:
- keep motion short and restrained
- avoid bouncy or playful easing
- use motion to preserve orientation
- do not animate critical warnings in distracting ways

Veradmin should feel alive, but never noisy.

---

## 10. Core Component Families

The design system should define at least the following component families.

### 10.1 Shell components
- app frame
- sidebar / nav rail
- top status bar
- page header
- panel wrapper

### 10.2 Data display components
- metric block
- stat row
- card
- badge
- pill
- timeline item
- table row
- alert row

### 10.3 Action components
- primary button
- secondary button
- tertiary button
- icon button
- menu action
- destructive action button

### 10.4 Input components
- text input
- select
- filter chips
- segmented controls
- modal form controls
- date/time picker if used

### 10.5 Feedback components
- toast
- inline warning
- alert card
- empty state
- loading state
- confirmation dialog

### 10.6 Structural components
- accordion
- drawer
- modal
- tab group where appropriate
- section divider

---

## 11. Dashboard-Specific Components

The dashboard should rely on a stable set of reusable pieces.

Recommended dashboard components:
- mission panel
- fleet health strip
- alert strip
- account card
- quick-action row
- summary metric tile
- filter bar
- section header with count

These components should be reusable rather than one-off custom layouts.

---

## 12. Account Card Component Specification

The account card is one of the most important reusable components in the system.

It should support:
- compact and expanded variants
- mode badge
- status badge
- primary metrics
- next milestone
- quick actions
- warning indicators

Card states should include:
- default
- hover
- selected
- restricted
- stopped
- payout-ready
- critical-risk

These states must be visually distinct enough to guide scanning.

---

## 13. Badge and Pill System

Badges and pills should communicate state clearly.

Recommended usage:
- lifecycle stage
- mode
- alert severity
- payout-ready
- paused
- stopped
- risk restriction

Rules:
- use a limited badge vocabulary
- do not create dozens of bespoke badge styles
- maintain consistent color-to-state mapping

Badges should be easy to scan, not decorative stickers.

---

## 14. Tables, Lists, and Timelines

Some Veradmin views will be card-driven, others more tabular.

Rules:
- tables should prioritize readability over maximal density
- row states should support selection, hover, and severity
- timelines should clearly separate event type, timestamp, and explanation
- dense information should still preserve breathing room and hierarchy

The journal and payouts surfaces may use hybrid list/table structures where appropriate.

---

## 15. Form Design Principles

Forms in Veradmin must feel fast and trustworthy.

Rules:
- use progressive disclosure for advanced fields
- pre-fill obvious defaults where safe
- validate clearly and locally
- avoid long intimidating forms for common actions
- distinguish required vs optional fields clearly

For example, Log Win / Log Loss should be fast.
Log Custom may be more detailed, but still structured and manageable.

---

## 16. Component State Rules

Each important interactive component should have at least:
- default state
- hover state
- focus state
- active/pressed state
- disabled state
- error state where applicable

States must not rely on color alone.
Contrast, label, and icon behavior should reinforce meaning.

---

## 17. Icons and Symbol Usage

Icons should support recognition, not create visual clutter.

Rules:
- use a consistent icon set
- prefer familiar operational symbols
- do not decorate every label with an icon
- reserve icons for navigation, state reinforcement, and quick recognition

Good candidates for icon support:
- dashboard
- account
- journal
- payout
- calendar
- alerts
- settings
- backup/export
- paused/stopped

Icons should feel clean and utilitarian.

---

## 18. Responsive and Layout Behavior

Veradmin is desktop-first, but it still needs sane resizing behavior.

Rules:
- primary desktop layout should be the main design target
- major sections should adapt gracefully to narrower desktop windows
- information hierarchy should survive moderate resizing
- component collapse behavior should be defined, not accidental

The product should not rely on mobile-first assumptions.

---

## 19. Accessibility and Readability

Even in a premium dark theme, accessibility matters.

Rules:
- maintain readable contrast
- do not use color as the sole carrier of meaning
- ensure focus visibility for keyboard navigation
- preserve readable text size for key information
- avoid tiny low-contrast metadata in important areas

A calm interface is also a readable interface.

---

## 20. Anti-Patterns to Avoid

Avoid:
- neon overload
- crypto-dashboard aesthetics
- over-glassmorphism
- inconsistent corner radii
- too many one-off component variants
- hidden state changes
- noisy motion
- overuse of accent color
- cramped dense panels with no hierarchy

---

## 21. Definition of Done for Design System Tokens and Components

This spec is satisfied when:

1. Core visual tokens are defined and consistently used.
2. Components are reusable and state-aware.
3. Dashboard, account, journal, and payout surfaces feel visually related.
4. Colors map consistently to semantic meaning.
5. Typography and spacing support calm scanning.
6. Motion and interaction feel restrained and purposeful.
7. The product looks like one designed system, not a set of assembled screens.

---

## 22. Future Considerations

Potential later additions:
- component inventory site
- token documentation in code
- theme variants
- data visualization standards
- advanced motion guidelines
- accessibility audit checklist
- icon usage matrix

These are valuable later, but v1 must first achieve semantic consistency and strong component reuse.
