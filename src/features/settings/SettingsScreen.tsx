import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function SettingsScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Settings"
      description="Administrative control surface for configuration, defaults, diagnostics, and continuity entry points."
      routeKey="settings"
    >
      <KpiRow items={[{ label: "Environment", value: "Local" }, { label: "Version", value: "0.1.0" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Administrative settings">
        This route is active and ready for settings sections, diagnostics metadata, and continuity summaries.
      </InfoCard>
    </SimplePageShell>
  );
}
