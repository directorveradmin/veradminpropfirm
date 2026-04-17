import type { OperationalTruthInput } from './inputTypes';
import type { OperationalTruth, RestrictionState } from './types';

export function derivePermissions(args: {
  input: OperationalTruthInput;
  thresholds: OperationalTruth['thresholds'];
  lives: OperationalTruth['lives'];
  mode: OperationalTruth['mode'];
  restrictions: RestrictionState[];
}): OperationalTruth['permissions'] {
  const { input, thresholds, restrictions } = args;

  const blocksTrading = restrictions.some((r) => r.blocksTrading);
  const blocksPayout = restrictions.some((r) => r.blocksPayout);

  const mayTrade = !blocksTrading && thresholds.effectiveBufferCents > 0;
  const mayTradeFullSize =
    mayTrade &&
    thresholds.currentlyAllowedRiskUnitCents >= thresholds.fullRiskUnitCents;
  const mayTradeFractionalOnly =
    mayTrade &&
    thresholds.currentlyAllowedRiskUnitCents > 0 &&
    thresholds.currentlyAllowedRiskUnitCents < thresholds.fullRiskUnitCents;

  return {
    mayTrade,
    mayTradeFullSize,
    mayTradeFractionalOnly,
    mustNotTrade: !mayTrade,
    mayRequestPayout: !blocksPayout && !input.payout?.blocked,
    mayPause: input.account.accountStatus === 'active',
    mayResume:
      input.account.accountStatus === 'paused' || Boolean(input.account.manualPause),
    mayOverride: false,
  };
}