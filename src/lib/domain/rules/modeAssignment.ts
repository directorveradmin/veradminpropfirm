import type { OperationalTruthInput } from './inputTypes';
import type { OperationalTruth, RestrictionState } from './types';

export function assignMode(args: {
  input: OperationalTruthInput;
  thresholds: OperationalTruth['thresholds'];
  lives: OperationalTruth['lives'];
  restrictions: RestrictionState[];
}): OperationalTruth['mode'] {
  const { input, thresholds, lives, restrictions } = args;

  const restrictionCodes = restrictions.flatMap((r) => r.reasonCodes);

  if (input.account.accountStatus === 'breached') {
    return {
      code: 'breached',
      label: 'Breached',
      severity: 'lock',
      enteredBecause: ['account_breached', ...restrictionCodes],
    };
  }

  if (input.account.accountStatus === 'stopped') {
    return {
      code: 'stopped',
      label: 'Stopped',
      severity: 'lock',
      enteredBecause: ['account_stopped', ...restrictionCodes],
    };
  }

  if (input.account.manualPause || input.account.accountStatus === 'paused') {
    return {
      code: 'paused',
      label: 'Paused',
      severity: 'danger',
      enteredBecause: ['manual_pause', ...restrictionCodes],
    };
  }

  if (thresholds.effectiveBufferCents <= 0 || lives.effectiveLives <= 0) {
    return {
      code: 'stopped',
      label: 'Stopped',
      severity: 'lock',
      enteredBecause: ['max_drawdown_lock', 'lives_exhausted', ...restrictionCodes],
    };
  }

  if (
    restrictions.some((r) => r.blocksTrading) ||
    lives.fractionalLives < 2
  ) {
    return {
      code: 'restricted',
      label: 'Restricted',
      severity: 'danger',
      enteredBecause: ['restriction_active', ...restrictionCodes],
    };
  }

  if (lives.fractionalLives < 4) {
    return {
      code: 'caution',
      label: 'Caution',
      severity: 'caution',
      enteredBecause: ['buffer_low', 'lives_low', ...restrictionCodes],
    };
  }

  return {
    code: 'stable',
    label: 'Stable',
    severity: 'normal',
    enteredBecause: ['buffer_healthy', 'lives_healthy'],
  };
}