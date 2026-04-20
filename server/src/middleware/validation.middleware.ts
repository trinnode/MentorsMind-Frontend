import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ResponseUtil } from '../utils/response.utils.js';

export const validateRequest = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.code,
        }));
        
        return ResponseUtil.validationError(res, validationErrors);
      }
      
      return ResponseUtil.badRequest(res, 'Invalid request data');
    }
  };
};

// Common validation schemas
import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
