// backend/src/routes/events.ts

import express from "express";
import { db } from "../firebase/firebase";
import multer from "multer";
import { admin } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { protect, isAdmin, isContentAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @openapi
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Etkinlik oluştur (tek adımda dosya ve diğer alanlar)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, description, event_date, created_at]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               event_date:
 *                 type: string
 *               created_at:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               organizer:
 *                 type: string
 *               registration_required:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *               registration_deadline:
 *                 type: string
 *               registration_link:
 *                 type: string
 *               has_registration_link:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *               tags:
 *                 oneOf:
 *                   - type: array
 *                     items:
 *                       type: string
 *                   - type: string
 *     responses:
 *       201:
 *         description: Oluşturuldu
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
// Multer ile dosya upload ayarı (bellekte tut)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST http://localhost:5000/api/events
// Etkinlik oluştur (tek adımda dosya ve diğer alanlar)
router.post("/", protect, isContentAdmin, upload.single("image"), async (req, res) => {
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
      registration_link,
      has_registration_link,
      tags,
    } = req.body;

    // Zorunlu alanlar kontrolü
    if (!title || !content || !description || !event_date || !created_at) {
      return res
        .status(400)
        .json({
          message:
            "Başlık, içerik, açıklama, etkinlik tarihi ve oluşturma tarihi zorunlu.",
        });
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
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map((tag: string) => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    // Boolean değerleri düzelt
    const registrationRequiredValue =
      registration_required === true || registration_required === "true";
    const hasRegistrationLinkValue =
      has_registration_link === true || has_registration_link === "true";

    // Eğer has_registration_link true ise registration_link de olmalı
    if (hasRegistrationLinkValue && !registration_link) {
      return res
        .status(400)
        .json({
          message: "Kayıt linki varsa registration_link alanı zorunlu.",
        });
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
      registration_required: registrationRequiredValue,
      registration_deadline: registration_deadline || null,
      registration_link: registration_link || "",
      has_registration_link: hasRegistrationLinkValue,
      tags: tagsArray,
    });

    res.status(201).json({ id: docRef.id, message: "Etkinlik eklendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/events/upload-image:
 *   post:
 *     tags: [Events]
 *     summary: Sadece resim yükle ve URL döndür
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Yüklenen dosyanın URL'si
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/schemas/Error'
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
  }
);

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Etkinlikleri listele (sayfalama)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Sayfa numarası (varsayılan 1)
 *     responses:
 *       200:
 *         description: Liste
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
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
      ...doc.data(),
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

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Etkinlik detayı
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detay
 *       404:
 *         $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Etkinlik güncelle
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               description:
 *                 type: string
 *               event_date:
 *                 type: string
 *               created_at:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               organizer:
 *                 type: string
 *               registration_required:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *               registration_deadline:
 *                 type: string
 *               registration_link:
 *                 type: string
 *               has_registration_link:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *               tags:
 *                 oneOf:
 *                   - type: array
 *                     items:
 *                       type: string
 *                   - type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Success'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
// PUT http://localhost:5000/api/events/{id}
// Etkinlik güncelle
router.put("/:id", protect, isContentAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Tags string array'e çevir (eğer string olarak gelirse)
    if (updateData.tags) {
      if (typeof updateData.tags === "string") {
        updateData.tags = updateData.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }
    }

    // Boolean değerleri düzelt
    if (updateData.registration_required !== undefined) {
      updateData.registration_required =
        updateData.registration_required === true ||
        updateData.registration_required === "true";
    }

    if (updateData.has_registration_link !== undefined) {
      updateData.has_registration_link =
        updateData.has_registration_link === true ||
        updateData.has_registration_link === "true";

      // Eğer has_registration_link true yapılıyorsa ve registration_link yoksa hata ver
      if (updateData.has_registration_link && !updateData.registration_link) {
        // Mevcut kaydı kontrol et
        const doc = await db.collection("events").doc(req.params.id).get();
        if (doc.exists) {
          const currentData = doc.data();
          if (!currentData?.registration_link) {
            return res
              .status(400)
              .json({
                message: "Kayıt linki varsa registration_link alanı zorunlu.",
              });
          }
        }
      }

      // Eğer has_registration_link false yapılıyorsa registration_link'i temizle
      if (!updateData.has_registration_link) {
        updateData.registration_link = "";
      }
    }

    await db.collection("events").doc(req.params.id).update(updateData);
    res.json({ message: "Etkinlik güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Etkinlik sil
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Success'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
// DELETE http://localhost:5000/api/events/{id}
// Etkinlik sil
router.delete("/:id", protect, isContentAdmin, async (req, res) => {
  try {
    await db.collection("events").doc(req.params.id).delete();
    res.json({ message: "Etkinlik silindi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
