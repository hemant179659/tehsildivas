import { useEffect, useState } from "react";
import axios from "axios";

export default function DeptOverall() {
  const department = localStorage.getItem("loggedInDepartment");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });

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
      });
  }, [department]);

  return (
    <div style={page}>
      <h1 style={heading}>📊 शिकायत सारांश</h1>

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
  );
}

/* ===================== STYLES ===================== */

const page = {
  minHeight: "100vh",
  padding: "30px",
  background: "#f4f6f9",
  color: "#000",
};

const heading = {
  textAlign: "center",
  fontWeight: 900,
  fontSize: "1.9rem",
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
