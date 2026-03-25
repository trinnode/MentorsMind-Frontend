import { Request, Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  requestId?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services?: {
    database?: ServiceStatus;
    cache?: ServiceStatus;
    [key: string]: ServiceStatus | undefined;
  };
}

export interface ServiceStatus {
  status: 'up' | 'down';
  responseTime?: number;
  message?: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response
) => Promise<void | Response>;

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}
