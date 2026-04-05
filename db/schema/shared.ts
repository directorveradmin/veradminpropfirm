import { sql } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';

export const currentTimestampSql = sql`CURRENT_TIMESTAMP`;

export function createdAtColumn(name = 'created_at') {
  return text(name).notNull().default(currentTimestampSql);
}

export function updatedAtColumn(name = 'updated_at') {
  return text(name).notNull().default(currentTimestampSql);
}

export function booleanColumn(name: string, defaultValue = false) {
  return integer(name, { mode: 'boolean' }).notNull().default(defaultValue);
}

export function jsonTextColumn(name: string) {
  return text(name).notNull();
}

export function nullableJsonTextColumn(name: string) {
  return text(name);
}

export const firmStatusValues = ['active', 'inactive', 'archived'] as const;
export const profileStatusValues = ['draft', 'active', 'retired'] as const;

export const lifecycleStageValues = [
  'draft',
  'evaluation_step1',
  'evaluation_step2',
  'funded_active',
  'funded_payout_active',
  'paused_inactive',
  'breached_failed',
  'retired_archived',
] as const;

export const accountStatusValues = [
  'active',
  'paused',
  'stopped',
  'breached',
  'archived',
] as const;

export const accountClassValues = [
  'evaluation_standard',
  'funded_standard',
  'funded_static',
  'funded_trailing',
] as const;

export const stageTypeValues = ['evaluation', 'funded', 'live', 'retired'] as const;
export const drawdownTypeValues = ['static', 'trailing'] as const;
export const moneyModeValues = ['absolute', 'percent'] as const;

export const tagScopeValues = ['trade', 'account', 'note', 'system'] as const;
export const noteTypeValues = ['general', 'risk', 'payout', 'admin', 'system'] as const;
export const assignedByValues = ['user', 'system', 'migration'] as const;

export const tradeSessionValues = ['asia', 'london', 'new_york', 'custom'] as const;
export const tradeDirectionValues = ['long', 'short', 'both', 'n_a'] as const;
export const tradeResultTypeValues = ['win', 'loss', 'custom'] as const;

export const payoutStatusValues = [
  'planned',
  'requested',
  'processing',
  'paid',
  'rejected',
  'cancelled',
] as const;

export const refundTaskStatusValues = [
  'pending',
  'contacted',
  'received',
  'dismissed',
] as const;

export const rotationStateValues = [
  'active',
  'inactive',
  'planned',
  'completed',
  'skipped',
] as const;

export const alertSeverityValues = ['critical', 'high', 'medium', 'low', 'resolved'] as const;
export const alertStatusValues = ['active', 'dismissed', 'resolved'] as const;
export const auditActorTypeValues = ['user', 'system', 'migration', 'sync'] as const;
export const importExportOperationTypeValues = ['import', 'export', 'backup', 'restore'] as const;
export const importExportStatusValues = ['started', 'completed', 'failed'] as const;
