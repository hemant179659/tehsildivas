// React hooks for state and lifecycle handling
import { useState, useEffect } from "react";

// React Router hooks and components
import { useNavigate, Link } from "react-router-dom";

// Custom back button component
import BackButton from "./BackButton";

// Background image asset
import backgroundImage from "../assets/login.jpg";

// Axios for API calls
import axios from "axios";

// Data Entry Operator Login Component
export default function DataEntryLogin() {
  // Navigation hook
  const navigate = useNavigate();

  // Selected tehsil
  const [tehsil, setTehsil] = useState("");

  // Operator email
  const [email, setEmail] = useState("");

  // Operator password
  const [password, setPassword] = useState("");

  // Detect mobile screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Language selection (Hindi / English)
  const [lang, setLang] = useState("hi");

  /* 🔹 ONLY FOR DROPDOWN (NO PASSWORD HERE) */
  // Static tehsil list for dropdown selection
  const TEHSIL_LIST = [
    "Tehsil Rudrapur",
    "Tehsil Sitarganj",
    "Tehsil Khatima",
    "Tehsil Kashipur",
    "Tehsil Jaspur",
    "Tehsil Gadarpur",
    "Tehsil Bajpur",
  ];

  // Handle screen resize for responsive UI
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= LOGIN (DB BASED) ================= */
  // Operator login handler
  const handleLogin = async () => {
    // Basic client-side validation
    if (!tehsil || !email || !password) {
      alert(lang === "hi" ? "कृपया सभी जानकारी भरें" : "Please fill all details");
      return;
    }

    try {
      // Send login request to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/department/operatorlogin`,
        {
          tehsil,
          email,
          password,
        }
      );

      // On successful login
      if (res.data?.success) {
        // Store operator name for dashboard display
        localStorage.setItem("dataEntryOperator", res.data.operatorName);

        // Store logged-in tehsil for session validation
        localStorage.setItem("loggedTehsil", res.data.tehsil);

        // Redirect to operator dashboard
        navigate("/operator-dashboard", { replace: true });
      }
    } catch (err) {
      // Login failure alert
      alert(lang === "hi" ? "गलत ईमेल या पासवर्ड" : "Invalid email or password");
    }
  };

  return (
    // Page wrapper with language attribute for accessibility
    <div style={pageWrapper} lang={lang}>
      {/* ---------- LANGUAGE TOGGLE ---------- */}
      {/* Toggle between Hindi and English */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>
          हिंदी
        </button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>
          EN
        </button>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div style={contentWrapper}>
        {/* Left section shown only on desktop */}
        {!isMobile && (
          <aside style={leftSection} aria-hidden="true">
            {/* Background image */}
            <div style={leftImage} />

            {/* Dark overlay for contrast */}
            <div style={overlay} />

            {/* Back navigation button */}
            <BackButton onClick={() => navigate("/")} />
          </aside>
        )}

        {/* Login form section */}
        <main style={rightSection} role="main">
          <section style={loginBox}>
            {/* Page title */}
            <h2 style={title}>
              {lang === "hi"
                ? "डेटा एंट्री ऑपरेटर लॉगिन"
                : "Data Entry Operator Login"}
            </h2>

            {/* Tehsil dropdown */}
            <label style={label}>
              {lang === "hi" ? "तहसील चुनें" : "Select Tehsil"}
            </label>
            <select
              style={input}
              value={tehsil}
              onChange={(e) => setTehsil(e.target.value)}
            >
              <option value="">
                {lang === "hi" ? "-- तहसील चुनें --" : "-- Select Tehsil --"}
              </option>

              {/* Render tehsil options */}
              {TEHSIL_LIST.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Email input */}
            <label style={label}>{lang === "hi" ? "ईमेल" : "Email"}</label>
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
          </section>
        </main>
      </div>

      {/* ---------- FOOTER ---------- */}
      {/* Footer information */}
      <footer style={footerStyle} role="contentinfo">
        <p style={{ margin: 0, fontWeight: 700 }}>
          {lang === "hi"
            ? "जिला प्रशासन, उत्तराखंड"
            : "District Administration, Uttarakhand"}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>
          Designed & Developed by District Administration
        </p>

        {/* Footer navigation links */}
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

// Page container
const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f4f6f9",
};

// Layout wrapper
const contentWrapper = {
  flex: 1,
  display: "flex",
};

// Language toggle container
const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 5,
  display: "flex",
  gap: "6px",
};

// Language toggle button
const langBtn = (active) => ({
  padding: "6px 10px",
  border: "1px solid #0056b3",
  backgroundColor: active ? "#0056b3" : "#ffffff",
  color: active ? "#ffffff" : "#0056b3",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.8rem",
});

// Left image section
const leftSection = {
  flex: 1,
  position: "relative",
};

// Background image styling
const leftImage = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

// Overlay over background image
const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
};

// Right section for login form
const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

// Login form container
const loginBox = {
  width: "100%",
  maxWidth: 360,
  background: "#ffffff",
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

// Form title
const title = {
  textAlign: "center",
  marginBottom: 16,
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#000",
};

// Input label
const label = {
  fontWeight: 600,
  fontSize: "0.85rem",
  color: "#000",
};

// Input fields
const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  border: "1px solid #000",
  color: "#000",
};

// Login button
const loginBtn = {
  width: "100%",
  padding: 12,
  background: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

// Footer styling
const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
};

// Footer link list
const footerLinks = {
  listStyle: "none",
  padding: 0,
  margin: "8px 0 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};
