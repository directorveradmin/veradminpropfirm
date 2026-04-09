type Callback = () => void;

class RefreshCoordinator {
    private listeners: Map<string, Callback[]> = new Map();

    subscribe(key: string, cb: Callback): () => void {
        const existing = this.listeners.get(key) ?? [];
        this.listeners.set(key, [...existing, cb]);
        return () => {
            const updated = (this.listeners.get(key) ?? []).filter(fn => fn !== cb);
            this.listeners.set(key, updated);
        };
    }

    refresh(key: string) {
        (this.listeners.get(key) ?? []).forEach(cb => cb());
    }
}

export const refreshCoordinator = new RefreshCoordinator();
