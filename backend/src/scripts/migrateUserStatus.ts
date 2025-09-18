// backend/src/scripts/migrateUserStatus.ts

import { db } from "../firebase/firebase";
import { setUserStatus } from "../utils/adminUtils";

/**
 * Mevcut kullanıcıların status bilgilerini Custom Claims'e migrate eder
 * Bu script sadece bir kez çalıştırılmalıdır
 */
async function migrateUserStatus() {
    try {
        console.log("🚀 User status migration başlatılıyor...");
        
        // Tüm kullanıcıları al
        const usersSnapshot = await db.collection("users").get();
        
        if (usersSnapshot.empty) {
            console.log("⚠️  Hiç kullanıcı bulunamadı.");
            return;
        }

        console.log(`📊 Toplam ${usersSnapshot.size} kullanıcı bulundu.`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        // Her kullanıcı için işlem yap
        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userId = doc.id;
            const status = userData.status as 'pending' | 'approved' | 'rejected';

            console.log(`📝 İşleniyor: ${userData.email} (${userId}) - Status: ${status}`);

            // Status kontrolü
            if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
                console.log(`⚠️  Geçersiz status: ${userData.email} - Atlanıyor`);
                skippedCount++;
                continue;
            }

            try {
                // Custom Claims'e status ekle
                const success = await setUserStatus(userId, status);
                
                if (success) {
                    console.log(`✅ Başarılı: ${userData.email} -> ${status}`);
                    successCount++;
                } else {
                    console.log(`❌ Hata: ${userData.email} -> Custom Claims güncellenemedi`);
                    errorCount++;
                }

                // Rate limiting için kısa bekleme
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`❌ Hata: ${userData.email} ->`, error);
                errorCount++;
            }
        }

        // Özet
        console.log("\n" + "=".repeat(50));
        console.log("📈 Migration Özeti:");
        console.log(`✅ Başarılı: ${successCount}`);
        console.log(`❌ Hatalı: ${errorCount}`);
        console.log(`⚠️  Atlanan: ${skippedCount}`);
        console.log(`📊 Toplam: ${usersSnapshot.size}`);
        console.log("=".repeat(50));

        if (errorCount === 0) {
            console.log("🎉 Migration başarıyla tamamlandı!");
        } else {
            console.log(`⚠️  Migration tamamlandı ancak ${errorCount} hata oluştu.`);
        }

    } catch (error) {
        console.error("💥 Migration sırasında kritik hata:", error);
        process.exit(1);
    }
}

/**
 * Belirli bir status'taki kullanıcıları migrate eder
 * @param targetStatus - Migrate edilecek kullanıcıların status'u
 */
