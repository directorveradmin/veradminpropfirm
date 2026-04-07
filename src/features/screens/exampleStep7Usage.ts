import { AccountLifecycleService } from '../../lib/services/accountLifecycleService';
import { ProfileAssignmentService } from '../../lib/services/profileAssignmentService';
import { AccountEventWorkflowService } from '../../lib/services/accountEventWorkflowService';
import { PayoutWorkflowService } from '../../lib/services/payoutWorkflowService';

async function runExample() {
  const lifecycle = new AccountLifecycleService();
  const profileSvc = new ProfileAssignmentService();
  const workflow = new AccountEventWorkflowService();
  const payout = new PayoutWorkflowService();

  const pauseResult = await lifecycle.pauseAccount({ accountId: 'A1', eventTimestamp: new Date().toISOString(), reason: 'Testing pause' });
  const profileResult = await profileSvc.assignProfile({ accountId: 'A1', ruleProfileId: 'RP1', ruleProfileVersionId: 'RPV1', assignedAt: new Date().toISOString(), assignmentReason: 'Test', assignedBy: 'user' });
  const tradeResult = await workflow.logTrade({ accountId: 'A1', tradingTimestamp: new Date().toISOString(), tradeDate: new Date().toISOString(), session: 'AM', direction: 'long', resultType: 'win', pnlAmountCents: 1000, source: 'manual' });
  const noteResult = await workflow.addNote({ accountId: 'A1', noteType: 'general', body: 'Test note' });
  const payoutResult = await payout.requestPayout({ accountId: 'A1', requestedAt: new Date().toISOString(), amountRequestedCents: 5000 });

  console.log({ pauseResult, profileResult, tradeResult, noteResult, payoutResult });
}

runExample();
