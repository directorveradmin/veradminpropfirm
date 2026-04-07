export interface FleetMetricReadModel {
  key: string
  label: string
  value: number | string
}

export interface MissionItemReadModel {
  id: string
  label: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  accountId?: string
}

export interface AlertReadModel {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'resolved'
  title: string
  message: string
  accountId?: string
}

export interface AccountCardReadModel {
  id: string
  label: string
  firm: string
  stage: string
  mode: string
  tradeState: 'tradable' | 'restricted' | 'stopped'
  livesRemaining: number | null
  nextMilestone: string
  warnings: string[]
  quickActions: string[]
}

export interface DashboardReadModel {
  generatedAt: string
  isDegraded: boolean
  degradedReason?: string
  metrics: FleetMetricReadModel[]
  missionItems: MissionItemReadModel[]
  alerts: AlertReadModel[]
  accounts: AccountCardReadModel[]
  availableFilters: string[]
  activeFilter: string
}

export interface CommandCenterReadModels {
  dashboard: DashboardReadModel
}
