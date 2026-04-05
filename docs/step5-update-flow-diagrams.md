# Veradmin Step 5: Update Flows and State Propagation

Version: 1.0  
Status: Active  
Owner: Architecture / Engineering  
Applies To: ordered update propagation, refresh rules, invalidation scope, and live-vs-preview state handling

---

## 1. Purpose

This document freezes the update propagation model for Step 5.

It exists so Veradmin refreshes coherently after meaningful actions without falling into either of these failures:
- stale screens that disagree with one another
- full-app reloading for every small interaction

---

## 2. Canonical Refresh Rule

For meaningful writes, Veradmin should follow this order:

```text
validate input
-> persist durable fact(s)
-> load affected stored bundle(s)
-> re-run deterministic evaluation
-> persist any required derived system events/audit records
-> invalidate affected surfaces
-> rebuild read models
-> remap view models
-> render change summary
```

Never skip persistence and claim success first.
Never update view models first and write later.

---

## 3. App Boot / Initial Dashboard Load

```text
app boot
-> load fleet settings and app health state
-> load dashboard stored bundle
-> evaluate relevant accounts / fleet summary
-> build dashboard read model
-> map command center view model
-> render command center
```

If degradation occurs:

```text
load failure or evaluation failure
-> mark degraded state in read model
-> map degraded-state section
-> render explicit caution state
```

---

## 4. Account Detail Load

```text
open account detail
-> load account stored bundle
-> load timeline/payout/admin context bundle
-> resolve governing profile version
-> evaluate account through canonical rule order
-> build account detail read model
-> map account detail view model
-> render account detail
```

This is a live path.
No simulation state should be mixed into it.

---

## 5. Trade Log Flow

```text
user logs win / loss / custom result
-> validate command payload
-> persist trade event
-> persist balance snapshot if required
-> persist audit event
-> reload affected account stored bundle
-> re-evaluate account
-> persist any derived system events if required
-> invalidate:
   account detail for that account
   dashboard
   journal
   alerts
   payouts if payout significance changed
   calendar if payout/rotation markers changed
-> rebuild affected read models
-> remap affected view models
-> show post-action consequence summary
```

Expected visible consequences:
- updated lives
- updated permissions
- updated mode
- updated next action
- updated alert posture
- timeline entry visible

---

## 6. Add Note Flow

```text
user adds note
-> validate note payload
-> persist note
-> persist audit event if required
-> invalidate:
   account detail timeline/context
   journal
-> rebuild affected read models
-> remap affected view models
-> render updated note history
```

Usually no fleet-wide evaluation rerun is needed.
If a note later becomes mission-relevant, that should happen through an explicit rule, not by assumption.

---

## 7. Payout Request Flow

```text
user requests payout
-> validate payout eligibility against current state
-> persist payout request event
-> persist audit event
-> reload affected account + payout bundles
-> re-evaluate account
-> invalidate:
   account detail
   payouts
   dashboard
   alerts
   journal
   calendar if timing significance changed
-> rebuild affected read models
-> remap affected view models
-> render updated pending/requested state
```

Expected visible consequences:
- readiness becomes pending/requested
- blockers change or disappear
- mission items may change
- payout/admin items may rise in priority

---

## 8. Mark Payout Received Flow

```text
user marks payout received
-> validate receipt command
-> persist payout receipt event
-> persist refund/admin follow-up state if needed
-> persist audit event
-> reload affected account + payout bundles
-> re-evaluate account
-> invalidate:
   account detail
   payouts
   dashboard
   alerts
   journal
   calendar if payout markers changed
-> rebuild read models
-> remap view models
-> render updated payout history and account posture
```

---

## 9. Pause / Resume Flow

```text
user pauses or resumes account
-> validate lifecycle/status transition
-> persist account status change
-> persist audit event
-> reload account stored bundle
-> re-evaluate account
-> invalidate:
   account detail
   dashboard
   alerts
   journal
   calendar
   payouts if relevance changed
-> rebuild read models
-> remap view models
-> render updated restrictions and mission posture
```

---

## 10. Profile Assignment Change Flow

```text
user changes governing profile assignment
-> validate assignment command
-> close prior open assignment
-> create new assignment row
-> update current account pointers
-> persist audit event
-> reload account stored bundle and profile version
-> re-evaluate account
-> invalidate:
   account detail
   dashboard
   journal
   alerts
   payouts
   calendar if timing/eligibility changed
-> rebuild read models
-> remap view models
-> render updated governing-state explanation
```

This is a high-impact refresh event and should be treated accordingly.

---

## 11. Calendar / Rotation Structural Change Flow

```text
user records or edits rotation/planning structure
-> validate rotation command
-> persist structural change
-> persist audit event
-> reload relevant calendar bundles
-> re-evaluate affected accounts if timing constraints matter now
-> invalidate:
   calendar
   dashboard
   affected account detail screens
   alerts if timing restrictions changed
   payouts if timing significance changed
-> rebuild read models
-> remap view models
-> render updated rhythm markers
```

---

## 12. Pure UI Filter Change Flow

```text
user changes filter / sort / tab / selected range
-> update local UI state only
-> optionally remap already-loaded read model
-> re-render screen
```

No repository write.
No evaluation rerun unless the new scope truly requires loading additional entities.
No global invalidation.

---

## 13. Simulation Preview Flow

```text
user opens simulation
-> capture current live account read model reference
-> build hypothetical action input
-> run simulation evaluation through the same engine path
-> build simulation preview read model
-> map simulation preview view model
-> render before/after comparison
```

On close:

```text
dismiss simulation
-> discard preview state
-> return to live account detail view model
```

On commit of a real action:

```text
simulation result accepted as actual action
-> start the real workflow from persistence
-> do not merge preview state directly into live state
```

---

## 14. Surface Invalidation Matrix

## 14.1 Dashboard

Refresh when:
- account evaluation changes
- alert posture changes
- payout posture changes
- pause/resume changes
- profile assignment changes
- calendar/rotation timing affects mission context

## 14.2 Account Detail

Refresh when:
- the account itself changes
- its evaluation changes
- timeline context changes
- payout/admin context changes
- simulation is opened or closed

## 14.3 Journal

Refresh when:
- trade/custom events are logged
- notes are added
- payout events change
- audit events are added
- derived system events are persisted

## 14.4 Payouts

Refresh when:
- payout request/receipt changes
- payout readiness changes
- blockers change
- refund/admin tasks change

## 14.5 Calendar

Refresh when:
- rotation/planning facts change
- payout timing changes
- timing-linked alerts change
- lifecycle or pause state changes that affect rhythm

## 14.6 Alerts

Refresh when:
- evaluation outputs cross thresholds
- restriction/mode/permission states change
- payout/admin timing creates or resolves alerts
- manual alert resolution state changes

---

## 15. Degraded-State Propagation

When any stage in the pipeline fails, the failure should propagate deliberately.

```text
repository/read-model/evaluation failure
-> attach degraded marker to read model
-> map degraded-state view model
-> render explicit caution state
-> avoid pretending to have clean tactical certainty
```

Examples:
- missing rule profile version
- impossible balance relationship
- evaluation unavailable
- partial history load
- alert source missing

---

## 16. Final Statement

Good update propagation is not just about speed.
In Veradmin it is about trust.
The user should always be able to believe that what changed, why it changed, and where it changed are all still coherent after an action.
