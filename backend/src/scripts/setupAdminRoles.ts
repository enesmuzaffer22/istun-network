import { auth, db } from "../firebase/firebase";
import { setAdminRole } from "../utils/adminUtils";

/**
 * Mevcut admin kullanıcılarının rollerini ayarlar
 * Bu script sadece bir kez çalıştırılmalıdır
 */
async function setupAdminRoles() {
    try {
        console.log("Admin rolleri ayarlanıyor...");

        // Mevcut admin kullanıcılarını bul (admin: true olan)
        const adminsSnap = await db
            .collection("users")
            .where("admin", "==", true)
            .get();

        if (adminsSnap.empty) {
            console.log("Admin kullanıcı bulunamadı.");
            return;
        }

        for (const doc of adminsSnap.docs) {
            const userData = doc.data();
            const userId = doc.id;

            console.log(`Kullanıcı işleniyor: ${userData.email} (${userId})`);

            // Eğer adminRole yoksa, super_admin olarak ayarla
            if (!userData.adminRole) {
                const success = await setAdminRole(userId, 'super_admin');

                if (success) {
                    // Firestore'da da güncelle
                    await db.collection("users").doc(userId).update({
                        adminRole: 'super_admin',
                        isAdmin: true
                    });
                    console.log(`✅ ${userData.email} -> super_admin olarak ayarlandı`);
                } else {
                    console.log(`❌ ${userData.email} -> rol atanamadı`);
                }
            } else {
                console.log(`ℹ️  ${userData.email} -> zaten ${userData.adminRole} rolüne sahip`);
            }
        }

        console.log("Admin rolleri ayarlama tamamlandı!");
    } catch (error) {
        console.error("Admin rolleri ayarlama hatası:", error);
    }
}

// Script'i çalıştır
if (require.main === module) {
    setupAdminRoles()
        .then(() => {
            console.log("Script tamamlandı.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Script hatası:", error);
            process.exit(1);
        });
}

export { setupAdminRoles };
