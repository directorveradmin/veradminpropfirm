type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly defaultTtlMs: number = 30_000) {}

  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number): T {
    const effectiveTtlMs = this.normalizeTtl(ttlMs);
    const expiresAt = Date.now() + effectiveTtlMs;

    this.store.set(key, {
      value,
      expiresAt,
    });

    return value;
  }

  has(key: string): boolean {
    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getOrSet<T>(key: string, factory: () => T, ttlMs?: number): T {
    const existing = this.get<T>(key);

    if (existing !== null) {
      return existing;
    }

    const value = factory();
    return this.set(key, value, ttlMs);
  }

  async getOrSetAsync<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs?: number,
  ): Promise<T> {
    const existing = this.get<T>(key);

    if (existing !== null) {
      return existing;
    }

    const value = await factory();
    return this.set(key, value, ttlMs);
  }

  private normalizeTtl(ttlMs?: number): number {
    const candidate = ttlMs ?? this.defaultTtlMs;

    if (!Number.isFinite(candidate) || candidate <= 0) {
      return this.defaultTtlMs;
    }

    return Math.floor(candidate);
  }
}

export const simpleCache = new SimpleCache();