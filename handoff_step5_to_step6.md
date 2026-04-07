# Handoff Step 5 to Step 6

## Step Completed
Step 5 of 12: **State Management and View-Model Layer** was completed.

## What Was Finalized
- The state architecture was frozen around four distinct categories: **stored state**, **derived state**, **view state**, and **preview state**.
- The rule engine remains the only authoritative source for derived operational truth such as mode, permissions, restrictions, payout readiness, alerts, explanations, and next-action outputs.
- A dedicated read-model layer was scaffolded under `src/lib/services/read-models/` so screens can consume structured screen-facing data without bypassing repositories or re-implementing domain logic.
- A refresh/invalidation coordination scaffold was added through `src/lib/services/refreshCoordinator.ts` and `src/hooks/useRefreshSignal.ts`.
- Dedicated view-model mappers were added for the Command Center, Account Detail, Journal, Payouts, Calendar, and Alerts surfaces under `src/lib/view-models/`.
- Simulation/preview state was explicitly separated from live committed state so preview flows reuse canonical evaluation without mutating stored truth.
- The Step 5 documentation set was added to the repo under `docs/` and the handoff file for the next step was created.
- The Step 5 scaffold was verified in-place and `pnpm typecheck` passed successfully.

## What Must Not Change
- Veradmin must remain **desktop-first** and **local-first**.
- SQLite must remain the authoritative local source of truth in v1.
- Stored facts, derived operational truth, screen-facing view models, and preview/simulation state must remain separate.
- Repositories must not decide tradability, mode, payout readiness, alert semantics, or UI copy.
- Rule engine logic must not be moved into view models, React components, repositories, or Tauri commands.
- View models must remain downstream mappers of stored facts plus engine outputs; they must not re-implement domain calculations.
- Simulation/preview flows must remain isolated from live committed state.
- Refresh propagation and invalidation ownership must stay explicit rather than being scattered across screens.
- Step 6 must build on the Step 5 read-model and view-model layer instead of bypassing it with screen-local ad hoc logic.

## Outputs Created
- `docs/36-state-management-and-view-models.md`
- `docs/step5-view-model-structure-guide.md`
- `docs/step5-update-flow-diagrams.md`
- `handoff_step5_to_step6.md`
- `src/hooks/useRefreshSignal.ts`
- `src/lib/services/refreshCoordinator.ts`
- `src/lib/services/index.ts`
- `src/lib/services/read-models/types.ts`
- `src/lib/services/read-models/builders.ts`
- `src/lib/services/read-models/index.ts`
- `src/lib/view-models/common.ts`
- `src/lib/view-models/dashboard.ts`
- `src/lib/view-models/accountDetail.ts`
- `src/lib/view-models/journal.ts`
- `src/lib/view-models/payouts.ts`
- `src/lib/view-models/calendar.ts`
- `src/lib/view-models/alerts.ts`
- `src/lib/view-models/index.ts`

## Unresolved Items
- The Step 5 scaffold is in place and typechecks cleanly, but it has not yet been wired into the real screen components for the Command Center and Account Detail surfaces.
- The older stray file `docs/handoff_step4_to_step5.md` is still present in the working tree and should either be removed or intentionally preserved before final cleanup.
- The Step 5 changes are currently uncommitted on the `step5-core-account-workflows` branch by user choice.

## Next Step Goal
Step 6 of 12: **Command Center and Account Detail Screen Integration**.

The next chat should implement the first two major tactical surfaces on top of the existing Step 4 rule engine and the new Step 5 state/view-model layer, including:
- wiring screen loaders to the Step 5 read-model builders,
- consuming the Step 5 view-model mappers in the two screens,
- keeping local UI state local to those screens,
- honoring the Step 5 refresh/invalidation model after meaningful events,
- and preserving the rule-engine-first architecture without duplicating domain logic in UI code.

Do not drift into Journal, Payouts, Calendar, or Alerts screen implementation beyond what is strictly required for Command Center and Account Detail integration.
