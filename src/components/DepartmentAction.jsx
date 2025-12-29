// React hooks: useState for state, useEffect for lifecycle, useRef for file inputs
import { useEffect, useState, useRef } from "react";

// React Router navigation hook
import { useNavigate } from "react-router-dom";

// Axios for API calls
import axios from "axios";

// Toast notifications
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons used in UI
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaCheckCircle,
  FaSpinner,
  FaFileAlt,
} from "react-icons/fa";

// Main component for department complaint action
export default function DepartmentAction() {
  const navigate = useNavigate();

  // Logged-in department name from localStorage
  const loggedDepartment = localStorage.getItem("loggedInDepartment");

  // ================= STATE =================
  const [complaints, setComplaints] = useState([]);       // Active complaints list
  const [loading, setLoading] = useState(true);           // Initial loading state
  const [remarks, setRemarks] = useState({});             // Remarks per complaint
  const [actionLoading, setActionLoading] = useState(false); // Status update loading
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Responsive check

  // Supporting documents selected per complaint
  const [supportDocs, setSupportDocs] = useState({});

  // File input refs (per complaint) to reset input after submit
  const fileInputRefs = useRef({});

  /* ================= RESIZE ================= */
  // Handle window resize for responsive layout
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= PROTECT ROUTE ================= */
  // Redirect to login if department is not logged in
  useEffect(() => {
    if (!loggedDepartment) {
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDepartment, navigate]);

  /* ================= FETCH COMPLAINTS ================= */
  // Fetch complaints assigned to the logged-in department
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/department/department-complaints?department=${loggedDepartment}`
        );

        // Filter only active (non-resolved) complaints
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

  /* ================= HELPERS ================= */
  // Return color based on complaint status
  const statusColor = (status) => {
    if (status === "लंबित") return "#dc3545";
    if (status === "प्रक्रिया में") return "#ffc107";
    if (status === "निस्तारित") return "#198754";
    return "#000";
  };

  // Format date for display (India)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  /* ================= SUPPORT DOC HANDLERS ================= */
  // Add selected supporting documents for a complaint
  const handleSupportDocs = (id, files) => {
    setSupportDocs((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ...Array.from(files)],
    }));
  };

  // Remove a selected supporting document
  const removeSupportDoc = (complaintId, index) => {
    setSupportDocs((prev) => {
      const files = [...(prev[complaintId] || [])];
      files.splice(index, 1);
      return { ...prev, [complaintId]: files };
    });
  };

  /* ================= UPDATE STATUS ================= */
  // Update complaint status with remark and optional documents
  const updateStatus = async (complaintId, status) => {
    const remarkText = remarks[complaintId];

    // Require remark before update
    if (!remarkText || !remarkText.trim()) {
      return toast.warning("कृपया टिप्पणी दर्ज करें");
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("status", status);
      formData.append("remark", remarkText);
      formData.append("department", loggedDepartment);

      // Attach supporting documents
      (supportDocs[complaintId] || []).forEach((file) => {
        formData.append("supportDocs", file);
      });

      // API call to update complaint status
      await axios.put(
        `${import.meta.env.VITE_API_URL}/department/update-status/${complaintId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("स्थिति अपडेट हो गई");

      // Update local state
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaintId === complaintId
            ? {
                ...c,
                status,
                remarksHistory: [
                  ...(c.remarksHistory || []),
                  {
                    department: loggedDepartment,
                    status,
                    remark: remarkText,
                  },
                ],
              }
            : c
        )
      );

      // Remove resolved complaint from list
      if (status === "निस्तारित") {
        setComplaints((prev) =>
          prev.filter((c) => c.complaintId !== complaintId)
        );
      }

      // Clear remark input
      setRemarks((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });

      // Clear supporting documents
      setSupportDocs((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });

      // Reset file input
      if (fileInputRefs.current[complaintId]) {
        fileInputRefs.current[complaintId].value = "";
      }
    } catch {
      toast.error("अपडेट करने में त्रुटि");
    } finally {
      setActionLoading(false);
    }
  };

  // Logout department
  const handleLogout = () => {
    localStorage.removeItem("loggedInDepartment");
    navigate("/dept-login", { replace: true });
  };

  return (
    <>
      {/* Toast notifications */}
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
          <div style={sideItem} onClick={() => navigate("/dept/pending")}>🟥 लंबित शिकायतें</div>
          <div style={sideItem} onClick={() => navigate("/dept/in-progress")}>🟨 प्रक्रिया में शिकायतें</div>
          <div style={sideItem} onClick={() => navigate("/dept/resolved")}>🟩 निस्तारित शिकायतें</div>
          <div style={sideItem} onClick={() => navigate("/dept/overall")}>📊 Overall Status</div>

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
            complaints.map((c) => {
              const latestRemark =
                c.remarksHistory?.length > 0
                  ? c.remarksHistory[c.remarksHistory.length - 1].remark
                  : "";

              return (
                <div key={c.complaintId} style={card}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "2fr 1.3fr",
                      gap: 20,
                    }}
                  >
                    {/* LEFT SIDE */}
                    <div>
                      <p><b>शिकायत ID:</b> {c.complaintId}</p>
                      <p><b>नाम:</b> {c.complainantName}</p>
                      <p><b>मोबाइल:</b> {c.mobile}</p>

                      <p style={{ marginTop: 6 }}>
                        <b>स्थिति:</b>{" "}
                        <span style={{ fontWeight: 900, color: statusColor(c.status) }}>
                          {c.status}
                        </span>
                      </p>

                      <p><b>विवरण:</b> {c.complaintDetails}</p>

                      {c.documents?.length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <b>संलग्न दस्तावेज़:</b>
                          {c.documents.map((doc, idx) => (
                            <div key={idx} style={docRow}>
                              <FaFileAlt />
                              <a href={doc.url} target="_blank" rel="noreferrer" style={docLink}>
                                दस्तावेज़ {idx + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* RIGHT SIDE */}
                    <div style={{ background: "#fff", padding: 12, borderRadius: 6 }}>
                      <p><b>शिकायत सौंपने वाला अधिकारी:</b> {c.assignedBy}</p>
                      <p><b>शिकायत सौंपा गया स्थान:</b> {c.assignedPlace}</p>
                      <p><b>शिकायत सौंपे जाने की तिथि:</b> {formatDate(c.assignedDate)}</p>

                      {c.supportingDocuments?.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <b>विभाग द्वारा संलग्न दस्तावेज़:</b>
                          {c.supportingDocuments.map((doc, idx) => (
                            <div key={idx} style={docRow}>
                              <FaFileAlt />
                              <a href={doc.url} target="_blank" rel="noreferrer" style={docLink}>
                                दस्तावेज़ {idx + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {latestRemark && (
                    <p style={{ marginTop: 10 }}>
                      <b>नवीनतम टिप्पणी:</b> <i>{latestRemark}</i>
                    </p>
                  )}

                  {/* Remark input */}
                  <textarea
                    style={textarea}
                    placeholder="यहाँ टिप्पणी लिखें..."
                    value={remarks[c.complaintId] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [c.complaintId]: e.target.value,
                      }))
                    }
                  />

                  {/* Supporting document upload */}
                  <input
                    type="file"
                    multiple
                    ref={(el) => (fileInputRefs.current[c.complaintId] = el)}
                    onChange={(e) =>
                      handleSupportDocs(c.complaintId, e.target.files)
                    }
                  />

                  {supportDocs[c.complaintId]?.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <b>Selected Supporting Documents:</b>
                      {supportDocs[c.complaintId].map((file, idx) => (
                        <div key={idx} style={{ display: "flex", gap: 8 }}>
                          <span>{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSupportDoc(c.complaintId, idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "red",
                              cursor: "pointer",
                            }}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ marginTop: 10 }}>
                    <button
                      style={btnYellow}
                      disabled={actionLoading}
                      onClick={() => updateStatus(c.complaintId, "प्रक्रिया में")}
                    >
                      <FaSpinner /> प्रक्रिया में
                    </button>
                    <button
                      style={btnGreen}
                      disabled={actionLoading}
                      onClick={() => updateStatus(c.complaintId, "निस्तारित")}
                    >
                      <FaCheckCircle /> निस्तारित
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* ================= FOOTER ================= */}
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

// Sidebar styles
const sidebar = {
  background: "#002147",
  color: "#fff",
  padding: 20,
};

// Sidebar item
const sideItem = {
  marginTop: 14,
  cursor: "pointer",
  fontWeight: 700,
};

// Main container
const main = {
  flex: 1,
  background: "#fff",
  color: "#000",
};

// Page title
const title = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 20,
};

// Center text
const centerText = {
  textAlign: "center",
  fontWeight: 700,
};

// Complaint card
const card = {
  background: "#f8f9fa",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
};

// Remark textarea
const textarea = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #000",
};

// Yellow button
const btnYellow = {
  marginRight: 10,
  padding: "8px 14px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: 5,
};

// Green button
const btnGreen = {
  padding: "8px 14px",
  background: "#198754",
  color: "#fff",
  border: "none",
  borderRadius: 5,
};

// Document row
const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
};

// Document link
const docLink = {
  color: "#0d6efd",
  textDecoration: "underline",
};

// Footer
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
