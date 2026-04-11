"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  SimulationActionType,
  SimulationWorkbenchVM,
} from "@/lib/view-models/simulationWorkbench";

const EMPTY_VM: SimulationWorkbenchVM = {
  title: "Sequence Simulation Workbench",
  mission: "Preview short-horizon deterministic consequences without mutating live state.",
  status: "degraded",
  statusMessage: "Loading deterministic simulation context...",
  selectedAccountId: undefined,
  selectedActionIds: [],
  accountOptions: [],
  availableActions: [],
  deltas: [],
  steps: [],
  explanation: "Waiting for live simulation data.",
};

export default function SequenceSimulationWorkbench() {
  const searchParams = useSearchParams();
  const queryAccountId = searchParams.get("accountId") ?? "";
  const queryAction = searchParams.get("action") as SimulationActionType | null;

  const [vm, setVm] = useState<SimulationWorkbenchVM>(EMPTY_VM);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedActionIds, setSelectedActionIds] = useState<SimulationActionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [running, setRunning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const url = queryAccountId
        ? `/api/simulation/sequence?accountId=${encodeURIComponent(queryAccountId)}`
        : "/api/simulation/sequence";

      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Simulation request failed with status ${response.status}`);
      }

      const nextVm = (await response.json()) as SimulationWorkbenchVM;
      setVm(nextVm);
      setSelectedAccountId(queryAccountId || nextVm.selectedAccountId || nextVm.accountOptions[0]?.id || "");
      setSelectedActionIds(queryAction ? [queryAction] : nextVm.selectedActionIds ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load simulation context.");
    } finally {
      setLoading(false);
    }
  }, [queryAccountId, queryAction]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const toggleAction = useCallback((actionType: SimulationActionType) => {
    setSelectedActionIds((current) =>
      current.includes(actionType)
        ? current.filter((item) => item !== actionType)
        : [...current, actionType]
    );
  }, []);

  const runSimulation = useCallback(async () => {
    setRunning(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/simulation/sequence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccountId,
          actions: selectedActionIds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Simulation execution failed with status ${response.status}`);
      }

      const nextVm = (await response.json()) as SimulationWorkbenchVM;
      setVm(nextVm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to run deterministic simulation.");
    } finally {
      setRunning(false);
    }
  }, [selectedAccountId, selectedActionIds]);

  const clearActions = useCallback(() => {
    setSelectedActionIds([]);
  }, []);

  const activeVm = useMemo(() => vm ?? EMPTY_VM, [vm]);

  return (
    <section style={{ display: "grid", gap: 16, border: "1px solid #d0d7de", borderRadius: 12, padding: 16 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0 }}>{activeVm.title}</h2>
          {activeVm.engineSourceLabel ? (
            <span style={{ fontSize: 12, padding: "4px 8px", border: "1px solid #d0d7de", borderRadius: 999 }}>
              {activeVm.engineSourceLabel}
            </span>
          ) : null}
          <button type="button" onClick={() => void loadInitial()}>
            Refresh
          </button>
        </div>
        <p style={{ margin: 0, color: "#57606a" }}>{activeVm.mission}</p>
        {activeVm.statusMessage ? <div>{activeVm.statusMessage}</div> : null}
        {errorMessage ? <div>{errorMessage}</div> : null}
      </header>

      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Account</span>
          <select
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            disabled={loading || running || activeVm.accountOptions.length === 0}
          >
            {activeVm.accountOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}{option.note ? ` â€” ${option.note}` : ""}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 600 }}>Sequence actions</div>
          <div style={{ display: "grid", gap: 8 }}>
            {activeVm.availableActions.map((action) => (
              <label key={action.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedActionIds.includes(action.id)}
                  onChange={() => toggleAction(action.id)}
                  disabled={loading || running}
                />
                <span><strong>{action.label}</strong></span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={() => void runSimulation()} disabled={loading || running || !selectedAccountId}>
            {running ? "Runningâ€¦" : "Run deterministic simulation"}
          </button>
          <button type="button" onClick={clearActions} disabled={loading || running || selectedActionIds.length === 0}>
            Clear actions
          </button>
        </div>
      </div>

      <div>
        <h3>Before / after deltas</h3>
        <ul>
          {activeVm.deltas.map((delta) => (
            <li key={delta.label}>
              <strong>{delta.label}:</strong> {delta.currentValue} â†’ {delta.simulatedValue}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Step transitions</h3>
        <ol>
          {activeVm.steps.map((step) => (
            <li key={step.stepLabel}>
              <strong>{step.stepLabel}:</strong> {step.summary}
            </li>
          ))}
        </ol>
      </div>

      <p style={{ margin: 0, color: "#57606a" }}>{activeVm.explanation}</p>
    </section>
  );
}