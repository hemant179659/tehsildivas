import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeptResolved() {
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
        `/api/department/department-complaints?department=${department}`
      )
      .then((res) => {
        const resolved = (res.data.complaints || []).filter(
          (c) => c.status === "निस्तारित"
        );
        setComplaints(resolved);
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
          🟩 निस्तारित शिकायतें
        </h1>

        {complaints.length === 0 ? (
          <p style={empty}>कोई निस्तारित शिकायत उपलब्ध नहीं है</p>
        ) : (
          complaints.map((c) => (
            <div key={c.complaintId} style={card}>
              <p>
                <b>शिकायत ID:</b> {c.complaintId}
              </p>

              <p>
                <b>विवरण:</b> {c.complaintDetails}
              </p>

              <p>
                <b>स्थिति:</b>{" "}
                <span style={status}>निस्तारित</span>
              </p>

              <div style={remarkBox}>
                <b>अंतिम टिप्पणी:</b>
                <div style={{ marginTop: 4 }}>
                  {c.remarksHistory?.slice(-1)[0]?.remark || "—"}
                </div>
              </div>
            </div>
          ))
        )}
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

const empty = {
  textAlign: "center",
  fontWeight: 700,
  fontSize: "1rem",
};

const card = {
  background: "#ffffff",
  border: "2px solid #198754",
  borderLeft: "8px solid #198754",
  padding: 20,
  borderRadius: 10,
  marginBottom: 18,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const status = {
  color: "#198754",
  fontWeight: 900,
};

const remarkBox = {
  marginTop: 10,
  background: "#e9f7ef",
  border: "1px solid #198754",
  padding: 10,
  borderRadius: 6,
  fontWeight: 600,
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
