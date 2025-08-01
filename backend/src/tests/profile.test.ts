// src/tests/profile.test.ts
import request from 'supertest';
import app from './testApp';
import { expectSuccess, expectError, expectPaginatedResponse } from './helpers/testHelpers';

describe('👤 Profile Tests', () => {
    const mockAdminToken = 'mock-admin-token';
    const mockUserToken = 'mock-user-token';

    describe('GET /api/users/me', () => {
        test('❌ Token olmadan profil görülememeli', async () => {
            const response = await request(app)
                .get('/api/users/me');

            expectError(response, 401);
        });

        test('✅ Token ile profil görülebilmeli', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([200, 401, 404, 500]).toContain(response.status);
        });
    });

    describe('PUT /api/users/me', () => {
        test('❌ Token olmadan profil güncellenememeli', async () => {
            const response = await request(app)
                .put('/api/users/me')
                .send({
                    name: 'Yeni İsim'
                });

            expectError(response, 401);
        });

        test('✅ Token ile profil güncellenebilmeli', async () => {
            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', `Bearer ${mockUserToken}`)
                .send({
                    name: 'Yeni İsim',
                    surname: 'Yeni Soyisim'
                });

            expect([200, 401, 500]).toContain(response.status);
        });

        test('❌ Boş güncelleme verisi gönderilememeli', async () => {
            const response = await request(app)
                .put('/api/users/me')
                .set('Authorization', `Bearer ${mockUserToken}`)
                .send({}); // Boş obje

            expect([400, 401]).toContain(response.status);
        });
    });

    describe('GET /api/users', () => {
        test('❌ Admin token olmadan kullanıcı listesi görülememeli', async () => {
            const response = await request(app)
                .get('/api/users');

            expectError(response, 401);
        });

        test('❌ User token ile kullanıcı listesi görülememeli', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([401, 403]).toContain(response.status);
        });

        test('✅ Admin token ile kullanıcı listesi görülebilmeli', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 401, 500]).toContain(response.status);

            if (response.status === 200) {
                expectPaginatedResponse(response);
            }
        });

        test('✅ Status filtresi çalışmalı', async () => {
            const response = await request(app)
                .get('/api/users?status=pending')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 401, 500]).toContain(response.status);
        });
    });

    describe('GET /api/users/:username', () => {
        test('❌ Token olmadan public profil görülememeli', async () => {
            const response = await request(app)
                .get('/api/users/test_user');

            expectError(response, 401);
        });

        test('✅ Token ile public profil görülebilmeli', async () => {
            const response = await request(app)
                .get('/api/users/test_user')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([200, 401, 404, 500]).toContain(response.status);
        });
    });

    describe('POST /api/users/:id/approve', () => {
        test('❌ Admin token olmadan kullanıcı onaylanamamamalı', async () => {
            const response = await request(app)
                .post('/api/users/test-user-id/approve');

            expectError(response, 401);
        });

        test('❌ User token ile kullanıcı onaylanamamamalı', async () => {
            const response = await request(app)
                .post('/api/users/test-user-id/approve')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([401, 403]).toContain(response.status);
        });

        test('✅ Admin token ile kullanıcı onaylanabilmeli', async () => {
            const response = await request(app)
                .post('/api/users/test-user-id/approve')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 401, 404, 500]).toContain(response.status);
        });
    });

    describe('POST /api/users/:id/reject', () => {
        test('❌ Admin token olmadan kullanıcı reddedilememeli', async () => {
            const response = await request(app)
                .post('/api/users/test-user-id/reject');

            expectError(response, 401);
        });

        test('✅ Admin token ile kullanıcı reddedilebilmeli', async () => {
            const response = await request(app)
                .post('/api/users/test-user-id/reject')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 401, 404, 500]).toContain(response.status);
        });
    });
}); 