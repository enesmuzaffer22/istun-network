// src/routes/auth.ts
// Register: http://localhost:5000/api/auth/register
// Login   : http://localhost:5000/api/auth/login

import express from "express";
import { auth, db } from "../firebase";
import axios from "axios";
import * as dotenv from "dotenv";
import multer from "multer";
import { admin } from "../firebase";
import { v4 as uuidv4 } from "uuid";
dotenv.config();
const router = express.Router();

// Multer ayarı
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
            metadata: { contentType: req.file.mimetype }
        });

        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        res.json({ url: publicUrl });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

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
            consent
        } = req.body;

        // Dosya kontrolü
        if (!req.file) {
            return res.status(400).json({ message: "Öğrenci belgesi dosyası zorunlu." });
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
            return res.status(400).json({ message: "Lütfen tüm zorunlu alanları doldurun." });
        }

        // Username benzersiz mi kontrol et
        const usernameSnap = await db.collection("users").where("username", "==", username).limit(1).get();
        if (!usernameSnap.empty) {
            return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
        }

        // Dosyayı Storage'a yükle
        const bucket = admin.storage().bucket();
        const fileName = `student_docs/${uuidv4()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype }
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
        await db.collection("users").doc(userRecord.uid).set({
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
            createdAt: new Date(),
        });

        res.status(201).json({ message: "Kayıt başarılı!" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Kullanıcı adı/e-posta ve şifre zorunludur." });
        }

        let email = identifier;

        // Eğer identifier email değilse, Firestore'dan email'i bul
        if (!identifier.includes("@")) {
            const userSnap = await db.collection("users").where("username", "==", identifier).limit(1).get();
            if (userSnap.empty) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı." });
            }
            email = userSnap.docs[0].data().email;
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
            returnSecureToken: true
        });

        res.json({
            message: "Giriş başarılı!",
            token: response.data.idToken,
            refreshToken: response.data.refreshToken,
            user: {
                email: response.data.email,
                localId: response.data.localId
            }
        });
    } catch (error: any) {
        let message = "Giriş başarısız.";
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            if (error.response.data.error.message === "EMAIL_NOT_FOUND" || error.response.data.error.message === "INVALID_PASSWORD") {
                message = "Kullanıcı adı/e-posta veya şifre hatalı.";
            } else {
                message = error.response.data.error.message;
            }
        }
        res.status(401).json({ message });
    }
});

export default router;