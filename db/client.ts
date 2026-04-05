import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

const DEFAULT_DB_PATH = '.veradmin-dev/veradmin.dev.sqlite';

export function resolveDbPath(): string {
  const configured = process.env.VERADMIN_DB_PATH ?? DEFAULT_DB_PATH;
  return path.resolve(process.cwd(), configured);
}

export function ensureDbDirectory(dbPath = resolveDbPath()): string {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return dbPath;
}

export function openSqlite(dbPath = resolveDbPath()): Database.Database {
  const resolved = ensureDbDirectory(dbPath);
  const sqlite = new Database(resolved);

  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  return sqlite;
}

export function createDb(dbPath = resolveDbPath()) {
  const sqlite = openSqlite(dbPath);
  const db = drizzle(sqlite, { schema });

  return {
    sqlite,
    db,
    dbPath,
  };
}
