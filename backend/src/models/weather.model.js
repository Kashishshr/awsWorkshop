/**
 * Weather Data Model
 * Represents weather data records stored in the database
 */
class WeatherModel {
  constructor(data = {}) {
    this.id = data.id;
    this.location = data.location;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.temperature = data.temperature;
    this.condition = data.condition;
    this.humidity = data.humidity;
    this.windSpeed = data.windSpeed;
    this.pressure = data.pressure;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.source = data.source || 'open-meteo'; // API source
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate weather data
   */
  validate() {
    const errors = [];

    if (!this.location) {
      errors.push('Location is required');
    }

    if (this.latitude === undefined || this.latitude === null) {
      errors.push('Latitude is required');
    } else if (typeof this.latitude !== 'number' || this.latitude < -90 || this.latitude > 90) {
      errors.push('Latitude must be a number between -90 and 90');
    }

    if (this.longitude === undefined || this.longitude === null) {
      errors.push('Longitude is required');
    } else if (typeof this.longitude !== 'number' || this.longitude < -180 || this.longitude > 180) {
      errors.push('Longitude must be a number between -180 and 180');
    }

    if (this.temperature === undefined || this.temperature === null) {
      errors.push('Temperature is required');
    } else if (typeof this.temperature !== 'number') {
      errors.push('Temperature must be a number');
    }

    if (!this.condition) {
      errors.push('Condition is required');
    }

    if (this.humidity !== undefined && this.humidity !== null) {
      if (typeof this.humidity !== 'number' || this.humidity < 0 || this.humidity > 100) {
        errors.push('Humidity must be a number between 0 and 100');
      }
    }

    if (this.windSpeed !== undefined && this.windSpeed !== null) {
      if (typeof this.windSpeed !== 'number' || this.windSpeed < 0) {
        errors.push('Wind speed must be a non-negative number');
      }
    }

    if (this.pressure !== undefined && this.pressure !== null) {
      if (typeof this.pressure !== 'number' || this.pressure < 0) {
        errors.push('Pressure must be a non-negative number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert to database format
   */
  toDatabase() {
    return {
      id: this.id,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      temperature: this.temperature,
      condition: this.condition,
      humidity: this.humidity,
      wind_speed: this.windSpeed,
      pressure: this.pressure,
      timestamp: this.timestamp,
      source: this.source,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Convert from database format
   */
  static fromDatabase(data) {
    return new WeatherModel({
      id: data.id,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      temperature: data.temperature,
      condition: data.condition,
      humidity: data.humidity,
      windSpeed: data.wind_speed,
      pressure: data.pressure,
      timestamp: data.timestamp,
      source: data.source,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}

module.exports = WeatherModel;
