import { Router } from 'express';
import healthRoutes from './health.routes.js';
import { apiConfig } from '../config/api.config.js';

const router = Router();

// API version prefix
const apiVersion = apiConfig.apiVersion;

// Health check routes (no version prefix)
router.use('/health', healthRoutes);

// Versioned API routes
router.use(`/${apiVersion}/health`, healthRoutes);

// Add more route modules here
// router.use(`/${apiVersion}/users`, userRoutes);
// router.use(`/${apiVersion}/mentors`, mentorRoutes);
// router.use(`/${apiVersion}/sessions`, sessionRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'MentorMinds API',
      version: apiVersion,
      description: 'Backend API for MentorMinds Platform',
      endpoints: {
        health: '/health',
        api: `/${apiVersion}`,
      },
    },
  });
});

export default router;
