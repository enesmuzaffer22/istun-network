import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Firebase konfigürasyonunu en başta import ederek sunucu başlarken çalışmasını sağlıyoruz.
import "./firebase/firebase";

// Rota importları
import authRoutes from "./routes/auth";
import newsRoutes from "./routes/news";
import jobsRoutes from "./routes/jobs";
import roadmapsRoutes from "./routes/roadmaps";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limit sabit değerler (gerektiğinde aşağıdaki iki sabiti değiştirin)
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 saniye
const RATE_LIMIT_MAX = 20; // dakika başına 20 istek

// Sadece frontend uygulamanızdan (http://localhost:5173) gelen isteklere izin veriyoruz.
app.use(cors({ origin: "http://localhost:5173",
    credentials: true }));  // <-- BU SATIRI EKLEYİN
app.use(express.json());

app.set('trust proxy', 1);

// Rate limit / Aşan istekler 429 hatası verir.
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: true,
    message: { message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
    skip: () => process.env.NODE_ENV === 'test'
});

/* 1 ip'den gelen tüm istekleri kontrol eder.
ihtiyaca göre api endpointlerini ayrı ayrı rate limit ile kontrol edebiliriz.
İstek limiti ile ilgili bir problem olursa iletiniz. */
app.use(limiter);

// Rotalar
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/roadmaps", roadmapsRoutes);

// Sunucuyu dinlemeye başlıyoruz.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//index.ts