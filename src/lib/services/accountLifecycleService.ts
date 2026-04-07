/**
 * Step 6 stubbed lifecycle workflow service for Veradmin.
 *
 * This file is intentionally self-contained so it can be dropped into the scaffold
 * even when the rest of Step 6 runtime files are still being restored.
 *
 * It preserves the Step 6 ownership model:
 * - workflow services orchestrate lifecycle actions
 * - lifecycle transitions are validated centrally
 * - result envelopes are returned for Step 7 consumption
 * - invalidation keys are emitted instead of mutating UI state directly
 *
 * This is a stubbed workflow service, not final repository-backed persistence.
 */

export type LifecycleStage =
  | 'Draft / Created'
  | 'Evaluation / Step 1'
  | 'Evaluation / Step 2'
  | 'Funded / Active'
  | 'Funded / Payout Active'
  | 'Paused / Inactive'
  | 'Breached / Failed'
  | 'Retired / Archived';

export type AccountWorkflowType =
  | 'create_account'
  | 'load_account'
  | 'update_account_basics'
  | 'pause_account'
  | 'resume_account'
  | 'retire_account'
  | 'update_lifecycle_stage';

export type RefreshKey =
  | 'dashboard'
  | 'journal'
  | 'alerts'
  | 'payouts'
  | 'calendar'
  | `account:${string}`;

export type WorkflowStatus = 'success' | 'partial' | 'blocked';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'resolved';

export interface AccountOperationalSnapshot {
  mode: string;
  mayTrade: boolean;
  mayTradeFullSize: boolean;
  mayTradeFractionalOnly: boolean;
  payoutState: string | null;
  effectiveLives: number | null;
  fractionalLives: number | null;
  nextAction: string | null;
  restrictionCodes: string[];
  alertCodes: string[];
}

export interface AccountEvaluationResult extends AccountOperationalSnapshot {
  lifecycleStage: LifecycleStage;
  accountId: string;
  evaluationTimestamp: string;
  explanationReasons: string[];
}

export interface WorkflowDegradedState {
  code: string;
  severity: Exclude<Severity, 'resolved'>;
  message: string;
  relatedFactIds?: string[];
}

export interface AccountConsequenceSummary {
  headline: string;
  status: WorkflowStatus;
  changedFields: string[];
  modeDelta?: { before: string; after: string } | null;
  tradabilityDelta?: { before: boolean; after: boolean } | null;
  fullSizeDelta?: { before: boolean; after: boolean } | null;
  payoutStateDelta?: { before: string | null; after: string | null } | null;
  livesDelta?: { before: number | null; after: number | null } | null;
  fractionalLivesDelta?: { before: number | null; after: number | null } | null;
  alertsCreated: string[];
  alertsResolved: string[];
  nextRecommendedAction?: string | null;
  explanationReasons: string[];
}

export interface DerivedAccountSystemEvent {
  eventType: string;
  accountId: string;
  eventTimestamp: string;
  causalWorkflow: AccountWorkflowType;
  causalFactIds: string[];
  beforeValue?: string | number | boolean | null;
  afterValue?: string | number | boolean | null;
  severity?: Severity | null;
  summary: string;
  payloadJson?: string | null;
}

export interface AccountWorkflowResult {
  accountId: string;
  workflow: AccountWorkflowType;
  persistedFactIds: string[];
  evaluation: AccountEvaluationResult | null;
  derivedEvents: DerivedAccountSystemEvent[];
  invalidationKeys: RefreshKey[];
  consequenceSummary: AccountConsequenceSummary;
  degradedState: WorkflowDegradedState | null;
}

export interface AccountReadResult {
  accountId: string;
  workflow: 'load_account';
  storedBundle: {
    account: StoredLifecycleAccount;
  };
  evaluation: AccountEvaluationResult | null;
  derivedEvents: DerivedAccountSystemEvent[];
  invalidationKeys: RefreshKey[];
  consequenceSummary: AccountConsequenceSummary;
  degradedState: WorkflowDegradedState | null;
  historyIntegrityMarkers: WorkflowDegradedState[];
}

export interface CreateAccountCommand {
  firmId: string;
  accountLabel: string;
  externalAccountRef?: string | null;
  lifecycleStage: LifecycleStage;
  accountStatus?: string;
  startingBalanceCents: number;
  currentBalanceCents?: number;
  peakBalanceCents?: number;
  daysTradedReference?: number | null;
  lastPayoutDate?: string | null;
  feeRefunded?: boolean;
  manuallyPaused?: boolean;
  initialRuleProfileId: string;
  initialRuleProfileVersionId: string;
  assignmentReason: string;
  createdAt?: string;
}

