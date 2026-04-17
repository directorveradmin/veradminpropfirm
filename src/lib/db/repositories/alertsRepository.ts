import type { Database as BetterSqliteDatabase } from 'better-sqlite3';

import { openDb } from '../client';

export type AlertRecord = {
  id: string;
  accountId: string | null;
  severity: string;
  title: string;
  message: string;
  source: string | null;
  code: string | null;
  acknowledged: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AlertsRepository = {
  listAllAlerts(): AlertRecord[];
  listUnacknowledgedAlerts(): AlertRecord[];
  listAlertsForAccount(accountId: string): AlertRecord[];
};

type AlertsRepositoryOptions = {
  createConnection?: () => BetterSqliteDatabase;
  closeConnection?: boolean;
};

type RawAlertRow = {
  id: unknown;
  account_id: unknown;
  severity: unknown;
  title: unknown;
  message: unknown;
  source: unknown;
  code: unknown;
  acknowledged: unknown;
  created_at: unknown;
  updated_at: unknown;
};

function tableExists(db: BetterSqliteDatabase, tableName: string): boolean {
  const row = db
    .prepare(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = ?
        LIMIT 1
      `,
    )
    .get(tableName);

  return Boolean(row);
}

function toStringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function toNullableStringValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return String(value);
}

function toBooleanValue(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }

  return false;
}

function normalizeAlertRow(row: RawAlertRow): AlertRecord {
  return {
    id: toStringValue(row.id),
    accountId: toNullableStringValue(row.account_id),
    severity: toStringValue(row.severity, 'info'),
    title: toStringValue(row.title),
    message: toStringValue(row.message),
    source: toNullableStringValue(row.source),
    code: toNullableStringValue(row.code),
    acknowledged: toBooleanValue(row.acknowledged),
    createdAt: toNullableStringValue(row.created_at),
    updatedAt: toNullableStringValue(row.updated_at),
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
): AlertRecord[] {
  const db = createConnection();

  try {
    if (!tableExists(db, 'alerts')) {
      return [];
    }

    const statement = db.prepare(sql);
    const rows = statement.all(...params) as RawAlertRow[];
    return rows.map(normalizeAlertRow);
  } finally {
    safelyCloseConnection(db, closeConnection);
  }
}

export function createAlertsRepository(
  options: AlertsRepositoryOptions = {},
): AlertsRepository {
  const createConnection = options.createConnection ?? (() => openDb());
  const closeConnection = options.closeConnection ?? true;

  return {
    listAllAlerts(): AlertRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            account_id,
            severity,
            title,
            message,
            source,
            code,
            acknowledged,
            created_at,
            updated_at
          FROM alerts
          ORDER BY created_at DESC, id DESC
        `,
      );
    },

    listUnacknowledgedAlerts(): AlertRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            account_id,
            severity,
            title,
            message,
            source,
            code,
            acknowledged,
            created_at,
            updated_at
          FROM alerts
          WHERE COALESCE(acknowledged, 0) = 0
          ORDER BY created_at DESC, id DESC
        `,
      );
    },

    listAlertsForAccount(accountId: string): AlertRecord[] {
      return readMany(
        createConnection,
        closeConnection,
        `
          SELECT
            id,
            account_id,
            severity,
            title,
            message,
            source,
            code,
            acknowledged,
            created_at,
            updated_at
          FROM alerts
          WHERE account_id = ?
          ORDER BY created_at DESC, id DESC
        `,
        [accountId],
      );
    },
  };
}

export const alertsRepository = createAlertsRepository();