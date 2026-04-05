import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

import { firms } from './firms';
import {
  accountClassValues,
  createdAtColumn,
  jsonTextColumn,
  nullableJsonTextColumn,
  profileStatusValues,
  stageTypeValues,
  updatedAtColumn,
} from './shared';

export const ruleProfiles = sqliteTable(
  'rule_profiles',
  {
    id: text('id').primaryKey(),
    firmId: text('firm_id').notNull().references(() => firms.id),
    profileKey: text('profile_key').notNull(),
    name: text('name').notNull(),
    stageType: text('stage_type', { enum: stageTypeValues }).notNull(),
    accountClass: text('account_class', { enum: accountClassValues }).notNull(),
    status: text('status', { enum: profileStatusValues }).notNull().default('draft'),
    description: text('description'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    ruleProfilesFirmIdx: index('rule_profiles_firm_idx').on(table.firmId),
    ruleProfilesProfileKeyUidx: uniqueIndex('rule_profiles_profile_key_uidx').on(
      table.firmId,
      table.profileKey,
    ),
  }),
);

export const ruleProfileVersions = sqliteTable(
  'rule_profile_versions',
  {
    id: text('id').primaryKey(),
    ruleProfileId: text('rule_profile_id').notNull().references(() => ruleProfiles.id),
    versionNumber: integer('version_number').notNull(),
    versionLabel: text('version_label').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
    effectiveFrom: text('effective_from').notNull(),
    effectiveTo: text('effective_to'),
    supersedesVersionId: text('supersedes_version_id'),
    firmRulesJson: jsonTextColumn('firm_rules_json'),
    operatorOverlayCompatibilityJson: jsonTextColumn('operator_overlay_compatibility_json'),
    normalizedSummaryJson: nullableJsonTextColumn('normalized_summary_json'),
    notes: text('notes'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    ruleProfileVersionsProfileIdx: index('rule_profile_versions_profile_idx').on(table.ruleProfileId),
    ruleProfileVersionsFamilyVersionUidx: uniqueIndex('rule_profile_versions_family_version_uidx').on(
      table.ruleProfileId,
      table.versionNumber,
    ),
    ruleProfileVersionsActiveIdx: index('rule_profile_versions_active_idx').on(
      table.ruleProfileId,
      table.isActive,
    ),
  }),
);
