// src/tests/helpers/testHelpers.ts
import request from 'supertest';
import app from '../testApp';
import { Buffer } from 'buffer';

// Test kullanıcı bilgileri
export const testUsers = {
    admin: {
        email: "admin@test.com",
        password: "admin123",
        username: "admin_test"
    },
    user: {
        email: "user@test.com",
        password: "user123",
        username: "user_test",
        name: "Test",
        surname: "User",
        tc: "12345678901",
        phone: "05551234567",
        workStatus: "employed",
        classStatus: "graduate",
        consent: true
    }
};

// Token'ları saklamak için
export let adminToken = "";
export let userToken = "";

// Login helper fonksiyonu
export const loginUser = async (identifier: string, password: string): Promise<string> => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ identifier, password });

    if (response.status === 200) {
        return response.body.token;
    }
    throw new Error(`Login failed: ${response.body.message}`);
};

// Test dosyası oluşturma
export const createTestFile = (size: number = 1024, type: string = 'image/jpeg'): Buffer => {
    return Buffer.alloc(size, 'test-file-content');
};

// PDF test dosyası
export const createTestPDF = (size: number = 1024): Buffer => {
    const pdfHeader = Buffer.from('%PDF-1.4\n');
    const content = Buffer.alloc(size - pdfHeader.length, 'test-pdf-content');
    return Buffer.concat([pdfHeader, content]);
};

// Bekleme helper'ı (rate limiting testleri için)
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Test verilerini temizleme
export const cleanupTestData = async () => {
    // Bu fonksiyon gerçek projede Firestore'dan test verilerini temizler
    // Test ortamında mock olarak bırakıyoruz
    console.log('🧹 Test verileri temizlendi');
};

// HTTP status kontrolü
export const expectSuccess = (response: any) => {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
};

export const expectError = (response: any, expectedStatus: number) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('message');
};

// Pagination response kontrolü
export const expectPaginatedResponse = (response: any) => {
    expectSuccess(response);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('hasMore');
    expect(Array.isArray(response.body.data)).toBe(true);
}; 