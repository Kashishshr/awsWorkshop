const LoggingService = require('./logging.service');

class WeatherWebSocketService {
  constructor(io) {
    this.io = io;
    this.loggingService = new LoggingService();
    this.userRooms = new Map(); // userId -> Set of rooms
    this.roomSubscriptions = new Map(); // room -> Set of userIds
  }

  /**
   * Initialize WebSocket event handlers
   */
  initializeHandlers() {
    this.io.on('connection', (socket) => {
      this.loggingService.info('WebSocket client connected', {
        socketId: socket.id,
      });

      // Subscribe to weather alerts
      socket.on('weather:subscribe', (data) => this.handleSubscribe(socket, data));

      // Unsubscribe from weather alerts
      socket.on('weather:unsubscribe', (data) => this.handleUnsubscribe(socket, data));

      // Request current weather
      socket.on('weather:request', (data) => this.handleWeatherRequest(socket, data));

      // Acknowledge alert
      socket.on('weather:alert:acknowledge', (data) => this.handleAlertAcknowledge(socket, data));

      // Disconnect
      socket.on('disconnect', () => this.handleDisconnect(socket));

      // Error handling
      socket.on('error', (error) => this.handleError(socket, error));
    });
  }

  /**
   * Handle subscription request
   */
  handleSubscribe(socket, data) {
    try {
      const { location, userId } = data;
      const room = `weather:${location}`;

      this.loggingService.info('Client subscribing to weather alerts', {
        socketId: socket.id,
        userId,
        location,
      });

      // Join room
      socket.join(room);

      // Track user rooms
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      this.userRooms.get(userId).add(room);

      // Track room subscriptions
      if (!this.roomSubscriptions.has(room)) {
        this.roomSubscriptions.set(room, new Set());
      }
      this.roomSubscriptions.get(room).add(userId);

      // Send confirmation
      socket.emit('weather:subscribed', {
        success: true,
        location,
        room,
      });

      this.loggingService.info('Client subscribed to weather alerts', {
        socketId: socket.id,
        room,
        totalSubscribers: this.roomSubscriptions.get(room).size,
      });
    } catch (error) {
      this.loggingService.error('Error handling weather subscription', {
        error: error.message,
        socketId: socket.id,
      });

      socket.emit('weather:error', {
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Handle unsubscription request
   */
  handleUnsubscribe(socket, data) {
    try {
      const { location, userId } = data;
      const room = `weather:${location}`;

      this.loggingService.info('Client unsubscribing from weather alerts', {
        socketId: socket.id,
        userId,
        location,
      });

      // Leave room
      socket.leave(room);

      // Update tracking
      if (this.userRooms.has(userId)) {
        this.userRooms.get(userId).delete(room);
      }

      if (this.roomSubscriptions.has(room)) {
        this.roomSubscriptions.get(room).delete(userId);
      }

      // Send confirmation
      socket.emit('weather:unsubscribed', {
        success: true,
        location,
      });

      this.loggingService.info('Client unsubscribed from weather alerts', {
        socketId: socket.id,
        room,
      });
    } catch (error) {
      this.loggingService.error('Error handling weather unsubscription', {
        error: error.message,
        socketId: socket.id,
      });

      socket.emit('weather:error', {
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Handle weather data request
   */
  handleWeatherRequest(socket, data) {
    try {
      const { location, userId } = data;

      this.loggingService.info('Client requesting weather data', {
        socketId: socket.id,
        userId,
        location,
      });

      // In production, fetch from weather service
      const weatherData = {
        location,
        temperature: 20 + Math.random() * 15,
        condition: 'Partly Cloudy',
        humidity: 60,
        windSpeed: 10,
        pressure: 1013,
        timestamp: new Date().toISOString(),
      };

      socket.emit('weather:data', {
        success: true,
        data: weatherData,
      });

      this.loggingService.info('Weather data sent to client', {
        socketId: socket.id,
        location,
      });
    } catch (error) {
      this.loggingService.error('Error handling weather request', {
        error: error.message,
        socketId: socket.id,
      });

      socket.emit('weather:error', {
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Handle alert acknowledgment
   */
  handleAlertAcknowledge(socket, data) {
    try {
      const { alertId, userId } = data;

      this.loggingService.info('Client acknowledging weather alert', {
        socketId: socket.id,
        userId,
        alertId,
      });

      socket.emit('weather:alert:acknowledged', {
        success: true,
        alertId,
      });

      this.loggingService.info('Alert acknowledgment recorded', {
        socketId: socket.id,
        alertId,
      });
    } catch (error) {
      this.loggingService.error('Error handling alert acknowledgment', {
        error: error.message,
        socketId: socket.id,
      });

      socket.emit('weather:error', {
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Handle client disconnect
   */
  handleDisconnect(socket) {
    try {
      this.loggingService.info('WebSocket client disconnected', {
        socketId: socket.id,
      });

      // Clean up user rooms
      for (const [userId, rooms] of this.userRooms.entries()) {
        for (const room of rooms) {
          if (this.roomSubscriptions.has(room)) {
            this.roomSubscriptions.get(room).delete(userId);
          }
        }
      }
    } catch (error) {
      this.loggingService.error('Error handling client disconnect', {
        error: error.message,
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle WebSocket errors
   */
  handleError(socket, error) {
    this.loggingService.error('WebSocket error', {
      socketId: socket.id,
      error: error.message,
    });
  }

  /**
   * Broadcast alert to location subscribers
   */
  broadcastAlert(location, alert) {
    try {
      const room = `weather:${location}`;

      this.loggingService.info('Broadcasting weather alert', {
        room,
        alertId: alert.id,
        subscribers: this.roomSubscriptions.get(room)?.size || 0,
      });

      this.io.to(room).emit('weather:alert', {
        success: true,
        data: alert,
      });
    } catch (error) {
      this.loggingService.error('Error broadcasting weather alert', {
        error: error.message,
        location,
      });
    }
  }

  /**
   * Broadcast weather update to location subscribers
   */
  broadcastWeatherUpdate(location, weatherData) {
    try {
      const room = `weather:${location}`;

      this.loggingService.info('Broadcasting weather update', {
        room,
        location,
        subscribers: this.roomSubscriptions.get(room)?.size || 0,
      });

      this.io.to(room).emit('weather:update', {
        success: true,
        data: weatherData,
      });
    } catch (error) {
      this.loggingService.error('Error broadcasting weather update', {
        error: error.message,
        location,
      });
    }
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      totalConnections: this.io.engine.clientsCount,
      totalRooms: this.roomSubscriptions.size,
      totalUsers: this.userRooms.size,
      rooms: Array.from(this.roomSubscriptions.entries()).map(([room, users]) => ({
        room,
        subscribers: users.size,
      })),
    };
  }
}

module.exports = WeatherWebSocketService;
