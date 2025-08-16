/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Kullanıcı kimlik doğrulama işlemleri
 */

// src/routes/auth.ts
// Register: http://localhost:5000/api/auth/register
// Login   : http://localhost:5000/api/auth/login

import express from "express";
import { auth, db } from "../firebase/firebase.js";
import axios from "axios";
import * as dotenv from "dotenv";
import multer from "multer";
import { admin } from "../firebase/firebase.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
const router = express.Router();

// Multer ayarı
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /api/auth/upload-document:
 *   post:
 *     summary: Öğrenci belgesi yükleme
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Yüklenecek öğrenci belgesi dosyası
 *     responses:
 *       200:
 *         description: Dosya başarıyla yüklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Dosya bulunamadı
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
// Öğrenci belgesi yükleme endpointi
router.post("/upload-document", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya bulunamadı." });
    }
    const bucket = admin.storage().bucket();
    const fileName = `student_docs/${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    res.json({ url: publicUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Kullanıcı kaydı
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - email
 *               - password
 *               - tc
 *               - phone
 *               - workStatus
 *               - classStatus
 *               - consent
 *               - document
 *             properties:
 *               name:
 *                 type: string
 *                 description: Kullanıcının adı
 *               surname:
 *                 type: string
 *                 description: Kullanıcının soyadı
 *               username:
 *                 type: string
 *                 description: Benzersiz kullanıcı adı
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-posta adresi
 *               password:
 *                 type: string
 *                 description: Kullanıcı şifresi
 *               tc:
 *                 type: string
 *                 description: T.C. kimlik numarası
 *               phone:
 *                 type: string
 *                 description: Telefon numarası
 *               workStatus:
 *                 type: string
 *                 description: Çalışma durumu
 *               classStatus:
 *                 type: string
 *                 description: Sınıf durumu
 *               about:
 *                 type: string
 *                 description: Hakkında bilgisi (opsiyonel)
 *               consent:
 *                 type: boolean
 *                 description: Kullanım şartları onayı
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Öğrenci belgesi dosyası
 *     responses:
 *       201:
 *         description: Kayıt başarılı (kullanıcı pending durumunda, admin onayı bekleniyor)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kayıt başarılı! Hesabınız admin onayına gönderildi."
 *       400:
 *         description: Geçersiz veri veya kullanıcı adı zaten kullanılıyor
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
// Kayıt ol endpointi (tek adımda dosya ve diğer alanlar)
router.post("/register", upload.single("document"), async (req, res) => {
  try {
    // Diğer alanlar form-data'dan alınır
    const {
      name,
      surname,
      username,
      email,
      password,
      tc,
      phone,
      workStatus,
      classStatus,
      about,
      consent,
    } = req.body;

    // Dosya kontrolü
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Öğrenci belgesi dosyası zorunlu." });
    }

    // Zorunlu alanlar kontrolü
    if (
      !name ||
      !surname ||
      !username ||
      !email ||
      !password ||
      !tc ||
      !phone ||
      !workStatus ||
      !classStatus ||
      !consent
    ) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm zorunlu alanları doldurun." });
    }

    // Username benzersiz mi kontrol et
    const usernameSnap = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    if (!usernameSnap.empty) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
    }

    // Dosyayı Storage'a yükle
    const bucket = admin.storage().bucket();
    const fileName = `student_docs/${uuidv4()}_${req.file.originalname}`;
    const file = bucket.file(fileName);
    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });
    await file.makePublic();
    const student_doc_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Firebase Auth ile kullanıcı oluştur
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${name} ${surname}`,
    });

    // Firestore'a ek bilgi kaydet
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        name,
        surname,
        username,
        email,
        tc,
        phone,
        workStatus,
        classStatus,
        about: about || "",
        consent,
        student_doc_url,
        status: "pending", // Yeni kullanıcılar pending durumunda başlar
        createdAt: new Date(),
      });

    res.status(201).json({ message: "Kayıt başarılı! Hesabınız admin onayına gönderildi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yanlış kullanıcı adı/şifre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Hesap onaylanmamış veya reddedilmiş
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hesabınız henüz onaylanmadı. Lütfen admin onayını bekleyin."
 *       404:
 *         description: Kullanıcı bulunamadı
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
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Kullanıcı adı/e-posta ve şifre zorunludur." });
    }

    let email = identifier;
    let userDoc: any = null;

    // Eğer identifier email değilse, Firestore'dan email'i bul
    if (!identifier.includes("@")) {
      const userSnap = await db
        .collection("users")
        .where("username", "==", identifier)
        .limit(1)
        .get();
      if (userSnap.empty) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }
      userDoc = userSnap.docs[0];
      email = userDoc.data().email;
    } else {
      // Email ile giriş yapılıyorsa, Firestore'dan kullanıcıyı bul
      const userSnap = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();
      if (!userSnap.empty) {
        userDoc = userSnap.docs[0];
      }
    }

    // Kullanıcının status kontrolü
    if (userDoc) {
      const userData = userDoc.data();
      if (userData.status === "pending") {
        return res.status(403).json({
          message: "Hesabınız henüz onaylanmadı. Lütfen admin onayını bekleyin."
        });
      }
      if (userData.status === "rejected") {
        return res.status(403).json({
          message: "Hesabınız reddedildi. Lütfen yönetici ile iletişime geçin."
        });
      }
    }

    // Firebase Auth REST API ile giriş yap
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
        message = "Kullanıcı adı/e-posta veya şifre hatalı.";
      } else {
        message = error.response.data.error.message;
      }
    }
    res.status(401).json({ message });
  }
});

export default router;
