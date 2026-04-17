import type { OperationalTruthInput } from './inputTypes';
import type { OperationalTruth, RestrictionState, WarningState } from './types';

export function deriveRecommendations(args: {
  input: OperationalTruthInput;
  thresholds: OperationalTruth['thresholds'];
  lives: OperationalTruth['lives'];
  mode: OperationalTruth['mode'];
  permissions: OperationalTruth['permissions'];
  warnings: WarningState[];
  restrictions: RestrictionState[];
}): OperationalTruth['recommendations'] {
  const { input, permissions, warnings, restrictions } = args;

  if (restrictions.some((r) => r.blocksTrading)) {
    return {
      nextBestAction: 'resolve_blocker',
      priority: 'critical',
      shortSummary: 'Resolve the active trading blocker before taking new action.',
      reasonCodes: restrictions.flatMap((r) => r.reasonCodes),
    };
  }

  if (permissions.mayTradeFractionalOnly) {
    return {
      nextBestAction: 'trade_fractional_only',
      priority: 'high',
      shortSummary: 'Trade only at reduced size until buffer improves.',
      reasonCodes: ['buffer_low'],
    };
  }

  if (warnings.some((w) => w.code === 'payout_ready')) {
    return {
      nextBestAction: 'request_payout',
      priority: 'medium',
      shortSummary: 'Review payout eligibility and request payout if appropriate.',
      reasonCodes: ['payout_ready'],
    };
  }

  if (input.rotation?.state === 'rest') {
    return {
      nextBestAction: 'review_rotation',
      priority: 'medium',
      shortSummary: 'Respect the current rest window and review the rotation plan.',
      reasonCodes: ['rotation_rest'],
    };
  }

  if (input.news?.locked) {
    return {
      nextBestAction: 'review_news_lock',
      priority: 'medium',
      shortSummary: 'Wait for the news lock to clear before resuming trading.',
      reasonCodes: ['news_lock'],
    };
  }

  return {
    nextBestAction: 'continue_normal_operation',
    priority: 'low',
    shortSummary: 'Continue normal operation under the current risk posture.',
    reasonCodes: ['buffer_healthy', 'lives_healthy'],
  };
}