import { AssignRuleProfileCommand } from '../../src/lib/services/accountWorkflowTypes';

export class AccountProfileAssignmentsRepository {
    createProfileAssignment(command: AssignRuleProfileCommand): string {
        // TODO: insert a new profile assignment row
        // Return inserted row id
        return '';
    }

    closeOpenAssignment(accountId: string, endedAt: string): void {
        // TODO: close any existing open profile assignment for account
    }

    getOpenAssignment(accountId: string) {
        // TODO: return current open assignment or null
        return null;
    }
}
