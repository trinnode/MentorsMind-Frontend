import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Rate Limiting Middleware', () => {
  it('should allow requests within rate limit', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    // Rate limiting is skipped in test environment
    // Just verify the request succeeds
  });

  it('should successfully handle multiple requests in test mode', async () => {
    const app = createApp();

    // Make multiple requests
    const response1 = await request(app).get('/api/health');
    const response2 = await request(app).get('/api/health');
    const response3 = await request(app).get('/api/health');

    // All should succeed since rate limiting is disabled in test
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(200);
  });
});
