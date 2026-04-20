import express, { Application } from 'express';
import 'express-async-errors';
import compression from 'compression';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { securityMiddleware, requestIdMiddleware, sanitizeMiddleware } from './middleware/security.middleware.js';
import { requestLoggingMiddleware, errorLoggingMiddleware } from './middleware/logging.middleware.js';
import { generalRateLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
import { apiConfig } from './config/api.config.js';

export function createApp(): Application {
  const app = express();

  // Trust proxy (for rate limiting behind reverse proxy)
  app.set('trust proxy', 1);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Security middleware
  app.use(securityMiddleware);
  app.use(requestIdMiddleware);
  app.use(sanitizeMiddleware);

  // CORS middleware
  app.use(corsMiddleware);

  // Logging middleware
  app.use(requestLoggingMiddleware);

  // Rate limiting middleware
  app.use(generalRateLimiter);

  // API routes
  app.use('/api', routes);

  // Error logging middleware
  app.use(errorLoggingMiddleware);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
