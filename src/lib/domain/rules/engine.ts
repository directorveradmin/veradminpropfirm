import type {
  EngineAlert,
  EvaluationInput,
  EvaluationNewsEvent,
  EvaluationResult,
  EvaluationRotationWindow,
  EvaluationTradeLog,
  ParsedRuleProfile,
  RuleMoneyDefinition,
} from './types';

const STANDARD_RISK_UNIT_BPS = 100;
const MINIMUM_TRADABLE_LIVES = 0.25;
const FRACTIONAL_ONLY_LIVES_MAX = 2;
const FULL_SIZE_LIVES_MIN = 2;
const RECOVERY_LIVES_MAX = 1;
const PRESERVATION_LIVES_MAX = 2;
const PAYOUT_APPROACHING_WINDOW_DAYS = 3;

function roundLives(value: number | null): number | null {
  if (value === null || Number.isNaN(value)) return null;
  return Math.max(0, Math.round(value * 100) / 100);
}

function addDays(isoDateOrDateTime: string, days: number): string {
  const base = new Date(isoDateOrDateTime.length === 10 ? `${isoDateOrDateTime}T00:00:00Z` : isoDateOrDateTime);
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString();
}

function diffDays(laterIso: string, earlierIso: string): number {
  const later = new Date(laterIso).getTime();
  const earlier = new Date(earlierIso).getTime();
  return (later - earlier) / (1000 * 60 * 60 * 24);
}

function parseRuleProfile(firmRulesJson: string): ParsedRuleProfile | null {
  try {
    return JSON.parse(firmRulesJson) as ParsedRuleProfile;
  } catch {
    return null;
  }
}

function getReferenceValue(referenceBasis: string, refs: {
  startingBalanceCents: number;
  currentBalanceCents: number;
  peakBalanceCents: number;
  dayStartBalanceCents: number | null;
}): number | null {
  switch (referenceBasis) {
    case 'starting_balance_cents':
      return refs.startingBalanceCents;
    case 'current_balance_cents':
      return refs.currentBalanceCents;
    case 'peak_balance_cents':
      return refs.peakBalanceCents;
    case 'day_start_balance_cents':
      return refs.dayStartBalanceCents;
    default:
      return null;
  }
}

function resolveLossAmountCents(definition: RuleMoneyDefinition, refs: {
  startingBalanceCents: number;
  currentBalanceCents: number;
  peakBalanceCents: number;
  dayStartBalanceCents: number | null;
}): number | null {
  const referenceValue = getReferenceValue(definition.referenceBasis, refs);
  if (referenceValue === null) return null;
  if (definition.mode === 'absolute') return Math.round(definition.value);
  return Math.round(referenceValue * (definition.value / 100));
}

function buildAlert(code: string, severity: EngineAlert['severity'], title: string, message: string): EngineAlert {
  return { code, severity, title, message, active: true };
}

function inWindow(nowIso: string, startIso: string, endIso: string): boolean {
  const now = new Date(nowIso).getTime();
  return now >= new Date(startIso).getTime() && now <= new Date(endIso).getTime();
}

function getNewsLockState(nowIso: string, news: EvaluationNewsEvent[]) {
  for (const item of news) {
    const eventTime = new Date(item.eventTimestamp).getTime();
    const activeFrom = new Date(eventTime - item.lockMinutesBefore * 60_000).toISOString();
    const activeTo = new Date(eventTime + item.lockMinutesAfter * 60_000).toISOString();
    if (inWindow(nowIso, activeFrom, activeTo)) {
      return { active: true, upcoming: false, item };
    }
    if (new Date(nowIso).getTime() < new Date(activeFrom).getTime()) {
      return { active: false, upcoming: true, item };
    }
  }
  return { active: false, upcoming: false, item: null as EvaluationNewsEvent | null };
}

function getRotationLock(nowIso: string, rotations: EvaluationRotationWindow[]) {
  return rotations.find((rotation) => {
    const restLike = /rest|cooldown|inactive/i.test(rotation.rotationType) || rotation.state === 'inactive';
    return restLike && inWindow(nowIso, rotation.windowStart, rotation.windowEnd);
  }) ?? null;
}

