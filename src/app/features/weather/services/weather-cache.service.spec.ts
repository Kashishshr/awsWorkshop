import { TestBed } from '@angular/core/testing';
import { WeatherCacheService } from './weather-cache.service';
import { CurrentWeather } from '../models/weather-alert.model';

describe('WeatherCacheService', () => {
  let service: WeatherCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get weather data', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('test-key', mockWeather);
    const cached = service.getWeather('test-key');

    expect(cached).toEqual(mockWeather);
  });

  it('should return null for non-existent key', () => {
    const cached = service.getWeather('non-existent');
    expect(cached).toBeNull();
  });

  it('should expire cache after TTL', (done) => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('test-key', mockWeather, 100); // 100ms TTL

    setTimeout(() => {
      const cached = service.getWeather('test-key');
      expect(cached).toBeNull();
      done();
    }, 150);
  });

  it('should invalidate specific cache entry', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('test-key', mockWeather);
    service.invalidate('test-key');

    const cached = service.getWeather('test-key');
    expect(cached).toBeNull();
  });

  it('should clear all cache entries', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('key1', mockWeather);
    service.setWeather('key2', mockWeather);

    service.clear();

    expect(service.getSize()).toBe(0);
  });

  it('should get cache size', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('key1', mockWeather);
    service.setWeather('key2', mockWeather);

    expect(service.getSize()).toBe(2);
  });

  it('should get all cache keys', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('key1', mockWeather);
    service.setWeather('key2', mockWeather);

    const keys = service.getKeys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
  });

  it('should cleanup expired entries', (done) => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('key1', mockWeather, 100);
    service.setWeather('key2', mockWeather);

    setTimeout(() => {
      service.cleanup();
      expect(service.getSize()).toBe(1);
      done();
    }, 150);
  });

  it('should set and get custom TTL', () => {
    const mockWeather: CurrentWeather = {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
      pressure: 1013,
      location: 'Test Location',
      timestamp: new Date().toISOString(),
    };

    service.setWeather('test-key', mockWeather);
    service.setTTL('test-key', 10000);

    const remaining = service.getRemainingTTL('test-key');
    expect(remaining).toBeLessThanOrEqual(10000);
    expect(remaining).toBeGreaterThan(0);
  });

  it('should return null for remaining TTL of non-existent key', () => {
    const remaining = service.getRemainingTTL('non-existent');
    expect(remaining).toBeNull();
  });

  it('should use generic get/set methods', () => {
    const testData = { test: 'data' };
    service.set('generic-key', testData);

    const cached = service.get('generic-key');
    expect(cached).toEqual(testData);
  });
});
