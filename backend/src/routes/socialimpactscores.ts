// backend/src/routes/socialimpactscores.ts

import express from "express";
import { db } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// GET http://localhost:5000/api/socialimpactscores
// Social Impact Scores verilerini getir (tek kayıt)
router.get("/", async (req, res) => {
    try {
        // Impact verileri genelde tek bir dokümanda tutulur
        const snapshot = await db.collection("socialimpactscores").limit(1).get();

        if (snapshot.empty) {
            // Eğer hiç kayıt yoksa default değerlerle döndür
            return res.json({
                social_impact_score: "0",
                number_of_people_reached: "0",
                social_projects: "0",
                awards: "0"
            });
        }

        const doc = snapshot.docs[0];
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// POST http://localhost:5000/api/socialimpactscores
// Social Impact Scores verilerini oluştur (ilk kez)
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const {
            social_impact_score,
            number_of_people_reached,
            social_projects,
            awards
        } = req.body;

        // Zorunlu alanlar kontrolü
        if (
            social_impact_score === undefined ||
            number_of_people_reached === undefined ||
            social_projects === undefined ||
            awards === undefined
        ) {
            return res
                .status(400)
                .json({ message: "Tüm social impact verileri zorunlu." });
        }

        // Mevcut kayıt var mı kontrol et
        const existingSnapshot = await db.collection("socialimpactscores").limit(1).get();

        if (!existingSnapshot.empty) {
            return res
                .status(400)
                .json({ message: "Social Impact Scores verileri zaten mevcut. Güncellemek için PUT kullanın." });
        }

        // Firestore'a social impact verilerini kaydet
        const docRef = await db.collection("socialimpactscores").add({
            social_impact_score,
            number_of_people_reached,
            social_projects,
            awards,
            updated_at: new Date()
        });

        res.status(201).json({ id: docRef.id, message: "Social Impact Scores verileri eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/socialimpactscores
// Social Impact Scores verilerini güncelle
router.put("/", protect, isAdmin, async (req, res) => {
    try {
        const {
            social_impact_score,
            number_of_people_reached,
            social_projects,
            awards
        } = req.body;

        // En az bir alan güncellenmeli
        if (
            social_impact_score === undefined &&
            number_of_people_reached === undefined &&
            social_projects === undefined &&
            awards === undefined
        ) {
            return res
                .status(400)
                .json({ message: "Güncellenecek en az bir alan gönderilmelidir." });
        }

        // Mevcut kaydı bul
        const snapshot = await db.collection("socialimpactscores").limit(1).get();

        if (snapshot.empty) {
            return res
                .status(404)
                .json({ message: "Social Impact Scores verileri bulunamadı. Önce POST ile oluşturun." });
        }

        const doc = snapshot.docs[0];
        const updateData: { [key: string]: any } = { updated_at: new Date() };

        // Gönderilen alanları güncelle
        if (social_impact_score !== undefined) {
            updateData.social_impact_score = social_impact_score;
        }

        if (number_of_people_reached !== undefined) {
            updateData.number_of_people_reached = number_of_people_reached;
        }

        if (social_projects !== undefined) {
            updateData.social_projects = social_projects;
        }

        if (awards !== undefined) {
            updateData.awards = awards;
        }

        // Güncelle
        await db.collection("socialimpactscores").doc(doc.id).update(updateData);

        res.json({ message: "Social Impact Scores verileri güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/socialimpactscores
// Social Impact Scores verilerini sil (opsiyonel)
router.delete("/", protect, isAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection("socialimpactscores").limit(1).get();

        if (snapshot.empty) {
            return res
                .status(404)
                .json({ message: "Social Impact Scores verileri bulunamadı." });
        }

        const doc = snapshot.docs[0];
        await db.collection("socialimpactscores").doc(doc.id).delete();

        res.json({ message: "Social Impact Scores verileri silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