export interface UpdateAccountBasicsCommand {
  accountId: string;
  eventTimestamp?: string;
  reason: string;
  accountLabel?: string;
  externalAccountRef?: string | null;
  lifecycleStage?: LifecycleStage;
  currentBalanceCents?: number;
  peakBalanceCents?: number;
  lastPayoutDate?: string | null;
  feeRefunded?: boolean;
  manuallyPaused?: boolean;
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

export interface RetireAccountCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
}

export interface UpdateLifecycleStageCommand {
  accountId: string;
  eventTimestamp: string;
  reason: string;
  nextLifecycleStage: LifecycleStage;
}

export interface StoredLifecycleAccount {
  id: string;
  firmId: string;
  accountLabel: string;
  externalAccountRef: string | null;
  lifecycleStage: LifecycleStage;
  accountStatus: string;
  startingBalanceCents: number;
  currentBalanceCents: number;
  peakBalanceCents: number;
  daysTradedReference: number | null;
  lastPayoutDate: string | null;
  feeRefunded: boolean;
  manuallyPaused: boolean;
  initialRuleProfileId: string;
  initialRuleProfileVersionId: string;
  currentRuleProfileId: string;
  currentRuleProfileVersionId: string;
  assignmentReason: string;
  createdAt: string;
  updatedAt: string;
  previousActiveLifecycleStage: LifecycleStage | null;
}

const ALLOWED_TRANSITIONS: Record<LifecycleStage, LifecycleStage[]> = {
  'Draft / Created': [
    'Evaluation / Step 1',
    'Funded / Active',
    'Paused / Inactive',
  ],
  'Evaluation / Step 1': [
    'Evaluation / Step 2',
    'Breached / Failed',
    'Paused / Inactive',
  ],
  'Evaluation / Step 2': [
    'Funded / Active',
    'Breached / Failed',
    'Paused / Inactive',
  ],
  'Funded / Active': [
    'Funded / Payout Active',
    'Paused / Inactive',
    'Breached / Failed',
  ],
  'Funded / Payout Active': [
    'Funded / Active',
    'Paused / Inactive',
    'Breached / Failed',
  ],
  'Paused / Inactive': [
    'Evaluation / Step 1',
    'Evaluation / Step 2',
    'Funded / Active',
    'Funded / Payout Active',
    'Retired / Archived',
  ],
  'Breached / Failed': [
    'Retired / Archived',
  ],
  'Retired / Archived': [],
};

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function buildEvaluation(account: StoredLifecycleAccount): AccountEvaluationResult {
  const explanationReasons: string[] = [];
  let mode = 'Cooldown';
  let mayTrade = false;
  let mayTradeFullSize = false;
  let mayTradeFractionalOnly = false;
  let payoutState: string | null = null;
  let effectiveLives: number | null = null;
  let fractionalLives: number | null = null;
  let nextAction: string | null = null;
  const restrictionCodes: string[] = [];
  const alertCodes: string[] = [];

  if (account.manuallyPaused || account.lifecycleStage === 'Paused / Inactive') {
    mode = 'Cooldown';
    mayTrade = false;
    mayTradeFullSize = false;
    mayTradeFractionalOnly = false;
    nextAction = 'Resume only when this account should re-enter the active fleet.';
    restrictionCodes.push('manual_pause');
    explanationReasons.push('Account is paused/inactive and should not be treated as tactically tradable.');
  } else {
    switch (account.lifecycleStage) {
      case 'Draft / Created':
        mode = 'Cooldown';
        nextAction = 'Complete setup and governing profile validation before using this account operationally.';
        explanationReasons.push('Draft accounts are not fully active in the fleet.');
        break;

      case 'Evaluation / Step 1':
        mode = 'Attack';
        mayTrade = true;
        mayTradeFullSize = true;
        mayTradeFractionalOnly = false;
        effectiveLives = 3;
        fractionalLives = 3;
        nextAction = 'Continue evaluation progress while preserving rule compliance.';
        explanationReasons.push('Evaluation Step 1 is active and eligible for normal tactical progress.');
        break;

      case 'Evaluation / Step 2':
        mode = 'Recovery';
        mayTrade = true;
        mayTradeFullSize = true;
        mayTradeFractionalOnly = false;
        effectiveLives = 2;
        fractionalLives = 2.5;
        nextAction = 'Complete evaluation carefully and monitor transition pressure.';
        explanationReasons.push('Evaluation Step 2 remains active but deserves more disciplined posture.');
        break;

      case 'Funded / Active':
        mode = 'Attack';
        mayTrade = true;
        mayTradeFullSize = true;
        mayTradeFractionalOnly = false;
        effectiveLives = 4;
        fractionalLives = 4;
        nextAction = 'Operate normally while protecting funded status.';
        explanationReasons.push('Funded active accounts are part of the live fleet.');
        break;

      case 'Funded / Payout Active':
        mode = 'Payout Protection';
        mayTrade = true;
        mayTradeFullSize = false;
        mayTradeFractionalOnly = true;
        payoutState = 'payout_active';
        effectiveLives = 2;
        fractionalLives = 3;
        nextAction = 'Protect payout posture and avoid unnecessary pressure.';
        restrictionCodes.push('full_size_not_allowed');
        explanationReasons.push('Payout-active accounts remain usable but should trade under more protective posture.');
        break;

      case 'Breached / Failed':
        mode = 'Stopped';
        mayTrade = false;
        mayTradeFullSize = false;
        mayTradeFractionalOnly = false;
        nextAction = 'Do not trade this account. Review history and retire when appropriate.';
        restrictionCodes.push('breached');
        alertCodes.push('breach');
        explanationReasons.push('Breached accounts have lost operational viability.');
        break;

      case 'Retired / Archived':
        mode = 'Stopped';
        mayTrade = false;
        mayTradeFullSize = false;
        mayTradeFractionalOnly = false;
        nextAction = 'Historical account only. No forward tactical use in v1.';
        restrictionCodes.push('archived');
        explanationReasons.push('Archived accounts are preserved for history, not live operations.');
        break;
    }
  }

  return {
    accountId: account.id,
    lifecycleStage: account.lifecycleStage,
    evaluationTimestamp: nowIso(),
    mode,
    mayTrade,
    mayTradeFullSize,
    mayTradeFractionalOnly,
    payoutState,
    effectiveLives,
    fractionalLives,
    nextAction,
    restrictionCodes,
    alertCodes,
    explanationReasons,
  };
}

