import type { OperationalTruth } from '../types';
import type { OperationalTruthInput } from '../inputTypes';

export function calculateThresholds(
  input: OperationalTruthInput,
): OperationalTruth['thresholds'] {
  const startingBalanceCents = input.account.startingBalanceCents;
  const currentBalanceCents = input.account.currentBalanceCents;
  const peakBalanceCents = Math.max(
    input.account.peakBalanceCents,
    currentBalanceCents,
  );

  const maxDrawdownCents = input.ruleProfile.maxDrawdownCents;
  const dailyDrawdownCents = input.ruleProfile.dailyDrawdownCents ?? null;

  const effectiveMaxFloorCents = input.ruleProfile.trailingMaxDrawdown
    ? peakBalanceCents - maxDrawdownCents
    : startingBalanceCents - maxDrawdownCents;

  const dayBase =
    input.accountDayState?.dayStartBalanceCents ?? currentBalanceCents;

  const effectiveDailyFloorCents =
    dailyDrawdownCents === null
      ? null
      : input.ruleProfile.trailingDailyDrawdown
      ? peakBalanceCents - dailyDrawdownCents
      : dayBase - dailyDrawdownCents;

  const maxBufferCents = currentBalanceCents - effectiveMaxFloorCents;
  const dailyBufferCents =
    effectiveDailyFloorCents === null
      ? null
      : currentBalanceCents - effectiveDailyFloorCents;

  const effectiveBufferCents =
    dailyBufferCents === null
      ? maxBufferCents
      : Math.min(maxBufferCents, dailyBufferCents);

  const fullRiskUnitCents =
    input.ruleProfile.risk?.fullRiskUnitCents ??
    input.account.lifeUnitCents ??
    100_000;

  const fractionalRiskUnitCents =
    input.ruleProfile.risk?.fractionalRiskUnitCents ??
    Math.max(1, Math.floor(fullRiskUnitCents / 2));

  const currentlyAllowedRiskUnitCents =
    effectiveBufferCents >= fullRiskUnitCents
      ? fullRiskUnitCents
      : Math.min(fractionalRiskUnitCents, Math.max(0, effectiveBufferCents));

  return {
    startingBalanceCents,
    currentBalanceCents,
    peakBalanceCents,
    effectiveMaxFloorCents,
    effectiveDailyFloorCents,
    maxBufferCents,
    dailyBufferCents,
    effectiveBufferCents,
    fullRiskUnitCents,
    currentlyAllowedRiskUnitCents,
  };
}