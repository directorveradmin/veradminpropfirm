export type EvaluationMode = 'live' | 'simulation';

export type EngineAlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'resolved';
export type EngineMode =
  | 'attack'
  | 'preservation'
  | 'recovery'
  | 'payout_protection'
  | 'cooldown'
  | 'stopped'
  | 'breached';

export type PayoutState =
  | 'not_applicable'
  | 'blocked'
  | 'approaching'
  | 'ready'
  | 'pending';

export type ConsistencyState =
  | 'not_applicable'
  | 'not_evaluated'
  | 'within_limit'
  | 'elevated'
  | 'blocked';

export interface RuleMoneyDefinition {
  mode: 'absolute' | 'percent';
  value: number;
  referenceBasis: string;
}

export interface ParsedRuleProfile {
  metadata: {
    profileKey: string;
    displayName: string;
    firmLabel: string;
    stageType: 'evaluation' | 'funded' | 'live' | 'retired';
    accountClass:
      | 'evaluation_standard'
      | 'funded_standard'
      | 'funded_static'
      | 'funded_trailing';
  };
  drawdownRules: {
    drawdownType: 'static' | 'trailing';
    maxDrawdown: RuleMoneyDefinition;
    dailyDrawdown: {
      enabled: boolean;
      mode: 'absolute' | 'percent';
      value: number;
      referenceBasis: string;
      resetBehavior: string;
    };
  };
  stageTargetRules: {
    profitTarget: {
      enabled: boolean;
      mode: 'absolute' | 'percent';
      value: number;
    };
  };
  tradingDayRules: {
    minimumTradingDaysEnabled: boolean;
    minimumTradingDays: number;
    qualifyingDayDefinition: string;
  };
  payoutRules: {
    payoutEligibilityEnabled: boolean;
    waitingPeriodDays: number;
    payoutCadenceDays: number;
    requestWindows: Array<{ type: string; value: number | string }>;
    payoutBlockers: string[];
    payoutProtectionRelevant: boolean;
  };
  consistencyRules: {
    enabled: boolean;
    capMode?: string | null;
    capValue?: number | null;
    basisType?: string | null;
    rollingWindowSize?: number | null;
  };
  rotationEligibility: {
    fundedRotationEligible: boolean;
    cooldownCompatible: boolean;
  };
  specialRestrictions: {
    weekendRestriction: boolean;
    firmDefinedNewsRestriction: boolean;
    notes: string[];
  };
}

export interface EvaluationAccount {
  id: string;
  firmId: string;
  currentRuleProfileId: string;
  currentRuleProfileVersionId: string;
  accountLabel: string;
  externalAccountRef?: string | null;
  lifecycleStage:
    | 'draft'
    | 'evaluation_step1'
    | 'evaluation_step2'
    | 'funded_active'
    | 'funded_payout_active'
    | 'paused_inactive'
    | 'breached_failed'
    | 'retired_archived';
  accountStatus: 'active' | 'paused' | 'stopped' | 'breached' | 'archived';
  startingBalanceCents: number;
  currentBalanceCents: number;
  peakBalanceCents: number;
  daysTradedReference?: number | null;
  lastPayoutDate?: string | null;
  feeRefunded: boolean;
  manuallyPaused: boolean;
  archivedAt?: string | null;
  breachedAt?: string | null;
  notesSummary?: string | null;
}

export interface EvaluationAssignment {
  id: string;
  accountId: string;
  ruleProfileId: string;
  ruleProfileVersionId: string;
  assignedAt: string;
  endedAt?: string | null;
  assignmentReason: string;
  assignedBy: 'user' | 'system' | 'migration';
  notes?: string | null;
}

export interface EvaluationDayState {
  id: string;
  accountId: string;
  tradingDate: string;
  dayStartBalanceCents: number;
  realizedPnlTodayCents: number;
  resetCompletedAt?: string | null;
  notes?: string | null;
}

export interface EvaluationPayoutRecord {
  id: string;
  accountId: string;
  requestedAt: string;
  expectedArrivalAt?: string | null;
  receivedAt?: string | null;
  amountRequestedCents: number;
  amountReceivedCents?: number | null;
  status: 'planned' | 'requested' | 'processing' | 'paid' | 'rejected' | 'cancelled';
  notes?: string | null;
}

export interface EvaluationRotationWindow {
  id: string;
  accountId: string;
  rotationType: string;
  windowStart: string;
  windowEnd: string;
  state: 'active' | 'inactive' | 'planned' | 'completed' | 'skipped';
  reason?: string | null;
}

export interface EvaluationNewsEvent {
  id: string;
  eventTimestamp: string;
  title: string;
  impactLevel: string;
  assetScope: string;
  lockMinutesBefore: number;
  lockMinutesAfter: number;
  notes?: string | null;
}

