import express from "express";
import axios from "axios";
import { auth } from "../firebase/firebase";

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

export default router;


