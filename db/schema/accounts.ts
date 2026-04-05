import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

import { firms } from './firms';
import { ruleProfiles, ruleProfileVersions } from './ruleProfiles';
import {
  accountStatusValues,
  assignedByValues,
  booleanColumn,
  createdAtColumn,
  lifecycleStageValues,
  noteTypeValues,
  tagScopeValues,
  updatedAtColumn,
} from './shared';

export const accounts = sqliteTable(
  'accounts',
  {
    id: text('id').primaryKey(),
    firmId: text('firm_id').notNull().references(() => firms.id),
    currentRuleProfileId: text('current_rule_profile_id')
      .notNull()
      .references(() => ruleProfiles.id),
    currentRuleProfileVersionId: text('current_rule_profile_version_id')
      .notNull()
      .references(() => ruleProfileVersions.id),
    accountLabel: text('account_label').notNull(),
    externalAccountRef: text('external_account_ref'),
    lifecycleStage: text('lifecycle_stage', { enum: lifecycleStageValues }).notNull(),
    accountStatus: text('account_status', { enum: accountStatusValues }).notNull().default('active'),
    startingBalanceCents: integer('starting_balance_cents').notNull(),
    currentBalanceCents: integer('current_balance_cents').notNull(),
    peakBalanceCents: integer('peak_balance_cents').notNull(),
    daysTradedReference: integer('days_traded_reference'),
    lastPayoutDate: text('last_payout_date'),
    feeRefunded: booleanColumn('fee_refunded', false),
    manuallyPaused: booleanColumn('manually_paused', false),
    archivedAt: text('archived_at'),
    breachedAt: text('breached_at'),
    notesSummary: text('notes_summary'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    accountsFirmIdx: index('accounts_firm_idx').on(table.firmId),
    accountsProfileIdx: index('accounts_profile_idx').on(table.currentRuleProfileId),
    accountsProfileVersionIdx: index('accounts_profile_version_idx').on(table.currentRuleProfileVersionId),
    accountsLabelUidx: uniqueIndex('accounts_label_uidx').on(table.accountLabel),
    accountsStartingBalanceCheck: check(
      'accounts_starting_balance_positive_chk',
      sql`${table.startingBalanceCents} > 0`,
    ),
    accountsCurrentBalanceCheck: check(
      'accounts_current_balance_nonnegative_chk',
      sql`${table.currentBalanceCents} >= 0`,
    ),
    accountsPeakBalanceCheck: check(
      'accounts_peak_balance_nonnegative_chk',
      sql`${table.peakBalanceCents} >= 0`,
    ),
  }),
);

export const accountRuleProfileAssignments = sqliteTable(
  'account_rule_profile_assignments',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    ruleProfileId: text('rule_profile_id').notNull().references(() => ruleProfiles.id),
    ruleProfileVersionId: text('rule_profile_version_id')
      .notNull()
      .references(() => ruleProfileVersions.id),
    assignedAt: text('assigned_at').notNull(),
    endedAt: text('ended_at'),
    assignmentReason: text('assignment_reason').notNull(),
    assignedBy: text('assigned_by', { enum: assignedByValues }).notNull(),
    notes: text('notes'),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    accountAssignmentsAccountIdx: index('account_assignments_account_idx').on(table.accountId),
    accountAssignmentsVersionIdx: index('account_assignments_version_idx').on(table.ruleProfileVersionId),
  }),
);

export const accountDayState = sqliteTable(
  'account_day_state',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    tradingDate: text('trading_date').notNull(),
    dayStartBalanceCents: integer('day_start_balance_cents').notNull(),
    realizedPnlTodayCents: integer('realized_pnl_today_cents').notNull().default(0),
    resetCompletedAt: text('reset_completed_at'),
    notes: text('notes'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    accountDayStateAccountIdx: index('account_day_state_account_idx').on(table.accountId),
    accountDayStateUniqueTradingDate: uniqueIndex('account_day_state_account_date_uidx').on(
      table.accountId,
      table.tradingDate,
    ),
  }),
);

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    scope: text('scope', { enum: tagScopeValues }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    colorToken: text('color_token'),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    tagsScopeSlugUidx: uniqueIndex('tags_scope_slug_uidx').on(table.scope, table.slug),
  }),
);

export const accountTagLinks = sqliteTable(
  'account_tag_links',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    tagId: text('tag_id').notNull().references(() => tags.id),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    accountTagLinksAccountIdx: index('account_tag_links_account_idx').on(table.accountId),
    accountTagLinksUnique: uniqueIndex('account_tag_links_account_tag_uidx').on(
      table.accountId,
      table.tagId,
    ),
  }),
);

export const accountNotes = sqliteTable(
  'account_notes',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    noteType: text('note_type', { enum: noteTypeValues }).notNull().default('general'),
    body: text('body').notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    accountNotesAccountIdx: index('account_notes_account_idx').on(table.accountId),
  }),
);

export const fleetSettings = sqliteTable('fleet_settings', {
  id: text('id').primaryKey(),
  tradingDayBoundary: text('trading_day_boundary').notNull(),
  defaultNewsLockMinutesBefore: integer('default_news_lock_minutes_before').notNull(),
  defaultNewsLockMinutesAfter: integer('default_news_lock_minutes_after').notNull(),
  defaultFractionalRiskPolicy: text('default_fractional_risk_policy').notNull(),
  backupSchedule: text('backup_schedule'),
  themePreference: text('theme_preference'),
  safetyPreferencesJson: text('safety_preferences_json'),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});
