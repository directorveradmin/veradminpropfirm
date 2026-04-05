import { and, desc, eq, isNull } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

import * as schema from '../schema';
import {
  accountDayState,
  accountRuleProfileAssignments,
  accounts,
  calendarRotations,
  newsEvents,
  payoutRequests,
} from '../schema';

export type VeradminDb = BetterSQLite3Database<typeof schema>;

export function makeAccountsRepository(db: VeradminDb) {
  const getById = (accountId: string) =>
    db.select().from(accounts).where(eq(accounts.id, accountId)).get() ?? null;

  const listAll = () => db.select().from(accounts).orderBy(accounts.accountLabel).all();

  const getOpenAssignment = (accountId: string) =>
    db
      .select()
      .from(accountRuleProfileAssignments)
      .where(
        and(
          eq(accountRuleProfileAssignments.accountId, accountId),
          isNull(accountRuleProfileAssignments.endedAt),
        ),
      )
      .get() ?? null;

  const getLatestDayState = (accountId: string) =>
    db
      .select()
      .from(accountDayState)
      .where(eq(accountDayState.accountId, accountId))
      .orderBy(desc(accountDayState.tradingDate))
      .get() ?? null;

  const getRecentPayouts = (accountId: string, limit = 10) =>
    db
      .select()
      .from(payoutRequests)
      .where(eq(payoutRequests.accountId, accountId))
      .orderBy(desc(payoutRequests.requestedAt))
      .limit(limit)
      .all();

  const getRecentRotations = (accountId: string, limit = 10) =>
    db
      .select()
      .from(calendarRotations)
      .where(eq(calendarRotations.accountId, accountId))
      .orderBy(desc(calendarRotations.windowStart))
      .limit(limit)
      .all();

  const getUpcomingNews = (limit = 10) =>
    db.select().from(newsEvents).orderBy(newsEvents.eventTimestamp).limit(limit).all();

  const getEvaluationInputBundle = (accountId: string) => {
    const account = getById(accountId);

    if (!account) {
      return null;
    }

    return {
      account,
      openAssignment: getOpenAssignment(accountId),
      latestDayState: getLatestDayState(accountId),
      recentPayouts: getRecentPayouts(accountId),
      recentRotations: getRecentRotations(accountId),
      upcomingNews: getUpcomingNews(),
    };
  };

  return {
    getById,
    listAll,
    getOpenAssignment,
    getLatestDayState,
    getRecentPayouts,
    getRecentRotations,
    getUpcomingNews,
    getEvaluationInputBundle,
  };
}
