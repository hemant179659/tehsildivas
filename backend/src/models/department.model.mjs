// Import mongoose ODM for MongoDB schema and model creation
import mongoose from "mongoose";

/* =========================
   DEPARTMENT SCHEMA
========================= */

// Schema for government departments
const departmentSchema = new mongoose.Schema(
  {
    // Department name (unique and trimmed to avoid extra spaces)
    deptName: { type: String, required: true, unique: true, trim: true },

    // Verification code used during department signup
    verificationCode: { type: String, required: true },

    // Department email (can be empty during seed, hence sparse)
    email: {
      type: String,
      unique: true,
      lowercase: true, // always stored in lowercase
      sparse: true, // allows multiple docs with null email during seeding
    },

    // Hashed password (set only after signup)
    password: { type: String },

    // Flag to prevent multiple registrations
    isRegistered: { type: Boolean, default: false },

    // Password reset token
    resetToken: String,

    // Token expiry time
    resetTokenExpiry: Date,
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create Department model
const Department = mongoose.model("Department", departmentSchema);

/* =========================
   ADMIN SCHEMA
========================= */

// Schema for admin users
const adminSchema = new mongoose.Schema({
  // Admin login email
  email: { type: String, required: true, unique: true },

  // Hashed admin password
  password: { type: String, required: true }
});

// Create Admin model
export const Admin = mongoose.model("Admin", adminSchema);

/* =========================
   OPERATOR SCHEMA
========================= */

// Schema for data entry operators (tehsil level)
const operatorSchema = new mongoose.Schema({
  // Tehsil assigned to operator
  tehsil: { type: String, required: true },

  // Operator login email
  email: { type: String, required: true },

  // Hashed password
  password: { type: String, required: true },

  // Display name of operator
  operatorName: { type: String, required: true },
});

// Create Operator model
export const Operator = mongoose.model("Operator", operatorSchema);



/* =========================
   COMPLAINT SCHEMA
========================= */

// Schema for public complaints registered at tehsil level
const complaintSchema = new mongoose.Schema(
  {
    // Unique complaint tracking ID
    complaintId: { type: String, required: true, unique: true, index: true },

    // Name of complainant
    complainantName: { type: String, required: true },

    // Guardian/Father/Husband name
    guardianName: { type: String, required: true },

    // Address of complainant
    address: { type: String, required: true },

    // Tehsil from where complaint is registered
    tehsil: { type: String, required: true },

    // Mobile number (10-digit validation)
    mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    // Complaint description
    complaintDetails: { type: String, required: true },

    // Documents uploaded during complaint registration
    documents: [
      {
        // File public URL (S3)
        url: String,

        // S3 object key
        key: String,

        // Upload timestamp
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Supporting documents uploaded by department
    supportingDocuments: [
      {
        // File public URL
        url: String,

        // S3 object key
        key: String,

        // Department who uploaded document
        uploadedBy: String,

        // Upload timestamp
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Authority who assigned complaint
    assignedBy: { type: String, required: true },

    // Location where complaint was assigned
    assignedPlace: { type: String, required: true },

    // Assignment date
    assignedDate: { type: Date, required: true },

    // Department currently handling complaint
    department: { type: String, required: true },

    // Current complaint status
    status: {
      type: String,
      enum: ["लंबित", "प्रक्रिया में", "निस्तारित"],
      default: "लंबित",
    },

    // Full history of department actions
    remarksHistory: [
      {
        // Department name
        department: String,

        // Status at that time
        status: String,

        // Department remarks
        remark: String,

        // Action timestamp
        actionDate: { type: Date, default: Date.now },
      },
    ],
  },
  {
    // Automatically add createdAt and updatedAt
    timestamps: true,
  }
);

// Create Complaint model
const Complaint = mongoose.model("Complaint", complaintSchema);

// Export models for use in controllers
export { Department, Complaint };
