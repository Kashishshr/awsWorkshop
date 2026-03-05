const WeatherAlertService = require('./weather-alert.service');

describe('WeatherAlertService', () => {
  let service;

  beforeEach(() => {
    service = new WeatherAlertService();
  });

  describe('createSubscription', () => {
    it('should create a weather alert subscription', async () => {
      const subscription = await service.createSubscription({
        userId: 'user1',
        location: 'Test Location',
        latitude: 20,
        longitude: 0,
        alertTypes: ['temperature', 'wind'],
      });

      expect(subscription).toBeDefined();
      expect(subscription.id).toBeDefined();
      expect(subscription.userId).toBe('user1');
      expect(subscription.location).toBe('Test Location');
      expect(subscription.active).toBe(true);
    });

    it('should generate unique subscription IDs', async () => {
      const sub1 = await service.createSubscription({
        userId: 'user1',
        location: 'Location1',
      });

      const sub2 = await service.createSubscription({
        userId: 'user2',
        location: 'Location2',
      });

      expect(sub1.id).not.toBe(sub2.id);
    });
  });

  describe('deleteSubscription', () => {
    it('should delete a subscription', async () => {
      const subscription = await service.createSubscription({
        userId: 'user1',
        location: 'Test Location',
      });

      await service.deleteSubscription(subscription.id, 'user1');

      const userSubs = await service.getUserSubscriptions('user1');
      expect(userSubs.length).toBe(0);
    });

    it('should throw error if subscription not found', async () => {
      await expect(service.deleteSubscription('invalid_id', 'user1')).rejects.toThrow(
        'Subscription not found'
      );
    });

    it('should throw error if user is not owner', async () => {
      const subscription = await service.createSubscription({
        userId: 'user1',
        location: 'Test Location',
      });

      await expect(service.deleteSubscription(subscription.id, 'user2')).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('getUserSubscriptions', () => {
    it('should get user subscriptions', async () => {
      await service.createSubscription({
        userId: 'user1',
        location: 'Location1',
      });

      await service.createSubscription({
        userId: 'user1',
        location: 'Location2',
      });

      const subscriptions = await service.getUserSubscriptions('user1');

      expect(subscriptions.length).toBe(2);
      expect(subscriptions.every((s) => s.userId === 'user1')).toBe(true);
    });

    it('should return empty array for user with no subscriptions', async () => {
      const subscriptions = await service.getUserSubscriptions('user_no_subs');

      expect(subscriptions).toEqual([]);
    });
  });

  describe('createAlert', () => {
    it('should create a weather alert', async () => {
      const alert = await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        description: 'Severe thunderstorm warning',
        location: 'Test Location',
      });

      expect(alert).toBeDefined();
      expect(alert.id).toBeDefined();
      expect(alert.type).toBe('THUNDERSTORM');
      expect(alert.severity).toBe('high');
      expect(alert.location).toBe('Test Location');
    });

    it('should generate unique alert IDs', async () => {
      const alert1 = await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        location: 'Location1',
      });

      const alert2 = await service.createAlert({
        type: 'WIND',
        severity: 'moderate',
        location: 'Location2',
      });

      expect(alert1.id).not.toBe(alert2.id);
    });
  });

  describe('getAlerts', () => {
    beforeEach(async () => {
      await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'critical',
        location: 'Location1',
      });

      await service.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Location1',
      });

      await service.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Location2',
      });
    });

    it('should get all alerts', async () => {
      const alerts = await service.getAlerts();

      expect(alerts.length).toBe(3);
    });

    it('should filter alerts by location', async () => {
      const alerts = await service.getAlerts('Location1');

      expect(alerts.length).toBe(2);
      expect(alerts.every((a) => a.location === 'Location1')).toBe(true);
    });

    it('should filter alerts by severity', async () => {
      const alerts = await service.getAlerts(null, 'high');

      expect(alerts.length).toBe(1);
      expect(alerts[0].severity).toBe('high');
    });

    it('should filter by both location and severity', async () => {
      const alerts = await service.getAlerts('Location1', 'critical');

      expect(alerts.length).toBe(1);
      expect(alerts[0].type).toBe('THUNDERSTORM');
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge an alert', async () => {
      const alert = await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        location: 'Test Location',
      });

      const acknowledgment = await service.acknowledgeAlert(alert.id, 'user1');

      expect(acknowledgment).toBeDefined();
      expect(acknowledgment.alertId).toBe(alert.id);
      expect(acknowledgment.userId).toBe('user1');
      expect(acknowledgment.acknowledgedAt).toBeDefined();
    });

    it('should throw error if alert not found', async () => {
      await expect(service.acknowledgeAlert('invalid_id', 'user1')).rejects.toThrow(
        'Alert not found'
      );
    });
  });

  describe('getAlertStats', () => {
    beforeEach(async () => {
      await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'critical',
        location: 'Location1',
      });

      await service.createAlert({
        type: 'WIND',
        severity: 'high',
        location: 'Location1',
      });

      await service.createAlert({
        type: 'RAIN',
        severity: 'moderate',
        location: 'Location1',
      });
    });

    it('should calculate alert statistics', async () => {
      const stats = await service.getAlertStats('Location1');

      expect(stats.total).toBe(3);
      expect(stats.critical).toBe(1);
      expect(stats.high).toBe(1);
      expect(stats.moderate).toBe(1);
    });

    it('should count alerts by type', async () => {
      const stats = await service.getAlertStats('Location1');

      expect(stats.byType.THUNDERSTORM).toBe(1);
      expect(stats.byType.WIND).toBe(1);
      expect(stats.byType.RAIN).toBe(1);
    });
  });

  describe('broadcastAlert', () => {
    it('should find subscriptions for alert location', async () => {
      await service.createSubscription({
        userId: 'user1',
        location: 'Location1',
      });

      await service.createSubscription({
        userId: 'user2',
        location: 'Location1',
      });

      const alert = await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        location: 'Location1',
      });

      const subscriptions = await service.broadcastAlert(alert);

      expect(subscriptions.length).toBe(2);
    });
  });

  describe('clearExpiredAlerts', () => {
    it('should clear expired alerts', async () => {
      const pastTime = new Date(Date.now() - 3600000).toISOString();

      await service.createAlert({
        type: 'THUNDERSTORM',
        severity: 'high',
        location: 'Location1',
        endTime: pastTime,
      });

      const cleared = await service.clearExpiredAlerts();

      expect(cleared).toBe(1);
    });
  });
});