function evaluateConsistency(recentTradeLogs: EvaluationTradeLog[] | undefined, totalProfitCents: number, enabled: boolean, capValue?: number | null) {
  if (!enabled) {
    return { relevant: false, state: 'not_applicable' as const, details: [] as string[] };
  }
  if (!recentTradeLogs || recentTradeLogs.length === 0 || totalProfitCents <= 0 || !capValue) {
    return {
      relevant: true,
      state: 'not_evaluated' as const,
      details: ['Consistency profile is active but recent trade contributions were not available.'],
    };
  }

  const positiveTradePnls = recentTradeLogs.map((trade) => trade.pnlAmountCents).filter((value) => value > 0);
  const biggestPositiveTrade = positiveTradePnls.length > 0 ? Math.max(...positiveTradePnls) : 0;
  const contributionPercent = biggestPositiveTrade > 0 ? (biggestPositiveTrade / totalProfitCents) * 100 : 0;

  if (contributionPercent > capValue) {
    return {
      relevant: true,
      state: 'blocked' as const,
      details: [`Largest positive contribution is ${contributionPercent.toFixed(1)}% against a ${capValue}% cap.`],
    };
  }
  if (contributionPercent > capValue * 0.85) {
    return {
      relevant: true,
      state: 'elevated' as const,
      details: [`Largest positive contribution is ${contributionPercent.toFixed(1)}%, near the ${capValue}% cap.`],
    };
  }
  return {
    relevant: true,
    state: 'within_limit' as const,
    details: [`Largest positive contribution is ${contributionPercent.toFixed(1)}%, within the ${capValue}% cap.`],
  };
}

