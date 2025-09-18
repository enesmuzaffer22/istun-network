/**
 * @swagger
 * tags:
 *   name: Roadmaps
 *   description: Yol haritaları yönetimi
 */

// src/routes/roadmaps.ts
import express from "express";
import { db } from "../firebase/firebase";
import multer from "multer";
import { admin } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { protect, isAdmin, isContentAdmin } from "../middleware/authMiddleware";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /api/roadmaps:
 *   post:
 *     summary: Yeni yol haritası oluştur
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - created_at
 *             properties:
 *               title:
 *                 type: string
 *                 description: Yol haritası başlığı
 *               content:
 *                 type: string
 *                 description: Yol haritası içeriği
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Oluşturma tarihi
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Yol haritası resmi (opsiyonel)
 *     responses:
 *       201:
 *         description: Yol haritası başarıyla eklendi
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
// POST http://localhost:5000/api/roadmaps
// Yol haritası oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isContentAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, content, created_at } = req.body;
    if (!title || !content || !created_at) {
      return res
        .status(400)
        .json({ message: "Başlık, içerik ve tarih zorunlu." });
    }

    let image_url = "";
    const bucket = admin.storage().bucket();

    if (req.file) {
      const fileName = `roadmaps/${uuidv4()}_${req.file.originalname}`;
      const file = bucket.file(fileName);
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });
      await file.makePublic();
      image_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    const docRef = await db.collection("roadmaps").add({
      title,
      content,
      created_at,
      image_url,
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

/**
 * @swagger
 * /api/roadmaps:
 *   get:
 *     summary: Tüm yol haritalarını getir (sayfalama)
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Sayfa numarası (varsayılan 1)
 *     responses:
 *       200:
 *         description: Yol haritaları listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Roadmap'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET http://localhost:5000/api/roadmaps
// Yol haritalarını listele (sayfalama ile - sayfa başına 9 öğe)
// roadmaps.ts  
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 9; // Sayfa başına 9 öğe
    const offset = (page - 1) * limit;

    // Base query
    let baseQuery = db.collection("roadmaps").orderBy("created_at", "desc");

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
    const roadmaps = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      data: roadmaps,
      page,
      limit,
      hasMore: roadmaps.length === limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   get:
 *     summary: Belirli bir yol haritasını getir
 *     tags: [Roadmaps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yol haritası ID'si
 *     responses:
 *       200:
 *         description: Yol haritası detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roadmap'
 *       404:
 *         description: Yol haritası bulunamadı
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
// GET http://localhost:5000/api/roadmaps/{id}
// Yol haritası detayı
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("roadmaps").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Yol haritası bulunamadı." });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   put:
 *     summary: Yol haritasını güncelle
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yol haritası ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image_url:
 *                 type: string
 *               created_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Yol haritası güncellendi
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
// PUT http://localhost:5000/api/roadmaps/{id}
// Yol haritası güncelle
router.put("/:id", protect, isContentAdmin, async (req, res) => {
  try {
    await db.collection("roadmaps").doc(req.params.id).update(req.body);
    res.json({ message: "Yol haritası güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/roadmaps/{id}:
 *   delete:
 *     summary: Yol haritasını sil
 *     tags: [Roadmaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Yol haritası ID'si
 *     responses:
 *       200:
 *         description: Yol haritası silindi
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
// DELETE http://localhost:5000/api/roadmaps/{id}
// Yol haritası sil
router.delete("/:id", protect, isContentAdmin, async (req, res) => {
  try {
    await db.collection("roadmaps").doc(req.params.id).delete();
    res.json({ message: "Yol haritası silindi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
