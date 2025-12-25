import express from "express";
import {
  departmentSignup,
  departmentLogin,
  registerComplaint,
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
