import type {
  AccountStatus,
  EvaluationMode,
  LifecycleStage,
  OperationalTruth,
} from './types';

export type OperationalTruthInput = {
  account: {
    accountId: string;
    lifecycleStage: LifecycleStage;
    accountStatus: AccountStatus;
    startingBalanceCents: number;
    currentBalanceCents: number;
    peakBalanceCents: number;
    manualPause?: boolean;
    lifeUnitCents?: number | null;
  };
  ruleProfile: {
    ruleProfileId: string;
    ruleProfileVersionId: string;
    maxDrawdownCents: number;
    dailyDrawdownCents?: number | null;
    trailingMaxDrawdown?: boolean;
    trailingDailyDrawdown?: boolean;
    risk?: {
      lifeUnitCents?: number | null;
      fullRiskUnitCents?: number | null;
      fractionalRiskUnitCents?: number | null;
    };
    consistency?: {
      enabled?: boolean;
      ceilingCents?: number | null;
      currentPressure?: number | null;
      violated?: boolean;
    };
  };
  accountDayState?: {
    dayStartBalanceCents?: number | null;
    locked?: boolean;
  } | null;
  payout?: {
    nextEligibleAt?: string | null;
    amountPotentiallyRequestableCents?: number | null;
    blocked?: boolean;
  } | null;
  rotation?: {
    state?: 'active' | 'rest' | 'planned' | 'inactive' | 'unknown';
    windowStart?: string | null;
    windowEnd?: string | null;
    notes?: string | null;
  } | null;
  news?: {
    locked?: boolean;
  } | null;
  context?: {
    evaluationTimestamp?: string | Date | null;
    evaluationMode?: EvaluationMode;
  } | null;
  simulation?: {
    priorTruth?: OperationalTruth;
  } | null;
};