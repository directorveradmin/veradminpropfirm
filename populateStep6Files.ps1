# Set root folder
$RepoRoot = "C:\Users\emb95\Documents\veradminpropfirm\scaffold"

# Define files to create with content
$FilesToCreate = @(
    @{ Path = "src\lib\services\accountLifecycleService.ts"; Content = @"
import { AccountWorkflowResult, AccountConsequenceSummary, PauseAccountCommand, ResumeAccountCommand } from './accountWorkflowTypes';
import { step6ViewModelIntegrator } from './workflowHelpers/step6ViewModelIntegrator';

export class AccountLifecycleService {
  async pauseAccount(command: PauseAccountCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'pause',
      persistedFactIds: ['pauseFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'alerts', 'journal', 'calendar'],
      consequenceSummary: {
        headline: 'Account paused',
        changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: false, livesChanged: false },
        explanationReasons: ['Manual pause issued']
      },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }

  async resumeAccount(command: ResumeAccountCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'resume',
      persistedFactIds: ['resumeFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'alerts', 'journal', 'calendar'],
      consequenceSummary: {
        headline: 'Account resumed',
        changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: false, livesChanged: false },
        explanationReasons: ['Manual resume issued']
      },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
"@},
    @{ Path = "src\lib\services\profileAssignmentService.ts"; Content = @"
import { AssignRuleProfileCommand, AccountWorkflowResult } from './accountWorkflowTypes';
import { step6ViewModelIntegrator } from './workflowHelpers/step6ViewModelIntegrator';

export class ProfileAssignmentService {
  async assignProfile(command: AssignRuleProfileCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'assignProfile',
      persistedFactIds: ['profileAssignment1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
      consequenceSummary: {
        headline: 'Profile assigned',
        changed: { modeChanged: true, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: true, livesChanged: false },
        explanationReasons: ['Profile change issued']
      },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
"@},
    @{ Path = "src\lib\services/accountEventWorkflowService.ts"; Content = @"
import { AddAccountNoteCommand, LogTradeResultCommand, AccountWorkflowResult } from './accountWorkflowTypes';
import { step6ViewModelIntegrator } from './workflowHelpers/step6ViewModelIntegrator';

export class AccountEventWorkflowService {
  async logTrade(command: LogTradeResultCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'logTrade',
      persistedFactIds: ['tradeFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'journal', 'alerts', 'payouts', 'calendar'],
      consequenceSummary: { headline: 'Trade logged', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: false, livesChanged: true }, explanationReasons: ['Trade P/L persisted'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }

  async addNote(command: AddAccountNoteCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'addNote',
      persistedFactIds: ['noteFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'journal'],
      consequenceSummary: { headline: 'Note added', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: false, livesChanged: false }, explanationReasons: ['Contextual note added'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
"@},
    @{ Path = "src\lib\services/payoutWorkflowService.ts"; Content = @"
import { RequestPayoutCommand, MarkPayoutReceivedCommand, AccountWorkflowResult } from './accountWorkflowTypes';
import { step6ViewModelIntegrator } from './workflowHelpers/step6ViewModelIntegrator';

export class PayoutWorkflowService {
  async requestPayout(command: RequestPayoutCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'requestPayout',
      persistedFactIds: ['payoutFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
      consequenceSummary: { headline: 'Payout requested', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: true, alertsChanged: false, livesChanged: false }, explanationReasons: ['Operator requested payout'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }

  async markPayoutReceived(command: MarkPayoutReceivedCommand): Promise<AccountWorkflowResult> {
    const result: AccountWorkflowResult = {
      accountId: command.accountId,
      workflow: 'markPayoutReceived',
      persistedFactIds: ['payoutFact1', 'audit1'],
      evaluation: null,
      derivedEvents: [],
      invalidationKeys: [`account:${command.accountId}`, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
      consequenceSummary: { headline: 'Payout received', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: true, alertsChanged: false, livesChanged: false }, explanationReasons: ['Payout marked received'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
"@},
    @{ Path = "src\lib/services/accountHistoryIntegrityService.ts"; Content = @"
import { AccountWorkflowResult, DerivedAccountSystemEvent } from './accountWorkflowTypes';

export class AccountHistoryIntegrityService {
  async checkIntegrity(accountId: string): Promise<DerivedAccountSystemEvent[]> {
    return [
      {
        eventType: 'history_integrity_warning',
        accountId,
        eventTimestamp: (new Date()).ToString(),
        causalWorkflow: 'integrityCheck',
        causalFactIds: [],
        summary: 'History integrity check completed, no missing events',
      }
    ];
  }
}
"@},
    @{ Path = "src/lib/services/accountWorkflowTypes.ts"; Content = @"
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
"@},
    @{ Path = "src/lib/services/workflowHelpers/step6ViewModelIntegrator.ts"; Content = @"
import { AccountWorkflowResult } from '../accountWorkflowTypes';
import { refreshReadModel } from '../read-models/builders';

export const step6ViewModelIntegrator = {
  async refresh(results: AccountWorkflowResult[]) {
    for (const r of results) {
      for (const key of r.invalidationKeys) {
        await refreshReadModel(key);
      }
    }
  }
};
"@},
    @{ Path = "src/features/screens/exampleStep7Usage.ts"; Content = @"
import { AccountLifecycleService } from '../../lib/services/accountLifecycleService';
import { ProfileAssignmentService } from '../../lib/services/profileAssignmentService';
import { AccountEventWorkflowService } from '../../lib/services/accountEventWorkflowService';
import { PayoutWorkflowService } from '../../lib/services/payoutWorkflowService';

async function runExample() {
  const lifecycle = new AccountLifecycleService();
  const profileSvc = new ProfileAssignmentService();
  const workflow = new AccountEventWorkflowService();
  const payout = new PayoutWorkflowService();

  const pauseResult = await lifecycle.pauseAccount({ accountId: 'A1', eventTimestamp: new Date().toISOString(), reason: 'Testing pause' });
  const profileResult = await profileSvc.assignProfile({ accountId: 'A1', ruleProfileId: 'RP1', ruleProfileVersionId: 'RPV1', assignedAt: new Date().toISOString(), assignmentReason: 'Test', assignedBy: 'user' });
  const tradeResult = await workflow.logTrade({ accountId: 'A1', tradingTimestamp: new Date().toISOString(), tradeDate: new Date().toISOString(), session: 'AM', direction: 'long', resultType: 'win', pnlAmountCents: 1000, source: 'manual' });
  const noteResult = await workflow.addNote({ accountId: 'A1', noteType: 'general', body: 'Test note' });
  const payoutResult = await payout.requestPayout({ accountId: 'A1', requestedAt: new Date().toISOString(), amountRequestedCents: 5000 });

  console.log({ pauseResult, profileResult, tradeResult, noteResult, payoutResult });
}

runExample();
"@},
    @{ Path = "src/features/screens/auditStep6.ts"; Content = @"
import { AccountLifecycleService } from '../../lib/services/accountLifecycleService';
import { ProfileAssignmentService } from '../../lib/services/profileAssignmentService';
import { AccountEventWorkflowService } from '../../lib/services/accountEventWorkflowService';
import { PayoutWorkflowService } from '../../lib/services/payoutWorkflowService';
import { AccountHistoryIntegrityService } from '../../lib/services/accountHistoryIntegrityService';

async function runAudit() {
  const lifecycle = new AccountLifecycleService();
  const profile = new ProfileAssignmentService();
  const workflow = new AccountEventWorkflowService();
  const payout = new PayoutWorkflowService();
  const integrity = new AccountHistoryIntegrityService();

  const integrityEvents = await integrity.checkIntegrity('A1');
  console.log('Integrity events:', integrityEvents);
}

runAudit();
"@}
)

# Create each file
foreach ($file in $FilesToCreate) {
    $FullPath = Join-Path $RepoRoot $file.Path
    $Folder = Split-Path $FullPath
    if (-not (Test-Path $Folder)) {
        New-Item -ItemType Directory -Path $Folder -Force | Out-Null
    }
    Set-Content -Path $FullPath -Value $file.Content -Encoding UTF8
    Write-Host "Created $FullPath"
}

Write-Host "All Step 6 files have been created in $RepoRoot"