import type { OperationalTruthInput } from './inputTypes';
import type { OperationalTruth, RestrictionState, WarningState } from './types';

export function deriveWarnings(args: {
  input: OperationalTruthInput;
  thresholds: OperationalTruth['thresholds'];
  lives: OperationalTruth['lives'];
  mode: OperationalTruth['mode'];
  permissions: OperationalTruth['permissions'];
  restrictions: RestrictionState[];
}): WarningState[] {
  const { input, thresholds, lives } = args;
  const warnings: WarningState[] = [];

  if (lives.fractionalLives > 0 && lives.fractionalLives < 4) {
    warnings.push({
      code: 'low_effective_lives',
      label: 'Low effective lives',
      summary: 'Effective lives are running low.',
      severity: lives.fractionalLives < 2 ? 'high' : 'medium',
      reasonCodes: ['lives_low'],
    });
  }

  if (
    thresholds.effectiveBufferCents > 0 &&
    thresholds.effectiveBufferCents < thresholds.fullRiskUnitCents
  ) {
    warnings.push({
      code: 'low_effective_buffer',
      label: 'Low effective buffer',
      summary: 'Effective buffer is below a full risk unit.',
      severity: 'high',
      reasonCodes: ['buffer_low'],
    });
  }

  if (
    thresholds.effectiveDailyFloorCents !== null &&
    thresholds.dailyBufferCents !== null &&
    thresholds.dailyBufferCents < thresholds.fullRiskUnitCents
  ) {
    warnings.push({
      code: 'daily_floor_near',
      label: 'Daily floor near',
      summary: 'Daily floor is close to the current balance.',
      severity: 'medium',
      reasonCodes: ['daily_floor_active'],
    });
  }

  if (input.ruleProfile?.consistency?.enabled && !input.ruleProfile?.consistency?.violated) {
    const pressure = input.ruleProfile?.consistency?.currentPressure ?? 0;
    if (pressure > 0.75) {
      warnings.push({
        code: 'consistency_pressure',
        label: 'Consistency pressure',
        summary: 'Consistency pressure is elevated.',
        severity: pressure > 0.9 ? 'high' : 'medium',
        reasonCodes: ['consistency_watch'],
      });
    }
  }

  if (!input.payout?.blocked && (input.payout?.amountPotentiallyRequestableCents ?? 0) > 0) {
    warnings.push({
      code: 'payout_ready',
      label: 'Payout potentially ready',
      summary: 'The account may be ready for a payout review.',
      severity: 'low',
      reasonCodes: ['payout_ready'],
    });
  }

  if (input.account?.manualPause) {
    warnings.push({
      code: 'manual_pause_active',
      label: 'Manual pause active',
      summary: 'Manual pause is currently active.',
      severity: 'medium',
      reasonCodes: ['manual_pause'],
    });
  }

  if (input.rotation?.state === 'rest') {
    warnings.push({
      code: 'rotation_rest_active',
      label: 'Rotation rest active',
      summary: 'This account is currently in a rest window.',
      severity: 'medium',
      reasonCodes: ['rotation_rest'],
    });
  }

  if (input.news?.locked) {
    warnings.push({
      code: 'news_lock_active',
      label: 'News lock active',
      summary: 'A news lock is active for this account.',
      severity: 'medium',
      reasonCodes: ['news_lock'],
    });
  }

  return warnings;
}
