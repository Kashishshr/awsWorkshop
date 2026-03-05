/**
 * Weather Alert Model
 * Represents weather alert records stored in the database
 */
class WeatherAlertModel {
  constructor(data = {}) {
    this.id = data.id;
    this.type = data.type; // THUNDERSTORM, WIND, RAIN, etc.
    this.severity = data.severity; // critical, high, moderate, low
    this.description = data.description;
    this.location = data.location;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.startTime = data.startTime || new Date().toISOString();
    this.endTime = data.endTime;
    this.affectedDevices = data.affectedDevices || [];
    this.acknowledged = data.acknowledged || false;
    this.acknowledgedBy = data.acknowledgedBy;
    this.acknowledgedAt = data.acknowledgedAt;
    this.dismissed = data.dismissed || false;
    this.dismissedBy = data.dismissedBy;
    this.dismissedAt = data.dismissedAt;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validate alert data
   */
  validate() {
    const errors = [];
    const validSeverities = ['critical', 'high', 'moderate', 'low'];

    if (!this.type) {
      errors.push('Alert type is required');
    }

    if (!this.severity) {
      errors.push('Severity is required');
    } else if (!validSeverities.includes(this.severity)) {
      errors.push(`Severity must be one of: ${validSeverities.join(', ')}`);
    }

    if (!this.description) {
      errors.push('Description is required');
    }

    if (!this.location) {
      errors.push('Location is required');
    }

    if (!this.endTime) {
      errors.push('End time is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if alert is active
   */
  isActive() {
    const now = new Date();
    const endTime = new Date(this.endTime);
    return now < endTime && !this.dismissed;
  }

  /**
   * Check if alert is expired
   */
  isExpired() {
    const now = new Date();
    const endTime = new Date(this.endTime);
    return now > endTime;
  }

  /**
   * Acknowledge alert
   */
  acknowledge(userId) {
    this.acknowledged = true;
    this.acknowledgedBy = userId;
    this.acknowledgedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Dismiss alert
   */
  dismiss(userId) {
    this.dismissed = true;
    this.dismissedBy = userId;
    this.dismissedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to database format
   */
  toDatabase() {
    return {
      id: this.id,
      type: this.type,
      severity: this.severity,
      description: this.description,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      start_time: this.startTime,
      end_time: this.endTime,
      affected_devices: JSON.stringify(this.affectedDevices),
      acknowledged: this.acknowledged,
      acknowledged_by: this.acknowledgedBy,
      acknowledged_at: this.acknowledgedAt,
      dismissed: this.dismissed,
      dismissed_by: this.dismissedBy,
      dismissed_at: this.dismissedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Convert from database format
   */
  static fromDatabase(data) {
    return new WeatherAlertModel({
      id: data.id,
      type: data.type,
      severity: data.severity,
      description: data.description,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      startTime: data.start_time,
      endTime: data.end_time,
      affectedDevices: JSON.parse(data.affected_devices || '[]'),
      acknowledged: data.acknowledged,
      acknowledgedBy: data.acknowledged_by,
      acknowledgedAt: data.acknowledged_at,
      dismissed: data.dismissed,
      dismissedBy: data.dismissed_by,
      dismissedAt: data.dismissed_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }
}

module.exports = WeatherAlertModel;
