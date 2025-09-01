// backend/src/routes/announcements.ts

import express from "express";
import { db } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// POST http://localhost:5000/api/announcements
// Duyuru oluştur
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const { title, content, created_at, category } = req.body;

        // Zorunlu alanlar kontrolü
        if (!title || !content || !created_at) {
            return res
                .status(400)
                .json({ message: "Başlık, içerik ve tarih zorunlu." });
        }

        // Firestore'a duyuru kaydet
        const docRef = await db.collection("announcements").add({
            title,
            content,
            created_at,
            category: category || "",
        });

        res.status(201).json({ id: docRef.id, message: "Duyuru eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/announcements
// Duyuruları listele (sayfalama ile - sayfa başına 9 öğe)
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 9; // Sayfa başına 9 öğe
        const offset = (page - 1) * limit;

        // Base query
        let baseQuery = db.collection("announcements").orderBy("created_at", "desc");

        let query = baseQuery.limit(limit);

        if (offset > 0) {
            // Offset için startAfter kullan
            const snapshot = await baseQuery.limit(offset).get();

            if (!snapshot.empty) {
                const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                query = baseQuery.startAfter(lastDoc).limit(limit);
            }
        }

        const snapshot = await query.get();
        const announcements = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            data: announcements,
            page,
            limit,
            hasMore: announcements.length === limit,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/announcements/{id}
// Duyuru detayı (Tek duyuru, id'ye göre)
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("announcements").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "Duyuru bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/announcements/{id}
// Duyuru güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("announcements").doc(req.params.id).update(req.body);
        res.json({ message: "Duyuru güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/announcements/{id}
// Duyuru sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("announcements").doc(req.params.id).delete();
        res.json({ message: "Duyuru silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
