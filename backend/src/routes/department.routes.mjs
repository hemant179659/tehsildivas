import express from "express";
console.log("✅ department.routes LOADED");

import {
  departmentSignup,
  departmentLogin,
  registerComplaint,
    seedDepartments,
    adminLogin,
    operatorLogin,
  complaintDocumentUpload,
  getComplaintsByDepartment,
  updateComplaintStatus,
  supportingDocUpload,
  getComplaintStatus,
} from "../controllers/department.controller.mjs";

const router = express.Router();

/* AUTH */
router.post("/signup", departmentSignup);
router.post("/login", departmentLogin);
router.post("/adminlogin", adminLogin);

/* COMPLAINT REGISTER (OPERATOR) */
router.post(
  "/register",
  complaintDocumentUpload,
  registerComplaint
);

/* DEPARTMENT / ADMIN */
router.get(
  "/department-complaints",
  getComplaintsByDepartment
);
router.post("/operatorlogin", operatorLogin);
router.put(
  "/update-status/:complaintId",
  supportingDocUpload,
  updateComplaintStatus
);

/* PUBLIC */


router.get(
  "/complaint-status/:complaintId",
  getComplaintStatus
);

export default router;
