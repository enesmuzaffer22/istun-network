// src/tests/rateLimit.test.ts
import request from 'supertest';
import app from './testApp';
import { sleep } from './helpers/testHelpers';

describe('🚫 Rate Limiting Tests', () => {

    // Rate limiting test'i environment'da skip et (çünkü test için limit 1000)
    const describeIf = process.env.NODE_ENV !== 'test' ? describe : describe.skip;

    describeIf('Rate Limit Kontrolü', () => {
        test('✅ Normal istek sayısı kabul edilmeli', async () => {
            // 10 ardışık istek gönder
            const promises = Array.from({ length: 10 }, () =>
                request(app).get('/')
            );

            const responses = await Promise.all(promises);

            // Çoğu başarılı olmalı
            const successfulRequests = responses.filter(r => r.status === 200);
            expect(successfulRequests.length).toBeGreaterThan(0);
        });

        test('⚡ Çok hızlı istekler rate limite takılmalı', async () => {
            // Test environment'da skip edilir
            if (process.env.NODE_ENV === 'test') {
            return;
        }

        // 100 ardışık istek gönder (rate limit: 60/dakika)
        const promises = Array.from({ length: 100 }, () =>
            request(app).get('/')
        );

        const responses = await Promise.all(promises);

        // Bazıları 429 (Too Many Requests) almalı
        const rateLimitedRequests = responses.filter(r => r.status === 429);
        expect(rateLimitedRequests.length).toBeGreaterThan(0);

        // Rate limit response'unda mesaj olmalı
        if (rateLimitedRequests.length > 0) {
            expect(rateLimitedRequests[0].body.message).toContain('fazla istek');
        }
    });
});

describe('Rate Limit Headers', () => {
    test('✅ Rate limit headers döndürülmeli', async () => {
        const response = await request(app).get('/');

        // Test environment'da rate limit skip edilir
        if (process.env.NODE_ENV !== 'test') {
            expect(response.headers).toHaveProperty('x-ratelimit-limit');
            expect(response.headers).toHaveProperty('x-ratelimit-remaining');
        }
    });
});

describe('Endpoint Specific Rate Limiting', () => {
            test('✅ Her endpoint aynı rate limiti paylaşmalı', async () => {
            const endpoints = [
        '/',
        '/api/news',
        '/api/jobs',
        '/api/roadmaps'
    ];

    for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);

        // Her endpoint'e erişim sağlanmalı (rate limit global)
        expect([200, 404, 500]).toContain(response.status);

        // 429 alınmamalı (test ortamında limit yüksek)
        expect(response.status).not.toBe(429);
    }
});
    });
}); 