# Veradmin Installation Notes â€” 0.1.0

Date: 2026-04-11  
Channel: release-candidate  
Primary OS target: Windows

## Built artifact
Expected packaged desktop executable:
- src-tauri\target\release\veradmin-desktop.exe

## Launch expectation
- Launch should open the Veradmin desktop shell.
- The shell should start the packaged local runtime automatically.
- The local runtime should expose the app surfaces and local workspace data without requiring a separate dev server.

## Local data posture
- Veradmin remains local-first and desktop-first.
- Local workspace state is precious and should not be treated as disposable.
- Uninstall/reinstall behavior should not be assumed to remove local data silently.

## Operational note
This release candidate still uses transitional local JSON persistence.
That is acceptable for current completion-readiness verification, but it should remain documented as non-final persistence architecture.