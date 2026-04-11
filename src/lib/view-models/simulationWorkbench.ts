export interface SimulationAccountOptionVM {
  id: string;
  label: string;
  note?: string;
}

export type SimulationActionType =
  | "standard_win"
  | "standard_loss"
  | "custom_trade"
  | "payout_request"
  | "payout_received"
  | "pause_account"
  | "resume_account"
  | "daily_reset";

export interface SimulationActionVM {
  id: SimulationActionType;
  type: SimulationActionType;
  label: string;
  note?: string;
}

export interface SimulationDeltaVM {
  label: string;
  currentValue: string;
  simulatedValue: string;
  emphasis?: "neutral" | "caution" | "critical" | "positive";
}

export interface SimulationStepResultVM {
  stepLabel: string;
  summary: string;
}

export interface SimulationWorkbenchVM {
  title: string;
  mission: string;
  status: "ready" | "scaffold" | "degraded";
  statusMessage?: string;
  engineSourceLabel?: string;
  selectedAccountId?: string;
  selectedActionIds?: SimulationActionType[];
  accountOptions: SimulationAccountOptionVM[];
  availableActions: SimulationActionVM[];
  deltas: SimulationDeltaVM[];
  steps: SimulationStepResultVM[];
  explanation: string;
}