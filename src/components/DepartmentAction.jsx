import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaCheckCircle,
  FaSpinner,
  FaFileAlt,
} from "react-icons/fa";

export default function DepartmentAction() {
  const navigate = useNavigate();
  const loggedDepartment = localStorage.getItem("loggedInDepartment");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // per-complaint remark text
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  /* ================= PROTECT ROUTE ================= */
  useEffect(() => {
    if (!loggedDepartment) {
      navigate("/dept-login", { replace: true });
    }
  }, [loggedDepartment, navigate]);

  /* ================= FETCH COMPLAINTS ================= */
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/department/department-complaints?department=${loggedDepartment}`
        );

        // only active complaints here
        const active = (res.data.complaints || []).filter(
          (c) => c.status !== "निस्तारित"
        );

        setComplaints(active);
      } catch {
        toast.error("शिकायतें लोड नहीं हो सकीं");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [loggedDepartment]);

  /* ================= STATUS COLOR ================= */
  const statusColor = (status) => {
    if (status === "लंबित") return "#dc3545"; // red
    if (status === "प्रक्रिया में") return "#ffc107"; // yellow
    if (status === "निस्तारित") return "#198754"; // green
    return "#000";
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (complaintId, status) => {
    const remark = remarks[complaintId];

    if (!remark || !remark.trim()) {
      return toast.warning("कृपया टिप्पणी दर्ज करें");
    }

    try {
      setActionLoading(true);

      await axios.put(
        `http://localhost:8000/api/department/update-status/${complaintId}`,
        {
          status,
          remark,
          department: loggedDepartment,
        }
      );

      toast.success("स्थिति अपडेट हो गई");

      if (status === "निस्तारित") {
        // resolved → hide card from this dashboard
        setComplaints((prev) =>
          prev.filter((c) => c.complaintId !== complaintId)
        );
      } else {
        // in progress → show latest remark
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaintId === complaintId
              ? {
                  ...c,
                  status,
                  latestRemark: remark,
                }
              : c
          )
        );
      }

      // clear textarea for that complaint
      setRemarks((prev) => {
        const copy = { ...prev };
        delete copy[complaintId];
        return copy;
      });
    } catch {
      toast.error("अपडेट करने में त्रुटि");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInDepartment");
    navigate("/dept-login", { replace: true });
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
        {/* ================= SIDEBAR ================= */}
        <aside style={sidebar}>
          <FaUserCircle size={48} />
          <h3 style={{ marginTop: 10 }}>{loggedDepartment}</h3>

          <div style={sideItem}>
            <FaTachometerAlt /> Dashboard
          </div>

          <div
            style={sideItem}
            onClick={() => navigate("/dept/pending")}
          >
            🟥 लंबित शिकायतें
          </div>

          <div
            style={sideItem}
            onClick={() => navigate("/dept/in-progress")}
          >
            🟨 प्रक्रिया में शिकायतें
          </div>

          <div
            style={sideItem}
            onClick={() => navigate("/dept/resolved")}
          >
            🟩 निस्तारित शिकायतें
          </div>

          <div
            style={sideItem}
            onClick={() => navigate("/dept/overall")}
          >
            📊 Overall Status
          </div>

          <div
            onClick={handleLogout}
            style={{ cursor: "pointer", marginTop: 30 }}
          >
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={main}>
          <h1 style={title}>विभागीय शिकायतें (कार्यवाही)</h1>

          {loading ? (
            <p style={centerText}>लोड हो रहा है...</p>
          ) : complaints.length === 0 ? (
            <p style={centerText}>कोई सक्रिय शिकायत उपलब्ध नहीं है</p>
          ) : (
            complaints.map((c) => (
              <div key={c.complaintId} style={card}>
                <p><b>शिकायत ID:</b> {c.complaintId}</p>
                <p><b>नाम:</b> {c.complainantName}</p>
                <p><b>मोबाइल:</b> {c.mobile}</p>
                <p><b>विवरण:</b> {c.complaintDetails}</p>

                {/* ===== DOCUMENTS ===== */}
                {c.documents?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <b>संलग्न दस्तावेज़:</b>
                    {c.documents.map((doc, idx) => (
                      <div key={idx} style={docRow}>
                        <FaFileAlt />
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          style={docLink}
                        >
                          दस्तावेज़ {idx + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                <p style={{ marginTop: 10 }}>
                  <b>स्थिति:</b>{" "}
                  <span
                    style={{
                      fontWeight: 900,
                      color: statusColor(c.status),
                    }}
                  >
                    {c.status}
                  </span>
                </p>

                {/* ===== LATEST REMARK ===== */}
                {c.latestRemark && (
                  <div style={remarkBox}>
                    <b>टिप्पणी:</b>
                    <div>{c.latestRemark}</div>
                  </div>
                )}

                {/* ===== REMARK TEXTAREA ===== */}
                <textarea
                  style={textarea}
                  placeholder="यहाँ टिप्पणी लिखें..."
                  value={remarks[c.complaintId] || ""}
                  onChange={(e) =>
                    setRemarks((prev) => ({
                      ...prev,
                      [c.complaintId]: e.target.value,
                    }))
                  }
                />

                <div style={{ marginTop: 10 }}>
                  <button
                    style={btnYellow}
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus(c.complaintId, "प्रक्रिया में")
                    }
                  >
                    <FaSpinner /> प्रक्रिया में
                  </button>

                  <button
                    style={btnGreen}
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus(c.complaintId, "निस्तारित")
                    }
                  >
                    <FaCheckCircle /> निस्तारित
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const sidebar = {
  width: 260,
  background: "#002147",
  color: "#fff",
  padding: 20,
};

const sideItem = {
  marginTop: 14,
  cursor: "pointer",
  fontWeight: 700,
};

const main = {
  flex: 1,
  padding: 30,
  background: "#fff",
  color: "#000",
};

const title = {
  textAlign: "center",
  fontWeight: 900,
  marginBottom: 20,
};

const centerText = {
  textAlign: "center",
  fontWeight: 700,
};

const card = {
  background: "#f8f9fa",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
};

const textarea = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 6,
  border: "1px solid #000",
};

const btnYellow = {
  marginRight: 10,
  padding: "8px 14px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  borderRadius: 5,
};

const btnGreen = {
  padding: "8px 14px",
  background: "#198754",
  color: "#fff",
  border: "none",
  borderRadius: 5,
};

const remarkBox = {
  background: "#fff",
  border: "1px solid #ddd",
  padding: 8,
  marginTop: 8,
};

const docRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
};

const docLink = {
  color: "#0d6efd",
  textDecoration: "underline",
};
