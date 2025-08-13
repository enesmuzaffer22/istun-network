"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const news_1 = __importDefault(require("./routes/news"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const roadmaps_1 = __importDefault(require("./routes/roadmaps"));
const profile_1 = __importDefault(require("./routes/profile"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/news", news_1.default);
app.use("/api/jobs", jobs_1.default);
app.use("/api/roadmaps", roadmaps_1.default);
app.use("/api/users", profile_1.default);
app.get("/", (req, res) => {
  res.send("ISTUN Mezun Web Backend Çalışıyor!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
