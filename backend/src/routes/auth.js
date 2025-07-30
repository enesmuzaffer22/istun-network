"use strict";
// src/routes/auth.ts
// Register: http://localhost:5000/api/auth/register
// Login   : http://localhost:5000/api/auth/login
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const firebase_2 = require("../firebase");
const uuid_1 = require("uuid");
dotenv.config();
const router = express_1.default.Router();
// Multer ayarı
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Öğrenci belgesi yükleme endpointi
router.post("/upload-document", upload.single("document"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Dosya bulunamadı." });
        }
        const bucket = firebase_2.admin.storage().bucket();
        const fileName = `student_docs/${(0, uuid_1.v4)()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        yield file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype }
        });
        yield file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        res.json({ url: publicUrl });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Kayıt ol endpointi (tek adımda dosya ve diğer alanlar)
router.post("/register", upload.single("document"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Diğer alanlar form-data'dan alınır
        const { name, surname, username, email, password, tc, phone, workStatus, classStatus, about, consent } = req.body;
        // Dosya kontrolü
        if (!req.file) {
            return res.status(400).json({ message: "Öğrenci belgesi dosyası zorunlu." });
        }
        // Zorunlu alanlar kontrolü
        if (!name ||
            !surname ||
            !username ||
            !email ||
            !password ||
            !tc ||
            !phone ||
            !workStatus ||
            !classStatus ||
            !consent) {
            return res.status(400).json({ message: "Lütfen tüm zorunlu alanları doldurun." });
        }
        // Username benzersiz mi kontrol et
        const usernameSnap = yield firebase_1.db.collection("users").where("username", "==", username).limit(1).get();
        if (!usernameSnap.empty) {
            return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor." });
        }
        // Dosyayı Storage'a yükle
        const bucket = firebase_2.admin.storage().bucket();
        const fileName = `student_docs/${(0, uuid_1.v4)()}_${req.file.originalname}`;
        const file = bucket.file(fileName);
        yield file.save(req.file.buffer, {
            metadata: { contentType: req.file.mimetype }
        });
        yield file.makePublic();
        const student_doc_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        // Firebase Auth ile kullanıcı oluştur
        const userRecord = yield firebase_1.auth.createUser({
            email,
            password,
            displayName: `${name} ${surname}`,
        });
        // Firestore'a ek bilgi kaydet
        yield firebase_1.db.collection("users").doc(userRecord.uid).set({
            name,
            surname,
            username,
            email,
            tc,
            phone,
            workStatus,
            classStatus,
            about: about || "",
            consent,
            student_doc_url,
            createdAt: new Date(),
        });
        res.status(201).json({ message: "Kayıt başarılı!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: "Kullanıcı adı/e-posta ve şifre zorunludur." });
        }
        let email = identifier;
        // Eğer identifier email değilse, Firestore'dan email'i bul
        if (!identifier.includes("@")) {
            const userSnap = yield firebase_1.db.collection("users").where("username", "==", identifier).limit(1).get();
            if (userSnap.empty) {
                return res.status(404).json({ message: "Kullanıcı bulunamadı." });
            }
            email = userSnap.docs[0].data().email;
        }
        // Firebase Auth REST API ile giriş yap
        const apiKey = process.env.FIREBASE_WEB_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "API anahtarı eksik." });
        }
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        const response = yield axios_1.default.post(url, {
            email,
            password,
            returnSecureToken: true
        });
        res.json({
            message: "Giriş başarılı!",
            token: response.data.idToken,
            refreshToken: response.data.refreshToken,
            user: {
                email: response.data.email,
                localId: response.data.localId
            }
        });
    }
    catch (error) {
        let message = "Giriş başarısız.";
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            if (error.response.data.error.message === "EMAIL_NOT_FOUND" || error.response.data.error.message === "INVALID_PASSWORD") {
                message = "Kullanıcı adı/e-posta veya şifre hatalı.";
            }
            else {
                message = error.response.data.error.message;
            }
        }
        res.status(401).json({ message });
    }
}));
exports.default = router;
