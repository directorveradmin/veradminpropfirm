import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function JournalScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Journal"
      description="Structured event memory for trade logging, notes, and timeline review."
      routeKey="journal"
    >
      <KpiRow items={[{ label: "Entries Today", value: "0" }, { label: "Needs Wiring", value: "History Feed" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Journal feed">
        This route is active and ready for the real journal timeline, log filters, and account-linked event history.
      </InfoCard>
    </SimplePageShell>
  );
}
