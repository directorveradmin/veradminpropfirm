import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

import { accounts, tags } from './accounts';
import {
  alertSeverityValues,
  alertStatusValues,
  auditActorTypeValues,
  booleanColumn,
  createdAtColumn,
  importExportOperationTypeValues,
  importExportStatusValues,
  payoutStatusValues,
  refundTaskStatusValues,
  rotationStateValues,
  tradeDirectionValues,
  tradeResultTypeValues,
  tradeSessionValues,
  updatedAtColumn,
} from './shared';

export const tradeLogs = sqliteTable(
  'trade_logs',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    tradingTimestamp: text('trading_timestamp').notNull(),
    tradeDate: text('trade_date').notNull(),
    session: text('session', { enum: tradeSessionValues }).notNull(),
    direction: text('direction', { enum: tradeDirectionValues }).notNull(),
    resultType: text('result_type', { enum: tradeResultTypeValues }).notNull(),
    points: real('points'),
    pnlAmountCents: integer('pnl_amount_cents').notNull(),
    riskUnitFraction: real('risk_unit_fraction'),
    wasRuleFollowing: booleanColumn('was_rule_following', true),
    wasNearNews: booleanColumn('was_near_news', false),
    setupTagId: text('setup_tag_id').references(() => tags.id),
    screenshotPath: text('screenshot_path'),
    note: text('note'),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    tradeLogsAccountTimestampIdx: index('trade_logs_account_timestamp_idx').on(
      table.accountId,
      table.tradingTimestamp,
    ),
  }),
);

export const balanceSnapshots = sqliteTable(
  'balance_snapshots',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    snapshotTimestamp: text('snapshot_timestamp').notNull(),
    currentBalanceCents: integer('current_balance_cents').notNull(),
    peakBalanceCents: integer('peak_balance_cents').notNull(),
    dailyStartBalanceCents: integer('daily_start_balance_cents'),
    snapshotReason: text('snapshot_reason').notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    balanceSnapshotsAccountTimestampIdx: index('balance_snapshots_account_timestamp_idx').on(
      table.accountId,
      table.snapshotTimestamp,
    ),
  }),
);

export const payoutRequests = sqliteTable(
  'payout_requests',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    requestedAt: text('requested_at').notNull(),
    expectedArrivalAt: text('expected_arrival_at'),
    receivedAt: text('received_at'),
    amountRequestedCents: integer('amount_requested_cents').notNull(),
    amountReceivedCents: integer('amount_received_cents'),
    status: text('status', { enum: payoutStatusValues }).notNull(),
    notes: text('notes'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    payoutRequestsAccountRequestedIdx: index('payout_requests_account_requested_idx').on(
      table.accountId,
      table.requestedAt,
    ),
  }),
);

export const refundTasks = sqliteTable(
  'refund_tasks',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    triggeredAt: text('triggered_at').notNull(),
    status: text('status', { enum: refundTaskStatusValues }).notNull(),
    resolutionNote: text('resolution_note'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    refundTasksAccountTriggeredIdx: index('refund_tasks_account_triggered_idx').on(
      table.accountId,
      table.triggeredAt,
    ),
  }),
);

export const newsEvents = sqliteTable(
  'news_events',
  {
    id: text('id').primaryKey(),
    eventTimestamp: text('event_timestamp').notNull(),
    title: text('title').notNull(),
    impactLevel: text('impact_level').notNull(),
    assetScope: text('asset_scope').notNull(),
    lockMinutesBefore: integer('lock_minutes_before').notNull(),
    lockMinutesAfter: integer('lock_minutes_after').notNull(),
    notes: text('notes'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    newsEventsTimestampIdx: index('news_events_timestamp_idx').on(table.eventTimestamp),
  }),
);

export const calendarRotations = sqliteTable(
  'calendar_rotations',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull().references(() => accounts.id),
    rotationType: text('rotation_type').notNull(),
    windowStart: text('window_start').notNull(),
    windowEnd: text('window_end').notNull(),
    state: text('state', { enum: rotationStateValues }).notNull(),
    reason: text('reason'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    calendarRotationsAccountStartIdx: index('calendar_rotations_account_start_idx').on(
      table.accountId,
      table.windowStart,
    ),
  }),
);

export const alerts = sqliteTable(
  'alerts',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').references(() => accounts.id),
    type: text('type').notNull(),
    severity: text('severity', { enum: alertSeverityValues }).notNull(),
    status: text('status', { enum: alertStatusValues }).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    source: text('source').notNull(),
    sourceRefId: text('source_ref_id'),
    createdAt: createdAtColumn(),
    resolvedAt: text('resolved_at'),
  },
  (table) => ({
    alertsStatusSeverityIdx: index('alerts_status_severity_idx').on(table.status, table.severity),
    alertsAccountIdx: index('alerts_account_idx').on(table.accountId),
  }),
);

export const auditEvents = sqliteTable(
  'audit_events',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').references(() => accounts.id),
    eventType: text('event_type').notNull(),
    eventTimestamp: text('event_timestamp').notNull(),
    actorType: text('actor_type', { enum: auditActorTypeValues }).notNull(),
    summary: text('summary').notNull(),
    payloadJson: text('payload_json'),
    ruleProfileVersionId: text('rule_profile_version_id'),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    auditEventsAccountTimestampIdx: index('audit_events_account_timestamp_idx').on(
      table.accountId,
      table.eventTimestamp,
    ),
  }),
);

export const importsExportsLog = sqliteTable(
  'imports_exports_log',
  {
    id: text('id').primaryKey(),
    operationType: text('operation_type', { enum: importExportOperationTypeValues }).notNull(),
    filePath: text('file_path'),
    status: text('status', { enum: importExportStatusValues }).notNull(),
    summary: text('summary'),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    importsExportsLogTypeIdx: index('imports_exports_log_type_idx').on(table.operationType),
  }),
);
