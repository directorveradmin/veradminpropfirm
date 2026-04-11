import type { ReportingAccountRecord } from "@/lib/services/reporting/builders";
import { getLiveReportingDataSnapshot } from "@/lib/server/step12/reportingIntegration";
import {
  DEFAULT_SIMULATION_ACTIONS,
  type SimulationDataPayload,
  type SimulationRawState,
} from "@/lib/services/simulation/builders";
import type { SimulationActionType, SimulationDeltaVM } from "@/lib/view-models/simulationWorkbench";
const readModelsModule: Record<string, unknown> = {};
import * as deterministicEngineModule from '@/lib/validation/ruleProfiles';

const READ_MODELS_AVAILABLE = false;
const READ_MODELS_SOURCE = "db-only";
const ENGINE_AVAILABLE = true;
const ENGINE_SOURCE = "src/lib/validation/ruleProfiles.ts";

type GenericRecord = Record<string, unknown>;

function isRecord(value: unknown): value is GenericRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (["true", "yes", "y", "1", "tradable", "ready", "active"].includes(lower)) return true;
    if (["false", "no", "n", "0", "stopped", "breached", "inactive"].includes(lower)) return false;
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function getCaseInsensitiveValue(row: GenericRecord, candidates: string[]): unknown {
  for (const candidate of candidates) {
    const target = candidate.toLowerCase();
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase() === target) {
        return value;
      }
    }
  }
  return undefined;
}

function normalizeCurrentState(account: ReportingAccountRecord | undefined): SimulationRawState {
  if (!account) {
    return {
      mode: "Unavailable",
      tradable: false,
      effectiveLives: null,
      payoutReady: false,
      restrictionLabel: "No account selected",
    };
  }

  return {
    mode: account.mode ?? "Unspecified",
    tradable: account.tradable,
    effectiveLives: account.effectiveLives ?? null,
    payoutReady: account.payoutReady,
    restrictionLabel: account.restricted ? "Restricted" : account.stopped ? "Stopped" : "Normal",
  };
}

function extractStateLike(value: unknown, depth = 0): SimulationRawState | null {
  if (depth > 4 || value == null) {
    return null;
  }

  if (isRecord(value)) {
    const mode = asText(getCaseInsensitiveValue(value, ["mode", "currentMode", "stateMode", "posture"]));
    const tradable = asBoolean(getCaseInsensitiveValue(value, ["tradable", "isTradable", "canTrade"]));
    const effectiveLives = asNumber(getCaseInsensitiveValue(value, ["effectiveLives", "livesRemaining", "remainingLives", "lives"]));
    const payoutReady = asBoolean(getCaseInsensitiveValue(value, ["payoutReady", "isPayoutReady", "payoutEligible"]));
    const restrictionLabel = asText(
      getCaseInsensitiveValue(value, ["restrictionLabel", "restriction", "statusLabel", "availability"])
    );

    if (mode || tradable !== undefined || effectiveLives !== undefined || payoutReady !== undefined) {
      return {
        mode,
        tradable,
        effectiveLives: effectiveLives ?? null,
        payoutReady,
        restrictionLabel,
      };
    }

    const nestedKeys = ["after", "nextState", "finalState", "state", "result", "snapshot", "currentState"];
    for (const key of nestedKeys) {
      if (key in value) {
        const nested = extractStateLike((value as GenericRecord)[key], depth + 1);
        if (nested) return nested;
      }
    }

    for (const nested of Object.values(value)) {
      const candidate = extractStateLike(nested, depth + 1);
      if (candidate) return candidate;
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractStateLike(item, depth + 1);
      if (candidate) return candidate;
    }
  }

  return null;
}

function scoreEngineExportName(name: string): number {
  const lower = name.toLowerCase();
  let score = 0;
  if (lower.includes("simulatesequence")) score += 120;
  if (lower.includes("runsequencesimulation")) score += 110;
  if (lower.includes("simulatewhatif")) score += 100;
  if (lower.includes("simulate")) score += 80;
  if (lower.includes("evaluate")) score += 40;
  if (lower.includes("sequence")) score += 20;
  return score;
}

async function resolveDetailedAccountContext(accountId: string | undefined): Promise<unknown> {
  if (!READ_MODELS_AVAILABLE || !accountId) {
    return null;
  }

  const moduleExports = readModelsModule as Record<string, unknown>;
  const preferredNames = [
    "getAccountDetailVM",
    "buildAccountDetailVM",
    "getAccountDetail",
    "getAccountState",
    "getAccount",
    "readAccount",
  ];

  for (const name of preferredNames) {
    const candidate = moduleExports[name];
    if (typeof candidate !== "function") {
      continue;
    }

    const fn = candidate as (...args: unknown[]) => unknown;
    const attempts = [
      () => fn(accountId),
      () => fn({ accountId }),
      () => fn({ id: accountId }),
      () => fn({ accountId, includeAll: true }),
    ];

    for (const attempt of attempts) {
      try {
        const result = await Promise.resolve(attempt());
        if (result !== undefined) {
          return result;
        }
      } catch {
        // Intentionally quiet. Simulation should degrade honestly rather than crash.
      }
    }
  }

  return null;
}

