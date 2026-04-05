import type { SurfaceRefreshKey } from "@/lib/services/refreshCoordinator";

export type DegradedStateLevel = "healthy" | "partial" | "unavailable" | "unsafe";

export interface DegradedState {
  level: DegradedStateLevel;
  code: string;
  title: string;
  message: string;
}

export interface FleetAccountRecord {
  id: string;
  label: string;
  firmLabel: string;
  lifecycleStage: string;
  accountStatus: string;
  ruleProfileLabel: string | null;
  ruleProfileVersionLabel: string | null;
  startingBalanceCents: number | null;
  currentBalanceCents: number | null;
  peakBalanceCents: number | null;
  updatedAt: string | null;
}

export interface StoredAlertRecord {
  id: string;
  accountId: string | null;
  severity: "critical" | "high" | "medium" | "low" | "resolved";
  category: string;
  title: string;
  message: string;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  dueAt: string | null;
}

export interface JournalEventRecord {
  id: string;
  accountId: string | null;
  eventType: string;
  summary: string;
  detail: string | null;
  createdAt: string;
  source: "manual" | "system" | "import" | "restore";
  importance: "high" | "medium" | "low";
}

export interface PayoutRecord {
  id: string;
  accountId: string;
  status: "ready" | "approaching" | "requested" | "pending" | "received" | "blocked";
  requestedAt: string | null;
  receivedAt: string | null;
  expectedAt: string | null;
  amountCents: number | null;
  blockerSummary: string | null;
}

export interface RefundTaskRecord {
  id: string;
  accountId: string | null;
  status: "open" | "requested" | "received" | "resolved";
  title: string;
  dueAt: string | null;
}

export interface RotationRecord {
  id: string;
  accountId: string;
  kind: "active" | "rest" | "payout_window" | "warning" | "manual_pause";
  startsAt: string;
  endsAt: string | null;
  title: string;
  detail: string | null;
}

export interface EvaluationReason {
  code: string;
  title: string;
  summary: string;
}

export interface DerivedAlertSummary {
  code: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  summary: string;
}

export interface AccountEvaluationResultLike {
  accountId: string;
  lifecycleStage: string;
  mode: string;
  tradable: boolean;
  mayTrade: boolean;
  mayTradeFullSize: boolean;
  mayTradeFractionalOnly: boolean;
  mustNotTrade: boolean;
  hardFloorCents: number | null;
  dailyFloorCents: number | null;
  fullLivesRemaining: number | null;
  fractionalLivesRemaining: number | null;
  dominantRestrictionCode: string | null;
  payoutState: {
    status: "not_relevant" | "blocked" | "approaching" | "ready" | "pending" | "received";
    blockers: string[];
    nextEligibleAt: string | null;
  };
  nextRecommendedAction: {
    code: string | null;
    label: string | null;
    summary: string | null;
  };
  reasons: EvaluationReason[];
  alerts: DerivedAlertSummary[];
  degradedState: DegradedState | null;
}

export interface DashboardStoredBundle {
  accounts: FleetAccountRecord[];
  storedAlerts: StoredAlertRecord[];
  payouts: PayoutRecord[];
  refundTasks: RefundTaskRecord[];
  rotations: RotationRecord[];
  degradedState: DegradedState | null;
}

export interface AccountDetailStoredBundle {
  account: FleetAccountRecord;
  timeline: JournalEventRecord[];
  alerts: StoredAlertRecord[];
  payouts: PayoutRecord[];
  refundTasks: RefundTaskRecord[];
  rotations: RotationRecord[];
  degradedState: DegradedState | null;
}

export interface JournalStoredBundle {
  accountsById: Record<string, FleetAccountRecord>;
  events: JournalEventRecord[];
  degradedState: DegradedState | null;
}

export interface PayoutsStoredBundle {
  accountsById: Record<string, FleetAccountRecord>;
  payouts: PayoutRecord[];
  refundTasks: RefundTaskRecord[];
  degradedState: DegradedState | null;
}

export interface CalendarStoredBundle {
  accountsById: Record<string, FleetAccountRecord>;
  rotations: RotationRecord[];
  payouts: PayoutRecord[];
  alerts: StoredAlertRecord[];
  degradedState: DegradedState | null;
}

