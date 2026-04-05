import type { AccountDetailReadModel } from "@/lib/services/read-models";

import {
  formatCurrencyCents,
  formatDateTime,
  formatLives,
  mapDegradedState,
  mapModeTone,
  type BadgeViewModel,
  type DegradedStateViewModel,
  type LabelValueItemViewModel,
  type QuickActionViewModel,
} from "./common";

export interface AccountHeaderViewModel {
  label: string;
  firmLabel: string;
  lifecycleStage: string;
  mode: BadgeViewModel;
  tradable: BadgeViewModel;
  profileLabel: string;
}

export interface CurrentStatePanelViewModel {
  items: LabelValueItemViewModel[];
  nextAction: string;
}

export interface PermissionsPanelViewModel {
  mayTrade: boolean;
  mayTradeFullSize: boolean;
  mayTradeFractionalOnly: boolean;
  mustNotTrade: boolean;
  dominantRestrictionCode: string | null;
}

export interface WhyThisStateViewModel {
  reasons: Array<{
    code: string;
    title: string;
    summary: string;
  }>;
}

export interface TimelinePreviewViewModel {
  entries: Array<{
    id: string;
    summary: string;
    createdAt: string;
    eventType: string;
  }>;
}

export interface PayoutContextViewModel {
  status: string;
  blockers: string[];
  nextEligibleAt: string;
}

export interface MetadataSectionViewModel {
  items: LabelValueItemViewModel[];
}

export interface AccountDetailViewModel {
  header: AccountHeaderViewModel;
  currentState: CurrentStatePanelViewModel;
  permissions: PermissionsPanelViewModel;
  whyThisState: WhyThisStateViewModel;
  actions: QuickActionViewModel[];
  timelinePreview: TimelinePreviewViewModel;
  payoutContext: PayoutContextViewModel;
  metadata: MetadataSectionViewModel;
  degradedState: DegradedStateViewModel | null;
}

export function mapAccountDetailViewModel(
  readModel: AccountDetailReadModel,
): AccountDetailViewModel {
  const { account } = readModel.stored;
  const evaluation = readModel.evaluation;

  return {
    header: {
      label: account.label,
      firmLabel: account.firmLabel,
      lifecycleStage: evaluation.lifecycleStage,
      mode: {
        label: evaluation.mode,
        tone: mapModeTone(evaluation.mode),
      },
      tradable: {
        label: evaluation.tradable ? "Tradable" : "Restricted",
        tone: evaluation.tradable ? "good" : "danger",
      },
      profileLabel:
        `${account.ruleProfileLabel ?? "No profile"} / ${account.ruleProfileVersionLabel ?? "No version"}`,
    },
    currentState: {
      items: [
        { label: "Starting balance", value: formatCurrencyCents(account.startingBalanceCents) },
        { label: "Current balance", value: formatCurrencyCents(account.currentBalanceCents) },
        { label: "Peak balance", value: formatCurrencyCents(account.peakBalanceCents) },
        { label: "Hard floor", value: formatCurrencyCents(evaluation.hardFloorCents) },
        { label: "Daily floor", value: formatCurrencyCents(evaluation.dailyFloorCents) },
        { label: "Lives", value: formatLives(evaluation.fullLivesRemaining) },
        { label: "Fractional lives", value: formatLives(evaluation.fractionalLivesRemaining) },
      ],
      nextAction: evaluation.nextRecommendedAction.label ?? "Review account",
    },
    permissions: {
      mayTrade: evaluation.mayTrade,
      mayTradeFullSize: evaluation.mayTradeFullSize,
      mayTradeFractionalOnly: evaluation.mayTradeFractionalOnly,
      mustNotTrade: evaluation.mustNotTrade,
      dominantRestrictionCode: evaluation.dominantRestrictionCode,
    },
    whyThisState: {
      reasons: evaluation.reasons,
    },
    actions: [
      { id: "log-win", label: "Log Win", enabled: evaluation.mayTrade },
      { id: "log-loss", label: "Log Loss", enabled: evaluation.mayTrade },
      { id: "log-custom", label: "Log Custom", enabled: evaluation.mayTrade },
      { id: "add-note", label: "Add Note", enabled: true },
      {
        id: "request-payout",
        label: "Request Payout",
        enabled: evaluation.payoutState.status === "ready",
        reasonDisabled:
          evaluation.payoutState.status === "ready"
            ? undefined
            : "Payout is not ready yet.",
      },
      { id: "open-simulation", label: "Open Simulation", enabled: true },
    ],
    timelinePreview: {
      entries: readModel.stored.timeline.slice(0, 8).map((entry) => ({
        id: entry.id,
        summary: entry.summary,
        createdAt: formatDateTime(entry.createdAt),
        eventType: entry.eventType,
      })),
    },
    payoutContext: {
      status: evaluation.payoutState.status,
      blockers: evaluation.payoutState.blockers,
      nextEligibleAt: formatDateTime(evaluation.payoutState.nextEligibleAt),
    },
    metadata: {
      items: [
        { label: "Last updated", value: formatDateTime(account.updatedAt) },
        { label: "Stored alert count", value: String(readModel.stored.alerts.length) },
        { label: "Stored payout records", value: String(readModel.stored.payouts.length) },
      ],
    },
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
