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
// src/routes/jobs.ts
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// POST http://localhost:5000/api/jobs
// İş ilanı oluştur
router.post("/", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, employer, created_at, content, link, submit_count } = req.body;
        if (!title || !employer || !created_at || !content || !link) {
            return res.status(400).json({ message: "Başlık, işveren, içerik, link ve tarih zorunlu." });
        }
        const docRef = yield firebase_1.db.collection("jobs").add({
            title,
            employer,
            created_at,
            content,
            link,
            submit_count: submit_count || 0
        });
        res.status(201).json({ id: docRef.id, message: "İş ilanı eklendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
/* İŞ OLUŞTURMA İÇİN ÖRNEK JSON
  {
    "title": "Frontend Developer",
    "employer": "ABC Teknoloji",
    "created_at": "2024-05-16T12:00:00Z", // ISO tarih formatı olmalı
    "content": "React bilen, takım çalışmasına yatkın geliştirici aranıyor.",
    "link": "https://example.com/basvuru-formu",
    "submit_count": 0 // Göndermesen de olur otomatik 0 başlar
  }
*/
// GET http://localhost:5000/api/jobs
// İş ilanlarını listele
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield firebase_1.db.collection("jobs").orderBy("created_at", "desc").get();
        const jobs = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET http://localhost:5000/api/jobs/{id}
// İş ilanı detayı
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield firebase_1.db.collection("jobs").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "İş ilanı bulunamadı." });
        res.json(Object.assign({ id: doc.id }, doc.data()));
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT http://localhost:5000/api/jobs/{id}
// İş ilanı güncelle
router.put("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("jobs").doc(req.params.id).update(req.body);
        res.json({ message: "İş ilanı güncellendi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// DELETE http://localhost:5000/api/jobs/{id}
// İş ilanı sil
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.db.collection("jobs").doc(req.params.id).delete();
        res.json({ message: "İş ilanı silindi." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST http://localhost:5000/api/jobs/{id}/submit
// İş ilanına başvuru sayısını artır 
// KULLANICI SUBMİTE BASTIĞINDA FRONTEND TARAFI SUBMİT BUTONUDA BUNA İSTEK ATMALI
router.post("/:id/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const jobRef = firebase_1.db.collection("jobs").doc(jobId);
        // İlanın var olup olmadığını kontrol et
        const doc = yield jobRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: "İş ilanı bulunamadı." });
        }
        // Firebase'in atomik artırma özelliğini kullan
        // Bu işlem, mevcut değeri okuyup 1 ekleyip yazmayı tek bir atomik işlemde yapar.
        yield jobRef.update({
            submit_count: firebase_1.admin.firestore.FieldValue.increment(1)
        });
        res.status(200).json({ message: "Başvuru sayısı başarıyla artırıldı." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
