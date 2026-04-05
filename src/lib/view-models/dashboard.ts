import type { DashboardReadModel } from "@/lib/services/read-models";

import {
  formatCurrencyCents,
  formatLives,
  mapDegradedState,
  mapModeTone,
  mapSeverityTone,
  type BadgeViewModel,
  type DegradedStateViewModel,
  type QuickActionViewModel,
} from "./common";

export interface MissionItemViewModel {
  id: string;
  title: string;
  summary: string;
  tone: BadgeViewModel["tone"];
}

export interface FleetHealthMetricViewModel {
  label: string;
  value: string;
  tone: BadgeViewModel["tone"];
}

export interface AccountCardViewModel {
  accountId: string;
  label: string;
  firmLabel: string;
  stage: string;
  mode: BadgeViewModel;
  tradable: BadgeViewModel;
  lives: string;
  currentBalance: string;
  nextAction: string;
  quickActions: QuickActionViewModel[];
}

export interface SecondarySummaryViewModel {
  id: string;
  title: string;
  value: string;
}

export interface CommandCenterViewModel {
  mission: MissionItemViewModel[];
  fleetHealth: FleetHealthMetricViewModel[];
  criticalAlerts: MissionItemViewModel[];
  accountCards: AccountCardViewModel[];
  secondarySummaries: SecondarySummaryViewModel[];
  degradedState: DegradedStateViewModel | null;
}

export function mapDashboardViewModel(readModel: DashboardReadModel): CommandCenterViewModel {
  const evaluations = Object.values(readModel.evaluationsByAccountId);

  const mission: MissionItemViewModel[] = [
    ...readModel.stored.storedAlerts
      .filter((alert) => alert.status !== "resolved" && alert.severity !== "resolved")
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .slice(0, 3)
      .map((alert) => ({
        id: `alert:${alert.id}`,
        title: alert.title,
        summary: alert.message,
        tone: mapSeverityTone(alert.severity),
      })),
    ...evaluations
      .filter((evaluation) => evaluation.payoutState.status === "ready")
      .slice(0, 2)
      .map((evaluation) => ({
        id: `payout:${evaluation.accountId}`,
        title: "Payout-ready account",
        summary: evaluation.nextRecommendedAction.summary ?? "Review payout action now.",
        tone: "warning" as const,
      })),
  ].slice(0, 6);

  const tradableCount = evaluations.filter((evaluation) => evaluation.tradable).length;
  const stoppedCount = evaluations.filter(
    (evaluation) => evaluation.mode.toLowerCase() === "stopped" || evaluation.mode.toLowerCase() === "breached",
  ).length;
  const payoutReadyCount = evaluations.filter(
    (evaluation) => evaluation.payoutState.status === "ready",
  ).length;
  const lowLivesCount = evaluations.filter(
    (evaluation) => (evaluation.fullLivesRemaining ?? 999) <= 1,
  ).length;

  const accountCards: AccountCardViewModel[] = readModel.stored.accounts.map((account) => {
    const evaluation = readModel.evaluationsByAccountId[account.id];

    return {
      accountId: account.id,
      label: account.label,
      firmLabel: account.firmLabel,
      stage: evaluation?.lifecycleStage ?? account.lifecycleStage,
      mode: {
        label: evaluation?.mode ?? "Unknown",
        tone: mapModeTone(evaluation?.mode ?? "unknown"),
      },
      tradable: {
        label: evaluation?.tradable ? "Tradable" : "Restricted",
        tone: evaluation?.tradable ? "good" : "danger",
      },
      lives: formatLives(evaluation?.fullLivesRemaining ?? null),
      currentBalance: formatCurrencyCents(account.currentBalanceCents),
      nextAction: evaluation?.nextRecommendedAction.label ?? "Review account",
      quickActions: [
        {
          id: `open:${account.id}`,
          label: "Open account",
          enabled: true,
        },
        {
          id: `simulate:${account.id}`,
          label: "Open simulation",
          enabled: true,
        },
      ],
    };
  });

  return {
    mission,
    criticalAlerts: mission.filter((item) => item.tone === "danger" || item.tone === "warning"),
    fleetHealth: [
      { label: "Accounts", value: String(readModel.stored.accounts.length), tone: "neutral" },
      { label: "Tradable", value: String(tradableCount), tone: tradableCount > 0 ? "good" : "warning" },
      { label: "Stopped", value: String(stoppedCount), tone: stoppedCount > 0 ? "danger" : "muted" },
      { label: "Payout-ready", value: String(payoutReadyCount), tone: payoutReadyCount > 0 ? "warning" : "muted" },
      { label: "Low lives", value: String(lowLivesCount), tone: lowLivesCount > 0 ? "danger" : "muted" },
    ],
    accountCards,
    secondarySummaries: [
      {
        id: "refund-tasks",
        title: "Open refund/admin tasks",
        value: String(readModel.stored.refundTasks.filter((task) => task.status !== "resolved").length),
      },
      {
        id: "rotation-markers",
        title: "Current rotation markers",
        value: String(readModel.stored.rotations.length),
      },
    ],
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
