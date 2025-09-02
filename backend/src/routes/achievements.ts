// backend/src/routes/achievements.ts

import express from "express";
import { db } from "../firebase/firebase";
import { protect, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @openapi
 * /api/achievements:
 *   post:
 *     tags: [Achievements]
 *     summary: Başarı oluştur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, given_from, year]
 *             properties:
 *               title:
 *                 type: string
 *               given_from:
 *                 type: string
 *               year:
 *                 type: string
 *               news_link:
 *                 type: string
 *               has_link:
 *                 oneOf:
 *                   - type: boolean
 *                   - type: string
 *     responses:
 *       201:
 *         description: Oluşturuldu
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
// POST http://localhost:5000/api/achievements
// Başarı oluştur
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, given_from, year, news_link, has_link } = req.body;

    // Zorunlu alanlar kontrolü
    if (!title || !given_from || !year) {
      return res
        .status(400)
        .json({ message: "Başlık, veren kurum ve yıl zorunlu." });
    }

    // Boolean değeri düzelt
    const hasLinkValue = has_link === true || has_link === "true";

    // Eğer has_link true ise news_link de olmalı
    if (hasLinkValue && !news_link) {
      return res
        .status(400)
        .json({ message: "Link varsa news_link alanı zorunlu." });
    }

    // Firestore'a başarı kaydet
    const docRef = await db.collection("achievements").add({
      title,
      given_from,
      year,
      news_link: news_link || "",
      has_link: hasLinkValue,
    });

    res.status(201).json({ id: docRef.id, message: "Başarı eklendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/achievements:
 *   get:
 *     tags: [Achievements]
 *     summary: Başarıları listele (sayfalama)
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
// GET http://localhost:5000/api/achievements
// Başarıları listele (sayfalama ile - sayfa başına 9 öğe)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 9; // Sayfa başına 9 öğe
    const offset = (page - 1) * limit;

    // Base query - yıla göre azalan sırada
    let baseQuery = db.collection("achievements").orderBy("year", "desc");

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
    const achievements = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      data: achievements,
      page,
      limit,
      hasMore: achievements.length === limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/achievements/{id}:
 *   get:
 *     tags: [Achievements]
 *     summary: Başarı detayı
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
// GET http://localhost:5000/api/achievements/{id}
// Başarı detayı
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("achievements").doc(req.params.id).get();
    if (!doc.exists)
      return res.status(404).json({ message: "Başarı bulunamadı." });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/achievements/{id}:
 *   put:
 *     tags: [Achievements]
 *     summary: Başarı güncelle
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
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/schemas/Error'
 */
// PUT http://localhost:5000/api/achievements/{id}
// Başarı güncelle
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Boolean değeri düzelt
    if (updateData.has_link !== undefined) {
      updateData.has_link =
        updateData.has_link === true || updateData.has_link === "true";

      // Eğer has_link true yapılıyorsa ve news_link yoksa hata ver
      if (updateData.has_link && !updateData.news_link) {
        // Mevcut kaydı kontrol et
        const doc = await db
          .collection("achievements")
          .doc(req.params.id)
          .get();
        if (doc.exists) {
          const currentData = doc.data();
          if (!currentData?.news_link) {
            return res
              .status(400)
              .json({ message: "Link varsa news_link alanı zorunlu." });
          }
        }
      }

      // Eğer has_link false yapılıyorsa news_link'i temizle
      if (!updateData.has_link) {
        updateData.news_link = "";
      }
    }

    await db.collection("achievements").doc(req.params.id).update(updateData);
    res.json({ message: "Başarı güncellendi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @openapi
 * /api/achievements/{id}:
 *   delete:
 *     tags: [Achievements]
 *     summary: Başarı sil
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
// DELETE http://localhost:5000/api/achievements/{id}
// Başarı sil
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    await db.collection("achievements").doc(req.params.id).delete();
    res.json({ message: "Başarı silindi." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
