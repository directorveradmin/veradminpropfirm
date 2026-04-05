import path from 'node:path';

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { createDb } from '../../db/client';

function main() {
  const { sqlite, db, dbPath } = createDb();

  try {
    const migrationsFolder = path.resolve(process.cwd(), 'db', 'migrations');

    console.log(`Applying migrations from ${migrationsFolder}`);
    console.log(`Using database at ${dbPath}`);

    migrate(db, { migrationsFolder });

    console.log('Migrations applied successfully.');
  } finally {
    sqlite.close();
  }
}

main();
