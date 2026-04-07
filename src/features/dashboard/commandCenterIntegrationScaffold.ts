/**
 * Step 7 - Command Center integration scaffold
 *
 * This scaffold shows the dashboard-side orchestration only.
 * It deliberately avoids re-implementing Step 6 logic.
 * Replace placeholder types with the real Step 5 / Step 6 modules when wiring into the repo.
 */

import type {
  CommandCenterScreenViewModel,
  RefreshableStep5ViewModels,
  WorkflowSummaryBridgeViewModel,
  DashboardReturnContext,
  AccountDetailBridgeViewModel,
} from '../../lib/view-models/dashboard/commandCenterViewModels.js'

/**
 * Minimal shape expected from Step 6.
 * Replace with the real import from:
 *   src/lib/services/accountWorkflowTypes.ts
 */
export interface Step6AccountWorkflowResult {
  accountId: string
  workflow: string
  invalidationKeys: string[]
  derivedEvents: Array<{
    eventType: string
    summary: string
    severity?: 'critical' | 'high' | 'medium' | 'low' | 'resolved' | null
  }>
  consequenceSummary: {
    headline: string
    status?: 'success' | 'partial' | 'blocked'
    changedFields?: string[]
    alertsCreated?: string[]
    alertsResolved?: string[]
    nextRecommendedAction?: string | null
  }
  degradedState?: {
    code?: string
    message?: string
  } | null
}

/**
 * Minimal Step 6 integrator contract for screen wiring.
 * Replace with the real import from:
 *   src/lib/services/workflowHelpers/step6ViewModelIntegrator.ts
 */
export interface Step6ViewModelIntegrator {
  logWin(command: unknown): Promise<Step6AccountWorkflowResult>
  logLoss(command: unknown): Promise<Step6AccountWorkflowResult>
  logCustomEvent(command: unknown): Promise<Step6AccountWorkflowResult>
  addNote(command: unknown): Promise<Step6AccountWorkflowResult>
  requestPayout(command: unknown): Promise<Step6AccountWorkflowResult>
  pauseAccount(command: unknown): Promise<Step6AccountWorkflowResult>
  resumeAccount(command: unknown): Promise<Step6AccountWorkflowResult>
}

export interface CommandCenterControllerDeps {
  step6: Step6ViewModelIntegrator
  step5Refresh: RefreshableStep5ViewModels
  openToast(summary: WorkflowSummaryBridgeViewModel): void
  setDashboard(vm: CommandCenterScreenViewModel): void
  setAccountDetail(vm: AccountDetailBridgeViewModel | null): void
}

export class CommandCenterController {
  constructor(private readonly deps: CommandCenterControllerDeps) {}

  async afterWorkflow(result: Step6AccountWorkflowResult): Promise<void> {
    const workflowSummary = this.toWorkflowSummary(result)

    this.deps.openToast(workflowSummary)
    await this.applyInvalidations(result)
    await this.refreshVisibleSurfaces(result, workflowSummary)
  }

  private toWorkflowSummary(result: Step6AccountWorkflowResult): WorkflowSummaryBridgeViewModel {
    return {
      accountId: result.accountId,
      workflow: result.workflow,
      headline: result.consequenceSummary.headline,
      status: result.consequenceSummary.status ?? 'success',
      changedFields: result.consequenceSummary.changedFields ?? [],
      alertsCreated: result.consequenceSummary.alertsCreated ?? [],
      alertsResolved: result.consequenceSummary.alertsResolved ?? [],
      nextRecommendedAction: result.consequenceSummary.nextRecommendedAction ?? null,
    }
  }

  private async applyInvalidations(result: Step6AccountWorkflowResult): Promise<void> {
    for (const key of result.invalidationKeys) {
      if (key === 'dashboard') continue
      if (key.startsWith('account:')) continue

      switch (key) {
        case 'journal':
          this.deps.step5Refresh.markJournalDirty(result.accountId)
          break
        case 'alerts':
          this.deps.step5Refresh.markAlertsDirty()
          break
        case 'payouts':
          this.deps.step5Refresh.markPayoutsDirty(result.accountId)
          break
        case 'calendar':
          this.deps.step5Refresh.markCalendarDirty(result.accountId)
          break
        default:
          break
      }
    }
  }

  private async refreshVisibleSurfaces(
    result: Step6AccountWorkflowResult,
    workflowSummary: WorkflowSummaryBridgeViewModel,
  ): Promise<void> {
    const shouldRefreshDashboard = result.invalidationKeys.includes('dashboard')
    const shouldRefreshAccount = result.invalidationKeys.includes(`account:${result.accountId}`)

    if (shouldRefreshDashboard) {
      const dashboard = await this.deps.step5Refresh.rebuildDashboard()
      dashboard.state.lastWorkflowSummary = workflowSummary

      if (result.degradedState?.message) {
        dashboard.state.isDegraded = true
        dashboard.state.degradedReasons = [
          ...dashboard.state.degradedReasons,
          result.degradedState.message,
        ]
      }

      this.deps.setDashboard(dashboard)
    }

    if (shouldRefreshAccount) {
      const accountDetail = await this.deps.step5Refresh.rebuildAccountDetail(result.accountId)

      if (accountDetail) {
        accountDetail.latestWorkflowSummary = workflowSummary
      }

      this.deps.setAccountDetail(accountDetail)
    }
  }
}

/**
 * Minimal Dashboard -> Account Detail continuity helper.
 * Use this when drilling down from a selected dashboard card so the return
 * path restores grouping and filters.
 */
export function buildDashboardReturnContext(input: {
  groupBy: DashboardReturnContext['groupBy']
  filterState: DashboardReturnContext['filterState']
  selectedAccountId?: string | null
}): DashboardReturnContext {
  return {
    groupBy: input.groupBy,
    filterState: input.filterState,
    selectedAccountId: input.selectedAccountId ?? null,
  }
}

/**
 * Example dashboard quick-action handlers.
 * Replace `unknown` command payloads with the real Step 6 command types.
 */
export async function handleLogWin(
  controller: CommandCenterController,
  step6: Step6ViewModelIntegrator,
  command: unknown,
): Promise<void> {
  const result = await step6.logWin(command)
  await controller.afterWorkflow(result)
}

export async function handleLogLoss(
  controller: CommandCenterController,
  step6: Step6ViewModelIntegrator,
  command: unknown,
): Promise<void> {
  const result = await step6.logLoss(command)
  await controller.afterWorkflow(result)
}

export async function handleAddNote(
  controller: CommandCenterController,
  step6: Step6ViewModelIntegrator,
  command: unknown,
): Promise<void> {
  const result = await step6.addNote(command)
  await controller.afterWorkflow(result)
}

export async function handleRequestPayout(
  controller: CommandCenterController,
  step6: Step6ViewModelIntegrator,
  command: unknown,
): Promise<void> {
  const result = await step6.requestPayout(command)
  await controller.afterWorkflow(result)
}

export async function handlePauseToggle(params: {
  controller: CommandCenterController
  step6: Step6ViewModelIntegrator
  isPaused: boolean
  command: unknown
}): Promise<void> {
  const result = params.isPaused
    ? await params.step6.resumeAccount(params.command)
    : await params.step6.pauseAccount(params.command)

  await params.controller.afterWorkflow(result)
}
