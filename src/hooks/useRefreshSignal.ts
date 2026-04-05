import { useEffect, useState } from "react";

import {
  matchesRefreshKey,
  refreshCoordinator,
  type SurfaceRefreshKey,
} from "@/lib/services/refreshCoordinator";

export function useRefreshSignal(watchedKeys: readonly SurfaceRefreshKey[]): number {
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    return refreshCoordinator.subscribe((event) => {
      const shouldRefresh = event.keys.some((emittedKey) =>
        watchedKeys.some((watchedKey) => matchesRefreshKey(watchedKey, emittedKey)),
      );

      if (shouldRefresh) {
        setRefreshVersion((current) => current + 1);
      }
    });
  }, [watchedKeys]);

  return refreshVersion;
}
