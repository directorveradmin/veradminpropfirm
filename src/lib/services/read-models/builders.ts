import { accountRefreshKey, type SurfaceRefreshKey } from "@/lib/services/refreshCoordinator";

import type {
  AccountDetailReadModel,
  AccountDetailReadModelDependencies,
  AccountEvaluationResultLike,
  AlertsReadModel,
  AlertsReadModelDependencies,
  CalendarReadModel,
  CalendarReadModelDependencies,
  DashboardReadModel,
  DashboardReadModelDependencies,
  DegradedState,
  JournalReadModel,
  JournalReadModelDependencies,
  PayoutsReadModel,
  PayoutsReadModelDependencies,
  SimulationActionInput,
  SimulationPreviewDependencies,
  SimulationPreviewReadModel,
  WorkflowInvalidationPlan,
  AlertsReadScope,
  CalendarReadScope,
  JournalReadScope,
  PayoutsReadScope,
} from "@/lib/services/read-models/types";

function firstDefinedDegradedState(
  ...states: Array<DegradedState | null | undefined>
): DegradedState | null {
  return states.find((state) => state != null) ?? null;
}

function indexEvaluations(
  evaluations: readonly AccountEvaluationResultLike[],
): Record<string, AccountEvaluationResultLike> {
  return evaluations.reduce<Record<string, AccountEvaluationResultLike>>((accumulator, evaluation) => {
    accumulator[evaluation.accountId] = evaluation;
    return accumulator;
  }, {});
}

function uniqueAccountIds(accountIds: readonly string[]): string[] {
  return Array.from(new Set(accountIds.filter(Boolean)));
}

export async function buildDashboardReadModel(
  dependencies: DashboardReadModelDependencies,
): Promise<DashboardReadModel> {
  const stored = await dependencies.loadDashboardStoredBundle();
  const accountIds = uniqueAccountIds(stored.accounts.map((account) => account.id));
  const evaluations = await dependencies.evaluateAccounts(accountIds);

  return {
    stored,
    evaluationsByAccountId: indexEvaluations(evaluations),
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      ...evaluations.map((evaluation) => evaluation.degradedState),
    ),
  };
}

export async function buildAccountDetailReadModel(
  accountId: string,
  dependencies: AccountDetailReadModelDependencies,
): Promise<AccountDetailReadModel> {
  const stored = await dependencies.loadAccountDetailStoredBundle(accountId);
  const evaluation = await dependencies.evaluateAccount(accountId);

  return {
    stored,
    evaluation,
    degradedState: firstDefinedDegradedState(stored.degradedState, evaluation.degradedState),
  };
}

export async function buildJournalReadModel(
  scope: JournalReadScope,
  dependencies: JournalReadModelDependencies,
): Promise<JournalReadModel> {
  const stored = await dependencies.loadJournalStoredBundle(scope);
  const accountIds = uniqueAccountIds(
    stored.events
      .map((event) => event.accountId)
      .filter((accountId): accountId is string => Boolean(accountId)),
  );

  const evaluations = accountIds.length
    ? await dependencies.evaluateAccounts(accountIds)
    : [];

  return {
    stored,
    evaluationsByAccountId: indexEvaluations(evaluations),
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      ...evaluations.map((evaluation) => evaluation.degradedState),
    ),
  };
}

export async function buildPayoutsReadModel(
  scope: PayoutsReadScope,
  dependencies: PayoutsReadModelDependencies,
): Promise<PayoutsReadModel> {
  const stored = await dependencies.loadPayoutsStoredBundle(scope);
  const accountIds = uniqueAccountIds([
    ...Object.keys(stored.accountsById),
    ...stored.payouts.map((payout) => payout.accountId),
    ...stored.refundTasks
      .map((task) => task.accountId)
      .filter((accountId): accountId is string => Boolean(accountId)),
  ]);

  const evaluations = accountIds.length
    ? await dependencies.evaluateAccounts(accountIds)
    : [];

  return {
    stored,
    evaluationsByAccountId: indexEvaluations(evaluations),
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      ...evaluations.map((evaluation) => evaluation.degradedState),
    ),
  };
}

