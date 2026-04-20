import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { apiConfig } from '../config/api.config.js';

// Helmet configuration for security headers
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
});

// API Key validation middleware (optional)
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header(apiConfig.security.apiKeyHeader);
  
  // Skip API key check if no keys are configured
  if (apiConfig.security.allowedApiKeys.length === 0) {
    return next();
  }
  
  if (!apiKey || !apiConfig.security.allowedApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid or missing API key',
      },
    });
  }
  
  next();
};

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.header('X-Request-ID') || generateRequestId();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Sanitize input middleware
export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Basic sanitization - remove null bytes
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
};

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/\0/g, '');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  
  return obj;
}
