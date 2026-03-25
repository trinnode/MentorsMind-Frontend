# API Security Best Practices

This document outlines security best practices implemented in the MentorMinds API and recommendations for maintaining a secure application.

## Security Middleware

### Helmet

Helmet helps secure Express apps by setting various HTTP headers.

**Headers Set:**
- `Content-Security-Policy`: Prevents XSS attacks
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-Frame-Options`: Prevents clickjacking
- `Strict-Transport-Security`: Enforces HTTPS
- `X-XSS-Protection`: Enables XSS filter

**Configuration:**
```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})
```

### CORS (Cross-Origin Resource Sharing)

Properly configured CORS prevents unauthorized domains from accessing your API.

**Best Practices:**
- Whitelist specific origins, avoid using `*`
- Only enable credentials when necessary
- Limit allowed methods and headers
- Set appropriate max age for preflight caching

**Configuration:**
```env
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
CORS_CREDENTIALS=true
```

### Rate Limiting

Protects against brute force attacks and DDoS.

**Implementation:**
- General rate limiter: 100 requests per 15 minutes
- Strict rate limiter: 50 requests per 15 minutes
- Auth rate limiter: 5 attempts per 15 minutes

**Best Practices:**
- Apply stricter limits to authentication endpoints
- Use different limits for different endpoint types
- Consider IP-based and user-based rate limiting
- Monitor rate limit violations

### Input Sanitization

Removes potentially malicious input from requests.

**What it prevents:**
- Null byte injection
- Script injection
- SQL injection (when combined with parameterized queries)

**Implementation:**
```typescript
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  next();
};
```

## Request Validation

Always validate user input using Zod schemas.

**Benefits:**
- Type safety
- Prevents invalid data
- Clear error messages
- Automatic sanitization

**Example:**
```typescript
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(50),
});

router.post('/users', validateRequest({ body: userSchema }), controller);
```

**Validation Rules:**
- Validate all user input (body, query, params)
- Set minimum and maximum lengths
- Use appropriate data types
- Validate email formats
- Sanitize HTML input
- Check for SQL injection patterns

## Authentication & Authorization

### JWT Best Practices

**Token Security:**
- Use strong secret keys (256-bit minimum)
- Set appropriate expiration times
- Store tokens securely (httpOnly cookies)
- Implement token refresh mechanism
- Validate token signature and expiration

**Example:**
```typescript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

### Password Security

**Requirements:**
- Minimum 8 characters
- Use bcrypt or argon2 for hashing
- Salt rounds: 10-12 for bcrypt
- Never store plain text passwords
- Implement password strength requirements

**Example:**
```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### API Key Authentication

For service-to-service communication.

**Best Practices:**
- Generate cryptographically secure keys
- Rotate keys regularly
- Store keys in environment variables
- Use different keys for different environments
- Implement key expiration

**Configuration:**
```env
API_KEY_HEADER=x-api-key
ALLOWED_API_KEYS=key1,key2,key3
```

## HTTPS/TLS

Always use HTTPS in production.

**Implementation:**
- Use Let's Encrypt for free SSL certificates
- Enforce HTTPS with HSTS header
- Redirect HTTP to HTTPS
- Use TLS 1.2 or higher
- Disable weak cipher suites

**HSTS Configuration:**
```typescript
helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true,
})
```

## Environment Variables

Never commit sensitive data to version control.

**Best Practices:**
- Use `.env` files for local development
- Add `.env` to `.gitignore`
- Use environment-specific variables
- Validate required variables on startup
- Use secrets management in production

**Example:**
```typescript
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
```

## Error Handling

Don't expose sensitive information in error messages.

**Best Practices:**
- Hide stack traces in production
- Use generic error messages for users
- Log detailed errors server-side
- Don't expose database errors
- Sanitize error responses

**Implementation:**
```typescript
const response = {
  success: false,
  error: {
    code: 'INTERNAL_ERROR',
    message: 'An error occurred',
    stack: isDevelopment ? error.stack : undefined,
  },
};
```

## Logging

Log security events for monitoring and auditing.

**What to Log:**
- Authentication attempts (success/failure)
- Authorization failures
- Rate limit violations
- Validation errors
- Suspicious activity
- API key usage

**What NOT to Log:**
- Passwords
- API keys
- Personal data (unless necessary)
- Credit card numbers
- Session tokens

**Example:**
```typescript
logger.warn('Failed login attempt', {
  email: req.body.email,
  ip: req.ip,
  userAgent: req.get('user-agent'),
});
```

## SQL Injection Prevention

Use parameterized queries or ORMs.

**Bad:**
```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**Good:**
```typescript
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```

## XSS Prevention

Prevent cross-site scripting attacks.

**Best Practices:**
- Sanitize user input
- Escape output
- Use Content Security Policy
- Validate and encode data
- Use frameworks with built-in XSS protection

**Implementation:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(userInput);
```

## CSRF Prevention

Protect against cross-site request forgery.

**Best Practices:**
- Use CSRF tokens
- Validate origin header
- Use SameSite cookies
- Require authentication for state-changing operations

**Implementation:**
```typescript
import csrf from 'csurf';

app.use(csrf({ cookie: true }));
```

## Dependency Security

Keep dependencies up to date and secure.

**Best Practices:**
- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Pin dependency versions
- Review dependency licenses
- Use tools like Snyk or Dependabot

**Commands:**
```bash
npm audit
npm audit fix
npm outdated
```

## Security Headers Checklist

- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options
- [ ] X-Frame-Options
- [ ] Strict-Transport-Security
- [ ] X-XSS-Protection
- [ ] Referrer-Policy
- [ ] Permissions-Policy

## Security Testing

Regular security testing is essential.

**Types of Testing:**
- Penetration testing
- Vulnerability scanning
- Code review
- Dependency auditing
- Security headers testing

**Tools:**
- OWASP ZAP
- Burp Suite
- npm audit
- Snyk
- SecurityHeaders.com

## Incident Response

Have a plan for security incidents.

**Steps:**
1. Identify the incident
2. Contain the damage
3. Investigate the cause
4. Remediate vulnerabilities
5. Document the incident
6. Review and improve

## Compliance

Consider regulatory requirements.

**Common Standards:**
- GDPR (data protection)
- PCI DSS (payment data)
- HIPAA (health data)
- SOC 2 (security controls)

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Authentication implemented
- [ ] Authorization checks in place
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Environment variables secured
- [ ] Error messages sanitized
- [ ] Logging implemented
- [ ] Dependencies up to date
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Security testing performed

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Helmet Documentation](https://helmetjs.github.io/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
