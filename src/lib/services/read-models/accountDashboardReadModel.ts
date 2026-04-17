type EvaluateAccountResult = Awaited<
  ReturnType<
    typeof import('../operationalTruth/evaluateAccountOperationalTruth')
      .evaluateAccountOperationalTruth
  >
>;

export type AccountDashboardReadModel = {
  account: {
    id: EvaluateAccountResult['account']['id'];
    label: EvaluateAccountResult['account']['label'];
  };
  evaluatedAt: string;
  mode: {
    code: EvaluateAccountResult['truth']['mode']['code'];
    label: EvaluateAccountResult['truth']['mode']['label'];
    severity: EvaluateAccountResult['truth']['mode']['severity'];
  };
  counts: {
    warnings: number;
    restrictions: number;
    alerts: number;
  };
  buffer: {
    effectiveBufferCents: number;
    effectiveBufferDollars: number;
  };
  lives: {
    effectiveLives: number;
    fractionalLives: number;
  };
  permissions: {
    mayTrade: boolean;
    mayTradeFullSize: boolean;
    mayTradeFractionalOnly: boolean;
    mustNotTrade: boolean;
    mayRequestPayout: boolean;
  };
  payout: {
    state: EvaluateAccountResult['truth']['payout']['state'];
    nextEligibleAt: EvaluateAccountResult['truth']['payout']['nextEligibleAt'];
    amountPotentiallyRequestableCents: EvaluateAccountResult['truth']['payout']['amountPotentiallyRequestableCents'];
  };
  recommendation: {
    nextBestAction: EvaluateAccountResult['truth']['recommendations']['nextBestAction'];
    priority: EvaluateAccountResult['truth']['recommendations']['priority'];
    shortSummary: EvaluateAccountResult['truth']['recommendations']['shortSummary'];
  };
};

function roundToTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

export function buildAccountDashboardReadModel(
  result: EvaluateAccountResult,
  alertsCount: number,
): AccountDashboardReadModel {
  return {
    account: {
      id: result.account.id,
      label: result.account.label,
    },

    evaluatedAt: result.evaluatedAt,

    mode: {
      code: result.truth.mode.code,
      label: result.truth.mode.label,
      severity: result.truth.mode.severity,
    },

    counts: {
      warnings: result.truth.warnings.length,
      restrictions: result.truth.restrictions.length,
      alerts: alertsCount,
    },

    buffer: {
      effectiveBufferCents: result.truth.thresholds.effectiveBufferCents,
      effectiveBufferDollars: roundToTwoDecimals(
        result.truth.thresholds.effectiveBufferCents / 100,
      ),
    },

    lives: {
      effectiveLives: result.truth.lives.effectiveLives,
      fractionalLives: roundToTwoDecimals(result.truth.lives.fractionalLives),
    },

    permissions: {
      mayTrade: result.truth.permissions.mayTrade,
      mayTradeFullSize: result.truth.permissions.mayTradeFullSize,
      mayTradeFractionalOnly:
        result.truth.permissions.mayTradeFractionalOnly,
      mustNotTrade: result.truth.permissions.mustNotTrade,
      mayRequestPayout: result.truth.permissions.mayRequestPayout,
    },

    payout: {
      state: result.truth.payout.state,
      nextEligibleAt: result.truth.payout.nextEligibleAt,
      amountPotentiallyRequestableCents:
        result.truth.payout.amountPotentiallyRequestableCents,
    },

    recommendation: {
      nextBestAction: result.truth.recommendations.nextBestAction,
      priority: result.truth.recommendations.priority,
      shortSummary: result.truth.recommendations.shortSummary,
    },
  };
}