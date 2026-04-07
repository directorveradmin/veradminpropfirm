export interface BadgeViewModel {
  label: string
  tone: 'neutral' | 'positive' | 'warning' | 'danger'
}

export interface EmptyStateViewModel {
  title: string
  body: string
}

export interface DegradedStateViewModel {
  title: string
  body: string
}
