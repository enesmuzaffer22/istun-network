// Gerekli olan 'firebase-admin' kütüphanesini import ediyoruz.
import admin from "firebase-admin";

// serviceAccountKey.json dosyasını projemize dahil ediyoruz.
import serviceAccount from "./serviceAccountKey.json";

// Sunucu her yeniden başlatıldığında Firebase'in tekrar başlatılmasını önlüyoruz.
if (!admin.apps.length) {
  // Firebase uygulamasını, indirdiğimiz anahtar dosyasını kullanarak başlatıyoruz.
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    storageBucket: "istunmezunweb.firebasestorage.app",
  });
  
  console.log("Firebase Admin SDK başarıyla başlatıldı.");
}

// Firestore ve Auth servislerini export ediyoruz.
const db = admin.firestore();
const auth = admin.auth();

// Bu servisleri projenin geri kalanında kullanmak üzere export ediyoruz.
export { db, auth,admin };

//firebase.ts