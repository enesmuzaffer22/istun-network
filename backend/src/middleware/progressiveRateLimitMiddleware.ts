import { Request, Response, NextFunction } from 'express';
import { progressiveRateLimit } from '../utils/progressiveRateLimit';

// Public API endpoint'leri (kimlik doğrulama gerektirmeyen)
const PUBLIC_ENDPOINTS = [
    '/api/news',
    '/api/jobs',
    '/api/events',
    '/api/announcements',
    '/api/roadmaps',
    '/api/bridgeprojects',
    '/api/achievements',
    '/api/socialimpactscores',
    '/api/bridgeprojects/impact'
];

/**
 * Progressive rate limiting middleware
 * Sadece public API'ler için uygulanır
 */
export const progressiveRateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Sadece public endpoint'ler için uygula
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint =>
        req.path.startsWith(endpoint)
    );

    if (!isPublicEndpoint) {
        return next();
    }

    // IP adresini al (proxy arkasında çalışıyorsa)
    const clientIP = req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection as any)?.socket?.remoteAddress ||
        req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        '127.0.0.1'; // Fallback olarak localhost

    // Rate limit kontrolü
    const result = progressiveRateLimit.checkRateLimit(clientIP);

    if (!result.allowed) {
        // Rate limit aşıldı veya ban durumunda
        res.status(429).json({
            success: false,
            message: result.message,
            error: 'RATE_LIMIT_EXCEEDED',
            banInfo: result.banInfo ? {
                level: result.banInfo.level,
                totalViolations: result.banInfo.totalViolations,
                firstViolation: new Date(result.banInfo.firstViolation).toISOString(),
                lastViolation: new Date(result.banInfo.lastViolation).toISOString(),
                banUntil: new Date(result.banInfo.banUntil).toISOString(),
                remainingTime: result.banInfo ? Math.ceil((result.banInfo.banUntil - Date.now()) / 1000) : undefined
            } : undefined,
            retryAfter: result.banInfo ? Math.ceil((result.banInfo.banUntil - Date.now()) / 1000) : Math.ceil((result.resetTime - Date.now()) / 1000)
        });
        return;
    }

    // Rate limit headers ekle
    res.set({
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    });

    next();
};

/**
 * Admin için ban yönetimi middleware'i
 */
export const banManagementMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Bu middleware sadece admin endpoint'lerinde kullanılmalı
    if (!req.path.startsWith('/api/admin/')) {
        return next();
    }

    // Admin yetkisi kontrolü burada yapılabilir
    // Şimdilik geçiyoruz
    next();
};
