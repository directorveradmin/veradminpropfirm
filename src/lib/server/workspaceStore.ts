import fs from "node:fs";
import path from "node:path";

export type AccountStatus = "tradable" | "restricted" | "stopped";
export type AccountMode =
  | "attack"
  | "preservation"
  | "recovery"
  | "payout protection"
  | "cooldown"
  | "stopped"
  | "breached";

export interface AccountRecord {
  id: string;
  name: string;
  mode: string;
  status: AccountStatus;
  lives: number;
  payoutReady: boolean;
  firm: string;
  stage: string;
  note: string;
}

export interface JournalEntry {
  id: string;
  accountId: string;
  title: string;
  outcome: "win" | "loss" | "note";
  session: string;
  summary: string;
  createdAt: string;
}

export interface AlertRecord {
  id: string;
  severity: "critical" | "high" | "medium";
  category: string;
  title: string;
  detail: string;
  accountId?: string;
}

export interface PayoutRecord {
  id: string;
  accountId: string;
  amount: number;
  status: "ready" | "requested" | "received";
  note: string;
}

export interface CalendarItem {
  id: string;
  title: string;
  date: string;
  category: "rotation" | "review" | "payout";
  note: string;
}

export interface BackupEvent {
  id: string;
  label: string;
  timestamp: string;
  status: "completed" | "warning";
  note: string;
}

export interface WorkspaceData {
  accounts: AccountRecord[];
  journal: JournalEntry[];
  alerts: AlertRecord[];
  payouts: PayoutRecord[];
  calendar: CalendarItem[];
  backups: BackupEvent[];
}

export interface MutationFailure {
  ok: false;
  kind: "not_found" | "validation" | "persistence";
  message: string;
  fieldErrors?: Record<string, string>;
  stateUnchanged: true;
}

export interface MutationSuccess<T> {
  ok: true;
  value: T;
  backupPath?: string;
}

export type MutationResult<T> = MutationFailure | MutationSuccess<T>;

export type AccountPatch = Partial<
  Pick<AccountRecord, "mode" | "status" | "lives" | "payoutReady" | "note">
>;

export type PayoutPatch = Partial<
  Pick<PayoutRecord, "status" | "note" | "amount">
>;

const WORKSPACE_ROOT =
  process.env.VERADMIN_WORKSPACE_ROOT && process.env.VERADMIN_WORKSPACE_ROOT.trim().length > 0
    ? process.env.VERADMIN_WORKSPACE_ROOT
    : process.cwd();

const DATA_DIR = path.join(WORKSPACE_ROOT, "data");
const WORKSPACE_PATH = path.join(DATA_DIR, "workspace.json");
const HISTORY_DIR = path.join(DATA_DIR, "workspace-history");
const AUDIT_LOG_PATH = path.join(HISTORY_DIR, "workspace-audit.log");

const ACCOUNT_MODE_MAP: Record<string, AccountMode> = {
  attack: "attack",
  preservation: "preservation",
  recovery: "recovery",
  "payout protection": "payout protection",
  cooldown: "cooldown",
  stopped: "stopped",
  breached: "breached",
};

const ACCOUNT_STATUS_VALUES: AccountStatus[] = [
  "tradable",
  "restricted",
  "stopped",
];

function ensureStorage(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(HISTORY_DIR, { recursive: true });

  if (!fs.existsSync(WORKSPACE_PATH)) {
    fs.writeFileSync(
      WORKSPACE_PATH,
      JSON.stringify(emptyWorkspace(), null, 2) + "\n",
      "utf8"
    );
  }
}

function emptyWorkspace(): WorkspaceData {
  return {
    accounts: [],
    journal: [],
    alerts: [],
    payouts: [],
    calendar: [],
    backups: [],
  };
}

function normalizeWorkspace(candidate: unknown): WorkspaceData {
  const source =
    typeof candidate === "object" && candidate !== null
      ? (candidate as Partial<WorkspaceData>)
      : {};

  return {
    accounts: Array.isArray(source.accounts)
      ? (source.accounts as AccountRecord[])
      : [],
    journal: Array.isArray(source.journal)
      ? (source.journal as JournalEntry[])
      : [],
    alerts: Array.isArray(source.alerts)
      ? (source.alerts as AlertRecord[])
      : [],
    payouts: Array.isArray(source.payouts)
      ? (source.payouts as PayoutRecord[])
      : [],
    calendar: Array.isArray(source.calendar)
      ? (source.calendar as CalendarItem[])
      : [],
    backups: Array.isArray(source.backups)
      ? (source.backups as BackupEvent[])
      : [],
  };
}

