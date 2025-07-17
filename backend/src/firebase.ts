// src/firebase.ts
import admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: "istunmezunweb.firebasestorage.app"
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };