// ================= IMPORTS =================

// Import Mongoose models for departments, complaints, admin users, and operators
import { Department, Complaint, Admin, Operator } from "../models/department.model.mjs";

// For hashing and comparing passwords securely
import bcrypt from "bcryptjs";

// For handling multipart/form-data (file uploads)
import multer from "multer";

// For loading environment variables from .env file
import dotenv from "dotenv";

// For generating secure random IDs (UUIDs)
import crypto from "crypto";

// AWS SDK clients for uploading and deleting files from S3
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Load environment variables
dotenv.config();

/* ================= AWS CONFIG ================= */

// Create AWS S3 client using credentials and region from environment variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/* ================= MULTER CONFIG ================= */

// Store uploaded files in memory (buffer) instead of disk
const storage = multer.memoryStorage();

// Middleware for uploading complaint documents (max 5 files, 5MB each)
export const complaintDocumentUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("documents", 5);

// Middleware for uploading supporting documents during status update (max 10 files)
export const supportingDocUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("supportDocs", 10);

/* ================= ADMIN LOGIN ================= */

// Admin authentication controller
export const adminLogin = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });

    // If admin not found → invalid credentials
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password in DB
    const match = await bcrypt.compare(password, admin.password);

    // If password does not match
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.json({ success: true });
  } catch (err) {
    // Any server error
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= OPERATOR LOGIN ================= */

// Data entry operator login controller
export const operatorLogin = async (req, res) => {
  try {
    // Extract tehsil, email, and password
    const { tehsil, email, password } = req.body;

    // Find operator by tehsil + email
    const operator = await Operator.findOne({ tehsil, email });

    // If operator not found
    if (!operator) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, operator.password);

    // If password mismatch
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login response
    res.json({
      success: true,
      operatorName: operator.operatorName,
      tehsil: operator.tehsil,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= SEED ALL DEPARTMENTS ================= */

// One-time seeding of all departments with verification codes
export const seedDepartments = async (req, res) => {
  try {
    // Static list of all departments with unique verification codes
    const departments = [
      { deptName: "जिला प्रशासन उधम सिंह नगर", verificationCode: "1905001" },
      { deptName: "जिलाधिकारी कार्यालय", verificationCode: "1905002" },
      { deptName: "अपर जिलाधिकारी कार्यालय", verificationCode: "1905003" },
      { deptName: "कोषागार विभाग", verificationCode: "1905004" },
      { deptName: "राजस्व विभाग", verificationCode: "1905005" },

      { deptName: "पुलिस विभाग", verificationCode: "1905010" },

      { deptName: "उप जिलाधिकारी रुद्रपुर", verificationCode: "1905020" },
      { deptName: "उप जिलाधिकारी काशीपुर", verificationCode: "1905021" },
      { deptName: "उप जिलाधिकारी गदरपुर", verificationCode: "1905022" },
      { deptName: "उप जिलाधिकारी जसपुर", verificationCode: "1905023" },
      { deptName: "उप जिलाधिकारी बाजपुर", verificationCode: "1905024" },
      { deptName: "उप जिलाधिकारी खटीमा", verificationCode: "1905025" },
      { deptName: "उप जिलाधिकारी सितारगंज", verificationCode: "1905026" },

      { deptName: "नगर निगम रुद्रपुर", verificationCode: "1905030" },
      { deptName: "नगर निगम काशीपुर", verificationCode: "1905032" },
      { deptName: "नगर पालिका परिषद गदरपुर", verificationCode: "1905033" },
      { deptName: "नगर पालिका परिषद जसपुर", verificationCode: "1905034" },
      { deptName: "नगर पालिका परिषद बाजपुर", verificationCode: "1905035" },
      { deptName: "नगर पालिका परिषद खटीमा", verificationCode: "1905036" },

      { deptName: "नगर पंचायत केलाखेड़ा", verificationCode: "1905038" },
      { deptName: "नगर पंचायत दिनेशपुर", verificationCode: "1905039" },
      { deptName: "नगर पंचायत महुआडाली", verificationCode: "1905040" },

      { deptName: "लोक निर्माण विभाग", verificationCode: "1905050" },
      { deptName: "उत्तराखंड जल संस्थान", verificationCode: "1905051" },
      { deptName: "उत्तराखंड पावर कॉरपोरेशन लिमिटेड", verificationCode: "1905052" },
      { deptName: "सिंचाई विभाग", verificationCode: "1905053" },
      { deptName: "लघु सिंचाई विभाग", verificationCode: "1905054" },

      { deptName: "मुख्य चिकित्सा अधिकारी कार्यालय", verificationCode: "1905060" },
      { deptName: "जिला अस्पताल उधम सिंह नगर", verificationCode: "1905061" },
      { deptName: "रुद्रपुर मेडिकल कॉलेज", verificationCode: "1905062" },
      { deptName: "आयुष विभाग", verificationCode: "1905063" },

      { deptName: "प्राथमिक शिक्षा विभाग", verificationCode: "1905070" },
      { deptName: "माध्यमिक शिक्षा विभाग", verificationCode: "1905071" },
      { deptName: "जी.बी. पंत विश्वविद्यालय पंतनगर", verificationCode: "1905073" },

      { deptName: "ग्रामीण विकास विभाग", verificationCode: "1905080" },
      { deptName: "पंचायतीराज विभाग", verificationCode: "1905081" },
      { deptName: "जिला पंचायत उधम सिंह नगर", verificationCode: "1905082" },
      { deptName: "समाज कल्याण विभाग", verificationCode: "1905083" },
      { deptName: "महिला एवं बाल विकास विभाग", verificationCode: "1905084" },
      { deptName: "अल्पसंख्यक कल्याण विभाग", verificationCode: "1905085" },

      { deptName: "कृषि विभाग", verificationCode: "1905090" },
      { deptName: "बागवानी विभाग", verificationCode: "1905091" },
      { deptName: "पशुपालन विभाग", verificationCode: "1905092" },
      { deptName: "गन्ना विकास एवं चीनी उद्योग विभाग", verificationCode: "1905093" },

      { deptName: "श्रम विभाग", verificationCode: "1905100" },
      { deptName: "फैक्ट्री एवं बॉयलर विभाग", verificationCode: "1905101" },
      { deptName: "औद्योगिक विकास विभाग", verificationCode: "1905102" },

      { deptName: "परिवहन विभाग", verificationCode: "1905110" },
      { deptName: "खाद्य एवं नागरिक आपूर्ति विभाग", verificationCode: "1905111" },
      { deptName: "खाद्य सुरक्षा विभाग", verificationCode: "1905112" },
      { deptName: "पर्यावरण बोर्ड", verificationCode: "1905113" },
    ];

    // Create bulk upsert operations to avoid duplicates
    const operations = departments.map((d) => ({
      updateOne: {
        filter: { deptName: d.deptName },
        update: { $setOnInsert: d },
        upsert: true,
      },
    }));

    // Execute bulk write
    const result = await Department.bulkWrite(operations);

    // Send summary
    res.json({
      message: "Departments seeded successfully",
      inserted: result.upsertedCount,
      total: departments.length,
    });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
};

/* ================= DEPARTMENT AUTH ================= */

// Department signup with verification code
export const departmentSignup = async (req, res) => {
  const { deptName, email, password, verificationCode } = req.body;

  // Find department by name
  const dept = await Department.findOne({ deptName });
  if (!dept) return res.status(400).json({ message: "Department not found" });

  // Verify department code
  if (dept.verificationCode !== verificationCode)
    return res.status(400).json({ message: "Invalid verification code" });

  // Prevent double registration
  if (dept.isRegistered)
    return res.status(400).json({ message: "Already registered" });

  // Save credentials
  dept.email = email;
  dept.password = await bcrypt.hash(password, 10);
  dept.isRegistered = true;
  await dept.save();

  res.json({ message: "Signup successful" });
};

// Department login
export const departmentLogin = async (req, res) => {
  const { email, password } = req.body;

  // Find department by email
  const dept = await Department.findOne({ email });

  // Validate credentials
  if (!dept || !(await bcrypt.compare(password, dept.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Successful login
  res.json({ deptName: dept.deptName });
};

/* ================= COMPLAINT REGISTRATION ================= */

export const registerComplaint = async (req, res) => {
  try {
    const docs = [];

    // Upload each document to S3
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

      // Store S3 reference in DB
      docs.push({
        key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      });
    }

    // Create complaint record
    const complaint = new Complaint({
      ...req.body,
      documents: docs,
    });

    await complaint.save();

    // Return generated complaint ID
    res.json({ complaintId: complaint.complaintId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Complaint registration failed" });
  }
};

/* ================= FETCH COMPLAINTS ================= */

export const getComplaintsByDepartment = async (req, res) => {
  try {
    const { department, tehsil, all } = req.query;

    let filter = {};

    // Admin view → all complaints
    if (all === "true") {
      filter = {};
    }
    // Department-specific complaints
    else if (department) {
      filter = { department };
    }
    // Tehsil-specific complaints
    else if (tehsil) {
      filter = { tehsil };
    }

    // Fetch complaints sorted by latest
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* ================= UPDATE COMPLAINT STATUS ================= */

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, remark, department } = req.body;

    // Find complaint
    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const supportDocs = [];

    // Upload supporting documents
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

    // Update complaint fields
    complaint.status = status;
    complaint.remarksHistory.push({ department, status, remark });

    // Attach supporting documents
    if (supportDocs.length) {
      complaint.supportingDocuments.push(...supportDocs);
    }

    // If complaint resolved → delete original documents
    if (status === "निस्तारित" || status === "Resolved") {
      for (const doc of complaint.documents) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: doc.key,
          })
        );
      }

      // Remove document references from DB
      complaint.documents = [];
    }

    await complaint.save();

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update failed" });
  }
};

/* ================= PUBLIC TRACKING ================= */

export const getComplaintStatus = async (req, res) => {
  try {
    // Find complaint by complaintId
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    // Send full complaint details
    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaint status" });
  }
};