function toSnapshot(evaluation: AccountEvaluationResult | null): AccountOperationalSnapshot {
  if (!evaluation) {
    return {
      mode: 'Unknown',
      mayTrade: false,
      mayTradeFullSize: false,
      mayTradeFractionalOnly: false,
      payoutState: null,
      effectiveLives: null,
      fractionalLives: null,
      nextAction: null,
      restrictionCodes: [],
      alertCodes: [],
    };
  }

  return {
    mode: evaluation.mode,
    mayTrade: evaluation.mayTrade,
    mayTradeFullSize: evaluation.mayTradeFullSize,
    mayTradeFractionalOnly: evaluation.mayTradeFractionalOnly,
    payoutState: evaluation.payoutState,
    effectiveLives: evaluation.effectiveLives,
    fractionalLives: evaluation.fractionalLives,
    nextAction: evaluation.nextAction,
    restrictionCodes: [...evaluation.restrictionCodes],
    alertCodes: [...evaluation.alertCodes],
  };
}

function diffSnapshots(before: AccountOperationalSnapshot, after: AccountOperationalSnapshot) {
  const changedFields: string[] = [];

  const modeDelta = before.mode !== after.mode
    ? { before: before.mode, after: after.mode }
    : null;

  const tradabilityDelta = before.mayTrade !== after.mayTrade
    ? { before: before.mayTrade, after: after.mayTrade }
    : null;

  const fullSizeDelta = before.mayTradeFullSize !== after.mayTradeFullSize
    ? { before: before.mayTradeFullSize, after: after.mayTradeFullSize }
    : null;

  const payoutStateDelta = before.payoutState !== after.payoutState
    ? { before: before.payoutState, after: after.payoutState }
    : null;

  const livesDelta = before.effectiveLives !== after.effectiveLives
    ? { before: before.effectiveLives, after: after.effectiveLives }
    : null;

  const fractionalLivesDelta = before.fractionalLives !== after.fractionalLives
    ? { before: before.fractionalLives, after: after.fractionalLives }
    : null;

  if (modeDelta) changedFields.push('mode');
  if (tradabilityDelta) changedFields.push('tradability');
  if (fullSizeDelta) changedFields.push('fullSizePermission');
  if (payoutStateDelta) changedFields.push('payoutState');
  if (livesDelta) changedFields.push('effectiveLives');
  if (fractionalLivesDelta) changedFields.push('fractionalLives');

  return {
    changedFields,
    modeDelta,
    tradabilityDelta,
    fullSizeDelta,
    payoutStateDelta,
    livesDelta,
    fractionalLivesDelta,
  };
}

