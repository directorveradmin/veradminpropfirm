import type { PayoutsReadModel } from "@/lib/services/read-models";

import {
  formatCurrencyCents,
  formatDateTime,
  mapDegradedState,
  type DegradedStateViewModel,
} from "./common";

export type PayoutRowState =
  | "ready"
  | "approaching"
  | "requested"
  | "pending"
  | "received"
  | "blocked"
  | "not_relevant";

export interface PayoutRowViewModel {
  id: string;
  accountLabel: string;
  state: PayoutRowState;
  amount: string;
  requestedAt: string;
  expectedAt: string;
  blockers: string[];
}

export interface RefundTaskViewModel {
  id: string;
  title: string;
  accountLabel: string;
  dueAt: string;
  status: string;
}

export interface PayoutsScreenViewModel {
  summaryStrip: Array<{ label: string; value: string }>;
  readyNow: PayoutRowViewModel[];
  approaching: PayoutRowViewModel[];
  pending: PayoutRowViewModel[];
  blocked: PayoutRowViewModel[];
  refundTasks: RefundTaskViewModel[];
  degradedState: DegradedStateViewModel | null;
}

function resolvePayoutRowState(readModel: PayoutsReadModel, payout: PayoutsReadModel["stored"]["payouts"][number]): PayoutRowState {
  const evaluation = readModel.evaluationsByAccountId[payout.accountId];
  const evaluationStatus = evaluation?.payoutState.status;

  if (evaluationStatus === "ready") return "ready";
  if (evaluationStatus === "approaching") return "approaching";
  if (evaluationStatus === "pending") return "pending";
  if (evaluationStatus === "received") return "received";
  if (evaluationStatus === "blocked") return "blocked";
  if (evaluationStatus === "not_relevant") return "not_relevant";

  return payout.status;
}

export function mapPayoutsViewModel(readModel: PayoutsReadModel): PayoutsScreenViewModel {
  const rows: PayoutRowViewModel[] = readModel.stored.payouts.map((payout) => {
    const account = readModel.stored.accountsById[payout.accountId];
    const evaluation = readModel.evaluationsByAccountId[payout.accountId];
    const state = resolvePayoutRowState(readModel, payout);

    return {
      id: payout.id,
      accountLabel: account?.label ?? payout.accountId,
      state,
      amount: formatCurrencyCents(payout.amountCents),
      requestedAt: formatDateTime(payout.requestedAt),
      expectedAt: formatDateTime(payout.expectedAt ?? evaluation?.payoutState.nextEligibleAt ?? null),
      blockers: evaluation?.payoutState.blockers ?? (payout.blockerSummary ? [payout.blockerSummary] : []),
    };
  });

  return {
    summaryStrip: [
      { label: "Payout rows", value: String(rows.length) },
      {
        label: "Refund/admin tasks",
        value: String(readModel.stored.refundTasks.filter((task) => task.status !== "resolved").length),
      },
    ],
    readyNow: rows.filter((row) => row.state === "ready"),
    approaching: rows.filter((row) => row.state === "approaching"),
    pending: rows.filter((row) => row.state === "pending" || row.state === "requested"),
    blocked: rows.filter((row) => row.state === "blocked"),
    refundTasks: readModel.stored.refundTasks.map((task) => ({
      id: task.id,
      title: task.title,
      accountLabel:
        task.accountId && readModel.stored.accountsById[task.accountId]
          ? readModel.stored.accountsById[task.accountId].label
          : "Fleet",
      dueAt: formatDateTime(task.dueAt),
      status: task.status,
    })),
    degradedState: mapDegradedState(readModel.degradedState),
  };
}