export interface EvaluationTradeLog {
  id: string;
  accountId: string;
  tradingTimestamp: string;
  tradeDate: string;
  pnlAmountCents: number;
  resultType: 'win' | 'loss' | 'custom';
  riskUnitFraction?: number | null;
}

export interface EvaluationRuleProfileFamily {
  id: string;
  firmId: string;
  profileKey: string;
  name: string;
  stageType: 'evaluation' | 'funded' | 'live' | 'retired';
  accountClass:
    | 'evaluation_standard'
    | 'funded_standard'
    | 'funded_static'
    | 'funded_trailing';
  status: 'draft' | 'active' | 'retired';
  description?: string | null;
}

export interface EvaluationRuleProfileVersion {
  id: string;
  ruleProfileId: string;
  versionNumber: number;
  versionLabel: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string | null;
  supersedesVersionId?: string | null;
  firmRulesJson: string;
  operatorOverlayCompatibilityJson: string;
  normalizedSummaryJson?: string | null;
  notes?: string | null;
}

export interface EvaluationInput {
  account: EvaluationAccount;
  ruleProfileFamily?: EvaluationRuleProfileFamily | null;
  ruleProfileVersion?: EvaluationRuleProfileVersion | null;
  openAssignment?: EvaluationAssignment | null;
  latestDayState?: EvaluationDayState | null;
  recentPayouts?: EvaluationPayoutRecord[];
  recentRotations?: EvaluationRotationWindow[];
  upcomingNews?: EvaluationNewsEvent[];
  recentTradeLogs?: EvaluationTradeLog[];
  evaluationMode?: EvaluationMode;
  nowIso?: string;
}

export interface EngineAlert {
  code: string;
  severity: EngineAlertSeverity;
  title: string;
  message: string;
  active: boolean;
}

export interface EvaluationResult {
  identity: {
    accountId: string;
    accountLabel: string;
    evaluationTimestamp: string;
    ruleProfileVersionId: string | null;
    evaluationMode: EvaluationMode;
  };
  integrity: {
    valid: boolean;
    issues: string[];
  };
  lifecycle: {
    stage: EvaluationAccount['lifecycleStage'];
    status: EvaluationAccount['accountStatus'];
    terminal: boolean;
    paused: boolean;
    archived: boolean;
  };
  references: {
    startingBalanceCents: number;
    currentBalanceCents: number;
    peakBalanceCents: number;
    dayStartBalanceCents: number | null;
    totalProfitCents: number;
    fullRiskAmountCents: number;
  };
  thresholds: {
    hardFloorCents: number | null;
    dailyFloorCents: number | null;
    dominantFloorType: 'hard' | 'daily' | 'none';
    dominantFloorCents: number | null;
    hardBufferCents: number | null;
    dailyBufferCents: number | null;
    dominantBufferCents: number | null;
  };
  lives: {
    hardFullLives: number | null;
    hardFractionalLives: number | null;
    dailyFullLives: number | null;
    dailyFractionalLives: number | null;
    effectiveFullLives: number;
    effectiveFractionalLives: number;
    limitingSource: 'hard' | 'daily' | 'none';
  };
  progression: {
    minimumTradingDaysRequired: number;
    minimumTradingDaysMet: boolean;
    daysTradedReference: number;
    targetEnabled: boolean;
    targetCents: number;
    targetRemainingCents: number | null;
    targetProgressRatio: number | null;
    targetMet: boolean;
    stageCompletionEligible: boolean;
  };
  payout: {
    relevant: boolean;
    state: PayoutState;
    waitingPeriodMet: boolean;
    cadenceMet: boolean;
    nextEligibleAt: string | null;
    blockers: string[];
    pendingPayoutStatus: string | null;
    payoutProtectionRelevant: boolean;
  };
  consistency: {
    relevant: boolean;
    state: ConsistencyState;
    details: string[];
  };
  restrictions: {
    active: string[];
    dominant: string | null;
    hardStop: boolean;
    hardStopReason: string | null;
    newsLockActive: boolean;
    newsLockUpcoming: boolean;
    rotationLockActive: boolean;
  };
  mode: {
    value: EngineMode;
    reasons: string[];
  };
  permissions: {
    mayTrade: boolean;
    mayTradeFullSize: boolean;
    mayTradeFractionalOnly: boolean;
    mustNotTrade: boolean;
    allowedRiskAmountCents: number;
    mayRequestPayout: boolean;
    mayResume: boolean;
    mayOverride: boolean;
  };
  alerts: EngineAlert[];
  nextAction: {
    code: string;
    priority: Exclude<EngineAlertSeverity, 'resolved'>;
    summary: string;
    reasonCodes: string[];
  };
  explanations: {
    summary: string;
    whyThisState: string[];
    whyNotTradable: string[];
    whyPayoutBlocked: string[];
    dominantRestriction: string | null;
  };
}