function buildDerivedEvents(
  accountId: string,
  workflow: AccountWorkflowType,
  eventTimestamp: string,
  causalFactIds: string[],
  before: AccountOperationalSnapshot,
  after: AccountOperationalSnapshot,
  lifecycleBefore: LifecycleStage,
  lifecycleAfter: LifecycleStage,
): DerivedAccountSystemEvent[] {
  const events: DerivedAccountSystemEvent[] = [];

  if (lifecycleBefore !== lifecycleAfter) {
    events.push({
      eventType: 'lifecycle_stage_changed',
      accountId,
      eventTimestamp,
      causalWorkflow: workflow,
      causalFactIds,
      beforeValue: lifecycleBefore,
      afterValue: lifecycleAfter,
      severity: 'medium',
      summary: `Lifecycle changed from "${lifecycleBefore}" to "${lifecycleAfter}".`,
    });
  }

  if (before.mode !== after.mode) {
    events.push({
      eventType: 'mode_changed',
      accountId,
      eventTimestamp,
      causalWorkflow: workflow,
      causalFactIds,
      beforeValue: before.mode,
      afterValue: after.mode,
      severity: 'medium',
      summary: `Mode changed from "${before.mode}" to "${after.mode}".`,
    });
  }

  if (before.mayTrade !== after.mayTrade) {
    events.push({
      eventType: 'tradability_changed',
      accountId,
      eventTimestamp,
      causalWorkflow: workflow,
      causalFactIds,
      beforeValue: before.mayTrade,
      afterValue: after.mayTrade,
      severity: after.mayTrade ? 'resolved' : 'high',
      summary: after.mayTrade
        ? 'Account became tradable.'
        : 'Account is no longer tradable.',
    });
  }

  if (before.mayTradeFullSize !== after.mayTradeFullSize) {
    events.push({
      eventType: 'full_size_permission_changed',
      accountId,
      eventTimestamp,
      causalWorkflow: workflow,
      causalFactIds,
      beforeValue: before.mayTradeFullSize,
      afterValue: after.mayTradeFullSize,
      severity: after.mayTradeFullSize ? 'resolved' : 'medium',
      summary: after.mayTradeFullSize
        ? 'Full-size permission was restored.'
        : 'Full-size permission was removed.',
    });
  }

  if (before.payoutState !== after.payoutState) {
    events.push({
      eventType: after.payoutState ? 'payout_readiness_achieved' : 'payout_readiness_lost',
      accountId,
      eventTimestamp,
      causalWorkflow: workflow,
      causalFactIds,
      beforeValue: before.payoutState,
      afterValue: after.payoutState,
      severity: 'medium',
      summary: after.payoutState
        ? `Payout posture became "${after.payoutState}".`
        : 'Payout posture is no longer active.',
    });
  }

  return events;
}

function buildConsequenceSummary(
  headline: string,
  before: AccountOperationalSnapshot,
  after: AccountOperationalSnapshot,
  evaluation: AccountEvaluationResult | null,
  status: WorkflowStatus = 'success',
): AccountConsequenceSummary {
  const delta = diffSnapshots(before, after);

  return {
    headline,
    status,
    changedFields: delta.changedFields,
    modeDelta: delta.modeDelta,
    tradabilityDelta: delta.tradabilityDelta,
    fullSizeDelta: delta.fullSizeDelta,
    payoutStateDelta: delta.payoutStateDelta,
    livesDelta: delta.livesDelta,
    fractionalLivesDelta: delta.fractionalLivesDelta,
    alertsCreated: after.alertCodes.filter((code) => !before.alertCodes.includes(code)),
    alertsResolved: before.alertCodes.filter((code) => !after.alertCodes.includes(code)),
    nextRecommendedAction: evaluation?.nextAction ?? null,
    explanationReasons: evaluation?.explanationReasons ?? [],
  };
}

function blockedResult(
  accountId: string,
  workflow: AccountWorkflowType,
  headline: string,
  explanation: string,
): AccountWorkflowResult {
  return {
    accountId,
    workflow,
    persistedFactIds: [],
    evaluation: null,
    derivedEvents: [],
    invalidationKeys: [],
    consequenceSummary: {
      headline,
      status: 'blocked',
      changedFields: [],
      alertsCreated: [],
      alertsResolved: [],
      nextRecommendedAction: null,
      explanationReasons: [explanation],
    },
    degradedState: {
      code: 'workflow_blocked',
      severity: 'medium',
      message: explanation,
    },
  };
}

function standardStubDegradedState(persistedFactIds: string[]): WorkflowDegradedState {
  return {
    code: 'stubbed_step6_persistence',
    severity: 'low',
    message: 'This lifecycle workflow is populated for Step 7 consumption but is not yet backed by real repository/database persistence.',
    relatedFactIds: persistedFactIds,
  };
}

