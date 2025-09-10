import { db } from "../firebase/firebase";
import { setAdminRole } from "../utils/adminUtils";

/**
 * Mevcut admin kullanıcılarının rollerini ayarlar
 * Bu script sadece bir kez çalıştırılmalıdır
 */
async function setupAdminRoles() {
    try {
        console.log("Admin rolleri ayarlanıyor...");

        // Opsiyonel: İlk süper admin email(ler)i (bootstrap)
        const initialSuperSingle = process.env.INITIAL_SUPER_ADMIN_EMAIL;
        const initialSuperMulti = process.env.INITIAL_SUPER_ADMIN_EMAILS; // virgül ile ayrılmış liste

        const emails: string[] = [];
        if (initialSuperSingle) emails.push(initialSuperSingle);
        if (initialSuperMulti) {
            initialSuperMulti.split(',').forEach(e => {
                const t = e.trim();
                if (t) emails.push(t);
            });
        }

        if (emails.length > 0) {
            console.log(`Bootstrap süper admin e-postaları: ${emails.join(', ')}`);
            for (const email of emails) {
                const byEmailSnap = await db.collection("users").where("email", "==", email).limit(1).get();
                if (!byEmailSnap.empty) {
                    const doc = byEmailSnap.docs[0];
                    const success = await setAdminRole(doc.id, 'super_admin');
                    if (success) {
                        await db.collection("users").doc(doc.id).update({
                            adminRole: 'super_admin',
                            isAdmin: true,
                        });
                        console.log(`✅ ${email} -> super_admin olarak AYARLANDI (bootstrap)`);
                    } else {
                        console.log(`❌ ${email} -> rol atanamadı (bootstrap)`);
                    }
                } else {
                    console.log(`⚠️  ${email} email'ine sahip kullanıcı bulunamadı.`);
                }
            }
        }

        // Mevcut admin kullanıcılarını bul
        // Bazı kayıtlarda alan adı 'admin' veya 'isAdmin' olabilir, ikisini de kontrol et.
        const adminsSnap1 = await db.collection("users").where("isAdmin", "==", true).get();
        const adminsSnap2 = await db.collection("users").where("admin", "==", true).get();
        const handledIds = new Set<string>();

        const processDoc = async (doc: any) => {
            const userData = doc.data();
            const userId = doc.id;
            if (handledIds.has(userId)) return;
            handledIds.add(userId);

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
        };

        if (adminsSnap1.empty && adminsSnap2.empty) {
            console.log("Admin kullanıcı bulunamadı (isAdmin/admin alanı). İşlem tamam.");
            return;
        }

        for (const doc of adminsSnap1.docs) { await processDoc(doc); }
        for (const doc of adminsSnap2.docs) { await processDoc(doc); }

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
