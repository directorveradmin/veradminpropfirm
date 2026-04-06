import { AccountWorkflowResult, AssignRuleProfileCommand } from './accountWorkflowTypes';

export class ProfileAssignmentService {
    assignRuleProfile(command: AssignRuleProfileCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'assignRuleProfile',
            consequenceSummary: 'Profile assignment updated',
            invalidationKeys: ['account:' + command.accountId, 'dashboard', 'journal'],
            persistedFactIds: ['fact-004'],
            derivedEvents: ['profileAssigned']
        };
    }
}
