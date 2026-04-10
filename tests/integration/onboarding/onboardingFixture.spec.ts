import { describe, expect, it } from "vitest";
import { onboardingFleetFixture } from "../../../db/fixtures/fleets/onboardingFleet";

describe("onboarding fixture integration surface", () => {
  it("uses onboarding fixture category", () => {
    expect(onboardingFleetFixture.manifest.fixtureCategory).toBe("onboarding");
  });
});
