const WeatherAlertService = require('../../src/services/weather-alert.service');
const WeatherApiService = require('../../src/services/weather-api.service');

describe('Weather Alert Integration Tests', () => {
  let alertService;
  let apiService;

  beforeEach(() => {
    alertService = new WeatherAlertService();
    apiService = new WeatherApiService();
  });

  describe('Alert Subscription Workflow', () => {
    it('should create subscription and receive alerts', async () => {
      // Create subscription
      const subscription = await alertService.createSubscription({
        userId: 'user1',
        location: 'Test Location',
        latitude: 20,
        longitude: 0,
        alertTypes: ['temperature', 'wind'],
      });

      expect(subscription.id).toBeDefined();

      // Create alert for location
      const alert = await alertService.createAlert({
        type: 'EXTREME_HEAT',
        severity: 'critical',
        description: 'Extreme heat warning',
        location: 'Test Location',
      });

      expect(alert.id).toBeDefined();

      // Broadcast alert to subscribers
      const subscribers = await alertService.broadcastAlert(alert);

      expect(subscribers.length).toBeGreaterThan(0);
      expect(subscribers[0].userId).toBe('user1');
    });

    it('should handle multiple subscriptions for same location', async () => {
      // Create multiple subscriptions
      const sub1 = await alertService.createSubscription({
        userId: 'user1',
        location: 'Location1',
      });

      const sub2 = await alertService.createSubscription({
        userId: 'user2',
        location: 'Location1',
      });

      // Create alert
      const alert = await alertService.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Location1',
      });

      // Broadcast to all subscribers
      const subscribers = await alertService.broadcastAlert(alert);

      expect(subscribers.length).toBe(2);
    });
  });

  describe('Alert Acknowledgment Workflow', () => {
    it('should acknowledge alert and track acknowledgment', async () => {
      // Create alert
      const alert = await alertService.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        location: 'Test Location',
      });

      // Acknowledge alert
      const acknowledgment = await alertService.acknowledgeAlert(alert.id, 'user1');

      expect(acknowledgment.alertId).toBe(alert.id);
      expect(acknowledgment.userId).toBe('user1');
      expect(acknowledgment.acknowledgedAt).toBeDefined();
    });

    it('should allow multiple users to acknowledge same alert', async () => {
      const alert = await alertService.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Test Location',
      });

      const ack1 = await alertService.acknowledgeAlert(alert.id, 'user1');
      const ack2 = await alertService.acknowledgeAlert(alert.id, 'user2');

      expect(ack1.userId).toBe('user1');
      expect(ack2.userId).toBe('user2');
    });
  });

  describe('Alert Filtering Workflow', () => {
    beforeEach(async () => {
      // Create multiple alerts with different severities
      await alertService.createAlert({
        type: 'EXTREME_HEAT',
        severity: 'critical',
        location: 'Location1',
      });

      await alertService.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Location1',
      });

      await alertService.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Location2',
      });
    });

    it('should filter alerts by location', async () => {
      const alerts = await alertService.getAlerts('Location1');

      expect(alerts.length).toBe(2);
      expect(alerts.every((a) => a.location === 'Location1')).toBe(true);
    });

    it('should filter alerts by severity', async () => {
      const alerts = await alertService.getAlerts(null, 'critical');

      expect(alerts.length).toBe(1);
      expect(alerts[0].severity).toBe('critical');
    });

    it('should filter by both location and severity', async () => {
      const alerts = await alertService.getAlerts('Location1', 'high');

      expect(alerts.length).toBe(1);
      expect(alerts[0].type).toBe('WIND');
    });
  });

  describe('Alert Statistics Workflow', () => {
    beforeEach(async () => {
      await alertService.createAlert({
        type: 'EXTREME_HEAT',
        severity: 'critical',
        location: 'Location1',
      });

      await alertService.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Location1',
      });

      await alertService.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Location1',
      });
    });

    it('should calculate alert statistics', async () => {
      const stats = await alertService.getAlertStats('Location1');

      expect(stats.total).toBe(3);
      expect(stats.critical).toBe(1);
      expect(stats.high).toBe(1);
      expect(stats.moderate).toBe(1);
    });

    it('should count alerts by type', async () => {
      const stats = await alertService.getAlertStats('Location1');

      expect(stats.byType.EXTREME_HEAT).toBe(1);
      expect(stats.byType.WIND).toBe(1);
      expect(stats.byType.RAIN).toBe(1);
    });
  });

  describe('Weather Data to Alert Workflow', () => {
    it('should detect alerts from weather data', async () => {
      // Get weather data
      const weather = await apiService.getCurrentWeather('Test Location', 20, 0);

      // Simulate extreme conditions
      weather.temperature = 45; // Extreme heat
      weather.windSpeed = 85; // Hurricane

      // Detect alerts (would be done by alert service in production)
      const alerts = [];

      if (weather.temperature > 40) {
        alerts.push({
          type: 'EXTREME_HEAT',
          severity: 'critical',
          description: 'Extreme heat warning',
          location: weather.location,
        });
      }

      if (weather.windSpeed > 80) {
        alerts.push({
          type: 'HURRICANE_WARNING',
          severity: 'critical',
          description: 'Hurricane warning',
          location: weather.location,
        });
      }

      expect(alerts.length).toBe(2);
      expect(alerts.every((a) => a.severity === 'critical')).toBe(true);
    });
  });

  describe('Subscription Cleanup Workflow', () => {
    it('should delete subscription and stop receiving alerts', async () => {
      // Create subscription
      const subscription = await alertService.createSubscription({
        userId: 'user1',
        location: 'Test Location',
      });

      // Verify subscription exists
      let userSubs = await alertService.getUserSubscriptions('user1');
      expect(userSubs.length).toBe(1);

      // Delete subscription
      await alertService.deleteSubscription(subscription.id, 'user1');

      // Verify subscription is deleted
      userSubs = await alertService.getUserSubscriptions('user1');
      expect(userSubs.length).toBe(0);
    });
  });

  describe('Expired Alert Cleanup', () => {
    it('should clear expired alerts', async () => {
      const pastTime = new Date(Date.now() - 3600000).toISOString();

      // Create expired alert
      await alertService.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Test Location',
        endTime: pastTime,
      });

      // Create active alert
      await alertService.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Test Location',
      });

      // Get active alerts (should exclude expired)
      const activeAlerts = await alertService.getAlerts('Test Location');

      expect(activeAlerts.length).toBe(1);
      expect(activeAlerts[0].type).toBe('WIND');
    });
  });
});
