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
                <input type="file"   name="documents"  multiple onChange={handleFileChange} />

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
                <select
  style={input}
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
>
  <option value="">-- विभाग चुनें --</option>

  <option value="जिला प्रशासन उधम सिंह नगर">जिला प्रशासन उधम सिंह नगर</option>
  <option value="जिलाधिकारी कार्यालय">जिलाधिकारी कार्यालय</option>
  <option value="अपर जिलाधिकारी कार्यालय">अपर जिलाधिकारी कार्यालय</option>
  <option value="कोषागार विभाग">कोषागार विभाग</option>
  <option value="राजस्व विभाग">राजस्व विभाग</option>

  <option value="पुलिस विभाग">पुलिस विभाग</option>

  <option value="उप जिलाधिकारी रुद्रपुर">उप जिलाधिकारी रुद्रपुर</option>
  <option value="उप जिलाधिकारी काशीपुर">उप जिलाधिकारी काशीपुर</option>
  <option value="उप जिलाधिकारी गदरपुर">उप जिलाधिकारी गदरपुर</option>
  <option value="उप जिलाधिकारी जसपुर">उप जिलाधिकारी जसपुर</option>
  <option value="उप जिलाधिकारी बाजपुर">उप जिलाधिकारी बाजपुर</option>
  <option value="उप जिलाधिकारी खटीमा">उप जिलाधिकारी खटीमा</option>
  <option value="उप जिलाधिकारी सितारगंज">उप जिलाधिकारी सितारगंज</option>

  <option value="नगर निगम रुद्रपुर">नगर निगम रुद्रपुर</option>
  <option value="नगर निगम काशीपुर">नगर निगम काशीपुर</option>
  <option value="नगर पालिका परिषद गदरपुर">नगर पालिका परिषद गदरपुर</option>
  <option value="नगर पालिका परिषद जसपुर">नगर पालिका परिषद जसपुर</option>
  <option value="नगर पालिका परिषद बाजपुर">नगर पालिका परिषद बाजपुर</option>
  <option value="नगर पालिका परिषद खटीमा">नगर पालिका परिषद खटीमा</option>
  <option value="नगर पंचायत केलाखेड़ा">नगर पंचायत केलाखेड़ा</option>
  <option value="नगर पंचायत दिनेशपुर">नगर पंचायत दिनेशपुर</option>
  <option value="नगर पंचायत महुआडाली">नगर पंचायत महुआडाली</option>
  <option value="नगर पंचायत शक्तिफार्म">नगर पंचायत शक्तिफार्म</option>

  <option value="लोक निर्माण विभाग">लोक निर्माण विभाग</option>
  <option value="उत्तराखंड जल संस्थान">उत्तराखंड जल संस्थान</option>
  <option value="उत्तराखंड पावर कॉरपोरेशन लिमिटेड">
    उत्तराखंड पावर कॉरपोरेशन लिमिटेड
  </option>
  <option value="सिंचाई विभाग">सिंचाई विभाग</option>
  <option value="लघु सिंचाई विभाग">लघु सिंचाई विभाग</option>

  <option value="मुख्य चिकित्सा अधिकारी कार्यालय">
    मुख्य चिकित्सा अधिकारी कार्यालय
  </option>
  <option value="जिला अस्पताल उधम सिंह नगर">
    जिला अस्पताल उधम सिंह नगर
  </option>
  <option value="रुद्रपुर मेडिकल कॉलेज">रुद्रपुर मेडिकल कॉलेज</option>
  <option value="आयुष विभाग">आयुष विभाग</option>

  <option value="प्राथमिक शिक्षा विभाग">प्राथमिक शिक्षा विभाग</option>
  <option value="माध्यमिक शिक्षा विभाग">माध्यमिक शिक्षा विभाग</option>
  <option value="जी.बी. पंत विश्वविद्यालय पंतनगर">
    जी.बी. पंत विश्वविद्यालय पंतनगर
  </option>

  <option value="ग्रामीण विकास विभाग">ग्रामीण विकास विभाग</option>
  <option value="पंचायतीराज विभाग">पंचायतीराज विभाग</option>
  <option value="जिला पंचायत उधम सिंह नगर">
    जिला पंचायत उधम सिंह नगर
  </option>
  <option value="समाज कल्याण विभाग">समाज कल्याण विभाग</option>
  <option value="महिला एवं बाल विकास विभाग">
    महिला एवं बाल विकास विभाग
  </option>
  <option value="अल्पसंख्यक कल्याण विभाग">
    अल्पसंख्यक कल्याण विभाग
  </option>

  <option value="कृषि विभाग">कृषि विभाग</option>
  <option value="बागवानी विभाग">बागवानी विभाग</option>
  <option value="पशुपालन विभाग">पशुपालन विभाग</option>
  <option value="गन्ना विकास एवं चीनी उद्योग विभाग">
    गन्ना विकास एवं चीनी उद्योग विभाग
  </option>

  <option value="श्रम विभाग">श्रम विभाग</option>
  <option value="फैक्ट्री एवं बॉयलर विभाग">
    फैक्ट्री एवं बॉयलर विभाग
  </option>
  <option value="औद्योगिक विकास विभाग">
    औद्योगिक विकास विभाग
  </option>

  <option value="परिवहन विभाग">परिवहन विभाग</option>
  <option value="खाद्य एवं नागरिक आपूर्ति विभाग">
    खाद्य एवं नागरिक आपूर्ति विभाग
  </option>
  <option value="खाद्य सुरक्षा विभाग">खाद्य सुरक्षा विभाग</option>
  <option value="पर्यावरण बोर्ड">पर्यावरण बोर्ड</option>
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
