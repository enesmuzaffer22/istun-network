// src/routes/news.ts
import express from "express";
import { db } from "../firebase/firebase.js";
import multer from "multer";
import { admin } from "../firebase/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer ile dosya upload ayarı (bellekte tut)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST http://localhost:5000/api/news
// Haber oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isAdmin, upload.fields([
    { name: "banner_img", maxCount: 1 },
    { name: "thumbnail_img", maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, content, created_at, category } = req.body;

        // Zorunlu alanlar kontrolü
        if (!title || !content || !created_at) {
            return res.status(400).json({ message: "Başlık, içerik ve tarih zorunlu." });
        }

        // Dosya işlemleri
        let banner_img_url = "";
        let thumbnail_img_url = "";
        const bucket = admin.storage().bucket();

        // Banner image yükle
        if (req.files && (req.files as any)["banner_img"]) {
            const bannerFile = (req.files as any)["banner_img"][0];
            const bannerFileName = `news/${uuidv4()}_${bannerFile.originalname}`;
            const bannerFileRef = bucket.file(bannerFileName);
            await bannerFileRef.save(bannerFile.buffer, {
                metadata: { contentType: bannerFile.mimetype }
            });
            await bannerFileRef.makePublic();
            banner_img_url = `https://storage.googleapis.com/${bucket.name}/${bannerFileName}`;
        }

        // Thumbnail image yükle
        if (req.files && (req.files as any)["thumbnail_img"]) {
            const thumbFile = (req.files as any)["thumbnail_img"][0];
            const thumbFileName = `news/${uuidv4()}_${thumbFile.originalname}`;
            const thumbFileRef = bucket.file(thumbFileName);
            await thumbFileRef.save(thumbFile.buffer, {
                metadata: { contentType: thumbFile.mimetype }
            });
            await thumbFileRef.makePublic();
            thumbnail_img_url = `https://storage.googleapis.com/${bucket.name}/${thumbFileName}`;
        }

        // Firestore'a haber kaydet
        const docRef = await db.collection("news").add({
            title,
            content,
            created_at,
            category: category || "",
            banner_img_url,
            thumbnail_img_url
        });

        res.status(201).json({ id: docRef.id, message: "Haber eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/* HABER OLUŞTURMA İÇİN ÖRNEK JSON
{
    "title": "Mezunlar Buluşması 2024",
    "content": "Tüm mezunlarımızı 2024 buluşmasına bekliyoruz! **Detaylar için tıklayın.**",
    "created_at": "2024-05-16T12:00:00Z", // ISO tarih formatı olmalı
    "category": "etkinlik",
    "banner_img_url": "https://example.com/banner.jpg",
    "thumbnail_img_url": "https://example.com/thumb.jpg"
  }

*/



// Resim yükleme endpointi
router.post("/upload-image", protect, isAdmin, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Dosya bulunamadı." });
        }
        const bucket = admin.storage().bucket();
        const fileName = `news/${uuidv4()}_${req.file.originalname}`;
        const file = bucket.file(fileName);

        // Dosyayı Storage'a yükle
        await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype }
        });

        // Dosya herkese açık olsun (opsiyonel, canlıda dikkatli ol!)
        await file.makePublic();

        // Public URL oluştur
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        res.json({ url: publicUrl });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

/* RESİM YÜKLEME ENDPOİNTİ 

1. Önce resmi /api/news/upload-image endpointine form-data olarak gönderiyorsun (key: image).
2. Dönen URL’yi, haber oluştururken banner_img_url veya thumbnail_img_url olarak /api/news endpointine gönderiyorsun (Post Olarak).

*/


// GET http://localhost:5000/api/news
// Haberleri listele
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("news").orderBy("created_at", "desc").get();
        const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(news);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/news/{id}
// Haber detayı
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("news").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Haber bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/news/{id}
// Haber güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("news").doc(req.params.id).update(req.body);
        res.json({ message: "Haber güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/news/{id}
// Haber sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("news").doc(req.params.id).delete();
        res.json({ message: "Haber silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 