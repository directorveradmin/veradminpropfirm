import type {
  ExplanationItem,
  ModeCode,
  OperationalTruth,
  RestrictionState,
  WarningState,
} from './types';
import type { OperationalTruthInput } from './inputTypes';

import { calculateThresholds } from './calculators/thresholds';
import { calculateLives } from './calculators/lives';
import { assignMode } from './modeAssignment';
import { derivePermissions } from './permissions';
import { deriveWarnings } from './warnings';
import { deriveRestrictions } from './restrictions';
import { deriveRecommendations } from './recommendations';

function toIsoOrNow(value?: string | Date | null): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return value;
}

export function evaluateOperationalTruth(
  input: OperationalTruthInput,
): OperationalTruth {
  const evaluationTimestamp = toIsoOrNow(input.context?.evaluationTimestamp);

  const thresholds = calculateThresholds(input);
  const lives = calculateLives({
    thresholds,
    lifeUnitCents:
      input.ruleProfile.risk?.lifeUnitCents ??
      input.account.lifeUnitCents ??
      100000,
  });

  const restrictions = deriveRestrictions({
    input,
    thresholds,
    lives,
  });

  const mode = assignMode({
    input,
    thresholds,
    lives,
    restrictions,
  });

  const permissions = derivePermissions({
    input,
    thresholds,
    lives,
    mode,
    restrictions,
  });

  const warnings = deriveWarnings({
    input,
    thresholds,
    lives,
    mode,
    permissions,
    restrictions,
  });

  const recommendations = deriveRecommendations({
    input,
    thresholds,
    lives,
    mode,
    permissions,
    warnings,
    restrictions,
  });

  const priorTruth = input.simulation?.priorTruth;
  const priorWarnings = priorTruth?.warnings ?? [];
  const priorRestrictions = priorTruth?.restrictions ?? [];

  const truth: OperationalTruth = {
    contractVersion: '1.0.0',
    accountId: input.account.accountId,
    evaluationTimestamp,
    evaluationMode: input.context?.evaluationMode ?? 'live',
    source: {
      ruleProfileId: input.ruleProfile.ruleProfileId,
      ruleProfileVersionId: input.ruleProfile.ruleProfileVersionId,
      lifecycleStage: input.account.lifecycleStage,
      accountStatus: input.account.accountStatus,
    },
    thresholds,
    lives,
    mode,
    permissions,
    restrictions,
    warnings,
    payout: {
      state: 'unknown',
      nextEligibleAt: input.payout?.nextEligibleAt ?? null,
      amountPotentiallyRequestableCents:
        input.payout?.amountPotentiallyRequestableCents ?? null,
      blockers: [],
    },
    consistency: {
      enabled: Boolean(input.ruleProfile.consistency?.enabled),
      status: input.ruleProfile.consistency?.enabled ? 'safe' : 'inactive',
      ceilingCents: input.ruleProfile.consistency?.ceilingCents ?? null,
      currentPressure: input.ruleProfile.consistency?.currentPressure ?? null,
      blockers: input.ruleProfile.consistency?.violated
        ? ['consistency_violated']
        : [],
    },
    rotation: {
      state: input.rotation?.state ?? 'unknown',
      windowStart: input.rotation?.windowStart ?? null,
      windowEnd: input.rotation?.windowEnd ?? null,
      notes: input.rotation?.notes ?? null,
    },
    recommendations,
    explainability: {
      reasonCodes: [],
      details: [] as ExplanationItem[],
    },
    simulationDiff: priorTruth
      ? {
          changed: true,
          priorMode: priorTruth.mode.code as ModeCode,
          projectedMode: mode.code as ModeCode,
          priorLives: priorTruth.lives.effectiveLives,
          projectedLives: lives.effectiveLives,
          newlyTriggeredWarnings: warnings
            .map((w: WarningState) => w.code)
            .filter(
              (code) => !priorWarnings.some((w: WarningState) => w.code === code),
            ),
          newlyTriggeredRestrictions: restrictions
            .map((r: RestrictionState) => r.code)
            .filter(
              (code) =>
                !priorRestrictions.some(
                  (r: RestrictionState) => r.code === code,
                ),
            ),
        }
      : undefined,
  };

  return truth;
}