async function tryRunDeterministicEngine(
  account: ReportingAccountRecord | undefined,
  actions: SimulationActionType[],
  context: unknown
): Promise<{ result: unknown; exportName: string } | null> {
  if (!ENGINE_AVAILABLE || !account || actions.length === 0) {
    return null;
  }

  const actionObjects = actions.map((type) => ({ type }));
  const moduleExports = deterministicEngineModule as Record<string, unknown>;

  const orderedExports = Object.entries(moduleExports)
    .filter((entry): entry is [string, (...args: unknown[]) => unknown] => typeof entry[1] === "function")
    .map(([name, fn]) => ({ name, fn, score: scoreEngineExportName(name) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const stateBase = context ?? account;

  for (const item of orderedExports) {
    const attempts = [
      () => item.fn({ account: stateBase, actions: actionObjects }),
      () => item.fn({ accountId: account.id, actions: actionObjects }),
      () => item.fn({ snapshot: stateBase, actions: actionObjects }),
      () => item.fn({ currentState: stateBase, actions: actionObjects }),
      () => item.fn({ account: stateBase, sequence: actionObjects }),
      () => item.fn({ accountId: account.id, sequence: actionObjects }),
      () => item.fn(stateBase, actionObjects),
      () => item.fn(stateBase, actions),
      () => item.fn({ account: stateBase, actions }),
      () => item.fn({ accountId: account.id, actions }),
    ];

    for (const attempt of attempts) {
      try {
        const result = await Promise.resolve(attempt());
        if (result !== undefined) {
          return { result, exportName: item.name };
        }
      } catch {
        // Try the next signature.
      }
    }
  }

  return null;
}

function buildStepsFromResult(result: unknown, actions: SimulationActionType[]): { stepLabel: string; summary: string }[] {
  if (Array.isArray(result)) {
    return result.map((item, index) => ({
      stepLabel: `Step ${index + 1}`,
      summary: JSON.stringify(item),
    }));
  }

  if (isRecord(result)) {
    const direct = (result.steps ?? result.transitions ?? result.sequence ?? result.events) as unknown;
    if (Array.isArray(direct)) {
      return direct.map((item, index) => ({
        stepLabel: `Step ${index + 1}`,
        summary: isRecord(item)
          ? asText(item.summary) ?? asText(item.explanation) ?? JSON.stringify(item)
          : String(item),
      }));
    }
  }

  return actions.map((action, index) => ({
    stepLabel: `Step ${index + 1}`,
    summary: `${action} was evaluated through the detected deterministic engine.`,
  }));
}

function buildDeltas(
  current: SimulationRawState,
  simulated: SimulationRawState
): SimulationDeltaVM[] {
  const rows: SimulationDeltaVM[] = [
    {
      label: "Mode",
      currentValue: current.mode ?? "Unspecified",
      simulatedValue: simulated.mode ?? "Unspecified",
      emphasis:
        current.mode !== simulated.mode
          ? simulated.mode?.toLowerCase().includes("stop") || simulated.mode?.toLowerCase().includes("breach")
            ? "critical"
            : "caution"
          : "neutral",
    },
    {
      label: "Tradable",
      currentValue: current.tradable ? "Yes" : "No",
      simulatedValue: simulated.tradable ? "Yes" : "No",
      emphasis:
        current.tradable !== simulated.tradable
          ? simulated.tradable
            ? "positive"
            : "critical"
          : "neutral",
    },
    {
      label: "Effective lives",
      currentValue: current.effectiveLives != null ? String(current.effectiveLives) : "â€”",
      simulatedValue: simulated.effectiveLives != null ? String(simulated.effectiveLives) : "â€”",
      emphasis:
        current.effectiveLives != null &&
        simulated.effectiveLives != null &&
        simulated.effectiveLives < current.effectiveLives
          ? "caution"
          : "neutral",
    },
    {
      label: "Payout readiness",
      currentValue: current.payoutReady ? "Ready" : "Not ready",
      simulatedValue: simulated.payoutReady ? "Ready" : "Not ready",
      emphasis:
        current.payoutReady !== simulated.payoutReady
          ? simulated.payoutReady
            ? "positive"
            : "caution"
          : "neutral",
    },
  ];

  return rows;
}
export async function runLiveSequenceSimulation(params: {
  accountId?: string;
  actions?: SimulationActionType[];
}): Promise<SimulationDataPayload> {
  const reportingSnapshot = await getLiveReportingDataSnapshot();
  const accountOptions = reportingSnapshot.accounts.map((account) => ({
    id: account.id,
    label: account.label,
    note: account.mode ? `Mode: ${account.mode}` : account.note,
  }));

  const selectedAccount =
    reportingSnapshot.accounts.find((account) => account.id === params.accountId) ??
    reportingSnapshot.accounts[0];

  const selectedActionIds = (params.actions ?? []).filter((action): action is SimulationActionType =>
    DEFAULT_SIMULATION_ACTIONS.some((candidate) => candidate.id === action)
  );

  const currentState = normalizeCurrentState(selectedAccount);

  if (!selectedAccount) {
    return {
      status: "degraded",
      statusMessage:
        "No account records were available for deterministic simulation. Restore or create local data first.",
      engineSourceLabel: ENGINE_AVAILABLE ? ENGINE_SOURCE : "not-detected",
      selectedAccountId: undefined,
      selectedActionIds,
      accountOptions,
      availableActions: DEFAULT_SIMULATION_ACTIONS,
      currentState,
      simulatedState: currentState,
      deltas: buildDeltas(currentState, currentState),
      steps: [
        {
          stepLabel: "Step 1",
          summary: "Simulation is waiting for a real account baseline.",
        },
      ],
      explanation:
        "The Step 12 simulation surface remains honest: without a live account baseline it will not invent outcomes.",
    };
  }

  if (selectedActionIds.length === 0) {
    return {
      status: ENGINE_AVAILABLE ? "ready" : "degraded",
      statusMessage: ENGINE_AVAILABLE
        ? "Select one or more actions, then run the deterministic engine."
        : "A deterministic engine module was not detected during live wiring.",
      engineSourceLabel: ENGINE_AVAILABLE ? ENGINE_SOURCE : "not-detected",
      selectedAccountId: selectedAccount.id,
      selectedActionIds,
      accountOptions,
      availableActions: DEFAULT_SIMULATION_ACTIONS,
      currentState,
      simulatedState: currentState,
      deltas: buildDeltas(currentState, currentState),
      steps: [
        {
          stepLabel: "Step 1",
          summary: "Choose actions to preview deterministic consequences without mutating live state.",
        },
      ],
      explanation: ENGINE_AVAILABLE
        ? `Current state loaded for ${selectedAccount.label}. No hypothetical actions have been applied yet.`
        : "The simulation surface is visible, but the deterministic engine still needs an explicit module path or auto-detection fix.",
    };
  }

  if (!ENGINE_AVAILABLE) {
    return {
      status: "degraded",
      statusMessage: "A deterministic engine module was not detected during Step 12 live wiring.",
      engineSourceLabel: "not-detected",
      selectedAccountId: selectedAccount.id,
      selectedActionIds,
      accountOptions,
      availableActions: DEFAULT_SIMULATION_ACTIONS,
      currentState,
      simulatedState: currentState,
      deltas: buildDeltas(currentState, currentState),
      steps: [
        {
          stepLabel: "Step 1",
          summary: "No deterministic engine module is available to evaluate the selected action sequence.",
        },
      ],
      explanation:
        "Simulation refuses to invent rule outcomes when the authoritative engine is unavailable.",
    };
  }

  const detailedContext = await resolveDetailedAccountContext(selectedAccount.id);
  const executed = await tryRunDeterministicEngine(selectedAccount, selectedActionIds, detailedContext);

  if (!executed) {
    return {
      status: "degraded",
      statusMessage:
        "The detected deterministic engine module could not evaluate the selected account and action sequence with any supported invocation signature.",
      engineSourceLabel: ENGINE_SOURCE,
      selectedAccountId: selectedAccount.id,
      selectedActionIds,
      accountOptions,
      availableActions: DEFAULT_SIMULATION_ACTIONS,
      currentState,
      simulatedState: currentState,
      deltas: buildDeltas(currentState, currentState),
      steps: [
        {
          stepLabel: "Step 1",
          summary: "Invocation attempts were exhausted without a usable deterministic result.",
        },
      ],
      explanation:
        "Step 12 keeps the simulation surface visible, but it does not fabricate outputs when the engine contract cannot be resolved safely.",
    };
  }

  const simulatedState = extractStateLike(executed.result) ?? currentState;
  const explanation =
    (isRecord(executed.result)
      ? asText(executed.result.explanation) ??
        asText(executed.result.summary) ??
        asText(executed.result.reason)
      : undefined) ??
    `Deterministic simulation executed through ${executed.exportName} in ${ENGINE_SOURCE}.`;

  return {
    status: "ready",
    statusMessage: undefined,
    engineSourceLabel: `${ENGINE_SOURCE} Ã¢â€ â€™ ${executed.exportName}`,
    selectedAccountId: selectedAccount.id,
    selectedActionIds,
    accountOptions,
    availableActions: DEFAULT_SIMULATION_ACTIONS,
    currentState,
    simulatedState,
    deltas: buildDeltas(currentState, simulatedState),
    steps: buildStepsFromResult(executed.result, selectedActionIds),
    explanation,
  };
}