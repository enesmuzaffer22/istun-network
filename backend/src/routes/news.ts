/**
 * @swagger
 * tags:
 *   name: News
 *   description: Haber yönetimi
 */

// src/routes/news.ts
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

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Yeni haber oluştur
 *     tags: [News]
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
 *                 description: Haber başlığı
 *               content:
 *                 type: string
 *                 description: Haber içeriği
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 description: Oluşturma tarihi
 *               category:
 *                 type: string
 *                 description: Haber kategorisi (opsiyonel)
 *               banner_img:
 *                 type: string
 *                 format: binary
 *                 description: Banner resmi (opsiyonel)
 *               thumbnail_img:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail resmi (opsiyonel)
 *     responses:
 *       201:
 *         description: Haber başarıyla eklendi
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
// POST http://localhost:5000/api/news
// Haber oluştur (tek adımda dosya ve diğer alanlar)
router.post(
  "/",
  protect,
  isAdmin,
  upload.fields([
    { name: "banner_img", maxCount: 1 },
    { name: "thumbnail_img", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, content, created_at, category } = req.body;

      // Zorunlu alanlar kontrolü
      if (!title || !content || !created_at) {
        return res
          .status(400)
          .json({ message: "Başlık, içerik ve tarih zorunlu." });
      }

      // Dosya işlemleri
      let banner_img_url = "";
      let thumbnail_img_url = "";
      const bucket = admin.storage().bucket();

      // Banner image yükle
      if (req.files && (req.files as any)["banner_img"]) {
        const bannerFile = (req.files as any)["banner_img"][0];
        const bannerFileName = `news/${uuidv4()}_${bannerFile.originalname}`;
        const bannerFileRef = bucket.file(bannerFileName);
        await bannerFileRef.save(bannerFile.buffer, {
          metadata: { contentType: bannerFile.mimetype },
        });
        await bannerFileRef.makePublic();
        banner_img_url = `https://storage.googleapis.com/${bucket.name}/${bannerFileName}`;
      }

      // Thumbnail image yükle
      if (req.files && (req.files as any)["thumbnail_img"]) {
        const thumbFile = (req.files as any)["thumbnail_img"][0];
        const thumbFileName = `news/${uuidv4()}_${thumbFile.originalname}`;
        const thumbFileRef = bucket.file(thumbFileName);
        await thumbFileRef.save(thumbFile.buffer, {
          metadata: { contentType: thumbFile.mimetype },
        });
        await thumbFileRef.makePublic();
        thumbnail_img_url = `https://storage.googleapis.com/${bucket.name}/${thumbFileName}`;
      }

      // Firestore'a haber kaydet
      const docRef = await db.collection("news").add({
        title,
        content,
        created_at,
        category: category || "",
        banner_img_url,
        thumbnail_img_url,
      });

      res.status(201).json({ id: docRef.id, message: "Haber eklendi." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* HABER OLUŞTURMA İÇİN ÖRNEK JSON
{
    "title": "Mezunlar Buluşması 2024",
    "content": "Tüm mezunlarımızı 2024 buluşmasına bekliyoruz! **Detaylar için tıklayın.**",
    "created_at": "2024-05-16T12:00:00Z", // ISO tarih formatı olmalı
    "category": "etkinlik",
    "banner_img_url": "https://example.com/banner.jpg",
    "thumbnail_img_url": "https://example.com/thumb.jpg"
  }

*/

/**
 * @swagger
 * /api/news/upload-image:
 *   post:
 *     summary: Haber için resim yükle
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Yüklenecek resim dosyası
 *     responses:
 *       200:
 *         description: Resim başarıyla yüklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Dosya bulunamadı
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
// Resim yükleme endpointi
router.post(
  "/upload-image",
  protect,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Dosya bulunamadı." });
      }
      const bucket = admin.storage().bucket();
      const fileName = `news/${uuidv4()}_${req.file.originalname}`;
      const file = bucket.file(fileName);

      // Dosyayı Storage'a yükle
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });

      // Dosya herkese açık olsun (opsiyonel, canlıda dikkatli ol!)
      await file.makePublic();

      // Public URL oluştur
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* RESİM YÜKLEME ENDPOİNTİ 

1. Önce resmi /api/news/upload-image endpointine form-data olarak gönderiyorsun (key: image).
2. Dönen URL’yi, haber oluştururken banner_img_url veya thumbnail_img_url olarak /api/news endpointine gönderiyorsun (Post Olarak).

*/

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Tüm haberleri getir
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Haber listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET http://localhost:5000/api/news
// Haberleri listele (sayfalama ile - sayfa başına 12 öğe)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 12; // Sayfa başına 12 öğe
    const offset = (page - 1) * limit;

    // Base query
    let baseQuery = db.collection("news").orderBy("created_at", "desc");

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
    const news = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      data: news,
      page,
      limit,
      hasMore: news.length === limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Belirli bir haberi getir
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Haber ID'si
 *     responses:
 *       200:
 *         description: Haber detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: Haber bulunamadı
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
// GET http://localhost:5000/api/news/{id}
// Haber detayı
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("news").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Haber bulunamadı." });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Haberi güncelle
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Haber ID'si
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
 *               category:
 *                 type: string
 *               banner_img_url:
 *                 type: string
 *               thumbnail_img_url:
 *                 type: string
 *               created_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Haber güncellendi
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
// PUT http://localhost:5000/api/news/{id}
// Haber güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.collection("news").doc(req.params.id).update(req.body);
    res.json({ message: "Haber güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Haberi sil
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Haber ID'si
 *     responses:
 *       200:
 *         description: Haber silindi
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
// DELETE http://localhost:5000/api/news/{id}
// Haber sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.collection("news").doc(req.params.id).delete();
    res.json({ message: "Haber silindi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
