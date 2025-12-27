import { Department, Complaint,Admin,Operator} from "../models/department.model.mjs";
import bcrypt from "bcryptjs";
import multer from "multer";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
dotenv.config();

/* ================= AWS ================= */
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


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const operatorLogin = async (req, res) => {
  try {
    const { tehsil, email, password } = req.body;

    const operator = await Operator.findOne({ tehsil, email });

    if (!operator) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, operator.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
export const seedDepartments = async (req, res) => {
  try {
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

    const operations = departments.map((d) => ({
      updateOne: {
        filter: { deptName: d.deptName },
        update: { $setOnInsert: d },
        upsert: true,
      },
    }));

    const result = await Department.bulkWrite(operations);

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


/* ================= AUTH ================= */
export const departmentSignup = async (req, res) => {
  const { deptName, email, password, verificationCode } = req.body;

  const dept = await Department.findOne({ deptName });
  if (!dept) return res.status(400).json({ message: "Department not found" });

  if (dept.verificationCode !== verificationCode)
    return res.status(400).json({ message: "Invalid verification code" });

  if (dept.isRegistered)
    return res.status(400).json({ message: "Already registered" });

  dept.email = email;
  dept.password = await bcrypt.hash(password, 10);
  dept.isRegistered = true;
  await dept.save();

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

/* ================= COMPLAINT ================= */
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
      if (status === "निस्तारित" || status === "Resolved") {
      for (const doc of complaint.documents) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: doc.key,
          })
        );
      }

      // DB से भी original documents हटा दो
      complaint.documents = [];
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