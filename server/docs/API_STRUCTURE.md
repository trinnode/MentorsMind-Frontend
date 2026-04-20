# API Structure and Conventions

This document outlines the structure, conventions, and best practices for the MentorMinds API.

## Directory Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   └── api.config.ts    # API configuration
│   ├── controllers/         # Request handlers
│   │   └── health.controller.ts
│   ├── middleware/          # Express middleware
│   │   ├── cors.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logging.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── security.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/              # API routes
│   │   ├── index.ts         # Main router
│   │   └── health.routes.ts
│   ├── types/               # TypeScript types
│   │   └── api.types.ts
│   ├── utils/               # Utility functions
│   │   └── response.utils.ts
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── tests/                   # Test files
│   ├── api/
│   └── middleware/
├── docs/                    # Documentation
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Naming Conventions

### Files
- Controllers: `*.controller.ts`
- Routes: `*.routes.ts`
- Middleware: `*.middleware.ts`
- Types: `*.types.ts`
- Utils: `*.utils.ts`
- Tests: `*.test.ts`

### Classes
- PascalCase: `UserController`, `ResponseUtil`
- Suffix with type: `Controller`, `Service`, `Util`

### Functions
- camelCase: `getUsers`, `createSession`
- Async functions: prefix with `async` keyword

### Constants
- UPPER_SNAKE_CASE: `MAX_RETRIES`, `API_VERSION`

### Variables
- camelCase: `userId`, `sessionData`

## API Versioning

The API supports versioning through URL paths:

```
/api/v1/users
/api/v2/users
```

**Configuration:**
```env
API_VERSION=v1
```

**Implementation:**
```typescript
// routes/index.ts
const apiVersion = apiConfig.apiVersion;
router.use(`/${apiVersion}/users`, userRoutes);
```

## Response Format

All API responses follow a consistent structure.

### Success Response

```typescript
{
  success: true,
  data: T,
  meta: {
    timestamp: string,
    version: string,
    requestId?: string,
    pagination?: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any,
    stack?: string  // Only in development
  },
  meta: {
    timestamp: string,
    version: string,
    requestId?: string
  }
}
```

## HTTP Status Codes

Use appropriate status codes:

- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Controller Pattern

Controllers handle business logic and return responses.

```typescript
export class UserController {
  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      // 1. Extract and validate input
      const { page, limit } = req.query;
      
      // 2. Business logic
      const users = await userService.findAll({ page, limit });
      
      // 3. Return response
      return ResponseUtil.success(res, users, 200, {
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: users.length,
          totalPages: Math.ceil(users.length / Number(limit))
        }
      });
    } catch (error) {
      return ResponseUtil.internalError(res, 'Failed to fetch users', error);
    }
  }
}
```

## Route Pattern

Routes define endpoints and apply middleware.

```typescript
import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Private
 */
router.get(
  '/',
  authMiddleware,
  validateRequest({ query: paginationSchema }),
  UserController.getUsers
);

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Public
 */
router.post(
  '/',
  validateRequest({ body: createUserSchema }),
  UserController.createUser
);

export default router;
```

## Validation Pattern

Use Zod for request validation.

```typescript
import { z } from 'zod';

// Define schema
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['learner', 'mentor']).optional(),
});

// Use in route
router.post(
  '/users',
  validateRequest({ body: createUserSchema }),
  UserController.createUser
);
```

## Error Handling Pattern

Use custom error classes for better error handling.

```typescript
import { AppError } from '../middleware/error.middleware.js';

// Throw custom error
if (!user) {
  throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
}

// Or use ResponseUtil
if (!user) {
  return ResponseUtil.notFound(res, 'User not found');
}
```

## Async Error Handling

Use `express-async-errors` to automatically catch async errors.

```typescript
import 'express-async-errors';

// No need for try-catch in routes
router.get('/users', async (req, res) => {
  const users = await userService.findAll();
  return ResponseUtil.success(res, users);
});
```

## Pagination

Implement pagination for list endpoints.

```typescript
// Query parameters
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 10;
const skip = (page - 1) * limit;

// Fetch data
const users = await userService.findAll({ skip, limit });
const total = await userService.count();

// Return with pagination meta
return ResponseUtil.success(res, users, 200, {
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }
});
```

## Filtering and Sorting

Support filtering and sorting in list endpoints.

```typescript
// Query parameters
const { search, role, sortBy, order } = req.query;

// Build filter
const filter: any = {};
if (search) filter.name = { $regex: search, $options: 'i' };
if (role) filter.role = role;

// Build sort
const sort: any = {};
if (sortBy) sort[sortBy as string] = order === 'desc' ? -1 : 1;

// Fetch data
const users = await userService.findAll({ filter, sort });
```

## Authentication Pattern

Implement authentication middleware.

```typescript
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }
    
    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }
};
```

## Testing Pattern

Write tests for all endpoints and middleware.

```typescript
describe('User API', () => {
  describe('GET /users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/v1/users');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

## Best Practices

1. **Separation of Concerns**: Keep controllers, routes, and business logic separate
2. **Validation**: Always validate user input
3. **Error Handling**: Use consistent error responses
4. **Async/Await**: Use async/await for asynchronous operations
5. **Type Safety**: Use TypeScript types and interfaces
6. **Documentation**: Document all routes and functions
7. **Testing**: Write tests for all functionality
8. **Security**: Apply security middleware to all routes
9. **Rate Limiting**: Protect endpoints from abuse
10. **Logging**: Log important events and errors

## Code Style

- Use ESLint for code linting
- Use Prettier for code formatting
- Follow TypeScript best practices
- Use meaningful variable names
- Write clear comments
- Keep functions small and focused
