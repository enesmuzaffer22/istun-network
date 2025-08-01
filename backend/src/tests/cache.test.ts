// src/tests/cache.test.ts
import { MemoryCache } from '../utils/cache';

describe('⚡ Cache System Tests', () => {
    let cache: MemoryCache;

    beforeEach(() => {
        cache = new MemoryCache();
    });

    afterEach(() => {
        cache.clear();
    });

    describe('Basic Cache Operations', () => {
        test('✅ Cache\'e veri kaydedilebilmeli', () => {
            const testData = { message: 'test data' };
            cache.set('test-key', testData, 10);

            const retrieved = cache.get('test-key');
            expect(retrieved).toEqual(testData);
        });

        test('✅ Cache\'den veri alınabilmeli', () => {
            cache.set('test-key', 'test-value', 10);

            const value = cache.get('test-key');
            expect(value).toBe('test-value');
        });

        test('✅ Olmayan key için null dönmeli', () => {
            const value = cache.get('nonexistent-key');
            expect(value).toBeNull();
        });

        test('✅ Cache\'den veri silinebilmeli', () => {
            cache.set('test-key', 'test-value', 10);
            cache.delete('test-key');

            const value = cache.get('test-key');
            expect(value).toBeNull();
        });

        test('✅ Cache tamamen temizlenebilmeli', () => {
            cache.set('key1', 'value1', 10);
            cache.set('key2', 'value2', 10);

            cache.clear();

            expect(cache.get('key1')).toBeNull();
            expect(cache.get('key2')).toBeNull();
        });
    });

    describe('TTL (Time To Live) Tests', () => {
        test('✅ TTL süresi dolmadan veri alınabilmeli', () => {
            cache.set('test-key', 'test-value', 1); // 1 saniye

            const value = cache.get('test-key');
            expect(value).toBe('test-value');
        });

        test('✅ TTL süresi dolduktan sonra null dönmeli', async () => {
            cache.set('test-key', 'test-value', 0.1); // 100ms

            // 200ms bekle
            await new Promise(resolve => setTimeout(resolve, 200));

            const value = cache.get('test-key');
            expect(value).toBeNull();
        });

        test('✅ Süresi dolan veri otomatik silinmeli', async () => {
            cache.set('test-key', 'test-value', 0.1); // 100ms

            // İlk kontrolde var olmalı
            expect(cache.get('test-key')).toBe('test-value');

            // 200ms bekle
            await new Promise(resolve => setTimeout(resolve, 200));

            // Şimdi null olmalı
            expect(cache.get('test-key')).toBeNull();
        });
    });

    describe('Data Types Support', () => {
        test('✅ String veri türü desteklenmeli', () => {
            cache.set('string-key', 'string value', 10);
            expect(cache.get('string-key')).toBe('string value');
        });

        test('✅ Number veri türü desteklenmeli', () => {
            cache.set('number-key', 42, 10);
            expect(cache.get('number-key')).toBe(42);
        });

        test('✅ Object veri türü desteklenmeli', () => {
            const testObj = { name: 'test', age: 25 };
            cache.set('object-key', testObj, 10);
            expect(cache.get('object-key')).toEqual(testObj);
        });

        test('✅ Array veri türü desteklenmeli', () => {
            const testArray = [1, 2, 3, 'test'];
            cache.set('array-key', testArray, 10);
            expect(cache.get('array-key')).toEqual(testArray);
        });

        test('✅ Boolean veri türü desteklenmeli', () => {
            cache.set('bool-true', true, 10);
            cache.set('bool-false', false, 10);

            expect(cache.get('bool-true')).toBe(true);
            expect(cache.get('bool-false')).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('✅ Aynı key\'e yeniden değer atanabilmeli', () => {
            cache.set('test-key', 'first-value', 10);
            cache.set('test-key', 'second-value', 10);

            expect(cache.get('test-key')).toBe('second-value');
        });

        test('✅ Çok büyük TTL değeri çalışmalı', () => {
            cache.set('test-key', 'test-value', 999999);
            expect(cache.get('test-key')).toBe('test-value');
        });

        test('✅ Sıfır TTL ile veri hemen geçersiz olmalı', async () => {
            cache.set('test-key', 'test-value', 0);

            // Minimal bekleme
            await new Promise(resolve => setTimeout(resolve, 1));

            const value = cache.get('test-key');
            expect(value).toBeNull();
        });

        test('✅ Null ve undefined değerler kaydedilebilmeli', () => {
            cache.set('null-key', null, 10);
            cache.set('undefined-key', undefined, 10);

            expect(cache.get('null-key')).toBeNull();
            expect(cache.get('undefined-key')).toBeUndefined();
        });
    });
}); 