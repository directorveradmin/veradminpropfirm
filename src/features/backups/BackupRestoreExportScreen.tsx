import SimplePageShell from "@/components/layout/SimplePageShell";
import { InfoCard, KpiRow } from "@/components/layout/SimpleSurface";
import type { ReactElement } from "react";

export default function BackupRestoreExportScreen(): ReactElement {
  return (
    <SimplePageShell
      title="Backup, Restore, and Export"
      description="Protection and recovery surface for local-first Veradmin data continuity."
      routeKey="backups"
    >
      <KpiRow items={[{ label: "Last Backup", value: "Pending" }, { label: "Restore State", value: "Not Wired" }, { label: "Step Status", value: "Route Ready" }]} />
      <InfoCard title="Protection summary">
        This route is active and ready for backup inventory, restore preview, export scope, and recent operation history.
      </InfoCard>
    </SimplePageShell>
  );
}
