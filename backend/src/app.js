const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('../config/logger');
const authConfig = require('../config/auth');

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: authConfig.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID'],
  })
);

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const correlationId = req.headers['x-correlation-id'] || require('uuid').v4();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`, {
      correlationId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
  });

  req.correlationId = correlationId;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/health', require('./routes/health.routes'));
app.use('/api/weather', require('./routes/weather.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    correlationId: req.correlationId,
    error: err.message,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Internal server error',
      details: authConfig.nodeEnv === 'development' ? err.details : undefined,
    },
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
  });
});

module.exports = app;
