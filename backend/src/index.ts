import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Firebase konfigürasyonu
import "./firebase/firebase";

// Swagger importları
import { specs, swaggerUi } from "./swagger/swagger";

// Rota importları
import authRoutes from "./routes/auth";
import newsRoutes from "./routes/news";
import jobsRoutes from "./routes/jobs";
import roadmapsRoutes from "./routes/roadmaps";
import profileRoutes from "./routes/profile";
import adminAuthRoutes from "./routes/adminAuth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limit sabitleri
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 saniye
const RATE_LIMIT_MAX = 20; // dakika başına 20 istek

// CORS ayarı
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Rate limit ayarı
app.set("trust proxy", 1);
const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: true,
    message: { message: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
    skip: () => process.env.NODE_ENV === "test",
});
app.use(limiter);

// Ana sayfa
app.get("/", (req, res) => {
  res.json({
    message: "İSTÜN Mezunlar Ağı API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      news: "/api/news",
      jobs: "/api/jobs",
      roadmaps: "/api/roadmaps",
      users: "/api/users",
    },
  });
});

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "İstun Network API Docs",
  })
);

// Rotalar
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/roadmaps", roadmapsRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

// Sunucu başlat
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
