import type { OperationalTruth } from '../types';

export function calculateLives(args: {
  thresholds: OperationalTruth['thresholds'];
  lifeUnitCents: number;
}): OperationalTruth['lives'] {
  const { thresholds, lifeUnitCents } = args;

  const safeUnit = Math.max(1, lifeUnitCents);

  const maxLimitedLives = Math.max(
    0,
    Math.floor(thresholds.maxBufferCents / safeUnit),
  );

  const dailyLimitedLives =
    thresholds.dailyBufferCents === null
      ? null
      : Math.max(0, Math.floor(thresholds.dailyBufferCents / safeUnit));

  const effectiveLives =
    dailyLimitedLives === null
      ? maxLimitedLives
      : Math.min(maxLimitedLives, dailyLimitedLives);

  const fractionalLives = Math.max(
    0,
    Number((thresholds.effectiveBufferCents / safeUnit).toFixed(2)),
  );

  return {
    maxLimitedLives,
    dailyLimitedLives,
    effectiveLives,
    fractionalLives,
    lifeUnitCents: safeUnit,
  };
}