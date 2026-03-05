const express = require('express');
const router = express.Router();
const { optionalVerifyToken } = require('../middleware/auth.middleware');
const deviceService = require('../services/device.service');

// GET /api/devices - Get all devices
router.get('/', optionalVerifyToken, async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({
      success: true,
      data: devices,
      count: devices.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/devices/stats - Get device statistics
router.get('/stats', optionalVerifyToken, async (req, res) => {
  try {
    const stats = await deviceService.getDeviceStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/devices/:deviceId - Get device by ID
router.get('/:deviceId', optionalVerifyToken, async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Device not found' },
      });
    }
    res.json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/devices/status/:status - Get devices by status
router.get('/status/:status', optionalVerifyToken, async (req, res) => {
  try {
    const devices = await deviceService.getDevicesByStatus(req.params.status);
    res.json({
      success: true,
      data: devices,
      count: devices.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/devices/bounds - Get devices in bounding box
router.get('/bounds', optionalVerifyToken, async (req, res) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = req.query;
    const devices = await deviceService.getDevicesInBounds(
      parseFloat(minLat),
      parseFloat(maxLat),
      parseFloat(minLng),
      parseFloat(maxLng)
    );
    res.json({
      success: true,
      data: devices,
      count: devices.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

module.exports = router;
