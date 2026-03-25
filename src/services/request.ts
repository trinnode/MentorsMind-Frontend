import type { AxiosRequestConfig } from "axios";
import api from "./api.client";
import { getCached, setCache } from "./cache";

export const request = async <T>(
  config: AxiosRequestConfig,
  opts?: {
    signal?: AbortSignal;
    useCache?: boolean;
  },
): Promise<T> => {
  const key = JSON.stringify(config);

  if (opts?.signal) {
    config.signal = opts.signal;
  }

  if (opts?.useCache) {
    const cached = getCached<T>(key);
    if (cached) return cached;
  }

  const res = await api(config);
  
  if (opts?.useCache) {
    setCache(key, res.data);
  }

  return res.data;
};
