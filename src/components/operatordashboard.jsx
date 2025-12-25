import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTachometerAlt,
  FaList,
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

export default function ComplaintRegister() {
  const navigate = useNavigate();

  // 🔐 SESSION DATA
  const operatorName =
    localStorage.getItem("dataEntryOperator") || "Data Entry Operator";
  const loggedTehsil = localStorage.getItem("loggedTehsil");

  // 🚫 PROTECT ROUTE
  useEffect(() => {
    if (!loggedTehsil) {
      navigate("/operator-login", { replace: true });
    }
  }, [loggedTehsil, navigate]);

  // ================= STATE =================
  const [complainantName, setComplainantName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [documents, setDocuments] = useState([]);

  const [assignedBy, setAssignedBy] = useState("");
  const [assignedPlace] = useState(loggedTehsil || "");
  const [assignedDate, setAssignedDate] = useState("");
  const [department, setDepartment] = useState("");

  const [generatedId, setGeneratedId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= ID =================
  const generateComplaintId = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  };

  // ================= FILE HANDLING =================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (
      !complainantName ||
      !guardianName ||
      !address ||
      !mobile ||
      mobile.length !== 10 ||
      !complaintDetails ||
      !assignedBy ||
      !assignedDate ||
      !department
    ) {
      toast.warning("कृपया सभी आवश्यक जानकारी सही रूप से भरें");
      return;
    }

    const complaintId = generateComplaintId();
    const formData = new FormData();

    formData.append("complaintId", complaintId);
    formData.append("complainantName", complainantName);
    formData.append("guardianName", guardianName);
    formData.append("address", address);
    formData.append("mobile", mobile);
    formData.append("complaintDetails", complaintDetails);
    formData.append("assignedBy", assignedBy);
    formData.append("assignedPlace", assignedPlace);
    formData.append("tehsil", loggedTehsil); 
    formData.append("assignedDate", assignedDate);
    formData.append("department", department);

    documents.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/department/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setGeneratedId(complaintId);
      setSubmitted(true);
      toast.success("शिकायत सफलतापूर्वक दर्ज की गई");
    } catch {
      toast.error("शिकायत दर्ज करने में त्रुटि आई");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dataEntryOperator");
    localStorage.removeItem("loggedTehsil");
    navigate("/operator-login", { replace: true });
  };

  const handleNewComplaint = () => {
    setComplainantName("");
    setGuardianName("");
    setAddress("");
    setMobile("");
    setComplaintDetails("");
    setDocuments([]);
    setAssignedBy("");
    setAssignedDate("");
    setDepartment("");
    setGeneratedId("");
    setSubmitted(false);
  };

  /* ================= STYLES ================= */

  const label = {
    fontWeight: 800,
    marginBottom: 6,
    color: "#000000",
  };

  const input = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1.5px solid #444",
    color: "#000000",
    backgroundColor: "#ffffff",
    fontWeight: 600,
  };

  const group = { marginBottom: "15px" };

  const button = {
    width: "100%",
    padding: "12px",
    background: "#0056b3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: 240,
            background: "#002147",
            color: "#fff",
            padding: 20,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 25 }}>
            <FaUserCircle size={48} />
            <h3 style={{ fontWeight: 800 }}>{operatorName}</h3>
            <p style={{ fontSize: "0.8rem" }}>{loggedTehsil}</p>
          </div>

          <div onClick={() => navigate("/operator-dashboard")} style={{ cursor: "pointer", marginBottom: 16 }}>
            <FaTachometerAlt /> Dashboard
          </div>

          <div onClick={() => navigate("/registered-complaints")} style={{ cursor: "pointer", marginBottom: 16 }}>
            <FaList /> Registered Complaints
          </div>

          <div onClick={handleLogout} style={{ cursor: "pointer" }}>
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: 30, background: "#ffffff" }}>
          <h1
            style={{
              textAlign: "center",
              fontWeight: 900,
              fontSize: "1.9rem",
              color: "#000000",
              marginBottom: 25,
            }}
          >
            शिकायत पंजीकरण फॉर्म
          </h1>

          {!submitted ? (
            <>
              <div style={group}>
                <label style={label}>शिकायतकर्ता का नाम</label>
                <input style={input} value={complainantName} onChange={(e) => setComplainantName(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>पिता / पति का नाम</label>
                <input style={input} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>पूरा पता</label>
                <textarea style={input} value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>मोबाइल नंबर</label>
                <input style={input} maxLength="10" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>शिकायत का विवरण</label>
                <textarea style={input} value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>संबंधित दस्तावेज़</label>
                <input type="file" multiple onChange={handleFileChange} />

                {documents.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8,
                      background: "#f1f3f5",
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ced4da",
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: 700, color: "#000" }}>
                      {file.name}
                    </span>
                    <FaTimes
                      style={{ cursor: "pointer", color: "#dc3545" }}
                      onClick={() => removeFile(index)}
                    />
                  </div>
                ))}
              </div>

              <div style={group}>
                <label style={label}>शिकायत सौंपने वाला अधिकारी</label>
                <input style={input} value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>सौंपा गया स्थान</label>
                <input style={input} value={assignedPlace} disabled />
              </div>

              <div style={group}>
                <label style={label}>सौंपने की तिथि</label>
                <input type="date" style={input} value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} />
              </div>

              <div style={group}>
                <label style={label}>संबंधित विभाग</label>
                <select style={input} value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">-- विभाग चुनें --</option>
                  <option value="राजस्व विभाग">राजस्व विभाग</option>
                  <option value="पुलिस विभाग">पुलिस विभाग</option>
                  <option value="स्वास्थ्य विभाग">स्वास्थ्य विभाग</option>
                  <option value="शिक्षा विभाग">शिक्षा विभाग</option>
                </select>
              </div>

              <button style={button} onClick={handleSubmit} disabled={loading}>
                शिकायत दर्ज करें
              </button>
            </>
          ) : (
            <>
              <h2 style={{ textAlign: "center", color: "#198754", fontWeight: 900 }}>
                शिकायत सफलतापूर्वक दर्ज हो गई
              </h2>

              <h1 style={{ textAlign: "center", fontWeight: 900, color: "#000" }}>
                शिकायत ID : {generatedId}
              </h1>

              <div style={{ textAlign: "center", marginTop: 20 }}>
                <button style={button} onClick={handleNewComplaint}>
                  नई शिकायत दर्ज करें
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#f8f9fa",
          borderTop: "3px solid #0056b3",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#002147" }}>
          District Administration
        </p>
        <p style={{ margin: 0, fontSize: "0.7rem" }}>
          Designed and Developed by <strong>District Administration</strong>
        </p>
      </footer>
    </>
  );
}
