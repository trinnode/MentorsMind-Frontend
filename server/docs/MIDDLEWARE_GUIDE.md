# Middleware Configuration Guide

This guide explains the middleware stack used in the MentorMinds API and how to configure each component.

## Middleware Order

The order of middleware is crucial for proper functionality:

1. Body Parsing
2. Compression
3. Security (Helmet)
4. Request ID
5. Sanitization
6. CORS
7. Logging
8. Rate Limiting
9. Routes
10. Error Logging
11. 404 Handler
12. Error Handler

## Body Parsing Middleware

Parses incoming request bodies in JSON and URL-encoded formats.

```typescript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

**Configuration:**
- `limit`: Maximum request body size (default: 10mb)
- `extended`: Allow rich objects and arrays (default: true)

## Compression Middleware

Compresses response bodies for improved performance.

```typescript
app.use(compression());
```

**Benefits:**
- Reduces bandwidth usage
- Faster response times
- Better user experience

## Security Middleware (Helmet)

Sets various HTTP headers for security.

```typescript
app.use(securityMiddleware);
```

**Headers Set:**
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

**Configuration:**
Edit `server/src/middleware/security.middleware.ts` to customize headers.

## Request ID Middleware

Adds a unique ID to each request for tracking.

```typescript
app.use(requestIdMiddleware);
```

**Usage:**
- Access via `req.headers['x-request-id']`
- Included in response headers
- Used in logging for request correlation

## Sanitization Middleware

Removes potentially malicious input from requests.

```typescript
app.use(sanitizeMiddleware);
```

**What it does:**
- Removes null bytes from strings
- Sanitizes nested objects and arrays
- Prevents injection attacks

## CORS Middleware

Handles Cross-Origin Resource Sharing.

```typescript
app.use(corsMiddleware);
```

**Configuration:**
Edit `server/.env`:
```env
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
CORS_CREDENTIALS=true
```

**Options:**
- `origin`: Allowed origins (comma-separated)
- `credentials`: Allow credentials (cookies, auth headers)
- `methods`: Allowed HTTP methods
- `allowedHeaders`: Allowed request headers

## Logging Middleware

Logs all incoming requests and responses.

```typescript
app.use(requestLoggingMiddleware);
```

**Log Levels:**
- `error`: Errors and failures
- `warn`: Warnings
- `info`: General information (default)
- `debug`: Detailed debugging

**Configuration:**
```env
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

**Log Format:**
```json
{
  "level": "info",
  "message": "Incoming request",
  "method": "GET",
  "url": "/api/health",
  "ip": "127.0.0.1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting Middleware

Prevents abuse by limiting request rates.

```typescript
app.use(generalRateLimiter);
```

**Configuration:**
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

**Rate Limiters:**

1. **General Rate Limiter** (default)
   - 100 requests per 15 minutes
   - Applied to all routes

2. **Strict Rate Limiter**
   - 50 requests per 15 minutes
   - For sensitive endpoints

3. **Auth Rate Limiter**
   - 5 requests per 15 minutes
   - For authentication endpoints
   - Skips successful requests

**Usage:**
```typescript
import { strictRateLimiter } from './middleware/rateLimit.middleware.js';

router.post('/sensitive', strictRateLimiter, controller.action);
```

## Validation Middleware

Validates request data using Zod schemas.

```typescript
import { validateRequest } from './middleware/validation.middleware.js';
import { z } from 'zod';

const schema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

router.post('/login', validateRequest(schema), controller.login);
```

**Validation Targets:**
- `body`: Request body
- `query`: Query parameters
- `params`: URL parameters

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email",
        "value": "invalid_email"
      }
    ]
  }
}
```

## Error Handling Middleware

Catches and formats all errors.

```typescript
app.use(errorHandler);
```

**Custom Errors:**
```typescript
import { AppError } from './middleware/error.middleware.js';

throw new AppError(400, 'INVALID_INPUT', 'Invalid user input');
```

**Error Types:**
- `AppError`: Custom application errors
- `ValidationError`: Validation failures
- `UnauthorizedError`: Authentication failures
- Generic errors: Unexpected errors

## API Key Middleware (Optional)

Validates API keys for protected endpoints.

```typescript
import { apiKeyMiddleware } from './middleware/security.middleware.js';

router.get('/protected', apiKeyMiddleware, controller.action);
```

**Configuration:**
```env
API_KEY_HEADER=x-api-key
ALLOWED_API_KEYS=key1,key2,key3
```

**Usage:**
```bash
curl -H "X-API-Key: your-api-key" http://localhost:5000/api/protected
```

## Best Practices

1. **Order Matters**: Keep middleware in the correct order
2. **Error Handling**: Always use try-catch in async handlers
3. **Validation**: Validate all user input
4. **Rate Limiting**: Apply stricter limits to sensitive endpoints
5. **Logging**: Log important events and errors
6. **Security**: Keep security middleware updated
7. **Testing**: Test middleware behavior in isolation

## Troubleshooting

### CORS Issues
- Check `CORS_ORIGIN` includes your frontend URL
- Verify credentials setting matches frontend
- Check browser console for specific CORS errors

### Rate Limit Issues
- Increase limits for development
- Check if behind a proxy (set `trust proxy`)
- Verify IP address is correct

### Validation Errors
- Check Zod schema matches expected data
- Verify request content-type is correct
- Test with valid data first

### Logging Issues
- Check `LOG_LEVEL` setting
- Verify log file permissions
- Check disk space for log files
