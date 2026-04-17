import type { Database as BetterSqliteDatabase } from 'better-sqlite3';

import { openDb } from '../client';

const DEFAULT_STAGE = 'STAGE_1';
const DEFAULT_DRAWDOWN_TYPE = 'TRAILING';
const DEFAULT_STATUS = 'ACTIVE';
const DEFAULT_TP_TICKS = 1500;
const DEFAULT_SL_TICKS = 1500;

type RawAccountRow = {
  id: unknown;
  label: unknown;
  balance: unknown;
  high_water_mark: unknown;
  account_size: unknown;
  account_stage: unknown;
  drawdown_type: unknown;
  tp_ticks: unknown;
  sl_ticks: unknown;
  daily_limit_pct: unknown;
  max_limit_pct: unknown;
  target_pct: unknown;
  status: unknown;
};

export type AccountRepositoryRecord = {
  id: string;
  label: string;
  balance: number;
  highWaterMark: number;
  accountSize: number;
  stage: string;
  drawdownType: string;
  tpTicks: number;
  slTicks: number;
  dailyLimitPct: number | null;
  maxLimitPct: number | null;
  targetPct: number | null;
  status: string;
};

export type AccountsRepository = {
  listAllAccounts(): AccountRepositoryRecord[];
  listAccountsForFleetStats(): AccountRepositoryRecord[];
  listAccountsForFleetAlerts(): AccountRepositoryRecord[];
  listAccountsForAccountsList(): AccountRepositoryRecord[];
  getAccountById(accountId: string): AccountRepositoryRecord | null;
};

type AccountsRepositoryOptions = {
  createConnection?: () => BetterSqliteDatabase;
  closeConnection?: boolean;
};

function toStringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function toNumberValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toNullableNumberValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeAccountRow(row: RawAccountRow): AccountRepositoryRecord {
  return {
    id: toStringValue(row.id),
    label: toStringValue(row.label),
    balance: toNumberValue(row.balance, 0),
    highWaterMark: toNumberValue(row.high_water_mark, 0),
    accountSize: toNumberValue(row.account_size, 0),
    stage: toStringValue(row.account_stage, DEFAULT_STAGE) || DEFAULT_STAGE,
    drawdownType:
      toStringValue(row.drawdown_type, DEFAULT_DRAWDOWN_TYPE) || DEFAULT_DRAWDOWN_TYPE,
    tpTicks: toNumberValue(row.tp_ticks, DEFAULT_TP_TICKS),
    slTicks: toNumberValue(row.sl_ticks, DEFAULT_SL_TICKS),
    dailyLimitPct: toNullableNumberValue(row.daily_limit_pct),
    maxLimitPct: toNullableNumberValue(row.max_limit_pct),
    targetPct: toNullableNumberValue(row.target_pct),
    status: toStringValue(row.status, DEFAULT_STATUS) || DEFAULT_STATUS,
  };
}

function safelyCloseConnection(
  db: BetterSqliteDatabase,
  closeConnection: boolean,
): void {
  if (closeConnection) {
    db.close();
  }
}

function readMany(
  createConnection: () => BetterSqliteDatabase,
  closeConnection: boolean,
  sql: string,
  params: unknown[] = [],
): AccountRepositoryRecord[] {
  const db = createConnection();

  try {
    const statement = db.prepare(sql);
    const rows = statement.all(...params) as RawAccountRow[];
    return rows.map(normalizeAccountRow);
  } finally {
    safelyCloseConnection(db, closeConnection);
  }
}

function readOne(
  createConnection: () => BetterSqliteDatabase,
  closeConnection: boolean,
  sql: string,
  params: unknown[] = [],
): AccountRepositoryRecord | null {
  const db = createConnection();

  try {
    const statement = db.prepare(sql);
    const row = statement.get(...params) as RawAccountRow | undefined;
    return row ? normalizeAccountRow(row) : null;
  } finally {
    safelyCloseConnection(db, closeConnection);
  }
}

export function createAccountsRepository(
  options: AccountsRepositoryOptions = {},
): AccountsRepository {
  const createConnection = options.createConnection ?? (() => openDb());
  const closeConnection = options.closeConnection ?? true;

  return {
    listAllAccounts(): AccountRepositoryRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            label,
            balance,
            high_water_mark,
            account_size,
            account_stage,
            drawdown_type,
            tp_ticks,
            sl_ticks,
            daily_limit_pct,
            max_limit_pct,
            target_pct,
            status
          FROM accounts
          ORDER BY label ASC
        `,
      );
    },

    listAccountsForFleetStats(): AccountRepositoryRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            label,
            balance,
            high_water_mark,
            account_size,
            account_stage,
            drawdown_type,
            tp_ticks,
            sl_ticks,
            daily_limit_pct,
            max_limit_pct,
            target_pct,
            status
          FROM accounts
          ORDER BY label ASC
        `,
      );
    },

    listAccountsForFleetAlerts(): AccountRepositoryRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            label,
            balance,
            high_water_mark,
            account_size,
            account_stage,
            drawdown_type,
            tp_ticks,
            sl_ticks,
            daily_limit_pct,
            max_limit_pct,
            target_pct,
            status
          FROM accounts
          ORDER BY label ASC
        `,
      );
    },

    listAccountsForAccountsList(): AccountRepositoryRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            label,
            balance,
            high_water_mark,
            account_size,
            account_stage,
            drawdown_type,
            tp_ticks,
            sl_ticks,
            daily_limit_pct,
            max_limit_pct,
            target_pct,
            status
          FROM accounts
          ORDER BY label ASC
        `,
      );
    },

    getAccountById(accountId: string): AccountRepositoryRecord | null {
      return readOne(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            label,
            balance,
            high_water_mark,
            account_size,
            account_stage,
            drawdown_type,
            tp_ticks,
            sl_ticks,
            daily_limit_pct,
            max_limit_pct,
            target_pct,
            status
          FROM accounts
          WHERE id = ?
          LIMIT 1
        `,
        [accountId],
      );
    },
  };
}

export const accountsRepository = createAccountsRepository();