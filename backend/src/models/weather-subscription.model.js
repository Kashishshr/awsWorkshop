/**
 * Weather Subscription Model
 * Represents user subscriptions to weather alerts
 */
class WeatherSubscriptionModel {
  constructor(data = {}) {
    this.id = data.id;
    this.userId = data.userId;
    this.location = data.location;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.alertTypes = data.alertTypes || ['all']; // Array of alert types to subscribe to
    this.severity = data.severity || ['critical', 'high']; // Minimum severity levels
    this.notificationMethod = data.notificationMethod || 'websocket'; // websocket, email, sms
    this.active = data.active !== undefined ? data.active : true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate subscription data
   */
  validate() {
    const errors = [];
    const validNotificationMethods = ['websocket', 'email', 'sms'];

    if (!this.userId) {
      errors.push('User ID is required');
    }

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

    if (!Array.isArray(this.alertTypes) || this.alertTypes.length === 0) {
      errors.push('Alert types must be a non-empty array');
    }

    if (!Array.isArray(this.severity) || this.severity.length === 0) {
      errors.push('Severity levels must be a non-empty array');
    }

    if (!validNotificationMethods.includes(this.notificationMethod)) {
      errors.push(`Notification method must be one of: ${validNotificationMethods.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if subscription matches alert
   */
  matchesAlert(alert) {
    // Check if alert type is subscribed
    if (this.alertTypes.length > 0 && !this.alertTypes.includes('all')) {
      if (!this.alertTypes.includes(alert.type)) {
        return false;
      }
    }

    // Check if alert severity is subscribed
    const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
    const alertSeverityLevel = severityOrder[alert.severity] || 3;
    const minSeverityLevel = Math.min(...this.severity.map((s) => severityOrder[s] || 3));

    if (alertSeverityLevel > minSeverityLevel) {
      return false;
    }

    return true;
  }

  /**
   * Activate subscription
   */
  activate() {
    this.active = true;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Deactivate subscription
   */
  deactivate() {
    this.active = false;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to database format
   */
  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      alert_types: JSON.stringify(this.alertTypes),
      severity: JSON.stringify(this.severity),
      notification_method: this.notificationMethod,
      active: this.active,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Convert from database format
   */
  static fromDatabase(data) {
    return new WeatherSubscriptionModel({
      id: data.id,
      userId: data.user_id,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      alertTypes: JSON.parse(data.alert_types || '["all"]'),
      severity: JSON.parse(data.severity || '["critical","high"]'),
      notificationMethod: data.notification_method,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}

module.exports = WeatherSubscriptionModel;
