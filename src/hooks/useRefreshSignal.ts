'use client'

import { useSyncExternalStore } from 'react'
import { refreshCoordinator, type RefreshScopeKey } from '../lib/services/refreshCoordinator'

export function useRefreshSignal(key: RefreshScopeKey): number {
  return useSyncExternalStore(
    (onStoreChange) => refreshCoordinator.subscribe((event) => {
      if (event.key === key) {
        onStoreChange()
      }
    }),
    () => refreshCoordinator.getToken(key),
    () => 0,
  )
}
