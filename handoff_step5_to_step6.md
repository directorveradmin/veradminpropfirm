# Handoff Step 5 to Step 6

## Step Completed
Step 5 of 12: **State Management and View-Model Layer** was completed.

## What Was Finalized
- Stored state, derived state, view state, and preview state were frozen as separate categories.
- The authority chain was frozen as: repositories for stored facts, rule engine for operational truth, read-model services for assembly, view-model mappers for presentation shaping, and screens/components for local UI state only.
- A canonical `persist -> evaluate -> map -> render` update pipeline was frozen.
- Shared state boundaries were narrowed to only app-health, alert-count, selection/context, and explicit refresh invalidation signals where needed.
- Local UI state boundaries were frozen per surface so filters, tabs, drawers, and form drafts do not become accidental business logic containers.
- Simulation preview was frozen as a separate preview-state path that reuses the same evaluation logic but never mutates live state.
- Screen-facing view-model responsibilities were frozen for Command Center, Account Detail, Journal, Payouts, Calendar, and Alerts.
- Read-model assembly and pure view-model mapping were split into separate responsibilities.
- Refresh rules after trade logging, notes, payouts, pause/resume, profile reassignment, calendar changes, and pure UI filter changes were documented.
- Recommended folder/file placement was defined to fit the current scaffold under `src/lib/services/`, `src/lib/view-models/`, and `src/features/*/state/`.

## What Must Not Change
- Veradmin must remain **desktop-first** and **local-first**.
- SQLite must remain the authoritative local source of truth in v1.
- Repositories must continue returning stored facts only and must not decide mode, tradability, payout readiness, alert meaning, or UI copy.
- The rule engine must remain the only authoritative source of operational truth.
- View-model mappers must not re-implement rule calculations.
- Screens must not bypass services and talk directly to repositories for tactical interpretation.
- Preview/simulation state must remain separate from live state.
- Shared state must remain narrow and intentional; do not collapse the app into one giant global state object.
- Refresh propagation must continue to follow persistence first, evaluation second, mapping third, rendering last.

## Outputs Created
- `36-state-management-and-view-models.md`
- `step5-view-model-structure-guide.md`
- `step5-update-flow-diagrams.md`
- `handoff_step5_to_step6.md`

## Unresolved Items
- The exact implementation mechanism for surface invalidation may still be chosen during Step 6 (for example a lightweight coordinator module or equivalent hook-based approach), but it must preserve the boundaries frozen in Step 5.
- Exact filenames may vary slightly during implementation, but the read-model vs mapper vs local-UI-state split must remain visible.

## Next Step Goal
Step 6 should wire the new read-model and view-model architecture into real screen composition without re-litigating state ownership.

Recommended Step 6 scope:
- connect Command Center screen composition to the dashboard read model and dashboard view model
- connect Account Detail screen composition to the account detail read model and account detail view model
- establish reusable account card and summary-section consumption patterns
- keep Journal, Payouts, Calendar, and Alerts aligned to the same contracts even if their first UI pass remains narrower
- preserve degraded-state handling and simulation-entry boundaries

Do **not** move domain logic into screen components while integrating these surfaces.

## Recommended Upload Set for Next Chat
- `handoff_step5_to_step6.md`
- `36-state-management-and-view-models.md`
- `step5-view-model-structure-guide.md`
- `step5-update-flow-diagrams.md`
- `handoff_step4_to_step5.md`
- `05-rule-engine-spec.md`
- `27-command-center-screen-spec.md`
- `28-account-detail-screen-spec.md`
- `29-journal-screen-spec.md`
- `30-payouts-screen-spec.md`
- `31-calendar-and-rotation-screen-spec.md`
- `32-alerts-screen-spec.md`
- `37-implementation-sequencing-and-build-order.md`
- `39-account-lifecycle-map.md`
- `40-mode-map.md`
- `41-rule-evaluation-order.md`
- `42-alert-severity-model.md`
- `43-daily-operator-workflow.md`
- `44-trade-payout-and-rotation-workflows.md`
- `45-delivery-environment-and-repo-scaffold.md`
- `47-repository-structure-and-boundaries.md`
- `50-data-model-implementation-guide.md`
- `53-repositories-validation-and-derived-boundaries.md`
- `package.json`
- `db/client.ts`
- the full `db/schema/` folder
- the full `db/repositories/` folder
- the full `src/lib/domain/rules/` folder
- `src/lib/services/accountEvaluationService.ts`
- the current `src/lib/services/` folder
- the current `src/lib/view-models/` folder
- the relevant `src/features/dashboard/` and `src/features/accounts/` folders
