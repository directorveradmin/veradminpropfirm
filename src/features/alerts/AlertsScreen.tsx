import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function AlertsScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Alerts"
      description="Severity-aware review surface for tactical danger and important reminders."
      routeKey="alerts"
    >
      <KpiRow items={[{ label: "Critical", value: "0" }, { label: "High", value: "0" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Alert queue">
        This route is active and ready for grouped alert lists, acknowledgement flow, and drill-down actions.
      </InfoCard>
    </SimplePageShell>
  );
}
