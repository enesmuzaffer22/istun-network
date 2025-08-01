// src/tests/setup.ts
import dotenv from 'dotenv';

// Test environment variables
dotenv.config({ path: '.env.test' });

// Test timeout
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
    console.log('🧪 Test suite başlatılıyor...');
});

afterAll(async () => {
    console.log('✅ Test suite tamamlandı!');
}); 