import { describe, expect, it } from "vitest";
import { buildSimulationWorkbenchVMFromPayload } from "@/lib/services/simulation";

describe("Step 12 live simulation builder", () => {
  it("builds a ready workbench VM from deterministic payload data", () => {
    const vm = buildSimulationWorkbenchVMFromPayload({
      status: "ready",
      engineSourceLabel: "engine-source",
      selectedAccountId: "A-1",
      selectedActionIds: ["standard_loss"],
      accountOptions: [
        { id: "A-1", label: "Alpha", note: "Mode: Attack" },
      ],
      deltas: [
        {
          label: "Mode",
          currentValue: "Attack",
          simulatedValue: "Preservation",
          emphasis: "caution",
        },
      ],
      steps: [
        {
          stepLabel: "Step 1",
          summary: "standard_loss was evaluated through the deterministic engine.",
        },
      ],
      explanation: "Deterministic simulation executed successfully.",
    });

    expect(vm.status).toBe("ready");
    expect(vm.accountOptions.length).toBe(1);
    expect(vm.availableActions.length).toBeGreaterThan(0);
    expect(vm.deltas[0]?.simulatedValue).toBe("Preservation");
  });
});