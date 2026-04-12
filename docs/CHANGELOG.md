# Changelog

## [0.1.0] - 2026-04-11

Channel: release-candidate

### Added
- Local JSON-backed workspace read/write flow verified across runtime smoke and write-action validation.
- Reports and simulation routes verified against live local workspace-backed sources.
- Standalone Next server packaging path prepared and verified.
- Windows Node sidecar staging added for Tauri desktop packaging.
- Real Tauri shell layer restored with build script, capabilities, shell plugin, and icon set.

### Fixed
- Account and payout mutation validation now rejects invalid updates without changing workspace state.
- Journal note append flow now validates input and restores workspace state cleanly after verification.
- Simulation route build issue caused by query-param prerendering was resolved for production builds.
- Desktop packaging blockers around icons, shell restore, sidecar staging, and standalone resource layout were cleared.

### Packaging
- Windows desktop build completed successfully and produced src-tauri\target\release\veradmin-desktop.exe.

### Known residuals
- The current persistence layer remains transitional local JSON rather than a fully closed production persistence architecture.
- Several visible surfaces still derive from seeded/local JSON sample records rather than the deeper canonical tactical/domain layer.
- Backup/restore/export and continuity/admin depth are improved but not yet fully restored to the deeper canonical doctrine depth.