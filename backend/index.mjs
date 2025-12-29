// Import Express framework
import express from "express";

// Import Mongoose for MongoDB connection
import mongoose from "mongoose";

// Import CORS middleware for cross-origin requests
import cors from "cors";

// Import dotenv to load environment variables
import dotenv from "dotenv";

// Import path utilities
import path from "path";

// Utility to fix __dirname in ES Modules
import { fileURLToPath } from "url";

/* =========================
   ROUTES
========================= */

// Department-related routes (signup, login, complaints)
import departmentRoutes from "./src/routes/department.routes.mjs";

// Admin routes (currently pointing to same route file)
import adminRoutes from "./src/routes/department.routes.mjs";

// Operator routes (currently pointing to same route file)
import operatorRoutes from "./src/routes/department.routes.mjs";

/* =========================
   LOAD ENV (MUST BE FIRST)
========================= */

// Load environment variables from .env file
dotenv.config();

/* =========================
   BASIC CHECKS (DEBUG)
========================= */

// Log PORT to verify environment variable is loaded
console.log("ENV PORT =", process.env.PORT);

// Log Mongo URI status without exposing actual value
console.log("ENV MONGO_URI =", process.env.MONGO_URI ? "OK" : "MISSING");

/* =========================
   EXPRESS INIT
========================= */

// Initialize Express application
const app = express();

/* =========================
   FIX __dirname (ESM)
========================= */

// Convert import.meta.url to file path
const __filename = fileURLToPath(import.meta.url);

// Extract directory name from file path
const __dirname = path.dirname(__filename);

/* =========================
   CORS CONFIG
========================= */

// Enable CORS for frontend domains
app.use(
  cors({
    origin: [
      "https://usn.digital",
      "https://www.usn.digital",
      "https://tehsildivas.usn.digital",
      "https://www.tehsildivas.usn.digital",
      "http://localhost:5173",
    ],
    credentials: true, // allow cookies/auth headers
  })
);

/* =========================
   BODY PARSERS
========================= */

// Parse JSON request bodies (large payload allowed)
app.use(express.json({ limit: "20mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* =========================
   STATIC FILES
========================= */

// Serve static uploaded files (if any local uploads exist)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */

// Department APIs
app.use("/api/department", departmentRoutes);

// Admin APIs (currently reusing department routes)
app.use("/api/admin", adminRoutes);

// Operator APIs (currently reusing department routes)
app.use("/api/operator", operatorRoutes);

/* =========================
   HEALTH CHECK
========================= */

// Simple endpoint to verify server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "tehsildivas-backend" });
});

/* =========================
   DATABASE
========================= */

// Connect to MongoDB using connection string from env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err);
    process.exit(1); // Stop server if DB connection fails
  });

/* =========================
   SERVER START (IMPORTANT)
========================= */

// Read PORT from env or fallback to 9000
const PORT = Number(process.env.PORT) || 9000;

// Start Express server on localhost
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
