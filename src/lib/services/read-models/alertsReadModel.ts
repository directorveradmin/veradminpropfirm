import type {
  AccountOperationalTruthResult,
} from '../operationalTruth/evaluateAccountOperationalTruth';
import type {
  FleetOperationalTruthRecord,
  FleetOperationalTruthResult,
} from '../operationalTruth/evaluateFleetOperationalTruth';

export type AlertReadModelItem = {
  id: string;
  accountId: string;
  label: string;
  severity: string;
  title: string;
  message: string;
  source: 'warning' | 'mode';
  code: string;
  mode: string;
};

export type AlertsReadModel = {
  alerts: AlertReadModelItem[];
};

function mapSeverity(severity: string | null | undefined): string {
  switch (severity) {
    case 'lock':
      return 'critical';
    case 'danger':
      return 'high';
    case 'caution':
      return 'medium';
    case 'normal':
      return 'low';
    default:
      return 'medium';
  }
}

function toTitleFromCode(code: string): string {
  return code
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildWarningAlert(record: FleetOperationalTruthRecord, warning: {
  code: string;
  severity?: string | null;
  message?: string | null;
}): AlertReadModelItem {
  const title = toTitleFromCode(warning.code);

  return {
    id: `${record.account.id}:warning:${warning.code}`,
    accountId: record.account.id,
    label: record.account.label,
    severity: mapSeverity(warning.severity),
    title,
    message:
      warning.message && warning.message.trim().length > 0
        ? warning.message
        : title,
    source: 'warning',
    code: warning.code,
    mode: record.truth.mode.code,
  };
}

function buildModeAlert(record: FleetOperationalTruthRecord): AlertReadModelItem | null {
  if (record.truth.mode.code === 'stable') {
    return null;
  }

  return {
    id: `${record.account.id}:mode:${record.truth.mode.code}`,
    accountId: record.account.id,
    label: record.account.label,
    severity: mapSeverity(record.truth.mode.severity),
    title: record.truth.mode.label,
    message: `${record.account.label} is currently in ${record.truth.mode.label} mode.`,
    source: 'mode',
    code: record.truth.mode.code,
    mode: record.truth.mode.code,
  };
}

function sortAlerts(alerts: AlertReadModelItem[]): AlertReadModelItem[] {
  const rank: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...alerts].sort((a, b) => {
    const severityCompare = (rank[a.severity] ?? 99) - (rank[b.severity] ?? 99);
    if (severityCompare !== 0) {
      return severityCompare;
    }

    const labelCompare = a.label.localeCompare(b.label);
    if (labelCompare !== 0) {
      return labelCompare;
    }

    return a.title.localeCompare(b.title);
  });
}

export function buildAlertsReadModel(
  fleet: FleetOperationalTruthResult,
): AlertsReadModel {
  const alerts: AlertReadModelItem[] = [];

  for (const record of fleet.accounts) {
    const warningAlerts = record.truth.warnings.map((warning) =>
      buildWarningAlert(record, warning),
    );

    if (warningAlerts.length > 0) {
      alerts.push(...warningAlerts);
      continue;
    }

    const modeAlert = buildModeAlert(record);
    if (modeAlert) {
      alerts.push(modeAlert);
    }
  }

  return {
    alerts: sortAlerts(alerts),
  };
}

export function buildSingleAccountAlertsReadModel(
  result: AccountOperationalTruthResult,
): AlertsReadModel {
  const fleetLike: FleetOperationalTruthResult = {
    evaluatedAt: result.evaluatedAt,
    accounts: [
      {
        account: result.account,
        input: result.input,
        truth: result.truth,
      },
    ],
  };

  return buildAlertsReadModel(fleetLike);
}