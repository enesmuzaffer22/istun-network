/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: İş ilanları yönetimi
 */

// backend/src/routes/jobs.ts

import express from "express";
import { db, admin } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Yeni iş ilanı oluştur
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - employer
 *               - created_at
 *               - content
 *               - link
 *             properties:
 *               title:
 *                 type: string
 *                 description: İş ilanı başlığı
 *               employer:
 *                 type: string
 *                 description: İşveren adı
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Oluşturma tarihi
 *               content:
 *                 type: string
 *                 description: İş ilanı içeriği
 *               link:
 *                 type: string
 *                 format: uri
 *                 description: İş ilanı linki
 *     responses:
 *       201:
 *         description: İş ilanı başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Geçersiz veri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// ---- YENİ İŞ İLANI OLUŞTURMA (POST) ----
// Bu bölümü, veritabanındaki yapıya uygun hale getirdik.
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, employer, created_at, content, link } = req.body;

    if (!title || !employer || !created_at || !content || !link) {
      return res
        .status(400)
        .json({ message: "Başlık, işveren, içerik, link ve tarih zorunlu." });
    }

    const docRef = await db.collection("jobs").add({
      title,
      employer,
      created_at,
      content,
      link,
      submit_count: 0, // Başvuru sayacını varsayılan 0 olarak başlat
    });

    res
      .status(201)
      .json({ id: docRef.id, message: "İş ilanı başarıyla eklendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Tüm iş ilanlarını getir
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: İş ilanları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// ---- TÜM İŞ İLANLARINI GETİRME (GET) ----
// İş ilanlarını listele (sayfalama ile - sayfa başına 12 öğe)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12; // Sayfa başına 12 öğe
    const offset = (page - 1) * limit;

    // Base query
    let baseQuery = db.collection("jobs").orderBy("created_at", "desc");

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
    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      data: jobs,
      page,
      limit,
      hasMore: jobs.length === limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Belirli bir iş ilanını getir
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: İş ilanı ID'si
 *     responses:
 *       200:
 *         description: İş ilanı detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: İş ilanı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// ---- TEK BİR İŞ İLANI GETİRME (GET /:id) ----
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("jobs").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ message: "İş ilanı bulunamadı." });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: İş ilanını güncelle
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: İş ilanı ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               employer:
 *                 type: string
 *               content:
 *                 type: string
 *               link:
 *                 type: string
 *               created_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: İş ilanı güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Diğer rotalar (PUT, DELETE, SUBMIT) zaten doğru çalışıyor.
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.collection("jobs").doc(req.params.id).update(req.body);
    res.json({ message: "İş ilanı güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: İş ilanını sil
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: İş ilanı ID'si
 *     responses:
 *       200:
 *         description: İş ilanı silindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Yetkisiz erişim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.collection("jobs").doc(req.params.id).delete();
    res.json({ message: "İş ilanı silindi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/jobs/{id}/submit:
 *   post:
 *     summary: İş ilanına başvuru sayısını artır
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: İş ilanı ID'si
 *     responses:
 *       200:
 *         description: Başvuru sayısı başarıyla artırıldı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: İş ilanı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/submit", async (req, res) => {
  try {
    const jobRef = db.collection("jobs").doc(req.params.id);
    const doc = await jobRef.get();
    if (!doc.exists)
      return res.status(404).json({ message: "İş ilanı bulunamadı." });

    await jobRef.update({
      submit_count: admin.firestore.FieldValue.increment(1),
    });

    res.status(200).json({ message: "Başvuru sayısı başarıyla artırıldı." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
//jobs.ts
