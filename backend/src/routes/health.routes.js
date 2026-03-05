const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../services/error-handling.service');
const logger = require('../../config/logger');

/**
 * GET /api/health
 * Health check endpoint
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    logger.debug('Health check', { correlationId: req.correlationId });

    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId,
    });
  })
);

module.exports = router;
