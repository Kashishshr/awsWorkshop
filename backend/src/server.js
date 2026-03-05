require('dotenv').config();
const http = require('http');
const app = require('./app');
const logger = require('../config/logger');
const authConfig = require('../config/auth');

const PORT = authConfig.apiPort;

const server = http.createServer(app);

// WebSocket setup (Socket.io)
const io = require('socket.io')(server, {
  cors: {
    origin: authConfig.corsOrigin,
    credentials: true,
  },
});

// Store io instance for use in routes
app.set('io', io);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('WebSocket client connected', { socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info('WebSocket client disconnected', { socketId: socket.id });
  });

  socket.on('error', (error) => {
    logger.error('WebSocket error', { socketId: socket.id, error: error.message });
  });

  // Room management
  socket.on('join_room', (data) => {
    socket.join(data.room);
    logger.debug(`Client joined room: ${data.room}`, { socketId: socket.id });
  });

  socket.on('leave_room', (data) => {
    socket.leave(data.room);
    logger.debug(`Client left room: ${data.room}`, { socketId: socket.id });
  });

  // Broadcast to room
  socket.on('broadcast_room', (data) => {
    io.to(data.room).emit(data.event, data.data);
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: authConfig.nodeEnv,
    port: PORT,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

module.exports = server;
