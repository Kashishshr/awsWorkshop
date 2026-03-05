import { Injectable } from '@angular/core';
import { CurrentWeather, WeatherForecast } from '../models/weather-alert.model';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {}

  /**
   * Get cached weather data
   */
  getWeather(key: string): CurrentWeather | null {
    return this.get<CurrentWeather>(key);
  }

  /**
   * Set cached weather data
   */
  setWeather(key: string, data: CurrentWeather, ttl?: number): void {
    this.set(key, data, ttl);
  }

  /**
   * Get cached forecast data
   */
  getForecast(key: string): WeatherForecast | null {
    return this.get<WeatherForecast>(key);
  }

  /**
   * Set cached forecast data
   */
  setForecast(key: string, data: WeatherForecast, ttl?: number): void {
    this.set(key, data, ttl);
  }

  /**
   * Generic get method
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache has expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Generic set method
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if cache entry has expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return now - entry.timestamp > entry.ttl;
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
    });
  }

  /**
   * Set custom TTL for a key
   */
  setTTL(key: string, ttl: number): void {
    const entry = this.cache.get(key);
    if (entry) {
      entry.ttl = ttl;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  getRemainingTTL(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const elapsed = Date.now() - entry.timestamp;
    const remaining = entry.ttl - elapsed;

    return remaining > 0 ? remaining : 0;
  }
}
