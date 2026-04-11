import type {
  ReportsScreenVM,
  ReportRowVM,
  ReportSectionVM,
} from "@/lib/view-models/reports";

export interface ReportingAccountRecord {
  id: string;
  label: string;
  mode?: string;
  tradable: boolean;
  restricted: boolean;
  stopped: boolean;
  payoutReady: boolean;
  effectiveLives?: number | null;
  note?: string;
}

export interface ReportingAlertRecord {
  severity: string;
  category?: string;
  resolved?: boolean;
}

export interface ReportingPayoutRecord {
  status?: string;
  amount?: number | null;
}

export interface ReportingJournalRecord {
  outcome?: string;
  session?: string;
  tag?: string;
}

export interface ReportingDataSnapshot {
  sourceLabel: string;
  dbPath?: string | null;
  timeRangeLabel: string;
  scopeLabel: string;
  lastUpdatedLabel?: string;
  accounts: ReportingAccountRecord[];
  alerts: ReportingAlertRecord[];
  payouts: ReportingPayoutRecord[];
  journal: ReportingJournalRecord[];
  issues: string[];
}

function countWhere<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.reduce((total, item) => total + (predicate(item) ? 1 : 0), 0);
}

function formatCount(value: number): string {
  return String(value);
}

function formatAverageLives(accounts: ReportingAccountRecord[]): string {
  const numeric = accounts
    .map((account) => account.effectiveLives)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (numeric.length === 0) {
    return "â€”";
  }

  const avg = numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
  return avg.toFixed(2);
}

