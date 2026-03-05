# Weather API Documentation

## Overview

The Weather API provides endpoints for retrieving weather data, managing weather alerts, and subscribing to weather notifications. All endpoints require authentication via JWT token.

## Base URL

```
http://localhost:3000/api/weather
```

## Authentication

All endpoints require an `Authorization` header with a valid JWT token:

```
Authorization: Bearer <jwt-token>
```

## Endpoints

### Get Current Weather

**Endpoint**: `GET /current`

**Description**: Retrieve current weather data for a location.

**Query Parameters**:
- `location` (optional): Location name
- `latitude` (required): Latitude coordinate (-90 to 90)
- `longitude` (required): Longitude coordinate (-180 to 180)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/current?location=New%20York&latitude=40.7128&longitude=-74.0060" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "temperature": 22.5,
    "condition": "Partly cloudy",
    "humidity": 65,
    "windSpeed": 12,
    "pressure": 1013,
    "location": "New York",
    "timestamp": "2026-03-05T10:30:00Z"
  },
  "source": "api"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid parameters
- `401`: Unauthorized
- `500`: Server error

---

### Get Weather Forecast

**Endpoint**: `GET /forecast`

**Description**: Retrieve weather forecast for a location.

**Query Parameters**:
- `location` (optional): Location name
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `days` (optional): Number of days (default: 7, max: 16)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/forecast?location=New%20York&latitude=40.7128&longitude=-74.0060&days=7" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "location": "New York",
    "forecast": [
      {
        "date": "2026-03-05",
        "maxTemp": 25,
        "minTemp": 18,
        "condition": "Sunny",
        "precipitation": 0,
        "windSpeed": 15
      }
    ],
    "generatedAt": "2026-03-05T10:30:00Z"
  },
  "source": "api"
}
```

---

### Get Weather Alerts

**Endpoint**: `GET /alerts`

**Description**: Retrieve active weather alerts for a location.

**Query Parameters**:
- `location` (optional): Location name
- `severity` (optional): Alert severity (critical, high, moderate, low)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/alerts?location=New%20York&severity=critical" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "alert_123",
      "type": "THUNDERSTORM",
      "severity": "critical",
      "description": "Severe thunderstorm warning",
      "location": "New York",
      "startTime": "2026-03-05T10:00:00Z",
      "endTime": "2026-03-05T14:00:00Z",
      "affectedDevices": ["device_1", "device_2"]
    }
  ],
  "count": 1
}
```

---

### Subscribe to Weather Alerts

**Endpoint**: `POST /subscribe`

**Description**: Create a subscription to weather alerts for a location.

**Request Body**:
```json
{
  "location": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "alertTypes": ["temperature", "wind", "rain"]
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/weather/subscribe" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "alertTypes": ["temperature", "wind"]
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "sub_123",
    "userId": "user_456",
    "location": "New York",
    "alertTypes": ["temperature", "wind"],
    "active": true,
    "createdAt": "2026-03-05T10:30:00Z"
  }
}
```

**Status Codes**:
- `201`: Subscription created
- `400`: Invalid parameters
- `401`: Unauthorized
- `500`: Server error

---

### Unsubscribe from Weather Alerts

**Endpoint**: `DELETE /subscribe/:subscriptionId`

**Description**: Delete a weather alert subscription.

**Path Parameters**:
- `subscriptionId`: ID of the subscription to delete

**Example Request**:
```bash
curl -X DELETE "http://localhost:3000/api/weather/subscribe/sub_123" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription deleted successfully"
}
```

---

### Get User Subscriptions

**Endpoint**: `GET /subscriptions`

**Description**: Retrieve all subscriptions for the authenticated user.

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/subscriptions" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_123",
      "location": "New York",
      "alertTypes": ["temperature", "wind"],
      "active": true,
      "createdAt": "2026-03-05T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### Acknowledge Weather Alert

**Endpoint**: `POST /alerts/:alertId/acknowledge`

**Description**: Acknowledge a weather alert.

**Path Parameters**:
- `alertId`: ID of the alert to acknowledge

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/weather/alerts/alert_123/acknowledge" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ack_123",
    "alertId": "alert_123",
    "userId": "user_456",
    "acknowledgedAt": "2026-03-05T10:35:00Z"
  }
}
```

---

### Get Weather History

**Endpoint**: `GET /history`

**Description**: Retrieve historical weather data for a location.

**Query Parameters**:
- `location` (required): Location name
- `days` (optional): Number of days (default: 30)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/history?location=New%20York&days=30" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-03",
      "temperature": 20.5,
      "humidity": 60,
      "windSpeed": 10,
      "condition": "Sunny"
    }
  ],
  "count": 30
}
```

---

### Get Weather Statistics

**Endpoint**: `GET /stats`

**Description**: Retrieve weather statistics for a location.

**Query Parameters**:
- `location` (required): Location name
- `period` (optional): Time period (day, week, month - default: week)

**Example Request**:
```bash
curl -X GET "http://localhost:3000/api/weather/stats?location=New%20York&period=week" \
  -H "Authorization: Bearer <token>"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "period": "week",
    "location": "New York",
    "temperature": {
      "avg": 22.5,
      "max": 28,
      "min": 18
    },
    "humidity": {
      "avg": 65,
      "max": 85,
      "min": 45
    },
    "windSpeed": {
      "avg": 12,
      "max": 25,
      "min": 5
    },
    "dataPoints": 7
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  },
  "timestamp": "2026-03-05T10:30:00Z",
  "correlationId": "correlation-id-123"
}
```

### Common Error Codes

- `INVALID_PARAMETERS`: Invalid query or body parameters
- `UNAUTHORIZED`: Missing or invalid authentication token
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error
- `RATE_LIMIT`: Too many requests

---

## Caching

The API implements caching for improved performance:

- **Current Weather**: Cached for 5 minutes
- **Forecast**: Cached for 1 hour
- **History**: Not cached (always fresh)
- **Statistics**: Calculated on-demand

---

## Rate Limiting

Rate limiting is applied per user:

- **Default**: 100 requests per hour
- **Premium**: 1000 requests per hour

---

## WebSocket Events

For real-time updates, connect to the WebSocket endpoint:

```
ws://localhost:3000/socket.io
```

### Subscribe to Alerts

```javascript
socket.emit('weather:subscribe', {
  location: 'New York',
  userId: 'user_456'
});
```

### Receive Alert

```javascript
socket.on('weather:alert', (data) => {
  console.log('Alert received:', data);
});
```

### Acknowledge Alert

```javascript
socket.emit('weather:alert:acknowledge', {
  alertId: 'alert_123',
  userId: 'user_456'
});
```

---

## Examples

### Complete Workflow Example

```bash
# 1. Get current weather
curl -X GET "http://localhost:3000/api/weather/current?location=New%20York&latitude=40.7128&longitude=-74.0060" \
  -H "Authorization: Bearer <token>"

# 2. Subscribe to alerts
curl -X POST "http://localhost:3000/api/weather/subscribe" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "alertTypes": ["temperature", "wind"]
  }'

# 3. Get active alerts
curl -X GET "http://localhost:3000/api/weather/alerts?location=New%20York" \
  -H "Authorization: Bearer <token>"

# 4. Acknowledge alert
curl -X POST "http://localhost:3000/api/weather/alerts/alert_123/acknowledge" \
  -H "Authorization: Bearer <token>"

# 5. Get statistics
curl -X GET "http://localhost:3000/api/weather/stats?location=New%20York&period=week" \
  -H "Authorization: Bearer <token>"
```

---

## Support

For issues or questions, contact the development team or create an issue in the repository.
