import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import departmentRoutes from "./src/routes/department.routes.mjs";
import adminRoutes from "./src/routes/department.routes.mjs";
import operatorRoutes from "./src/routes/department.routes.mjs";

/* =========================
   LOAD ENV (MUST BE FIRST)
========================= */
dotenv.config();

/* =========================
   BASIC CHECKS (DEBUG)
========================= */
console.log("ENV PORT =", process.env.PORT);
console.log("ENV MONGO_URI =", process.env.MONGO_URI ? "OK" : "MISSING");

/* =========================
   EXPRESS INIT
========================= */
const app = express();

/* =========================
   FIX __dirname (ESM)
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   CORS CONFIG
========================= */
app.use(
  cors({
    origin: [
      "https://usn.digital",
      "https://www.usn.digital",
      "https://tehsildivas.usn.digital",
      "https://www.tehsildivas.usn.digital",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/department", departmentRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/operator", operatorRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "tehsildivas-backend" });
});

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err);
    process.exit(1); // stop server if DB fails
  });

/* =========================
   SERVER START (IMPORTANT)
========================= */
const PORT = Number(process.env.PORT) || 9000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
