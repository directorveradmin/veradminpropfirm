import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import type { FixturePack } from '../../db/fixtures/types';
import * as schema from '../../db/schema';
import { fixtureManifestSchema } from '../../src/lib/validation/fixtures';

export type VeradminDb = BetterSQLite3Database<typeof schema>;

export function clearAllTables(db: VeradminDb) {
  db.delete(schema.accountTagLinks).run();
  db.delete(schema.auditEvents).run();
  db.delete(schema.accountNotes).run();
  db.delete(schema.alerts).run();
  db.delete(schema.calendarRotations).run();
  db.delete(schema.newsEvents).run();
  db.delete(schema.refundTasks).run();
  db.delete(schema.payoutRequests).run();
  db.delete(schema.balanceSnapshots).run();
  db.delete(schema.tradeLogs).run();
  db.delete(schema.accountDayState).run();
  db.delete(schema.accountRuleProfileAssignments).run();
  db.delete(schema.accounts).run();
  db.delete(schema.tags).run();
  db.delete(schema.fleetSettings).run();
  db.delete(schema.ruleProfileVersions).run();
  db.delete(schema.ruleProfiles).run();
  db.delete(schema.firms).run();
  db.delete(schema.importsExportsLog).run();
}

export function seedFixture(db: VeradminDb, fixture: FixturePack) {
  fixtureManifestSchema.parse(fixture.manifest);

  clearAllTables(db);

  if (fixture.firms.length > 0) db.insert(schema.firms).values(fixture.firms).run();
  if (fixture.ruleProfiles.length > 0) db.insert(schema.ruleProfiles).values(fixture.ruleProfiles).run();
  if (fixture.ruleProfileVersions.length > 0) {
    db.insert(schema.ruleProfileVersions).values(fixture.ruleProfileVersions).run();
  }
  if (fixture.fleetSettings.length > 0) db.insert(schema.fleetSettings).values(fixture.fleetSettings).run();
  if (fixture.tags.length > 0) db.insert(schema.tags).values(fixture.tags).run();
  if (fixture.accounts.length > 0) db.insert(schema.accounts).values(fixture.accounts).run();
  if (fixture.accountRuleProfileAssignments.length > 0) {
    db.insert(schema.accountRuleProfileAssignments).values(fixture.accountRuleProfileAssignments).run();
  }
  if (fixture.accountDayState.length > 0) db.insert(schema.accountDayState).values(fixture.accountDayState).run();
  if (fixture.tradeLogs.length > 0) db.insert(schema.tradeLogs).values(fixture.tradeLogs).run();
  if (fixture.balanceSnapshots.length > 0) {
    db.insert(schema.balanceSnapshots).values(fixture.balanceSnapshots).run();
  }
  if (fixture.payoutRequests.length > 0) db.insert(schema.payoutRequests).values(fixture.payoutRequests).run();
  if (fixture.refundTasks.length > 0) db.insert(schema.refundTasks).values(fixture.refundTasks).run();
  if (fixture.newsEvents.length > 0) db.insert(schema.newsEvents).values(fixture.newsEvents).run();
  if (fixture.calendarRotations.length > 0) {
    db.insert(schema.calendarRotations).values(fixture.calendarRotations).run();
  }
  if (fixture.alerts.length > 0) db.insert(schema.alerts).values(fixture.alerts).run();
  if (fixture.accountNotes.length > 0) db.insert(schema.accountNotes).values(fixture.accountNotes).run();
  if (fixture.auditEvents.length > 0) db.insert(schema.auditEvents).values(fixture.auditEvents).run();
  if (fixture.accountTagLinks.length > 0) {
    db.insert(schema.accountTagLinks).values(fixture.accountTagLinks).run();
  }
  if (fixture.importsExportsLog.length > 0) {
    db.insert(schema.importsExportsLog).values(fixture.importsExportsLog).run();
  }
}
