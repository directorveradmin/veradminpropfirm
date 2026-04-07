export type AccountWorkflowType = 'create' | 'assignProfile' | 'logTrade' | 'addNote' | 'pause' | 'resume' | 'requestPayout' | 'markPayoutReceived';

export interface RefreshKey { key: string }

export interface AccountOperationalSnapshot {
  mode: string
  mayTrade: boolean
  mayTradeFullSize: boolean
  mayTradeFractionalOnly: boolean
  payoutState: string | null
  effectiveLives: number | null
  fractionalLives: number | null
  nextAction: string | null
  restrictionCodes: string[]
  alertCodes: string[]
}

export interface AccountConsequenceSummary {
  headline: string
  changed: {
    modeChanged: boolean
    tradabilityChanged: boolean
    fullSizePermissionChanged: boolean
    payoutStateChanged: boolean
    alertsChanged: boolean
    livesChanged: boolean
  }
  before?: AccountOperationalSnapshot
  after?: AccountOperationalSnapshot
  nextRecommendedAction?: string | null
  explanationReasons: string[]
}

export interface DerivedAccountSystemEvent {
  eventType: string
  accountId: string
  eventTimestamp: string
  causalWorkflow: string
  causalFactIds: string[]
  beforeValue?: string | number | boolean | null
  afterValue?: string | number | boolean | null
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'resolved' | null
  summary: string
  payloadJson?: string | null
}

export interface WorkflowDegradedState {
  reason: string
  impactedFields: string[]
}

export interface AccountWorkflowResult {
  accountId: string
  workflow: AccountWorkflowType
  persistedFactIds: string[]
  evaluation: any | null
  derivedEvents: DerivedAccountSystemEvent[]
  invalidationKeys: string[]
  consequenceSummary: AccountConsequenceSummary
  degradedState: WorkflowDegradedState | null
}

export interface PauseAccountCommand { accountId: string; eventTimestamp: string; reason: string }
export interface ResumeAccountCommand { accountId: string; eventTimestamp: string; reason: string }
export interface AssignRuleProfileCommand { accountId: string; ruleProfileId: string; ruleProfileVersionId: string; assignedAt: string; assignmentReason: string; assignedBy: 'user' | 'system' | 'migration'; notes?: string | null }
export interface LogTradeResultCommand { accountId: string; tradingTimestamp: string; tradeDate: string; session: string; direction: string; resultType: 'win' | 'loss' | 'custom'; pnlAmountCents: number; points?: number | null; riskUnitFraction?: number | null; wasRuleFollowing?: boolean; wasNearNews?: boolean; setupTagId?: string | null; screenshotPath?: string | null; note?: string | null; source: 'manual' | 'import' | 'system' }
export interface AddAccountNoteCommand { accountId: string; noteType: 'general' | 'risk' | 'payout' | 'admin' | 'system'; body: string; createdAt?: string }
export interface RequestPayoutCommand { accountId: string; requestedAt: string; amountRequestedCents: number; expectedArrivalAt?: string | null; notes?: string | null }
export interface MarkPayoutReceivedCommand { accountId: string; payoutRequestId: string; receivedAt: string; amountReceivedCents?: number | null; notes?: string | null }
