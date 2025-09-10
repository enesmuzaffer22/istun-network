import express from "express";
import { db } from "../firebase/firebase";
import { protect, isSuperAdmin } from "../middleware/authMiddleware";
import {
  setAdminRole,
  removeAdminRole,
  getAdminRole,
} from "../utils/adminUtils";

const router = express.Router();

/**
 * @swagger
 * /api/admin/management/set-role:
 *   post:
 *     summary: Kullanıcıya admin rolü atar (Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRole'
 *     responses:
 *       200:
 *         description: Admin rolü başarıyla atandı
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Kullanıcı bulunamadı
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.post("/set-role", protect, isSuperAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email ve rol zorunludur." });
    }

    if (!["super_admin", "content_admin"].includes(role)) {
      return res.status(400).json({
        message: "Geçersiz rol. 'super_admin' veya 'content_admin' olmalıdır.",
      });
    }

    // Kullanıcıyı email ile bul
    const userSnap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const userDoc = userSnap.docs[0];
    const userId = userDoc.id;

    // Admin rolünü ata
    const success = await setAdminRole(userId, role);

    if (success) {
      // Firestore'da da admin bilgisini güncelle
      await db.collection("users").doc(userId).update({
        adminRole: role,
        isAdmin: true,
      });

      res.json({
        message: `Admin rolü başarıyla atandı: ${email} -> ${role}`,
        userId,
        role,
      });
    } else {
      res.status(500).json({ message: "Admin rolü atanırken hata oluştu." });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

/**
 * @swagger
 * /api/admin/management/remove-role:
 *   post:
 *     summary: Kullanıcının admin rolünü kaldırır (Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Kullanıcının email adresi
 *     responses:
 *       200:
 *         description: Admin rolü başarıyla kaldırıldı
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Kullanıcı bulunamadı
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.post("/remove-role", protect, isSuperAdmin, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email zorunludur." });
    }

    // Kullanıcıyı email ile bul
    const userSnap = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const userDoc = userSnap.docs[0];
    const userId = userDoc.id;

    // Admin rolünü kaldır
    const success = await removeAdminRole(userId);

    if (success) {
      // Firestore'da da admin bilgisini güncelle
      await db.collection("users").doc(userId).update({
        adminRole: null,
        isAdmin: false,
      });

      res.json({
        message: `Admin rolü başarıyla kaldırıldı: ${email}`,
        userId,
      });
    } else {
      res
        .status(500)
        .json({ message: "Admin rolü kaldırılırken hata oluştu." });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

/**
 * @swagger
 * /api/admin/management/list-admins:
 *   get:
 *     summary: Tüm adminleri listeler (Super Admin)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin listesi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminList'
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get("/list-admins", protect, isSuperAdmin, async (req, res) => {
  try {
    // Admin olan kullanıcıları getir
    const adminsSnap = await db
      .collection("users")
      .where("isAdmin", "==", true)
      .get();

    const admins = adminsSnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      surname: doc.data().surname,
      email: doc.data().email,
      adminRole: doc.data().adminRole,
      createdAt: doc.data().createdAt,
    }));

    res.json({ admins });
  } catch (error: any) {
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
});

export default router;
