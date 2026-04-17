import type {
  FleetOperationalTruthRecord,
  FleetOperationalTruthResult,
} from '../operationalTruth/evaluateFleetOperationalTruth';

export type DashboardReadModel = {
  accountCount: number;
  totalLives: number;
  totalBuffer: number;
  tradableCount: number;
};

function roundToTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

function toBufferDollars(record: FleetOperationalTruthRecord): number {
  return record.truth.thresholds.effectiveBufferCents / 100;
}

function toFractionalLives(record: FleetOperationalTruthRecord): number {
  return record.truth.lives.fractionalLives;
}

function isTradableStable(record: FleetOperationalTruthRecord): boolean {
  return record.truth.mode.code === 'stable';
}

export function buildDashboardReadModel(
  fleet: FleetOperationalTruthResult,
): DashboardReadModel {
  const accountCount = fleet.accounts.length;

  const totalLives = roundToTwoDecimals(
    fleet.accounts.reduce((sum, record) => sum + toFractionalLives(record), 0),
  );

  const totalBuffer = roundToTwoDecimals(
    fleet.accounts.reduce((sum, record) => sum + toBufferDollars(record), 0),
  );

  const tradableCount = fleet.accounts.filter(isTradableStable).length;

  return {
    accountCount,
    totalLives,
    totalBuffer,
    tradableCount,
  };
}