function readWorkspaceText(): string {
  ensureStorage();
  return fs.readFileSync(WORKSPACE_PATH, "utf8");
}

function writeAuditLine(reason: string, backupPath?: string): void {
  ensureStorage();
  const entry = {
    at: new Date().toISOString(),
    reason,
    backupPath: backupPath ?? null,
  };
  fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
}

function persistWorkspace(data: WorkspaceData, reason: string): { backupPath?: string } {
  ensureStorage();

  const nextText = JSON.stringify(data, null, 2) + "\n";
  const tempPath = WORKSPACE_PATH + ".tmp";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const hadWorkspace = fs.existsSync(WORKSPACE_PATH);
  const backupPath = path.join(HISTORY_DIR, `workspace-${stamp}.json`);

  fs.writeFileSync(tempPath, nextText, "utf8");
  JSON.parse(fs.readFileSync(tempPath, "utf8"));

  if (hadWorkspace) {
    fs.copyFileSync(WORKSPACE_PATH, backupPath);
  }

  try {
    fs.copyFileSync(tempPath, WORKSPACE_PATH);
    writeAuditLine(reason, hadWorkspace ? backupPath : undefined);
    return hadWorkspace ? { backupPath } : {};
  } catch (error) {
    if (hadWorkspace && fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, WORKSPACE_PATH);
    }
    throw error;
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { force: true });
    }
  }
}

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function trimText(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function parseFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function normalizeAccountMode(value: unknown): AccountMode | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return ACCOUNT_MODE_MAP[value.trim().toLowerCase()];
}

function normalizePayoutStatus(value: unknown): PayoutRecord["status"] | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "ready" || normalized === "requested" || normalized === "received") {
    return normalized;
  }

  return undefined;
}

