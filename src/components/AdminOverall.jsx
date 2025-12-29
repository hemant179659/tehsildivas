// React hooks for state and lifecycle
import { useEffect, useState } from "react";

// React Router navigation
import { useNavigate } from "react-router-dom";

// Axios for API requests
import axios from "axios";

// Toast notifications
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Overall Summary Component
export default function AdminOverall() {
  const navigate = useNavigate();

  // Check admin login status from localStorage
  const isAdmin = localStorage.getItem("isAdmin");

  // ================= STATE =================
  const [tableData, setTableData] = useState([]); // Aggregated department-wise data
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Responsive check

  /* ================= RESIZE ================= */
  // Handle screen resize for responsive UI
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= ADMIN PROTECT ================= */
  // Protect admin route: redirect if not logged in
  useEffect(() => {
    if (!isAdmin) {
      toast.warning("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [isAdmin, navigate]);

  /* ================= FETCH + AGGREGATE ================= */
  // Fetch all complaints and aggregate department-wise statistics
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/department/department-complaints?all=true`
      )
      .then((res) => {
        const complaints = res.data.complaints || [];

        // Temporary map for aggregation
        const map = {};

        complaints.forEach((c) => {
          // Initialize department entry if not exists
          if (!map[c.department]) {
            map[c.department] = {
              department: c.department,
              total: 0,
              pending: 0,
              progress: 0,
              resolved: 0,
            };
          }

          // Increment total complaints
          map[c.department].total += 1;

          // Increment status-wise counters
          if (c.status === "लंबित") map[c.department].pending += 1;
          if (c.status === "प्रक्रिया में") map[c.department].progress += 1;
          if (c.status === "निस्तारित") map[c.department].resolved += 1;
        });

        // Convert map to array for table rendering
        setTableData(Object.values(map));
      })
      .catch(() => toast.error("डेटा लोड नहीं हो सका"));
  }, []);

  return (
    <>
      {/* Toast container */}
      <ToastContainer autoClose={2000} />

      <div
        style={{
          ...page,
          padding: isMobile ? "15px" : "30px",
          paddingBottom: "80px",
        }}
      >
        {/* Page heading */}
        <h1
          style={{
            ...heading,
            fontSize: isMobile ? "1.4rem" : "1.8rem",
          }}
        >
          📊 विभाग-वार शिकायतों की स्थिति (Summary)
        </h1>

        {/* No data state */}
        {tableData.length === 0 ? (
          <p style={noData}>कोई डेटा उपलब्ध नहीं है</p>
        ) : (
          // Table wrapper for horizontal scroll on mobile
          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>विभाग</th>
                  <th style={th}>कुल</th>
                  <th style={{ ...th, color: "#dc3545" }}>लंबित</th>
                  <th style={{ ...th, color: "#ffc107" }}>प्रक्रिया में</th>
                  <th style={{ ...th, color: "#198754" }}>निस्तारित</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={tdDept}>{row.department}</td>
                    <td style={td}>{row.total}</td>
                    <td style={{ ...td, color: "#dc3545", fontWeight: 900 }}>
                      {row.pending}
                    </td>
                    <td style={{ ...td, color: "#ffc107", fontWeight: 900 }}>
                      {row.progress}
                    </td>
                    <td style={{ ...td, color: "#198754", fontWeight: 900 }}>
                      {row.resolved}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

/* ===================== STYLES ===================== */

// Page container
const page = {
  minHeight: "100vh",
  background: "#f4f6f9",
  color: "#000",
};

// Page heading
const heading = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 25,
  color: "#000",
};

// No data text
const noData = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1.1rem",
};

// Table wrapper for responsiveness
const tableWrapper = {
  overflowX: "auto",
};

// Table styles
const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
};

// Table header cell
const th = {
  padding: 12,
  border: "1px solid #ddd",
  background: "#002147",
  color: "#fff",
  fontWeight: 900,
  textAlign: "center",
};

// Table data cell
const td = {
  padding: 10,
  border: "1px solid #ddd",
  textAlign: "center",
  fontWeight: 700,
};

// Department name cell
const tdDept = {
  ...td,
  textAlign: "left",
  fontWeight: 900,
  color: "#002147",
};

/* ================= FOOTER ================= */

// Footer styles
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
