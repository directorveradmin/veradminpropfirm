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
      invalidationKeys: [ccount:, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
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
      invalidationKeys: [ccount:, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
      consequenceSummary: { headline: 'Payout received', changed: { modeChanged: false, tradabilityChanged: false, fullSizePermissionChanged: false, payoutStateChanged: true, alertsChanged: false, livesChanged: false }, explanationReasons: ['Payout marked received'] },
      degradedState: null
    };
    await step6ViewModelIntegrator.refresh([result]);
    return result;
  }
}
