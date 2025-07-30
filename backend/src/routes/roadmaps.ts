// src/routes/roadmaps.ts
import express from "express";
import { db } from "../firebase/firebase";
import multer from "multer";
import { admin } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST http://localhost:5000/api/roadmaps
// Yol haritası oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { title, content, created_at } = req.body;
        if (!title || !content || !created_at) {
            return res.status(400).json({ message: "Başlık, içerik ve tarih zorunlu." });
        }

        let image_url = "";
        const bucket = admin.storage().bucket();

        if (req.file) {
            const fileName = `roadmaps/${uuidv4()}_${req.file.originalname}`;
            const file = bucket.file(fileName);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype }
            });
            await file.makePublic();
            image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        const docRef = await db.collection("roadmaps").add({
            title,
            content,
            created_at,
            image_url
        });
        res.status(201).json({ id: docRef.id, message: "Yol haritası eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

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
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("roadmaps").orderBy("created_at", "desc").get();
        const roadmaps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(roadmaps);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/roadmaps/{id}
// Yol haritası detayı
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("roadmaps").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "Yol haritası bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/roadmaps/{id}
// Yol haritası güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("roadmaps").doc(req.params.id).update(req.body);
        res.json({ message: "Yol haritası güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/roadmaps/{id}
// Yol haritası sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("roadmaps").doc(req.params.id).delete();
        res.json({ message: "Yol haritası silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 