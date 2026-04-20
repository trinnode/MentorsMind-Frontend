import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../src/middleware/validation.middleware.js';

describe('Validation Middleware', () => {
  it('should validate request body successfully', async () => {
    const schema = {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    };

    const req = {
      body: { name: 'John Doe', email: 'john@example.com' },
    } as Request;

    const res = {} as Response;
    const next = vi.fn();

    const middleware = validateRequest(schema);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return validation error for invalid data', async () => {
    const schema = {
      body: z.object({
        email: z.string().email(),
      }),
    };

    const req = {
      body: { email: 'invalid-email' },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn();

    const middleware = validateRequest(schema);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
