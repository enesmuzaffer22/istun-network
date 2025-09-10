import { MemoryCache } from './cache';

interface BanInfo {
    level: number;
    banUntil: number;
    firstViolation: number;
    lastViolation: number;
    totalViolations: number;
}

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    banLevels: number[]; // Her seviye için ban süresi (milisaniye)
    maxBanLevel: number;
    escalationWindowMs: number; // İhlal sayacının tutulduğu süre (milisaniye)
}

export class ProgressiveRateLimit {
    private cache: MemoryCache;
    private config: RateLimitConfig;
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        this.cache = new MemoryCache();
        this.config = {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 dakika
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '50'), // dakikada 50 istek
            banLevels: [
                0, // 0. seviye: ban yok
                parseInt(process.env.BAN_LEVEL_1 || '60000'), // 1. seviye: 1 dakika ban
                parseInt(process.env.BAN_LEVEL_2 || '300000'), // 2. seviye: 5 dakika ban
                parseInt(process.env.BAN_LEVEL_3 || '900000'), // 3. seviye: 15 dakika ban
                parseInt(process.env.BAN_LEVEL_4 || '3600000'), // 4. seviye: 1 saat ban
                parseInt(process.env.BAN_LEVEL_5 || '14400000'), // 5. seviye: 4 saat ban
                parseInt(process.env.BAN_LEVEL_6 || '86400000'), // 6. seviye: 1 gün ban
            ],
            maxBanLevel: parseInt(process.env.MAX_BAN_LEVEL || '6'),
            escalationWindowMs: parseInt(process.env.BAN_ESCALATION_WINDOW_MS || '604800000'), // 7 gün
        };

        // Her 5 dakikada bir cache temizleme
        const cleanupIntervalMs = parseInt(process.env.CACHE_CLEANUP_INTERVAL || '300000'); // 5 dakika
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredEntries();
        }, cleanupIntervalMs);
    }

    /**
     * Dışarıdan konfigürasyonun bazı alanlarını okumak için yardımcı
     */
    public getConfig(): Pick<RateLimitConfig, 'maxRequests' | 'windowMs'> {
        return { maxRequests: this.config.maxRequests, windowMs: this.config.windowMs };
    }

    /**
     * Süresi dolmuş cache entry'lerini temizler
     */
    private cleanupExpiredEntries(): void {
        const now = Date.now();
        const keys = this.cache.getAllKeys();

        // Memory limit kontrolü
        const maxCacheEntries = parseInt(process.env.MAX_CACHE_ENTRIES || '10000');
        if (keys.length > maxCacheEntries) {
            console.warn(`⚠️ Cache limit aşıldı: ${keys.length} entry. Temizleme yapılıyor...`);
            this.forceCleanup();
            return;
        }

        for (const key of keys) {
            if (key.startsWith('ban:')) {
                const banInfo = this.cache.get<BanInfo>(key);
                if (banInfo && now >= banInfo.banUntil) {
                    this.cache.delete(key);
                }
            } else if (key.startsWith('rate:')) {
                const requests = this.cache.get<number[]>(key);
                if (requests) {
                    const windowStart = now - this.config.windowMs;
                    const validRequests = requests.filter(timestamp => timestamp > windowStart);

                    if (validRequests.length === 0) {
                        this.cache.delete(key);
                    } else {
                        this.cache.set(key, validRequests, this.config.windowMs / 1000);
                    }
                }
            }
        }
    }

    /**
     * Zorla cache temizleme (memory limit aşıldığında)
     */
    private forceCleanup(): void {
        const now = Date.now();
        const keys = this.cache.getAllKeys();

        // En eski entry'leri sil (yarısını sil)
        const entriesToDelete = Math.floor(keys.length / 2);
        let deleted = 0;

        for (const key of keys) {
            if (deleted >= entriesToDelete) break;

            if (key.startsWith('ban:')) {
                const banInfo = this.cache.get<BanInfo>(key);
                if (banInfo && now >= banInfo.banUntil) {
                    this.cache.delete(key);
                    deleted++;
                }
            } else if (key.startsWith('rate:')) {
                this.cache.delete(key);
                deleted++;
            }
        }

        console.log(`🧹 Cache temizlendi: ${deleted} entry silindi`);
    }

    /**
     * Cleanup interval'ını durdurur
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    /**
     * IP'nin ban durumunu kontrol eder
     */
    isBanned(ip: string): { banned: boolean; banInfo?: BanInfo; remainingTime?: number } {
        const banKey = `ban:${ip}`;
        const banInfo = this.cache.get<BanInfo>(banKey);

        if (!banInfo) {
            return { banned: false };
        }

        const now = Date.now();

        // Ban süresi dolmuş mu?
        if (now >= banInfo.banUntil) {
            this.cache.delete(banKey);
            return { banned: false };
        }

        const remainingTime = banInfo.banUntil - now;
        return {
            banned: true,
            banInfo,
            remainingTime: Math.ceil(remainingTime / 1000) // saniye cinsinden
        };
    }

    /**
     * Rate limit kontrolü yapar ve gerekirse ban uygular
     */
    checkRateLimit(ip: string): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
        banInfo?: BanInfo;
        message?: string;
    } {
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Önce ban durumunu kontrol et
        const banCheck = this.isBanned(ip);
        if (banCheck.banned) {
            const remainingMinutes = Math.ceil((banCheck.remainingTime || 0) / 60);
            return {
                allowed: false,
                remaining: 0,
                resetTime: banCheck.banInfo?.banUntil || 0,
                banInfo: banCheck.banInfo,
                message: `IP adresiniz ${remainingMinutes} dakika daha engellenmiştir. Seviye: ${banCheck.banInfo?.level || 0}`
            };
        }

        // Rate limit kontrolü
        const rateKey = `rate:${ip}`;
        const requests = this.cache.get<number[]>(rateKey) || [];

        // Eski istekleri temizle
        const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);

        if (validRequests.length >= this.config.maxRequests) {
            // Rate limit aşıldı, ban seviyesini artır
            return this.handleRateLimitViolation(ip, now);
        }

        // Yeni isteği ekle
        validRequests.push(now);
        this.cache.set(rateKey, validRequests, this.config.windowMs / 1000);

        return {
            allowed: true,
            remaining: this.config.maxRequests - validRequests.length,
            resetTime: now + this.config.windowMs,
        };
    }

    /**
     * Rate limit ihlali durumunda ban seviyesini artırır
     */
    private handleRateLimitViolation(ip: string, now: number): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
        banInfo: BanInfo;
        message: string;
    } {
        const banKey = `ban:${ip}`;
        const violationsKey = `violations:${ip}`;
        const existingViolations = this.cache.get<{ count: number; firstViolation: number; lastViolation: number }>(violationsKey);

        let violationCount = 1;
        let firstViolation = now;
        let lastViolation = now;

        if (existingViolations) {
            violationCount = Math.min(existingViolations.count + 1, this.config.maxBanLevel);
            firstViolation = existingViolations.firstViolation;
            lastViolation = now;
        }

        // Ban seviyesi ihlal sayısına göre belirlenir
        const newLevel = Math.min(violationCount, this.config.maxBanLevel);

        const banDuration = this.config.banLevels[newLevel];
        const banUntil = now + banDuration;

        const banInfo: BanInfo = {
            level: newLevel,
            banUntil,
            firstViolation,
            lastViolation,
            totalViolations: violationCount,
        };

        // Ban bilgisini cache'e kaydet
        this.cache.set(banKey, banInfo, Math.ceil(banDuration / 1000));

        // İhlal sayacını escalation penceresi boyunca canlı tut
        this.cache.set(violationsKey, { count: violationCount, firstViolation, lastViolation }, Math.ceil(this.config.escalationWindowMs / 1000));

        // Rate limit cache'ini temizle
        const rateKey = `rate:${ip}`;
        this.cache.delete(rateKey);

        const banDurationMinutes = Math.ceil(banDuration / (60 * 1000));
        const banDurationHours = Math.ceil(banDuration / (60 * 60 * 1000));
        const banDurationDays = Math.ceil(banDuration / (24 * 60 * 60 * 1000));

        let durationText = '';
        if (banDurationDays > 0) {
            durationText = `${banDurationDays} gün`;
        } else if (banDurationHours > 0) {
            durationText = `${banDurationHours} saat`;
        } else {
            durationText = `${banDurationMinutes} dakika`;
        }

        return {
            allowed: false,
            remaining: 0,
            resetTime: banUntil,
            banInfo,
            message: `Rate limit aşıldı! IP adresiniz ${durationText} süreyle engellenmiştir. (Seviye: ${newLevel}, Toplam ihlal: ${totalViolations})`
        };
    }

}

// Singleton instance
export const progressiveRateLimit = new ProgressiveRateLimit();