function invalidationForCreate(accountId: string): RefreshKey[] {
  return ['dashboard', `account:${accountId}`, 'journal'];
}

function invalidationForUpdate(accountId: string): RefreshKey[] {
  return [`account:${accountId}`, 'dashboard', 'journal', 'alerts', 'payouts', 'calendar'];
}

function invalidationForPauseResume(accountId: string): RefreshKey[] {
  return [`account:${accountId}`, 'dashboard', 'alerts', 'journal', 'calendar', 'payouts'];
}

function invalidationForRetire(accountId: string): RefreshKey[] {
  return [`account:${accountId}`, 'dashboard', 'alerts', 'journal', 'calendar', 'payouts'];
}

function isTransitionAllowed(from: LifecycleStage, to: LifecycleStage): boolean {
  if (from === to) {
    return true;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export class AccountLifecycleService {
  private readonly store = new Map<string, StoredLifecycleAccount>();

  constructor(seedAccounts: StoredLifecycleAccount[] = []) {
    for (const account of seedAccounts) {
      this.store.set(account.id, clone(account));
    }
  }

  listAccounts(): StoredLifecycleAccount[] {
    return Array.from(this.store.values()).map(clone);
  }

  loadAccount(accountId: string): AccountReadResult {
    const existing = this.store.get(accountId);

    if (!existing) {
      return {
        accountId,
        workflow: 'load_account',
        storedBundle: {
          account: {
            id: accountId,
            firmId: '',
            accountLabel: '',
            externalAccountRef: null,
            lifecycleStage: 'Draft / Created',
            accountStatus: 'missing',
            startingBalanceCents: 0,
            currentBalanceCents: 0,
            peakBalanceCents: 0,
            daysTradedReference: null,
            lastPayoutDate: null,
            feeRefunded: false,
            manuallyPaused: false,
            initialRuleProfileId: '',
            initialRuleProfileVersionId: '',
            currentRuleProfileId: '',
            currentRuleProfileVersionId: '',
            assignmentReason: '',
            createdAt: nowIso(),
            updatedAt: nowIso(),
            previousActiveLifecycleStage: null,
          },
        },
        evaluation: null,
        derivedEvents: [],
        invalidationKeys: [],
        consequenceSummary: {
          headline: 'Account could not be loaded.',
          status: 'blocked',
          changedFields: [],
          alertsCreated: [],
          alertsResolved: [],
          nextRecommendedAction: null,
          explanationReasons: ['Account id was not found in the lifecycle service store.'],
        },
        degradedState: {
          code: 'account_missing',
          severity: 'high',
          message: 'Account could not be loaded because the reference is missing.',
        },
        historyIntegrityMarkers: [
          {
            code: 'missing_account_reference',
            severity: 'high',
            message: 'Account could not be loaded because the reference is missing.',
          },
        ],
      };
    }

    const evaluation = buildEvaluation(existing);

    return {
      accountId,
      workflow: 'load_account',
      storedBundle: {
        account: clone(existing),
      },
      evaluation,
      derivedEvents: [],
      invalidationKeys: [],
      consequenceSummary: {
        headline: 'Account loaded.',
        status: 'success',
        changedFields: [],
        alertsCreated: [],
        alertsResolved: [],
        nextRecommendedAction: evaluation.nextAction,
        explanationReasons: evaluation.explanationReasons,
      },
      degradedState: standardStubDegradedState([]),
      historyIntegrityMarkers: [],
    };
  }

  createAccount(command: CreateAccountCommand): AccountWorkflowResult {
    if (!command.accountLabel || !command.accountLabel.trim()) {
      return blockedResult('unknown', 'create_account', 'Account could not be created.', 'Account label is required.');
    }

    if (command.startingBalanceCents <= 0) {
      return blockedResult('unknown', 'create_account', 'Account could not be created.', 'Starting balance must be positive.');
    }

    const duplicate = Array.from(this.store.values()).some(
      (account) => account.accountLabel.toLowerCase() === command.accountLabel.trim().toLowerCase(),
    );

    if (duplicate) {
      return blockedResult('unknown', 'create_account', 'Account could not be created.', 'Account label must be unique.');
    }

    const accountId = makeId('acct');
    const factId = makeId('fact_account');
    const assignmentId = makeId('fact_profile_assignment');
    const snapshotId = makeId('fact_balance_snapshot');
    const auditId = makeId('audit_account_created');
    const createdAt = command.createdAt ?? nowIso();

    const stored: StoredLifecycleAccount = {
      id: accountId,
      firmId: command.firmId,
      accountLabel: command.accountLabel.trim(),
      externalAccountRef: normalizeOptionalString(command.externalAccountRef),
      lifecycleStage: command.lifecycleStage,
      accountStatus: command.accountStatus ?? 'active',
      startingBalanceCents: command.startingBalanceCents,
      currentBalanceCents: command.currentBalanceCents ?? command.startingBalanceCents,
      peakBalanceCents: command.peakBalanceCents ?? (command.currentBalanceCents ?? command.startingBalanceCents),
      daysTradedReference: command.daysTradedReference ?? null,
      lastPayoutDate: command.lastPayoutDate ?? null,
      feeRefunded: command.feeRefunded ?? false,
      manuallyPaused: command.manuallyPaused ?? false,
      initialRuleProfileId: command.initialRuleProfileId,
      initialRuleProfileVersionId: command.initialRuleProfileVersionId,
      currentRuleProfileId: command.initialRuleProfileId,
      currentRuleProfileVersionId: command.initialRuleProfileVersionId,
      assignmentReason: command.assignmentReason,
      createdAt,
      updatedAt: createdAt,
      previousActiveLifecycleStage: command.lifecycleStage === 'Paused / Inactive'
        ? 'Draft / Created'
        : command.lifecycleStage,
    };

    this.store.set(accountId, clone(stored));

    const evaluation = buildEvaluation(stored);
    const after = toSnapshot(evaluation);
    const before = toSnapshot(null);
    const persistedFactIds = [factId, assignmentId, snapshotId, auditId];

    const result: AccountWorkflowResult = {
      accountId,
      workflow: 'create_account',
      persistedFactIds,
      evaluation,
      derivedEvents: buildDerivedEvents(
        accountId,
        'create_account',
        createdAt,
        persistedFactIds,
        before,
        after,
        'Draft / Created',
        stored.lifecycleStage,
      ),
      invalidationKeys: invalidationForCreate(accountId),
      consequenceSummary: buildConsequenceSummary(
        `Account "${stored.accountLabel}" was created.`,
        before,
        after,
        evaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };

    return result;
  }

  updateAccountBasics(command: UpdateAccountBasicsCommand): AccountWorkflowResult {
    const existing = this.store.get(command.accountId);
    if (!existing) {
      return blockedResult(command.accountId, 'update_account_basics', 'Account update was blocked.', 'Account was not found.');
    }

    const beforeEvaluation = buildEvaluation(existing);
    const beforeSnapshot = toSnapshot(beforeEvaluation);
    const lifecycleBefore = existing.lifecycleStage;

    if (command.lifecycleStage && !isTransitionAllowed(existing.lifecycleStage, command.lifecycleStage)) {
      return blockedResult(
        command.accountId,
        'update_account_basics',
        'Account update was blocked.',
        `Lifecycle transition from "${existing.lifecycleStage}" to "${command.lifecycleStage}" is not allowed.`,
      );
    }

    const updated = clone(existing);
    updated.accountLabel = command.accountLabel?.trim() || updated.accountLabel;
    updated.externalAccountRef = command.externalAccountRef !== undefined
      ? normalizeOptionalString(command.externalAccountRef)
      : updated.externalAccountRef;
    updated.lifecycleStage = command.lifecycleStage ?? updated.lifecycleStage;
    updated.currentBalanceCents = command.currentBalanceCents ?? updated.currentBalanceCents;
    updated.peakBalanceCents = command.peakBalanceCents ?? updated.peakBalanceCents;
    updated.lastPayoutDate = command.lastPayoutDate !== undefined ? command.lastPayoutDate : updated.lastPayoutDate;
    updated.feeRefunded = command.feeRefunded ?? updated.feeRefunded;
    updated.manuallyPaused = command.manuallyPaused ?? updated.manuallyPaused;
    updated.updatedAt = command.eventTimestamp ?? nowIso();

    this.store.set(updated.id, clone(updated));

    const afterEvaluation = buildEvaluation(updated);
    const afterSnapshot = toSnapshot(afterEvaluation);
    const persistedFactIds = [makeId('fact_account_update'), makeId('audit_account_updated')];

    return {
      accountId: updated.id,
      workflow: 'update_account_basics',
      persistedFactIds,
      evaluation: afterEvaluation,
      derivedEvents: buildDerivedEvents(
        updated.id,
        'update_account_basics',
        updated.updatedAt,
        persistedFactIds,
        beforeSnapshot,
        afterSnapshot,
        lifecycleBefore,
        updated.lifecycleStage,
      ),
      invalidationKeys: invalidationForUpdate(updated.id),
      consequenceSummary: buildConsequenceSummary(
        `Account "${updated.accountLabel}" was updated.`,
        beforeSnapshot,
        afterSnapshot,
        afterEvaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };
  }

  pauseAccount(command: PauseAccountCommand): AccountWorkflowResult {
    const existing = this.store.get(command.accountId);
    if (!existing) {
      return blockedResult(command.accountId, 'pause_account', 'Pause was blocked.', 'Account was not found.');
    }

    if (existing.lifecycleStage === 'Retired / Archived') {
      return blockedResult(command.accountId, 'pause_account', 'Pause was blocked.', 'Archived accounts cannot be paused.');
    }

    if (existing.manuallyPaused || existing.lifecycleStage === 'Paused / Inactive') {
      return blockedResult(command.accountId, 'pause_account', 'Pause was blocked.', 'Account is already paused.');
    }

    const targetStage: LifecycleStage = 'Paused / Inactive';
    if (!isTransitionAllowed(existing.lifecycleStage, targetStage)) {
      return blockedResult(
        command.accountId,
        'pause_account',
        'Pause was blocked.',
        `Lifecycle transition from "${existing.lifecycleStage}" to "${targetStage}" is not allowed.`,
      );
    }

    const beforeEvaluation = buildEvaluation(existing);
    const beforeSnapshot = toSnapshot(beforeEvaluation);

    const updated = clone(existing);
    updated.previousActiveLifecycleStage = existing.lifecycleStage;
    updated.manuallyPaused = true;
    updated.lifecycleStage = 'Paused / Inactive';
    updated.accountStatus = 'paused';
    updated.updatedAt = command.eventTimestamp;

    this.store.set(updated.id, clone(updated));

    const afterEvaluation = buildEvaluation(updated);
    const afterSnapshot = toSnapshot(afterEvaluation);
    const persistedFactIds = [makeId('fact_pause'), makeId('audit_account_paused')];

    return {
      accountId: updated.id,
      workflow: 'pause_account',
      persistedFactIds,
      evaluation: afterEvaluation,
      derivedEvents: buildDerivedEvents(
        updated.id,
        'pause_account',
        command.eventTimestamp,
        persistedFactIds,
        beforeSnapshot,
        afterSnapshot,
        existing.lifecycleStage,
        updated.lifecycleStage,
      ),
      invalidationKeys: invalidationForPauseResume(updated.id),
      consequenceSummary: buildConsequenceSummary(
        `Account "${updated.accountLabel}" was paused.`,
        beforeSnapshot,
        afterSnapshot,
        afterEvaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };
  }

  resumeAccount(command: ResumeAccountCommand): AccountWorkflowResult {
    const existing = this.store.get(command.accountId);
    if (!existing) {
      return blockedResult(command.accountId, 'resume_account', 'Resume was blocked.', 'Account was not found.');
    }

    if (!existing.manuallyPaused && existing.lifecycleStage !== 'Paused / Inactive') {
      return blockedResult(command.accountId, 'resume_account', 'Resume was blocked.', 'Account is not paused.');
    }

    const restoreStage = existing.previousActiveLifecycleStage ?? 'Funded / Active';
    if (!isTransitionAllowed(existing.lifecycleStage, restoreStage)) {
      return blockedResult(
        command.accountId,
        'resume_account',
        'Resume was blocked.',
        `Lifecycle transition from "${existing.lifecycleStage}" to "${restoreStage}" is not allowed.`,
      );
    }

    const beforeEvaluation = buildEvaluation(existing);
    const beforeSnapshot = toSnapshot(beforeEvaluation);

    const updated = clone(existing);
    updated.manuallyPaused = false;
    updated.lifecycleStage = restoreStage;
    updated.accountStatus = 'active';
    updated.updatedAt = command.eventTimestamp;

    this.store.set(updated.id, clone(updated));

    const afterEvaluation = buildEvaluation(updated);
    const afterSnapshot = toSnapshot(afterEvaluation);
    const persistedFactIds = [makeId('fact_resume'), makeId('audit_account_resumed')];

    return {
      accountId: updated.id,
      workflow: 'resume_account',
      persistedFactIds,
      evaluation: afterEvaluation,
      derivedEvents: buildDerivedEvents(
        updated.id,
        'resume_account',
        command.eventTimestamp,
        persistedFactIds,
        beforeSnapshot,
        afterSnapshot,
        existing.lifecycleStage,
        updated.lifecycleStage,
      ),
      invalidationKeys: invalidationForPauseResume(updated.id),
      consequenceSummary: buildConsequenceSummary(
        `Account "${updated.accountLabel}" was resumed.`,
        beforeSnapshot,
        afterSnapshot,
        afterEvaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };
  }

  retireAccount(command: RetireAccountCommand): AccountWorkflowResult {
    const existing = this.store.get(command.accountId);
    if (!existing) {
      return blockedResult(command.accountId, 'retire_account', 'Retire was blocked.', 'Account was not found.');
    }

    if (!isTransitionAllowed(existing.lifecycleStage, 'Retired / Archived')) {
      return blockedResult(
        command.accountId,
        'retire_account',
        'Retire was blocked.',
        `Lifecycle transition from "${existing.lifecycleStage}" to "Retired / Archived" is not allowed.`,
      );
    }

    const beforeEvaluation = buildEvaluation(existing);
    const beforeSnapshot = toSnapshot(beforeEvaluation);

    const updated = clone(existing);
    updated.lifecycleStage = 'Retired / Archived';
    updated.manuallyPaused = false;
    updated.accountStatus = 'archived';
    updated.updatedAt = command.eventTimestamp;

    this.store.set(updated.id, clone(updated));

    const afterEvaluation = buildEvaluation(updated);
    const afterSnapshot = toSnapshot(afterEvaluation);
    const persistedFactIds = [makeId('fact_retire'), makeId('audit_account_retired')];

    return {
      accountId: updated.id,
      workflow: 'retire_account',
      persistedFactIds,
      evaluation: afterEvaluation,
      derivedEvents: buildDerivedEvents(
        updated.id,
        'retire_account',
        command.eventTimestamp,
        persistedFactIds,
        beforeSnapshot,
        afterSnapshot,
        existing.lifecycleStage,
        updated.lifecycleStage,
      ),
      invalidationKeys: invalidationForRetire(updated.id),
      consequenceSummary: buildConsequenceSummary(
        `Account "${updated.accountLabel}" was archived.`,
        beforeSnapshot,
        afterSnapshot,
        afterEvaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };
  }

  updateLifecycleStage(command: UpdateLifecycleStageCommand): AccountWorkflowResult {
    const existing = this.store.get(command.accountId);
    if (!existing) {
      return blockedResult(command.accountId, 'update_lifecycle_stage', 'Lifecycle update was blocked.', 'Account was not found.');
    }

    if (!isTransitionAllowed(existing.lifecycleStage, command.nextLifecycleStage)) {
      return blockedResult(
        command.accountId,
        'update_lifecycle_stage',
        'Lifecycle update was blocked.',
        `Lifecycle transition from "${existing.lifecycleStage}" to "${command.nextLifecycleStage}" is not allowed.`,
      );
    }

    const beforeEvaluation = buildEvaluation(existing);
    const beforeSnapshot = toSnapshot(beforeEvaluation);

    const updated = clone(existing);
    updated.lifecycleStage = command.nextLifecycleStage;
    updated.manuallyPaused = command.nextLifecycleStage === 'Paused / Inactive' ? true : updated.manuallyPaused;
    updated.accountStatus = command.nextLifecycleStage === 'Retired / Archived'
      ? 'archived'
      : command.nextLifecycleStage === 'Paused / Inactive'
        ? 'paused'
        : 'active';
    updated.updatedAt = command.eventTimestamp;

    if (command.nextLifecycleStage !== 'Paused / Inactive' && existing.lifecycleStage !== 'Paused / Inactive') {
      updated.previousActiveLifecycleStage = command.nextLifecycleStage;
    }

    this.store.set(updated.id, clone(updated));

    const afterEvaluation = buildEvaluation(updated);
    const afterSnapshot = toSnapshot(afterEvaluation);
    const persistedFactIds = [makeId('fact_lifecycle_update'), makeId('audit_lifecycle_updated')];

    return {
      accountId: updated.id,
      workflow: 'update_lifecycle_stage',
      persistedFactIds,
      evaluation: afterEvaluation,
      derivedEvents: buildDerivedEvents(
        updated.id,
        'update_lifecycle_stage',
        command.eventTimestamp,
        persistedFactIds,
        beforeSnapshot,
        afterSnapshot,
        existing.lifecycleStage,
        updated.lifecycleStage,
      ),
      invalidationKeys: invalidationForUpdate(updated.id),
      consequenceSummary: buildConsequenceSummary(
        `Lifecycle for "${updated.accountLabel}" was updated to "${updated.lifecycleStage}".`,
        beforeSnapshot,
        afterSnapshot,
        afterEvaluation,
      ),
      degradedState: standardStubDegradedState(persistedFactIds),
    };
  }
}

export const accountLifecycleService = new AccountLifecycleService();
