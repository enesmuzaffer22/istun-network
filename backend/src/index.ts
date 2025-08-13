import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Firebase konfigürasyonunu en başta import ederek sunucu başlarken çalışmasını sağlıyoruz.
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

// Sadece frontend uygulamanızdan (http://localhost:5173) gelen isteklere izin veriyoruz.
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // <-- BU SATIRI EKLEYİN
app.use(express.json());

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

// Sunucuyu dinlemeye başlıyoruz.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//index.ts
