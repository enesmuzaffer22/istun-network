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
// src/routes/roadmaps.ts
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const multer_1 = __importDefault(require("multer"));
const firebase_2 = require("../firebase");
const uuid_1 = require("uuid");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// POST http://localhost:5000/api/roadmaps
// Yol haritası oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", authMiddleware_1.protect, authMiddleware_1.isAdmin, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, created_at } = req.body;
        if (!title || !content || !created_at) {
            return res.status(400).json({ message: "Başlık, içerik ve tarih zorunlu." });
        }
        let image_url = "";
        const bucket = firebase_2.admin.storage().bucket();
        if (req.file) {
            const fileName = `roadmaps/${(0, uuid_1.v4)()}_${req.file.originalname}`;
            const file = bucket.file(fileName);
            yield file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype }
            });
            yield file.makePublic();
            image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }
        const docRef = yield firebase_1.db.collection("roadmaps").add({
            title,
            content,
            created_at,
            image_url
        });
        res.status(201).json({ id: docRef.id, message: "Yol haritası eklendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/* ROADMAP OLUŞTURMAK İÇİN ÖRNEK JSON

  {
    "title": "Yazılımda Kariyer Yol Haritası",
    "content": "Frontend, backend, mobil ve daha fazlası için adım adım rehber.",
    "created_at": "2024-05-16T12:00:00Z", // ISO tarih formatında olmalı.
    "image_url": "https://example.com/roadmap.jpg" // göndermesen de olur, otomatik boş string olur
  }
    
  */
// GET http://localhost:5000/api/roadmaps
// Yol haritalarını listele
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield firebase_1.db.collection("roadmaps").orderBy("created_at", "desc").get();
        const roadmaps = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json(roadmaps);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET http://localhost:5000/api/roadmaps/{id}
// Yol haritası detayı
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield firebase_1.db.collection("roadmaps").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "Yol haritası bulunamadı." });
        res.json(Object.assign({ id: doc.id }, doc.data()));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT http://localhost:5000/api/roadmaps/{id}
// Yol haritası güncelle
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("roadmaps").doc(req.params.id).update(req.body);
        res.json({ message: "Yol haritası güncellendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// DELETE http://localhost:5000/api/roadmaps/{id}
// Yol haritası sil
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("roadmaps").doc(req.params.id).delete();
        res.json({ message: "Yol haritası silindi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
