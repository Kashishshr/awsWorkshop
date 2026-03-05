# Authentication Guide

## Overview

The Power Grid Device Simulation uses JWT (JSON Web Tokens) for authentication and authorization.

## JWT Token Structure

Tokens are signed with a secret key and contain the following claims:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "operator",
  "permissions": ["read", "write"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Token Lifecycle

### 1. Login

User provides credentials to `/auth/login`:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

Response includes:
- `accessToken`: Short-lived token (24 hours)
- `refreshToken`: Long-lived token (7 days)

### 2. Using Access Token

Include token in Authorization header:

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <accessToken>"
```

### 3. Token Refresh

When access token expires, use refresh token:

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

### 4. Logout

Invalidate tokens:

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

## Roles and Permissions

### Roles

- **admin**: Full system access
- **operator**: Device monitoring and control
- **planner**: Planning and reporting
- **viewer**: Read-only access

### Permissions

- `read`: Read data
- `write`: Modify data
- `delete`: Delete data
- `admin`: Administrative actions

## Security Best Practices

### Frontend

1. **Store tokens securely**
   - Use HttpOnly cookies (recommended)
   - Or localStorage with HTTPS only

2. **Include token in requests**
   - Use Authorization header
   - Never include in URL

3. **Handle token expiration**
   - Implement automatic refresh
   - Redirect to login on 401

4. **Clear tokens on logout**
   - Remove from storage
   - Clear cookies

### Backend

1. **Verify tokens**
   - Check signature
   - Validate expiration
   - Verify claims

2. **Secure token storage**
   - Use environment variables for secret
   - Rotate secrets regularly

3. **Implement rate limiting**
   - Limit login attempts
   - Prevent brute force attacks

4. **Use HTTPS**
   - Encrypt tokens in transit
   - Prevent man-in-the-middle attacks

## Configuration

### Environment Variables

```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
BCRYPT_ROUNDS=10
```

### Token Expiration

- Access Token: 24 hours
- Refresh Token: 7 days

## Error Handling

### 401 Unauthorized

Token is missing or invalid:

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden

User lacks required permissions:

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "User does not have required permissions"
  }
}
```

## Testing

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

### Test Token Refresh

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refreshToken>"
  }'
```

## Troubleshooting

### Token Expired

- Use refresh token to get new access token
- If refresh token expired, user must login again

### Invalid Token

- Check token format (should be "Bearer <token>")
- Verify token hasn't been tampered with
- Check token expiration

### Permission Denied

- Verify user role
- Check required permissions
- Contact administrator for permission changes

## References

- [JWT.io](https://jwt.io/)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
