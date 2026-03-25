import { Response } from 'express';
import { ApiResponse, ApiError, ApiMeta } from '../types/api.types.js';
import { apiConfig } from '../config/api.config.js';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    meta?: Partial<ApiMeta>
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: apiConfig.apiVersion,
        ...meta,
      },
    };
    
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: ApiError,
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        ...error,
        stack: apiConfig.isDevelopment ? error.stack : undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: apiConfig.apiVersion,
      },
    };
    
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, meta?: Partial<ApiMeta>): Response {
    return this.success(res, data, 201, meta);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static badRequest(res: Response, message: string, details?: any): Response {
    return this.error(
      res,
      {
        code: 'BAD_REQUEST',
        message,
        details,
      },
      400
    );
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(
      res,
      {
        code: 'UNAUTHORIZED',
        message,
      },
      401
    );
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(
      res,
      {
        code: 'FORBIDDEN',
        message,
      },
      403
    );
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(
      res,
      {
        code: 'NOT_FOUND',
        message,
      },
      404
    );
  }

  static conflict(res: Response, message: string, details?: any): Response {
    return this.error(
      res,
      {
        code: 'CONFLICT',
        message,
        details,
      },
      409
    );
  }

  static validationError(res: Response, errors: any[]): Response {
    return this.error(
      res,
      {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
      },
      422
    );
  }

  static internalError(
    res: Response,
    message: string = 'Internal server error',
    error?: Error
  ): Response {
    return this.error(
      res,
      {
        code: 'INTERNAL_ERROR',
        message,
        stack: error?.stack,
      },
      500
    );
  }
}
