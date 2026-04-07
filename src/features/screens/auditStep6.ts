import { AccountLifecycleService } from '../../lib/services/accountLifecycleService';
import { ProfileAssignmentService } from '../../lib/services/profileAssignmentService';
import { AccountEventWorkflowService } from '../../lib/services/accountEventWorkflowService';
import { PayoutWorkflowService } from '../../lib/services/payoutWorkflowService';
import { AccountHistoryIntegrityService } from '../../lib/services/accountHistoryIntegrityService';

async function runAudit() {
  const lifecycle = new AccountLifecycleService();
  const profile = new ProfileAssignmentService();
  const workflow = new AccountEventWorkflowService();
  const payout = new PayoutWorkflowService();
  const integrity = new AccountHistoryIntegrityService();

  const integrityEvents = await integrity.checkIntegrity('A1');
  console.log('Integrity events:', integrityEvents);
}

runAudit();
