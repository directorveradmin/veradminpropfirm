import type { OperationalTruthInput } from './inputTypes';
import type { OperationalTruth, RestrictionState } from './types';

export function deriveRestrictions(args: {
  input: OperationalTruthInput;
  thresholds: OperationalTruth['thresholds'];
  lives: OperationalTruth['lives'];
}): RestrictionState[] {
  const { input, thresholds, lives } = args;
  const restrictions: RestrictionState[] = [];

  if (input.account.manualPause) {
    restrictions.push({
      code: 'no_trading_manual_pause',
      label: 'Manual pause active',
      summary: 'Trading is manually paused for this account.',
      severity: 'high',
      blocksTrading: true,
      blocksPayout: false,
      reasonCodes: ['manual_pause'],
    });
  }

  if (input.account.accountStatus === 'stopped') {
    restrictions.push({
      code: 'no_trading_account_stopped',
      label: 'Account stopped',
      summary: 'Trading is blocked because the account is stopped.',
      severity: 'critical',
      blocksTrading: true,
      blocksPayout: true,
      reasonCodes: ['account_stopped'],
    });
  }

  if (input.account.accountStatus === 'breached') {
    restrictions.push({
      code: 'no_trading_account_breached',
      label: 'Account breached',
      summary: 'Trading is blocked because the account is breached.',
      severity: 'critical',
      blocksTrading: true,
      blocksPayout: true,
      reasonCodes: ['account_breached'],
    });
  }

  if (input.accountDayState?.locked) {
    restrictions.push({
      code: 'no_trading_daily_lock',
      label: 'Daily lock active',
      summary: 'Trading is blocked by the current daily lock.',
      severity: 'critical',
      blocksTrading: true,
      blocksPayout: false,
      reasonCodes: ['daily_loss_lock'],
    });
  }

  if (thresholds.effectiveBufferCents <= 0 || lives.effectiveLives <= 0) {
    restrictions.push({
      code: 'no_trading_max_drawdown',
      label: 'Buffer exhausted',
      summary: 'Trading is blocked because effective buffer is exhausted.',
      severity: 'critical',
      blocksTrading: true,
      blocksPayout: true,
      reasonCodes: ['max_drawdown_lock', 'lives_exhausted'],
    });
  }

  if (input.rotation?.state === 'rest') {
    restrictions.push({
      code: 'no_trading_rotation_rest',
      label: 'Rotation rest window',
      summary: 'Trading is blocked during the scheduled rest window.',
      severity: 'medium',
      blocksTrading: true,
      blocksPayout: false,
      reasonCodes: ['rotation_rest'],
    });
  }

  if (input.news?.locked) {
    restrictions.push({
      code: 'no_trading_news_lock',
      label: 'News lock active',
      summary: 'Trading is blocked due to a news lock.',
      severity: 'high',
      blocksTrading: true,
      blocksPayout: false,
      reasonCodes: ['news_lock'],
    });
  }

  if (
    thresholds.effectiveBufferCents > 0 &&
    thresholds.currentlyAllowedRiskUnitCents > 0 &&
    thresholds.currentlyAllowedRiskUnitCents < thresholds.fullRiskUnitCents
  ) {
    restrictions.push({
      code: 'fractional_only',
      label: 'Fractional risk only',
      summary: 'Only reduced-size trading is currently allowed.',
      severity: 'medium',
      blocksTrading: false,
      blocksPayout: false,
      reasonCodes: ['buffer_low'],
    });
  }

  if (input.payout?.blocked) {
    restrictions.push({
      code: 'payout_blocked',
      label: 'Payout blocked',
      summary: 'Payout actions are currently blocked.',
      severity: 'medium',
      blocksTrading: false,
      blocksPayout: true,
      reasonCodes: ['payout_blocked'],
    });
  }

  return restrictions;
}
