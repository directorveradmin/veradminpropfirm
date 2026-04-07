import type {
  AccountCardReadModel,
  AlertReadModel,
  DashboardReadModel,
  FleetMetricReadModel,
  MissionItemReadModel,
} from '../services/read-models'
import type { DegradedStateViewModel, EmptyStateViewModel } from './common'

export interface CommandCenterDashboardViewModel {
  title: string
  subtitle: string
  metrics: FleetMetricReadModel[]
  missionItems: MissionItemReadModel[]
  alerts: AlertReadModel[]
  accounts: AccountCardReadModel[]
  filters: string[]
  activeFilter: string
  emptyState?: EmptyStateViewModel
  quietState?: EmptyStateViewModel
  degradedState?: DegradedStateViewModel
}

export function buildCommandCenterDashboardViewModel(
  readModel: DashboardReadModel,
): CommandCenterDashboardViewModel {
  const quietState =
    readModel.alerts.length === 0
      ? {
          title: 'Nothing urgent right now',
          body: 'The Command Center is quiet, but still ready for the next tactical decision.',
        }
      : undefined

  const emptyState =
    readModel.accounts.length === 0
      ? {
          title: 'No active accounts yet',
          body: 'The Command Center is ready, but the fleet has not been populated.',
        }
      : undefined

  const degradedState = readModel.isDegraded
    ? {
        title: 'Command Center is in degraded mode',
        body:
          readModel.degradedReason ??
          'Some screen-facing data could not be verified from the canonical Step 5 layer.',
      }
    : undefined

  return {
    title: 'Command Center',
    subtitle: 'Mission control for the fleet.',
    metrics: readModel.metrics,
    missionItems: readModel.missionItems,
    alerts: readModel.alerts,
    accounts: readModel.accounts,
    filters: readModel.availableFilters,
    activeFilter: readModel.activeFilter,
    emptyState,
    quietState,
    degradedState,
  }
}
