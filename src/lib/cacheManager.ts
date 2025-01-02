export type CacheItemType = 
  | 'image' 
  | 'story' 
  | 'background_music' 
  | 'sound_effect' 
  | 'ai_animation' 
  | 'ai_story';

interface CacheItem {
  data: any;
  timestamp: number;
  type: CacheItemType;
  size: number; // Size in bytes
}

interface CacheLimits {
  maxItems: number;
  maxSize: number; // in bytes
  maxAge: number; // in milliseconds
}

const DEFAULT_CACHE_LIMITS: Record<CacheItemType, CacheLimits> = {
  image: {
    maxItems: 20,
    maxSize: 50 * 1024 * 1024, // 50MB for images
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  background_music: {
    maxItems: 5,
    maxSize: 50 * 1024 * 1024, // 50MB for background music
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (music doesn't change often)
  },
  sound_effect: {
    maxItems: 30,
    maxSize: 20 * 1024 * 1024, // 20MB for sound effects
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  ai_story: {
    maxItems: 50,
    maxSize: 10 * 1024 * 1024, // 10MB for AI-generated story content
    maxAge: 60 * 60 * 1000, // 1 hour
  },
  ai_animation: {
    maxItems: 15,
    maxSize: 75 * 1024 * 1024, // 75MB for AI-generated animations
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  story: {
    maxItems: 20,
    maxSize: 5 * 1024 * 1024, // 5MB for regular story content
    maxAge: 12 * 60 * 60 * 1000, // 12 hours
  }
};

class ContentCache {
  private caches: Map<CacheItemType, Map<string, CacheItem>>;
  private currentSizes: Map<CacheItemType, number>;

  constructor() {
    this.caches = new Map();
    this.currentSizes = new Map();
    
    // Initialize caches for each type
    Object.keys(DEFAULT_CACHE_LIMITS).forEach((type) => {
      this.caches.set(type as CacheItemType, new Map());
      this.currentSizes.set(type as CacheItemType, 0);
    });

    // Start periodic cleanup
    this.startCleanupInterval();
  }

  private startCleanupInterval() {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Run cleanup every 5 minutes
  }

  private cleanup() {
    const now = Date.now();
    
    this.caches.forEach((cache, type) => {
      const limits = DEFAULT_CACHE_LIMITS[type];
      
      // Remove expired items
      cache.forEach((item, key) => {
        if (now - item.timestamp > limits.maxAge) {
          this.remove(type, key);
        }
      });

      // If still over limits, remove oldest items
      while (this.currentSizes.get(type)! > limits.maxSize || cache.size > limits.maxItems) {
        const oldestKey = this.getOldestKey(cache);
        if (oldestKey) {
          this.remove(type, oldestKey);
        } else {
          break;
        }
      }
    });
  }

  private getOldestKey(cache: Map<string, CacheItem>): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    cache.forEach((item, key) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  private remove(type: CacheItemType, key: string) {
    const cache = this.caches.get(type);
    const item = cache?.get(key);
    
    if (cache && item) {
      cache.delete(key);
      this.currentSizes.set(type, (this.currentSizes.get(type) || 0) - item.size);
    }
  }

  set(type: CacheItemType, key: string, data: any, size: number) {
    const cache = this.caches.get(type);
    if (!cache) return false;

    const limits = DEFAULT_CACHE_LIMITS[type];

    // If item is too large, don't cache it
    if (size > limits.maxSize) {
      console.warn(`Item ${key} is too large to cache (${size} bytes)`);
      return false;
    }

    // Remove old version if it exists
    this.remove(type, key);

    // Check if we need to make space
    while (
      (this.currentSizes.get(type) || 0) + size > limits.maxSize ||
      cache.size >= limits.maxItems
    ) {
      const oldestKey = this.getOldestKey(cache);
      if (oldestKey) {
        this.remove(type, oldestKey);
      } else {
        break;
      }
    }

    // Add new item
    cache.set(key, {
      data,
      timestamp: Date.now(),
      type,
      size,
    });
    this.currentSizes.set(type, (this.currentSizes.get(type) || 0) + size);

    return true;
  }

  get(type: CacheItemType, key: string): any | null {
    const cache = this.caches.get(type);
    const item = cache?.get(key);

    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > DEFAULT_CACHE_LIMITS[type].maxAge) {
      this.remove(type, key);
      return null;
    }

    // Update timestamp on access
    item.timestamp = Date.now();
    return item.data;
  }

  clear(type?: CacheItemType) {
    if (type) {
      this.caches.get(type)?.clear();
      this.currentSizes.set(type, 0);
    } else {
      this.caches.forEach((cache, type) => {
        cache.clear();
        this.currentSizes.set(type, 0);
      });
    }
  }

  getStats() {
    const stats: Record<CacheItemType, { items: number; size: number }> = {} as any;
    
    this.caches.forEach((cache, type) => {
      stats[type] = {
        items: cache.size,
        size: this.currentSizes.get(type) || 0,
      };
    });

    return stats;
  }
}

export const contentCache = new ContentCache(); 