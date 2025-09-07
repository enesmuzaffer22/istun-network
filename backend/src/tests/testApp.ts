// src/tests/testApp.ts
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "../routes/auth";
import newsRoutes from "../routes/news";
import jobsRoutes from "../routes/jobs";
import roadmapsRoutes from "../routes/roadmaps";
import profileRoutes from "../routes/profile";
import { MemoryCache } from "../utils/cache";
import { progressiveRateLimitMiddleware } from "../middleware/progressiveRateLimitMiddleware";

// Test için rate limiting'i daha gevşek yap
const testLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1000, // Test için yüksek limit
    message: { message: "Test rate limit aşıldı" },
    skip: () => process.env.NODE_ENV === 'test'
});

// Test cache instance
export const testCache = new MemoryCache();

const app = express();

app.use(cors());
app.use(express.json());

// Test için progressive rate limit'i de ekle
app.use(progressiveRateLimitMiddleware);
app.use(testLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/roadmaps", roadmapsRoutes);
app.use("/api/users", profileRoutes);

app.get("/", (req, res) => {
    res.send("ISTUN Test Server Çalışıyor!");
});

export default app; 