export async function buildCalendarReadModel(
  scope: CalendarReadScope,
  dependencies: CalendarReadModelDependencies,
): Promise<CalendarReadModel> {
  const stored = await dependencies.loadCalendarStoredBundle(scope);
  const accountIds = uniqueAccountIds([
    ...Object.keys(stored.accountsById),
    ...stored.rotations.map((rotation) => rotation.accountId),
    ...stored.payouts.map((payout) => payout.accountId),
    ...stored.alerts
      .map((alert) => alert.accountId)
      .filter((accountId): accountId is string => Boolean(accountId)),
  ]);

  const evaluations = accountIds.length
    ? await dependencies.evaluateAccounts(accountIds)
    : [];

  return {
    stored,
    evaluationsByAccountId: indexEvaluations(evaluations),
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      ...evaluations.map((evaluation) => evaluation.degradedState),
    ),
  };
}

export async function buildAlertsReadModel(
  scope: AlertsReadScope,
  dependencies: AlertsReadModelDependencies,
): Promise<AlertsReadModel> {
  const stored = await dependencies.loadAlertsStoredBundle(scope);
  const accountIds = uniqueAccountIds([
    ...Object.keys(stored.accountsById),
    ...stored.storedAlerts
      .map((alert) => alert.accountId)
      .filter((accountId): accountId is string => Boolean(accountId)),
  ]);

  const evaluations = accountIds.length
    ? await dependencies.evaluateAccounts(accountIds)
    : [];

  return {
    stored,
    evaluationsByAccountId: indexEvaluations(evaluations),
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      ...evaluations.map((evaluation) => evaluation.degradedState),
    ),
  };
}

export async function buildSimulationPreviewReadModel(
  accountId: string,
  action: SimulationActionInput,
  dependencies: SimulationPreviewDependencies,
): Promise<SimulationPreviewReadModel> {
  const stored = await dependencies.loadAccountDetailStoredBundle(accountId);
  const liveEvaluation = await dependencies.evaluateAccount(accountId);
  const previewEvaluation = await dependencies.evaluateSimulation(accountId, action);

  return {
    account: stored.account,
    liveEvaluation,
    previewEvaluation,
    degradedState: firstDefinedDegradedState(
      stored.degradedState,
      liveEvaluation.degradedState,
      previewEvaluation.degradedState,
    ),
  };
}

export function createTradeWorkflowInvalidationPlan(accountId: string): WorkflowInvalidationPlan {
  return {
    reason: "trade_logged",
    keys: [
      accountRefreshKey(accountId),
      "dashboard",
      "journal",
      "alerts",
      "payouts",
      "calendar",
    ],
  };
}

export function createNoteWorkflowInvalidationPlan(accountId: string): WorkflowInvalidationPlan {
  return {
    reason: "note_added",
    keys: [accountRefreshKey(accountId), "journal"],
  };
}

export function createPayoutWorkflowInvalidationPlan(accountId: string): WorkflowInvalidationPlan {
  return {
    reason: "payout_changed",
    keys: [
      accountRefreshKey(accountId),
      "dashboard",
      "journal",
      "alerts",
      "payouts",
      "calendar",
    ],
  };
}

export function createPauseResumeInvalidationPlan(accountId: string): WorkflowInvalidationPlan {
  return {
    reason: "account_status_changed",
    keys: [
      accountRefreshKey(accountId),
      "dashboard",
      "journal",
      "alerts",
      "calendar",
      "payouts",
    ],
  };
}

export function createProfileAssignmentInvalidationPlan(
  accountId: string,
): WorkflowInvalidationPlan {
  return {
    reason: "profile_assignment_changed",
    keys: [
      accountRefreshKey(accountId),
      "dashboard",
      "journal",
      "alerts",
      "payouts",
      "calendar",
    ],
  };
}

export function createRotationInvalidationPlan(accountId: string): WorkflowInvalidationPlan {
  return {
    reason: "rotation_changed",
    keys: [accountRefreshKey(accountId), "dashboard", "alerts", "calendar", "payouts"],
  };
}

export function isSurfaceKeyAffected(
  watchedKeys: readonly SurfaceRefreshKey[],
  emittedKeys: readonly SurfaceRefreshKey[],
): boolean {
  return emittedKeys.some((emittedKey) => watchedKeys.includes(emittedKey) || emittedKey === "dashboard");
}
