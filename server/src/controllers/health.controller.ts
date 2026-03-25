import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response.utils.js';
import { HealthCheckResponse } from '../types/api.types.js';
import { apiConfig } from '../config/api.config.js';

export class HealthController {
  static async getHealth(req: Request, res: Response): Promise<Response> {
    const healthData: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: apiConfig.apiVersion,
      environment: apiConfig.env,
    };

    return ResponseUtil.success(res, healthData);
  }

  static async getReadiness(req: Request, res: Response): Promise<Response> {
    // Check if all required services are ready
    const services = {
      api: { status: 'up' as const },
      // Add more service checks here (database, cache, etc.)
    };

    const allServicesUp = Object.values(services).every(
      (service) => service.status === 'up'
    );

    const healthData: HealthCheckResponse = {
      status: allServicesUp ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: apiConfig.apiVersion,
      environment: apiConfig.env,
      services,
    };

    const statusCode = allServicesUp ? 200 : 503;
    return res.status(statusCode).json({
      success: allServicesUp,
      data: healthData,
    });
  }

  static async getLiveness(req: Request, res: Response): Promise<Response> {
    // Simple liveness check
    return ResponseUtil.success(res, {
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  }
}
