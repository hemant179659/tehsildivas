import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaCheckCircle,
  FaSpinner,
  FaFileAlt,
  FaUpload,
} from "react-icons/fa";

export default function DepartmentAction() {
  const navigate = useNavigate();
  const loggedDepartment = localStorage.getItem("loggedInDepartment");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔹 supporting docs state
  const [showUpload, setShowUpload] = useState(null); // complaintId
  const [supportDocs, setSupportDocs] = useState({});

  /* ================= RESIZE ================= */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
    if (!loggedDepartment) {
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDepartment, navigate]);

  /* ================= FETCH COMPLAINTS ================= */
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `/api/department/department-complaints?department=${loggedDepartment}`
        );

        const active = (res.data.complaints || []).filter(
          (c) => c.status !== "निस्तारित"
        );

        setComplaints(active);
      } catch {
        toast.error("शिकायतें लोड नहीं हो सकीं");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [loggedDepartment]);

  /* ================= STATUS COLOR ================= */
  const statusColor = (status) => {
    if (status === "लंबित") return "#dc3545";
    if (status === "प्रक्रिया में") return "#ffc107";
    if (status === "निस्तारित") return "#198754";
    return "#000";
  };

  /* ================= FILE HANDLING ================= */
  const handleSupportFile = (id, files) => {
    setSupportDocs((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ...Array.from(files)],
    }));
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (complaintId, status) => {
    const remark = remarks[complaintId];
    if (!remark || !remark.trim()) {
      return toast.warning("कृपया टिप्पणी दर्ज करें");
    }

    // अगर निस्तारित → पूछो documents?
    if (status === "निस्तारित" && showUpload !== complaintId) {
      const confirm = window.confirm(
        "क्या आप कोई supporting document जोड़ना चाहते हैं?"
      );
      if (confirm) {
        setShowUpload(complaintId);
        return;
      }
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("status", status);
      formData.append("remark", remark);
      formData.append("department", loggedDepartment);

      (supportDocs[complaintId] || []).forEach((file) =>
        formData.append("supportDocs", file)
      );

      await axios.put(
        `/api/department/update-status/${complaintId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("स्थिति अपडेट हो गई");

      setComplaints((prev) =>
        prev.filter((c) => c.complaintId !== complaintId)
      );

      setRemarks((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });

      setShowUpload(null);
    } catch {
      toast.error("अपडेट करने में त्रुटि");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInDepartment");
    navigate("/dept-login", { replace: true });
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#fff",
          flexDirection: isMobile ? "column" : "row",
          paddingBottom: "80px",
        }}
      >
        {/* ================= SIDEBAR ================= */}
        <aside style={{ ...sidebar, width: isMobile ? "100%" : 260 }}>
          <FaUserCircle size={48} />
          <h3 style={{ marginTop: 10 }}>{loggedDepartment}</h3>

          <div style={sideItem}><FaTachometerAlt /> Dashboard</div>
          <div onClick={handleLogout} style={{ cursor: "pointer", marginTop: 30 }}>
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={{ ...main, padding: isMobile ? 15 : 30 }}>
          <h1 style={title}>विभागीय शिकायतें (कार्यवाही)</h1>

          {loading ? (
            <p style={centerText}>लोड हो रहा है...</p>
          ) : complaints.length === 0 ? (
            <p style={centerText}>कोई सक्रिय शिकायत उपलब्ध नहीं है</p>
          ) : (
            complaints.map((c) => (
              <div key={c.complaintId} style={card}>
                <p><b>शिकायत ID:</b> {c.complaintId}</p>
                <p><b>नाम:</b> {c.complainantName}</p>
                <p><b>मोबाइल:</b> {c.mobile}</p>
                <p><b>विवरण:</b> {c.complaintDetails}</p>

                {/* 🔹 NEW FIELDS */}
                <p><b>सौंपने वाला अधिकारी:</b> {c.assignedBy}</p>
                <p><b>सौंपा गया स्थान:</b> {c.assignedPlace}</p>
                <p><b>सौंपने की तिथि:</b> {c.assignedDate}</p>

                <p>
                  <b>स्थिति:</b>{" "}
                  <span style={{ fontWeight: 900, color: statusColor(c.status) }}>
                    {c.status}
                  </span>
                </p>

                <textarea
                  style={textarea}
                  placeholder="यहाँ टिप्पणी लिखें..."
                  value={remarks[c.complaintId] || ""}
                  onChange={(e) =>
                    setRemarks((p) => ({
                      ...p,
                      [c.complaintId]: e.target.value,
                    }))
                  }
                />

                {showUpload === c.complaintId && (
                  <div style={{ marginTop: 10 }}>
                    <label><b>Supporting Documents</b></label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleSupportFile(c.complaintId, e.target.files)
                      }
                    />
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <button
                    style={btnYellow}
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus(c.complaintId, "प्रक्रिया में")
                    }
                  >
                    <FaSpinner /> प्रक्रिया में
                  </button>

                  <button
                    style={btnGreen}
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus(c.complaintId, "निस्तारित")
                    }
                  >
                    <FaCheckCircle /> निस्तारित
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const sidebar = {
  background: "#002147",
  color: "#fff",
  padding: 20,
};

const sideItem = {
  marginTop: 14,
  cursor: "pointer",
  fontWeight: 700,
};

const main = {
  flex: 1,
  background: "#fff",
  color: "#000",
};

const title = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 20,
};

const centerText = {
  textAlign: "center",
  fontWeight: 700,
};

const card = {
  background: "#f8f9fa",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
};

const textarea = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #000",
};

const btnYellow = {
  marginRight: 10,
  padding: "8px 14px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: 5,
};

const btnGreen = {
  padding: "8px 14px",
  background: "#198754",
  color: "#fff",
  border: "none",
  borderRadius: 5,
};

const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 999,
};
