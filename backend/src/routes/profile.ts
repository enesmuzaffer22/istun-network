/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Kullanıcı profili yönetimi
 */

// src/routes/profile.ts

import express from "express";
import { db, auth, admin } from "../firebase/firebase";
import { protect, isAdmin, isSuperAdmin } from "../middleware/authMiddleware";
import { cache } from "../utils/cache";
import { sendUserApprovedEmail, sendUserRejectedEmail } from "../utils/emailService";

const router = express.Router();

// Cache middleware (sensitive data için daha kısa TTL)
const cacheMiddleware = (key: string, ttl: number = 180) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const cacheKey = `${key}_${JSON.stringify(req.query)}_${req.params.id || req.params.username || ""
      }_${req.user?.uid || ""}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Cache'e kaydetmek için response'u override et
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      cache.set(cacheKey, data, ttl);
      return originalJson(data);
    };

    next();
  };
};

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Kendi profilimi getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Kullanıcı profili bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//================================================================
// 1. GET /api/users/me -> Giriş yapmış kullanıcının kendi profilini getirir.
//================================================================
router.get(
  "/me",
  protect,
  cacheMiddleware("user_me", 120),
  async (req, res) => {
    try {
      // 'protect' middleware'i sayesinde req.user'ın varlığından ve
      // içinde uid olduğundan eminiz.
      const userDoc = await db.collection("users").doc(req.user!.uid).get();

      if (!userDoc.exists) {
        return res
          .status(404)
          .json({ message: "Kullanıcı profili bulunamadı." });
      }

      // Başarılı durumda kullanıcı verisini döndür.
      res.json({ id: userDoc.id, ...userDoc.data() });
    } catch (error: any) {
      res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
  }
);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Kendi profilimi güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Profil başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
      return res
        .status(400)
        .json({ message: "Güncellenecek en az bir alan gönderilmelidir." });
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

    // Cache'i temizle - kullanıcının kendi profili güncellendiği için
    // Birden fazla varyasyon (farklı query parametreleri) olabileceğinden tüm ilgili anahtarları temizle
    const keys = cache.getAllKeys();
    for (const k of keys) {
      if (k.startsWith("user_me_") && k.endsWith(`_${userId}`)) {
        cache.delete(k);
      }
    }

    // Ayrıca public profile cache'ini de temizle (eğer username değişmediyse)
    const userDocAfterUpdate = await db.collection("users").doc(userId).get();
    const updatedUserData = userDocAfterUpdate.data();
    if (updatedUserData?.username) {
      const keys2 = cache.getAllKeys();
      for (const k of keys2) {
        if (k.startsWith("user_public_") && k.includes(`_${updatedUserData.username}_`)) {
          cache.delete(k);
        }
      }
    }

    res.json({ message: "Profil başarıyla güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Sayfa başına öğe sayısı
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Kullanıcı durum filtresi
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersList'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//================================================================
// 3. GET /api/users -> (Admin) Tüm kullanıcıları listeler.
//================================================================
router.get(
  "/",
  protect,
  isSuperAdmin,
  cacheMiddleware("users_list", 240),
  async (req, res) => {
    try {
      // Sayfalama için limit ve status filtreleme
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Max 50 item
      const page = parseInt(req.query.page as string) || 1;
      const status = req.query.status as string; // pending, approved vb.
      const offset = (page - 1) * limit;

      // Base query
      let baseQuery = db.collection("users").orderBy("createdAt", "desc");

      // Status filtresi varsa ekle
      if (status) {
        baseQuery = baseQuery.where("status", "==", status);
      }

      let query = baseQuery.limit(limit);

      if (offset > 0) {
        // Offset için startAfter kullan (daha efficient)
        const snapshot = await baseQuery.limit(offset).get();

        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          query = baseQuery.startAfter(lastDoc).limit(limit);
        }
      }

      const snapshot = await query.get();
      const users = snapshot.docs.map((doc: any) => {
        // Admin paneline gönderirken hassas verileri (örn: TC) çıkarabiliriz.
        const { tc, ...userData } = doc.data();
        return { id: doc.id, ...userData };
      });

      res.json({
        data: users,
        page,
        limit,
        hasMore: users.length === limit,
        status: status || "all",
      });
    } catch (error: any) {
      res.status(500).json({ message: "Sunucu hatası: " + error.message });
    }
  }
);

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Kullanıcının herkese açık profilini getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı adı
 *     responses:
 *       200:
 *         description: Herkese açık profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicProfile'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Kullanıcı bulunamadı veya profile erişim izni yok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//================================================================
// 4. GET /api/users/:username -> Herkese açık profili getirir.
//================================================================
router.get(
  "/:username",
  protect,
  cacheMiddleware("user_public", 300),
  async (req, res) => {
    try {
      const username = req.params.username;

      // Optimized query - sadece gerekli kontroller
      const userSnap = await db
        .collection("users")
        .where("username", "==", username)
        .where("status", "==", "approved") // Sadece onaylanmış kullanıcıları getir
        .limit(1)
        .get();

      if (userSnap.empty) {
        return res
          .status(404)
          .json({
            message: "Kullanıcı bulunamadı veya profile erişim izni yok.",
          });
      }

      const userData = userSnap.docs[0].data();

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
  }
);

/**
 * @swagger
 * /api/users/{id}/approve:
 *   post:
 *     summary: Kullanıcı kaydını onayla (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID'si
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla onaylanıp aktifleştirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Onaylanacak kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//================================================================
// 5. POST /api/users/:id/approve -> (Admin) Kullanıcı kaydını onaylar.
//================================================================
router.post("/:id/approve", protect, isSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection("users").doc(userId);

    // Kullanıcının var olup olmadığını kontrol et
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "Onaylanacak kullanıcı bulunamadı." });
    }

    const userData = userDoc.data();

    // Firestore'da kullanıcının statüsünü 'approved' olarak güncelle
    await userRef.update({
      status: "approved",
      approvedAt: new Date(),
      approvedBy: req.user?.uid
    });

    // Firebase Auth'da kullanıcıyı aktif hale getir (eğer 'disabled' ise)
    await auth.updateUser(userId, {
      disabled: false,
    });

    // Cache'i temizle - kullanıcı listesi değişti
    // Tüm users_list cache'lerini temizle (farklı query parametreleri için)
    cache.clear(); // Geçici çözüm - tüm cache'i temizle

    // Kullanıcıya onay emaili gönder
    try {
      await sendUserApprovedEmail(
        userData?.email || "",
        userData?.name || "Kullanıcı",
        userData?.surname || ""
      );
      console.log(`Onay emaili gönderildi: ${userData?.email}`);
    } catch (emailError) {
      console.error("Email gönderim hatası:", emailError);
      // Email hatası ana işlemi durdurmasın
    }

    res.json({
      message: "Kullanıcı başarıyla onaylandı, hesabı aktifleştirildi ve email gönderildi.",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

/**
 * @swagger
 * /api/users/{id}/reject:
 *   post:
 *     summary: Kullanıcı kaydını reddet (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcı ID'si
 *     responses:
 *       200:
 *         description: Kullanıcı kaydı reddedildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reddedilecek kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//================================================================
// 6. POST /api/users/:id/reject -> (Admin) Kullanıcı kaydını reddeder.
//================================================================
router.post("/:id/reject", protect, isSuperAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection("users").doc(userId);

    const { reason } = req.body;

    // Kullanıcının var olup olmadığını kontrol et
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "Reddedilecek kullanıcı bulunamadı." });
    }

    const userData = userDoc.data();

    // Firestore'da kullanıcının statüsünü 'rejected' olarak güncelle
    await userRef.update({
      status: "rejected",
      rejectedAt: new Date(),
      rejectedBy: req.user?.uid,
      rejectionReason: reason || "Belirtilmemiş"
    });

    // Firebase Auth'da kullanıcıyı devre dışı bırak
    await auth.updateUser(userId, {
      disabled: true,
    });

    // Cache'i temizle - kullanıcı listesi değişti
    // Tüm users_list cache'lerini temizle (farklı query parametreleri için)
    cache.clear(); // Geçici çözüm - tüm cache'i temizle

    // Kullanıcıya red emaili gönder
    try {
      await sendUserRejectedEmail(
        userData?.email || "",
        userData?.name || "Kullanıcı",
        userData?.surname || "",
        reason
      );
      console.log(`Red emaili gönderildi: ${userData?.email}`);
    } catch (emailError) {
      console.error("Email gönderim hatası:", emailError);
      // Email hatası ana işlemi durdurmasın
    }

    res.json({ message: "Kullanıcı kaydı reddedildi ve email gönderildi." });
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

export default router;
