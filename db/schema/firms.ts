import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import {
  createdAtColumn,
  firmStatusValues,
  updatedAtColumn,
} from './shared';

export const firms = sqliteTable(
  'firms',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    status: text('status', { enum: firmStatusValues }).notNull().default('active'),
    notes: text('notes'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    firmsSlugUidx: uniqueIndex('firms_slug_uidx').on(table.slug),
    firmsNameIdx: index('firms_name_idx').on(table.name),
  }),
);
