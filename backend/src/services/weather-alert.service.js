const LoggingService = require('./logging.service');

class WeatherAlertService {
  constructor() {
    this.loggingService = new LoggingService();
    // In-memory storage (would be replaced with database in production)
    this.subscriptions = new Map();
    this.alerts = new Map();
    this.acknowledgments = new Map();
    this.subscriptionCounter = 0;
    this.alertCounter = 0;
  }

  /**
   * Create a weather alert subscription
   */
  async createSubscription(data) {
    try {
      const { userId, location, latitude, longitude, alertTypes } = data;

      this.loggingService.info('Creating weather alert subscription', {
        userId,
        location,
        alertTypes,
      });

      const subscriptionId = `sub_${++this.subscriptionCounter}`;
      const subscription = {
        id: subscriptionId,
        userId,
        location,
        latitude,
        longitude,
        alertTypes: alertTypes || ['all'],
        createdAt: new Date().toISOString(),
        active: true,
      };

      this.subscriptions.set(subscriptionId, subscription);

      this.loggingService.info('Weather alert subscription created', {
        subscriptionId,
        userId,
      });

      return subscription;
    } catch (error) {
      this.loggingService.error('Error creating weather alert subscription', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete a weather alert subscription
   */
  async deleteSubscription(subscriptionId, userId) {
    try {
      this.loggingService.info('Deleting weather alert subscription', {
        subscriptionId,
        userId,
      });

      const subscription = this.subscriptions.get(subscriptionId);

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      if (subscription.userId !== userId) {
        throw new Error('Unauthorized: subscription does not belong to user');
      }

      this.subscriptions.delete(subscriptionId);

      this.loggingService.info('Weather alert subscription deleted', {
        subscriptionId,
      });
    } catch (error) {
      this.loggingService.error('Error deleting weather alert subscription', {
        error: error.message,
        subscriptionId,
      });
      throw error;
    }
  }

  /**
   * Get user's subscriptions
   */
  async getUserSubscriptions(userId) {
    try {
      this.loggingService.info('Fetching user subscriptions', {
        userId,
      });

      const userSubscriptions = Array.from(this.subscriptions.values()).filter(
        (sub) => sub.userId === userId
      );

      return userSubscriptions;
    } catch (error) {
      this.loggingService.error('Error fetching user subscriptions', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }

  /**
   * Get alerts for a location
   */
  async getAlerts(location, severity) {
    try {
      this.loggingService.info('Fetching weather alerts', {
        location,
        severity,
      });

      let alerts = Array.from(this.alerts.values());

      if (location) {
        alerts = alerts.filter((alert) => alert.location === location);
      }

      if (severity) {
        alerts = alerts.filter((alert) => alert.severity === severity);
      }

      // Filter out expired alerts
      const now = new Date();
      alerts = alerts.filter((alert) => new Date(alert.endTime) > now);

      return alerts;
    } catch (error) {
      this.loggingService.error('Error fetching weather alerts', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Create a weather alert
   */
  async createAlert(data) {
    try {
      const { type, severity, description, location, startTime, endTime, affectedDevices } = data;

      this.loggingService.info('Creating weather alert', {
        type,
        severity,
        location,
      });

      const alertId = `alert_${++this.alertCounter}`;
      const alert = {
        id: alertId,
        type,
        severity,
        description,
        location,
        startTime: startTime || new Date().toISOString(),
        endTime: endTime || new Date(Date.now() + 3600000).toISOString(),
        affectedDevices: affectedDevices || [],
        createdAt: new Date().toISOString(),
      };

      this.alerts.set(alertId, alert);

      this.loggingService.info('Weather alert created', {
        alertId,
        type,
        severity,
      });

      return alert;
    } catch (error) {
      this.loggingService.error('Error creating weather alert', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId, userId) {
    try {
      this.loggingService.info('Acknowledging weather alert', {
        alertId,
        userId,
      });

      const alert = this.alerts.get(alertId);

      if (!alert) {
        throw new Error('Alert not found');
      }

      const acknowledgmentId = `ack_${alertId}_${userId}`;
      const acknowledgment = {
        id: acknowledgmentId,
        alertId,
        userId,
        acknowledgedAt: new Date().toISOString(),
      };

      this.acknowledgments.set(acknowledgmentId, acknowledgment);

      this.loggingService.info('Weather alert acknowledged', {
        alertId,
        userId,
      });

      return acknowledgment;
    } catch (error) {
      this.loggingService.error('Error acknowledging weather alert', {
        error: error.message,
        alertId,
      });
      throw error;
    }
  }

  /**
   * Get alert statistics
   */
  async getAlertStats(location) {
    try {
      this.loggingService.info('Calculating alert statistics', {
        location,
      });

      let alerts = Array.from(this.alerts.values());

      if (location) {
        alerts = alerts.filter((alert) => alert.location === location);
      }

      const stats = {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === 'critical').length,
        high: alerts.filter((a) => a.severity === 'high').length,
        moderate: alerts.filter((a) => a.severity === 'moderate').length,
        low: alerts.filter((a) => a.severity === 'low').length,
        byType: {},
      };

      // Count by type
      alerts.forEach((alert) => {
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      this.loggingService.error('Error calculating alert statistics', {
        error: error.message,
        location,
      });
      throw error;
    }
  }

  /**
   * Broadcast alert to subscribed users
   */
  async broadcastAlert(alert) {
    try {
      this.loggingService.info('Broadcasting weather alert', {
        alertId: alert.id,
        location: alert.location,
      });

      // Find subscriptions for this location
      const relevantSubscriptions = Array.from(this.subscriptions.values()).filter(
        (sub) => sub.location === alert.location && sub.active
      );

      this.loggingService.info('Alert broadcast to subscriptions', {
        alertId: alert.id,
        subscriptionCount: relevantSubscriptions.length,
      });

      return relevantSubscriptions;
    } catch (error) {
      this.loggingService.error('Error broadcasting weather alert', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Clear expired alerts
   */
  async clearExpiredAlerts() {
    try {
      const now = new Date();
      let expiredCount = 0;

      for (const [alertId, alert] of this.alerts.entries()) {
        if (new Date(alert.endTime) < now) {
          this.alerts.delete(alertId);
          expiredCount++;
        }
      }

      this.loggingService.info('Expired alerts cleared', {
        count: expiredCount,
      });

      return expiredCount;
    } catch (error) {
      this.loggingService.error('Error clearing expired alerts', {
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = WeatherAlertService;
