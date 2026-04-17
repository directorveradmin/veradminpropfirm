import fs from 'fs';
import type { Database as BetterSqliteDatabase } from 'better-sqlite3';

import {
  resolveDbFilePath,
  resolveDbPaths,
  type ResolveDbPathsOptions,
} from './paths';

const BetterSqlite3 = require('better-sqlite3') as typeof import('better-sqlite3');

export type DbClientOptions = ResolveDbPathsOptions & {
  readonly?: boolean;
  fileMustExist?: boolean;
};

export type DbConnectionFactory = (
  options?: DbClientOptions,
) => BetterSqliteDatabase;

function ensureDataDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

export function createDbClient(
  options: DbClientOptions = {},
): BetterSqliteDatabase {
  const paths = resolveDbPaths(options);

  ensureDataDirectoryExists(paths.dataDirectory);

  return new BetterSqlite3(resolveDbFilePath(options), {
    readonly: options.readonly ?? false,
    fileMustExist: options.fileMustExist ?? false,
  });
}

export function withDb<T>(
  work: (db: BetterSqliteDatabase) => T,
  options: DbClientOptions = {},
): T {
  const db = createDbClient(options);

  try {
    return work(db);
  } finally {
    db.close();
  }
}

export const openDb: DbConnectionFactory = (
  options: DbClientOptions = {},
) => createDbClient(options);