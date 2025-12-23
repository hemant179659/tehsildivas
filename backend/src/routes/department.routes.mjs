import express from "express";
import {
  departmentSignup,
  departmentLogin,
  forgotPassword,
  resetPassword,

  // PROJECTS
  addProject,
  getProjects,
  updateProject,
  deleteProject,
  photoUploadMiddleware,

  // COMPLAINTS
  registerComplaint,
  complaintDocumentUpload,
  getComplaintsByTehsil,
  getComplaintsByDepartment,
  updateComplaintStatus,
} from "../controllers/department.controller.mjs";

const router = express.Router();

/* =========================
   AUTH
========================= */
router.post("/signup", departmentSignup);
router.post("/login", departmentLogin);

/* =========================
   PASSWORD RESET
========================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* =========================
   PROJECTS
========================= */
router.post("/add-project", addProject);
router.get("/projects", getProjects);
router.put("/project/update/:id", photoUploadMiddleware, updateProject);
router.delete("/project/:id", deleteProject);

/* =========================
   COMPLAINTS (OPERATOR)
========================= */
// Register complaint
router.post(
  "/register",
  complaintDocumentUpload,
  registerComplaint
);

// Operator – complaints by tehsil
router.get(
  "/complaints",
  getComplaintsByTehsil
);

/* =========================
   COMPLAINTS (DEPARTMENT ACTION)
========================= */
// Department – view complaints
router.get(
  "/department-complaints",
  getComplaintsByDepartment
);

// Department – update status + remarks
router.put(
  "/update-status/:complaintId",
  updateComplaintStatus
);

export default router;
