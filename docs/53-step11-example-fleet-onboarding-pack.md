# Step 11 — Example Fleet Onboarding Pack

Version: 1.0  
Status: Step 11 complete  
Scope: Educational example fleet used only for first-run learning and onboarding-safe exploration  
Canonical inputs: `26-example-rule-profiles-and-fixtures.md`, `22-onboarding-and-first-run-experience.md`, `12-testing-and-quality-gates.md`, `23-error-states-and-recovery-flows.md`

---

## 1. Step 11 intent

This document defines the dedicated onboarding fleet for Veradmin.

It is not the same as the broader development demo fleet.
It is not the same as edge-case QA data.
It is not a giant mixed dataset.

The onboarding fleet is a compact educational pack whose job is to help a first-time operator understand the product safely in minutes.

---

## 2. Decisions frozen in Step 11

### 2.1 The onboarding fleet is a special-purpose fixture pack
It exists only to support first-run learning, early trust-building, and basic product orientation.

### 2.2 It must remain compact
The onboarding fleet should stay small enough to read quickly.

Step 11 freezes the v1 pack at **five accounts**.

### 2.3 It must teach state variety immediately
The onboarding pack must include at least:
- one clearly tradable account,
- one preservation-sensitive account,
- one payout-ready account,
- one restricted or terminal account,
- one near-future planning / rotation example.

### 2.4 It must be visually and operationally honest
The onboarding fleet is **example data**.

Rules:
- label it clearly as example data,
- avoid fake hype labels,
- do not imply these are the operator’s real accounts,
- do not silently merge it into non-empty real datasets.

### 2.5 It must be educational, not exhaustive
The onboarding fleet teaches the product’s mental model.
It does **not** attempt to cover every edge case or every firm variation.

---

## 3. Frozen Step 11 onboarding fleet composition

The Step 11 onboarding fleet uses five educational accounts.

## 3.1 Account A — clearly tradable funded account
Purpose:
Teach the operator what a calm, healthy account looks like.

Must demonstrate:
- active status,
- positive room before restriction,
- visible journal history,
- low-noise alerts.

## 3.2 Account B — preservation-sensitive funded account
Purpose:
Teach that not every active account is equally free to push risk.

Must demonstrate:
- reduced room before floor,
- higher caution posture,
- clear explanation of why the account deserves more restraint,
- alert language that is tactical but not theatrical.

## 3.3 Account C — payout-ready or payout-near account
Purpose:
Teach the operator that Veradmin also protects business context, not only intraday trading room.

Must demonstrate:
- payout eligibility or near-readiness,
- payout/admin note or request record,
- explanation that business timing can influence tactical posture.

## 3.4 Account D — stopped / terminal example
Purpose:
Teach the operator how a clearly unavailable account is presented.

Must demonstrate:
- unambiguous stopped or breached state,
- terminal or restricted explanation,
- timeline or alert support that explains why the account should not be acted on.

## 3.5 Account E — future rhythm / rotation example
Purpose:
Teach that Veradmin also tracks what matters next, not only what matters right now.

Must demonstrate:
- upcoming rest window, payout window, or review timing,
- calendar / rotation visibility,
- future-oriented alert or reminder.

---

## 4. Supporting records required in the onboarding pack

The onboarding pack must contain more than account shells.

Required supporting records:
- small journal / trade history,
- at least one payout/admin record,
- at least one future rotation or planning record,
- at least one critical or terminal alert,
- at least one medium/high attention alert,
- a few notes or audit events,
- rule profile assignments,
- basic fixture manifest metadata.

The pack should feel believable without becoming noisy.

---

## 5. Fixture manifest requirements

The onboarding pack must use fixture metadata that is explicit and reusable.

Required metadata:
- fixture id,
- fixture name,
- purpose,
- fixture category = `onboarding`,
- version,
- schema compatibility marker,
- creation date,
- included profile families,
- contained account count,
- whether alerts exist,
- whether payouts exist,
- notes describing intended use.

The manifest is part of trust.
It prevents “mystery example data” from drifting around the repo.

---

## 6. Loading rules

### 6.1 First-run load path
The onboarding fleet should be loaded only when the operator chooses `Load example fleet`.

### 6.2 CLI / local dev load path
The repo should also support a dedicated seed command or script for this onboarding pack.

Recommended target:
- fixture file: `db/fixtures/fleets/onboardingFleet.ts`
- seed script: `scripts/db/seed-onboarding.ts`
- optional package script: `db:seed:onboarding`

### 6.3 Existing-data guardrail
If the current local dataset is not empty, the operator should be warned before replacing or mixing in the onboarding fleet.

Recommended v1 behavior:
- present a clear consequence warning,
- avoid silent merge,
- point to backup creation before destructive replacement if needed.

---

## 7. Labeling and presentation rules

Every surface touching onboarding data should preserve the fact that it is example data.

Required visible labeling patterns:
- `Example fleet`
- `Example data loaded`
- `Educational onboarding pack`

Disallowed patterns:
- `Live fleet`
- `Your trading accounts`
- anything that blurs example data with real operator truth.

---

## 8. Onboarding pack and other fixture families

The onboarding pack must remain distinct from other fixture families.

### Demo fleet
Used for broader development and normal-flow validation.

### Edge fleet
Used for threshold, restriction, and state-boundary testing.

### Broken / conflict packs
Used for error handling, recovery, and defensive validation.

The onboarding pack is specifically the **teaching fixture**.

---

## 9. Error-handling rules for onboarding fleet load

If onboarding-fleet load fails, the product must say:
- that the example fleet was not loaded,
- whether current local state remains unchanged,
- what the safest next action is.

Approved examples:
- `Example fleet could not be loaded. Current local state remains in place.`
- `Onboarding data was not applied because the selected local dataset is not empty.`
- `Review backup or restore options before replacing existing local state.`

---

## 10. Step 11 boundaries

The onboarding pack intentionally does **not** include:
- giant stress data,
- every possible firm profile,
- intentionally broken references,
- advanced post-v1 reporting scenarios,
- cloud/sync teaching behavior.

Those belong elsewhere.

---

## 11. Definition of done for this Step 11 pack

This onboarding pack is satisfied when:
1. the operator can learn Veradmin without risking real data,
2. the five frozen account roles are present clearly,
3. small but meaningful journal, payout, alert, and planning records exist,
4. the pack is explicitly labeled as example data,
5. loading it is intentional and bounded,
6. it stays separate from demo, edge, and broken fixture families,
7. it remains compact enough to teach the product quickly.
