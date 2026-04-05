import { and, desc, eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import * as schema from '../schema';
import { ruleProfiles, ruleProfileVersions } from '../schema';

export type VeradminDb = BetterSQLite3Database<typeof schema>;

export function makeRuleProfilesRepository(db: VeradminDb) {
  const listFamilies = () => db.select().from(ruleProfiles).orderBy(ruleProfiles.name).all();

  const getFamilyById = (ruleProfileId: string) =>
    db.select().from(ruleProfiles).where(eq(ruleProfiles.id, ruleProfileId)).get() ?? null;

  const listVersionsForFamily = (ruleProfileId: string) =>
    db
      .select()
      .from(ruleProfileVersions)
      .where(eq(ruleProfileVersions.ruleProfileId, ruleProfileId))
      .orderBy(desc(ruleProfileVersions.versionNumber))
      .all();

  const getVersionById = (versionId: string) =>
    db.select().from(ruleProfileVersions).where(eq(ruleProfileVersions.id, versionId)).get() ?? null;

  const getActiveVersionForFamily = (ruleProfileId: string) =>
    db
      .select()
      .from(ruleProfileVersions)
      .where(
        and(
          eq(ruleProfileVersions.ruleProfileId, ruleProfileId),
          eq(ruleProfileVersions.isActive, true),
        ),
      )
      .get() ?? null;

  return {
    listFamilies,
    getFamilyById,
    listVersionsForFamily,
    getVersionById,
    getActiveVersionForFamily,
  };
}
