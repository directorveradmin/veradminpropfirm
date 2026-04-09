import { useState, useCallback } from 'react';

export function useRefreshSignal(): [number, () => void] {
    const [signal, setSignal] = useState(0);
    const refresh = useCallback(() => setSignal(s => s + 1), []);
    return [signal, refresh];
}
