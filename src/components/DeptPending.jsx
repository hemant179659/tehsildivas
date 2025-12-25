import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileAlt } from "react-icons/fa";

export default function DeptPending() {
  const department = localStorage.getItem("loggedInDepartment");

  const [complaints, setComplaints] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ================= RESIZE ================= */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/department/department-complaints?department=${department}`
      )
      .then((res) => {
        const pending = (res.data.complaints || []).filter(
          (c) => c.status === "लंबित"
        );
        setComplaints(pending);
      })
      .catch(() => toast.error("लोड नहीं हो सका"));
  }, [department]);

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div
        style={{
          ...page,
          padding: isMobile ? "15px" : "30px",
          paddingBottom: "80px",
        }}
      >
        <h1
          style={{
            ...heading,
            fontSize: isMobile ? "1.4rem" : "1.8rem",
          }}
        >
          🟥 लंबित शिकायतें
        </h1>

        {complaints.length === 0 ? (
          <p style={noData}>कोई शिकायत उपलब्ध नहीं है</p>
        ) : (
          complaints.map((c) => (
            <div key={c.complaintId} style={card}>
              {/* ===== TOP ROW (LEFT + RIGHT) ===== */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "2fr 1.3fr",
                  gap: 20,
                }}
              >
                {/* ========== LEFT SIDE ========== */}
                <div>
                  <p>
                    <b>शिकायत ID:</b> {c.complaintId}
                  </p>

                  <p>
                    <b>नाम:</b> {c.complainantName}
                  </p>

                  <p>
                    <b>स्थिति:</b>{" "}
                    <span style={statusRed}>{c.status}</span>
                  </p>

                  <p>
                    <b>विवरण:</b> {c.complaintDetails}
                  </p>

                  {/* शिकायत के साथ संलग्न दस्तावेज़ */}
                  {c.documents?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <b>संलग्न दस्तावेज़:</b>
                      {c.documents.map((d, i) => (
                        <div key={i} style={docRow}>
                          <FaFileAlt />
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            style={docLink}
                          >
                            दस्तावेज़ {i + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ========== RIGHT SIDE ========== */}
                <div
                  style={{
                    background: "#ffffff",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <p>
                    <b>शिकायत सौंपे जाने वाला अधिकारी:</b>{" "}
                    {c.assignedBy || "—"}
                  </p>
                  <p>
                    <b>शिकायत सौंपा गया स्थान:</b>{" "}
                    {c.assignedPlace || "—"}
                  </p>
                  <p>
                    <b>शिकायत सौंपे जाने की तिथि:</b>{" "}
                    {c.assignedDate
                      ? new Date(c.assignedDate).toLocaleDateString("en-IN")
                      : "—"}
                  </p>

                  {/* Pending में normally नहीं होंगे, फिर भी safe */}
                  {c.supportingDocuments?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <b>विभाग द्वारा संलग्न दस्तावेज़:</b>
                      {c.supportingDocuments.map((d, i) => (
                        <div key={i} style={docRow}>
                          <FaFileAlt />
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            style={docLink}
                          >
                            दस्तावेज़ {i + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== FIXED FOOTER ===== */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </>
  );
}

/* ===================== STYLES ===================== */

const page = {
  minHeight: "100vh",
  background: "#f4f6f9",
  color: "#000",
};

const heading = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 25,
};

const noData = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.1rem",
};

const card = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 16,
  borderLeft: "6px solid #dc3545",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
};

const statusRed = {
  fontWeight: 900,
  color: "#dc3545",
};

const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 6,
};

const docLink = {
  color: "#0d6efd",
  fontWeight: 700,
  textDecoration: "underline",
};

/* ================= FOOTER ================= */

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
