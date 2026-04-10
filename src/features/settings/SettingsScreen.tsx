"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import {
  settingsFixture,
  type ApplyBehavior,
  type EntrySummaryVM,
  type FieldMessageVM,
  type QuickActionVM,
  type SettingControlVM,
  type SettingsScreenVM,
  type SettingsSectionVM,
  type Tone,
} from "@/lib/view-models/settings";

export interface SettingsScreenProps {
  readonly vm?: SettingsScreenVM;
}

const TONE_STYLES: Record<Tone, string> = {
  neutral: "border-slate-200 bg-white text-slate-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  critical: "border-rose-200 bg-rose-50 text-rose-800",
};

const BUTTON_STYLES: Record<QuickActionVM["emphasis"], string> = {
  primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
};

const APPLY_LABELS: Record<ApplyBehavior, string> = {
  "applies-immediately": "Applies immediately",
  "staged-until-save": "Staged until save",
  "action-only": "Action",
};

export function SettingsScreen({
  vm = settingsFixture,
}: SettingsScreenProps): ReactElement {
  const [activeSectionId, setActiveSectionId] = useState(vm.sections[0]?.id);

  const activeSection = useMemo<SettingsSectionVM | undefined>(
    () =>
      vm.sections.find((section) => section.id === activeSectionId) ??
      vm.sections[0],
    [activeSectionId, vm.sections],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <Header header={vm.header} />

        {vm.diagnosticsSummary ? (
          <Callout
            tone={vm.diagnosticsSummary.tone}
            title={vm.diagnosticsSummary.title}
            detail={vm.diagnosticsSummary.detail}
            nextStep={vm.diagnosticsSummary.nextStep}
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Settings sections
            </div>
            <nav className="space-y-1" aria-label="Settings sections">
              {vm.sections.map((section) => {
                const isActive = section.id === activeSection?.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSectionId(section.id)}
                    className={[
                      "flex w-full items-start justify-between rounded-xl border px-3 py-3 text-left transition",
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span>
                      <span className="block text-sm font-semibold">
                        {section.navLabel}
                      </span>
                      <span
                        className={[
                          "mt-1 block text-xs leading-5",
                          isActive ? "text-slate-200" : "text-slate-500",
                        ].join(" ")}
                      >
                        {section.summary}
                      </span>
                    </span>
                    <StatusDot tone={section.statusTone ?? "neutral"} />
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="space-y-6">
            {activeSection ? <SectionSurface section={activeSection} /> : null}

            {activeSection?.id === "backups-restore" ? (
              <EntrySummaryCard entry={vm.backupEntry} />
            ) : null}

            {activeSection?.id === "exports-portability" ? (
              <EntrySummaryCard entry={vm.exportEntry} />
            ) : null}
          </main>
        </div>

        <footer className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                System and version summary
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Visible version layering supports trust and diagnostics.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              Administrative footer
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {vm.footer.versionLines.map((line) => (
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

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {vm.footer.integritySummary}
          </p>
        </footer>
      </div>
    </div>
  );
}

function Header({
  header,
}: {
  readonly header: SettingsScreenVM["header"];
}): ReactElement {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={header.environmentTone}>{header.environmentLabel}</Pill>
            <Pill tone="neutral">{header.versionLabel}</Pill>
            {header.hasUnsavedChanges ? (
              <Pill tone="warning">{header.dirtyStateLabel}</Pill>
            ) : (
              <Pill tone="success">No unsaved changes</Pill>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {header.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {header.summary}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[360px] xl:grid-cols-1">
          {header.quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {}}
              className={[
                "rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                BUTTON_STYLES[action.emphasis],
              ].join(" ")}
            >
              <span className="block">{action.label}</span>
              {action.description ? (
                <span
                  className={[
                    "mt-1 block text-xs leading-5",
                    action.emphasis === "primary"
                      ? "text-slate-200"
                      : "text-slate-500",
                  ].join(" ")}
                >
                  {action.description}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function SectionSurface({
  section,
}: {
  readonly section: SettingsSectionVM;
}): ReactElement {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={section.statusTone ?? "neutral"}>{section.navLabel}</Pill>
          <Pill tone="neutral">Administrative surface</Pill>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {section.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {section.summary}
          </p>
        </div>

        {section.intro ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {section.intro}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        {section.callout ? (
          <Callout
            tone={section.callout.tone}
            title={section.callout.title}
            detail={section.callout.detail}
            nextStep={section.callout.nextStep}
          />
        ) : null}

        {section.controls.map((control) => (
          <ControlCard key={control.id} control={control} />
        ))}

        {section.quietStateText ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {section.quietStateText}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ControlCard({
  control,
}: {
  readonly control: SettingControlVM;
}): ReactElement {
  return (
    <article className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-slate-900">
              {control.label}
            </span>
            <Pill tone="neutral">{APPLY_LABELS[control.applyBehavior]}</Pill>
            {control.disabled ? <Pill tone="warning">Unavailable</Pill> : null}
          </div>

          {control.description ? (
            <p className="text-sm leading-6 text-slate-600">
              {control.description}
            </p>
          ) : null}

          {control.messages?.length ? (
            <div className="space-y-2">
              {control.messages.map((message) => (
                <MessageLine key={message.text} message={message} />
              ))}
            </div>
          ) : null}

          {control.disabledReason ? (
            <p className="text-sm text-amber-700">{control.disabledReason}</p>
          ) : null}
        </div>

        <div className="min-w-[260px] rounded-xl border border-slate-200 bg-slate-50 p-4">
          <ControlPreview control={control} />
        </div>
      </div>
    </article>
  );
}

function ControlPreview({
  control,
}: {
  readonly control: SettingControlVM;
}): ReactElement {
  switch (control.kind) {
    case "toggle":
      return (
        <label className="flex items-center justify-between gap-4 text-sm text-slate-700">
          <span>{control.valueText ?? "Disabled"}</span>
          <input
            type="checkbox"
            defaultChecked={control.valueText?.toLowerCase().includes("enabled")}
            aria-label={control.label}
            disabled={control.disabled}
          />
        </label>
      );

    case "select":
      return (
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">
            {control.valueText ?? "Select"}
          </span>
          <select
            defaultValue={control.options?.[0]?.value}
            disabled={control.disabled}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            {control.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )) ?? <option value="">{control.valueText ?? "Select"}</option>}
          </select>
        </label>
      );

    case "textarea":
      return (
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">{control.valueText}</span>
          <textarea
            defaultValue={control.valueText}
            disabled={control.disabled}
            rows={3}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </label>
      );

    case "text":
    case "number":
      return (
        <label className="grid gap-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">{control.valueText}</span>
          <input
            type={control.kind === "number" ? "number" : "text"}
            defaultValue={control.valueText}
            placeholder={control.placeholder}
            disabled={control.disabled}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </label>
      );

    case "action":
    case "link":
      return (
        <div className="space-y-3">
          <div className="text-sm text-slate-700">
            {control.valueText ?? "Action"}
          </div>
          <div className="flex flex-wrap gap-2">
            {control.primaryActionLabel ? (
              <button
                type="button"
                onClick={() => {}}
                disabled={control.disabled}
                className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white"
              >
                {control.primaryActionLabel}
              </button>
            ) : null}
            {control.secondaryActionLabel ? (
              <button
                type="button"
                onClick={() => {}}
                disabled={control.disabled}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900"
              >
                {control.secondaryActionLabel}
              </button>
            ) : null}
          </div>
        </div>
      );

    case "status":
    default:
      return (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Current state
          </div>
          <div className="text-sm font-medium text-slate-900">
            {control.valueText ?? "Available"}
          </div>
        </div>
      );
  }
}

function EntrySummaryCard({
  entry,
}: {
  readonly entry: EntrySummaryVM;
}): ReactElement {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={entry.tone}>{entry.title}</Pill>
            <Pill tone="neutral">{entry.value}</Pill>
          </div>
          <p className="text-sm leading-6 text-slate-600">{entry.detail}</p>
          {entry.warningText ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              {entry.warningText}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {}}
            className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium text-white"
          >
            {entry.primaryActionLabel}
          </button>
          {entry.secondaryActionLabel ? (
            <button
              type="button"
              onClick={() => {}}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900"
            >
              {entry.secondaryActionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MessageLine({
  message,
}: {
  readonly message: FieldMessageVM;
}): ReactElement {
  return (
    <div
      className={[
        "rounded-lg border px-3 py-2 text-sm leading-6",
        TONE_STYLES[message.tone],
      ].join(" ")}
    >
      {message.text}
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
        "rounded-2xl border p-4 shadow-sm",
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

function StatusDot({
  tone,
}: {
  readonly tone: Tone;
}): ReactElement {
  const dotClass =
    tone === "success"
      ? "bg-emerald-400"
      : tone === "warning"
        ? "bg-amber-400"
        : tone === "critical"
          ? "bg-rose-400"
          : tone === "info"
            ? "bg-sky-400"
            : "bg-slate-300";

  return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClass}`} />;
}

export default SettingsScreen;
