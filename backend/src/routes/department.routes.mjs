// Import Express framework
import express from "express";

// Log to confirm this route file is loaded (useful for debugging)
console.log("✅ department.routes LOADED");

// Import controller functions and middleware
import {
  // Department authentication
  departmentSignup,
  departmentLogin,

  // Complaint registration (operator)
  registerComplaint,

  // Seed all departments (admin utility)
  seedDepartments,

  // Admin authentication
  adminLogin,

  // Operator authentication
  operatorLogin,

  // Multer middleware for complaint documents upload
  complaintDocumentUpload,

  // Fetch complaints (department / admin)
  getComplaintsByDepartment,

  // Update complaint status (department)
  updateComplaintStatus,

  // Multer middleware for supporting documents upload
  supportingDocUpload,

  // Public complaint tracking
  getComplaintStatus,
} from "../controllers/department.controller.mjs";

// Create Express router instance
const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

// Department signup using verification code
router.post("/signup", departmentSignup);

// Department login
router.post("/login", departmentLogin);

// Admin login
router.post("/adminlogin", adminLogin);

/* =========================
   COMPLAINT REGISTER (OPERATOR)
========================= */

// Operator registers a complaint with uploaded documents
// complaintDocumentUpload handles multipart/form-data
router.post(
  "/register",
  complaintDocumentUpload,
  registerComplaint
);

/* =========================
   DEPARTMENT / ADMIN ROUTES
========================= */

// Fetch complaints
// - department wise
// - tehsil wise
// - all=true (admin)
router.get(
  "/department-complaints",
  getComplaintsByDepartment
);

// Operator login
router.post("/operatorlogin", operatorLogin);

// Department updates complaint status
// supportingDocUpload allows department to upload supporting files
router.put(
  "/update-status/:complaintId",
  supportingDocUpload,
  updateComplaintStatus
);

/* =========================
   PUBLIC ROUTES
========================= */

// Public complaint status tracking using complaintId
router.get(
  "/complaint-status/:complaintId",
  getComplaintStatus
);

// Export router to be used in main app
export default router;
