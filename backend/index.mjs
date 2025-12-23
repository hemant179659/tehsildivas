import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import departmentRoutes from "./src/routes/department.routes.mjs";

dotenv.config();
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
   STATIC FILES (Complaint Docs)
   PDF / JPG / JPEG
========================= */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   ROUTES
========================= */
app.use("/api/department", departmentRoutes);

/* =========================
   HEALTH CHECK (OPTIONAL)
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Complaint & Project API running successfully",
  });
});

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
