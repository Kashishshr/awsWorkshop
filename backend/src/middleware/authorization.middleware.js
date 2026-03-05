const logger = require('../../config/logger');

/**
 * Check if user has required role
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Missing user in request', { path: req.path });
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('User role not allowed', {
        userRole: req.user.role,
        allowedRoles,
        path: req.path,
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'User does not have required role',
        },
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId,
      });
    }

    next();
  };
};

/**
 * Check if user has required permission
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Missing user in request', { path: req.path });
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId,
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      logger.warn('User permissions insufficient', {
        userPermissions,
        requiredPermissions,
        path: req.path,
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'User does not have required permissions',
        },
        timestamp: new Date().toISOString(),
        correlationId: req.correlationId,
      });
    }

    next();
  };
};

module.exports = {
  requireRole,
  requirePermission,
};
