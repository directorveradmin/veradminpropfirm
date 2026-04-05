export type SurfaceRefreshKey =
  | "dashboard"
  | "journal"
  | "payouts"
  | "calendar"
  | "alerts"
  | `account:${string}`;

export interface RefreshEvent {
  keys: SurfaceRefreshKey[];
  reason: string;
  at: string;
}

type RefreshListener = (event: RefreshEvent) => void;

function normalizeKeys(keys: readonly SurfaceRefreshKey[]): SurfaceRefreshKey[] {
  return Array.from(new Set(keys));
}

export function accountRefreshKey(accountId: string): SurfaceRefreshKey {
  return `account:${accountId}`;
}

export function matchesRefreshKey(
  watchedKey: SurfaceRefreshKey,
  emittedKey: SurfaceRefreshKey,
): boolean {
  if (watchedKey === emittedKey) {
    return true;
  }

  if (watchedKey.startsWith("account:") && emittedKey === "dashboard") {
    return true;
  }

  return false;
}

export class RefreshCoordinator {
  private readonly listeners = new Set<RefreshListener>();

  subscribe(listener: RefreshListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(keys: readonly SurfaceRefreshKey[], reason: string): RefreshEvent {
    const event: RefreshEvent = {
      keys: normalizeKeys(keys),
      reason,
      at: new Date().toISOString(),
    };

    for (const listener of this.listeners) {
      listener(event);
    }

    return event;
  }
}

export const refreshCoordinator = new RefreshCoordinator();
