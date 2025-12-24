import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeptOverall() {
  const department = localStorage.getItem("loggedInDepartment");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

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
        const all = res.data.complaints || [];
        setStats({
          total: all.length,
          pending: all.filter((c) => c.status === "लंबित").length,
          progress: all.filter((c) => c.status === "प्रक्रिया में").length,
          resolved: all.filter((c) => c.status === "निस्तारित").length,
        });
      })
      .catch(() => toast.error("डेटा लोड नहीं हो सका"));
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
            fontSize: isMobile ? "1.4rem" : "1.9rem",
          }}
        >
          📊 शिकायत सारांश
        </h1>

        <div style={grid}>
          <div style={{ ...card, ...blue }}>
            <h2 style={count}>{stats.total}</h2>
            <p style={label}>कुल शिकायतें</p>
          </div>

          <div style={{ ...card, ...red }}>
            <h2 style={count}>{stats.pending}</h2>
            <p style={label}>लंबित</p>
          </div>

          <div style={{ ...card, ...yellow }}>
            <h2 style={count}>{stats.progress}</h2>
            <p style={label}>प्रक्रिया में</p>
          </div>

          <div style={{ ...card, ...green }}>
            <h2 style={count}>{stats.resolved}</h2>
            <p style={label}>निस्तारित</p>
          </div>
        </div>
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
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  background: "#fff",
  padding: 25,
  borderRadius: 12,
  textAlign: "center",
  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  borderTop: "6px solid",
};

const count = {
  fontSize: "2.4rem",
  fontWeight: 900,
  marginBottom: 6,
};

const label = {
  fontSize: "1.1rem",
  fontWeight: 700,
};

/* ===== COLORS ===== */

const blue = {
  borderTopColor: "#0d6efd",
  color: "#0d6efd",
};

const red = {
  borderTopColor: "#dc3545",
  color: "#dc3545",
};

const yellow = {
  borderTopColor: "#ffc107",
  color: "#856404",
};

const green = {
  borderTopColor: "#198754",
  color: "#198754",
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
