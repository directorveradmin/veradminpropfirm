# Local JSON Persistence Upgrade

Version: 1.0  
Status: Applied  
Scope: Replace in-memory workspace arrays with local JSON-backed persistence

## What changed
- Added data/workspace.json as the local persistence source.
- Added src/lib/server/workspaceStore.ts to read local workspace state.
- Rewired visible surfaces to read from the JSON-backed store.
- Converted account detail routing to a server-side route param flow.

## What did not change
- No doctrine changes
- No Step 12 reporting/simulation boundary changes
- No cloud dependency introduced

## Intent
Move the visible product layer from mock in-memory arrays toward real local-first persistence.