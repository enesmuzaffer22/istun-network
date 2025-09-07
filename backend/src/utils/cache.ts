// src/utils/cache.ts
export class MemoryCache {
    private cache: Map<string, { data: any; expiry: number }> = new Map();

    set(key: string, value: any, ttlSeconds: number = 300): void {
        const expiry = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { data: value, expiry });
    }

    get<T = any>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    getAllKeys(): string[] {
        return Array.from(this.cache.keys());
    }

}

// Global cache instance
export const cache = new MemoryCache(); 