import { defineConfig } from 'drizzle-kit';

const dbPath = process.env.VERADMIN_DB_PATH ?? '.veradmin-dev/veradmin.dev.sqlite';

export default defineConfig({
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbPath,
  },
  verbose: true,
  strict: true,
});
