// backend/src/firebase/firebase.ts

import admin from "firebase-admin";
import * as dotenv from "dotenv";

// .env dosyasındaki değişkenleri yükle
dotenv.config();

// Firebase Admin SDK'in zaten başlatılıp başlatılmadığını kontrol et
if (!admin.apps.length) {
  let serviceAccount: admin.ServiceAccount;

  try {
    // Öncelik 1: Canlı ortam (Production)
    // Hosting platformundaki (Vercel, Render vb.) ortam değişkenini kontrol et.
    // Bu değişken, serviceAccountKey.json dosyasının TÜM içeriğini barındırır.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      console.log("Firebase Admin SDK canlı ortam değişkenleri ile başlatılıyor...");
    }
    // Öncelik 2: Lokal ortam (Development)
    // Projenin ana dizinindeki serviceAccountKey.json dosyasını kullan.
    // Bu yöntem, her terminal açtığında "export" komutu girme zorunluluğunu ortadan kaldırır.
    else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      serviceAccount = require("./serviceAccountKey.json");
      console.log("Firebase Admin SDK lokal serviceAccountKey.json dosyası ile başlatılıyor...");
    }

    // Firebase'i bulunan kimlik bilgileriyle başlat
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "istunmezunweb.firebasestorage.app",
    });

    console.log("Firebase Admin SDK başarıyla başlatıldı.");
  } catch (error: any) {
    console.error("Firebase Admin SDK başlatılamadı:", error.message);
    // Hata durumunda, uygulamanın çökmesi genellikle en doğru davranıştır
    // çünkü veritabanı olmadan çoğu işlem başarısız olacaktır.
    process.exit(1);
  }
}

// Her zamanki gibi db ve auth'u export et
const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
