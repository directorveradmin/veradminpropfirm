import fs from "node:fs";
import path from "node:path";

export type AccountStatus = "tradable" | "restricted" | "stopped";

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

const WORKSPACE_PATH = path.join(process.cwd(), "data", "workspace.json");

function writeJson(data: WorkspaceData) {
  fs.writeFileSync(WORKSPACE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getWorkspaceData(): WorkspaceData {
  const raw = fs.readFileSync(WORKSPACE_PATH, "utf8");
  return JSON.parse(raw) as WorkspaceData;
}

export function updateAccountById(
  id: string,
  patch: Partial<Pick<AccountRecord, "mode" | "status" | "lives" | "payoutReady" | "note">>
): AccountRecord | null {
  const data = getWorkspaceData();
  const index = data.accounts.findIndex((account) => account.id === id);
  if (index < 0) {
    return null;
  }

  const current = data.accounts[index];
  const next: AccountRecord = {
    ...current,
    ...patch,
    lives:
      patch.lives != null
        ? Math.max(0, Math.floor(Number(patch.lives)))
        : current.lives,
  };

  data.accounts[index] = next;
  writeJson(data);
  return next;
}

export function updatePayoutById(
  id: string,
  patch: Partial<Pick<PayoutRecord, "status" | "note" | "amount">>
): PayoutRecord | null {
  const data = getWorkspaceData();
  const index = data.payouts.findIndex((payout) => payout.id === id);
  if (index < 0) {
    return null;
  }

  const current = data.payouts[index];
  const next: PayoutRecord = {
    ...current,
    ...patch,
  };

  data.payouts[index] = next;
  writeJson(data);
  return next;
}

export function appendJournalEntry(entry: Omit<JournalEntry, "id">): JournalEntry {
  const data = getWorkspaceData();
  const next: JournalEntry = {
    ...entry,
    id: "J" + (data.journal.length + 1),
  };
  data.journal.unshift(next);
  writeJson(data);
  return next;
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