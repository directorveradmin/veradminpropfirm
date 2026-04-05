import type { DegradedState } from "@/lib/services/read-models";

export interface BadgeViewModel {
  label: string;
  tone: "neutral" | "good" | "warning" | "danger" | "muted";
}

export interface LabelValueItemViewModel {
  label: string;
  value: string;
  tone?: BadgeViewModel["tone"];
}

export interface DegradedStateViewModel {
  tone: BadgeViewModel["tone"];
  title: string;
  message: string;
}

export interface QuickActionViewModel {
  id: string;
  label: string;
  enabled: boolean;
  reasonDisabled?: string;
}

export function formatCurrencyCents(value: number | null): string {
  if (value == null) {
    return "â€”";
  }

  const amount = value / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatLives(value: number | null): string {
  if (value == null) {
    return "â€”";
  }

  return value.toFixed(2);
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "â€”";
  }

  return new Date(value).toLocaleString();
}

export function mapModeTone(mode: string): BadgeViewModel["tone"] {
  switch (mode.toLowerCase()) {
    case "attack":
      return "good";
    case "preservation":
    case "payout protection":
      return "warning";
    case "recovery":
    case "cooldown":
      return "neutral";
    case "stopped":
    case "breached":
      return "danger";
    default:
      return "muted";
  }
}

export function mapSeverityTone(
  severity: "critical" | "high" | "medium" | "low" | "resolved",
): BadgeViewModel["tone"] {
  switch (severity) {
    case "critical":
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "neutral";
    case "resolved":
      return "muted";
  }
}

export function mapDegradedState(
  degradedState: DegradedState | null,
): DegradedStateViewModel | null {
  if (!degradedState) {
    return null;
  }

  const tone: BadgeViewModel["tone"] =
    degradedState.level === "unsafe" || degradedState.level === "unavailable"
      ? "danger"
      : degradedState.level === "partial"
        ? "warning"
        : "neutral";

  return {
    tone,
    title: degradedState.title,
    message: degradedState.message,
  };
}
