import { evaluateOperationalTruth } from './evaluator';
import type { OperationalTruthInput } from './inputTypes';

type LegacyEngineInput = {
  balance: number;
  highWaterMark?: number | null;
  high_water_mark?: number | null;
  status?: string | null;
  stage?: string | null;
  size?: unknown;
  account_size?: unknown;
  drawdownType?: string | null;
  drawdown_type?: string | null;
  [key: string]: unknown;
};

type LegacyEngineOutput = {
  floor: number;
  totalBuffer: number;
  livesRemaining: number;
  size: unknown;
  consistencyCeiling: number;
  mode: string;
};

function normalizeLegacyStage(
  stage?: string | null,
): OperationalTruthInput['account']['lifecycleStage'] {
  switch ((stage ?? '').toLowerCase()) {
    case 'draft':
      return 'draft';
    case 'evaluation_step1':
    case 'step1':
    case 'phase_1':
      return 'evaluation_step1';
    case 'evaluation_step2':
    case 'step2':
    case 'phase_2':
      return 'evaluation_step2';
    case 'funded':
    case 'funded_active':
      return 'funded_active';
    case 'funded_payout_active':
      return 'funded_payout_active';
    case 'paused':
    case 'paused_inactive':
      return 'paused_inactive';
    case 'breached':
    case 'breached_failed':
      return 'breached_failed';
    case 'retired':
    case 'archived':
    case 'retired_archived':
      return 'retired_archived';
    default:
      return 'evaluation_step1';
  }
}

function normalizeLegacyStatus(
  status?: string | null,
): OperationalTruthInput['account']['accountStatus'] {
  switch ((status ?? '').toLowerCase()) {
    case 'paused':
      return 'paused';
    case 'stopped':
      return 'stopped';
    case 'breached':
      return 'breached';
    case 'archived':
      return 'archived';
    case 'active':
    default:
      return 'active';
  }
}

function mapModeToLegacy(modeCode: string): string {
  switch (modeCode) {
    case 'stable':
      return 'STABLE';
    case 'caution':
      return 'WARNING';
    case 'restricted':
      return 'WARNING';
    case 'paused':
      return 'STOPPED';
    case 'stopped':
      return 'STOPPED';
    case 'breached':
      return 'STOPPED';
    default:
      return 'WARNING';
  }
}

export function calculateOperationalTruth(
  input: LegacyEngineInput,
): LegacyEngineOutput {
  const resolvedHighWaterMark =
    (typeof input.highWaterMark === 'number' ? input.highWaterMark : null) ??
    (typeof input.high_water_mark === 'number' ? input.high_water_mark : null) ??
    input.balance ??
    0;

  const startingBalance = Number(resolvedHighWaterMark);
  const currentBalance = Number(input.balance ?? 0);
  const peakBalance = Number(resolvedHighWaterMark ?? currentBalance);
  const resolvedSize = input.size ?? input.account_size ?? null;
  const resolvedDrawdownType = String(
    input.drawdownType ?? input.drawdown_type ?? '',
  ).toLowerCase();

  const normalizedStatus = normalizeLegacyStatus(input.status);

  const normalizedInput: OperationalTruthInput = {
    account: {
      accountId: 'legacy-account',
      lifecycleStage: normalizeLegacyStage(input.stage),
      accountStatus: normalizedStatus,
      startingBalanceCents: Math.round(startingBalance * 100),
      currentBalanceCents: Math.round(currentBalance * 100),
      peakBalanceCents: Math.round(peakBalance * 100),
      manualPause: normalizedStatus === 'paused',
      lifeUnitCents: 100000,
    },
    ruleProfile: {
      ruleProfileId: 'legacy-rule-profile',
      ruleProfileVersionId: 'legacy-rule-profile-v1',
      maxDrawdownCents: 100000,
      dailyDrawdownCents: 50000,
      trailingMaxDrawdown:
        resolvedDrawdownType === 'trailing' ||
        resolvedDrawdownType === 'trailing_max',
      trailingDailyDrawdown:
        resolvedDrawdownType === 'trailing_daily',
      risk: {
        lifeUnitCents: 100000,
        fullRiskUnitCents: 100000,
        fractionalRiskUnitCents: 50000,
      },
      consistency: {
        enabled: false,
        ceilingCents: null,
        currentPressure: null,
        violated: false,
      },
    },
    accountDayState: {
      dayStartBalanceCents: Math.round(currentBalance * 100),
      locked: false,
    },
    payout: {
      nextEligibleAt: null,
      amountPotentiallyRequestableCents: null,
      blocked: false,
    },
    rotation: {
      state: 'inactive',
      windowStart: null,
      windowEnd: null,
      notes: null,
    },
    news: {
      locked: false,
    },
    context: {
      evaluationMode: 'live',
      evaluationTimestamp: new Date().toISOString(),
    },
  };

  const truth = evaluateOperationalTruth(normalizedInput);

  return {
    floor: truth.thresholds.effectiveMaxFloorCents / 100,
    totalBuffer: truth.thresholds.effectiveBufferCents / 100,
    livesRemaining: truth.lives.fractionalLives,
    size: resolvedSize,
    consistencyCeiling:
      truth.consistency.ceilingCents !== null
        ? truth.consistency.ceilingCents / 100
        : 0,
    mode: mapModeToLegacy(truth.mode.code),
  };
}

export { evaluateOperationalTruth };
