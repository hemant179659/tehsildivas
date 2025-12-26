import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentForgot() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("hi");

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= RESET ================= */
  const handleReset = async () => {
    if (!email) {
      return toast.error(
        lang === "hi" ? "कृपया ईमेल दर्ज करें" : "Please enter email"
      );
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/department/forgot-password`,
        { email }
      );

      toast.success(
        lang === "hi"
          ? "रीसेट लिंक आपके ईमेल पर भेज दिया गया है"
          : "Reset link has been sent to your email"
      );

      setTimeout(() => navigate("/dept-login"), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (lang === "hi" ? "कुछ त्रुटि हुई" : "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper} lang={lang}>
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
        {/* LEFT IMAGE (DESKTOP ONLY) */}
        {!isMobile && (
          <aside style={leftSection} aria-hidden="true">
            <div style={leftImage} />
            <div style={overlay} />
            <BackButton onClick={() => navigate("/dept-login")} />
          </aside>
        )}

        {/* RIGHT FORM */}
        <main id="main-content" style={rightSection} role="main">
          <section style={loginBox} aria-labelledby="forgot-heading">
            <h1 id="forgot-heading" style={title}>
              {lang === "hi" ? "पासवर्ड भूल गए" : "Forgot Password"}
            </h1>

            <p style={infoText}>
              {lang === "hi"
                ? "अपना ईमेल दर्ज करें, रीसेट लिंक आपके ईमेल पर भेजा जाएगा।"
                : "Enter your email address. A reset link will be sent to your email."}
            </p>

            <label style={label}>
              {lang === "hi" ? "ईमेल" : "Email"}
            </label>
            <input
              style={input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button
              style={loginBtn}
              onClick={handleReset}
              disabled={loading}
            >
              {loading
                ? lang === "hi"
                  ? "भेजा जा रहा है..."
                  : "Sending..."
                : lang === "hi"
                ? "रीसेट लिंक भेजें"
                : "Send Reset Link"}
            </button>

            <button
              style={secondaryBtn}
              onClick={() => navigate("/dept-login")}
            >
              {lang === "hi" ? "लॉगिन पर वापस जाएँ" : "Back to Login"}
            </button>
          </section>
        </main>
      </div>

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
  );
}

/* ===================== STYLES ===================== */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f4f6f9",
};

const contentWrapper = {
  flex: 1,
  display: "flex",
};

/* Skip link */
const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  zIndex: 1000,
  textDecoration: "none",
};

/* Language toggle */
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

/* Left image */
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

/* Right section */
const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

/* Forgot box */
const loginBox = {
  width: "100%",
  maxWidth: 400,
  background: "#ffffff",
  padding: 26,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

const title = {
  textAlign: "center",
  marginBottom: 12,
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#000",
};

const infoText = {
  fontSize: "0.9rem",
  marginBottom: 16,
  textAlign: "center",
  color: "#333",
  fontWeight: 500,
};

const label = {
  display: "block",
  marginBottom: 4,
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "#000",
};

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

/* Footer – same as Home */
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
