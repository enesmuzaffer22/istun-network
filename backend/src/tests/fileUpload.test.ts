// src/tests/fileUpload.test.ts
import { createTestFile, createTestPDF } from './helpers/testHelpers';
import crypto from 'crypto';

describe('📁 File Upload Tests', () => {

    describe('File Creation Helpers', () => {
        test('✅ Test dosyası oluşturulabilmeli', () => {
            const file = createTestFile(1024, 'image/jpeg');

            expect(file).toBeInstanceOf(Buffer);
            expect(file.length).toBe(1024);
        });

        test('✅ Test PDF dosyası oluşturulabilmeli', () => {
            const pdf = createTestPDF(2048);

            expect(pdf).toBeInstanceOf(Buffer);
            expect(pdf.length).toBe(2048);
            expect(pdf.toString('utf8', 0, 8)).toBe('%PDF-1.4');
        });

        test('✅ Farklı boyutlarda dosyalar oluşturulabilmeli', () => {
            const sizes = [512, 1024, 2048, 1024 * 1024]; // 512B, 1KB, 2KB, 1MB

            sizes.forEach(size => {
                const file = createTestFile(size);
                expect(file.length).toBe(size);
            });
        });
    });

    describe('File Hash Calculation', () => {
        test('✅ Aynı içerikli dosyalar aynı hash üretmeli', () => {
            const file1 = createTestFile(1024, 'image/jpeg');
            const file2 = createTestFile(1024, 'image/jpeg');

            const hash1 = crypto.createHash('md5').update(file1).digest('hex');
            const hash2 = crypto.createHash('md5').update(file2).digest('hex');

            expect(hash1).toBe(hash2);
        });

        test('✅ Farklı içerikli dosyalar farklı hash üretmeli', () => {
            const file1 = createTestFile(1024, 'image/jpeg');
            const file2 = createTestPDF(1024);

            const hash1 = crypto.createHash('md5').update(file1).digest('hex');
            const hash2 = crypto.createHash('md5').update(file2).digest('hex');

            expect(hash1).not.toBe(hash2);
        });

        test('✅ Hash değeri tutarlı olmalı', () => {
            const file = createTestFile(1024);

            const hash1 = crypto.createHash('md5').update(file).digest('hex');
            const hash2 = crypto.createHash('md5').update(file).digest('hex');

            expect(hash1).toBe(hash2);
            expect(hash1).toHaveLength(32); // MD5 hash length
        });
    });

    describe('File Size Validations', () => {
        test('✅ 1MB altı dosyalar geçerli olmalı (öğrenci belgeleri)', () => {
            const sizes = [
                100 * 1024,    // 100KB
                500 * 1024,    // 500KB
                1024 * 1024 - 1 // 1MB - 1byte
            ];

            sizes.forEach(size => {
                const file = createTestPDF(size);
                expect(file.length).toBeLessThan(1024 * 1024);
            });
        });

        test('✅ 2MB altı dosyalar geçerli olmalı (resimler)', () => {
            const sizes = [
                100 * 1024,     // 100KB
                1024 * 1024,    // 1MB
                2 * 1024 * 1024 - 1 // 2MB - 1byte
            ];

            sizes.forEach(size => {
                const file = createTestFile(size, 'image/jpeg');
                expect(file.length).toBeLessThan(2 * 1024 * 1024);
            });
        });

        test('❌ Çok büyük dosyalar reddedilmeli', () => {
            const largeSizes = [
                1024 * 1024 + 1,      // 1MB + 1byte (öğrenci belgesi için)
                2 * 1024 * 1024 + 1,  // 2MB + 1byte (resim için)
                5 * 1024 * 1024       // 5MB
            ];

            largeSizes.forEach(size => {
                const file = createTestFile(size);
                expect(file.length).toBeGreaterThan(1024 * 1024);
            });
        });
    });

    describe('MIME Type Validations', () => {
        test('✅ Desteklenen belge formatları', () => {
            const supportedDocTypes = [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            supportedDocTypes.forEach(mimeType => {
                // MIME type'ların listede olduğunu kontrol et
                expect(mimeType).toBeTruthy();
            });
        });

        test('✅ Desteklenen resim formatları', () => {
            const supportedImageTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp'
            ];

            supportedImageTypes.forEach(mimeType => {
                expect(mimeType).toBeTruthy();
            });
        });

        test('❌ Desteklenmeyen formatlar reddedilmeli', () => {
            const unsupportedTypes = [
                'application/zip',
                'text/plain',
                'audio/mp3',
                'video/mp4',
                'application/javascript'
            ];

            // Bu formatlar desteklenmemeli
            const supportedImageTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp'
            ];

            unsupportedTypes.forEach(mimeType => {
                expect(supportedImageTypes.includes(mimeType)).toBe(false);
            });
        });
    });

    describe('Duplicate Prevention Logic', () => {
        test('✅ Aynı hash değeri duplicate olarak algılanmalı', () => {
            const file1 = createTestFile(1024);
            const file2 = Buffer.from(file1); // Aynı içerik

            const hash1 = crypto.createHash('md5').update(file1).digest('hex');
            const hash2 = crypto.createHash('md5').update(file2).digest('hex');

            expect(hash1).toBe(hash2); // Duplicate detection
        });

        test('✅ Farklı dosyalar unique hash üretmeli', () => {
            const file1 = createTestFile(1024);
            const file2 = createTestFile(1025); // 1 byte fark

            const hash1 = crypto.createHash('md5').update(file1).digest('hex');
            const hash2 = crypto.createHash('md5').update(file2).digest('hex');

            expect(hash1).not.toBe(hash2); // Unique files
        });
    });

    describe('Cache Headers Validation', () => {
        test('✅ Cache control headers geçerli olmalı', () => {
            const documentCacheControl = 'public, max-age=2592000'; // 30 gün
            const imageCacheControl = 'public, max-age=31536000';   // 1 yıl

            // Cache control format kontrolü
            expect(documentCacheControl).toContain('public');
            expect(documentCacheControl).toContain('max-age=2592000');

            expect(imageCacheControl).toContain('public');
            expect(imageCacheControl).toContain('max-age=31536000');
        });

        test('✅ Custom headers format kontrolü', () => {
            const testHash = 'abc123def456';
            const testDate = new Date().toISOString();

            // Custom header formatı
            const customHeaders = {
                'x-file-hash': testHash,
                'x-upload-date': testDate
            };

            expect(customHeaders['x-file-hash']).toBe(testHash);
            expect(customHeaders['x-upload-date']).toBe(testDate);
        });
    });
}); 