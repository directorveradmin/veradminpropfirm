# Handoff Step 8 to Step 9

## Step Completed
Step 8 of 12: **Account Detail Screen** was completed.  
- The Account Detail screen was fully specified as a tactical dossier for one account.  
- The view-model (`AccountDetailVM`) and panel structure were formalized to consume Step 5/6 read-model outputs.  
- Interaction patterns, explanation principles, and compliance with doctrine were documented.

## What Was Finalized
- Panels frozen in top-to-bottom order:
  1. Account Header  
  2. Current State Summary  
  3. Permissions and Restrictions  
  4. Why This State / Rule Explanation  
  5. Tactical Actions  
  6. Journal and Timeline  
  7. Payout and Admin Context  
  8. Simulation Entry Point  
  9. Secondary Metadata  
  10. Degraded and Quiet State Handling
- Mode and permissions explicitly represented; no operator inference required.  
- Tactical actions grouped: trading, payout/admin, account-control.  
- Simulation entry defined (CTA only; live wiring deferred).  
- Degraded and quiet states handled with calm placeholders.  
- Copywriting tone compliant: calm, precise, explanatory, operational.  
- View-model interface aligned with Step 5/6 read-model separation.

## What Must Not Change
- Rule engine remains authoritative; no domain logic in UI.  
- Panel hierarchy and top-to-bottom reading order preserved.  
- Mode labels and permissions must remain consistent with canonical definitions (Attack, Preservation, Recovery, Payout Protection, Cooldown, Stopped, Breached).  
- Degraded/quiet state messaging must remain explicit and calm.  
- Simulation CTA must not mutate live state; uses the rule engine only.  
- Current-state interpretation must remain visually prioritized over historical or administrative panels.

## Outputs Created
- `src/app/accounts/AccountDetailScreen.tsx` – scaffolded component with all panels and placeholder rendering.  
- `src/lib/view-models/accountDetail.ts` – TypeScript view-model interface (`AccountDetailVM`).  
- `docs/handoff_step8_to_step9.md` – this handoff document.  
- Conceptual panel structure and interaction/explanation mapping documented.

## Unresolved Items
- Live wiring of `AccountDetailScreen` to Step 5/6 read-models.  
- Simulation modal/drawer integration and before/after delta visualization.  
- UI layout implementation (columns, spacing, visual prominence).  
- Timeline drill-down interactions.  
- Styling, accessibility (a11y), and focus states.  

## Next Step Goal
Step 9 of 12: **Implement Desktop Layout and Live Wiring for Account Detail Screen**  
- Connect all panels to Step 5/6 read-model outputs.  
- Implement simulation modal/drawer and ensure delta visualization.  
- Apply desktop column layout with proper visual prominence.  
- Add interactive quick-action buttons and drill-down timeline behavior.  
- Apply styling, accessibility, and focus management.  

## Recommended Upload Set for Next Chat
- `src/lib/view-models/accountDetail.ts`  
- `src/hooks/useRefreshSignal.ts`  
- `src/lib/services/refreshCoordinator.ts`  
- Step 5/6 read-model builders (`src/lib/services/read-models/*`)  
- `src/app/accounts/AccountDetailScreen.tsx`  
- `28-account-detail-screen-spec.md`  
- Any UX mockups or layout assets for desktop design