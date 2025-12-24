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
        `http://localhost:8000/api/department/department-complaints?department=${department}`
      )
      .then((res) => {
        const pending = res.data.complaints.filter(
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
          paddingBottom: "80px", // footer space
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

        {complaints.length === 0 && (
          <p style={noData}>कोई शिकायत उपलब्ध नहीं है</p>
        )}

        {complaints.map((c) => (
          <div key={c.complaintId} style={card}>
            <div style={row}>
              <span style={label}>शिकायत ID:</span>
              <span style={value}>{c.complaintId}</span>
            </div>

            <div style={row}>
              <span style={label}>नाम:</span>
              <span style={value}>{c.complainantName}</span>
            </div>

            <div style={row}>
              <span style={label}>विवरण:</span>
              <span style={value}>{c.complaintDetails}</span>
            </div>

            <div style={row}>
              <span style={label}>स्थिति:</span>
              <span style={statusRed}>{c.status}</span>
            </div>

            {c.documents?.length > 0 && (
              <div style={docBox}>
                <span style={label}>संलग्न दस्तावेज़:</span>
                {c.documents.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    style={docLink}
                  >
                    <FaFileAlt /> दस्तावेज़ {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== FIXED FOOTER (SAME AS LOGIN) ===== */}
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

const row = {
  marginBottom: 8,
  display: "flex",
  gap: 6,
  flexWrap: "wrap",
};

const label = {
  fontWeight: 800,
  color: "#000",
};

const value = {
  fontWeight: 600,
  color: "#000",
};

const statusRed = {
  fontWeight: 900,
  color: "#dc3545",
};

const docBox = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const docLink = {
  color: "#0d6efd",
  fontWeight: 700,
  textDecoration: "none",
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
