# Veradmin Account Lifecycle Map

Version: 1.0  
Status: Active  
Owner: Product / Architecture / Rule Engine / UX  
Applies To: Account lifecycle, account progression, lifecycle transitions, closure conditions, and stage-aware product behavior

---

## 1. Purpose of This Document

This document defines the lifecycle stages an account can occupy inside Veradmin and the allowed transitions between them.

Lifecycle is not the same thing as mode. Lifecycle describes where the account sits in its broader business journey. Mode describes how the account should currently be treated tactically.

---

## 2. Canonical Lifecycle Stages

Recommended canonical lifecycle stages for Veradmin v1:

1. Draft / Created
2. Evaluation / Step 1
3. Evaluation / Step 2
4. Funded / Active
5. Funded / Payout Active
6. Paused / Inactive
7. Breached / Failed
8. Retired / Archived

---

## 3. Lifecycle Stage Definitions

### Draft / Created
An account record exists but is not yet fully active in the operating fleet.

### Evaluation / Step 1
The account is in the first evaluation phase and has not yet passed the first required milestone.

### Evaluation / Step 2
The account has advanced beyond the first phase and is now working through the second progression phase.

### Funded / Active
The account is funded and currently part of the active fleet.

### Funded / Payout Active
The account is funded and in a payout-significant state where payout readiness, request windows, or payout-active business context matter.

### Paused / Inactive
The account exists, but is temporarily inactive in the operating fleet due to pause, rest, admin hold, or intentional de-prioritization.

### Breached / Failed
The account has failed or lost operational viability under the governing rules.

### Retired / Archived
The account is no longer part of the active fleet and is preserved mainly for historical or review purposes.

---

## 4. Canonical Transitions

### Entry transitions
- Draft -> Evaluation / Step 1
- Draft -> Funded / Active
- Draft -> Paused / Inactive

### Evaluation transitions
- Evaluation / Step 1 -> Evaluation / Step 2
- Evaluation / Step 1 -> Breached / Failed
- Evaluation / Step 1 -> Paused / Inactive
- Evaluation / Step 2 -> Funded / Active
- Evaluation / Step 2 -> Breached / Failed
- Evaluation / Step 2 -> Paused / Inactive

### Funded transitions
- Funded / Active -> Funded / Payout Active
- Funded / Active -> Paused / Inactive
- Funded / Active -> Breached / Failed
- Funded / Payout Active -> Funded / Active
- Funded / Payout Active -> Paused / Inactive
- Funded / Payout Active -> Breached / Failed

### Inactive transitions
- Paused / Inactive -> Evaluation / Step 1
- Paused / Inactive -> Evaluation / Step 2
- Paused / Inactive -> Funded / Active
- Paused / Inactive -> Funded / Payout Active
- Paused / Inactive -> Retired / Archived

### End-state transitions
- Breached / Failed -> Retired / Archived
- Retired / Archived -> no normal forward transitions in v1

---

## 5. Invalid Transitions

Examples that should normally be rejected:
- Evaluation / Step 1 -> Funded / Payout Active directly
- Breached / Failed -> Funded / Active without explicit exceptional recovery workflow
- Retired / Archived -> Funded / Active without deliberate administrative reactivation

---

## 6. Lifecycle vs Mode

Lifecycle answers: **Where is this account in its broader journey?**  
Mode answers: **How should this account be treated now?**

Examples:
- A Funded / Active account may be in Attack, Preservation, Recovery, or Cooldown mode.
- An Evaluation / Step 2 account may be in Recovery or Stopped.
- A Paused / Inactive account may align with Cooldown, but the concepts remain distinct.

---

## 7. Lifecycle-Driven Product Behavior

Lifecycle should influence:
- dashboard grouping
- account labeling
- progression summaries
- payout expectations
- calendar/rotation handling
- workflow relevance
- screen emphasis
- alert and admin context

---

## 8. Historical Trust

Lifecycle changes are meaningful events and must be recorded with:
- old stage
- new stage
- timestamp
- reason/source if known
- triggering event where possible

---

## 9. Definition of Done

This specification is satisfied when:
1. The product has a stable set of lifecycle stages.
2. Valid and invalid transitions are explicit.
3. Lifecycle remains distinct from mode and permissions.
4. Lifecycle changes are event-backed and traceable.
5. Screens and reports use lifecycle consistently.
6. Contributors can understand the broader account journey clearly.
7. Lifecycle logic reduces ambiguity instead of adding it.
