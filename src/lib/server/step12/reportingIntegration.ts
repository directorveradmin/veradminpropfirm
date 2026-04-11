import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type {
  ReportingDataSnapshot,
  ReportingAccountRecord,
  ReportingAlertRecord,
  ReportingPayoutRecord,
  ReportingJournalRecord,
} from "@/lib/services/reporting/builders";
const readModelsModule: Record<string, unknown> = {};

type GenericRow = Record<string, unknown>;

const READ_MODELS_AVAILABLE = false;
const READ_MODELS_SOURCE = "db-only";
const EXCLUDED_DIRECTORY_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  "src-tauri",
  "coverage",
  "dist",
  "build",
]);

function walkForDatabaseFiles(root: string, depth = 0, maxDepth = 5, found: string[] = []): string[] {
  if (depth > maxDepth || !fs.existsSync(root)) {
    return found;
  }

  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRECTORY_NAMES.has(entry.name)) {
        continue;
      }
      walkForDatabaseFiles(path.join(root, entry.name), depth + 1, maxDepth, found);
      continue;
    }

    if (/\.(sqlite|sqlite3|db|db3)$/i.test(entry.name)) {
      found.push(path.join(root, entry.name));
    }
  }

  return found;
}

function chooseBestDatabasePath(paths: string[]): string | null {
  if (paths.length === 0) {
    return null;
  }

  const scored = paths.map((candidate) => {
    const lower = candidate.toLowerCase();
    let score = 0;
    if (lower.includes("veradmin")) score += 25;
    if (lower.includes("local")) score += 10;
    if (lower.includes("app")) score += 8;
    if (lower.includes("data")) score += 6;
    if (lower.includes("scaffold")) score += 4;
    if (lower.endsWith(".sqlite")) score += 3;
    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score || a.candidate.length - b.candidate.length);
  return scored[0]?.candidate ?? null;
}

function detectDatabasePath(repoRoot: string): string | null {
  const directCandidates = [
    path.join(repoRoot, "veradmin.sqlite"),
    path.join(repoRoot, "data", "veradmin.sqlite"),
    path.join(repoRoot, "db", "veradmin.sqlite"),
    path.join(repoRoot, "local", "veradmin.sqlite"),
  ];

  for (const candidate of directCandidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return chooseBestDatabasePath(walkForDatabaseFiles(repoRoot));
}

function safeTableNames(db: Database.Database): string[] {
  try {
    return db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      )
      .all()
      .map((row: any) => String(row.name));
  } catch {
    return [];
  }
}

function safeReadRows(db: Database.Database, tableName: string | null, limit = 5000): GenericRow[] {
  if (!tableName) {
    return [];
  }

  try {
    const escaped = tableName.replace(/"/g, '""');
    return db.prepare(`SELECT * FROM "${escaped}" LIMIT ${limit}`).all() as GenericRow[];
  } catch {
    return [];
  }
}

function detectLikelyTable(tableNames: string[], keywords: string[]): string | null {
  let bestTable: string | null = null;
  let bestScore = -1;

  for (const tableName of tableNames) {
    const lower = tableName.toLowerCase();
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTable = tableName;
    }
  }

  return bestScore > 0 ? bestTable : null;
}

function getCaseInsensitiveValue(row: GenericRow, candidates: string[]): unknown {
  for (const candidate of candidates) {
    const target = candidate.toLowerCase();
    for (const [key, value] of Object.entries(row)) {
      if (key.toLowerCase() === target) {
        return value;
      }
    }
  }
  return undefined;
}

function asText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (["true", "yes", "y", "1", "tradable", "ready", "active"].includes(lower)) return true;
    if (["false", "no", "n", "0", "stopped", "breached", "inactive"].includes(lower)) return false;
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeAccountRows(rows: GenericRow[]): ReportingAccountRecord[] {
  return rows.map((row, index) => {
    const id =
      asText(getCaseInsensitiveValue(row, ["id", "accountId", "account_id", "uuid"])) ??
      `account-${index + 1}`;

    const label =
      asText(getCaseInsensitiveValue(row, ["label", "accountLabel", "account_label", "name", "accountName"])) ??
      `Account ${index + 1}`;

    const mode = asText(getCaseInsensitiveValue(row, ["mode", "currentMode", "current_mode", "posture"]));
    const tradableRaw = asBoolean(getCaseInsensitiveValue(row, ["tradable", "isTradable", "canTrade", "tradeAllowed"]));
    const restrictedRaw = asBoolean(getCaseInsensitiveValue(row, ["restricted", "isRestricted", "tradeRestricted", "paused"]));
    const stoppedRaw =
      asBoolean(getCaseInsensitiveValue(row, ["stopped", "isStopped", "breached", "isBreached", "terminated"])) ??
      false;
    const payoutReadyRaw = asBoolean(
      getCaseInsensitiveValue(row, ["payoutReady", "isPayoutReady", "payoutEligible", "payout_ready"])
    ) ?? false;

    const effectiveLives = asNumber(
      getCaseInsensitiveValue(row, ["effectiveLives", "livesRemaining", "remainingLives", "lives", "effective_lives"])
    );

    const restricted =
      restrictedRaw ??
      Boolean(mode && ["preservation", "recovery", "cooldown", "payout protection"].some((value) => mode.toLowerCase().includes(value)));

    const tradable = tradableRaw ?? (!restricted && !stoppedRaw);

    const noteParts = [
      asText(getCaseInsensitiveValue(row, ["firm", "firmLabel", "firm_label"])),
      asText(getCaseInsensitiveValue(row, ["stage", "class", "stageLabel"])),
    ].filter(Boolean);

    return {
      id,
      label,
      mode,
      tradable,
      restricted,
      stopped: stoppedRaw,
      payoutReady: payoutReadyRaw,
      effectiveLives: effectiveLives ?? null,
      note: noteParts.length > 0 ? noteParts.join(" | ") : undefined,
    };
  });
}

function normalizeAlertRows(rows: GenericRow[]): ReportingAlertRecord[] {
  return rows.map((row) => ({
    severity: asText(getCaseInsensitiveValue(row, ["severity", "level", "priority"])) ?? "unknown",
    category: asText(getCaseInsensitiveValue(row, ["category", "type", "group"])),
    resolved: asBoolean(getCaseInsensitiveValue(row, ["resolved", "isResolved", "acknowledged", "dismissed"])) ?? false,
  }));
}

function normalizePayoutRows(rows: GenericRow[]): ReportingPayoutRecord[] {
  return rows.map((row) => ({
    status: asText(getCaseInsensitiveValue(row, ["status", "payoutStatus", "state"])) ?? "unknown",
    amount: asNumber(getCaseInsensitiveValue(row, ["amount", "netAmount", "payoutAmount", "value"])) ?? null,
  }));
}

function normalizeJournalRows(rows: GenericRow[]): ReportingJournalRecord[] {
  return rows.map((row) => ({
    outcome: asText(getCaseInsensitiveValue(row, ["outcome", "result", "tradeResult", "eventType"])),
    session: asText(getCaseInsensitiveValue(row, ["session", "sessionLabel", "window"])),
    tag: asText(getCaseInsensitiveValue(row, ["tag", "category", "noteCategory", "setup"])),
  }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function collectRecordArrays(value: unknown, depth = 0, arrays: Record<string, GenericRow[]> = {}): Record<string, GenericRow[]> {
  if (depth > 4 || value == null) {
    return arrays;
  }

  if (Array.isArray(value)) {
    if (value.every((item) => isRecord(item))) {
      const records = value as GenericRow[];
      const key = `array_${Object.keys(arrays).length + 1}`;
      arrays[key] = records;
    } else {
      for (const item of value) {
        collectRecordArrays(item, depth + 1, arrays);
      }
    }
    return arrays;
  }

  if (isRecord(value)) {
    for (const [key, nested] of Object.entries(value)) {
      if (Array.isArray(nested) && nested.every((item) => isRecord(item))) {
        arrays[key] = nested as GenericRow[];
      } else {
        collectRecordArrays(nested, depth + 1, arrays);
      }
    }
  }

  return arrays;
}

async function collectReadModelArtifacts(): Promise<Record<string, unknown>> {
  if (!READ_MODELS_AVAILABLE) {
    return {};
  }

  const results: Record<string, unknown> = {};
  const moduleExports = readModelsModule as Record<string, unknown>;

  for (const [name, value] of Object.entries(moduleExports)) {
    if (typeof value !== "function") {
      continue;
    }

    if (!/(get|build|load|list|query|read|fetch)/i.test(name)) {
      continue;
    }

    const fn = value as (...args: unknown[]) => unknown;
    const attempts = [
      () => fn(),
      () => fn({}),
      () => fn({ includeAll: true }),
      () => fn(undefined),
    ];

    for (const attempt of attempts) {
      try {
        const result = await Promise.resolve(attempt());
        if (result !== undefined) {
          results[name] = result;
          break;
        }
      } catch {
        // Intentionally quiet. Reporting must stay honest instead of crashing on one incompatible export.
      }
    }
  }

  return results;
}

function extractAccountsFromArtifacts(artifacts: Record<string, unknown>): ReportingAccountRecord[] {
  const arrays = collectRecordArrays(artifacts);
  for (const [key, value] of Object.entries(arrays)) {
    const lower = key.toLowerCase();
    if (lower.includes("account")) {
      return normalizeAccountRows(value);
    }
  }

  for (const value of Object.values(arrays)) {
    const normalized = normalizeAccountRows(value).filter((account) => Boolean(account.label));
    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [];
}

export async function getLiveReportingDataSnapshot(): Promise<ReportingDataSnapshot> {
  const repoRoot = process.cwd();
  const issues: string[] = [];
  const dbPath = detectDatabasePath(repoRoot);

  let accounts: ReportingAccountRecord[] = [];
  let alerts: ReportingAlertRecord[] = [];
  let payouts: ReportingPayoutRecord[] = [];
  let journal: ReportingJournalRecord[] = [];

  if (dbPath) {
    try {
      const db = new Database(dbPath, { readonly: true });
      const tableNames = safeTableNames(db);

      const accountsTable = detectLikelyTable(tableNames, ["account"]);
      const alertsTable = detectLikelyTable(tableNames, ["alert"]);
      const payoutsTable = detectLikelyTable(tableNames, ["payout", "refund"]);
      const journalTable = detectLikelyTable(tableNames, ["journal", "trade", "event", "timeline"]);

      accounts = normalizeAccountRows(safeReadRows(db, accountsTable));
      alerts = normalizeAlertRows(safeReadRows(db, alertsTable));
      payouts = normalizePayoutRows(safeReadRows(db, payoutsTable));
      journal = normalizeJournalRows(safeReadRows(db, journalTable));

      db.close();

      if (accounts.length === 0) {
        issues.push("Local database detected, but no recognizable account rows were found.");
      }
    } catch (error) {
      issues.push(`Local database could not be read safely: ${error instanceof Error ? error.message : "unknown database error"}`);
    }
  } else {
    issues.push("No local database file was detected under the repo root.");
  }

  if (accounts.length === 0 && READ_MODELS_AVAILABLE) {
    const artifacts = await collectReadModelArtifacts();
    const fromReadModels = extractAccountsFromArtifacts(artifacts);
    if (fromReadModels.length > 0) {
      accounts = fromReadModels;
    }
  }

  const sourceLabel = dbPath
    ? READ_MODELS_AVAILABLE
      ? `Local database + read-model adapter (${READ_MODELS_SOURCE})`
      : "Local database"
    : READ_MODELS_AVAILABLE
    ? `Read-model adapter (${READ_MODELS_SOURCE})`
    : "No live data source detected";

  return {
    sourceLabel,
    dbPath,
    timeRangeLabel: "All available local history",
    scopeLabel: "Fleet",
    lastUpdatedLabel: new Date().toISOString(),
    accounts,
    alerts,
    payouts,
    journal,
    issues,
  };
}