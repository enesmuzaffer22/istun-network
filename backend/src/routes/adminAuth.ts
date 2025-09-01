import express from "express";
import axios from "axios";
import { auth, db } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";
import { sendUserApprovedEmail, sendUserRejectedEmail } from "../utils/emailService";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Admin kimlik doğrulama ve yönetimi
 */

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Admin girişi
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     localId:
 *                       type: string
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
 *       403:
 *         description: Admin olmayan kullanıcı
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
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            return res.status(400).json({ message: "Email ve şifre zorunludur." });
        }

        const apiKey = process.env.FIREBASE_WEB_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "API anahtarı eksik." });
        }

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

        const response = await axios.post(url, {
            email,
            password,
            returnSecureToken: true,
        });

        const idToken: string = response.data.idToken;

        // Token üzerinden admin claim doğrulaması
        const decoded = await auth.verifyIdToken(idToken);
        if (!decoded.admin) {
            return res.status(403).json({ message: "Admin yetkisi bulunmuyor." });
        }

        res.json({
            message: "Giriş başarılı!",
            token: response.data.idToken,
            refreshToken: response.data.refreshToken,
            user: {
                email: response.data.email,
                localId: response.data.localId,
            },
        });
    } catch (error: any) {
        let message = "Giriş başarısız.";
        if (
            error.response &&
            error.response.data &&
            error.response.data.error &&
            error.response.data.error.message
        ) {
            if (
                error.response.data.error.message === "EMAIL_NOT_FOUND" ||
                error.response.data.error.message === "INVALID_PASSWORD"
            ) {
                message = "E-posta veya şifre hatalı.";
            } else {
                message = error.response.data.error.message;
            }
        }
        res.status(401).json({ message });
    }
});

/**
 * @swagger
 * /api/admin/auth/pending-users:
 *   get:
 *     summary: Bekleyen kullanıcıları listele
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bekleyen kullanıcılar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get("/pending-users", protect, isAdmin, async (req, res) => {
    try {
        const pendingUsersSnap = await db
            .collection("users")
            .where("status", "==", "pending")
            .get();

        const users = pendingUsersSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({ users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/admin/auth/approve-user/{userId}:
 *   post:
 *     summary: Kullanıcıyı onayla
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Onaylanacak kullanıcının ID'si
 *     responses:
 *       200:
 *         description: Kullanıcı onaylandı
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post("/approve-user/:userId", protect, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcının var olup olmadığını kontrol et
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const userData = userDoc.data();

        // Status'u approved olarak güncelle
        await db.collection("users").doc(userId).update({
            status: "approved",
            approvedAt: new Date(),
            approvedBy: req.user?.uid
        });

        // Firebase Auth'da kullanıcıyı aktif hale getir
        try {
            await auth.updateUser(userId, {
                disabled: false,
            });
        } catch (authError) {
            console.error("Firebase Auth güncelleme hatası:", authError);
        }

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

        res.json({ message: "Kullanıcı başarıyla onaylandı ve email gönderildi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/admin/auth/reject-user/{userId}:
 *   post:
 *     summary: Kullanıcıyı reddet
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reddedilecek kullanıcının ID'si
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Red nedeni
 *     responses:
 *       200:
 *         description: Kullanıcı reddedildi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post("/reject-user/:userId", protect, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        // Kullanıcının var olup olmadığını kontrol et
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const userData = userDoc.data();

        // Status'u rejected olarak güncelle
        await db.collection("users").doc(userId).update({
            status: "rejected",
            rejectedAt: new Date(),
            rejectedBy: req.user?.uid,
            rejectionReason: reason || "Belirtilmemiş"
        });

        // Firebase Auth'da kullanıcıyı devre dışı bırak
        try {
            await auth.updateUser(userId, {
                disabled: true,
            });
        } catch (authError) {
            console.error("Firebase Auth güncelleme hatası:", authError);
        }

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

        res.json({ message: "Kullanıcı başarıyla reddedildi ve email gönderildi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


