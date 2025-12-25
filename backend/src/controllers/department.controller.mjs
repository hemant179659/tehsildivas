import { Department, Project, Complaint } from "../models/department.model.mjs";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

/* ================= AWS S3 ================= */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* ================= MULTER ================= */
const storage = multer.memoryStorage();

export const complaintDocumentUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("documents", 5);

export const supportingDocUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("supportDocs", 10);

/* ================= AUTH ================= */
export const departmentSignup = async (req, res) => {
  const { deptName, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await new Department({ deptName, email, password: hashed }).save();
  res.json({ message: "Signup successful" });
};

export const departmentLogin = async (req, res) => {
  const { email, password } = req.body;
  const dept = await Department.findOne({ email });
  if (!dept || !(await bcrypt.compare(password, dept.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.json({ deptName: dept.deptName });
};

/* ================= COMPLAINT REGISTER ================= */
export const registerComplaint = async (req, res) => {
  try {
    const docs = [];

    for (const file of req.files || []) {
      const key = `complaints/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      docs.push({
        key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      });
    }

    const complaint = new Complaint({
      ...req.body,
      documents: docs,
    });

    await complaint.save();
    res.json({ complaintId: complaint.complaintId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Complaint registration failed" });
  }
};

/* ================= GET COMPLAINTS (FINAL FIX) ================= */
export const getComplaintsByDepartment = async (req, res) => {
  try {
    const { department, tehsil, all } = req.query;

    let filter = {};

    if (all === "true") {
      filter = {};
    } else if (department) {
      filter = { department };
    } else if (tehsil) {
      filter = { tehsil };
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, remark, department } = req.body;

    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const supportDocs = [];

    for (const file of req.files || []) {
      const key = `complaint-supporting/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      supportDocs.push({
        key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        uploadedBy: department,
      });
    }

    complaint.status = status;
    complaint.remarksHistory.push({ department, status, remark });

    if (supportDocs.length) {
      complaint.supportingDocuments.push(...supportDocs);
    }

    await complaint.save();
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update failed" });
  }
};

/* ================= PUBLIC TRACK ================= */
export const getComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaint status" });
  }
};
