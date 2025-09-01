// backend/src/routes/bridgeprojectsimpact.ts

import express from "express";
import { db } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// GET http://localhost:5000/api/bridgeprojectsimpact
// Bridge Projects Impact verilerini getir (tek kayıt)
router.get("/", async (req, res) => {
    try {
        // Impact verileri genelde tek bir dokümanda tutulur
        const snapshot = await db.collection("bridgeprojectsimpact").limit(1).get();

        if (snapshot.empty) {
            // Eğer hiç kayıt yoksa default değerlerle döndür
            return res.json({
                volunteer_student: 0,
                donated_institution: 0,
                active_project: 0,
                volunteer_hour: 0
            });
        }

        const doc = snapshot.docs[0];
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// POST http://localhost:5000/api/bridgeprojectsimpact
// Bridge Projects Impact verilerini oluştur (ilk kez)
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const {
            volunteer_student,
            donated_institution,
            active_project,
            volunteer_hour
        } = req.body;

        // Zorunlu alanlar kontrolü
        if (
            volunteer_student === undefined ||
            donated_institution === undefined ||
            active_project === undefined ||
            volunteer_hour === undefined
        ) {
            return res
                .status(400)
                .json({ message: "Tüm impact verileri zorunlu." });
        }

        // Sayı kontrolü
        const volunteerStudent = parseInt(volunteer_student);
        const donatedInstitution = parseInt(donated_institution);
        const activeProject = parseInt(active_project);
        const volunteerHour = parseInt(volunteer_hour);

        if (
            isNaN(volunteerStudent) ||
            isNaN(donatedInstitution) ||
            isNaN(activeProject) ||
            isNaN(volunteerHour)
        ) {
            return res
                .status(400)
                .json({ message: "Tüm değerler sayı olmalıdır." });
        }

        // Mevcut kayıt var mı kontrol et
        const existingSnapshot = await db.collection("bridgeprojectsimpact").limit(1).get();

        if (!existingSnapshot.empty) {
            return res
                .status(400)
                .json({ message: "Impact verileri zaten mevcut. Güncellemek için PUT kullanın." });
        }

        // Firestore'a impact verilerini kaydet
        const docRef = await db.collection("bridgeprojectsimpact").add({
            volunteer_student: volunteerStudent,
            donated_institution: donatedInstitution,
            active_project: activeProject,
            volunteer_hour: volunteerHour,
            updated_at: new Date()
        });

        res.status(201).json({ id: docRef.id, message: "Bridge Projects Impact verileri eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/bridgeprojectsimpact
// Bridge Projects Impact verilerini güncelle
router.put("/", protect, isAdmin, async (req, res) => {
    try {
        const {
            volunteer_student,
            donated_institution,
            active_project,
            volunteer_hour
        } = req.body;

        // En az bir alan güncellenmeli
        if (
            volunteer_student === undefined &&
            donated_institution === undefined &&
            active_project === undefined &&
            volunteer_hour === undefined
        ) {
            return res
                .status(400)
                .json({ message: "Güncellenecek en az bir alan gönderilmelidir." });
        }

        // Mevcut kaydı bul
        const snapshot = await db.collection("bridgeprojectsimpact").limit(1).get();

        if (snapshot.empty) {
            return res
                .status(404)
                .json({ message: "Impact verileri bulunamadı. Önce POST ile oluşturun." });
        }

        const doc = snapshot.docs[0];
        const updateData: { [key: string]: any } = { updated_at: new Date() };

        // Gönderilen alanları güncelle
        if (volunteer_student !== undefined) {
            const volunteerStudent = parseInt(volunteer_student);
            if (isNaN(volunteerStudent)) {
                return res.status(400).json({ message: "volunteer_student sayı olmalıdır." });
            }
            updateData.volunteer_student = volunteerStudent;
        }

        if (donated_institution !== undefined) {
            const donatedInstitution = parseInt(donated_institution);
            if (isNaN(donatedInstitution)) {
                return res.status(400).json({ message: "donated_institution sayı olmalıdır." });
            }
            updateData.donated_institution = donatedInstitution;
        }

        if (active_project !== undefined) {
            const activeProject = parseInt(active_project);
            if (isNaN(activeProject)) {
                return res.status(400).json({ message: "active_project sayı olmalıdır." });
            }
            updateData.active_project = activeProject;
        }

        if (volunteer_hour !== undefined) {
            const volunteerHour = parseInt(volunteer_hour);
            if (isNaN(volunteerHour)) {
                return res.status(400).json({ message: "volunteer_hour sayı olmalıdır." });
            }
            updateData.volunteer_hour = volunteerHour;
        }

        // Güncelle
        await db.collection("bridgeprojectsimpact").doc(doc.id).update(updateData);

        res.json({ message: "Bridge Projects Impact verileri güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/bridgeprojectsimpact
// Bridge Projects Impact verilerini sil (opsiyonel)
router.delete("/", protect, isAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection("bridgeprojectsimpact").limit(1).get();

        if (snapshot.empty) {
            return res
                .status(404)
                .json({ message: "Impact verileri bulunamadı." });
        }

        const doc = snapshot.docs[0];
        await db.collection("bridgeprojectsimpact").doc(doc.id).delete();

        res.json({ message: "Bridge Projects Impact verileri silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
