# Veradmin Step 4 Test Scenario Guidance

## Purpose
This guide keeps Step 4 verification aligned with the canonical rule order, fixture doctrine, and stored-vs-derived boundary.

## Core unit scenarios
1. Exact hard floor
   - Expected: `stopped`, not `breached`
   - Expected restriction: `hard_floor_reached`
   - Expected permission: `mustNotTrade = true`

2. One cent above hard floor
   - Expected: still non-breached
   - Expected: may still be `stopped` if effective lives are below minimum tradable threshold
   - Expected explanation must mention insufficient risk space

3. One cent below hard floor
   - Expected: `breached`
   - Expected alert severity: `critical`
   - Expected recommendation: inspect timeline / keep out of rotation

4. Daily floor reached
   - Expected: `stopped`
   - Expected dominant restriction: `daily_floor_reached`
   - Expected payout blocker if payout rules reference active daily restriction

5. Manually paused account
   - Expected: `cooldown`
   - Expected permission: `mayTrade = false`
   - Expected permission: `mayResume = true`

6. Evaluation target progress not yet complete
   - Expected: target progress output populated
   - Expected minimum day progress evaluated separately
   - Expected stage completion only when target and minimum days both pass

7. Funded payout-active account with ready timing
   - Expected: payout relevance true
   - Expected mode precedence to favor `payout_protection` over `attack`
   - Expected `mayRequestPayout` only when no pending payout and no blockers remain

8. Payout plus news collision
   - Expected: news lock alert
   - Expected permission: `mayTrade = false` during active lock
   - Expected payout state to remain separate from trading permission

9. Consistency profile with missing recent trades
   - Expected: `consistency.state = not_evaluated`
   - Expected no silent pass/fail
   - Expected explanation to show degraded certainty instead of inventing consistency truth

## Fixture coverage map
- Demo pack
  - `acct_alpha_001`: funded trailing, healthy but daily-buffer-limited
  - `acct_alpha_002`: funded payout-active with payout significance
  - `acct_beta_001`: evaluation progress and minimum-day separation
  - `acct_beta_002`: funded consistency / payout-processing posture
  - `acct_beta_003`: manual pause / cooldown
  - `acct_beta_004`: terminal breached reference

- Edge pack
  - `edge_alpha_exact_floor`: exact hard-floor behavior
  - `edge_alpha_above_floor`: one-cent-above behavior
  - `edge_beta_below_floor`: one-cent-below breach behavior
  - `edge_beta_collision`: payout/news collision behavior

## Suggested execution path
For now, use the built-in Node test runner with type stripping:

```bash
node --test --experimental-strip-types tests/unit/ruleEngineCore.test.ts
```

To print sample evaluation outputs:

```bash
node --experimental-strip-types scripts/rules/print-step4-evaluations.ts
```

## What to review in every result
- integrity issues
- dominant floor and dominant buffer
- effective lives and limiting source
- lifecycle-aware progression/payout interpretation
- dominant mode and its reasons
- permissions matrix
- alert severity correctness
- explanation quality
