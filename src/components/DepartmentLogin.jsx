// React hooks for state and lifecycle
import { useState, useEffect } from "react";

// React Router hooks and components
import { useNavigate, Link } from "react-router-dom";

// Axios for API calls
import axios from "axios";

// Back button component
import BackButton from "./BackButton";

// Background image for left panel
import backgroundImage from "../assets/login.jpg";

// Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Department Login Component
export default function DepartmentLogin() {
  const navigate = useNavigate();

  // ================= STATE =================
  // Login credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Language toggle (hi | en)
  const [lang, setLang] = useState("hi");

  /* ================= RESIZE ================= */
  // Detect screen resize to update mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= AUTO REDIRECT ================= */
  // Redirect if department already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/department-complaints", { replace: true });
    }
  }, [navigate]);

  /* ================= LOGIN ================= */
  // Handle department login
  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error(
        lang === "hi"
          ? "कृपया ईमेल और पासवर्ड दर्ज करें"
          : "Please enter email and password"
      );
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/department/login`,
        { email, password }
      );

      // Save logged in department name
      localStorage.setItem("loggedInDepartment", res.data.deptName);
      toast.success(lang === "hi" ? "लॉगिन सफल!" : "Login successful!");

      // Redirect after success
      setTimeout(() => {
        navigate("/department-complaints", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (lang === "hi" ? "लॉगिन विफल" : "Login failed")
      );
    }
  };

  return (
    <div style={pageWrapper} lang={lang}>
      {/* Toast container */}
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
            <BackButton onClick={() => navigate("/", { replace: true })} />
          </aside>
        )}

        <main id="main-content" style={rightSection} role="main">
          <section style={loginBox}>
            <h1 style={title}>
              {lang === "hi" ? "विभाग लॉगिन" : "Department Login"}
            </h1>

            {/* Email input */}
            <label style={label}>
              {lang === "hi" ? "ईमेल" : "Email"}
            </label>
            <input
              style={input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <label style={label}>
              {lang === "hi" ? "पासवर्ड" : "Password"}
            </label>
            <input
              style={input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Login button */}
            <button style={loginBtn} onClick={handleLogin}>
              {lang === "hi" ? "लॉगिन करें" : "Login"}
            </button>

            {/* Secondary actions */}
            <div style={linkGroup}>
              <button
                style={secondaryBtn}
                onClick={() => navigate("/dept-signup")}
              >
                {lang === "hi" ? "नया पंजीकरण" : "New Registration"}
              </button>

              <button
                style={secondaryBtn}
                onClick={() => navigate("/dept-forgot")}
              >
                {lang === "hi" ? "पासवर्ड भूल गए?" : "Forgot Password?"}
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>
          {lang === "hi"
            ? "जिला प्रशासन, उत्तराखंड"
            : "District Administration, Uttarakhand"}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>
          Designed & Developed by District Administration
        </p>

        <nav>
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

// Page wrapper style
const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f4f6f9",
};

// Layout container
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

// Language toggle position
const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  gap: "6px",
};

// Language button style
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

// Background image
const leftImage = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

// Overlay over image
const overlay = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.25)",
};

// Right login section
const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

// Login card
const loginBox = {
  width: "100%",
  maxWidth: 380,
  background: "#ffffff",
  padding: 26,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

// Title style
const title = {
  textAlign: "center",
  marginBottom: 18,
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#000",
};

// Label style
const label = {
  marginBottom: 4,
  fontWeight: 500,
  fontSize: "0.85rem",
  color: "#000",
};

// Input style
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

// Login button style
const loginBtn = {
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

// Button group
const linkGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 9,
  marginTop: 14,
};

// Secondary button style
const secondaryBtn = {
  padding: 9,
  backgroundColor: "#e9ecef",
  color: "#000",
  border: "1px solid #000",
  borderRadius: 6,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
};

// Footer style
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
