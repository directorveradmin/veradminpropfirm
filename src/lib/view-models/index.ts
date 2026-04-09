// ── Shared primitives ──────────────────────────────────────────────────────

export interface TradeRow {
    id: string;
    accountId: string;
    tradeDate: string;
    session: string;
    direction: string;
    resultType: string;
    points: number | null;
    pnlAmountCents: number;
    wasRuleFollowing: boolean;
    wasNearNews: boolean;
    note: string | null;
}

export interface AlertRow {
    id: string;
    accountId: string | null;
    type: string;
    severity: string;
    status: string;
    title: string;
    message: string;
    createdAt: string;
    resolvedAt: string | null;
}

export interface PayoutRow {
    id: string;
    accountId: string;
    requestedAt: string;
    expectedArrivalAt: string | null;
    amountRequestedCents: number;
    amountReceivedCents: number | null;
    status: string;
    notes: string | null;
}

export interface CalendarRotationRow {
    id: string;
    accountId: string;
    rotationType: string;
    windowStart: string;
    windowEnd: string;
    state: string;
    reason: string | null;
}

export interface NewsEventRow {
    id: string;
    eventTimestamp: string;
    title: string;
    impactLevel: string;
    assetScope: string;
    lockMinutesBefore: number;
    lockMinutesAfter: number;
}

export interface AccountRow {
    id: string;
    accountLabel: string;
    lifecycleStage: string;
    accountStatus: string;
    startingBalanceCents: number;
    currentBalanceCents: number;
    peakBalanceCents: number;
    daysTradedReference: number | null;
    lastPayoutDate: string | null;
    feeRefunded: boolean;
    manuallyPaused: boolean;
    breachedAt: string | null;
    notesSummary: string | null;
    firmId: string;
}

// ── Screen VMs ─────────────────────────────────────────────────────────────

export interface JournalScreenVM {
    title: string;
    totalTrades: number;
    totalPnlCents: number;
    trades: TradeRow[];
    accounts: Pick<AccountRow, 'id' | 'accountLabel' | 'accountStatus'>[];
}

export interface AlertsScreenVM {
    title: string;
    activeAlerts: AlertRow[];
    dismissedAlerts: AlertRow[];
    totalActive: number;
    criticalCount: number;
}

export interface PayoutsScreenVM {
    title: string;
    openPayouts: PayoutRow[];
    completedPayouts: PayoutRow[];
    totalRequestedCents: number;
    totalReceivedCents: number;
}

export interface CalendarRotationScreenVM {
    title: string;
    upcomingRotations: CalendarRotationRow[];
    activeRotations: CalendarRotationRow[];
    upcomingNews: NewsEventRow[];
}

export interface AccountDetailScreenListVM {
    title: string;
    accounts: AccountRow[];
    totalAccounts: number;
    activeCount: number;
    breachedCount: number;
    totalCurrentBalanceCents: number;
}