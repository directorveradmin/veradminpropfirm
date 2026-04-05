# Step 4 Evaluation Pipeline Outputs

## Canonical pipeline implemented
1. Validate account integrity
2. Resolve lifecycle
3. Resolve governing rule profile version
4. Resolve broad activity eligibility
5. Resolve baseline monetary references
6. Compute hard floor
7. Compute daily floor
8. Resolve dominant floor
9. Compute lives and fractional lives
10. Evaluate progression and stage conditions
11. Evaluate payout state
12. Resolve terminal failure
13. Resolve non-terminal restrictions
14. Resolve dominant mode
15. Resolve permissions
16. Derive alerts
17. Derive next action
18. Build explanation outputs

## Sample fixture evaluations
| Scenario | Mode | May Trade | Allowed Risk (cents) | Payout State | Effective Lives | Dominant Restriction |
|---|---|---:|---:|---|---:|---|
| demo_alpha_001 | preservation | yes | 25000 | approaching | 1.7 | - |
| demo_alpha_002 | payout_protection | yes | 25000 | pending | 1.8 | - |
| demo_beta_001 | attack | yes | 50000 | not_applicable | 2.7 | - |
| demo_beta_003 | cooldown | no | 0 | not_applicable | 1.6 | paused_or_cooldown |
| edge_alpha_exact_floor | stopped | no | 0 | approaching | 0 | hard_floor_reached |
| edge_alpha_above_floor | stopped | no | 0 | approaching | 0 | insufficient_effective_lives |
| edge_beta_below_floor | breached | no | 0 | not_applicable | 0 | hard_floor_breached |
| edge_beta_collision | stopped | no | 0 | pending | 1.6 | news_lock_active |

## Interpreting the output contract
- `thresholds` shows hard floor, daily floor, dominant floor, and all active buffers.
- `lives` shows hard-limited, daily-limited, and effective survivability.
- `progression` keeps target logic and minimum trading days separate.
- `payout` remains distinct from trading permission so business state does not collapse into tactical state.
- `restrictions` shows active blocks without forcing the UI to recalculate them.
- `mode` is precedence-based and explainable.
- `permissions` is the only place that says what is currently allowed.
- `alerts` are engine outputs, not screen-invented warnings.
- `explanations` contains direct reason lists ready for later UI shaping.

## Generated artifact
The full machine-readable output for the sample scenarios is stored in:
- `step4_pipeline_outputs.json`
