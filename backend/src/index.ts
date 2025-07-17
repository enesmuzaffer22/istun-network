// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import newsRoutes from "./routes/news";
import jobsRoutes from "./routes/jobs";
import roadmapsRoutes from "./routes/roadmaps";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/roadmaps", roadmapsRoutes);

app.get("/", (req, res) => {
    res.send("ISTUN Mezun Web Backend Çalışıyor!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});