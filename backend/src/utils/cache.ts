// src/utils/cache.ts
export class MemoryCache {
    private cache: Map<string, { data: any; expiry: number }> = new Map();

    set(key: string, value: any, ttlSeconds: number = 300): void {
        const expiry = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { data: value, expiry });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

// Global cache instance
export const cache = new MemoryCache(); 