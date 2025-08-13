// backend/src/firebase/firebase.ts

import admin from "firebase-admin";
import * as dotenv from "dotenv";

// .env dosyasındaki değişkenleri hemen yükle
dotenv.config();

// Firebase Admin SDK'in zaten başlatılıp başlatılmadığını kontrol et
if (!admin.apps.length) {
  try {
    const serviceAccountString =
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    let credential;

    // Öncelik 1: Canlı ortam (Production)
    // Ortam değişkeni varsa, bu JSON string'ini parse ederek kullan.
    if (serviceAccountString) {
      const serviceAccount = JSON.parse(serviceAccountString);
      credential = admin.credential.cert(serviceAccount);
      console.log(
        "Firebase Admin SDK canlı ortam değişkenleri ile başlatılıyor..."
      );
    }
    // Öncelik 2: Lokal ortam (Development)
    // Ortam değişkeni yoksa, lokaldeki JSON dosyasını kullan.
    else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccountJson = require("./serviceAccountKey.json"); // Kodla aynı klasördeki dosyayı kullan
      credential = admin.credential.cert(serviceAccountJson);
      console.log(
        "Firebase Admin SDK lokal serviceAccountKey.json dosyası ile başlatılıyor..."
      );
    }

    // Firebase'i bulunan kimlik bilgileriyle başlat
    admin.initializeApp({
      credential,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // .env dosyasından okur
    });

    console.log("Firebase Admin SDK başarıyla başlatıldı.");
  } catch (error: any) {
    console.error("Firebase Admin SDK başlatılamadı:", error.message);
    // Hata durumunda, uygulamanın çökmesi en güvenli yoldur.
    process.exit(1);
  }
}

// Gerekli servisleri export et
const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
