export type ContractVersion = '1.0.0';

export type EvaluationMode = 'live' | 'simulation';

export type LifecycleStage =
  | 'draft'
  | 'evaluation_step1'
  | 'evaluation_step2'
  | 'funded_active'
  | 'funded_payout_active'
  | 'paused_inactive'
  | 'breached_failed'
  | 'retired_archived';

export type AccountStatus =
  | 'active'
  | 'paused'
  | 'stopped'
  | 'breached'
  | 'archived';

export type ModeCode =
  | 'stable'
  | 'caution'
  | 'restricted'
  | 'paused'
  | 'stopped'
  | 'breached'
  | 'unknown';

export type ReasonCode =
  | 'buffer_healthy'
  | 'buffer_low'
  | 'buffer_critical'
  | 'daily_floor_active'
  | 'daily_floor_not_configured'
  | 'daily_loss_lock'
  | 'max_drawdown_lock'
  | 'lives_healthy'
  | 'lives_low'
  | 'lives_exhausted'
  | 'manual_pause'
  | 'account_stopped'
  | 'account_breached'
  | 'account_archived'
  | 'consistency_watch'
  | 'consistency_violated'
  | 'payout_ready'
  | 'payout_blocked'
  | 'rotation_rest'
  | 'rotation_inactive'
  | 'news_lock'
  | 'restriction_active'
  | 'warning_active'
  | 'simulation_projection'
  | 'unknown';

export type RestrictionCode =
  | 'no_trading_manual_pause'
  | 'no_trading_account_stopped'
  | 'no_trading_account_breached'
  | 'no_trading_daily_lock'
  | 'no_trading_max_drawdown'
  | 'no_trading_rotation_rest'
  | 'no_trading_news_lock'
  | 'fractional_only'
  | 'payout_blocked'
  | 'unknown';

export type WarningCode =
  | 'low_effective_buffer'
  | 'low_effective_lives'
  | 'daily_floor_near'
  | 'consistency_pressure'
  | 'payout_ready'
  | 'manual_pause_active'
  | 'rotation_rest_active'
  | 'news_lock_active'
  | 'unknown';

export type PayoutStateCode =
  | 'not_ready'
  | 'ready'
  | 'requested'
  | 'paid'
  | 'blocked'
  | 'unknown';

export type RecommendationCode =
  | 'continue_normal_operation'
  | 'reduce_risk'
  | 'trade_fractional_only'
  | 'pause_trading'
  | 'resolve_blocker'
  | 'request_payout'
  | 'review_rotation'
  | 'review_news_lock'
  | 'unknown';

export type ModeSeverity = 'normal' | 'caution' | 'danger' | 'lock';

export type RestrictionSeverity = 'low' | 'medium' | 'high' | 'critical';
export type WarningSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

export type RestrictionState = {
  code: RestrictionCode;
  label: string;
  summary: string;
  severity: RestrictionSeverity;
  blocksTrading: boolean;
  blocksPayout: boolean;
  reasonCodes: ReasonCode[];
};

export type WarningState = {
  code: WarningCode;
  label: string;
  summary: string;
  severity: WarningSeverity;
  reasonCodes: ReasonCode[];
};

export type ExplanationItem = {
  section:
    | 'thresholds'
    | 'lives'
    | 'mode'
    | 'permissions'
    | 'warnings'
    | 'restrictions'
    | 'payout'
    | 'consistency'
    | 'rotation'
    | 'recommendations'
    | 'simulation';
  label: string;
  summary: string;
  reasonCodes: ReasonCode[];
};

export type OperationalTruth = {
  contractVersion: ContractVersion;
  accountId: string;
  evaluationTimestamp: string;
  evaluationMode: EvaluationMode;
  source: {
    ruleProfileId: string;
    ruleProfileVersionId: string;
    lifecycleStage: LifecycleStage;
    accountStatus: AccountStatus;
  };
  thresholds: {
    startingBalanceCents: number;
    currentBalanceCents: number;
    peakBalanceCents: number;
    effectiveMaxFloorCents: number;
    effectiveDailyFloorCents: number | null;
    maxBufferCents: number;
    dailyBufferCents: number | null;
    effectiveBufferCents: number;
    fullRiskUnitCents: number;
    currentlyAllowedRiskUnitCents: number;
  };
  lives: {
    maxLimitedLives: number;
    dailyLimitedLives: number | null;
    effectiveLives: number;
    fractionalLives: number;
    lifeUnitCents: number;
  };
  mode: {
    code: ModeCode;
    label: string;
    severity: ModeSeverity;
    enteredBecause: ReasonCode[];
  };
  permissions: {
    mayTrade: boolean;
    mayTradeFullSize: boolean;
    mayTradeFractionalOnly: boolean;
    mustNotTrade: boolean;
    mayRequestPayout: boolean;
    mayPause: boolean;
    mayResume: boolean;
    mayOverride: boolean;
  };
  restrictions: RestrictionState[];
  warnings: WarningState[];
  payout: {
    state: PayoutStateCode;
    nextEligibleAt: string | null;
    amountPotentiallyRequestableCents: number | null;
    blockers: ReasonCode[];
  };
  consistency: {
    enabled: boolean;
    status: 'inactive' | 'safe' | 'watch' | 'violated' | 'unknown';
    ceilingCents: number | null;
    currentPressure: number | null;
    blockers: ReasonCode[];
  };
  rotation: {
    state: 'active' | 'rest' | 'planned' | 'inactive' | 'unknown';
    windowStart: string | null;
    windowEnd: string | null;
    notes: string | null;
  };
  recommendations: {
    nextBestAction: RecommendationCode;
    priority: RecommendationPriority;
    shortSummary: string;
    reasonCodes: ReasonCode[];
  };
  explainability: {
    reasonCodes: ReasonCode[];
    details: ExplanationItem[];
  };
  simulationDiff?: {
    changed: boolean;
    priorMode?: ModeCode;
    projectedMode?: ModeCode;
    priorLives?: number;
    projectedLives?: number;
    newlyTriggeredWarnings?: WarningCode[];
    newlyTriggeredRestrictions?: RestrictionCode[];
  };
};
