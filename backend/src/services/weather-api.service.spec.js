const WeatherApiService = require('./weather-api.service');

describe('WeatherApiService', () => {
  let service;

  beforeEach(() => {
    service = new WeatherApiService();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather data', async () => {
      const weather = await service.getCurrentWeather('Test Location', 20, 0);

      expect(weather).toBeDefined();
      expect(weather.temperature).toBeDefined();
      expect(weather.condition).toBeDefined();
      expect(weather.humidity).toBeDefined();
      expect(weather.windSpeed).toBeDefined();
      expect(weather.pressure).toBeDefined();
      expect(weather.location).toBe('Test Location');
      expect(weather.timestamp).toBeDefined();
    });

    it('should use default coordinates if not provided', async () => {
      const weather = await service.getCurrentWeather('Test Location');

      expect(weather).toBeDefined();
      expect(weather.location).toBe('Test Location');
    });
  });

  describe('getWeatherForecast', () => {
    it('should fetch weather forecast', async () => {
      const forecast = await service.getWeatherForecast('Test Location', 20, 0, 7);

      expect(forecast).toBeDefined();
      expect(forecast.location).toBe('Test Location');
      expect(forecast.forecast).toBeDefined();
      expect(Array.isArray(forecast.forecast)).toBe(true);
      expect(forecast.forecast.length).toBeGreaterThan(0);
    });

    it('should limit forecast days to 16', async () => {
      const forecast = await service.getWeatherForecast('Test Location', 20, 0, 30);

      expect(forecast.forecast.length).toBeLessThanOrEqual(16);
    });

    it('should include forecast details', async () => {
      const forecast = await service.getWeatherForecast('Test Location', 20, 0, 7);
      const day = forecast.forecast[0];

      expect(day.date).toBeDefined();
      expect(day.maxTemp).toBeDefined();
      expect(day.minTemp).toBeDefined();
      expect(day.condition).toBeDefined();
      expect(day.precipitation).toBeDefined();
      expect(day.windSpeed).toBeDefined();
    });
  });

  describe('getWeatherHistory', () => {
    it('should fetch weather history', async () => {
      const history = await service.getWeatherHistory('Test Location', 30);

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(30);
    });

    it('should include history details', async () => {
      const history = await service.getWeatherHistory('Test Location', 7);
      const day = history[0];

      expect(day.date).toBeDefined();
      expect(day.temperature).toBeDefined();
      expect(day.humidity).toBeDefined();
      expect(day.windSpeed).toBeDefined();
      expect(day.condition).toBeDefined();
    });
  });

  describe('getWeatherStats', () => {
    it('should calculate weather statistics', async () => {
      const stats = await service.getWeatherStats('Test Location', 'week');

      expect(stats).toBeDefined();
      expect(stats.period).toBe('week');
      expect(stats.location).toBe('Test Location');
      expect(stats.temperature).toBeDefined();
      expect(stats.humidity).toBeDefined();
      expect(stats.windSpeed).toBeDefined();
    });

    it('should include temperature statistics', async () => {
      const stats = await service.getWeatherStats('Test Location', 'week');

      expect(stats.temperature.avg).toBeDefined();
      expect(stats.temperature.max).toBeDefined();
      expect(stats.temperature.min).toBeDefined();
    });

    it('should support different periods', async () => {
      const dayStats = await service.getWeatherStats('Test Location', 'day');
      const weekStats = await service.getWeatherStats('Test Location', 'week');
      const monthStats = await service.getWeatherStats('Test Location', 'month');

      expect(dayStats.dataPoints).toBe(1);
      expect(weekStats.dataPoints).toBe(7);
      expect(monthStats.dataPoints).toBe(30);
    });
  });

  describe('getWeatherCondition', () => {
    it('should convert weather codes to conditions', () => {
      expect(service.getWeatherCondition(0)).toBe('Clear sky');
      expect(service.getWeatherCondition(3)).toBe('Overcast');
      expect(service.getWeatherCondition(61)).toBe('Slight rain');
      expect(service.getWeatherCondition(95)).toBe('Thunderstorm');
    });

    it('should return Unknown for invalid codes', () => {
      expect(service.getWeatherCondition(999)).toBe('Unknown');
    });
  });

  describe('isRetryableError', () => {
    it('should identify retryable errors', () => {
      const networkError = new Error('Network error');
      expect(service.isRetryableError(networkError)).toBe(true);

      const serverError = new Error('Server error');
      serverError.response = { status: 500 };
      expect(service.isRetryableError(serverError)).toBe(true);

      const rateLimitError = new Error('Rate limit');
      rateLimitError.response = { status: 429 };
      expect(service.isRetryableError(rateLimitError)).toBe(true);
    });

    it('should not retry client errors', () => {
      const clientError = new Error('Client error');
      clientError.response = { status: 400 };
      expect(service.isRetryableError(clientError)).toBe(false);

      const notFoundError = new Error('Not found');
      notFoundError.response = { status: 404 };
      expect(service.isRetryableError(notFoundError)).toBe(false);
    });
  });
});
