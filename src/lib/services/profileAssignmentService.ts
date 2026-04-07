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
      invalidationKeys: [ccount:, 'dashboard', 'alerts', 'journal', 'payouts', 'calendar'],
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
