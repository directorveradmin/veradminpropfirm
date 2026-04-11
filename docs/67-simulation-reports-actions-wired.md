# Simulation, Reports, and Workspace Actions Upgrade

Version: 1.0  
Status: Applied  
Scope: Connect simulation to account detail flow, connect reports to local JSON persistence, and add write/update actions

## What changed
- Simulation now accepts account context from account detail and runs against a local deterministic state adapter.
- Reports now read from the same workspace.json source as the visible product surfaces.
- Account detail and payouts now include live write/update actions that modify workspace.json.

## Boundaries preserved
- Simulation remains deterministic and non-mutating.
- Reports remain reflective and data-grounded.
- No cloud dependency or AI authority was introduced.