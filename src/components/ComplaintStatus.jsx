import { useState } from "react";
import axios from "axios";
import { FaSearch, FaFileAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function ComplaintStatus() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("hi"); // hi | en

  const fetchStatus = async () => {
    if (!complaintId.trim()) {
      return toast.warning(
        lang === "hi"
          ? "कृपया शिकायत ID दर्ज करें"
          : "Please enter Complaint ID"
      );
    }

    try {
      setLoading(true);
      setComplaint(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/department/complaint-status/${complaintId}`
      );

      setComplaint(res.data.complaint);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (lang === "hi" ? "शिकायत नहीं मिली" : "Complaint not found")
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "लंबित" || status === "Pending") return "#b02a37";
    if (status === "प्रक्रिया में" || status === "In Progress") return "#b58105";
    if (status === "निस्तारित" || status === "Resolved") return "#146c43";
    return "#000";
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div style={pageWrapper} lang={lang}>
        {/* ================= SKIP LINK ================= */}
        <a href="#main-content" style={skipLink}>
          {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
        </a>

        {/* ================= LANGUAGE TOGGLE ================= */}
        <div style={langToggle}>
          <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>
            हिंदी
          </button>
          <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>
            EN
          </button>
        </div>

        {/* ================= MAIN ================= */}
        <main id="main-content" style={contentWrapper} role="main">
          <h1 style={title}>
            {lang === "hi" ? "शिकायत की स्थिति देखें" : "Check Complaint Status"}
          </h1>

          {/* SEARCH */}
          <div style={searchBox}>
            <label htmlFor="complaintId" style={srOnly}>
              {lang === "hi" ? "शिकायत ID" : "Complaint ID"}
            </label>
            <input
              id="complaintId"
              style={input}
              placeholder={
                lang === "hi" ? "शिकायत ID दर्ज करें" : "Enter Complaint ID"
              }
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
            />
            <button
              style={searchBtn}
              onClick={fetchStatus}
              disabled={loading}
            >
              <FaSearch />{" "}
              {lang === "hi" ? "खोजें" : "Search"}
            </button>
          </div>

          {loading && (
            <p style={center}>
              {lang === "hi" ? "लोड हो रहा है..." : "Loading..."}
            </p>
          )}

          {complaint && (
            <div style={card}>
              <Info
                label={lang === "hi" ? "शिकायत ID" : "Complaint ID"}
                value={complaint.complaintId}
              />
              <Info
                label={lang === "hi" ? "शिकायतकर्ता" : "Complainant"}
                value={complaint.complainantName}
              />
              <Info
                label={lang === "hi" ? "मोबाइल" : "Mobile"}
                value={complaint.mobile}
              />
              <Info
                label={lang === "hi" ? "पता" : "Address"}
                value={complaint.address}
              />
              <Info
                label={lang === "hi" ? "विवरण" : "Details"}
                value={complaint.complaintDetails}
              />

              <p style={row}>
                <b>{lang === "hi" ? "स्थिति" : "Status"}:</b>{" "}
                <span
                  style={{
                    color: statusColor(complaint.status),
                    fontWeight: 900,
                  }}
                >
                  {complaint.status}
                </span>
              </p>

              {/* LATEST REMARK */}
              {complaint.remarksHistory?.length > 0 && (
                <div style={remarkBox}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    {lang === "hi"
                      ? "नवीनतम टिप्पणी"
                      : "Latest Remark"}
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {
                      complaint.remarksHistory[
                        complaint.remarksHistory.length - 1
                      ].remark
                    }
                  </div>
                  <small style={{ fontWeight: 600 }}>
                    {new Date(
                      complaint.remarksHistory[
                        complaint.remarksHistory.length - 1
                      ].actionDate
                    ).toLocaleString("hi-IN")}
                  </small>
                </div>
              )}

              {/* DOCUMENTS */}
              {complaint.documents?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <b>
                    {lang === "hi"
                      ? "संलग्न दस्तावेज़"
                      : "Attached Documents"}
                  </b>
                  {complaint.documents.map((d, i) => (
                    <div key={i} style={docRow}>
                      <FaFileAlt />
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        style={docLink}
                      >
                        {lang === "hi"
                          ? `दस्तावेज़ ${i + 1}`
                          : `Document ${i + 1}`}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* ================= FOOTER (HOME LIKE) ================= */}
        <footer style={footerStyle} role="contentinfo">
          <p style={{ margin: 0, fontWeight: 700 }}>
            {lang === "hi"
              ? "जिला प्रशासन, उत्तराखंड"
              : "District Administration, Uttarakhand"}
          </p>
          <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>
            Designed & Developed by District Administration
          </p>

          <nav aria-label="Footer Navigation">
            <ul style={footerLinks}>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </footer>
      </div>
    </>
  );
}

/* ================= HELPERS ================= */

const Info = ({ label, value }) => (
  <p style={row}>
    <b>{label}:</b>{" "}
    <span style={{ fontWeight: 600, color: "#000" }}>{value}</span>
  </p>
);

/* ================= STYLES ================= */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#eef2f6",
};

const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "8px 12px",
  zIndex: 1000,
  textDecoration: "none",
};

const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "6px",
};

const langBtn = (active) => ({
  padding: "6px 10px",
  border: "1px solid #0056b3",
  backgroundColor: active ? "#0056b3" : "#ffffff",
  color: active ? "#ffffff" : "#0056b3",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.8rem",
});

const contentWrapper = {
  flex: 1,
  padding: 20,
};

const title = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 24,
  color: "#000",
};

const searchBox = {
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap",
  marginBottom: 26,
};

const input = {
  padding: 12,
  width: "260px",
  borderRadius: 6,
  border: "2px solid #000",
  fontWeight: 700,
  color: "#000",
};

const searchBtn = {
  padding: "12px 20px",
  background: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 700,
};

const center = {
  textAlign: "center",
  fontWeight: 700,
  color: "#000",
};

const card = {
  background: "#ffffff",
  maxWidth: 720,
  margin: "0 auto",
  padding: 22,
  borderRadius: 12,
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  color: "#000",
};

const row = {
  marginBottom: 8,
  color: "#000",
};

const remarkBox = {
  background: "#f4f6fb",
  borderLeft: "5px solid #0056b3",
  padding: 12,
  marginTop: 16,
  color: "#000",
};

const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 8,
};

const docLink = {
  color: "#0056b3",
  fontWeight: 700,
  textDecoration: "underline",
};

const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
};

const footerLinks = {
  listStyle: "none",
  padding: 0,
  margin: "8px 0 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};

const srOnly = {
  position: "absolute",
  left: "-9999px",
};
