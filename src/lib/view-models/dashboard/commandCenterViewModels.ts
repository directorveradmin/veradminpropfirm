/**
 * Step 7 - Command Center dashboard view models
 *
 * Implementation-facing contract only.
 * This file assumes Step 5 read models remain canonical for screen mapping and
 * Step 6 workflow results remain canonical for post-action consequence handling.
 */

export type DashboardGroupBy = 'urgency' | 'mode' | 'stage' | 'firm'
export type DashboardPrimaryFilter = 'all' | 'tradable' | 'payoutReady' | 'nearRisk'
export type DashboardVisualTone = 'neutral' | 'success' | 'caution' | 'danger' | 'info'
export type DashboardVisualState =
  | 'default'
  | 'restricted'
  | 'stopped'
  | 'payoutReady'
  | 'criticalRisk'
  | 'degraded'

export interface RefreshableStep5ViewModels {
  rebuildDashboard(): Promise<CommandCenterScreenViewModel>
  rebuildAccountDetail(accountId: string): Promise<AccountDetailBridgeViewModel | null>
  markJournalDirty(accountId?: string): void
  markAlertsDirty(): void
  markPayoutsDirty(accountId?: string): void
  markCalendarDirty(accountId?: string): void
}

export interface CommandCenterScreenViewModel {
  header: CommandCenterHeaderViewModel
  mission: TodaysMissionPanelViewModel
  fleetHealth: FleetHealthStripViewModel
  criticalAlerts: CriticalAlertZoneViewModel
  grid: AccountGridViewModel
  secondarySummary: SecondaryOperationalSummaryViewModel
  state: CommandCenterStateViewModel
}

export interface CommandCenterHeaderViewModel {
  title: string
  asOfLabel: string
  fleetStatusSentence: string
  criticalCount: number
  lastRefreshLabel: string
  degradedBanner: DegradedBannerViewModel | null
  quickLinks: HeaderQuickLinkViewModel[]
}

export interface HeaderQuickLinkViewModel {
  id: string
  label: string
  targetRoute: string
  count?: number | null
}

export interface TodaysMissionPanelViewModel {
  headline: string
  posture: string
  items: MissionItemViewModel[]
  quietSummary: string | null
  degradedSummary: string | null
}

export interface MissionItemViewModel {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  label: string
  reason: string
  targetRoute: string | null
  targetFilter: string | null
  accountIds: string[]
}

export interface FleetHealthStripViewModel {
  metrics: FleetHealthMetricViewModel[]
  score: FleetHealthScoreViewModel | null
}

export interface FleetHealthMetricViewModel {
  id: string
  label: string
  value: string
  tone: DashboardVisualTone
  targetRoute: string | null
  targetFilter: string | null
  tooltip?: string | null
}

export interface FleetHealthScoreViewModel {
  value: number
  label: string
  explanation: string
}

export interface CriticalAlertZoneViewModel {
  items: AlertRowViewModel[]
  grouped: boolean
  hasCritical: boolean
  quietMessage: string | null
}

export interface AlertRowViewModel {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'resolved'
  title: string
  message: string
  accountId?: string | null
  accountLabel?: string | null
  targetRoute: string | null
  occurredAtLabel?: string | null
}

export interface AccountGridViewModel {
  groupBy: DashboardGroupBy
  sortBy: 'decisionRelevance'
  activeFilters: DashboardFilterState
  groups: AccountGridGroupViewModel[]
  emptyState: DashboardEmptyStateViewModel | null
}

export interface DashboardFilterState {
  primary: DashboardPrimaryFilter
  firmIds: string[]
  stages: string[]
  modes: string[]
  searchText: string
}

export interface AccountGridGroupViewModel {
  id: string
  label: string
  count: number
  cards: CommandCenterAccountCardViewModel[]
}

export interface CommandCenterAccountCardViewModel {
  accountId: string
  accountLabel: string
  firmLabel: string
  stageLabel: string
  modeLabel: string
  stateLabel: 'Tradable' | 'Restricted' | 'Stopped'
  effectiveLivesLabel: string
  nextMilestoneLabel: string
  warningBadges: AccountCardBadgeViewModel[]
  quickActions: AccountCardQuickActionViewModel[]
  balanceLabel?: string | null
  hardBreachFloorLabel?: string | null
  payoutReadinessLabel?: string | null
  lastMeaningfulEventLabel?: string | null
  visualState: DashboardVisualState
  degradedReason?: string | null
}

export interface AccountCardBadgeViewModel {
  id: string
  label: string
  tone: DashboardVisualTone
  targetRoute?: string | null
}

export interface AccountCardQuickActionViewModel {
  id: string
  label: string
  kind:
    | 'open'
    | 'logWin'
    | 'logLoss'
    | 'logCustom'
    | 'addNote'
    | 'requestPayout'
    | 'pause'
    | 'resume'
    | 'openSimulation'
    | 'overflow'
  enabled: boolean
  disabledReason?: string | null
  emphasis: 'primary' | 'secondary' | 'overflow'
}

export interface SecondaryOperationalSummaryViewModel {
  payoutsDueCount: number
  unresolvedAdminCount: number
  rotationAttentionCount: number
  recentChangeCount: number
}

export interface DashboardEmptyStateViewModel {
  kind: 'emptyFleet' | 'quietDay' | 'filterEmpty' | 'partialLoad'
  title: string
  message: string
  primaryActionLabel?: string | null
}

export interface CommandCenterStateViewModel {
  isLoading: boolean
  isDegraded: boolean
  degradedReasons: string[]
  lastWorkflowSummary: WorkflowSummaryBridgeViewModel | null
}

export interface WorkflowSummaryBridgeViewModel {
  accountId: string
  workflow: string
  headline: string
  status: 'success' | 'partial' | 'blocked'
  changedFields: string[]
  alertsCreated: string[]
  alertsResolved: string[]
  nextRecommendedAction?: string | null
}

export interface DegradedBannerViewModel {
  title: string
  message: string
  targetRoute: string | null
}

export interface AccountDetailBridgeViewModel {
  accountId: string
  accountLabel: string
  whyThisStateSummary: string
  latestWorkflowSummary: WorkflowSummaryBridgeViewModel | null
  activeAlerts: AlertRowViewModel[]
  recentTimelineTitles: string[]
  returnContext: DashboardReturnContext
}

export interface DashboardReturnContext {
  groupBy: DashboardGroupBy
  filterState: DashboardFilterState
  selectedAccountId?: string | null
}
