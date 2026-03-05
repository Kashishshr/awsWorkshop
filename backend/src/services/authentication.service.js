const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../../config/logger');
const authConfig = require('../../config/auth');

/**
 * Generate JWT token
 */
const generateToken = (user, expiresIn = authConfig.jwtExpiration) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
  };

  return jwt.sign(payload, authConfig.jwtSecret, { expiresIn });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    sub: user.id,
    type: 'refresh',
  };

  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtRefreshExpiration,
  });
};

/**
 * Verify token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch (error) {
    logger.warn('Token verification failed', { error: error.message });
    return null;
  }
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, authConfig.bcryptRounds);
  } catch (error) {
    logger.error('Password hashing failed', { error: error.message });
    throw error;
  }
};

/**
 * Compare password
 */
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Password comparison failed', { error: error.message });
    throw error;
  }
};

/**
 * Decode token without verification
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.warn('Token decoding failed', { error: error.message });
    return null;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  decodeToken,
};
