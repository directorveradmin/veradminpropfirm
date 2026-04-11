import type {
  SimulationActionType,
  SimulationActionVM,
  SimulationWorkbenchVM,
  SimulationDeltaVM,
  SimulationStepResultVM,
  SimulationAccountOptionVM,
} from "@/lib/view-models/simulationWorkbench";

export interface SimulationRawState {
  mode?: string;
  tradable?: boolean;
  effectiveLives?: number | null;
  payoutReady?: boolean;
  restrictionLabel?: string;
}

export interface SimulationDataPayload {
  status: SimulationWorkbenchVM["status"];
  statusMessage?: string;
  engineSourceLabel?: string;
  selectedAccountId?: string;
  selectedActionIds?: SimulationActionType[];
  accountOptions: SimulationAccountOptionVM[];
  availableActions?: SimulationActionVM[];
  currentState?: SimulationRawState;
  simulatedState?: SimulationRawState;
  deltas: SimulationDeltaVM[];
  steps: SimulationStepResultVM[];
  explanation: string;
}

export const DEFAULT_SIMULATION_ACTIONS: SimulationActionVM[] = [
  { id: "standard_win", type: "standard_win", label: "Standard win" },
  { id: "standard_loss", type: "standard_loss", label: "Standard loss" },
  { id: "custom_trade", type: "custom_trade", label: "Custom trade result" },
  { id: "payout_request", type: "payout_request", label: "Payout request" },
  { id: "payout_received", type: "payout_received", label: "Payout received" },
  { id: "pause_account", type: "pause_account", label: "Pause account" },
  { id: "resume_account", type: "resume_account", label: "Resume account" },
  { id: "daily_reset", type: "daily_reset", label: "Daily reset" },
];

export function buildSimulationWorkbenchVMFromPayload(
  payload: SimulationDataPayload
): SimulationWorkbenchVM {
  return {
    title: "Sequence Simulation Workbench",
    mission:
      "Preview short-horizon deterministic consequences without mutating live state.",
    status: payload.status,
    statusMessage: payload.statusMessage,
    engineSourceLabel: payload.engineSourceLabel,
    selectedAccountId: payload.selectedAccountId,
    selectedActionIds: payload.selectedActionIds ?? [],
    accountOptions: payload.accountOptions,
    availableActions:
      payload.availableActions && payload.availableActions.length > 0
        ? payload.availableActions
        : DEFAULT_SIMULATION_ACTIONS,
    deltas:
      payload.deltas.length > 0
        ? payload.deltas
        : [
            {
              label: "Current vs simulated state",
              currentValue: "No deterministic simulation result available",
              simulatedValue: "No output",
              emphasis: "neutral",
            },
          ],
    steps:
      payload.steps.length > 0
        ? payload.steps
        : [
            {
              stepLabel: "Step 1",
              summary:
                "Select an account and one or more actions to request a deterministic simulation.",
            },
          ],
    explanation: payload.explanation,
  };
}