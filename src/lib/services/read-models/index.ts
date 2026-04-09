import { desc, eq, inArray } from 'drizzle-orm';

import { createDb } from '../../../../db/client';
import * as schema from '../../../../db/schema';
import type {
    AccountDetailScreenListVM,
    AlertsScreenVM,
    CalendarRotationScreenVM,
    JournalScreenVM,
    PayoutsScreenVM,
} from '../../../lib/view-models';

// -- Journal ----------------------------------------------------------------
export async function loadJournalScreen(): Promise<JournalScreenVM> {
    const { sqlite, db } = createDb();
    try {
        const trades = await db
            .select()
            .from(schema.tradeLogs)
            .orderBy(desc(schema.tradeLogs.tradingTimestamp))
            .limit(100);

        const accounts = await db
            .select({
                id: schema.accounts.id,
                accountLabel: schema.accounts.accountLabel,
                accountStatus: schema.accounts.accountStatus,
            })
            .from(schema.accounts);

        const totalPnlCents = trades.reduce((sum, t) => sum + t.pnlAmountCents, 0);

        return {
            title: 'Journal',
            totalTrades: trades.length,
            totalPnlCents,
            trades: trades.map(t => ({
                id: t.id,
                accountId: t.accountId,
                tradeDate: t.tradeDate,
                session: t.session,
                direction: t.direction,
                resultType: t.resultType,
                points: t.points ?? null,
                pnlAmountCents: t.pnlAmountCents,
                wasRuleFollowing: t.wasRuleFollowing,
                wasNearNews: t.wasNearNews,
                note: t.note ?? null,
            })),
            accounts,
        };
    } finally {
        sqlite.close();
    }
}

// -- Alerts -----------------------------------------------------------------
export async function loadAlertsScreen(): Promise<AlertsScreenVM> {
    const { sqlite, db } = createDb();
    try {
        const allAlerts = await db
            .select()
            .from(schema.alerts)
            .orderBy(desc(schema.alerts.createdAt));

        const active = allAlerts.filter(a => a.status === 'active');
        const dismissed = allAlerts.filter(a => a.status !== 'active');
        const criticalCount = active.filter(a => a.severity === 'critical').length;

        const mapAlert = (a: typeof allAlerts[0]) => ({
            id: a.id,
            accountId: a.accountId ?? null,
            type: a.type,
            severity: a.severity,
            status: a.status,
            title: a.title,
            message: a.message,
            createdAt: a.createdAt,
            resolvedAt: a.resolvedAt ?? null,
        });

        return {
            title: 'Alerts',
            activeAlerts: active.map(mapAlert),
            dismissedAlerts: dismissed.map(mapAlert),
            totalActive: active.length,
            criticalCount,
        };
    } finally {
        sqlite.close();
    }
}

// -- Payouts ----------------------------------------------------------------
export async function loadPayoutsScreen(): Promise<PayoutsScreenVM> {
    const { sqlite, db } = createDb();
    try {
        const allPayouts = await db
            .select()
            .from(schema.payoutRequests)
            .orderBy(desc(schema.payoutRequests.requestedAt));

        const open = allPayouts.filter(p => !['paid', 'rejected', 'cancelled'].includes(p.status));
        const completed = allPayouts.filter(p => ['paid', 'rejected', 'cancelled'].includes(p.status));

        const totalRequestedCents = allPayouts.reduce((s, p) => s + p.amountRequestedCents, 0);
        const totalReceivedCents = allPayouts.reduce((s, p) => s + (p.amountReceivedCents ?? 0), 0);

        const mapPayout = (p: typeof allPayouts[0]) => ({
            id: p.id,
            accountId: p.accountId,
            requestedAt: p.requestedAt,
            expectedArrivalAt: p.expectedArrivalAt ?? null,
            amountRequestedCents: p.amountRequestedCents,
            amountReceivedCents: p.amountReceivedCents ?? null,
            status: p.status,
            notes: p.notes ?? null,
        });

        return {
            title: 'Payouts',
            openPayouts: open.map(mapPayout),
            completedPayouts: completed.map(mapPayout),
            totalRequestedCents,
            totalReceivedCents,
        };
    } finally {
        sqlite.close();
    }
}

// -- Calendar Rotation ------------------------------------------------------
export async function loadCalendarRotationScreen(): Promise<CalendarRotationScreenVM> {
    const { sqlite, db } = createDb();
    try {
        const rotations = await db
            .select()
            .from(schema.calendarRotations)
            .orderBy(schema.calendarRotations.windowStart);

        const news = await db
            .select()
            .from(schema.newsEvents)
            .orderBy(schema.newsEvents.eventTimestamp);

        const upcoming = rotations.filter(r => r.state === 'planned');
        const active = rotations.filter(r => r.state === 'active');

        const mapRotation = (r: typeof rotations[0]) => ({
            id: r.id,
            accountId: r.accountId,
            rotationType: r.rotationType,
            windowStart: r.windowStart,
            windowEnd: r.windowEnd,
            state: r.state,
            reason: r.reason ?? null,
        });

        return {
            title: 'Calendar & Rotations',
            upcomingRotations: upcoming.map(mapRotation),
            activeRotations: active.map(mapRotation),
            upcomingNews: news.map(n => ({
                id: n.id,
                eventTimestamp: n.eventTimestamp,
                title: n.title,
                impactLevel: n.impactLevel,
                assetScope: n.assetScope,
                lockMinutesBefore: n.lockMinutesBefore,
                lockMinutesAfter: n.lockMinutesAfter,
            })),
        };
    } finally {
        sqlite.close();
    }
}

// -- Account Detail (list view) ---------------------------------------------
export async function loadAccountDetailScreen(): Promise<AccountDetailScreenListVM> {
    const { sqlite, db } = createDb();
    try {
        const allAccounts = await db
            .select()
            .from(schema.accounts)
            .orderBy(schema.accounts.accountLabel);

        const activeCount = allAccounts.filter(a => a.accountStatus === 'active').length;
        const breachedCount = allAccounts.filter(a => a.accountStatus === 'breached').length;
        const totalCurrentBalanceCents = allAccounts.reduce((s, a) => s + a.currentBalanceCents, 0);

        return {
            title: 'Accounts',
            accounts: allAccounts.map(a => ({
                id: a.id,
                accountLabel: a.accountLabel,
                lifecycleStage: a.lifecycleStage,
                accountStatus: a.accountStatus,
                startingBalanceCents: a.startingBalanceCents,
                currentBalanceCents: a.currentBalanceCents,
                peakBalanceCents: a.peakBalanceCents,
                daysTradedReference: a.daysTradedReference ?? null,
                lastPayoutDate: a.lastPayoutDate ?? null,
                feeRefunded: a.feeRefunded,
                manuallyPaused: a.manuallyPaused,
                breachedAt: a.breachedAt ?? null,
                notesSummary: a.notesSummary ?? null,
                firmId: a.firmId,
            })),
            totalAccounts: allAccounts.length,
            activeCount,
            breachedCount,
            totalCurrentBalanceCents,
        };
    } finally {
        sqlite.close();
    }
}
