import type { SimulationActionType } from "@/lib/view-models/simulationWorkbench";
import { getAccountById, type AccountRecord } from "@/lib/server/workspaceStore";

export interface LocalSimulationState {
  mode: string;
  tradable: boolean;
  effectiveLives: number;
  payoutReady: boolean;
  restrictionLabel: string;
}

export interface LocalSimulationResult {
  currentState: LocalSimulationState;
  simulatedState: LocalSimulationState;
  steps: Array<{ stepLabel: string; summary: string }>;
  explanation: string;
}

function toState(account: AccountRecord): LocalSimulationState {
  return {
    mode: account.mode,
    tradable: account.status === "tradable",
    effectiveLives: account.lives,
    payoutReady: account.payoutReady,
    restrictionLabel:
      account.status === "tradable"
        ? "Normal"
        : account.status === "restricted"
        ? "Restricted"
        : "Stopped",
  };
}

function recalc(account: AccountRecord) {
  if (account.lives <= 0) {
    account.lives = 0;
    account.status = "stopped";
    account.mode = "cooldown";
    account.payoutReady = false;
    return;
  }

  if (account.lives <= 1) {
    account.status = "restricted";
    if (account.mode === "attack") {
      account.mode = "preservation";
    }
    return;
  }

  if (account.status !== "stopped") {
    account.status = "tradable";
    if (account.mode === "preservation" || account.mode === "cooldown") {
      account.mode = "attack";
    }
  }
}

export function runLocalDeterministicSimulation(
  accountId: string,
  actions: SimulationActionType[]
): LocalSimulationResult | null {
  const account = getAccountById(accountId);
  if (!account) {
    return null;
  }

  const current = structuredClone(account);
  const working = structuredClone(account);
  const steps: Array<{ stepLabel: string; summary: string }> = [];

  actions.forEach((action, index) => {
    switch (action) {
      case "standard_loss":
        working.lives -= 1;
        recalc(working);
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "A deterministic loss reduced survivability and recalculated account posture.",
        });
        break;
      case "standard_win":
        working.lives += 1;
        if (working.status !== "stopped") {
          working.status = "tradable";
          if (working.mode === "preservation" || working.mode === "cooldown") {
            working.mode = "attack";
          }
        }
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "A deterministic win improved room and restored a more aggressive posture when safe.",
        });
        break;
      case "custom_trade":
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Custom trade placeholder leaves the current simplified deterministic state unchanged.",
        });
        break;
      case "payout_request":
        working.payoutReady = false;
        if (working.status === "tradable") {
          working.status = "restricted";
          working.mode = "payout protection";
        }
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Payout request converted the account into a more protective business posture.",
        });
        break;
      case "payout_received":
        working.payoutReady = false;
        recalc(working);
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Payout receipt cleared payout readiness and preserved the recalculated tactical posture.",
        });
        break;
      case "pause_account":
        if (working.status !== "stopped") {
          working.status = "restricted";
          working.mode = "cooldown";
        }
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Pause moved the account into a cooldown posture without changing survivability.",
        });
        break;
      case "resume_account":
        recalc(working);
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Resume restored the account to whatever deterministic posture its current lives allow.",
        });
        break;
      case "daily_reset":
        if (working.status !== "stopped") {
          recalc(working);
        }
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "Daily reset reapplied posture rules using the current persisted account state.",
        });
        break;
      default:
        steps.push({
          stepLabel: `Step ${index + 1}`,
          summary: "No deterministic rule matched the selected action.",
        });
    }
  });

  return {
    currentState: toState(current),
    simulatedState: toState(working),
    steps,
    explanation:
      actions.length > 0
        ? "Simulation uses a local deterministic state adapter over workspace.json. It does not mutate the persisted account."
        : "Select one or more actions to preview deterministic consequences without mutating the persisted account.",
  };
}