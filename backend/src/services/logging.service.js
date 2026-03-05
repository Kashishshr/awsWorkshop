const logger = require('../../config/logger');

/**
 * Log debug message
 */
const debug = (message, data = {}) => {
  logger.debug(message, data);
};

/**
 * Log info message
 */
const info = (message, data = {}) => {
  logger.info(message, data);
};

/**
 * Log warning message
 */
const warn = (message, data = {}) => {
  logger.warn(message, data);
};

/**
 * Log error message
 */
const error = (message, errorData = {}) => {
  logger.error(message, errorData);
};

/**
 * Log HTTP request
 */
const logRequest = (req) => {
  info(`${req.method} ${req.path}`, {
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
    query: req.query,
    userId: req.user?.sub,
  });
};

/**
 * Log HTTP response
 */
const logResponse = (req, statusCode, duration) => {
  info(`${req.method} ${req.path} - ${statusCode} (${duration}ms)`, {
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
    status: statusCode,
    duration,
    userId: req.user?.sub,
  });
};

/**
 * Log error with context
 */
const logError = (message, error, context = {}) => {
  logger.error(message, {
    ...context,
    error: error.message,
    stack: error.stack,
  });
};

module.exports = {
  debug,
  info,
  warn,
  error,
  logRequest,
  logResponse,
  logError,
};
