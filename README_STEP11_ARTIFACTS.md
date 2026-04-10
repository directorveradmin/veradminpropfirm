# Veradmin Step 11 Artifact Index

This folder is structured to drop into the repo root.

## Docs
- `docs/52-step11-onboarding-and-first-run-blueprint.md`
- `docs/53-step11-example-fleet-onboarding-pack.md`
- `docs/54-step11-testing-layers-and-quality-gates.md`
- `docs/55-step11-release-hardening-and-daily-driver-criteria.md`
- `docs/56-step11-error-state-polish.md`
- `docs/handoff_step11_to_step12.md`

## Code / test artifacts
- `db/fixtures/fleets/onboardingFleet.ts`
- `scripts/db/seed-onboarding.ts`
- `tests/unit/fixtures/onboardingFleetManifest.spec.ts`
- `scripts/step11/verify-step11.ps1`

## Notes
- The test artifact assumes `vitest` is installed in `devDependencies`.
- The verification script warns if `vitest` or `db:seed:onboarding` are still missing from `package.json`.
