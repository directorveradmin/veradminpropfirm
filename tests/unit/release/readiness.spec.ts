import { describe, expect, it } from "vitest";
import { summarizeReadinessChecks } from "../../../src/lib/services/release/readiness";

describe("summarizeReadinessChecks", () => {
  it("returns ready when there are no failing checks", () => {
    const summary = summarizeReadinessChecks([{ id: "a", label: "A", status: "pass", detail: "ok" }]);
    expect(summary.isReady).toBe(true);
  });
});
