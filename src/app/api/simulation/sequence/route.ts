import { NextResponse } from "next/server";
import { buildSimulationWorkbenchVMFromPayload, DEFAULT_SIMULATION_ACTIONS } from "@/lib/services/simulation";
import type { SimulationActionType } from "@/lib/view-models/simulationWorkbench";
import { getAccounts } from "@/lib/server/workspaceStore";
import { runLocalDeterministicSimulation } from "@/lib/server/workspaceSimulation";

export const runtime = "nodejs";

function accountOptions() {
  return getAccounts().map((account) => ({
    id: account.id,
    label: account.name,
    note: `Mode: ${account.mode}`,
  }));
}

function emptyPayload(accountId?: string) {
  return {
    status: "ready" as const,
    engineSourceLabel: "Local deterministic workspace engine",
    selectedAccountId: accountId ?? getAccounts()[0]?.id,
    selectedActionIds: [],
    accountOptions: accountOptions(),
    availableActions: DEFAULT_SIMULATION_ACTIONS,
    deltas: [],
    steps: [],
    explanation: "Select an account and action sequence to run a deterministic local simulation.",
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId") ?? undefined;
  return NextResponse.json(buildSimulationWorkbenchVMFromPayload(emptyPayload(accountId)));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const accountId = typeof body.accountId === "string" ? body.accountId : "";
  const rawActions = Array.isArray(body.actions) ? body.actions : [];
  const actions = rawActions.filter(
    (value): value is SimulationActionType =>
      typeof value === "string" &&
      [
        "standard_win",
        "standard_loss",
        "custom_trade",
        "payout_request",
        "payout_received",
        "pause_account",
        "resume_account",
        "daily_reset",
      ].includes(value)
  );

  const result = runLocalDeterministicSimulation(accountId, actions);

  if (!result) {
    return NextResponse.json(
      buildSimulationWorkbenchVMFromPayload({
        ...emptyPayload(accountId),
        status: "degraded",
        statusMessage: "The selected account could not be found in workspace.json.",
        explanation: "Simulation remains deterministic and refuses to invent results for unknown accounts.",
      })
    );
  }

  return NextResponse.json(
    buildSimulationWorkbenchVMFromPayload({
      status: "ready",
      engineSourceLabel: "Local deterministic workspace engine",
      selectedAccountId: accountId,
      selectedActionIds: actions,
      accountOptions: accountOptions(),
      availableActions: DEFAULT_SIMULATION_ACTIONS,
      deltas: [
        {
          label: "Mode",
          currentValue: result.currentState.mode,
          simulatedValue: result.simulatedState.mode,
          emphasis: result.currentState.mode === result.simulatedState.mode ? "neutral" : "caution",
        },
        {
          label: "Tradable",
          currentValue: result.currentState.tradable ? "Yes" : "No",
          simulatedValue: result.simulatedState.tradable ? "Yes" : "No",
          emphasis: result.currentState.tradable === result.simulatedState.tradable
            ? "neutral"
            : result.simulatedState.tradable
            ? "positive"
            : "critical",
        },
        {
          label: "Effective lives",
          currentValue: String(result.currentState.effectiveLives),
          simulatedValue: String(result.simulatedState.effectiveLives),
          emphasis:
            result.simulatedState.effectiveLives < result.currentState.effectiveLives
              ? "caution"
              : "neutral",
        },
        {
          label: "Payout readiness",
          currentValue: result.currentState.payoutReady ? "Ready" : "Not ready",
          simulatedValue: result.simulatedState.payoutReady ? "Ready" : "Not ready",
          emphasis:
            result.currentState.payoutReady === result.simulatedState.payoutReady
              ? "neutral"
              : result.simulatedState.payoutReady
              ? "positive"
              : "caution",
        },
      ],
      steps: result.steps,
      explanation: result.explanation,
    })
  );
}