function nextNumericId(prefix: string, ids: string[]): string {
  const max = ids.reduce((highest, id) => {
    const match = new RegExp("^" + prefix + "(\\d+)$").exec(id);
    if (!match) {
      return highest;
    }

    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? Math.max(highest, parsed) : highest;
  }, 0);

  return prefix + String(max + 1);
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function validationFailure(
  message: string,
  fieldErrors: Record<string, string>
): MutationFailure {
  return {
    ok: false,
    kind: "validation",
    message,
    fieldErrors,
    stateUnchanged: true,
  };
}

function notFoundFailure(message: string): MutationFailure {
  return {
    ok: false,
    kind: "not_found",
    message,
    stateUnchanged: true,
  };
}

function persistenceFailure(message: string): MutationFailure {
  return {
    ok: false,
    kind: "persistence",
    message,
    stateUnchanged: true,
  };
}

function validateAccountPatch(rawPatch: AccountPatch): {
  ok: boolean;
  fieldErrors: Record<string, string>;
  patch: AccountPatch;
  hasChanges: boolean;
} {
  const fieldErrors: Record<string, string> = {};
  const patch: AccountPatch = {};
  let hasChanges = false;

  if (hasOwn(rawPatch, "mode")) {
    hasChanges = true;
    const normalizedMode = normalizeAccountMode(rawPatch.mode);
    if (!normalizedMode) {
      fieldErrors.mode =
        "Mode must be one of: attack, preservation, recovery, payout protection, cooldown, stopped, breached.";
    } else {
      patch.mode = normalizedMode;
    }
  }

  if (hasOwn(rawPatch, "status")) {
    hasChanges = true;
    if (
      typeof rawPatch.status !== "string" ||
      !ACCOUNT_STATUS_VALUES.includes(rawPatch.status as AccountStatus)
    ) {
      fieldErrors.status = "Status must be tradable, restricted, or stopped.";
    } else {
      patch.status = rawPatch.status as AccountStatus;
    }
  }

  if (hasOwn(rawPatch, "lives")) {
    hasChanges = true;
    const parsedLives = parseFiniteNumber(rawPatch.lives);
    if (parsedLives == null || parsedLives < 0 || parsedLives > 99) {
      fieldErrors.lives = "Lives must be a finite number between 0 and 99.";
    } else {
      patch.lives = Math.floor(parsedLives);
    }
  }

  if (hasOwn(rawPatch, "payoutReady")) {
    hasChanges = true;
    if (typeof rawPatch.payoutReady !== "boolean") {
      fieldErrors.payoutReady = "Payout readiness must be true or false.";
    } else {
      patch.payoutReady = rawPatch.payoutReady;
    }
  }

  if (hasOwn(rawPatch, "note")) {
    hasChanges = true;
    if (typeof rawPatch.note !== "string") {
      fieldErrors.note = "Note must be a string.";
    } else {
      const note = trimText(rawPatch.note);
      if (note.length > 500) {
        fieldErrors.note = "Note must be 500 characters or fewer.";
      } else {
        patch.note = note;
      }
    }
  }

  return {
    ok: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    patch,
    hasChanges,
  };
}

function validatePayoutPatch(rawPatch: PayoutPatch): {
  ok: boolean;
  fieldErrors: Record<string, string>;
  patch: PayoutPatch;
  hasChanges: boolean;
} {
  const fieldErrors: Record<string, string> = {};
  const patch: PayoutPatch = {};
  let hasChanges = false;

  if (hasOwn(rawPatch, "status")) {
    hasChanges = true;
    const normalizedStatus = normalizePayoutStatus(rawPatch.status);
    if (!normalizedStatus) {
      fieldErrors.status = "Payout status must be ready, requested, or received.";
    } else {
      patch.status = normalizedStatus;
    }
  }

  if (hasOwn(rawPatch, "note")) {
    hasChanges = true;
    if (typeof rawPatch.note !== "string") {
      fieldErrors.note = "Note must be a string.";
    } else {
      const note = trimText(rawPatch.note);
      if (note.length > 500) {
        fieldErrors.note = "Note must be 500 characters or fewer.";
      } else {
        patch.note = note;
      }
    }
  }

  if (hasOwn(rawPatch, "amount")) {
    hasChanges = true;
    const parsedAmount = parseFiniteNumber(rawPatch.amount);
    if (parsedAmount == null || parsedAmount < 0 || parsedAmount > 100000000) {
      fieldErrors.amount = "Amount must be a finite non-negative number.";
    } else {
      patch.amount = Number(parsedAmount.toFixed(2));
    }
  }

  return {
    ok: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    patch,
    hasChanges,
  };
}

function validateJournalNote(value: unknown): {
  ok: boolean;
  fieldErrors: Record<string, string>;
  note?: string;
  hasNote: boolean;
} {
  const fieldErrors: Record<string, string> = {};

  if (value == null) {
    return {
      ok: true,
      fieldErrors,
      note: undefined,
      hasNote: false,
    };
  }

  if (typeof value !== "string") {
    fieldErrors.journalNote = "Journal note must be a string.";
    return {
      ok: false,
      fieldErrors,
      note: undefined,
      hasNote: false,
    };
  }

  const note = trimText(value);
  if (note.length === 0) {
    return {
      ok: true,
      fieldErrors,
      note: undefined,
      hasNote: false,
    };
  }

  if (note.length > 1000) {
    fieldErrors.journalNote = "Journal note must be 1000 characters or fewer.";
    return {
      ok: false,
      fieldErrors,
      note: undefined,
      hasNote: false,
    };
  }

  return {
    ok: true,
    fieldErrors,
    note,
    hasNote: true,
  };
}

export function getWorkspaceData(): WorkspaceData {
  const raw = readWorkspaceText();
  return normalizeWorkspace(JSON.parse(raw));
}

export function getAccounts(): AccountRecord[] {
  return getWorkspaceData().accounts;
}

export function getAccountById(id: string): AccountRecord | undefined {
  return getWorkspaceData().accounts.find((account) => account.id === id);
}

export function getJournalEntries(): JournalEntry[] {
  return getWorkspaceData().journal;
}

export function getAlerts(): AlertRecord[] {
  return getWorkspaceData().alerts;
}

export function getPayouts(): PayoutRecord[] {
  return getWorkspaceData().payouts;
}

export function getCalendarItems(): CalendarItem[] {
  return getWorkspaceData().calendar;
}

export function getBackupEvents(): BackupEvent[] {
  return getWorkspaceData().backups;
}

export function getDashboardStats() {
  const accounts = getAccounts();

  return {
    tradable: accounts.filter((account) => account.status === "tradable").length,
    restricted: accounts.filter((account) => account.status === "restricted").length,
    stopped: accounts.filter((account) => account.status === "stopped").length,
    payoutReady: accounts.filter((account) => account.payoutReady).length,
  };
}

export function updateAccountAndMaybeAppendJournalById(
  id: string,
  rawPatch: AccountPatch,
  journalNote?: unknown
): MutationResult<{ account: AccountRecord; journalEntry?: JournalEntry }> {
  const data = getWorkspaceData();
  const index = data.accounts.findIndex((account) => account.id === id);

  if (index < 0) {
    return notFoundFailure("Account not found.");
  }

  const patchResult = validateAccountPatch(rawPatch);
  const journalResult = validateJournalNote(journalNote);
  const fieldErrors = {
    ...patchResult.fieldErrors,
    ...journalResult.fieldErrors,
  };

  if (!patchResult.ok || !journalResult.ok) {
    return validationFailure("Account update validation failed.", fieldErrors);
  }

  if (!patchResult.hasChanges && !journalResult.hasNote) {
    return validationFailure("No valid account changes were provided.", {
      request: "Provide at least one account field or a non-empty journal note.",
    });
  }

  const current = data.accounts[index];
  const next: AccountRecord = {
    ...current,
    ...patchResult.patch,
  };

  data.accounts[index] = next;

  let journalEntry: JournalEntry | undefined;
  if (journalResult.hasNote && journalResult.note) {
    journalEntry = {
      id: nextNumericId(
        "J",
        data.journal.map((entry) => entry.id)
      ),
      accountId: id,
      title: "Quick account note",
      outcome: "note",
      session: "Operator",
      summary: journalResult.note,
      createdAt: todayDateString(),
    };

    data.journal.unshift(journalEntry);
  }

  try {
    const persisted = persistWorkspace(
      data,
      journalEntry ? `account_update_with_journal:${id}` : `account_update:${id}`
    );

    return {
      ok: true,
      value: {
        account: next,
        journalEntry,
      },
      backupPath: persisted.backupPath,
    };
  } catch (error) {
    return persistenceFailure(
      error instanceof Error ? error.message : "Account update could not be persisted."
    );
  }
}

export function updatePayoutRecordById(
  id: string,
  rawPatch: PayoutPatch
): MutationResult<PayoutRecord> {
  const data = getWorkspaceData();
  const index = data.payouts.findIndex((payout) => payout.id === id);

  if (index < 0) {
    return notFoundFailure("Payout not found.");
  }

  const patchResult = validatePayoutPatch(rawPatch);

  if (!patchResult.ok) {
    return validationFailure("Payout update validation failed.", patchResult.fieldErrors);
  }

  if (!patchResult.hasChanges) {
    return validationFailure("No valid payout changes were provided.", {
      request: "Provide at least one payout field to update.",
    });
  }

  const current = data.payouts[index];
  const next: PayoutRecord = {
    ...current,
    ...patchResult.patch,
  };

  data.payouts[index] = next;

  try {
    const persisted = persistWorkspace(data, `payout_update:${id}`);
    return {
      ok: true,
      value: next,
      backupPath: persisted.backupPath,
    };
  } catch (error) {
    return persistenceFailure(
      error instanceof Error ? error.message : "Payout update could not be persisted."
    );
  }
}

export function updateAccountById(id: string, patch: AccountPatch): AccountRecord | null {
  const result = updateAccountAndMaybeAppendJournalById(id, patch);
  return result.ok ? result.value.account : null;
}

export function updatePayoutById(id: string, patch: PayoutPatch): PayoutRecord | null {
  const result = updatePayoutRecordById(id, patch);
  return result.ok ? result.value : null;
}

export function appendJournalEntry(entry: Omit<JournalEntry, "id">): JournalEntry {
  const data = getWorkspaceData();

  const next: JournalEntry = {
    ...entry,
    id: nextNumericId(
      "J",
      data.journal.map((item) => item.id)
    ),
    title: trimText(entry.title),
    session: trimText(entry.session),
    summary: trimText(entry.summary),
    createdAt: entry.createdAt || todayDateString(),
  };

  data.journal.unshift(next);
  persistWorkspace(data, `journal_append:${next.accountId}`);

  return next;
}
