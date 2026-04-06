import { AccountWorkflowResult, RequestPayoutCommand, MarkPayoutReceivedCommand } from './accountWorkflowTypes';

export class PayoutWorkflowService {
    requestPayout(command: RequestPayoutCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'requestPayout',
            consequenceSummary: 'Payout requested',
            invalidationKeys: ['account:' + command.accountId, 'payouts'],
            persistedFactIds: ['fact-007'],
            derivedEvents: ['payoutRequested']
        };
    }

    markPayoutReceived(command: MarkPayoutReceivedCommand): AccountWorkflowResult {
        return {
            accountId: command.accountId,
            workflow: 'markPayoutReceived',
            consequenceSummary: 'Payout received',
            invalidationKeys: ['account:' + command.accountId, 'payouts'],
            persistedFactIds: ['fact-008'],
            derivedEvents: ['payoutReceived']
        };
    }
}
