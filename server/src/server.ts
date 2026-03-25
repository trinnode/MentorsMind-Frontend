import { createApp } from './app.js';
import { apiConfig } from './config/api.config.js';
import { logger } from './middleware/logging.middleware.js';

const app = createApp();
const PORT = apiConfig.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${apiConfig.env} mode on port ${PORT}`);
  logger.info(`📡 API version: ${apiConfig.apiVersion}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('Server closed. Process terminating...');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  throw reason;
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default server;
