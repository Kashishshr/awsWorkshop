import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacheService],
    });
    service = TestBed.inject(CacheService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cache operations', () => {
    it('should set and get value', () => {
      const key = 'test-key';
      const value = { data: 'test' };

      service.set(key, value);
      const result = service.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const result = service.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should remove value from cache', () => {
      const key = 'test-key';
      service.set(key, { data: 'test' });
      service.remove(key);

      expect(service.get(key)).toBeNull();
    });

    it('should clear all cache', () => {
      service.set('key1', { data: 'test1' });
      service.set('key2', { data: 'test2' });
      service.clear();

      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
    });

    it('should check if key exists', () => {
      const key = 'test-key';
      service.set(key, { data: 'test' });

      expect(service.has(key)).toBe(true);
      expect(service.has('non-existent')).toBe(false);
    });
  });

  describe('TTL support', () => {
    it('should respect TTL expiration', (done) => {
      const key = 'test-key';
      service.set(key, { data: 'test' }, 100); // 100ms TTL

      expect(service.get(key)).not.toBeNull();

      setTimeout(() => {
        expect(service.get(key)).toBeNull();
        done();
      }, 150);
    });

    it('should use default TTL', () => {
      const key = 'test-key';
      service.set(key, { data: 'test' });

      expect(service.get(key)).not.toBeNull();
    });
  });

  describe('cache inspection', () => {
    it('should get cache size', () => {
      service.set('key1', { data: 'test1' });
      service.set('key2', { data: 'test2' });

      expect(service.getSize()).toBe(2);
    });

    it('should get all cache keys', () => {
      service.set('key1', { data: 'test1' });
      service.set('key2', { data: 'test2' });

      const keys = service.getKeys();
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('type safety', () => {
    it('should handle different data types', () => {
      service.set('string', 'test');
      service.set('number', 42);
      service.set('object', { key: 'value' });
      service.set('array', [1, 2, 3]);

      expect(service.get('string')).toBe('test');
      expect(service.get('number')).toBe(42);
      expect(service.get('object')).toEqual({ key: 'value' });
      expect(service.get('array')).toEqual([1, 2, 3]);
    });
  });
});
