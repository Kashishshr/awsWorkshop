const redis = require('../../config/redis');
const logger = require('../../config/logger');

/**
 * Get value from cache
 */
const get = async (key) => {
  try {
    const value = await redis.get(key);
    if (value) {
      logger.debug(`Cache hit: ${key}`);
      return JSON.parse(value);
    }
    logger.debug(`Cache miss: ${key}`);
    return null;
  } catch (error) {
    logger.error('Cache get error', { key, error: error.message });
    return null;
  }
};

/**
 * Set value in cache
 */
const set = async (key, value, ttl = 3600) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error('Cache set error', { key, error: error.message });
  }
};

/**
 * Delete value from cache
 */
const del = async (key) => {
  try {
    await redis.del(key);
    logger.debug(`Cache deleted: ${key}`);
  } catch (error) {
    logger.error('Cache delete error', { key, error: error.message });
  }
};

/**
 * Clear all cache
 */
const clear = async () => {
  try {
    await redis.flushdb();
    logger.info('Cache cleared');
  } catch (error) {
    logger.error('Cache clear error', { error: error.message });
  }
};

/**
 * Check if key exists
 */
const exists = async (key) => {
  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    logger.error('Cache exists error', { key, error: error.message });
    return false;
  }
};

/**
 * Get cache size
 */
const getSize = async () => {
  try {
    const info = await redis.info('memory');
    const match = info.match(/used_memory:(\d+)/);
    return match ? parseInt(match[1]) : 0;
  } catch (error) {
    logger.error('Cache size error', { error: error.message });
    return 0;
  }
};

/**
 * Invalidate cache by pattern
 */
const invalidatePattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Cache invalidated: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    logger.error('Cache invalidate pattern error', { pattern, error: error.message });
  }
};

module.exports = {
  get,
  set,
  del,
  clear,
  exists,
  getSize,
  invalidatePattern,
};
