// step6ViewModelIntegrator.ts
// Fully updated for Node ESM / ts-node after moving accountWorkflowTypes.ts back to services/

import {
  AccountWorkflowResult,
  CreateAccountCommand,
  PauseAccountCommand,
  ResumeAccountCommand,
  AssignRuleProfileCommand,
  LogTradeResultCommand,
  AddAccountNoteCommand,
  RequestPayoutCommand,
  MarkPayoutReceivedCommand
} from '../accountWorkflowTypes';

import { AccountLifecycleService } from '../accountLifecycleService';
import { ProfileAssignmentService } from '../profileAssignmentService';
import { AccountEventWorkflowService } from '../accountEventWorkflowService';
import { PayoutWorkflowService } from '../payoutWorkflowService';
import { AccountHistoryIntegrityService } from '../accountHistoryIntegrityService';

export class Step6ViewModelIntegrator {
  private lifecycleService = new AccountLifecycleService();
  private profileService = new ProfileAssignmentService();
  private eventService = new AccountEventWorkflowService();
  private payoutService = new PayoutWorkflowService();
  private historyService = new AccountHistoryIntegrityService();

  executeWorkflow(workflowMethod: () => AccountWorkflowResult) {
    const result: AccountWorkflowResult = workflowMethod();
    // TODO: handle invalidation keys and call Step 5 view-model refreshes
    return result;
  }

  createAccount(command: CreateAccountCommand) {
    return this.executeWorkflow(() => this.lifecycleService.createAccount(command));
  }

  pauseAccount(command: PauseAccountCommand) {
    return this.executeWorkflow(() => this.lifecycleService.pauseAccount(command));
  }

  resumeAccount(command: ResumeAccountCommand) {
    return this.executeWorkflow(() => this.lifecycleService.resumeAccount(command));
  }

  assignProfile(command: AssignRuleProfileCommand) {
    return this.executeWorkflow(() => this.profileService.assignRuleProfile(command));
  }

  logTrade(command: LogTradeResultCommand) {
    return this.executeWorkflow(() => this.eventService.logTradeResult(command));
  }

  addNote(command: AddAccountNoteCommand) {
    return this.executeWorkflow(() => this.eventService.addNote(command));
  }

  requestPayout(command: RequestPayoutCommand) {
    return this.executeWorkflow(() => this.payoutService.requestPayout(command));
  }

  markPayoutReceived(command: MarkPayoutReceivedCommand) {
    return this.executeWorkflow(() => this.payoutService.markPayoutReceived(command));
  }

  ensureHistoryIntegrity(accountId: string) {
    return this.executeWorkflow(() => this.historyService.ensureHistoryIntegrity(accountId));
  }
}