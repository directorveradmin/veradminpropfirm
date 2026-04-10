"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import {
  backupCenterFixture,
  type BackupCenterVM,
  type BackupRecordVM,
  type CompatibilityStatus,
  type ExportPresetVM,
  type HeaderActionVM,
  type OperationRecordVM,
  type ProtectionSummaryItemVM,
  type Tone,
} from "@/lib/view-models/backupCenter";

export interface BackupRestoreExportScreenProps {
  readonly vm?: BackupCenterVM;
}

const TONE_STYLES: Record<Tone, string> = {
  neutral: "border-slate-200 bg-white text-slate-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  critical: "border-rose-200 bg-rose-50 text-rose-800",
};

const BUTTON_STYLES: Record<HeaderActionVM["emphasis"], string> = {
  primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
};

const COMPATIBILITY_TONES: Record<CompatibilityStatus, Tone> = {
  compatible: "success",
  "compatible-after-migration": "info",
  "review-required": "warning",
  unsupported: "critical",
  "uncertain-integrity": "critical",
};

export function BackupRestoreExportScreen({
  vm = backupCenterFixture,
}: BackupRestoreExportScreenProps): ReactElement {
  const [selectedBackupId, setSelectedBackupId] = useState(
    vm.restore.availableBackups[0]?.id,
  );

  const selectedPreview = useMemo(
    () =>
      selectedBackupId ? vm.restore.previews[selectedBackupId] : undefined,
    [selectedBackupId, vm.restore.previews],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <Header header={vm.header} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vm.protectionSummary.map((item) => (
            <SummaryCard key={item.id} item={item} />
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="success">Backup</Pill>
              <Pill tone="neutral">Protection first</Pill>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Backup
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {vm.backup.introduction}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destination summary
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {vm.backup.destinationSummary}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {vm.backup.includesSummary}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Timestamp</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Version surface</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {vm.backup.records.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-slate-900">
                            {record.createdAtLabel}
                          </div>
                          {record.note ? (
                            <div className="mt-1 text-xs leading-5 text-slate-500">
                              {record.note}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 align-top capitalize text-slate-700">
                          {record.backupType.replaceAll("-", " ")}
                        </td>
                        <td className="px-4 py-3 align-top text-slate-600">
                          <div>App: {record.appVersion}</div>
                          <div>Schema: {record.schemaVersion}</div>
                          <div>Format: {record.backupFormatVersion}</div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Pill tone={record.tone}>{record.statusLabel}</Pill>
                          <div className="mt-2 text-xs text-slate-500">
                            {record.restorable ? "Restorable" : "Review only"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Backup routine
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Manual backup remains easy to reach because recovery is part of
                  the productâ€™s trust contract.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {}}
                className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
              >
                Create Backup Now
              </button>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Protection health
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900 capitalize">
                  {vm.backup.health}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If protection becomes degraded, risky actions must warn more
                  aggressively even when tactical views still load.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="warning">Restore</Pill>
              <Pill tone="neutral">Protected workflow</Pill>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Restore
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {vm.restore.introduction}
              </p>
            </div>
          </div>

          {vm.restore.protectedRecoveryCallout ? (
            <Callout
              tone={vm.restore.protectedRecoveryCallout.tone}
              title={vm.restore.protectedRecoveryCallout.title}
              detail={vm.restore.protectedRecoveryCallout.detail}
              nextStep={vm.restore.protectedRecoveryCallout.nextStep}
            />
          ) : null}

          <div className="mt-5 grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="space-y-3">
              {vm.restore.availableBackups.map((record) => {
                const isActive = record.id === selectedBackupId;

                return (
                  <button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedBackupId(record.id)}
                    className={[
                      "w-full rounded-xl border p-4 text-left transition",
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-white",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">
                        {record.createdAtLabel}
                      </div>
                      <Pill tone={record.tone}>{record.statusLabel}</Pill>
                    </div>
                    <div
                      className={[
                        "mt-2 text-sm capitalize",
                        isActive ? "text-slate-200" : "text-slate-600",
                      ].join(" ")}
                    >
                      {record.backupType.replaceAll("-", " ")}
                    </div>
                    {record.note ? (
                      <div
                        className={[
                          "mt-2 text-xs leading-5",
                          isActive ? "text-slate-300" : "text-slate-500",
                        ].join(" ")}
                      >
                        {record.note}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {selectedPreview ? (
              <RestorePreview record={selectedPreview} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Select a backup to review restore compatibility.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="info">Export</Pill>
              <Pill tone="neutral">Intentional portability</Pill>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Export
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {vm.export.introduction}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {vm.export.presets.map((preset) => (
              <ExportCard key={preset.id} preset={preset} />
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-950">
                {vm.versionPanel.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Version layering remains visible so compatibility never becomes
                guesswork.
              </p>
            </div>

            <div className="space-y-3">
              {vm.versionPanel.lines.map((line) => (
                <div
                  key={line.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {line.label}
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-900">
                    {line.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-800">
              {vm.versionPanel.compatibilityNote}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-950">
                Recent operations
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Backup, restore, and export history helps explain continuity and
                recovery state.
              </p>
            </div>

            <div className="space-y-3">
              {vm.operations.map((operation) => (
                <OperationCard key={operation.id} operation={operation} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Header({
  header,
}: {
  readonly header: BackupCenterVM["header"];
}): ReactElement {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={header.protectionTone}>{header.protectionBadge}</Pill>
            <Pill tone="neutral">Continuity surface</Pill>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {header.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {header.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {header.actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {}}
              className={[
                "rounded-xl border px-4 py-3 text-sm font-medium transition",
                BUTTON_STYLES[action.emphasis],
              ].join(" ")}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SummaryCard({
  item,
}: {
  readonly item: ProtectionSummaryItemVM;
}): ReactElement {
  return (
    <article
      className={[
        "rounded-2xl border p-5 shadow-sm",
        TONE_STYLES[item.tone],
      ].join(" ")}
    >
      <div className="text-xs font-semibold uppercase tracking-wide">
        {item.label}
      </div>
      <div className="mt-2 text-base font-semibold">{item.value}</div>
      <p className="mt-2 text-sm leading-6">{item.detail}</p>
    </article>
  );
}

function RestorePreview({
  record,
}: {
  readonly record: BackupCenterVM["restore"]["previews"][string];
}): ReactElement {
  const tone = COMPATIBILITY_TONES[record.compatibilityStatus];
  const isBlocked =
    record.compatibilityStatus === "review-required" ||
    record.compatibilityStatus === "unsupported" ||
    record.compatibilityStatus === "uncertain-integrity" ||
    Boolean(record.blockedReason);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={tone}>{record.compatibilityLabel}</Pill>
          {record.requiresPostRestoreMigration ? (
            <Pill tone="info">Post-restore migration expected</Pill>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <VersionCell label="Backup timestamp" value={record.timestampLabel} />
          <VersionCell label="Backup type" value={record.backupType.replaceAll("-", " ")} />
          <VersionCell label="App version" value={record.appVersion} />
          <VersionCell label="Schema version" value={record.schemaVersion} />
          <VersionCell
            label="Backup format version"
            value={record.backupFormatVersion}
          />
          <VersionCell
            label="Current state preserved until confirm"
            value={record.currentStatePreservedUntilConfirm ? "Yes" : "No"}
          />
        </div>

        <div
          className={[
            "mt-4 rounded-xl border p-4 text-sm leading-6",
            TONE_STYLES[tone],
          ].join(" ")}
        >
          {record.compatibilityDetail}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-950">Restore impact preview</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {record.affectedStateSummary.map((line) => (
            <li key={line} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              {line}
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {record.willCreateSafetyBackup
            ? "A safety backup of current local state will be created before restore begins."
            : "No safety backup is currently configured for this path."}
        </div>

        {record.blockedReason ? (
          <Callout
            tone="warning"
            title="Restore blocked"
            detail={record.blockedReason}
            nextStep="Choose another backup or resolve compatibility before attempting restore."
          />
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {}}
            disabled={isBlocked}
            className={[
              "rounded-xl border px-4 py-3 text-sm font-medium",
              isBlocked
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                : "border-slate-900 bg-slate-900 text-white",
            ].join(" ")}
          >
            {record.confirmationLabel}
          </button>
          <button
            type="button"
            onClick={() => {}}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
          >
            {record.cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportCard({
  preset,
}: {
  readonly preset: ExportPresetVM;
}): ReactElement {
  return (
    <article className="rounded-2xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="neutral">{preset.label}</Pill>
        {preset.lastExportLabel ? <Pill tone="info">{preset.lastExportLabel}</Pill> : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">
        {preset.scopeSummary}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {preset.inclusionSummary}
      </p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Destination summary
        </div>
        <div className="mt-2 text-sm text-slate-700">
          {preset.destinationSummary}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {preset.formatOptions.map((format) => (
          <Pill key={format.id} tone="neutral">
            {format.label}
          </Pill>
        ))}
      </div>

      {preset.cautionText ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          {preset.cautionText}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {}}
        className="mt-4 rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
      >
        Start export
      </button>
    </article>
  );
}

function OperationCard({
  operation,
}: {
  readonly operation: OperationRecordVM;
}): ReactElement {
  return (
    <article
      className={[
        "rounded-2xl border p-4",
        TONE_STYLES[operation.tone],
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{operation.typeLabel}</div>
          <div className="mt-1 text-xs uppercase tracking-wide">
            {operation.occurredAtLabel}
          </div>
        </div>
        <Pill tone={operation.tone}>{operation.outcome}</Pill>
      </div>

      <div className="mt-3 text-sm leading-6">{operation.summary}</div>
      <div className="mt-2 text-sm leading-6 opacity-90">{operation.detail}</div>
    </article>
  );
}

function VersionCell({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): ReactElement {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function Callout({
  tone,
  title,
  detail,
  nextStep,
}: {
  readonly tone: Tone;
  readonly title: string;
  readonly detail: string;
  readonly nextStep?: string;
}): ReactElement {
  return (
    <div
      className={[
        "mt-4 rounded-2xl border p-4",
        TONE_STYLES[tone],
      ].join(" ")}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6">{detail}</div>
      {nextStep ? (
        <div className="mt-2 text-xs font-medium uppercase tracking-wide">
          Next step: {nextStep}
        </div>
      ) : null}
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  readonly tone: Tone;
  readonly children: React.ReactNode;
}): ReactElement {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
        TONE_STYLES[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default BackupRestoreExportScreen;
