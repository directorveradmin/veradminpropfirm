import type {
  EvaluationAccount,
  EvaluationAssignment,
  EvaluationDayState,
  EvaluationInput,
  EvaluationNewsEvent,
  EvaluationPayoutRecord,
  EvaluationRuleProfileFamily,
  EvaluationRuleProfileVersion,
} from '../../src/lib/domain/rules/types';

function clone<T>(value: T): T {
  return structuredClone(value);
}

function buildFundedTrailingVersion(id: string, ruleProfileId: string): EvaluationRuleProfileVersion {
  return {
    id,
    ruleProfileId,
    versionNumber: 1,
    versionLabel: 'v1',
    isActive: true,
    effectiveFrom: '2026-01-01T00:00:00Z',
    effectiveTo: null,
    supersedesVersionId: null,
    operatorOverlayCompatibilityJson: JSON.stringify({
      cooldownCompatible: true,
      fundedRotationEligible: true,
    }),
    normalizedSummaryJson: JSON.stringify({
      drawdownType: 'trailing',
      maxDrawdownDollars: 5000,
      dailyDrawdownDollars: 2500,
    }),
    notes: 'Scenario fixture funded trailing profile.',
    firmRulesJson: JSON.stringify({
      metadata: {
        profileKey: 'funded_trailing',
        displayName: 'Funded Trailing',
        firmLabel: 'Example Firm Alpha',
        stageType: 'funded',
        accountClass: 'funded_trailing',
      },
      drawdownRules: {
        drawdownType: 'trailing',
        maxDrawdown: {
          mode: 'absolute',
          value: 500000,
          referenceBasis: 'peak_balance_cents',
        },
        dailyDrawdown: {
          enabled: true,
          mode: 'absolute',
          value: 250000,
          referenceBasis: 'day_start_balance_cents',
          resetBehavior: 'daily_reset',
        },
      },
      stageTargetRules: {
        profitTarget: {
          enabled: false,
          mode: 'absolute',
          value: 0,
        },
      },
      tradingDayRules: {
        minimumTradingDaysEnabled: true,
        minimumTradingDays: 5,
        qualifyingDayDefinition: 'any_realized_session',
      },
      payoutRules: {
        payoutEligibilityEnabled: true,
        waitingPeriodDays: 5,
        payoutCadenceDays: 14,
        requestWindows: [],
        payoutBlockers: [],
        payoutProtectionRelevant: true,
      },
      consistencyRules: {
        enabled: false,
        capMode: null,
        capValue: null,
        basisType: null,
        rollingWindowSize: null,
      },
      rotationEligibility: {
        fundedRotationEligible: true,
        cooldownCompatible: true,
      },
      specialRestrictions: {
        weekendRestriction: false,
        firmDefinedNewsRestriction: true,
        notes: [],
      },
    }),
  };
}

function buildEvaluationStaticVersion(id: string, ruleProfileId: string): EvaluationRuleProfileVersion {
  return {
    id,
    ruleProfileId,
    versionNumber: 1,
    versionLabel: 'v1',
    isActive: true,
    effectiveFrom: '2026-01-01T00:00:00Z',
    effectiveTo: null,
    supersedesVersionId: null,
    operatorOverlayCompatibilityJson: JSON.stringify({
      cooldownCompatible: true,
      fundedRotationEligible: false,
    }),
    normalizedSummaryJson: JSON.stringify({
      drawdownType: 'static',
      maxDrawdownDollars: 6000,
      dailyDrawdownDollars: 2500,
      targetDollars: 8000,
    }),
    notes: 'Scenario fixture evaluation static profile.',
    firmRulesJson: JSON.stringify({
      metadata: {
        profileKey: 'eval_static_target',
        displayName: 'Evaluation Static Target',
        firmLabel: 'Example Firm Beta',
        stageType: 'evaluation',
        accountClass: 'evaluation_standard',
      },
      drawdownRules: {
        drawdownType: 'static',
        maxDrawdown: {
          mode: 'absolute',
          value: 600000,
          referenceBasis: 'starting_balance_cents',
        },
        dailyDrawdown: {
          enabled: true,
          mode: 'absolute',
          value: 250000,
          referenceBasis: 'day_start_balance_cents',
          resetBehavior: 'daily_reset',
        },
      },
      stageTargetRules: {
        profitTarget: {
          enabled: true,
          mode: 'absolute',
          value: 800000,
        },
      },
      tradingDayRules: {
        minimumTradingDaysEnabled: true,
        minimumTradingDays: 5,
        qualifyingDayDefinition: 'any_realized_session',
      },
      payoutRules: {
        payoutEligibilityEnabled: false,
        waitingPeriodDays: 0,
        payoutCadenceDays: 0,
        requestWindows: [],
        payoutBlockers: [],
        payoutProtectionRelevant: false,
      },
      consistencyRules: {
        enabled: false,
        capMode: null,
        capValue: null,
        basisType: null,
        rollingWindowSize: null,
      },
      rotationEligibility: {
        fundedRotationEligible: false,
        cooldownCompatible: true,
      },
      specialRestrictions: {
        weekendRestriction: false,
        firmDefinedNewsRestriction: false,
        notes: [],
      },
    }),
  };
}

