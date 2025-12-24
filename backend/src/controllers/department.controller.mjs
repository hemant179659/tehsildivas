import { Department, Project, Complaint } from "../models/department.model.mjs";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

dotenv.config();

/* =========================
   AWS S3 CONFIG
========================= */
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();

export const photoUploadMiddleware = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).array("photos", 5);

export const complaintDocumentUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("documents", 5);

/* =========================
   NODEMAILER
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   AUTH
========================= */
export const departmentSignup = async (req, res) => {
  try {
    const { deptName, email, password } = req.body;

    const exists = await Department.findOne({
      $or: [{ deptName }, { email }],
    });
    if (exists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await new Department({
      deptName,
      email,
      password: hashed,
    }).save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup error" });
  }
};

export const departmentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const dept = await Department.findOne({ email });
    if (!dept) {
      return res.status(400).json({ message: "Department not found" });
    }

    const match = await bcrypt.compare(password, dept.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({ deptName: dept.deptName });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
};

/* =========================
   PASSWORD RESET
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const dept = await Department.findOne({ email });
    if (!dept) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    dept.resetToken = await bcrypt.hash(token, 10);
    dept.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await dept.save();

    const link = `http://localhost:5173/dept-reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<a href="${link}">${link}</a>`,
    });

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Reset error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const dept = await Department.findOne({ email });
    if (!dept) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const valid = await bcrypt.compare(token, dept.resetToken);
    if (!valid) {
      return res.status(400).json({ message: "Invalid token" });
    }

    dept.password = await bcrypt.hash(newPassword, 10);
    dept.resetToken = undefined;
    dept.resetTokenExpiry = undefined;
    await dept.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};

/* =========================
   PROJECTS
========================= */
export const addProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      remainingBudget: req.body.budgetAllocated,
      photos: [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Add project error:", err);
    res.status(500).json({ message: "Add project error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects =
      req.query.all === "true"
        ? await Project.find()
        : await Project.find({ department: req.query.department });

    res.json({ projects });
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ message: "Fetch projects error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: "Update project error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: "Delete project error" });
  }
};

/* =========================
   COMPLAINTS (OPERATOR)
========================= */
export const registerComplaint = async (req, res) => {
  try {
    const uploadedDocuments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `complaints/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        uploadedDocuments.push({
          key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        });
      }
    }

    const complaint = new Complaint({
      ...req.body,
      documents: uploadedDocuments,
    });

    await complaint.save();
    res.status(201).json({ complaintId: complaint.complaintId });
  } catch (err) {
    console.error("Register complaint error:", err);
    res.status(500).json({ message: "Complaint register error" });
  }
};

/* =========================
   COMPLAINTS (TEHSIL)
========================= */
export const getComplaintsByTehsil = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedPlace: req.query.tehsil,
    }).sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (err) {
    console.error("Fetch complaints by tehsil error:", err);
    res.status(500).json({ message: "Fetch complaints error" });
  }
};

/* =========================
   COMPLAINTS (DEPARTMENT + ADMIN)
========================= */
export const getComplaintsByDepartment = async (req, res) => {
  try {
    const { department, all } = req.query;

    let filter = {};

    // ✅ ADMIN → ALL complaints
    if (all === "true") {
      filter = {};
    }
    // ✅ DEPARTMENT → own complaints
    else if (department) {
      filter = { department };
    }
    // ❌ INVALID
    else {
      return res.status(400).json({ message: "Invalid request" });
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ complaints });
  } catch (err) {
    console.error("Fetch department complaints error:", err);
    res.status(500).json({ message: "Fetch department complaints error" });
  }
};

/* =========================
   UPDATE COMPLAINT STATUS
========================= */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, remark, department } = req.body;

    if (!status || !remark || !department) {
      return res.status(400).json({
        message: "Status, remark और department आवश्यक है",
      });
    }

    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    /* ===== DELETE DOCUMENTS FROM S3 ON RESOLVE ===== */
    if (status === "निस्तारित" && complaint.documents.length > 0) {
      for (const doc of complaint.documents) {
        if (doc.key) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: doc.key,
            })
          );
        }
      }
      complaint.documents = [];
    }

    complaint.status = status;
    complaint.remarksHistory.push({
      department,
      status,
      remark,
      actionDate: new Date(),
    });

    await complaint.save();
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Update complaint status error:", err);
    res.status(500).json({ message: "Update status error" });
  }
};

/* =========================
   PUBLIC COMPLAINT STATUS
========================= */
export const getComplaintStatus = async (req, res) => {
  const { complaintId } = req.params;

  const complaint = await Complaint.findOne({ complaintId });
  if (!complaint) {
    return res.status(404).json({ message: "शिकायत नहीं मिली" });
  }

  res.json({ complaint });
};
