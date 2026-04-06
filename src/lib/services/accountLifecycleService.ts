import { AccountWorkflowResult, CreateAccountCommand, PauseAccountCommand, ResumeAccountCommand } from './accountWorkflowTypes';

export class AccountLifecycleService {
    createAccount(command: CreateAccountCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'createAccount',
            consequenceSummary: 'Account created with initial profile assignment',
            invalidationKeys: ['account:' + command.accountId, 'dashboard', 'journal'],
            persistedFactIds: ['fact-001'],
            derivedEvents: ['initialProfileAssigned']
        };
    }

    pauseAccount(command: PauseAccountCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'pauseAccount',
            consequenceSummary: 'Account paused',
            invalidationKeys: ['account:' + command.accountId, 'dashboard'],
            persistedFactIds: ['fact-002'],
            derivedEvents: ['accountPaused']
        };
    }

    resumeAccount(command: ResumeAccountCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'resumeAccount',
            consequenceSummary: 'Account resumed',
            invalidationKeys: ['account:' + command.accountId, 'dashboard'],
            persistedFactIds: ['fact-003'],
            derivedEvents: ['accountResumed']
        };
    }
}
