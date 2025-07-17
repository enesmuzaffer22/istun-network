// src/routes/jobs.ts
import express from "express";
import { db, admin } from "../firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";


const router = express.Router();

// POST http://localhost:5000/api/jobs
// İş ilanı oluştur
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const { title, employer, created_at, content, link, submit_count } = req.body;
        if (!title || !employer || !created_at || !content || !link) {
            return res.status(400).json({ message: "Başlık, işveren, içerik, link ve tarih zorunlu." });
        }
        const docRef = await db.collection("jobs").add({
            title,
            employer,
            created_at,
            content,
            link,
            submit_count: submit_count || 0
        });
        res.status(201).json({ id: docRef.id, message: "İş ilanı eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});
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
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("jobs").orderBy("created_at", "desc").get();
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(jobs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET http://localhost:5000/api/jobs/{id}
// İş ilanı detayı
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("jobs").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "İş ilanı bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// PUT http://localhost:5000/api/jobs/{id}
// İş ilanı güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("jobs").doc(req.params.id).update(req.body);
        res.json({ message: "İş ilanı güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE http://localhost:5000/api/jobs/{id}
// İş ilanı sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("jobs").doc(req.params.id).delete();
        res.json({ message: "İş ilanı silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


// POST http://localhost:5000/api/jobs/{id}/submit
// İş ilanına başvuru sayısını artır 
// KULLANICI SUBMİTE BASTIĞINDA FRONTEND TARAFI SUBMİT BUTONUDA BUNA İSTEK ATMALI
router.post("/:id/submit", async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobRef = db.collection("jobs").doc(jobId);

        // İlanın var olup olmadığını kontrol et
        const doc = await jobRef.get();
        if (!doc.exists) {
            return res.status(404).json({ message: "İş ilanı bulunamadı." });
        }

        // Firebase'in atomik artırma özelliğini kullan
        // Bu işlem, mevcut değeri okuyup 1 ekleyip yazmayı tek bir atomik işlemde yapar.
        await jobRef.update({
            submit_count: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({ message: "Başvuru sayısı başarıyla artırıldı." });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 