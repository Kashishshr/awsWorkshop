const jwt = require('jsonwebtoken');
const logger = require('../../config/logger');
const authConfig = require('../../config/auth');

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('Missing authorization token', { path: req.path });
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_TOKEN',
        message: 'Authorization token is required',
      },
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token', { error: error.message, path: req.path });
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  }
};

/**
 * Optional token verification (doesn't fail if token is missing)
 */
const optionalVerifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret);
      req.user = decoded;
    } catch (error) {
      logger.debug('Invalid optional token', { error: error.message });
    }
  }

  next();
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
};
