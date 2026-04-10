import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function CalendarRotationScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Calendar"
      description="Rotation and near-future rhythm view for payout cadence, rest windows, and operational load."
      routeKey="calendar"
    >
      <KpiRow items={[{ label: "This Week", value: "0 Windows" }, { label: "Next Review", value: "Pending" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Calendar and rotation">
        This route is active and ready for rotation windows, payout clusters, and upcoming workload planning.
      </InfoCard>
    </SimplePageShell>
  );
}
