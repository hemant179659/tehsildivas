import { useState } from "react";
import axios from "axios";
import { FaSearch, FaFileAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ComplaintStatus() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    if (!complaintId.trim()) {
      return toast.warning("कृपया शिकायत ID दर्ज करें");
    }

    try {
      setLoading(true);
      setComplaint(null);

      const res = await axios.get(
        `/api/department/complaint-status/${complaintId}`
      );

      setComplaint(res.data.complaint);
    } catch (err) {
      toast.error(err.response?.data?.message || "शिकायत नहीं मिली");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "लंबित") return "#b02a37";
    if (status === "प्रक्रिया में") return "#b58105";
    if (status === "निस्तारित") return "#146c43";
    return "#000";
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div style={pageWrapper}>
        {/* ================= CONTENT ================= */}
        <main style={contentWrapper}>
          <h1 style={title}>शिकायत की स्थिति देखें</h1>

          {/* SEARCH */}
          <div style={searchBox}>
            <input
              style={input}
              placeholder="शिकायत ID दर्ज करें"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
            />
            <button style={searchBtn} onClick={fetchStatus} disabled={loading}>
              <FaSearch /> खोजें
            </button>
          </div>

          {loading && <p style={center}>लोड हो रहा है...</p>}

          {complaint && (
            <div style={card}>
              <Info label="शिकायत ID" value={complaint.complaintId} />
              <Info label="शिकायतकर्ता" value={complaint.complainantName} />
              <Info label="मोबाइल" value={complaint.mobile} />
              <Info label="पता" value={complaint.address} />
              <Info label="विवरण" value={complaint.complaintDetails} />

              <p style={row}>
                <b>स्थिति:</b>{" "}
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
                    नवीनतम टिप्पणी
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {
                      complaint.remarksHistory[
                        complaint.remarksHistory.length - 1
                      ].remark
                    }
                  </div>
                  <small style={{ fontWeight: 600 }}>
                    {
                      new Date(
                        complaint.remarksHistory[
                          complaint.remarksHistory.length - 1
                        ].actionDate
                      ).toLocaleString("hi-IN")
                    }
                  </small>
                </div>
              )}

              {/* DOCUMENTS */}
              {complaint.documents?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <b>संलग्न दस्तावेज़:</b>
                  {complaint.documents.map((d, i) => (
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
          )}
        </main>

        {/* ================= FOOTER ================= */}
        <footer style={footerStyle}>
          <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
          <p style={{ margin: 0, fontSize: "0.75rem" }}>
            Designed & Developed by District Administration
          </p>
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
  backgroundColor: "#eef2f6", // light govt background
};

const contentWrapper = {
  flex: 1,
  padding: 20,
  overflowY: "auto",
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
  color: "#000",           // ✅ NO FADE
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
  padding: "10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
};
