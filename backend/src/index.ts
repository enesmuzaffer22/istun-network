import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Sadece frontend uygulamanızdan (http://localhost:5173) gelen isteklere izin veriyoruz.
app.use(cors({ origin: "http://localhost:5173",
    credentials: true }));  // <-- BU SATIRI EKLEYİN
app.use(express.json());

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