const fundedTrailingFamily: EvaluationRuleProfileFamily = {
  id: 'rp_funded_trailing',
  firmId: 'firm_alpha',
  profileKey: 'funded_trailing',
  name: 'Funded Trailing',
  stageType: 'funded',
  accountClass: 'funded_trailing',
  status: 'active',
  description: 'Scenario fixture funded trailing profile family.',
};

const evaluationStaticFamily: EvaluationRuleProfileFamily = {
  id: 'rp_eval_static',
  firmId: 'firm_beta',
  profileKey: 'eval_static_target',
  name: 'Evaluation Static Target',
  stageType: 'evaluation',
  accountClass: 'evaluation_standard',
  status: 'active',
  description: 'Scenario fixture evaluation static profile family.',
};

const fundedTrailingVersion = buildFundedTrailingVersion('rpv_funded_trailing_v1', fundedTrailingFamily.id);
const evaluationStaticVersion = buildEvaluationStaticVersion('rpv_eval_static_v1', evaluationStaticFamily.id);

function fundedAssignment(accountId: string): EvaluationAssignment {
  return {
    id: `assignment_${accountId}`,
    accountId,
    ruleProfileId: fundedTrailingFamily.id,
    ruleProfileVersionId: fundedTrailingVersion.id,
    assignedAt: '2026-03-01T00:00:00Z',
    endedAt: null,
    assignmentReason: 'fixture_seed',
    assignedBy: 'migration',
    notes: null,
  };
}

function evaluationAssignment(accountId: string): EvaluationAssignment {
  return {
    id: `assignment_${accountId}`,
    accountId,
    ruleProfileId: evaluationStaticFamily.id,
    ruleProfileVersionId: evaluationStaticVersion.id,
    assignedAt: '2026-03-10T00:00:00Z',
    endedAt: null,
    assignmentReason: 'fixture_seed',
    assignedBy: 'migration',
    notes: null,
  };
}

function dayState(accountId: string, tradingDate: string, dayStartBalanceCents: number, realizedPnlTodayCents: number): EvaluationDayState {
  return {
    id: `day_${accountId}_${tradingDate}`,
    accountId,
    tradingDate,
    dayStartBalanceCents,
    realizedPnlTodayCents,
    resetCompletedAt: `${tradingDate}T00:01:00Z`,
    notes: null,
  };
}

function payout(accountId: string, status: EvaluationPayoutRecord['status'], requestedAt: string): EvaluationPayoutRecord {
  return {
    id: `payout_${accountId}_${status}`,
    accountId,
    requestedAt,
    expectedArrivalAt: null,
    receivedAt: null,
    amountRequestedCents: 120000,
    amountReceivedCents: null,
    status,
    notes: null,
  };
}

const collisionNews: EvaluationNewsEvent = {
  id: 'news_collision',
  eventTimestamp: '2026-04-05T12:30:00Z',
  title: 'High-impact macro release',
  impactLevel: 'high',
  assetScope: 'indices',
  lockMinutesBefore: 15,
  lockMinutesAfter: 15,
  notes: null,
};

