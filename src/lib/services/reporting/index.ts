import type { ReportsScreenVM } from "@/lib/view-models/reports";

export function getReportsScreenVM(): ReportsScreenVM {
  return {
    title: "Reports",
    mission:
      "Review fleet behavior and business posture without crowding tactical daily-use surfaces.",
    status: "scaffold",
    statusMessage:
      "Step 12 reporting scaffold is installed. Connect deterministic report builders and read-model outputs to populate this surface with live review data.",
    timeRangeLabel: "Last 30 days",
    scopeLabel: "Fleet",
    snapshotCards: [
      { label: "Tradable accounts", value: "0", tone: "neutral" },
      { label: "Restricted accounts", value: "0", tone: "neutral" },
      { label: "Stopped accounts", value: "0", tone: "neutral" },
      { label: "Payout-ready accounts", value: "0", tone: "neutral" },
    ],
    tacticalReview: {
      title: "Tactical review",
      subtitle: "Mode, restriction, and attention patterns for the selected range.",
      rows: [
        {
          label: "Reporting builder status",
          value: "Scaffold installed",
          note: "Wire this section to real reporting data before treating it as operational truth.",
        },
      ],
    },
    businessReview: {
      title: "Business review",
      subtitle: "Payout, refund, and operating-rhythm review for the selected range.",
      rows: [
        {
          label: "Business review status",
          value: "Awaiting live data",
          note: "This section is intentionally honest rather than inventing placeholder business conclusions.",
        },
      ],
    },
    accountReview: {
      title: "Account trajectory review",
      subtitle: "Focused review of one account or one segment when selected.",
      rows: [
        {
          label: "Trajectory support",
          value: "Ready for wiring",
          note: "Connect account timeline, mode transitions, and alert history here.",
        },
      ],
    },
    exportOptions: [
      {
        label: "Export current report as CSV",
        format: "csv",
        description: "Spreadsheet-friendly review export.",
      },
      {
        label: "Export current report as JSON",
        format: "json",
        description: "Structured higher-fidelity review export.",
      },
    ],
    recentExports: [
      {
        label: "Recent report exports",
        value: "No report exports recorded yet.",
        note: "Export history can be populated once the reporting layer is connected.",
      },
    ],
  };
}