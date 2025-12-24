import express from "express";
import {
  // ================= AUTH =================
  departmentSignup,
  departmentLogin,

  // ============== PASSWORD RESET ==========
  forgotPassword,
  resetPassword,

  // ================= PROJECTS =============
  addProject,
  getProjects,
  updateProject,
  deleteProject,
  photoUploadMiddleware,

  // ================= COMPLAINTS ===========
  registerComplaint,
  complaintDocumentUpload,
  getComplaintsByTehsil,
  getComplaintsByDepartment,
  updateComplaintStatus,
  getComplaintStatus,
} from "../controllers/department.controller.mjs";

const router = express.Router();

/* ======================================================
   AUTH
====================================================== */
router.post("/signup", departmentSignup);
router.post("/login", departmentLogin);

/* ======================================================
   PASSWORD RESET
====================================================== */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* ======================================================
   PROJECTS
====================================================== */
// Add new project
router.post("/add-project", addProject);

// Get projects
// ?department=PWD   → department dashboard
// ?all=true         → admin dashboard
router.get("/projects", getProjects);

// Update project (with photos)
router.put(
  "/project/update/:id",
  photoUploadMiddleware,
  updateProject
);

// Delete project
router.delete("/project/:id", deleteProject);

/* ======================================================
   COMPLAINTS (OPERATOR)
====================================================== */
// Register complaint (with documents)
router.post(
  "/register",
  complaintDocumentUpload,
  registerComplaint
);

// Operator – complaints by tehsil
// ?tehsil=XYZ
router.get(
  "/complaints",
  getComplaintsByTehsil
);

/* ======================================================
   COMPLAINTS (DEPARTMENT + ADMIN)
====================================================== */
// Department → own complaints
// Admin → all complaints
// ?department=PWD
// ?all=true
router.get(
  "/department-complaints",
  getComplaintsByDepartment
);

// Update complaint status + remark (department/admin)
router.put(
  "/update-status/:complaintId",
  updateComplaintStatus
);

// Public – get complaint status by complaintId
router.get(
  "/complaint-status/:complaintId",
  getComplaintStatus
);

export default router;
