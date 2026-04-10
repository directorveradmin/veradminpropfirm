import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";

export default function HomePage() {
  return (
    <SimplePageShell
      title="Command Center"
      description="Desktop-first mission control for prop-firm fleet awareness, state clarity, and next-action guidance."
      routeKey="home"
    >
      <KpiRow
        items={[
          { label: "Validated Routes", value: "8" },
          { label: "Step 11", value: "Installed" },
          { label: "Onboarding Pack", value: "Ready" },
          { label: "Route Layer", value: "Live" }
        ]}
      />

      <InfoCard title="What is ready right now">
        The validated route set is wired into a coherent shell: Journal, Alerts, Payouts, Calendar, Accounts,
        Settings, and Backups.
      </InfoCard>

      <InfoCard title="Suggested next checks">
        Run the migration flow, seed the onboarding fixture, and open each route in the browser to confirm the
        local shell is stable under real navigation.
      </InfoCard>
    </SimplePageShell>
  );
}
