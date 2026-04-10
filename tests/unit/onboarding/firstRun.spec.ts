import { describe, expect, it } from "vitest";
import { deriveFirstRunStatus } from "../../../src/lib/services/onboarding/firstRun";

describe("deriveFirstRunStatus", () => {
  it("shows onboarding when there are no accounts", () => {
    const status = deriveFirstRunStatus(0, false);
    expect(status.shouldShowOnboarding).toBe(true);
  });
});
