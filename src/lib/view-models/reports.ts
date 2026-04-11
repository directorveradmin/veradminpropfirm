export type ReportTone = "neutral" | "positive" | "caution" | "critical";

export interface ReportMetricCardVM {
  label: string;
  value: string;
  tone?: ReportTone;
  helpText?: string;
}

export interface ReportRowVM {
  label: string;
  value: string;
  note?: string;
}

export interface ReportSectionVM {
  title: string;
  subtitle: string;
  rows: ReportRowVM[];
}

export interface ReportExportOptionVM {
  label: string;
  format: "csv" | "json";
  description: string;
}

export interface ReportsScreenVM {
  title: string;
  mission: string;
  status: "ready" | "scaffold" | "degraded";
  statusMessage?: string;
  timeRangeLabel: string;
  scopeLabel: string;
  dataSourceLabel?: string;
  lastUpdatedLabel?: string;
  snapshotCards: ReportMetricCardVM[];
  tacticalReview: ReportSectionVM;
  businessReview: ReportSectionVM;
  accountReview: ReportSectionVM;
  exportOptions: ReportExportOptionVM[];
  recentExports: ReportRowVM[];
}