// backend/src/routes/jobs.ts

import express from 'express';
import { db, admin } from '../firebase/firebase.js'; 
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ---- YENİ İŞ İLANI OLUŞTURMA (POST) ----
// Bu bölümü, veritabanındaki yapıya uygun hale getirdik.
router.post("/", protect, isAdmin, async (req, res) => {
    try {
        const { title, employer, created_at, content, link } = req.body;

        if (!title || !employer || !created_at || !content || !link) {
            return res.status(400).json({ message: "Başlık, işveren, içerik, link ve tarih zorunlu." });
        }

        const docRef = await db.collection("jobs").add({
            title,
            employer,
            created_at,
            content,
            link,
            submit_count: 0 // Başvuru sayacını varsayılan 0 olarak başlat
        });

        res.status(201).json({ id: docRef.id, message: "İş ilanı başarıyla eklendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


// ---- TÜM İŞ İLANLARINI GETİRME (GET) ----
// Bu rota veritabanından ne geliyorsa onu gönderir, bu yüzden zaten doğru çalışıyordu.
router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("jobs").orderBy("created_at", "desc").get();
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(jobs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


// ---- TEK BİR İŞ İLANI GETİRME (GET /:id) ----
router.get("/:id", async (req, res) => {
    try {
        const doc = await db.collection("jobs").doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ message: "İş ilanı bulunamadı." });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


// Diğer rotalar (PUT, DELETE, SUBMIT) zaten doğru çalışıyor.
router.put("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("jobs").doc(req.params.id).update(req.body);
        res.json({ message: "İş ilanı güncellendi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, isAdmin, async (req, res) => {
    try {
        await db.collection("jobs").doc(req.params.id).delete();
        res.json({ message: "İş ilanı silindi." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/submit", async (req, res) => {
    try {
        const jobRef = db.collection("jobs").doc(req.params.id);
        const doc = await jobRef.get();
        if (!doc.exists) return res.status(404).json({ message: "İş ilanı bulunamadı." });

        await jobRef.update({
            submit_count: admin.firestore.FieldValue.increment(1)
        });

        res.status(200).json({ message: "Başvuru sayısı başarıyla artırıldı." });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


export default router;
//jobs.ts