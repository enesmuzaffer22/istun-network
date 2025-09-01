// backend/src/routes/events.ts

import express from "express";
import { db } from "../firebase/firebase";
import multer from "multer";
import { admin } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Multer ile dosya upload ayarı (bellekte tut)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST http://localhost:5000/api/events
// Etkinlik oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const {
            title,
            content,
            description,
            event_date,
            created_at,
            category,
            location,
            time,
            organizer,
            registration_required,
            registration_deadline,
            tags
        } = req.body;

        // Zorunlu alanlar kontrolü
        if (!title || !content || !description || !event_date || !created_at) {
            return res
                .status(400)
                .json({ message: "Başlık, içerik, açıklama, etkinlik tarihi ve oluşturma tarihi zorunlu." });
        }

        let image_url = "";
        const bucket = admin.storage().bucket();

        // Image yükle
        if (req.file) {
            const fileName = `events/${uuidv4()}_${req.file.originalname}`;
            const file = bucket.file(fileName);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });
            await file.makePublic();
            image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        // Tags string array'e çevir (eğer string olarak gelirse)
        let tagsArray = [];
        if (tags) {
            if (typeof tags === 'string') {
                tagsArray = tags.split(',').map((tag: string) => tag.trim());
            } else if (Array.isArray(tags)) {
                tagsArray = tags;
            }
        }

        // Firestore'a etkinlik kaydet
        const docRef = await db.collection("events").add({
            title,
            content,
            description,
            event_date,
            created_at,
            category: category || "",
            location: location || "",
            time: time || "",
            image_url,
            organizer: organizer || "",
            registration_required: registration_required === true || registration_required === "true",
            registration_deadline: registration_deadline || null,
            tags: tagsArray,
        });

        res.status(201).json({ id: docRef.id, message: "Etkinlik eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Resim yükleme endpointi
router.post("/upload-image", protect, isAdmin, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Dosya bulunamadı." });
        }
        const bucket = admin.storage().bucket();
        const fileName = `events/${uuidv4()}_${req.file.originalname}`;
        const file = bucket.file(fileName);

        // Dosyayı Storage'a yükle
        await file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype },
        });

        // Dosya herkese açık olsun
        await file.makePublic();

        // Public URL oluştur
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        res.json({ url: publicUrl });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/events
// Etkinlikleri listele (sayfalama ile - sayfa başına 6 öğe)
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 6; // Sayfa başına 6 öğe
        const offset = (page - 1) * limit;

        // Base query
        let baseQuery = db.collection("events").orderBy("event_date", "desc");

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
        const events = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            data: events,
            page,
            limit,
            hasMore: events.length === limit,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/events/{id}
// Etkinlik detayı
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("events").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "Etkinlik bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/events/{id}
// Etkinlik güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Tags string array'e çevir (eğer string olarak gelirse)
        if (updateData.tags) {
            if (typeof updateData.tags === 'string') {
                updateData.tags = updateData.tags.split(',').map((tag: string) => tag.trim());
            }
        }

        // Boolean değerleri düzelt
        if (updateData.registration_required !== undefined) {
            updateData.registration_required = updateData.registration_required === true || updateData.registration_required === "true";
        }

        await db.collection("events").doc(req.params.id).update(updateData);
        res.json({ message: "Etkinlik güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/events/{id}
// Etkinlik sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("events").doc(req.params.id).delete();
        res.json({ message: "Etkinlik silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
