import { getAccounts, getAlerts, getPayouts, getJournalEntries } from '@/lib/server/workspaceStore';

export function buildReportsVmFromWorkspace() {
  const accounts = getAccounts();
  const alerts = getAlerts();
  const payouts = getPayouts();
  const journal = getJournalEntries();

  return {
    title: "Reports",
    mission: "Local workspace reporting",
    status: "ready",
    timeRangeLabel: "Local",
    scopeLabel: "Fleet",

    snapshotCards: [
      { label: "Accounts", value: String(accounts.length) },
      { label: "Alerts", value: String(alerts.length) },
      { label: "Payouts", value: String(payouts.length) },
    ],

    tacticalReview: {
      title: "Tactical",
      subtitle: "Current state",
      rows: []
    },

    businessReview: {
      title: "Business",
      subtitle: "Payout posture",
      rows: []
    },

    accountReview: {
      title: "Accounts",
      subtitle: "Overview",
      rows: accounts.map(a => ({
        label: a.name,
        value: a.status
      }))
    },

    exportOptions: [],
    recentExports: []
  };
}