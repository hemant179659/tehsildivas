import { useEffect, useState, useRef } from "react";
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
} from "react-icons/fa";

export default function DepartmentAction() {
  const navigate = useNavigate();
  const loggedDepartment = localStorage.getItem("loggedInDepartment");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [supportDocs, setSupportDocs] = useState({});
  const fileInputRefs = useRef({});

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
          `${import.meta.env.VITE_API_URL}/department/department-complaints?department=${loggedDepartment}`
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

  /* ================= HELPERS ================= */
  const statusColor = (status) => {
    if (status === "लंबित") return "#dc3545";
    if (status === "प्रक्रिया में") return "#ffc107";
    if (status === "निस्तारित") return "#198754";
    return "#000";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN");
  };

  /* ================= SUPPORT DOC HANDLERS ================= */
  const handleSupportDocs = (id, files) => {
    setSupportDocs((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ...Array.from(files)],
    }));
  };

  const removeSupportDoc = (complaintId, index) => {
    setSupportDocs((prev) => {
      const files = [...(prev[complaintId] || [])];
      files.splice(index, 1);
      return { ...prev, [complaintId]: files };
    });
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (complaintId, status) => {
    const remarkText = remarks[complaintId];
    if (!remarkText || !remarkText.trim()) {
      return toast.warning("कृपया टिप्पणी दर्ज करें");
    }

    try {
      setActionLoading(true);

      const formData = new FormData();
      formData.append("status", status);
      formData.append("remark", remarkText);
      formData.append("department", loggedDepartment);

      (supportDocs[complaintId] || []).forEach((file) => {
        formData.append("supportDocs", file);
      });

      await axios.put(
        `${import.meta.env.VITE_API_URL}/department/update-status/${complaintId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("स्थिति अपडेट हो गई");

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

      if (status === "निस्तारित") {
        setComplaints((prev) =>
          prev.filter((c) => c.complaintId !== complaintId)
        );
      }

      setRemarks((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });

      setSupportDocs((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });

      if (fileInputRefs.current[complaintId]) {
        fileInputRefs.current[complaintId].value = "";
      }
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
                    {/* ================= LEFT ================= */}
                    <div>
                      <p><b>शिकायत ID:</b> {c.complaintId}</p>
                      <p><b>नाम:</b> {c.complainantName}</p>
                      <p><b>मोबाइल:</b> {c.mobile}</p>

                      {/* स्थिति */}
                      <p style={{ marginTop: 6 }}>
                        <b>स्थिति:</b>{" "}
                        <span style={{ fontWeight: 900, color: statusColor(c.status) }}>
                          {c.status}
                        </span>
                      </p>

                      {/* विवरण */}
                      <p><b>विवरण:</b> {c.complaintDetails}</p>

                      {/* शिकायत के साथ संलग्न दस्तावेज़ */}
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

                    {/* ================= RIGHT ================= */}
                    <div style={{ background: "#fff", padding: 12, borderRadius: 6 }}>
                      <p><b>शिकायत सौंपे जाने वाला अधिकारी:</b> {c.assignedBy}</p>
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

                  {/* नवीनतम टिप्पणी */}
                  {latestRemark && (
                    <p style={{ marginTop: 10 }}>
                      <b>नवीनतम टिप्पणी:</b> <i>{latestRemark}</i>
                    </p>
                  )}

                  {/* टिप्पणी input */}
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

                  {/* supporting docs upload */}
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

const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
};

const docLink = {
  color: "#0d6efd",
  textDecoration: "underline",
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
