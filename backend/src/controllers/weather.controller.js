const WeatherApiService = require('../services/weather-api.service');
const WeatherAlertService = require('../services/weather-alert.service');
const WeatherWebSocketService = require('../services/weather-websocket.service');
const LoggingService = require('../services/logging.service');
const ErrorHandlingService = require('../services/error-handling.service');
const CacheService = require('../services/cache.service');

class WeatherController {
  constructor() {
    this.weatherApiService = new WeatherApiService();
    this.weatherAlertService = new WeatherAlertService();
    this.weatherWebSocketService = new WeatherWebSocketService();
    this.loggingService = new LoggingService();
    this.errorHandlingService = new ErrorHandlingService();
    this.cacheService = new CacheService();
  }

  /**
   * Get current weather data
   */
  getCurrentWeather = async (req, res) => {
    try {
      const { location, latitude, longitude } = req.query;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching current weather', {
        correlationId,
        location,
        latitude,
        longitude,
      });

      // Check cache first
      const cacheKey = `weather:current:${location || `${latitude},${longitude}`}`;
      const cachedWeather = this.cacheService.get(cacheKey);

      if (cachedWeather) {
        this.loggingService.info('Weather data retrieved from cache', { correlationId });
        return res.json({
          success: true,
          data: cachedWeather,
          source: 'cache',
        });
      }

      // Fetch from API
      const weather = await this.weatherApiService.getCurrentWeather(location, latitude, longitude);

      // Cache for 5 minutes
      this.cacheService.set(cacheKey, weather, 5 * 60 * 1000);

      this.loggingService.info('Current weather fetched successfully', { correlationId });

      res.json({
        success: true,
        data: weather,
        source: 'api',
      });
    } catch (error) {
      this.loggingService.error('Error fetching current weather', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Get weather forecast
   */
  getWeatherForecast = async (req, res) => {
    try {
      const { location, latitude, longitude, days = 7 } = req.query;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching weather forecast', {
        correlationId,
        location,
        latitude,
        longitude,
        days,
      });

      // Check cache
      const cacheKey = `weather:forecast:${location || `${latitude},${longitude}`}:${days}`;
      const cachedForecast = this.cacheService.get(cacheKey);

      if (cachedForecast) {
        this.loggingService.info('Forecast data retrieved from cache', { correlationId });
        return res.json({
          success: true,
          data: cachedForecast,
          source: 'cache',
        });
      }

      // Fetch from API
      const forecast = await this.weatherApiService.getWeatherForecast(
        location,
        latitude,
        longitude,
        parseInt(days)
      );

      // Cache for 1 hour
      this.cacheService.set(cacheKey, forecast, 60 * 60 * 1000);

      this.loggingService.info('Weather forecast fetched successfully', { correlationId });

      res.json({
        success: true,
        data: forecast,
        source: 'api',
      });
    } catch (error) {
      this.loggingService.error('Error fetching weather forecast', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Get weather alerts
   */
  getWeatherAlerts = async (req, res) => {
    try {
      const { location, severity } = req.query;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching weather alerts', {
        correlationId,
        location,
        severity,
      });

      const alerts = await this.weatherAlertService.getAlerts(location, severity);

      this.loggingService.info('Weather alerts fetched successfully', {
        correlationId,
        count: alerts.length,
      });

      res.json({
        success: true,
        data: alerts,
        count: alerts.length,
      });
    } catch (error) {
      this.loggingService.error('Error fetching weather alerts', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Subscribe to weather alerts
   */
  subscribeToAlerts = async (req, res) => {
    try {
      const { location, latitude, longitude, alertTypes } = req.body;
      const userId = req.user.id;
      const correlationId = req.correlationId;

      this.loggingService.info('Creating weather alert subscription', {
        correlationId,
        userId,
        location,
        alertTypes,
      });

      const subscription = await this.weatherAlertService.createSubscription({
        userId,
        location,
        latitude,
        longitude,
        alertTypes,
      });

      this.loggingService.info('Weather alert subscription created', {
        correlationId,
        subscriptionId: subscription.id,
      });

      res.status(201).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      this.loggingService.error('Error creating weather alert subscription', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Unsubscribe from weather alerts
   */
  unsubscribeFromAlerts = async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user.id;
      const correlationId = req.correlationId;

      this.loggingService.info('Deleting weather alert subscription', {
        correlationId,
        userId,
        subscriptionId,
      });

      await this.weatherAlertService.deleteSubscription(subscriptionId, userId);

      this.loggingService.info('Weather alert subscription deleted', {
        correlationId,
        subscriptionId,
      });

      res.json({
        success: true,
        message: 'Subscription deleted successfully',
      });
    } catch (error) {
      this.loggingService.error('Error deleting weather alert subscription', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Get user's subscriptions
   */
  getUserSubscriptions = async (req, res) => {
    try {
      const userId = req.user.id;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching user subscriptions', {
        correlationId,
        userId,
      });

      const subscriptions = await this.weatherAlertService.getUserSubscriptions(userId);

      this.loggingService.info('User subscriptions fetched successfully', {
        correlationId,
        count: subscriptions.length,
      });

      res.json({
        success: true,
        data: subscriptions,
        count: subscriptions.length,
      });
    } catch (error) {
      this.loggingService.error('Error fetching user subscriptions', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Acknowledge a weather alert
   */
  acknowledgeAlert = async (req, res) => {
    try {
      const { alertId } = req.params;
      const userId = req.user.id;
      const correlationId = req.correlationId;

      this.loggingService.info('Acknowledging weather alert', {
        correlationId,
        userId,
        alertId,
      });

      const acknowledgment = await this.weatherAlertService.acknowledgeAlert(alertId, userId);

      this.loggingService.info('Weather alert acknowledged', {
        correlationId,
        alertId,
      });

      res.json({
        success: true,
        data: acknowledgment,
      });
    } catch (error) {
      this.loggingService.error('Error acknowledging weather alert', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Get weather history
   */
  getWeatherHistory = async (req, res) => {
    try {
      const { location, days = 30 } = req.query;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching weather history', {
        correlationId,
        location,
        days,
      });

      const history = await this.weatherApiService.getWeatherHistory(location, parseInt(days));

      this.loggingService.info('Weather history fetched successfully', {
        correlationId,
        records: history.length,
      });

      res.json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      this.loggingService.error('Error fetching weather history', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };

  /**
   * Get weather statistics
   */
  getWeatherStats = async (req, res) => {
    try {
      const { location, period = 'week' } = req.query;
      const correlationId = req.correlationId;

      this.loggingService.info('Fetching weather statistics', {
        correlationId,
        location,
        period,
      });

      const stats = await this.weatherApiService.getWeatherStats(location, period);

      this.loggingService.info('Weather statistics fetched successfully', {
        correlationId,
      });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      this.loggingService.error('Error fetching weather statistics', {
        correlationId: req.correlationId,
        error: error.message,
      });

      const response = this.errorHandlingService.handleError(error);
      res.status(response.statusCode).json(response);
    }
  };
}

module.exports = WeatherController;
