import { RequestPayoutCommand, MarkPayoutReceivedCommand } from '../../src/lib/services/accountWorkflowTypes';

export class PayoutRequestsRepository {
    createPayoutRequest(command: RequestPayoutCommand): string {
        // TODO: insert payout request row
        return '';
    }

    markPayoutPaid(command: MarkPayoutReceivedCommand): void {
        // TODO: update payout request row to mark as paid
    }

    getRecentPayouts(accountId: string, limit = 10) {
        // TODO: fetch recent payout requests
        return [];
    }
}
