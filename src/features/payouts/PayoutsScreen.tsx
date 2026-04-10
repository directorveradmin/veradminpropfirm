import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function PayoutsScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Payouts"
      description="Business operations surface for payout readiness, request flow, and refund follow-through."
      routeKey="payouts"
    >
      <KpiRow items={[{ label: "Ready", value: "0" }, { label: "In Flight", value: "0" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Payout workflow">
        This route is active and ready for payout tables, request actions, received-state review, and admin follow-up.
      </InfoCard>
    </SimplePageShell>
  );
}
