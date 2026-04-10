import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function AccountDetailScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Accounts"
      description="Account-focused tactical dossier surface for state, permissions, explanation, and next action."
      routeKey="accounts"
    >
      <KpiRow items={[{ label: "Accounts Visible", value: "0" }, { label: "Tradable", value: "0" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Account surface">
        This route is active and ready for account cards or account-detail presentation, depending on your current phase.
      </InfoCard>
    </SimplePageShell>
  );
}
