import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { apiConfig } from '../config/api.config.js';

// Winston logger configuration
export const logger = winston.createLogger({
  level: apiConfig.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Add file transport in production
if (apiConfig.isProduction) {
  logger.add(
    new winston.transports.File({
      filename: `${apiConfig.logging.filePath}/error.log`,
      level: 'error',
    })
  );
  
  logger.add(
    new winston.transports.File({
      filename: `${apiConfig.logging.filePath}/combined.log`,
    })
  );
}

// Request logging middleware
export const requestLoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    requestId: req.headers['x-request-id'],
  });
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    
    logger.log(logLevel, 'Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestId: req.headers['x-request-id'],
    });
  });
  
  next();
};

// Error logging middleware
export const errorLoggingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    requestId: req.headers['x-request-id'],
  });
  
  next(err);
};
