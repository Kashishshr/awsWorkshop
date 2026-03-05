import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private dbName = 'power-grid-cache';
  private storeName = 'cache';
  private db: IDBDatabase | null = null;
  private cacheEnabled = environment.cacheEnabled;
  private defaultTTL = environment.cacheTTL;

  constructor() {
    this.initializeIndexedDB();
  }

  /**
   * Initialize IndexedDB
   */
  private initializeIndexedDB(): void {
    if (!this.cacheEnabled || !('indexedDB' in window)) {
      return;
    }

    const request = indexedDB.open(this.dbName, 1);

    request.onerror = () => {
      console.error('IndexedDB initialization failed');
    };

    request.onsuccess = () => {
      this.db = request.result;
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'key' });
      }
    };
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      return memoryEntry.value;
    }

    // Remove expired entry
    if (memoryEntry) {
      this.memoryCache.delete(key);
    }

    return null;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    if (!this.cacheEnabled) {
      return;
    }

    const expiresAt = Date.now() + ttl;
    const entry: CacheEntry<T> = { value, expiresAt };

    // Store in memory cache
    this.memoryCache.set(key, entry);

    // Store in IndexedDB
    if (this.db) {
      this.setInIndexedDB(key, entry);
    }
  }

  /**
   * Remove value from cache
   */
  remove(key: string): void {
    this.memoryCache.delete(key);

    if (this.db) {
      this.removeFromIndexedDB(key);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();

    if (this.db) {
      this.clearIndexedDB();
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    if (!entry) {
      return false;
    }

    if (entry.expiresAt > Date.now()) {
      return true;
    }

    this.memoryCache.delete(key);
    return false;
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.memoryCache.size;
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.memoryCache.keys());
  }

  /**
   * Set value in IndexedDB
   */
  private setInIndexedDB<T>(key: string, entry: CacheEntry<T>): void {
    if (!this.db) {
      return;
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.put({ key, ...entry });
    } catch (error) {
      console.error('Error setting value in IndexedDB', error);
    }
  }

  /**
   * Remove value from IndexedDB
   */
  private removeFromIndexedDB(key: string): void {
    if (!this.db) {
      return;
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.delete(key);
    } catch (error) {
      console.error('Error removing value from IndexedDB', error);
    }
  }

  /**
   * Clear IndexedDB
   */
  private clearIndexedDB(): void {
    if (!this.db) {
      return;
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.clear();
    } catch (error) {
      console.error('Error clearing IndexedDB', error);
    }
  }
}
