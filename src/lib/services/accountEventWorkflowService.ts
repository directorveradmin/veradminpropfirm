import { AccountWorkflowResult, LogTradeResultCommand, AddAccountNoteCommand } from './accountWorkflowTypes';

export class AccountEventWorkflowService {
    logTradeResult(command: LogTradeResultCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'logTradeResult',
            consequenceSummary: 'Trade logged and balances updated',
            invalidationKeys: ['account:' + command.accountId, 'journal', 'dashboard'],
            persistedFactIds: ['fact-005'],
            derivedEvents: ['tradeLogged']
        };
    }

    addNote(command: AddAccountNoteCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'addNote',
            consequenceSummary: 'Note added to account',
            invalidationKeys: ['account:' + command.accountId, 'journal'],
            persistedFactIds: ['fact-006'],
            derivedEvents: ['noteAdded']
        };
    }
}