const demoAlpha001: EvaluationInput = {
  account: {
    id: 'acct_alpha_001',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Demo Alpha 001',
    externalAccountRef: 'ALPHA-001',
    lifecycleStage: 'funded_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 10100000,
    peakBalanceCents: 10400000,
    daysTradedReference: 6,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('acct_alpha_001'),
  latestDayState: dayState('acct_alpha_001', '2026-04-05', 10150000, -50000),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const demoAlpha002: EvaluationInput = {
  account: {
    id: 'acct_alpha_002',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Demo Alpha 002',
    externalAccountRef: 'ALPHA-002',
    lifecycleStage: 'funded_payout_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 10200000,
    peakBalanceCents: 10600000,
    daysTradedReference: 7,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('acct_alpha_002'),
  latestDayState: dayState('acct_alpha_002', '2026-04-05', 10300000, -100000),
  recentPayouts: [payout('acct_alpha_002', 'planned', '2026-04-05T09:00:00Z')],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const demoBeta001: EvaluationInput = {
  account: {
    id: 'acct_beta_001',
    firmId: 'firm_beta',
    currentRuleProfileId: evaluationStaticFamily.id,
    currentRuleProfileVersionId: evaluationStaticVersion.id,
    accountLabel: 'Demo Beta 001',
    externalAccountRef: 'BETA-001',
    lifecycleStage: 'evaluation_step1',
    accountStatus: 'active',
    startingBalanceCents: 5000000,
    currentBalanceCents: 5300000,
    peakBalanceCents: 5300000,
    daysTradedReference: 3,
    lastPayoutDate: null,
    feeRefunded: false,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: evaluationStaticFamily,
  ruleProfileVersion: evaluationStaticVersion,
  openAssignment: evaluationAssignment('acct_beta_001'),
  latestDayState: dayState('acct_beta_001', '2026-04-05', 5200000, 100000),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const demoBeta003: EvaluationInput = {
  account: {
    id: 'acct_beta_003',
    firmId: 'firm_beta',
    currentRuleProfileId: evaluationStaticFamily.id,
    currentRuleProfileVersionId: evaluationStaticVersion.id,
    accountLabel: 'Demo Beta 003',
    externalAccountRef: 'BETA-003',
    lifecycleStage: 'paused_inactive',
    accountStatus: 'paused',
    startingBalanceCents: 5000000,
    currentBalanceCents: 5100000,
    peakBalanceCents: 5200000,
    daysTradedReference: 4,
    lastPayoutDate: null,
    feeRefunded: false,
    manuallyPaused: true,
    archivedAt: null,
    breachedAt: null,
    notesSummary: 'Paused deliberately.',
  },
  ruleProfileFamily: evaluationStaticFamily,
  ruleProfileVersion: evaluationStaticVersion,
  openAssignment: evaluationAssignment('acct_beta_003'),
  latestDayState: dayState('acct_beta_003', '2026-04-05', 5100000, 0),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const edgeAlphaExactFloor: EvaluationInput = {
  account: {
    id: 'edge_alpha_exact_floor',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Edge Alpha Exact Floor',
    externalAccountRef: 'EDGE-ALPHA-EXACT',
    lifecycleStage: 'funded_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 9800000,
    peakBalanceCents: 10300000,
    daysTradedReference: 6,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('edge_alpha_exact_floor'),
  latestDayState: dayState('edge_alpha_exact_floor', '2026-04-05', 10000000, -200000),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const edgeAlphaAboveFloor: EvaluationInput = {
  account: {
    id: 'edge_alpha_above_floor',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Edge Alpha Above Floor',
    externalAccountRef: 'EDGE-ALPHA-ABOVE',
    lifecycleStage: 'funded_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 9800001,
    peakBalanceCents: 10300000,
    daysTradedReference: 6,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('edge_alpha_above_floor'),
  latestDayState: dayState('edge_alpha_above_floor', '2026-04-05', 10000000, -199999),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const edgeBetaBelowFloor: EvaluationInput = {
  account: {
    id: 'edge_beta_below_floor',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Edge Beta Below Floor',
    externalAccountRef: 'EDGE-BETA-BELOW',
    lifecycleStage: 'funded_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 9799999,
    peakBalanceCents: 10300000,
    daysTradedReference: 6,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('edge_beta_below_floor'),
  latestDayState: dayState('edge_beta_below_floor', '2026-04-05', 10000000, -200001),
  recentPayouts: [],
  recentRotations: [],
  upcomingNews: [],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T10:00:00Z',
};

const edgeBetaCollision: EvaluationInput = {
  account: {
    id: 'edge_beta_collision',
    firmId: 'firm_alpha',
    currentRuleProfileId: fundedTrailingFamily.id,
    currentRuleProfileVersionId: fundedTrailingVersion.id,
    accountLabel: 'Edge Beta Collision',
    externalAccountRef: 'EDGE-BETA-COLLISION',
    lifecycleStage: 'funded_payout_active',
    accountStatus: 'active',
    startingBalanceCents: 10000000,
    currentBalanceCents: 10250000,
    peakBalanceCents: 10600000,
    daysTradedReference: 8,
    lastPayoutDate: null,
    feeRefunded: true,
    manuallyPaused: false,
    archivedAt: null,
    breachedAt: null,
    notesSummary: null,
  },
  ruleProfileFamily: fundedTrailingFamily,
  ruleProfileVersion: fundedTrailingVersion,
  openAssignment: fundedAssignment('edge_beta_collision'),
  latestDayState: dayState('edge_beta_collision', '2026-04-05', 10300000, -50000),
  recentPayouts: [payout('edge_beta_collision', 'planned', '2026-04-05T11:00:00Z')],
  recentRotations: [],
  upcomingNews: [collisionNews],
  recentTradeLogs: [],
  evaluationMode: 'live',
  nowIso: '2026-04-05T12:20:00Z',
};

const scenarios: Record<string, EvaluationInput> = {
  acct_alpha_001: demoAlpha001,
  acct_alpha_002: demoAlpha002,
  acct_beta_001: demoBeta001,
  acct_beta_003: demoBeta003,
  edge_alpha_exact_floor: edgeAlphaExactFloor,
  edge_alpha_above_floor: edgeAlphaAboveFloor,
  edge_beta_below_floor: edgeBetaBelowFloor,
  edge_beta_collision: edgeBetaCollision,
};

function getScenario(accountId: string): EvaluationInput {
  const scenario = scenarios[accountId];
  if (!scenario) {
    throw new Error(`Unknown Step 4 scenario account id: ${accountId}`);
  }
  return clone(scenario);
}

export function getDemoFixtureInput(accountId: string): EvaluationInput {
  return getScenario(accountId);
}

export function getEdgeFixtureInput(accountId: string): EvaluationInput {
  return getScenario(accountId);
}
