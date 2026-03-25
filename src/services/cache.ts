type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const STALE_TIME = 5000;

export const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;
  if (Date.now() - entry.timestamp > STALE_TIME) {
    return null;
  }

  return entry.data as T;
};

export const setCache = <T>(key: string, data: T) => {
  cache.set(key, { data, timestamp: Date.now() });
};
