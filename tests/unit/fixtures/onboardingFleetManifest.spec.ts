import { describe, expect, it } from 'vitest';

import { onboardingFleetFixture } from '../../../db/fixtures/fleets/onboardingFleet';
import { fixtureManifestSchema } from '../../../src/lib/validation/fixtures';

describe('onboardingFleetFixture manifest', () => {
  it('parses against the shared fixture manifest schema', () => {
    const parsed = fixtureManifestSchema.parse(onboardingFleetFixture.manifest);
    expect(parsed.fixtureCategory).toBe('onboarding');
    expect(parsed.fixtureId).toBe('onboarding_fleet_v1');
  });

  it('keeps manifest counts aligned with the pack contents', () => {
    expect(onboardingFleetFixture.manifest.containsAccounts).toBe(onboardingFleetFixture.accounts.length);
    expect(onboardingFleetFixture.manifest.containsAlerts).toBe(onboardingFleetFixture.alerts.length > 0);
    expect(onboardingFleetFixture.manifest.containsPayouts).toBe(
      onboardingFleetFixture.payoutRequests.length > 0,
    );
  });

  it('contains the frozen Step 11 teaching roles', () => {
    expect(onboardingFleetFixture.accounts.some((account) => account.accountLabel === 'ONB-ALPHA-TRADABLE')).toBe(true);
    expect(
      onboardingFleetFixture.accounts.some((account) => account.accountLabel === 'ONB-ALPHA-PRESERVATION'),
    ).toBe(true);
    expect(onboardingFleetFixture.accounts.some((account) => account.accountLabel === 'ONB-BETA-PAYOUT')).toBe(true);
    expect(onboardingFleetFixture.accounts.some((account) => account.accountLabel === 'ONB-BETA-STOPPED')).toBe(true);
    expect(onboardingFleetFixture.accounts.some((account) => account.accountLabel === 'ONB-BETA-ROTATION')).toBe(true);
  });
});
