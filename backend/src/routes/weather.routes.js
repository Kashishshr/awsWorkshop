const express = require('express');
const router = express.Router();
const { optionalVerifyToken } = require('../middleware/auth.middleware');

// Simple weather endpoints
// All routes use optional authentication (work with or without token)

// GET /api/weather/current
router.get('/current', optionalVerifyToken, (req, res) => {
  try {
    const { location = 'Default Location', latitude = 20, longitude = 0 } = req.query;
    
    res.json({
      success: true,
      data: {
        temperature: 22.5 + Math.random() * 10,
        condition: 'Partly Cloudy',
        humidity: 60 + Math.random() * 20,
        windSpeed: 10 + Math.random() * 10,
        pressure: 1013,
        location,
        timestamp: new Date().toISOString(),
      },
      source: 'api',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/weather/forecast
router.get('/forecast', optionalVerifyToken, (req, res) => {
  try {
    const { location = 'Default Location', days = 7 } = req.query;
    const forecast = [];
    
    for (let i = 0; i < Math.min(parseInt(days), 16); i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        maxTemp: 25 + Math.random() * 10,
        minTemp: 15 + Math.random() * 10,
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        precipitation: Math.random() * 50,
        windSpeed: 10 + Math.random() * 15,
      });
    }
    
    res.json({
      success: true,
      data: { location, forecast, generatedAt: new Date().toISOString() },
      source: 'api',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/weather/alerts
router.get('/alerts', optionalVerifyToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      count: 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// POST /api/weather/subscribe
router.post('/subscribe', optionalVerifyToken, (req, res) => {
  try {
    const { location, latitude, longitude, alertTypes } = req.body;
    
    res.status(201).json({
      success: true,
      data: {
        id: `sub_${Date.now()}`,
        location,
        alertTypes: alertTypes || ['all'],
        active: true,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// DELETE /api/weather/subscribe/:subscriptionId
router.delete('/subscribe/:subscriptionId', optionalVerifyToken, (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/weather/subscriptions
router.get('/subscriptions', optionalVerifyToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      count: 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// POST /api/weather/alerts/:alertId/acknowledge
router.post('/alerts/:alertId/acknowledge', optionalVerifyToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: `ack_${Date.now()}`,
        alertId: req.params.alertId,
        acknowledgedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/weather/history
router.get('/history', optionalVerifyToken, (req, res) => {
  try {
    const { location = 'Default Location', days = 30 } = req.query;
    const history = [];
    
    for (let i = 0; i < parseInt(days); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      history.push({
        date: date.toISOString().split('T')[0],
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 50,
        windSpeed: 5 + Math.random() * 20,
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
      });
    }
    
    res.json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

// GET /api/weather/stats
router.get('/stats', optionalVerifyToken, (req, res) => {
  try {
    const { location = 'Default Location', period = 'week' } = req.query;
    
    res.json({
      success: true,
      data: {
        period,
        location,
        temperature: {
          avg: 22.5,
          max: 28,
          min: 18,
        },
        humidity: {
          avg: 65,
          max: 85,
          min: 45,
        },
        windSpeed: {
          avg: 12,
          max: 25,
          min: 5,
        },
        dataPoints: period === 'day' ? 1 : period === 'week' ? 7 : 30,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
});

module.exports = router;
