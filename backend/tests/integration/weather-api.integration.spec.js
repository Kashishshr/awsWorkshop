const request = require('supertest');
const app = require('../../src/app');

describe('Weather API Integration Tests', () => {
  let authToken;
  let userId = 'test-user-123';

  beforeAll(async () => {
    // Mock authentication token
    authToken = 'Bearer mock-jwt-token';
  });

  describe('GET /api/weather/current', () => {
    it('should return current weather data', async () => {
      const response = await request(app)
        .get('/api/weather/current')
        .query({ location: 'Test Location', latitude: 20, longitude: 0 })
        .set('Authorization', authToken)
        .set('X-Correlation-ID', 'test-123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.temperature).toBeDefined();
      expect(response.body.data.condition).toBeDefined();
      expect(response.body.data.location).toBe('Test Location');
    });

    it('should return cached data on second request', async () => {
      const response1 = await request(app)
        .get('/api/weather/current')
        .query({ location: 'Test Location', latitude: 20, longitude: 0 })
        .set('Authorization', authToken);

      const response2 = await request(app)
        .get('/api/weather/current')
        .query({ location: 'Test Location', latitude: 20, longitude: 0 })
        .set('Authorization', authToken);

      expect(response1.body.data).toEqual(response2.body.data);
      expect(response2.body.source).toBe('cache');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/weather/current')
        .query({ location: 'Test Location' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/weather/forecast', () => {
    it('should return weather forecast', async () => {
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ location: 'Test Location', latitude: 20, longitude: 0, days: 7 })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.forecast).toBeDefined();
      expect(Array.isArray(response.body.data.forecast)).toBe(true);
      expect(response.body.data.forecast.length).toBeGreaterThan(0);
    });

    it('should limit forecast days to 16', async () => {
      const response = await request(app)
        .get('/api/weather/forecast')
        .query({ location: 'Test Location', latitude: 20, longitude: 0, days: 30 })
        .set('Authorization', authToken);

      expect(response.body.data.forecast.length).toBeLessThanOrEqual(16);
    });
  });

  describe('GET /api/weather/alerts', () => {
    it('should return weather alerts', async () => {
      const response = await request(app)
        .get('/api/weather/alerts')
        .query({ location: 'Test Location' })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter alerts by severity', async () => {
      const response = await request(app)
        .get('/api/weather/alerts')
        .query({ location: 'Test Location', severity: 'critical' })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.data.every((a) => a.severity === 'critical')).toBe(true);
    });
  });

  describe('POST /api/weather/subscribe', () => {
    it('should create a weather alert subscription', async () => {
      const response = await request(app)
        .post('/api/weather/subscribe')
        .set('Authorization', authToken)
        .send({
          location: 'Test Location',
          latitude: 20,
          longitude: 0,
          alertTypes: ['temperature', 'wind'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.location).toBe('Test Location');
    });

    it('should require location', async () => {
      const response = await request(app)
        .post('/api/weather/subscribe')
        .set('Authorization', authToken)
        .send({
          latitude: 20,
          longitude: 0,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/weather/subscriptions', () => {
    it('should return user subscriptions', async () => {
      const response = await request(app)
        .get('/api/weather/subscriptions')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/weather/alerts/:alertId/acknowledge', () => {
    it('should acknowledge an alert', async () => {
      const response = await request(app)
        .post('/api/weather/alerts/alert-123/acknowledge')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/weather/history', () => {
    it('should return weather history', async () => {
      const response = await request(app)
        .get('/api/weather/history')
        .query({ location: 'Test Location', days: 30 })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(30);
    });
  });

  describe('GET /api/weather/stats', () => {
    it('should return weather statistics', async () => {
      const response = await request(app)
        .get('/api/weather/stats')
        .query({ location: 'Test Location', period: 'week' })
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.temperature).toBeDefined();
      expect(response.body.data.humidity).toBeDefined();
      expect(response.body.data.windSpeed).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid location gracefully', async () => {
      const response = await request(app)
        .get('/api/weather/current')
        .query({ latitude: 'invalid', longitude: 0 })
        .set('Authorization', authToken);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should include correlation ID in response', async () => {
      const correlationId = 'test-correlation-123';
      const response = await request(app)
        .get('/api/weather/current')
        .query({ location: 'Test Location' })
        .set('Authorization', authToken)
        .set('X-Correlation-ID', correlationId);

      expect(response.body.correlationId || response.headers['x-correlation-id']).toBeDefined();
    });
  });
});
