export type RefreshScopeKey =
  | 'dashboard'
  | 'journal'
  | 'payouts'
  | 'calendar'
  | 'alerts'
  | `account:${string}`

export interface RefreshEvent {
  key: RefreshScopeKey
  token: number
  reason?: string
  at: string
}

type RefreshListener = (event: RefreshEvent) => void

class RefreshCoordinator {
  private tokens = new Map<string, number>()
  private listeners = new Set<RefreshListener>()

  subscribe(listener: RefreshListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getToken(key: RefreshScopeKey): number {
    return this.tokens.get(key) ?? 0
  }

  invalidate(key: RefreshScopeKey, reason?: string): RefreshEvent {
    const token = this.getToken(key) + 1
    this.tokens.set(key, token)

    const event: RefreshEvent = {
      key,
      token,
      reason,
      at: new Date().toISOString(),
    }

    for (const listener of this.listeners) {
      listener(event)
    }

    return event
  }

  invalidateMany(keys: RefreshScopeKey[], reason?: string): RefreshEvent[] {
    return keys.map((key) => this.invalidate(key, reason))
  }
}

export const refreshCoordinator = new RefreshCoordinator()