export interface AlertsStoredBundle {
  accountsById: Record<string, FleetAccountRecord>;
  storedAlerts: StoredAlertRecord[];
  degradedState: DegradedState | null;
}

export interface SimulationPreviewReadModel {
  account: FleetAccountRecord;
  liveEvaluation: AccountEvaluationResultLike;
  previewEvaluation: AccountEvaluationResultLike;
  degradedState: DegradedState | null;
}

export interface DashboardReadModel {
  stored: DashboardStoredBundle;
  evaluationsByAccountId: Record<string, AccountEvaluationResultLike>;
  degradedState: DegradedState | null;
}

export interface AccountDetailReadModel {
  stored: AccountDetailStoredBundle;
  evaluation: AccountEvaluationResultLike;
  degradedState: DegradedState | null;
}

export interface JournalReadModel {
  stored: JournalStoredBundle;
  evaluationsByAccountId: Record<string, AccountEvaluationResultLike>;
  degradedState: DegradedState | null;
}

export interface PayoutsReadModel {
  stored: PayoutsStoredBundle;
  evaluationsByAccountId: Record<string, AccountEvaluationResultLike>;
  degradedState: DegradedState | null;
}

export interface CalendarReadModel {
  stored: CalendarStoredBundle;
  evaluationsByAccountId: Record<string, AccountEvaluationResultLike>;
  degradedState: DegradedState | null;
}

export interface AlertsReadModel {
  stored: AlertsStoredBundle;
  evaluationsByAccountId: Record<string, AccountEvaluationResultLike>;
  degradedState: DegradedState | null;
}

export interface JournalReadScope {
  accountId?: string;
  search?: string;
  eventTypes?: string[];
  rangeStart?: string;
  rangeEnd?: string;
}

export interface PayoutsReadScope {
  accountIds?: string[];
}

export interface CalendarReadScope {
  rangeStart: string;
  rangeEnd: string;
}

export interface AlertsReadScope {
  accountIds?: string[];
  severities?: Array<StoredAlertRecord["severity"]>;
  statuses?: Array<StoredAlertRecord["status"]>;
}

export interface DashboardReadModelDependencies {
  loadDashboardStoredBundle(): Promise<DashboardStoredBundle>;
  evaluateAccounts(accountIds: string[]): Promise<AccountEvaluationResultLike[]>;
}

export interface AccountDetailReadModelDependencies {
  loadAccountDetailStoredBundle(accountId: string): Promise<AccountDetailStoredBundle>;
  evaluateAccount(accountId: string): Promise<AccountEvaluationResultLike>;
}

export interface JournalReadModelDependencies {
  loadJournalStoredBundle(scope: JournalReadScope): Promise<JournalStoredBundle>;
  evaluateAccounts(accountIds: string[]): Promise<AccountEvaluationResultLike[]>;
}

export interface PayoutsReadModelDependencies {
  loadPayoutsStoredBundle(scope: PayoutsReadScope): Promise<PayoutsStoredBundle>;
  evaluateAccounts(accountIds: string[]): Promise<AccountEvaluationResultLike[]>;
}

export interface CalendarReadModelDependencies {
  loadCalendarStoredBundle(scope: CalendarReadScope): Promise<CalendarStoredBundle>;
  evaluateAccounts(accountIds: string[]): Promise<AccountEvaluationResultLike[]>;
}

export interface AlertsReadModelDependencies {
  loadAlertsStoredBundle(scope: AlertsReadScope): Promise<AlertsStoredBundle>;
  evaluateAccounts(accountIds: string[]): Promise<AccountEvaluationResultLike[]>;
}

export interface SimulationPreviewDependencies {
  loadAccountDetailStoredBundle(accountId: string): Promise<AccountDetailStoredBundle>;
  evaluateAccount(accountId: string): Promise<AccountEvaluationResultLike>;
  evaluateSimulation(
    accountId: string,
    action: SimulationActionInput,
  ): Promise<AccountEvaluationResultLike>;
}

export interface SimulationActionInput {
  actionType:
    | "log_win"
    | "log_loss"
    | "log_custom"
    | "request_payout"
    | "mark_payout_received"
    | "daily_reset";
  amountCents?: number;
  note?: string;
}

export interface WorkflowInvalidationPlan {
  reason: string;
  keys: SurfaceRefreshKey[];
}
