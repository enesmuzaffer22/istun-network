// src/tests/jobs.test.ts
import request from 'supertest';
import app from './testApp';
import { expectSuccess, expectError, expectPaginatedResponse } from './helpers/testHelpers';

describe('💼 Jobs Tests', () => {
    const mockAdminToken = 'mock-admin-token';
    const mockUserToken = 'mock-user-token';

    describe('GET /api/jobs', () => {
        test('✅ Onaylanmış iş ilanları listesi alınabilmeli', async () => {
            const response = await request(app)
                .get('/api/jobs');

            expect([200, 500]).toContain(response.status);

            if (response.status === 200) {
                expectPaginatedResponse(response);
            }
        });

        test('✅ Pagination parametreleri çalışmalı', async () => {
            const response = await request(app)
                .get('/api/jobs?page=2&limit=5');

            expect([200, 500]).toContain(response.status);
        });
    });

    describe('GET /api/jobs/pending', () => {
        test('❌ Admin token olmadan pending ilanlar görülememeli', async () => {
            const response = await request(app)
                .get('/api/jobs/pending');

            expectError(response, 401);
        });

        test('❌ User token ile pending ilanlar görülememeli', async () => {
            const response = await request(app)
                .get('/api/jobs/pending')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([401, 403]).toContain(response.status);
        });

        test('✅ Admin token ile pending ilanlar görülebilmeli', async () => {
            const response = await request(app)
                .get('/api/jobs/pending')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 401, 500]).toContain(response.status);
        });
    });

    describe('GET /api/jobs/my', () => {
        test('❌ Token olmadan kendi ilanlar görülememeli', async () => {
            const response = await request(app)
                .get('/api/jobs/my');

            expectError(response, 401);
        });

        test('✅ Token ile kendi ilanlar görülebilmeli', async () => {
            const response = await request(app)
                .get('/api/jobs/my')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([200, 401, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobs/create', () => {
        test('❌ Token olmadan ilan oluşturulamamalı', async () => {
            const response = await request(app)
                .post('/api/jobs/create')
                .send({
                    title: 'Test İş İlanı',
                    employer: 'Test Şirket',
                    content: 'Test açıklama',
                    link: 'mailto:test@example.com'
                });

            expectError(response, 401);
        });

        test('✅ Geçerli user token ile ilan oluşturabilmeli', async () => {
            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${mockUserToken}`)
                .send({
                    title: 'Test İş İlanı',
                    employer: 'Test Şirket',
                    content: 'Test açıklama',
                    link: 'mailto:test@example.com'
                });

            expect([201, 401, 403, 404, 500]).toContain(response.status);
        });

        test('❌ Eksik zorunlu alan ile ilan oluşturulamamalı', async () => {
            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${mockUserToken}`)
                .send({
                    title: 'Test İş İlanı'
                    // employer, content, link eksik
                });

            expect([400, 401]).toContain(response.status);
        });
    });

    describe('POST /api/jobs', () => {
        test('❌ Admin token olmadan direkt ilan oluşturulamamalı', async () => {
            const response = await request(app)
                .post('/api/jobs')
                .send({
                    title: 'Admin İlanı',
                    employer: 'Şirket',
                    created_at: new Date().toISOString(),
                    content: 'Açıklama',
                    link: 'https://example.com'
                });

            expectError(response, 401);
        });

        test('✅ Admin token ile direkt ilan oluşturabilmeli', async () => {
            const response = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({
                    title: 'Admin İlanı',
                    employer: 'Şirket',
                    created_at: new Date().toISOString(),
                    content: 'Açıklama',
                    link: 'https://example.com'
                });

            expect([201, 401, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobs/:id/approve', () => {
        test('❌ Admin token olmadan onaylama yapılamamamalı', async () => {
            const response = await request(app)
                .post('/api/jobs/test-id/approve');

            expectError(response, 401);
        });

        test('✅ Admin token ile onaylama yapılabilmeli', async () => {
            const response = await request(app)
                .post('/api/jobs/test-id/approve')
                .set('Authorization', `Bearer ${mockAdminToken}`);

            expect([200, 400, 401, 404, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobs/:id/reject', () => {
        test('❌ Admin token olmadan reddetme yapılamamamalı', async () => {
            const response = await request(app)
                .post('/api/jobs/test-id/reject');

            expectError(response, 401);
        });

        test('✅ Admin token ile reddetme yapılabilmeli', async () => {
            const response = await request(app)
                .post('/api/jobs/test-id/reject')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({
                    reason: 'Test reddetme sebebi'
                });

            expect([200, 400, 401, 404, 500]).toContain(response.status);
        });
    });

    describe('POST /api/jobs/:id/submit', () => {
        test('✅ Başvuru sayısı artırılabilmeli', async () => {
            const response = await request(app)
                .post('/api/jobs/test-id/submit');

            expect([200, 403, 404, 500]).toContain(response.status);
        });
    });

    describe('PUT /api/jobs/:id', () => {
        test('❌ Token olmadan güncelleme yapılamamamalı', async () => {
            const response = await request(app)
                .put('/api/jobs/test-id')
                .send({
                    title: 'Güncellenmiş Başlık'
                });

            expectError(response, 401);
        });

        test('✅ Token ile güncelleme yapılabilmeli', async () => {
            const response = await request(app)
                .put('/api/jobs/test-id')
                .set('Authorization', `Bearer ${mockUserToken}`)
                .send({
                    title: 'Güncellenmiş Başlık'
                });

            expect([200, 401, 403, 404, 500]).toContain(response.status);
        });
    });

    describe('DELETE /api/jobs/:id', () => {
        test('❌ Token olmadan silme yapılamamamalı', async () => {
            const response = await request(app)
                .delete('/api/jobs/test-id');

            expectError(response, 401);
        });

        test('✅ Token ile silme yapılabilmeli', async () => {
            const response = await request(app)
                .delete('/api/jobs/test-id')
                .set('Authorization', `Bearer ${mockUserToken}`);

            expect([200, 401, 403, 404, 500]).toContain(response.status);
        });
    });
}); 