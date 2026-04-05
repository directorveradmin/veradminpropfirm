import type { AlertsReadModel } from "@/lib/services/read-models";

import {
  formatDateTime,
  mapDegradedState,
  mapSeverityTone,
  type BadgeViewModel,
  type DegradedStateViewModel,
} from "./common";

export interface AlertRowViewModel {
  id: string;
  title: string;
  category: string;
  severity: BadgeViewModel;
  accountLabel: string;
  createdAt: string;
  status: string;
  summary: string;
}

export interface AlertsScreenViewModel {
  summaryStrip: Array<{ label: string; value: string }>;
  critical: AlertRowViewModel[];
  high: AlertRowViewModel[];
  medium: AlertRowViewModel[];
  low: AlertRowViewModel[];
  resolved: AlertRowViewModel[];
  degradedState: DegradedStateViewModel | null;
}

export function mapAlertsViewModel(readModel: AlertsReadModel): AlertsScreenViewModel {
  const rows = readModel.stored.storedAlerts.map((alert) => ({
    id: alert.id,
    title: alert.title,
    category: alert.category,
    severity: {
      label: alert.severity,
      tone: mapSeverityTone(alert.severity),
    },
    accountLabel:
      alert.accountId && readModel.stored.accountsById[alert.accountId]
        ? readModel.stored.accountsById[alert.accountId].label
        : "Fleet",
    createdAt: formatDateTime(alert.createdAt),
    status: alert.status,
    summary: alert.message,
  }));

  return {
    summaryStrip: [
      { label: "Open critical", value: String(rows.filter((row) => row.severity.label === "critical").length) },
      { label: "Open high", value: String(rows.filter((row) => row.severity.label === "high").length) },
      { label: "Resolved", value: String(rows.filter((row) => row.severity.label === "resolved").length) },
    ],
    critical: rows.filter((row) => row.severity.label === "critical"),
    high: rows.filter((row) => row.severity.label === "high"),
    medium: rows.filter((row) => row.severity.label === "medium"),
    low: rows.filter((row) => row.severity.label === "low"),
    resolved: rows.filter((row) => row.severity.label === "resolved"),
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
