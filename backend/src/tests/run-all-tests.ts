// src/tests/run-all-tests.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
    name: string;
    passed: number;
    failed: number;
    total: number;
    duration: string;
    success: boolean;
}

const runTest = async (testFile: string): Promise<TestResult> => {
    try {
        console.log(`🧪 ${testFile} testi çalışıyor...`);

        const startTime = Date.now();
        const { stdout, stderr } = await execAsync(`npx jest src/tests/${testFile} --verbose`);
        const endTime = Date.now();

        // Jest output'u parse et
        const duration = `${((endTime - startTime) / 1000).toFixed(2)}s`;
        const output = stdout + stderr;

        // Test sonuçlarını parse et (basit regex)
        const passedMatch = output.match(/(\d+) passed/);
        const failedMatch = output.match(/(\d+) failed/);
        const totalMatch = output.match(/Tests:\s+(\d+)/);

        const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
        const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
        const total = totalMatch ? parseInt(totalMatch[1]) : passed + failed;

        return {
            name: testFile,
            passed,
            failed,
            total,
            duration,
            success: failed === 0
        };

    } catch (error: any) {
        console.error(`❌ ${testFile} testi başarısız:`, error.message);

        return {
            name: testFile,
            passed: 0,
            failed: 1,
            total: 1,
            duration: '0s',
            success: false
        };
    }
};

const runAllTests = async () => {
    console.log('\n🚀 ISTUN Backend Test Suite Başlatılıyor...\n');

    const testFiles = [
        'auth.test.ts',
        'news.test.ts',
        'jobs.test.ts',
        'profile.test.ts',
        'cache.test.ts',
        'fileUpload.test.ts',
        'rateLimit.test.ts',
        'progressiveRateLimit.test.ts'
    ];

    const results: TestResult[] = [];
    const startTime = Date.now();

    // Testleri paralel çalıştır
    const promises = testFiles.map(testFile => runTest(testFile));
    const testResults = await Promise.all(promises);

    results.push(...testResults);

    const endTime = Date.now();
    const totalDuration = `${((endTime - startTime) / 1000).toFixed(2)}s`;

    // Sonuçları özetle
    console.log('\n📊 TEST SONUÇLARI\n');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;

    results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        const color = result.success ? '\x1b[32m' : '\x1b[31m'; // Green or Red
        const reset = '\x1b[0m';

        console.log(
            `${status} ${color}${result.name.padEnd(20)}${reset} ` +
            `${result.passed} geçti, ${result.failed} başarısız ` +
            `(${result.duration})`
        );

        totalPassed += result.passed;
        totalFailed += result.failed;
        totalTests += result.total;
    });

    console.log('='.repeat(60));
    console.log(`📈 TOPLAM: ${totalTests} test, ${totalPassed} geçti, ${totalFailed} başarısız`);
    console.log(`⏱️  SÜRE: ${totalDuration}`);

    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';
    console.log(`📊 BAŞARI ORANI: %${successRate}`);

    if (totalFailed === 0) {
        console.log('\n🎉 TÜM TESTLER BAŞARILI! 🎉\n');
    } else {
        console.log(`\n⚠️  ${totalFailed} TEST BAŞARISIZ\n`);
    }

    // Detaylı rapor
    console.log('\n📋 DETAYLI RAPOR:');
    console.log('-'.repeat(40));

    const categories = {
        '🔐 Authentication': results.filter(r => r.name.includes('auth')),
        '📰 Content Management': results.filter(r => ['news', 'jobs'].some(t => r.name.includes(t))),
        '👤 User Management': results.filter(r => r.name.includes('profile')),
        '⚡ Performance': results.filter(r => ['cache', 'rateLimit', 'progressiveRateLimit'].some(t => r.name.includes(t))),
        '📁 File Handling': results.filter(r => r.name.includes('fileUpload'))
    };

    Object.entries(categories).forEach(([category, tests]) => {
        if (tests.length > 0) {
            const categoryPassed = tests.reduce((sum, t) => sum + t.passed, 0);
            const categoryTotal = tests.reduce((sum, t) => sum + t.total, 0);
            const categoryRate = categoryTotal > 0 ? ((categoryPassed / categoryTotal) * 100).toFixed(1) : '0';

            console.log(`${category}: ${categoryPassed}/${categoryTotal} (%${categoryRate})`);
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log('Test suite tamamlandı!');

    // Exit code
    process.exit(totalFailed > 0 ? 1 : 0);
};

// Script olarak çalıştırıldığında
if (require.main === module) {
    runAllTests().catch(console.error);
}

export { runAllTests }; 