# Veradmin Mode Map

Version: 1.0  
Status: Active  
Owner: Product / Rule Engine / UX / Engineering  
Applies To: Account modes, tactical posture, mode transitions, mode explanations, permissions, alerts, and operator guidance

---

## 1. Purpose of This Document

This document defines the operational mode system for Veradmin.

Mode is what turns raw balances and rule outputs into tactical posture. Lifecycle says where the account is in its broader journey. Mode says how the account should currently be handled.

---

## 2. Canonical Modes

Recommended canonical modes for Veradmin v1:

1. Attack
2. Preservation
3. Recovery
4. Payout Protection
5. Cooldown
6. Stopped
7. Breached

---

## 3. Mode Definitions

### Attack
The account is healthy enough for normal or full tactical deployment under current policy.

Typical characteristics:
- tradable
- full-size permitted
- no dominant protection override
- not currently stopped by a controlling condition

### Preservation
The account remains alive and usable, but protection now takes precedence over growth because effective risk space has narrowed or the account has become strategically fragile.

Typical characteristics:
- may still be tradable
- may allow full-size or fractional-only depending on other restrictions
- should be handled protectively

### Recovery
The account is not stopped, but current state requires cautious recovery-oriented handling because recent deterioration has made normal deployment unwise.

### Payout Protection
The account is near or inside a payout-significant state where protecting payout readiness or imminent business value takes priority over further push.

### Cooldown
The account is temporarily inactive or tactically deprioritized due to policy, rotation, or deliberate rest, without being terminally failed.

### Stopped
The account is currently not tradable because a controlling restriction blocks further use under current state.

### Breached
The account has crossed a failure threshold or is otherwise no longer operationally viable.

---

## 4. Mode Trigger Concepts

### Attack triggers
- healthy enough posture
- no dominant restriction
- sufficient effective lives
- no overriding payout or cooldown posture

### Preservation triggers
- effective lives below configured comfort threshold
- strategic fragility
- increased need to protect current state

### Recovery triggers
- recent deterioration
- meaningful drawdown pressure
- still alive, but requires disciplined rebuilding posture

### Payout Protection triggers
- payout-ready state
- approaching payout significance
- business value now more important than further push

### Cooldown triggers
- manual pause
- rotation rest period
- planned inactivity

### Stopped triggers
- daily restriction triggered
- current state violates tradable threshold
- explicit stop condition reached

### Breached triggers
- hard breach/failure threshold crossed
- account no longer operationally valid

---

## 5. Mode Transition Map

Common transitions:
- Attack -> Preservation / Recovery / Payout Protection / Stopped
- Preservation -> Attack / Recovery / Payout Protection / Stopped
- Recovery -> Preservation / Attack / Stopped
- Payout Protection -> Attack / Preservation / Cooldown / Stopped
- Cooldown -> Attack / Preservation / Recovery / Payout Protection
- Stopped -> Recovery / Preservation / Attack if state safely resets / Breached if terminal failure becomes true
- Any non-terminal mode -> Breached when terminal failure threshold is crossed

---

## 6. Mode vs Lifecycle and Permissions

Mode answers: **How should this account be treated now?**  
Lifecycle answers: **Where is this account in its broader account journey?**  
Permissions answer: **What is currently allowed?**

Examples:
- Preservation may still allow trading.
- Recovery may still allow trading.
- Payout Protection may still allow trading.
- Cooldown usually implies non-tradable by policy.
- Stopped and Breached imply non-tradable.

---

## 7. Mode-Driven UI Behavior

Mode should influence:
- badge labeling
- card emphasis
- dashboard ordering
- mission panel priorities
- Account Detail summaries
- explanation text
- alerts
- quick-action guidance

---

## 8. Canonical Explanation Patterns

- **Attack**: normal deployment remains allowed under current constraints.
- **Preservation**: effective risk space has narrowed and capital protection now takes priority.
- **Recovery**: recent deterioration requires cautious rebuilding before normal deployment.
- **Payout Protection**: payout significance makes preservation more important than further push.
- **Cooldown**: the account is currently inactive under rotation or policy.
- **Stopped**: a controlling restriction currently blocks trading.
- **Breached**: the account has crossed a terminal operating threshold.

---

## 9. Definition of Done

This specification is satisfied when:
1. The product has a stable set of tactical modes.
2. Each mode has a clear definition and purpose.
3. Trigger concepts and common transitions are explicit.
4. Mode remains distinct from lifecycle and permissions.
5. UX and copy can represent mode consistently.
6. Rule engine implementation has a clear target posture system.
7. The operator can understand tactical posture immediately from mode.
