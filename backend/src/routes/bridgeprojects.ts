// backend/src/routes/bridgeprojects.ts

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

// POST http://localhost:5000/api/bridgeprojects
// Bridge Project oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            created_at,
            event_date,
            location,
            number_of_participants,
            crew,
            project_impact,
            achievements
        } = req.body;

        // Zorunlu alanlar kontrolü
        if (!title || !description || !content || !created_at || !event_date) {
            return res
                .status(400)
                .json({ message: "Başlık, açıklama, içerik, oluşturma tarihi ve etkinlik tarihi zorunlu." });
        }

        let image_url = "";
        const bucket = admin.storage().bucket();

        // Image yükle
        if (req.file) {
            const fileName = `bridgeprojects/${uuidv4()}_${req.file.originalname}`;
            const file = bucket.file(fileName);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });
            await file.makePublic();
            image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }

        // Crew string array'e çevir (eğer string olarak gelirse)
        let crewArray = [];
        if (crew) {
            if (typeof crew === 'string') {
                crewArray = crew.split(',').map((member: string) => member.trim());
            } else if (Array.isArray(crew)) {
                crewArray = crew;
            }
        }

        // Achievements string array'e çevir (eğer string olarak gelirse)
        let achievementsArray = [];
        if (achievements) {
            if (typeof achievements === 'string') {
                achievementsArray = achievements.split(',').map((achievement: string) => achievement.trim());
            } else if (Array.isArray(achievements)) {
                achievementsArray = achievements;
            }
        }

        // number_of_participants'i string veya int olarak kabul et
        let participantsCount = number_of_participants;
        if (typeof number_of_participants === 'string' && !isNaN(Number(number_of_participants))) {
            participantsCount = Number(number_of_participants);
        }

        // Firestore'a bridge project kaydet
        const docRef = await db.collection("bridgeprojects").add({
            title,
            description,
            content,
            created_at,
            event_date,
            location: location || "",
            number_of_participants: participantsCount || "",
            image_url,
            crew: crewArray,
            project_impact: project_impact || "",
            achievements: achievementsArray,
        });

        res.status(201).json({ id: docRef.id, message: "Bridge Project eklendi." });
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
        const fileName = `bridgeprojects/${uuidv4()}_${req.file.originalname}`;
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

// GET http://localhost:5000/api/bridgeprojects
// Bridge Projects'leri listele (sayfalama ile - sayfa başına 6 öğe)
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 6; // Sayfa başına 6 öğe
        const offset = (page - 1) * limit;

        // Base query
        let baseQuery = db.collection("bridgeprojects").orderBy("event_date", "desc");

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
        const bridgeprojects = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({
            data: bridgeprojects,
            page,
            limit,
            hasMore: bridgeprojects.length === limit,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/bridgeprojects/{id}
// Bridge Project detayı
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("bridgeprojects").doc(req.params.id).get();
        if (!doc.exists)
            return res.status(404).json({ message: "Bridge Project bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/bridgeprojects/{id}
// Bridge Project güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Crew string array'e çevir (eğer string olarak gelirse)
        if (updateData.crew) {
            if (typeof updateData.crew === 'string') {
                updateData.crew = updateData.crew.split(',').map((member: string) => member.trim());
            }
        }

        // Achievements string array'e çevir (eğer string olarak gelirse)
        if (updateData.achievements) {
            if (typeof updateData.achievements === 'string') {
                updateData.achievements = updateData.achievements.split(',').map((achievement: string) => achievement.trim());
            }
        }

        // number_of_participants'i string veya int olarak kabul et
        if (updateData.number_of_participants) {
            if (typeof updateData.number_of_participants === 'string' && !isNaN(Number(updateData.number_of_participants))) {
                updateData.number_of_participants = Number(updateData.number_of_participants);
            }
        }

        await db.collection("bridgeprojects").doc(req.params.id).update(updateData);
        res.json({ message: "Bridge Project güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/bridgeprojects/{id}
// Bridge Project sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("bridgeprojects").doc(req.params.id).delete();
        res.json({ message: "Bridge Project silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