function buildModeDistribution(accounts: ReportingAccountRecord[]): string {
  if (accounts.length === 0) {
    return "No account records detected.";
  }

  const buckets = new Map<string, number>();
  for (const account of accounts) {
    const mode = account.mode?.trim() || "Unspecified";
    buckets.set(mode, (buckets.get(mode) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([mode, count]) => `${mode}: ${count}`)
    .join(" | ");
}

function buildRecentExportRows(sourceLabel: string, issues: string[]): ReportRowVM[] {
  if (issues.length > 0) {
    return [
      {
        label: "Reporting data source warnings",
        value: issues.join(" | "),
        note: "Reporting remains grounded in the local dataset and governed export doctrine.",
      },
    ];
  }

  return [
    {
      label: "Report export posture",
      value: "Use the existing Step 10 export flow for governed output.",
      note: `Current reporting view is grounded in ${sourceLabel}.`,
    },
  ];
}

function sectionRow(label: string, value: string, note?: string): ReportRowVM {
  return { label, value, note };
}

function buildTacticalSection(snapshot: ReportingDataSnapshot): ReportSectionVM {
  const cautionModes = countWhere(snapshot.accounts, (account) => {
    const mode = (account.mode ?? "").toLowerCase();
    return mode.includes("preservation") || mode.includes("recovery") || mode.includes("cooldown");
  });

  const unresolvedHighAlerts = countWhere(snapshot.alerts, (alert) => {
    const severity = (alert.severity ?? "").toLowerCase();
    return severity === "high" || severity === "critical";
  });

  return {
    title: "Tactical review",
    subtitle: "Mode, restriction, and attention patterns for the current local dataset.",
    rows: [
      sectionRow("Mode distribution", buildModeDistribution(snapshot.accounts)),
      sectionRow("Restriction-sensitive accounts", formatCount(countWhere(snapshot.accounts, (account) => account.restricted && !account.stopped))),
      sectionRow("Preservation / recovery posture", formatCount(cautionModes)),
      sectionRow("Unresolved high or critical alerts", formatCount(unresolvedHighAlerts)),
    ],
  };
}

function buildBusinessSection(snapshot: ReportingDataSnapshot): ReportSectionVM {
  const requested = countWhere(snapshot.payouts, (payout) => (payout.status ?? "").toLowerCase().includes("request"));
  const received = countWhere(snapshot.payouts, (payout) => (payout.status ?? "").toLowerCase().includes("received"));
  const refundOpen = countWhere(snapshot.payouts, (payout) => {
    const status = (payout.status ?? "").toLowerCase();
    return status.includes("refund") && !status.includes("complete");
  });

  const totalReceived = snapshot.payouts
    .map((payout) => payout.amount)
    .filter((amount): amount is number => typeof amount === "number" && Number.isFinite(amount))
    .reduce((sum, amount) => sum + amount, 0);

  return {
    title: "Business review",
    subtitle: "Payout and operating-rhythm posture drawn from current local records.",
    rows: [
      sectionRow("Payouts requested", formatCount(requested)),
      sectionRow("Payouts received", formatCount(received)),
      sectionRow("Refund / admin tasks still open", formatCount(refundOpen)),
      sectionRow("Recognized payout amount in local records", totalReceived > 0 ? totalReceived.toFixed(2) : "0.00"),
    ],
  };
}

function buildAccountSection(snapshot: ReportingDataSnapshot): ReportSectionVM {
  if (snapshot.accounts.length === 0) {
    return {
      title: "Account trajectory review",
      subtitle: "Focused review of one account or segment once account records are available.",
      rows: [
        sectionRow(
          "Trajectory status",
          "No account rows detected in the current local dataset.",
          "Create or restore local data, then refresh this surface."
        ),
      ],
    };
  }

  const prioritized = [...snapshot.accounts].sort((a, b) => {
    const aRisk = (a.stopped ? 3 : 0) + (a.restricted ? 2 : 0) + (a.payoutReady ? 1 : 0);
    const bRisk = (b.stopped ? 3 : 0) + (b.restricted ? 2 : 0) + (b.payoutReady ? 1 : 0);
    return bRisk - aRisk;
  });

  return {
    title: "Account trajectory review",
    subtitle: "Top current accounts by protective or business significance.",
    rows: prioritized.slice(0, 5).map((account) =>
      sectionRow(
        account.label,
        `Mode: ${account.mode ?? "Unspecified"} | Tradable: ${account.tradable ? "Yes" : "No"} | Payout ready: ${account.payoutReady ? "Yes" : "No"}`,
        account.effectiveLives != null ? `Effective lives: ${account.effectiveLives}` : account.note
      )
    ),
  };
}

export function buildReportsScreenVMFromSnapshot(snapshot: ReportingDataSnapshot): ReportsScreenVM {
  const tradableCount = countWhere(snapshot.accounts, (account) => account.tradable && !account.stopped);
  const restrictedCount = countWhere(snapshot.accounts, (account) => account.restricted && !account.stopped);
  const stoppedCount = countWhere(snapshot.accounts, (account) => account.stopped);
  const payoutReadyCount = countWhere(snapshot.accounts, (account) => account.payoutReady);

  const status: ReportsScreenVM["status"] =
    snapshot.accounts.length > 0 ? "ready" : "degraded";

  const statusMessage =
    snapshot.issues.length > 0
      ? snapshot.issues.join(" | ")
      : snapshot.accounts.length > 0
      ? undefined
      : "No live account records were detected. Reporting remains honest and non-inferential until local data is available.";

  return {
    title: "Reports",
    mission:
      "Review fleet behavior and business posture without crowding tactical daily-use surfaces.",
    status,
    statusMessage,
    timeRangeLabel: snapshot.timeRangeLabel,
    scopeLabel: snapshot.scopeLabel,
    dataSourceLabel: snapshot.sourceLabel,
    lastUpdatedLabel: snapshot.lastUpdatedLabel,
    snapshotCards: [
      { label: "Tradable accounts", value: formatCount(tradableCount), tone: tradableCount > 0 ? "positive" : "neutral" },
      { label: "Restricted accounts", value: formatCount(restrictedCount), tone: restrictedCount > 0 ? "caution" : "neutral" },
      { label: "Stopped accounts", value: formatCount(stoppedCount), tone: stoppedCount > 0 ? "critical" : "neutral" },
      { label: "Payout-ready accounts", value: formatCount(payoutReadyCount), tone: payoutReadyCount > 0 ? "positive" : "neutral" },
      { label: "Average effective lives", value: formatAverageLives(snapshot.accounts), tone: "neutral" },
    ],
    tacticalReview: buildTacticalSection(snapshot),
    businessReview: buildBusinessSection(snapshot),
    accountReview: buildAccountSection(snapshot),
    exportOptions: [
      {
        label: "Export current report as CSV",
        format: "csv",
        description: "Use the governed export flow for spreadsheet-friendly report output.",
      },
      {
        label: "Export current report as JSON",
        format: "json",
        description: "Use the governed export flow for structured higher-fidelity report output.",
      },
    ],
    recentExports: buildRecentExportRows(snapshot.sourceLabel, snapshot.issues),
  };
}