export function evaluateAccount(input: EvaluationInput): EvaluationResult {
  const nowIso = input.nowIso ?? new Date().toISOString();
  const evaluationMode = input.evaluationMode ?? 'live';
  const account = input.account;
  const ruleProfile = input.ruleProfileVersion ? parseRuleProfile(input.ruleProfileVersion.firmRulesJson) : null;
  const dayStartBalanceCents = input.latestDayState?.dayStartBalanceCents ?? null;
  const totalProfitCents = account.currentBalanceCents - account.startingBalanceCents;
  const fullRiskAmountCents = Math.max(1, Math.round(account.startingBalanceCents * (STANDARD_RISK_UNIT_BPS / 10_000)));
  const refs = {
    startingBalanceCents: account.startingBalanceCents,
    currentBalanceCents: account.currentBalanceCents,
    peakBalanceCents: account.peakBalanceCents,
    dayStartBalanceCents,
  };

  const integrityIssues: string[] = [];
  if (!input.ruleProfileVersion) integrityIssues.push('missing_rule_profile_version');
  if (!ruleProfile) integrityIssues.push('unparseable_rule_profile_version');
  if (account.startingBalanceCents <= 0) integrityIssues.push('invalid_starting_balance');
  if (account.currentBalanceCents < 0) integrityIssues.push('invalid_current_balance');
  if (account.peakBalanceCents < 0) integrityIssues.push('invalid_peak_balance');
  if (ruleProfile?.drawdownRules.dailyDrawdown.enabled && dayStartBalanceCents === null) {
    integrityIssues.push('missing_day_start_balance');
  }

  const lifecycle = {
    stage: account.lifecycleStage,
    status: account.accountStatus,
    terminal: account.lifecycleStage === 'breached_failed' || account.accountStatus === 'breached',
    paused: account.lifecycleStage === 'paused_inactive' || account.accountStatus === 'paused' || account.manuallyPaused,
    archived: account.lifecycleStage === 'retired_archived' || account.accountStatus === 'archived' || !!account.archivedAt,
  };

  const hardLossAmountCents = ruleProfile ? resolveLossAmountCents(ruleProfile.drawdownRules.maxDrawdown, refs) : null;
  const hardReferenceValue = ruleProfile
    ? getReferenceValue(ruleProfile.drawdownRules.maxDrawdown.referenceBasis, refs)
    : null;
  const hardFloorCents = hardReferenceValue !== null && hardLossAmountCents !== null
    ? hardReferenceValue - hardLossAmountCents
    : null;

  const dailyFloorCents = ruleProfile && ruleProfile.drawdownRules.dailyDrawdown.enabled
    ? (() => {
        const lossAmount = resolveLossAmountCents(
          {
            mode: ruleProfile.drawdownRules.dailyDrawdown.mode,
            value: ruleProfile.drawdownRules.dailyDrawdown.value,
            referenceBasis: ruleProfile.drawdownRules.dailyDrawdown.referenceBasis,
          },
          refs,
        );
        const referenceValue = getReferenceValue(ruleProfile.drawdownRules.dailyDrawdown.referenceBasis, refs);
        if (lossAmount === null || referenceValue === null) return null;
        return referenceValue - lossAmount;
      })()
    : null;

  const hardBufferCents = hardFloorCents === null ? null : account.currentBalanceCents - hardFloorCents;
  const dailyBufferCents = dailyFloorCents === null ? null : account.currentBalanceCents - dailyFloorCents;

  const dominantFloorType = hardFloorCents === null && dailyFloorCents === null
    ? 'none'
    : dailyFloorCents !== null && hardFloorCents !== null
      ? dailyFloorCents >= hardFloorCents ? 'daily' : 'hard'
      : hardFloorCents !== null
        ? 'hard'
        : 'daily';

  const dominantFloorCents = dominantFloorType === 'hard'
    ? hardFloorCents
    : dominantFloorType === 'daily'
      ? dailyFloorCents
      : null;

  const dominantBufferCents = dominantFloorType === 'hard'
    ? hardBufferCents
    : dominantFloorType === 'daily'
      ? dailyBufferCents
      : null;

  const hardFractionalLives = hardBufferCents === null ? null : hardBufferCents / fullRiskAmountCents;
  const dailyFractionalLives = dailyBufferCents === null ? null : dailyBufferCents / fullRiskAmountCents;
  const limitingSource = dailyFractionalLives !== null && hardFractionalLives !== null
    ? dailyFractionalLives <= hardFractionalLives ? 'daily' : 'hard'
    : hardFractionalLives !== null
      ? 'hard'
      : dailyFractionalLives !== null
        ? 'daily'
        : 'none';
  const effectiveFractionalLivesRaw = limitingSource === 'daily'
    ? dailyFractionalLives ?? 0
    : limitingSource === 'hard'
      ? hardFractionalLives ?? 0
      : 0;
  const effectiveFractionalLives = roundLives(effectiveFractionalLivesRaw) ?? 0;
  const effectiveFullLives = Math.max(0, Math.floor(effectiveFractionalLivesRaw));

  const minimumTradingDaysRequired = ruleProfile?.tradingDayRules.minimumTradingDaysEnabled
    ? ruleProfile.tradingDayRules.minimumTradingDays
    : 0;
  const daysTradedReference = account.daysTradedReference ?? 0;
  const minimumTradingDaysMet = daysTradedReference >= minimumTradingDaysRequired;

  const targetEnabled = ruleProfile?.stageTargetRules.profitTarget.enabled ?? false;
  const targetCents = targetEnabled ? Math.round(ruleProfile!.stageTargetRules.profitTarget.value) : 0;
  const targetRemainingCents = targetEnabled ? Math.max(0, targetCents - totalProfitCents) : null;
  const targetProgressRatio = targetEnabled && targetCents > 0 ? Math.min(1, totalProfitCents / targetCents) : null;
  const targetMet = targetEnabled ? totalProfitCents >= targetCents : false;
  const stageCompletionEligible = account.lifecycleStage.startsWith('evaluation_')
    ? targetMet && minimumTradingDaysMet
    : false;

  const newsLock = getNewsLockState(nowIso, input.upcomingNews ?? []);
  const activeRotationLock = getRotationLock(nowIso, input.recentRotations ?? []);
  const pendingPayout = (input.recentPayouts ?? []).find((item) => ['planned', 'requested', 'processing'].includes(item.status));

  const consistency = evaluateConsistency(
    input.recentTradeLogs,
    totalProfitCents,
    ruleProfile?.consistencyRules.enabled ?? false,
    ruleProfile?.consistencyRules.capValue ?? null,
  );

  const payoutRelevant = !!ruleProfile?.payoutRules.payoutEligibilityEnabled && account.lifecycleStage.startsWith('funded_');
  const assignmentAnchor = input.openAssignment?.assignedAt ?? account.lastPayoutDate ?? nowIso;
  const waitEligibleAt = ruleProfile ? addDays(assignmentAnchor, ruleProfile.payoutRules.waitingPeriodDays) : nowIso;
  const cadenceAnchor = account.lastPayoutDate ? `${account.lastPayoutDate}T00:00:00Z` : assignmentAnchor;
  const cadenceEligibleAt = ruleProfile ? addDays(cadenceAnchor, ruleProfile.payoutRules.payoutCadenceDays) : nowIso;
  const nextEligibleAt = payoutRelevant ? (new Date(waitEligibleAt) > new Date(cadenceEligibleAt) ? waitEligibleAt : cadenceEligibleAt) : null;
  const waitingPeriodMet = payoutRelevant ? diffDays(nowIso, waitEligibleAt) >= 0 : false;
  const cadenceMet = payoutRelevant ? diffDays(nowIso, cadenceEligibleAt) >= 0 : false;
  const payoutBlockers: string[] = [];
  if (payoutRelevant) {
    if (!minimumTradingDaysMet) payoutBlockers.push('minimum_trading_days_not_met');
    if (consistency.state === 'blocked') payoutBlockers.push('consistency_cap_exceeded');
    if (pendingPayout && ['requested', 'processing'].includes(pendingPayout.status)) payoutBlockers.push('payout_already_pending');
    if (account.lifecycleStage !== 'funded_payout_active') payoutBlockers.push('lifecycle_not_payout_active');
  }

  let payoutState: EvaluationResult['payout']['state'] = 'not_applicable';
  if (payoutRelevant) {
    if (pendingPayout && ['planned', 'requested', 'processing'].includes(pendingPayout.status)) {
      payoutState = 'pending';
    } else if (waitingPeriodMet && cadenceMet && payoutBlockers.length === 0) {
      payoutState = 'ready';
    } else if (payoutBlockers.every((item) => item === 'lifecycle_not_payout_active')) {
      payoutState = 'approaching';
    } else if (payoutBlockers.length > 0) {
      payoutState = 'blocked';
    } else {
      payoutState = 'approaching';
    }
  }

  const restrictions = new Set<string>();
  if (integrityIssues.length > 0) restrictions.add('integrity_degraded');
  if (lifecycle.archived) restrictions.add('archived_or_retired');
  if (lifecycle.paused) restrictions.add('paused_or_cooldown');
  if (activeRotationLock) restrictions.add('rotation_lock_active');
  if (newsLock.active) restrictions.add('news_lock_active');
  if (hardBufferCents !== null && hardBufferCents < 0) restrictions.add('hard_floor_breached');
  if (hardBufferCents !== null && hardBufferCents === 0) restrictions.add('hard_floor_reached');
  if (dailyBufferCents !== null && dailyBufferCents <= 0) restrictions.add('daily_floor_reached');
  if (effectiveFractionalLives < MINIMUM_TRADABLE_LIVES) restrictions.add('insufficient_effective_lives');
  if (consistency.state === 'blocked') restrictions.add('consistency_cap_exceeded');
  if (newsLock.upcoming) restrictions.add('news_lock_upcoming');

  const hardStopReasons = [
    'hard_floor_breached',
    'hard_floor_reached',
    'daily_floor_reached',
    'archived_or_retired',
    'paused_or_cooldown',
    'rotation_lock_active',
    'news_lock_active',
    'insufficient_effective_lives',
  ];
  const hardStopReason = hardStopReasons.find((reason) => restrictions.has(reason)) ?? null;
  const hardStop = hardStopReason !== null;

  const modeReasons: string[] = [];
  let mode: EvaluationResult['mode']['value'] = 'attack';
  if (restrictions.has('hard_floor_breached') || lifecycle.terminal) {
    mode = 'breached';
    modeReasons.push('terminal failure condition is active.');
  } else if (hardStop) {
    mode = restrictions.has('paused_or_cooldown') || restrictions.has('rotation_lock_active')
      ? 'cooldown'
      : 'stopped';
    modeReasons.push(`Controlling restriction ${hardStopReason} blocks operation.`);
  } else if (ruleProfile?.payoutRules.payoutProtectionRelevant && (payoutState === 'ready' || account.lifecycleStage === 'funded_payout_active')) {
    mode = 'payout_protection';
    modeReasons.push('Payout-significant state now takes precedence over push behavior.');
  } else if (effectiveFractionalLives <= RECOVERY_LIVES_MAX) {
    mode = 'recovery';
    modeReasons.push('Effective lives are inside the recovery zone.');
  } else if (effectiveFractionalLives <= PRESERVATION_LIVES_MAX || consistency.state === 'elevated') {
    mode = 'preservation';
    modeReasons.push('Effective lives or policy pressure require protective handling.');
  } else {
    mode = 'attack';
    modeReasons.push('No controlling restriction dominates and risk space remains healthy.');
  }

  const mayTrade = !['breached', 'stopped', 'cooldown'].includes(mode);
  const mayTradeFullSize = mayTrade && effectiveFractionalLives >= FULL_SIZE_LIVES_MIN && mode === 'attack';
  const mayTradeFractionalOnly = mayTrade && !mayTradeFullSize;
  const allowedRiskAmountCents = mayTradeFullSize
    ? fullRiskAmountCents
    : mayTradeFractionalOnly
      ? Math.max(1, Math.min(Math.round(fullRiskAmountCents / 2), Math.max(0, dominantBufferCents ?? 0)))
      : 0;
  const mayRequestPayout = payoutRelevant && payoutState === 'ready' && payoutBlockers.length === 0;
  const mayResume = lifecycle.paused && !lifecycle.archived && !lifecycle.terminal;

  const alerts: EngineAlert[] = [];
  if (integrityIssues.length > 0) {
    alerts.push(buildAlert('integrity_degraded', 'critical', 'Evaluation integrity degraded', `Missing or invalid inputs: ${integrityIssues.join(', ')}.`));
  }
  if (restrictions.has('hard_floor_breached') || lifecycle.terminal) {
    alerts.push(buildAlert('hard_floor_breached', 'critical', 'Account breached', 'The account is below its hard operating floor or already marked breached.'));
  } else if (restrictions.has('hard_floor_reached')) {
    alerts.push(buildAlert('hard_floor_reached', 'critical', 'Hard floor reached', 'The account is exactly on its hard floor and must not be pushed further.'));
  }
  if (restrictions.has('daily_floor_reached')) {
    alerts.push(buildAlert('daily_floor_reached', 'critical', 'Daily restriction triggered', 'The current balance is at or below the active daily floor.'));
  }
  if (restrictions.has('insufficient_effective_lives') && !restrictions.has('hard_floor_reached')) {
    alerts.push(buildAlert('insufficient_effective_lives', 'high', 'Risk space is too narrow', 'Effective lives are below the minimum tradable threshold.'));
  } else if (effectiveFractionalLives <= 1) {
    alerts.push(buildAlert('low_effective_lives', 'high', 'Only fractional room remains', 'Effective lives are in the recovery zone.'));
  } else if (effectiveFractionalLives <= 2) {
    alerts.push(buildAlert('preservation_pressure', 'medium', 'Protection pressure active', 'Effective lives have narrowed and preservation behavior is advised.'));
  }
  if (newsLock.active && newsLock.item) {
    alerts.push(buildAlert('news_lock_active', 'high', 'High-impact news lock active', `${newsLock.item.title} lock window is active right now.`));
  } else if (newsLock.upcoming && newsLock.item) {
    alerts.push(buildAlert('news_lock_upcoming', 'high', 'High-impact news approaching', `${newsLock.item.title} will enter its lock window soon.`));
  }
  if (payoutState === 'ready') {
    alerts.push(buildAlert('payout_ready', 'high', 'Payout request allowed', 'The account is in a payout-ready state under current rules.'));
  } else if (payoutState === 'approaching') {
    alerts.push(buildAlert('payout_approaching', 'medium', 'Payout state approaching', 'The account is nearing payout significance but is not requestable yet.'));
  } else if (payoutState === 'pending') {
    alerts.push(buildAlert('payout_pending', 'medium', 'Payout workflow already active', 'An existing payout workflow is open for this account.'));
  }
  if (consistency.state === 'blocked') {
    alerts.push(buildAlert('consistency_cap_exceeded', 'high', 'Consistency blocker active', consistency.details[0] ?? 'Consistency policy blocks payout readiness.'));
  } else if (consistency.state === 'elevated') {
    alerts.push(buildAlert('consistency_elevated', 'medium', 'Consistency watch active', consistency.details[0] ?? 'Consistency policy is nearing its cap.'));
  }
  if (lifecycle.paused) {
    alerts.push(buildAlert('paused_or_cooldown', 'medium', 'Account is paused', 'Manual pause or inactive lifecycle state is active.'));
  }

  let nextAction: EvaluationResult['nextAction'];
  if (mode === 'breached') {
    nextAction = {
      code: 'inspect_timeline',
      priority: 'critical',
      summary: 'Inspect breach context and keep the account out of rotation.',
      reasonCodes: ['hard_floor_breached'],
    };
  } else if (hardStop) {
    nextAction = {
      code: 'do_not_trade',
      priority: hardStopReason === 'news_lock_active' ? 'high' : 'critical',
      summary: 'Do not trade until the controlling restriction is cleared.',
      reasonCodes: [hardStopReason ?? 'hard_stop'],
    };
  } else if (mayRequestPayout) {
    nextAction = {
      code: 'request_payout',
      priority: 'high',
      summary: 'Request payout instead of pushing the account further.',
      reasonCodes: ['payout_ready'],
    };
  } else if (mayTradeFullSize) {
    nextAction = {
      code: 'trade_full_size',
      priority: 'medium',
      summary: 'Normal deployment remains allowed under current constraints.',
      reasonCodes: ['attack'],
    };
  } else if (mayTradeFractionalOnly) {
    nextAction = {
      code: 'trade_fractional_only',
      priority: 'medium',
      summary: 'Trade only reduced size while protection constraints remain dominant.',
      reasonCodes: [mode],
    };
  } else {
    nextAction = {
      code: 'review_rule_profile',
      priority: 'high',
      summary: 'Review the account bundle and rule profile before acting.',
      reasonCodes: ['integrity_degraded'],
    };
  }

  const whyNotTradable = hardStop
    ? [`Trading is blocked by ${hardStopReason}.`]
    : [];
  const whyPayoutBlocked = payoutBlockers.map((blocker) => `Payout is blocked by ${blocker}.`);
  const whyThisState = [
    ...modeReasons,
    ...(ruleProfile ? [`Profile ${ruleProfile.metadata.displayName} governs this evaluation.`] : ['No valid profile was available.']),
    ...(dominantFloorType !== 'none' && dominantFloorCents !== null
      ? [`${dominantFloorType} floor is dominant at ${dominantFloorCents} cents.`]
      : []),
  ];

  return {
    identity: {
      accountId: account.id,
      accountLabel: account.accountLabel,
      evaluationTimestamp: nowIso,
      ruleProfileVersionId: input.ruleProfileVersion?.id ?? null,
      evaluationMode,
    },
    integrity: {
      valid: integrityIssues.length === 0,
      issues: integrityIssues,
    },
    lifecycle,
    references: {
      startingBalanceCents: account.startingBalanceCents,
      currentBalanceCents: account.currentBalanceCents,
      peakBalanceCents: account.peakBalanceCents,
      dayStartBalanceCents,
      totalProfitCents,
      fullRiskAmountCents,
    },
    thresholds: {
      hardFloorCents,
      dailyFloorCents,
      dominantFloorType,
      dominantFloorCents,
      hardBufferCents,
      dailyBufferCents,
      dominantBufferCents,
    },
    lives: {
      hardFullLives: hardFractionalLives === null ? null : Math.max(0, Math.floor(hardFractionalLives)),
      hardFractionalLives: roundLives(hardFractionalLives),
      dailyFullLives: dailyFractionalLives === null ? null : Math.max(0, Math.floor(dailyFractionalLives)),
      dailyFractionalLives: roundLives(dailyFractionalLives),
      effectiveFullLives,
      effectiveFractionalLives,
      limitingSource,
    },
    progression: {
      minimumTradingDaysRequired,
      minimumTradingDaysMet,
      daysTradedReference,
      targetEnabled,
      targetCents,
      targetRemainingCents,
      targetProgressRatio: targetProgressRatio === null ? null : Math.round(targetProgressRatio * 1000) / 1000,
      targetMet,
      stageCompletionEligible,
    },
    payout: {
      relevant: payoutRelevant,
      state: payoutState,
      waitingPeriodMet,
      cadenceMet,
      nextEligibleAt,
      blockers: payoutBlockers,
      pendingPayoutStatus: pendingPayout?.status ?? null,
      payoutProtectionRelevant: ruleProfile?.payoutRules.payoutProtectionRelevant ?? false,
    },
    consistency,
    restrictions: {
      active: [...restrictions],
      dominant: hardStopReason,
      hardStop,
      hardStopReason,
      newsLockActive: newsLock.active,
      newsLockUpcoming: newsLock.upcoming,
      rotationLockActive: !!activeRotationLock,
    },
    mode: {
      value: mode,
      reasons: modeReasons,
    },
    permissions: {
      mayTrade,
      mayTradeFullSize,
      mayTradeFractionalOnly,
      mustNotTrade: !mayTrade,
      allowedRiskAmountCents,
      mayRequestPayout,
      mayResume,
      mayOverride: false,
    },
    alerts,
    nextAction,
    explanations: {
      summary: nextAction.summary,
      whyThisState,
      whyNotTradable,
      whyPayoutBlocked,
      dominantRestriction: hardStopReason,
    },
  };
}
