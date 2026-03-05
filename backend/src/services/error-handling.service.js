const logger = require('../../config/logger');

/**
 * Custom error class
 */
class AppError extends Error {
  constructor(code, message, statusCode = 500, details = {}) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super('VALIDATION_ERROR', message, 400, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super('AUTHENTICATION_ERROR', message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super('AUTHORIZATION_ERROR', message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not found error
 */
class NotFoundError extends AppError {
  constructor(resource) {
    super('NOT_FOUND', `${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict error
 */
class ConflictError extends AppError {
  constructor(message) {
    super('CONFLICT', message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Server error
 */
class ServerError extends AppError {
  constructor(message = 'Internal server error') {
    super('SERVER_ERROR', message, 500);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Handle error and return response
 */
const handleError = (error, req, res) => {
  let appError = error;

  if (!(error instanceof AppError)) {
    appError = new ServerError(error.message);
  }

  logger.error(`Error: ${appError.message}`, {
    correlationId: req.correlationId,
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
    stack: error.stack,
  });

  res.status(appError.statusCode).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    },
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
  });
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  ServerError,
  handleError,
  asyncHandler,
};
