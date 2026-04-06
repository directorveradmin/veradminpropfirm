export interface AccountWorkflowResult {
  accountId: string;
  workflow: string;
  persistedFactIds?: string[];
  evaluation?: any;
  derivedEvents?: any[];
  invalidationKeys?: string[];
  consequenceSummary?: any;
  degradedState?: any;
}

export interface CreateAccountCommand {
  accountId: string;
  firmId: string;
  accountLabel: string;
  lifecycleStage: string;
  startingBalanceCents: number;
  currentBalanceCents?: number;
  peakBalanceCents?: number;
  initialRuleProfileId: string;
  initialRuleProfileVersionId: string;
  assignmentReason: string;
}

export interface PauseAccountCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
}

export interface ResumeAccountCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
}

export interface AssignRuleProfileCommand {
  accountId: string;
  ruleProfileId: string;
  ruleProfileVersionId: string;
  assignedAt: string;
  assignmentReason: string;
  assignedBy: 'user' | 'system' | 'migration';
  notes?: string | null;
}

export interface LogTradeResultCommand {
  accountId: string;
  tradingTimestamp: string;
  tradeDate: string;
  session: string;
  direction: 'long' | 'short';
  resultType: 'win' | 'loss' | 'custom';
  pnlAmountCents: number;
  points?: number | null;
  riskUnitFraction?: number | null;
  wasRuleFollowing?: boolean;
  wasNearNews?: boolean;
  setupTagId?: string | null;
  screenshotPath?: string | null;
  note?: string | null;
  source: 'manual' | 'import' | 'system';
}

export interface AddAccountNoteCommand {
  accountId: string;
  noteType: 'general' | 'risk' | 'payout' | 'admin' | 'system';
  body: string;
  createdAt?: string;
}

export interface RequestPayoutCommand {
  accountId: string;
  requestedAt: string;
  amountRequestedCents: number;
  expectedArrivalAt?: string | null;
  notes?: string | null;
}

export interface MarkPayoutReceivedCommand {
  accountId: string;
  payoutRequestId: string;
  receivedAt: string;
  amountReceivedCents?: number | null;
  notes?: string | null;
}
