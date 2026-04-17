import type { AccountRepositoryRecord } from '../../db/repositories/accountsRepository';
import type { OperationalTruthInput } from '../../domain/rules/inputTypes';

const DEFAULT_RULE_PROFILE_VERSION = 'embedded-account-v1';
const DEFAULT_EVALUATION_MODE: NonNullable<OperationalTruthInput['context']>['evaluationMode'] =
  'live';

type LifecycleStage = OperationalTruthInput['account']['lifecycleStage'];
type AccountStatus = OperationalTruthInput['account']['accountStatus'];

function toCents(value: number | null | undefined, fallback = 0): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.round(value * 100);
}

function normalizeAccountStatus(status: string | null | undefined): AccountStatus {
  switch (String(status ?? '').trim().toLowerCase()) {
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

function normalizeLifecycleStage(stage: string | null | undefined): LifecycleStage {
  const normalized = String(stage ?? '').trim().toUpperCase();

  switch (normalized) {
    case 'FUNDED':
      return 'funded_active';
    case 'INSTANT_FUNDED':
      return 'funded_active';
    case 'STAGE_2':
      return 'evaluation_step2';
    case 'STAGE_1':
    default:
      return 'evaluation_step1';
  }
}

function buildEmbeddedRuleProfileId(account: AccountRepositoryRecord): string {
  return ['embedded', account.id, account.accountSize, account.drawdownType, account.stage].join(
    ':',
  );
}

function buildEmbeddedRuleProfile(
  account: AccountRepositoryRecord,
): OperationalTruthInput['ruleProfile'] {
  return {
    ruleProfileId: buildEmbeddedRuleProfileId(account),
    ruleProfileVersionId: DEFAULT_RULE_PROFILE_VERSION,
    maxDrawdownCents:
      account.maxLimitPct !== null
        ? toCents(account.accountSize * account.maxLimitPct)
        : 100_000,
    dailyDrawdownCents:
      account.dailyLimitPct !== null
        ? toCents(account.accountSize * account.dailyLimitPct)
        : null,
    trailingMaxDrawdown: account.drawdownType === 'TRAILING',
    trailingDailyDrawdown: false,
    risk: {
      fullRiskUnitCents: 100_000,
      fractionalRiskUnitCents: 50_000,
      lifeUnitCents: 100_000,
    },
    consistency: {
      enabled: false,
      ceilingCents: null,
      currentPressure: null,
      violated: false,
    },
  };
}

export type AssembleOperationalTruthInputOptions = {
  account: AccountRepositoryRecord;
  context?: OperationalTruthInput['context'];
  accountDayState?: OperationalTruthInput['accountDayState'];
  payout?: OperationalTruthInput['payout'];
  rotation?: OperationalTruthInput['rotation'];
  news?: OperationalTruthInput['news'];
  simulation?: OperationalTruthInput['simulation'];
  accountOverrides?: Partial<OperationalTruthInput['account']>;
  ruleProfileOverrides?: Partial<OperationalTruthInput['ruleProfile']>;
};

export function assembleOperationalTruthInput(
  options: AssembleOperationalTruthInputOptions,
): OperationalTruthInput {
  const {
    account,
    context,
    accountDayState,
    payout,
    rotation,
    news,
    simulation,
    accountOverrides,
    ruleProfileOverrides,
  } = options;

  const currentBalanceCents = toCents(account.balance);
  const peakBalanceCents = Math.max(
    toCents(account.highWaterMark, currentBalanceCents),
    currentBalanceCents,
  );

  const baseAccountInput: OperationalTruthInput['account'] = {
    accountId: account.id,
    lifecycleStage: normalizeLifecycleStage(account.stage),
    accountStatus: normalizeAccountStatus(account.status),
    manualPause: normalizeAccountStatus(account.status) === 'paused',
    startingBalanceCents: toCents(account.accountSize),
    currentBalanceCents,
    peakBalanceCents,
    lifeUnitCents: 100_000,
  };

  const baseRuleProfile = buildEmbeddedRuleProfile(account);

  return {
    account: {
      ...baseAccountInput,
      ...accountOverrides,
    },
    ruleProfile: {
      ...baseRuleProfile,
      ...ruleProfileOverrides,
    },
    accountDayState: accountDayState ?? null,
    payout:
      payout ??
      {
        nextEligibleAt: null,
        amountPotentiallyRequestableCents: null,
        blocked: false,
      },
    rotation:
      rotation ??
      {
        state: 'inactive',
        windowStart: null,
        windowEnd: null,
        notes: null,
      },
    news:
      news ??
      {
        locked: false,
      },
    simulation: simulation ?? null,
    context: {
      evaluationMode: context?.evaluationMode ?? DEFAULT_EVALUATION_MODE,
      evaluationTimestamp:
        context?.evaluationTimestamp instanceof Date
          ? context.evaluationTimestamp.toISOString()
          : context?.evaluationTimestamp ?? new Date().toISOString(),
    },
  };
}

