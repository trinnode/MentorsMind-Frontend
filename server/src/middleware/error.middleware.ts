import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.utils.js';
import { logger } from './logging.middleware.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error handler caught error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (err instanceof AppError) {
    return ResponseUtil.error(
      res,
      {
        code: err.code,
        message: err.message,
        details: err.details,
        stack: err.stack,
      },
      err.statusCode
    );
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return ResponseUtil.validationError(res, [{ message: err.message }]);
  }

  if (err.name === 'UnauthorizedError') {
    return ResponseUtil.unauthorized(res, err.message);
  }

  // Default to 500 server error
  return ResponseUtil.internalError(res, 'An unexpected error occurred', err);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return ResponseUtil.notFound(res, `Route ${req.method} ${req.url} not found`);
};
