import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /health
 * @desc    Get API health status
 * @access  Public
 */
router.get('/', HealthController.getHealth);

/**
 * @route   GET /health/readiness
 * @desc    Check if API is ready to accept requests
 * @access  Public
 */
router.get('/readiness', HealthController.getReadiness);

/**
 * @route   GET /health/liveness
 * @desc    Check if API is alive
 * @access  Public
 */
router.get('/liveness', HealthController.getLiveness);

export default router;
