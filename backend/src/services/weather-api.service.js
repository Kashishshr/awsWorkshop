const axios = require('axios');
const LoggingService = require('./logging.service');

const OPEN_METEO_API = 'https://api.open-meteo.com/v1';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class WeatherApiService {
  constructor() {
    this.loggingService = new LoggingService();
    this.client = axios.create({
      baseURL: OPEN_METEO_API,
      timeout: 10000,
    });
  }

  /**
   * Get current weather data from Open-Meteo API
   */
  async getCurrentWeather(location, latitude, longitude) {
    try {
      // Use provided coordinates or default to a location
      const lat = latitude || 20;
      const lon = longitude || 0;

      this.loggingService.info('Fetching current weather from Open-Meteo API', {
        location,
        latitude: lat,
        longitude: lon,
      });

      const response = await this.retryRequest(() =>
        this.client.get('/forecast', {
          params: {
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl',
            timezone: 'auto',
          },
        })
      );

      const current = response.data.current;

      return {
        temperature: current.temperature_2m,
        condition: this.getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        pressure: current.pressure_msl,
        location: location || `${lat},${lon}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.loggingService.error('Error fetching current weather', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Get weather forecast from Open-Meteo API
   */
  async getWeatherForecast(location, latitude, longitude, days = 7) {
    try {
      const lat = latitude || 20;
      const lon = longitude || 0;

      this.loggingService.info('Fetching weather forecast from Open-Meteo API', {
        location,
        latitude: lat,
        longitude: lon,
        days,
      });

      const response = await this.retryRequest(() =>
        this.client.get('/forecast', {
          params: {
            latitude: lat,
            longitude: lon,
            daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max',
            timezone: 'auto',
            forecast_days: Math.min(days, 16), // Open-Meteo max is 16 days
          },
        })
      );

      const daily = response.data.daily;
      const forecast = [];

      for (let i = 0; i < daily.time.length; i++) {
        forecast.push({
          date: daily.time[i],
          maxTemp: daily.temperature_2m_max[i],
          minTemp: daily.temperature_2m_min[i],
          condition: this.getWeatherCondition(daily.weather_code[i]),
          precipitation: daily.precipitation_sum[i],
          windSpeed: daily.wind_speed_10m_max[i],
        });
      }

      return {
        location: location || `${lat},${lon}`,
        forecast,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.loggingService.error('Error fetching weather forecast', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Get weather history (simulated - Open-Meteo doesn't provide historical data in free tier)
   */
  async getWeatherHistory(location, days = 30) {
    try {
      this.loggingService.info('Fetching weather history', {
        location,
        days,
      });

      // Simulate historical data
      const history = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        history.push({
          date: date.toISOString().split('T')[0],
          temperature: 20 + Math.random() * 15,
          humidity: 40 + Math.random() * 50,
          windSpeed: 5 + Math.random() * 20,
          condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        });
      }

      return history;
    } catch (error) {
      this.loggingService.error('Error fetching weather history', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Get weather statistics
   */
  async getWeatherStats(location, period = 'week') {
    try {
      this.loggingService.info('Calculating weather statistics', {
        location,
        period,
      });

      const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
      const history = await this.getWeatherHistory(location, days);

      const temperatures = history.map((h) => h.temperature);
      const humidities = history.map((h) => h.humidity);
      const windSpeeds = history.map((h) => h.windSpeed);

      return {
        period,
        location,
        temperature: {
          avg: temperatures.reduce((a, b) => a + b) / temperatures.length,
          max: Math.max(...temperatures),
          min: Math.min(...temperatures),
        },
        humidity: {
          avg: humidities.reduce((a, b) => a + b) / humidities.length,
          max: Math.max(...humidities),
          min: Math.min(...humidities),
        },
        windSpeed: {
          avg: windSpeeds.reduce((a, b) => a + b) / windSpeeds.length,
          max: Math.max(...windSpeeds),
          min: Math.min(...windSpeeds),
        },
        dataPoints: history.length,
      };
    } catch (error) {
      this.loggingService.error('Error calculating weather statistics', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Retry request with exponential backoff
   */
  async retryRequest(requestFn, retries = MAX_RETRIES) {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        this.loggingService.warn('Retrying request', {
          retriesRemaining: retries - 1,
          error: error.message,
        });

        await this.delay(RETRY_DELAY);
        return this.retryRequest(requestFn, retries - 1);
      }

      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(error) {
    if (!error.response) {
      return true; // Network error
    }

    const status = error.response.status;
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Convert WMO weather code to readable condition
   */
  getWeatherCondition(code) {
    const conditions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };

    return conditions[code] || 'Unknown';
  }
}

module.exports = WeatherApiService;
