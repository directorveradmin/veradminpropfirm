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
      invalidationKeys: [ccount:, 'dashboard', 'journal', 'alerts', 'payouts', 'calendar'],
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
      invalidationKeys: [ccount:, 'journal'],
      consequenceSummary: { headline: 'Note added', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: false, alertsChanged: false, livesChanged: false }, explanationReasons: ['Contextual note added'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
