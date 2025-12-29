// React hooks for lifecycle and state
import { useEffect, useState } from "react";

// React Router hook for navigation
import { useNavigate } from "react-router-dom";

// Axios for API requests
import axios from "axios";

// Toast notifications for error / success messages
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons used in sidebar UI
import {
  FaTachometerAlt,
  FaList,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

// Registered Complaints component (Operator Panel)
export default function RegisteredComplaints() {
  const navigate = useNavigate();

  // 🔐 SESSION
  const loggedTehsil = localStorage.getItem("loggedTehsil");
  const operatorName =
    localStorage.getItem("dataEntryOperator") || "Data Entry Operator";

  // Complaints list state
  const [complaints, setComplaints] = useState([]);

  // Loading indicator state
  const [loading, setLoading] = useState(true);

  // 🚫 PROTECT ROUTE (redirect if operator not logged in)
  useEffect(() => {
    if (!loggedTehsil) {
      navigate("/operator-login", { replace: true });
    }
  }, [loggedTehsil, navigate]);

  // 📥 FETCH COMPLAINTS BY TEHSIL
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/department/department-complaints?tehsil=${loggedTehsil}`

          
        );
        // Store complaints received from backend
        setComplaints(res.data.complaints || []);
      } catch {
        // Error toast if API fails
        toast.error("शिकायतें लोड करने में त्रुटि");
      } finally {
        // Stop loading spinner
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [loggedTehsil]);

  // 🔓 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("dataEntryOperator");
    localStorage.removeItem("loggedTehsil");
    navigate("/operator-login", { replace: true });
  };

  // 📅 DATE + TIME (IST)
  // Converts MongoDB date to readable Indian format
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Toast notification container */}
      <ToastContainer autoClose={2000} />

      <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
        {/* ================= SIDEBAR ================= */}
        <aside
          style={{
            width: 240,
            background: "#002147",
            color: "#fff",
            padding: 20,
          }}
        >
          {/* Operator information */}
          <div style={{ textAlign: "center", marginBottom: 25 }}>
            <FaUserCircle size={48} />
            <h3 style={{ fontWeight: 800 }}>{operatorName}</h3>
            <p style={{ fontSize: "0.8rem" }}>{loggedTehsil}</p>
          </div>

          {/* Dashboard navigation */}
          <div
            onClick={() => navigate("/operator-dashboard")}
            style={{ cursor: "pointer", marginBottom: 12 }}
          >
            <FaTachometerAlt /> Dashboard
          </div>

          {/* Current page indicator */}
          <div style={{ marginBottom: 12, fontWeight: 800 }}>
            <FaList /> Registered Complaints
          </div>

          {/* Logout button */}
          <div onClick={handleLogout} style={{ cursor: "pointer" }}>
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={{ flex: 1, padding: 30, background: "#fff" }}>
          <h1
            style={{
              textAlign: "center",
              fontWeight: 900,
              color: "#000",
              marginBottom: 20,
            }}
          >
            पंजीकृत शिकायतें
          </h1>

          {/* Loading state */}
          {loading ? (
            <p style={{ textAlign: "center", fontWeight: 700 }}>
              डेटा लोड हो रहा है...
            </p>
          ) : complaints.length === 0 ? (
            /* No complaints message */
            <p style={{ textAlign: "center", fontWeight: 700 }}>
              इस तहसील के लिए कोई शिकायत उपलब्ध नहीं है
            </p>
          ) : (
            /* Complaints table */
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontWeight: 700,
                  color: "#000",
                }}
              >
                <thead>
                  <tr style={{ background: "#002147", color: "#fff" }}>
                    <th style={th}>Complaint ID</th>
                    <th style={th}>नाम</th>
                    <th style={th}>मोबाइल</th>
                    <th style={th}>विभाग</th>
                    <th style={th}>तिथि / समय</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((c, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? "#f8f9fa" : "#fff",
                      }}
                    >
                      <td style={td}>{c.complaintId}</td>
                      <td style={td}>{c.complainantName}</td>
                      <td style={td}>{c.mobile}</td>
                      <td style={td}>{c.department}</td>
                      {/* Created date & time */}
                      <td style={td}>{formatDateTime(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          width: "100vw",
          backgroundColor: "#f8f9fa",
          borderTop: "3px solid #0056b3",
          padding: 12,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#002147" }}>
          District Administration
        </p>
        <p style={{ margin: "2px 0", fontSize: "0.7rem", color: "#000" }}>
          Designed and Developed by <strong>District Administration</strong>
        </p>
      </footer>
    </>
  );
}

// ================= TABLE STYLES =================

// Table header cell style
const th = {
  padding: "10px",
  border: "1px solid #ddd",
  textAlign: "left",
};

// Table data cell style
const td = {
  padding: "10px",
  border: "1px solid #ddd",
};
