// ⬅️ imports SAME
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
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ NEW (ONLY for supporting docs)
  const [supportDocs, setSupportDocs] = useState({});

  /* ================= RESIZE ================= */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
          `/api/department/department-complaints?department=${loggedDepartment}`
        );

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

  /* ================= DATE FORMAT ================= */
  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= FILE HANDLING ================= */
  const handleSupportDocs = (id, files) => {
    setSupportDocs((prev) => ({
      ...prev,
      [id]: Array.from(files),
    }));
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (complaintId, status) => {
    const remark = remarks[complaintId];
    if (!remark?.trim()) {
      return toast.warning("कृपया टिप्पणी दर्ज करें");
    }

    const wantDocs =
      status === "निस्तारित"
        ? window.confirm("क्या आप supporting documents जोड़ना चाहते हैं?")
        : false;

    const formData = new FormData();
    formData.append("status", status);
    formData.append("remark", remark);
    formData.append("department", loggedDepartment);

    if (wantDocs && supportDocs[complaintId]) {
      supportDocs[complaintId].forEach((file) => {
        formData.append("supportDocs", file); // ✅ MULTIPLE
      });
    }

    try {
      setActionLoading(true);

      await axios.put(
        `/api/department/update-status/${complaintId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("स्थिति अपडेट हो गई");

      setComplaints((prev) =>
        prev.filter((c) => c.complaintId !== complaintId)
      );
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

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: isMobile ? "column" : "row",
          paddingBottom: "80px",
        }}
      >
        {/* ===== SIDEBAR (UNCHANGED) ===== */}
        <aside style={{ width: isMobile ? "100%" : 260, background: "#002147", color: "#fff", padding: 20 }}>
          <FaUserCircle size={48} />
          <h3>{loggedDepartment}</h3>

          <div><FaTachometerAlt /> Dashboard</div>
          <div onClick={() => navigate("/dept/pending")}>🟥 लंबित शिकायतें</div>
          <div onClick={() => navigate("/dept/in-progress")}>🟨 प्रक्रिया में</div>
          <div onClick={() => navigate("/dept/resolved")}>🟩 निस्तारित</div>
          <div onClick={() => navigate("/dept/overall")}>📊 Overall</div>

          <div onClick={handleLogout} style={{ marginTop: 30 }}>
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main style={{ flex: 1, padding: 30 }}>
          <h1>विभागीय शिकायतें</h1>

          {loading ? (
            <p>लोड हो रहा है...</p>
          ) : (
            complaints.map((c) => (
              <div key={c.complaintId} style={{ background: "#f8f9fa", padding: 20, marginBottom: 20 }}>
                <p><b>ID:</b> {c.complaintId}</p>
                <p><b>सौंपने वाला:</b> {c.assignedBy}</p>
                <p><b>स्थान:</b> {c.assignedPlace}</p>
                <p><b>तिथि:</b> {formatDateTime(c.assignedDate)}</p>

                <textarea
                  placeholder="टिप्पणी लिखें..."
                  value={remarks[c.complaintId] || ""}
                  onChange={(e) =>
                    setRemarks({ ...remarks, [c.complaintId]: e.target.value })
                  }
                />

                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleSupportDocs(c.complaintId, e.target.files)
                  }
                />

                <button onClick={() => updateStatus(c.complaintId, "निस्तारित")}>
                  <FaCheckCircle /> निस्तारित
                </button>
              </div>
            ))
          )}
        </main>
      </div>
    </>
  );
}
