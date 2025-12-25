import mongoose from "mongoose";

/* =========================
   DEPARTMENT SCHEMA
========================= */
const departmentSchema = new mongoose.Schema(
  {
    deptName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

/* =========================
   PROJECT SCHEMA
========================= */
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    department: { type: String, required: true },
    budgetAllocated: { type: Number, required: true },
    remainingBudget: { type: Number, required: true },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    remarks: { type: String, default: "" },

    photos: [
      {
        url: String,
        key: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

/* =========================
   COMPLAINT SCHEMA
========================= */
const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },

    complainantName: { type: String, required: true },
    guardianName: { type: String, required: true },
    address: { type: String, required: true },

    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    complaintDetails: { type: String, required: true },

    /* OPERATOR DOCUMENTS */
    documents: [
      {
        url: String,
        key: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    /* DEPARTMENT SUPPORTING DOCUMENTS */
    supportingDocuments: [
      {
        url: String,
        key: String,
        uploadedBy: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    assignedBy: { type: String, required: true },
    assignedPlace: { type: String, required: true },
    assignedDate: { type: Date, required: true },
    department: { type: String, required: true },

    status: {
      type: String,
      enum: ["लंबित", "प्रक्रिया में", "निस्तारित"],
      default: "लंबित",
    },

    remarksHistory: [
      {
        department: String,
        status: String,
        remark: String,
        actionDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export { Department, Project, Complaint };
