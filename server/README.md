# MentorMinds API

A robust Express.js backend API for the MentorMinds platform, built with TypeScript and following best practices for security, scalability, and maintainability.

## Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Validation**: Zod schema validation for requests
- **Logging**: Winston logger with file and console transports
- **Error Handling**: Centralized error handling with custom error classes
- **API Versioning**: Support for multiple API versions
- **Health Checks**: Liveness and readiness endpoints
- **Testing**: Vitest for unit and integration tests

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
cd server
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Running the Server

Development mode with hot reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

### Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
└── package.json
```

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/readiness` - Readiness probe
- `GET /api/health/liveness` - Liveness probe

### API Info
- `GET /api` - API information and available endpoints

## Middleware Stack

1. **Body Parsing**: JSON and URL-encoded data
2. **Compression**: Response compression
3. **Security**: Helmet security headers
4. **Request ID**: Unique request tracking
5. **Sanitization**: Input sanitization
6. **CORS**: Cross-origin resource sharing
7. **Logging**: Request/response logging
8. **Rate Limiting**: Request rate limiting
9. **Error Handling**: Centralized error handling

## Security Features

- **Helmet**: Security headers (CSP, HSTS, etc.)
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: Prevent abuse and DDoS
- **Input Sanitization**: Remove malicious input
- **Request Validation**: Zod schema validation
- **API Key Support**: Optional API key authentication

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production/test) | development |
| `PORT` | Server port | 5000 |
| `API_VERSION` | API version | v1 |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOG_LEVEL` | Logging level | info |

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

## Adding New Routes

1. Create a controller in `src/controllers/`
2. Create a route file in `src/routes/`
3. Register the route in `src/routes/index.ts`
4. Add validation schemas if needed
5. Write tests in `tests/`

Example:
```typescript
// src/controllers/user.controller.ts
export class UserController {
  static async getUsers(req: Request, res: Response) {
    const users = []; // Fetch from database
    return ResponseUtil.success(res, users);
  }
}

// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();
router.get('/', UserController.getUsers);
export default router;

// src/routes/index.ts
import userRoutes from './user.routes.js';
router.use(`/${apiVersion}/users`, userRoutes);
```

## License

MIT
