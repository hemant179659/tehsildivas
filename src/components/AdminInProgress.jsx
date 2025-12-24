import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileAlt } from "react-icons/fa";

export default function AdminInProgress() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin");

  const [grouped, setGrouped] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      toast.warning("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    axios
      .get("/api/department/department-complaints?all=true")
      .then((res) => {
        const inProgress = (res.data.complaints || []).filter(
          (c) => c.status === "प्रक्रिया में"
        );

        const map = {};
        inProgress.forEach((c) => {
          if (!map[c.department]) map[c.department] = [];
          map[c.department].push(c);
        });

        setGrouped(map);
      })
      .catch(() => toast.error("डेटा लोड नहीं हो सका"));
  }, []);

  const departments = Object.keys(grouped);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div style={{ ...page, padding: isMobile ? 15 : 30, paddingBottom: 80 }}>
        <h1 style={heading}>🟨 प्रक्रिया में शिकायतें (Department-wise)</h1>

        {departments.length === 0 && (
          <p style={noData}>कोई शिकायत उपलब्ध नहीं है</p>
        )}

        {departments.map((dept) => (
          <div key={dept} style={deptSection}>
            <h2 style={deptHeading}>
              {dept} ({grouped[dept].length})
            </h2>

            {grouped[dept].map((c) => (
              <div key={c.complaintId} style={card}>
                <Row label="शिकायत ID" value={c.complaintId} />
                <Row label="नाम" value={c.complainantName} />
                <Row label="विवरण" value={c.complaintDetails} />
                <Row label="स्थिति" value={c.status} valueStyle={statusYellow} />

                {c.documents?.length > 0 && (
                  <DocBox docs={c.documents} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

/* ---------- Helpers ---------- */
const Row = ({ label, value, valueStyle }) => (
  <div style={row}>
    <span style={labelStyle}>{label}:</span>
    <span style={{ ...valueStyleBase, ...valueStyle }}>{value}</span>
  </div>
);

const DocBox = ({ docs }) => (
  <div style={docBox}>
    <span style={labelStyle}>संलग्न दस्तावेज़:</span>
    {docs.map((d, i) => (
      <a key={i} href={d.url} target="_blank" rel="noreferrer" style={docLink}>
        <FaFileAlt /> दस्तावेज़ {i + 1}
      </a>
    ))}
  </div>
);

const Footer = () => (
  <footer style={footerStyle}>
    <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
    <p style={{ margin: 0, fontSize: "0.75rem" }}>
      Designed & Developed by District Administration
    </p>
  </footer>
);

/* ---------- Styles ---------- */
const page = { minHeight: "100vh", background: "#f4f6f9", color: "#000" };
const heading = { textAlign: "center", fontWeight: 900, marginBottom: 25 };
const noData = { textAlign: "center", fontWeight: 700 };
const deptSection = { marginBottom: 35 };
const deptHeading = {
  fontWeight: 900,
  fontSize: "1.3rem",
  marginBottom: 15,
  color: "#002147",
  borderBottom: "3px solid #ffc107",
  paddingBottom: 6,
};
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 16,
  borderLeft: "6px solid #ffc107",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
};
const row = { marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" };
const labelStyle = { fontWeight: 800 };
const valueStyleBase = { fontWeight: 600 };
const statusYellow = { fontWeight: 900, color: "#ffc107" };
const docBox = { marginTop: 10, display: "flex", flexDirection: "column", gap: 6 };
const docLink = { color: "#0d6efd", fontWeight: 700, textDecoration: "none" };
const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  background: "#fff",
  textAlign: "center",
  padding: 10,
  borderTop: "4px solid #0056b3",
  zIndex: 999,
};
