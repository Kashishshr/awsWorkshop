# WebSocket Guide

## Overview

The Power Grid Device Simulation uses Socket.io for real-time bidirectional communication between client and server.

## Connection

### Connect to WebSocket

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

## Events

### Client Events (Emit)

#### join_room

Join a room to receive room-specific events.

```typescript
socket.emit('join_room', { room: 'devices' });
```

#### leave_room

Leave a room.

```typescript
socket.emit('leave_room', { room: 'devices' });
```

#### broadcast_room

Broadcast an event to all clients in a room.

```typescript
socket.emit('broadcast_room', {
  room: 'devices',
  event: 'device_update',
  data: { deviceId: '123', status: 'online' },
});
```

### Server Events (Listen)

#### connect

Emitted when client connects to server.

```typescript
socket.on('connect', () => {
  console.log('Connected with ID:', socket.id);
});
```

#### disconnect

Emitted when client disconnects from server.

```typescript
socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

#### error

Emitted when an error occurs.

```typescript
socket.on('error', (error) => {
  console.error('Error:', error);
});
```

## Room Management

### Rooms

Rooms allow you to broadcast events to a subset of clients.

**Available Rooms:**
- `devices` - Device updates
- `weather` - Weather alerts
- `health` - Device health updates
- `alerts` - System alerts

### Join Room

```typescript
socket.emit('join_room', { room: 'devices' });
```

### Leave Room

```typescript
socket.emit('leave_room', { room: 'devices' });
```

### Broadcast to Room

```typescript
socket.emit('broadcast_room', {
  room: 'devices',
  event: 'device_status_changed',
  data: {
    deviceId: '123',
    status: 'offline',
    timestamp: new Date(),
  },
});
```

## Real-Time Updates

### Device Updates

Listen for device status changes:

```typescript
socket.on('device_status_changed', (data) => {
  console.log('Device status:', data);
  // { deviceId: '123', status: 'online', timestamp: '...' }
});
```

### Weather Alerts

Listen for weather alerts:

```typescript
socket.on('weather_alert', (data) => {
  console.log('Weather alert:', data);
  // { alertId: '456', type: 'severe_thunderstorm', severity: 'high' }
});
```

### Health Updates

Listen for device health updates:

```typescript
socket.on('health_update', (data) => {
  console.log('Health update:', data);
  // { deviceId: '123', healthScore: 85, status: 'healthy' }
});
```

## Acknowledgments

Send event with acknowledgment:

```typescript
socket.emit('get_device_status', { deviceId: '123' }, (response) => {
  console.log('Device status:', response);
});
```

## Error Handling

### Connection Errors

```typescript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

### Reconnection

Socket.io automatically reconnects with exponential backoff:

```typescript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Reconnection attempt', attemptNumber);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect');
});
```

## Best Practices

### 1. Connection Management

```typescript
// Check connection status
if (socket.connected) {
  socket.emit('event', data);
} else {
  console.warn('Not connected');
}
```

### 2. Event Naming

Use descriptive event names:
- `device_status_changed`
- `weather_alert_received`
- `health_check_completed`

### 3. Data Validation

Validate data before emitting:

```typescript
if (data && data.deviceId) {
  socket.emit('update_device', data);
}
```

### 4. Error Handling

Always handle errors:

```typescript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Implement error recovery
});
```

### 5. Cleanup

Disconnect when done:

```typescript
socket.disconnect();
```

## Performance Considerations

### 1. Throttle Events

Limit event frequency:

```typescript
let lastUpdate = 0;
const throttleDelay = 1000; // 1 second

socket.on('sensor_data', (data) => {
  const now = Date.now();
  if (now - lastUpdate > throttleDelay) {
    processData(data);
    lastUpdate = now;
  }
});
```

### 2. Batch Updates

Send multiple updates in one event:

```typescript
socket.emit('batch_update', {
  devices: [
    { id: '1', status: 'online' },
    { id: '2', status: 'offline' },
  ],
});
```

### 3. Unsubscribe from Events

Remove event listeners when not needed:

```typescript
socket.off('device_status_changed');
```

## Testing

### Test Connection

```bash
# Using wscat
npm install -g wscat
wscat -c ws://localhost:3000
```

### Test Events

```typescript
// Connect
socket.on('connect', () => {
  console.log('Connected');

  // Join room
  socket.emit('join_room', { room: 'test' });

  // Send event
  socket.emit('test_event', { message: 'Hello' });

  // Listen for response
  socket.on('test_response', (data) => {
    console.log('Response:', data);
  });
});
```

## Troubleshooting

### Connection Refused

- Check server is running
- Verify WebSocket port (3000)
- Check firewall settings

### Events Not Received

- Verify room subscription
- Check event name spelling
- Verify data format

### Reconnection Issues

- Check network connectivity
- Verify server is responding
- Check reconnection configuration

## References

- [Socket.io Documentation](https://socket.io/docs/)
- [Socket.io Client API](https://socket.io/docs/client-api/)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
