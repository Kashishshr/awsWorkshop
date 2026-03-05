# Power Grid Device Simulation - API Documentation

## Overview

This document describes the REST API endpoints for the Power Grid Device Simulation backend.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints (except `/auth/login`) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-04T12:00:00Z",
  "correlationId": "uuid"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  },
  "timestamp": "2026-03-04T12:00:00Z",
  "correlationId": "uuid"
}
```

## Endpoints

### Authentication

#### POST /auth/login

Login user and get access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "role": "operator",
      "permissions": ["read", "write"]
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresIn": 86400
  },
  "timestamp": "2026-03-04T12:00:00Z",
  "correlationId": "uuid"
}
```

**Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid credentials"
  }
}
```

#### POST /auth/logout

Logout user (requires authentication).

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /auth/refresh

Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "expiresIn": 86400
  }
}
```

### Users

#### GET /users/profile

Get current user profile (requires authentication).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "operator",
    "permissions": ["read", "write"]
  }
}
```

#### PUT /users/profile

Update current user profile (requires authentication).

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123"
  }
}
```

#### GET /users

List all users (requires admin role).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "user-id",
        "email": "user@example.com",
        "role": "operator"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Health

#### GET /health

Health check endpoint (no authentication required).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-03-04T12:00:00Z",
    "uptime": 3600,
    "environment": "development"
  }
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid request parameters |
| AUTHENTICATION_ERROR | 401 | Missing or invalid authentication |
| AUTHORIZATION_ERROR | 403 | User lacks required permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| SERVER_ERROR | 500 | Internal server error |

## Rate Limiting

Rate limiting is not currently implemented but will be added in future versions.

## Pagination

Paginated endpoints support the following query parameters:

- `page`: Page number (1-indexed, default: 1)
- `pageSize`: Items per page (default: 10, max: 100)
- `sortBy`: Field to sort by
- `sortOrder`: Sort order ('asc' or 'desc')

## WebSocket Events

WebSocket connection is available at `ws://localhost:3000`.

### Client Events

- `join_room`: Join a room
  ```json
  { "room": "room-name" }
  ```

- `leave_room`: Leave a room
  ```json
  { "room": "room-name" }
  ```

- `broadcast_room`: Broadcast to room
  ```json
  { "room": "room-name", "event": "event-name", "data": {} }
  ```

### Server Events

- `connect`: Connection established
- `disconnect`: Connection closed
- `error`: Error occurred

## Headers

### Request Headers

- `Content-Type`: application/json
- `Authorization`: Bearer <token>
- `X-Correlation-ID`: Correlation ID (optional, generated if not provided)

### Response Headers

- `Content-Type`: application/json
- `X-Correlation-ID`: Correlation ID for request tracking

## Versioning

API version is not currently included in the URL but will be added in future versions (e.g., `/api/v1/`).

## Documentation

For more information, see:
- [Authentication Guide](./AUTHENTICATION.md)
- [WebSocket Guide](./WEBSOCKET.md)
- [Architecture](../docs/ARCHITECTURE.md)