async function migrateByStatus(targetStatus: 'pending' | 'approved' | 'rejected') {
    try {
        console.log(`🎯 Sadece '${targetStatus}' status'lu kullanıcılar migrate ediliyor...`);
        
        const usersSnapshot = await db
            .collection("users")
            .where("status", "==", targetStatus)
            .get();

        if (usersSnapshot.empty) {
            console.log(`⚠️  '${targetStatus}' status'lu kullanıcı bulunamadı.`);
            return;
        }

        console.log(`📊 ${usersSnapshot.size} adet '${targetStatus}' kullanıcı bulundu.`);

        let successCount = 0;
        let errorCount = 0;

        for (const doc of usersSnapshot.docs) {
            const userData = doc.data();
            const userId = doc.id;

            console.log(`📝 İşleniyor: ${userData.email} (${userId})`);

            try {
                const success = await setUserStatus(userId, targetStatus);
                
                if (success) {
                    console.log(`✅ Başarılı: ${userData.email}`);
                    successCount++;
                } else {
                    console.log(`❌ Hata: ${userData.email}`);
                    errorCount++;
                }

                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`❌ Hata: ${userData.email} ->`, error);
                errorCount++;
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log(`📈 '${targetStatus}' Migration Özeti:`);
        console.log(`✅ Başarılı: ${successCount}`);
        console.log(`❌ Hatalı: ${errorCount}`);
        console.log("=".repeat(50));

    } catch (error) {
        console.error("💥 Migration sırasında kritik hata:", error);
        process.exit(1);
    }
}

/**
 * Dry run - Sadece analiz yapar, değişiklik yapmaz
 */
async function dryRun() {
    try {
        console.log("🔍 Dry run başlatılıyor (değişiklik yapılmayacak)...");
        
        const usersSnapshot = await db.collection("users").get();
        
        if (usersSnapshot.empty) {
            console.log("⚠️  Hiç kullanıcı bulunamadı.");
            return;
        }

        const statusCounts = {
            pending: 0,
            approved: 0,
            rejected: 0,
            invalid: 0
        };

        console.log(`📊 Toplam ${usersSnapshot.size} kullanıcı analiz ediliyor...\n`);

        usersSnapshot.docs.forEach(doc => {
            const userData = doc.data();
            const status = userData.status;

            console.log(`📄 ${userData.email}: ${status || 'UNDEFINED'}`);

            if (status === 'pending') statusCounts.pending++;
            else if (status === 'approved') statusCounts.approved++;
            else if (status === 'rejected') statusCounts.rejected++;
            else statusCounts.invalid++;
        });

        console.log("\n" + "=".repeat(50));
        console.log("📊 Status Dağılımı:");
        console.log(`✅ Approved: ${statusCounts.approved}`);
        console.log(`⏳ Pending: ${statusCounts.pending}`);
        console.log(`❌ Rejected: ${statusCounts.rejected}`);
        console.log(`⚠️  Geçersiz: ${statusCounts.invalid}`);
        console.log("=".repeat(50));

    } catch (error) {
        console.error("💥 Dry run sırasında hata:", error);
    }
}

// Script çalıştırma kontrolleri
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'dry-run':
            console.log("🔍 Dry run modu aktif");
            dryRun()
                .then(() => {
                    console.log("✅ Dry run tamamlandı.");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("❌ Dry run hatası:", error);
                    process.exit(1);
                });
            break;

        case 'approved':
            console.log("🎯 Sadece approved kullanıcılar migrate edilecek");
            migrateByStatus('approved')
                .then(() => {
                    console.log("✅ Approved migration tamamlandı.");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("❌ Migration hatası:", error);
                    process.exit(1);
                });
            break;

        case 'pending':
            console.log("🎯 Sadece pending kullanıcılar migrate edilecek");
            migrateByStatus('pending')
                .then(() => {
                    console.log("✅ Pending migration tamamlandı.");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("❌ Migration hatası:", error);
                    process.exit(1);
                });
            break;

        case 'rejected':
            console.log("🎯 Sadece rejected kullanıcılar migrate edilecek");
            migrateByStatus('rejected')
                .then(() => {
                    console.log("✅ Rejected migration tamamlandı.");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("❌ Migration hatası:", error);
                    process.exit(1);
                });
            break;

        case 'all':
        case undefined:
            console.log("🚀 Tüm kullanıcılar migrate edilecek");
            migrateUserStatus()
                .then(() => {
                    console.log("✅ Migration tamamlandı.");
                    process.exit(0);
                })
                .catch((error) => {
                    console.error("❌ Migration hatası:", error);
                    process.exit(1);
                });
            break;

        default:
            console.log("❌ Geçersiz komut!");
            console.log("Kullanım:");
            console.log("  npm run migrate:users              # Tüm kullanıcıları migrate et");
            console.log("  npm run migrate:users all          # Tüm kullanıcıları migrate et");
            console.log("  npm run migrate:users dry-run      # Sadece analiz yap");
            console.log("  npm run migrate:users approved     # Sadece approved kullanıcıları");
            console.log("  npm run migrate:users pending      # Sadece pending kullanıcıları");
            console.log("  npm run migrate:users rejected     # Sadece rejected kullanıcıları");
            process.exit(1);
    }
}

export { migrateUserStatus, migrateByStatus, dryRun };