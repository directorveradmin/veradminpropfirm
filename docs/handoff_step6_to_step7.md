# Handoff Step 6 to Step 7

## Step Completed
Step 6 of 12: **Core Account Workflows** was completed as a workflow-specification package.

## What Was Finalized
- The core account interaction layer was frozen around **workflow integrity first**, before the full screen layer.
- Ordered workflow rules were defined for:
  - account creation/loading,
  - profile assignment,
  - trade result logging,
  - note creation,
  - pause/resume,
  - account fact updates and recompute,
  - payout request and payout receipt at the account level.
- A canonical **service ownership split** was defined across repositories, evaluation services, workflow services, and later screens.
- Stable **command contracts** were specified for account creation, profile assignment, trade logging, notes, pause/resume, and payout actions.
- A canonical **workflow result envelope** was specified so later screens can consume:
  - persisted fact ids,
  - evaluation results,
  - derived system events,
  - invalidation keys,
  - consequence summaries,
  - degraded-state markers.
- The **derived system event catalog** was frozen for mode, tradability, permission, payout, restriction, and alert posture transitions.
- **Account-level history integrity rules** were formalized so operational memory remains explainable and timeline trust is preserved.
- A dedicated **account action boundary** artifact was created to prevent Step 7 from moving workflow logic into components or ad hoc screen handlers.

## Outputs Created
- `step6-core-account-workflows.md`
- `step6-workflow-and-event-handling-outputs.md`
- `step6-account-action-boundaries.md`
- `handoff_step6_to_step7.md`

## What Must Not Change
- Veradmin must remain **desktop-first** and **local-first**.
- SQLite remains the authoritative local source of truth in v1.
- Repositories must continue to own persistence access only, not tactical decisions.
- The rule engine must remain the sole owner of mode, permissions, restrictions, payout readiness, alerts, explanations, and next-action outputs.
- Workflow services must preserve the canonical order:
  - validate
  - persist facts
  - reload affected bundle
  - re-evaluate
  - persist derived system events/audit memory
  - invalidate affected surfaces
  - return consequence summary
- Notes must remain contextual memory and must not silently mutate operational truth.
- Screen code must not reconstruct what changed after actions by guessing from raw balances or raw table rows.
- Profile reassignment must remain historically traceable through assignment rows and audit memory.
- Simulation and preview paths must remain separate from live committed workflows.

## Repo-Fit Notes for the Next Step
The public repo state visible during this step indicates:
- `db/schema/accounts.ts` already holds accounts, profile assignments, day-state, notes, and fleet settings.
- `db/schema/operations.ts` already holds trade logs, balance snapshots, payouts, alerts, and audit events.
- `db/repositories/` currently exposes only the early repository scaffold (`accountsRepository.ts`, `ruleProfilesRepository.ts`).
- `src/lib/services/` and `src/lib/view-models/` still appear to be mostly scaffold-level surfaces in the public repo view.

That means Step 7 should treat the Step 6 outputs as the implementation contract for building real screen integration on top of the existing scaffold rather than bypassing it.

## Unresolved Items
- The available environment in this chat provided the canonical docs and public repo structure, but not a writable local checkout of the full repository tree. So this step was completed as an **implementation-ready specification package** rather than an in-repo code patch.
- The repository still needs the concrete Step 6 service/repository files added in the actual working tree.
- The exact file naming inside `src/lib/services/` may still be adjusted slightly, but the ownership boundaries and contracts should not change.

## Next Step Goal
Step 7 should implement the **first tactical screen integration layer** on top of the Step 5 state/read-model/view-model work and the Step 6 workflow contracts.

Priority for the next step:
- wire the Command Center to read-model builders and refresh invalidation outputs,
- wire the Account Detail screen to the same workflow result envelopes and consequence summaries,
- consume Step 5 view-model mappers instead of adding screen-local calculations,
- invoke Step 6 workflow services from tactical action areas,
- render explicit degraded states and post-action consequence summaries,
- keep Journal/Payouts/Calendar implementations limited to only what those two screens need for linkage.

## Recommended Upload Set for Next Chat
- `handoff_step6_to_step7.md`
- `step6-core-account-workflows.md`
- `step6-workflow-and-event-handling-outputs.md`
- `step6-account-action-boundaries.md`
- `handoff_step5_to_step6.md`
- `docs/36-state-management-and-view-models.md`
- `docs/step5-view-model-structure-guide.md`
- `docs/step5-update-flow-diagrams.md`
- `27-command-center-screen-spec.md`
- `28-account-detail-screen-spec.md`
- `05-rule-engine-spec.md`
- `41-rule-evaluation-order.md`
- `39-account-lifecycle-map.md`
- `40-mode-map.md`
- `42-alert-severity-model.md`
- `43-daily-operator-workflow.md`
- `44-trade-payout-and-rotation-workflows.md`
- `47-repository-structure-and-boundaries.md`
- `53-repositories-validation-and-derived-boundaries.md`
- `db/schema/` (full folder)
- `db/repositories/` (full folder)
- `src/lib/services/` (full folder)
- `src/lib/services/read-models/` (full folder)
- `src/lib/view-models/` (full folder)
- `src/features/dashboard/` if present
- `src/features/accounts/` if present
- `src/app/` routes for Command Center and Account Detail
- `package.json`
- `tsconfig.json`
