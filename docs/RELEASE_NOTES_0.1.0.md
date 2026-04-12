# Veradmin Release Notes â€” 0.1.0

Date: 2026-04-11  
Channel: release-candidate

## Summary
This release candidate closes the major Step 13 stabilization work needed to move Veradmin from a mixed Step 12 recovery branch into a completion-ready desktop build.

## What is verified
- Typecheck and tests are green.
- Live route smoke is green.
- Reports are grounded in the same local workspace-backed source used by other working routes.
- Simulation is wired through a named local deterministic adapter and remains preview-only.
- Account and payout mutation validation are green.
- Journal note append validation is green.
- Standalone server verification is green.
- Windows Node sidecar staging is green.
- Desktop packaging produced src-tauri\target\release\veradmin-desktop.exe.

## What changed operationally
- The desktop packaging path now uses a packaged bootstrap page plus a Windows Node sidecar instead of a broken static-export assumption.
- Packaged runtime assets include the standalone Next server, static assets, and seed workspace data.
- Workspace storage can now resolve from an environment-driven packaged runtime root instead of only process working directory assumptions.

## Release posture
Recommended classification: completion-ready / release-candidate.

Not yet recommended as final stable without:
- explicit packaged EXE launch verification
- changelog/install note signoff
- backup/restore/export depth review
- residual caveat signoff