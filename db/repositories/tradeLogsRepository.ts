import { LogTradeResultCommand } from '../../src/lib/services/accountWorkflowTypes';

export class TradeLogsRepository {
    insertTradeLog(command: LogTradeResultCommand): string {
        // TODO: insert trade log row
        return '';
    }

    getRecentTrades(accountId: string, limit = 10) {
        // TODO: fetch last 'limit' trades
        return [];
    }
}
