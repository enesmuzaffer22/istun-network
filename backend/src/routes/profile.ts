// src/routes/profile.ts

import express from "express";
import { db, auth } from "../firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

//================================================================
// 1. GET /api/users/me -> Giriş yapmış kullanıcının kendi profilini getirir.
//================================================================
router.get("/me", protect, async (req, res) => {
    try {
        // 'protect' middleware'i sayesinde req.user'ın varlığından ve
        // içinde uid olduğundan eminiz.
        const userDoc = await db.collection("users").doc(req.user!.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "Kullanıcı profili bulunamadı." });
        }

        // Başarılı durumda kullanıcı verisini döndür.
        res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
});

//================================================================
// 2. PUT /api/users/me -> Giriş yapmış kullanıcının kendi profilini günceller.
//================================================================
router.put("/me", protect, async (req, res) => {
    try {
        const { name, surname, phone, workStatus, classStatus, about } = req.body;
        const userId = req.user!.uid;

        // Kullanıcının sadece belirli alanları güncelleyebilmesini sağlamak için
        // güncellenecek verileri içeren bir obje oluşturuyoruz.
        // Bu, kullanıcının 'status' veya 'admin' gibi alanları değiştirmesini engeller.
        const updateData: { [key: string]: any } = {};

        if (name) updateData.name = name;
        if (surname) updateData.surname = surname;
        if (phone) updateData.phone = phone;
        if (workStatus) updateData.workStatus = workStatus;
        if (classStatus) updateData.classStatus = classStatus;
        // 'about' alanı boş bir string olabilir, bu yüzden undefined kontrolü yapıyoruz.
        if (about !== undefined) updateData.about = about;

        // Eğer güncellenecek hiçbir veri gönderilmediyse hata döndür.
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Güncellenecek en az bir alan gönderilmelidir." });
        }

        // Firestore'daki kullanıcı belgesini güncelle.
        await db.collection("users").doc(userId).update(updateData);

        // İsim/soyisim değiştiyse Firebase Auth'daki displayName'i de güncelleyelim.
        if (name || surname) {
            // Güncel ismi ve soyismi alarak tam bir displayName oluşturalım.
            const userDoc = await db.collection("users").doc(userId).get();
            const userData = userDoc.data();
            if (userData) {
                const newDisplayName = `${userData.name} ${userData.surname}`;
                await auth.updateUser(userId, { displayName: newDisplayName });
            }
        }

        res.json({ message: "Profil başarıyla güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
});

//================================================================
// 3. GET /api/users -> (Admin) Tüm kullanıcıları listeler.
//================================================================
router.get("/", protect, isAdmin, async (req, res) => {
    try {
        // Sayfalama için limit ve son görünen belge ID'si alınır.
        const limit = parseInt(req.query.limit as string) || 10;
        const lastVisible = req.query.lastVisible as string;

        let query = db.collection("users").orderBy("createdAt", "desc").limit(limit);

        if (lastVisible) {
            const lastDoc = await db.collection("users").doc(lastVisible).get();
            if (lastDoc.exists) {
                query = query.startAfter(lastDoc);
            }
        }

        const snapshot = await query.get();
        const users = snapshot.docs.map(doc => {
            // Admin paneline gönderirken hassas verileri (örn: TC) çıkarabiliriz.
            const { tc, ...userData } = doc.data();
            return { id: doc.id, ...userData };
        });

        const nextLastVisible = snapshot.docs[snapshot.docs.length - 1]?.id || null;

        res.json({
            data: users,
            lastVisible: nextLastVisible
        });

    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
});

//================================================================
// 4. GET /api/users/:username -> Herkese açık profili getirir.
//================================================================
router.get("/:username", protect, async (req, res) => {
    try {
        const username = req.params.username;
        const userSnap = await db.collection("users").where("username", "==", username).limit(1).get();

        if (userSnap.empty) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const userData = userSnap.docs[0].data();

        // Profilin onaylanmış olup olmadığını kontrol et.
        if (userData.status !== 'approved') {
            return res.status(403).json({ message: "Bu profile erişim izni yok." });
        }

        // Güvenlik için sadece halka açık olması gereken bilgileri döndür.
        // ASLA tc, phone, email, student_doc_url gibi verileri döndürme!
        const publicProfile = {
            name: userData.name,
            surname: userData.surname,
            username: userData.username,
            workStatus: userData.workStatus,
            classStatus: userData.classStatus,
            about: userData.about,
            createdAt: userData.createdAt,
        };

        res.json(publicProfile);
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
});

//================================================================
// 5. POST /api/users/:id/approve -> (Admin) Kullanıcı kaydını onaylar.
//================================================================
router.post("/:id/approve", protect, isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.collection("users").doc(userId);

        // Kullanıcının var olup olmadığını kontrol et
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Onaylanacak kullanıcı bulunamadı." });
        }

        // Firestore'da kullanıcının statüsünü 'approved' olarak güncelle
        await userRef.update({
            status: "approved"
        });

        // Firebase Auth'da kullanıcıyı aktif hale getir (eğer 'disabled' ise)
        await auth.updateUser(userId, {
            disabled: false
        });

        res.json({ message: "Kullanıcı başarıyla onaylandı ve hesabı aktifleştirildi." });
    } catch (error: any) {
        res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
});


export default router;