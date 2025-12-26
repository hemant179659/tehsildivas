import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   DEPARTMENT LIST (ONLY NAMES)
   NO VERIFICATION CODES HERE
========================= */
const DEPARTMENTS = [
  "जिला प्रशासन उधम सिंह नगर",
  "जिलाधिकारी कार्यालय",
  "अपर जिलाधिकारी कार्यालय",
  "कोषागार विभाग",
  "राजस्व विभाग",

  "पुलिस विभाग",

  "उप जिलाधिकारी रुद्रपुर",
  "उप जिलाधिकारी काशीपुर",
  "उप जिलाधिकारी गदरपुर",
  "उप जिलाधिकारी जसपुर",
  "उप जिलाधिकारी बाजपुर",
  "उप जिलाधिकारी खटीमा",
  "उप जिलाधिकारी सितारगंज",

  "नगर निगम रुद्रपुर",
  "नगर निगम काशीपुर",
  "नगर पालिका परिषद गदरपुर",
  "नगर पालिका परिषद जसपुर",
  "नगर पालिका परिषद बाजपुर",
  "नगर पालिका परिषद खटीमा",
  "नगर पंचायत केलाखेड़ा",
  "नगर पंचायत दिनेशपुर",
  "नगर पंचायत महुआडाली",
  "नगर पंचायत शक्तिफार्म",

  "लोक निर्माण विभाग",
  "उत्तराखंड जल संस्थान",
  "उत्तराखंड पावर कॉरपोरेशन लिमिटेड",
  "सिंचाई विभाग",
  "लघु सिंचाई विभाग",

  "मुख्य चिकित्सा अधिकारी कार्यालय",
  "जिला अस्पताल उधम सिंह नगर",
  "रुद्रपुर मेडिकल कॉलेज",
  "आयुष विभाग",

  "प्राथमिक शिक्षा विभाग",
  "माध्यमिक शिक्षा विभाग",
  "जी.बी. पंत विश्वविद्यालय पंतनगर",

  "ग्रामीण विकास विभाग",
  "पंचायतीराज विभाग",
  "जिला पंचायत उधम सिंह नगर",
  "समाज कल्याण विभाग",
  "महिला एवं बाल विकास विभाग",
  "अल्पसंख्यक कल्याण विभाग",

  "कृषि विभाग",
  "बागवानी विभाग",
  "पशुपालन विभाग",
  "गन्ना विकास एवं चीनी उद्योग विभाग",

  "श्रम विभाग",
  "फैक्ट्री एवं बॉयलर विभाग",
  "औद्योगिक विकास विभाग",

  "परिवहन विभाग",
  "खाद्य एवं नागरिक आपूर्ति विभाग",
  "खाद्य सुरक्षा विभाग",
  "पर्यावरण बोर्ड",
];

export default function DepartmentSignup() {
  const navigate = useNavigate();

  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= REDIRECT ================= */
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/department-complaints", { replace: true });
    }
  }, [navigate]);

  /* ================= SIGNUP ================= */
  const handleSignup = async () => {
    if (!deptName || !email || !password || !confirmPassword || !verificationCode) {
      return toast.error("कृपया सभी फ़ील्ड भरें");
    }

    if (password !== confirmPassword) {
      return toast.error("पासवर्ड मेल नहीं खा रहा");
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/department/signup`, {
        deptName,
        email,
        password,
        verificationCode,
      });

      toast.success("विभाग सफलतापूर्वक पंजीकृत हो गया");

      setTimeout(() => {
        navigate("/dept-login", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={pageWrapper}>
      <ToastContainer autoClose={2000} position="top-right" />

      {!isMobile && (
        <div style={leftSection}>
          <div style={leftImage} />
          <div style={overlay} />
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>
      )}

      <div style={rightSection}>
        <div style={loginBox}>
          <h2 style={title}>विभाग पंजीकरण</h2>

          <select
            style={input}
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
          >
            <option value="">विभाग चुनें</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <input
            style={input}
            type="email"
            placeholder="ईमेल"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="पासवर्ड"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="पासवर्ड पुष्टि"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <input
            style={input}
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <button style={loginBtn} onClick={handleSignup}>
            पंजीकरण करें
          </button>

          <button
            style={secondaryBtn}
            onClick={() => navigate("/dept-login")}
          >
            लॉगिन पर वापस जाएँ
          </button>
        </div>
      </div>

      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "#f4f6f9",
};

const leftSection = {
  flex: 1,
  position: "relative",
  overflow: "hidden",
};

const leftImage = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: 1,
};

const overlay = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.35)",
  zIndex: 2,
};

const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#ffffff",
  zIndex: 3,
};

const loginBox = {
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  padding: 30,
  borderRadius: 10,
  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  marginBottom: 22,
  fontWeight: 900,
  color: "#000",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 14,
  borderRadius: 6,
  border: "2px solid #000",
  fontWeight: 600,
};

const loginBtn = {
  width: "100%",
  padding: 12,
  backgroundColor: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryBtn = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  backgroundColor: "#e9ecef",
  color: "#000",
  border: "1px solid #000",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 5,
};
