"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/news.ts
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const multer_1 = __importDefault(require("multer"));
const firebase_2 = require("../firebase");
const uuid_1 = require("uuid");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Multer ile dosya upload ayarı (bellekte tut)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// POST http://localhost:5000/api/news
// Haber oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", authMiddleware_1.protect, authMiddleware_1.isAdmin, upload.fields([
    { name: "banner_img", maxCount: 1 },
    { name: "thumbnail_img", maxCount: 1 }
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, created_at, category } = req.body;
        // Zorunlu alanlar kontrolü
        if (!title || !content || !created_at) {
            return res.status(400).json({ message: "Başlık, içerik ve tarih zorunlu." });
        }
        // Dosya işlemleri
        let banner_img_url = "";
        let thumbnail_img_url = "";
        const bucket = firebase_2.admin.storage().bucket();
        // Banner image yükle
        if (req.files && req.files["banner_img"]) {
            const bannerFile = req.files["banner_img"][0];
            const bannerFileName = `news/${(0, uuid_1.v4)()}_${bannerFile.originalname}`;
            const bannerFileRef = bucket.file(bannerFileName);
            yield bannerFileRef.save(bannerFile.buffer, {
                metadata: { contentType: bannerFile.mimetype }
            });
            yield bannerFileRef.makePublic();
            banner_img_url = `https://storage.googleapis.com/${bucket.name}/${bannerFileName}`;
        }
        // Thumbnail image yükle
        if (req.files && req.files["thumbnail_img"]) {
            const thumbFile = req.files["thumbnail_img"][0];
            const thumbFileName = `news/${(0, uuid_1.v4)()}_${thumbFile.originalname}`;
            const thumbFileRef = bucket.file(thumbFileName);
            yield thumbFileRef.save(thumbFile.buffer, {
                metadata: { contentType: thumbFile.mimetype }
            });
            yield thumbFileRef.makePublic();
            thumbnail_img_url = `https://storage.googleapis.com/${bucket.name}/${thumbFileName}`;
        }
        // Firestore'a haber kaydet
        const docRef = yield firebase_1.db.collection("news").add({
            title,
            content,
            created_at,
            category: category || "",
            banner_img_url,
            thumbnail_img_url
        });
        res.status(201).json({ id: docRef.id, message: "Haber eklendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
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
router.post("/upload-image", authMiddleware_1.protect, authMiddleware_1.isAdmin, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Dosya bulunamadı." });
        }
        const bucket = firebase_2.admin.storage().bucket();
        const fileName = `news/${(0, uuid_1.v4)()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        // Dosyayı Storage'a yükle
        yield file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype }
        });
        // Dosya herkese açık olsun (opsiyonel, canlıda dikkatli ol!)
        yield file.makePublic();
        // Public URL oluştur
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        res.json({ url: publicUrl });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/* RESİM YÜKLEME ENDPOİNTİ

1. Önce resmi /api/news/upload-image endpointine form-data olarak gönderiyorsun (key: image).
2. Dönen URL’yi, haber oluştururken banner_img_url veya thumbnail_img_url olarak /api/news endpointine gönderiyorsun (Post Olarak).

*/
// GET http://localhost:5000/api/news
// Haberleri listele
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield firebase_1.db.collection("news").orderBy("created_at", "desc").get();
        const news = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET http://localhost:5000/api/news/{id}
// Haber detayı
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield firebase_1.db.collection("news").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "Haber bulunamadı." });
        res.json(Object.assign({ id: doc.id }, doc.data()));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT http://localhost:5000/api/news/{id}
// Haber güncelle
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("news").doc(req.params.id).update(req.body);
        res.json({ message: "Haber güncellendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// DELETE http://localhost:5000/api/news/{id}
// Haber sil
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("news").doc(req.params.id).delete();
        res.json({ message: "Haber silindi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
