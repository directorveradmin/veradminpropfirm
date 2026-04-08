export interface TimelineEntry {
    type: string;
    timestamp: string;
    details: string;
}

export interface PayoutContext {
    readiness: string;
    blockers?: string[];
    nextWindow?: string;
    requestStatus?: string;
    expectedArrival?: string;
    refundStatus?: string;
}

export interface SimulationCTA {
    label: string;
    description?: string;
}

export interface DegradedInfo {
    reason: string;
}

export interface QuietInfo {
    message: string;
}

export interface AccountDetailVM {
    header: {
        label: string;
        firm: string;
        lifecycleStage: string;
        mode: string;
        stateBadge: 'Tradable' | 'Restricted' | 'Stopped';
        alertBadge?: string;
        quickActions: string[];
    };
    currentState: {
        startingBalance: number;
        currentBalance: number;
        peakBalance?: number;
        hardBreachFloor: number;
        dailyFloor: number;
        lives: number;
        fractionalLives: number;
        maxSafeLotSize: number;
        riskSeverity: 'Low' | 'Medium' | 'High';
        nextAction: string;
    };
    permissions: {
        tradable: boolean;
        fullSizeAllowed: boolean;
        fractionalOnly: boolean;
        payoutProtectionActive: boolean;
        dailyRestrictionActive: boolean;
        newsRestrictionActive: boolean;
        paused: boolean;
    };
    whyState: string[];
    tacticalActions: {
        trading: string[];
        payoutAdmin: string[];
        accountControl: string[];
    };
    journalTimeline: TimelineEntry[];
    payoutContext: PayoutContext;
    simulationEntry: SimulationCTA;
    secondaryMetadata: {
        ruleProfile: string;
        ruleVersion: string;
        createdAt: Date;
        lastResetAt: Date;
        notesSummary?: string;
    };
    degradedState?: DegradedInfo;
    quietState?: QuietInfo;
}
