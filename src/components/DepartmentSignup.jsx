// React hooks for state and lifecycle
import { useState, useEffect } from "react";

// React Router hooks and components
import { useNavigate, Link } from "react-router-dom";

// Axios for API requests
import axios from "axios";

// Back navigation button
import BackButton from "./BackButton";

// Background image
import backgroundImage from "../assets/login.jpg";

// Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   DEPARTMENT LIST
   Used in dropdown for department selection
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

// Department Signup Component
export default function DepartmentSignup() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("hi");

  /* ================= RESIZE ================= */
  // Detect screen resize to handle responsive UI
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= REDIRECT ================= */
  // Redirect if department already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/department-complaints", { replace: true });
    }
  }, [navigate]);

  /* ================= SIGNUP ================= */
  // Handle department signup
  const handleSignup = async () => {
    if (!deptName || !email || !password || !confirmPassword || !verificationCode) {
      return toast.error(
        lang === "hi"
          ? "कृपया सभी फ़ील्ड भरें"
          : "Please fill all fields"
      );
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      return toast.error(
        lang === "hi"
          ? "पासवर्ड मेल नहीं खा रहा"
          : "Passwords do not match"
      );
    }

    try {
      // API call for department signup
      await axios.post(`${import.meta.env.VITE_API_URL}/department/signup`, {
        deptName,
        email,
        password,
        verificationCode,
      });

      toast.success(
        lang === "hi"
          ? "विभाग सफलतापूर्वक पंजीकृत हो गया"
          : "Department registered successfully"
      );

      // Redirect to login after success
      setTimeout(() => {
        navigate("/dept-login", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={pageWrapper} lang={lang}>
      {/* Toast messages */}
      <ToastContainer autoClose={2000} position="top-right" />

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

      {/* ================= MAIN CONTENT ================= */}
      <div style={contentWrapper}>
        {!isMobile && (
          <aside style={leftSection} aria-hidden="true">
            <div style={leftImage} />
            <div style={overlay} />
            <BackButton onClick={() => navigate("/dept-login")} />
          </aside>
        )}

        <main id="main-content" style={rightSection} role="main">
          <section style={signupBox}>
            <h1 style={title}>
              {lang === "hi" ? "विभाग पंजीकरण" : "Department Registration"}
            </h1>

            {/* Department dropdown */}
            <select
              style={input}
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            >
              <option value="">
                {lang === "hi" ? "विभाग चुनें" : "Select Department"}
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Email input */}
            <input
              style={input}
              type="email"
              placeholder={lang === "hi" ? "ईमेल" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <input
              style={input}
              type="password"
              placeholder={lang === "hi" ? "पासवर्ड" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm password input */}
            <input
              style={input}
              type="password"
              placeholder={
                lang === "hi" ? "पासवर्ड पुष्टि" : "Confirm Password"
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Verification code */}
            <input
              style={input}
              type="text"
              placeholder={
                lang === "hi" ? "Verification Code" : "Verification Code"
              }
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            {/* Signup button */}
            <button style={primaryBtn} onClick={handleSignup}>
              {lang === "hi" ? "पंजीकरण करें" : "Register"}
            </button>

            {/* Back to login */}
            <button
              style={secondaryBtn}
              onClick={() => navigate("/dept-login")}
            >
              {lang === "hi" ? "लॉगिन पर वापस जाएँ" : "Back to Login"}
            </button>
          </section>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
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
  );
}

/* ===================== STYLES ===================== */

// Page wrapper
const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f4f6f9",
};

// Content wrapper
const contentWrapper = {
  flex: 1,
  display: "flex",
};

// Skip link for accessibility
const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  zIndex: 1000,
};

// Language toggle
const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "6px",
};

const langBtn = (active) => ({
  padding: "5px 9px",
  border: "1px solid #0056b3",
  backgroundColor: active ? "#0056b3" : "#ffffff",
  color: active ? "#ffffff" : "#0056b3",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
});

// Left image section
const leftSection = {
  flex: 1,
  position: "relative",
};

const leftImage = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.25)",
};

// Right section
const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

// Signup box
const signupBox = {
  width: "100%",
  maxWidth: 420,
  background: "#ffffff",
  padding: 26,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

// Title
const title = {
  textAlign: "center",
  marginBottom: 18,
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#000",
};

// Input
const input = {
  width: "100%",
  padding: 11,
  marginBottom: 14,
  borderRadius: 6,
  border: "1px solid #000",
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#000",
};

// Primary button
const primaryBtn = {
  width: "100%",
  padding: 11,
  backgroundColor: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
};

// Secondary button
const secondaryBtn = {
  width: "100%",
  padding: 9,
  marginTop: 10,
  backgroundColor: "#e9ecef",
  color: "#000",
  border: "1px solid #000",
  borderRadius: 6,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
};

// Footer
const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
};

// Footer links
const footerLinks = {
  listStyle: "none",
  padding: 0,
  margin: "8px 0 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};
