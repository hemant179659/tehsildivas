import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("hi");

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  /* ================= LOGIN ================= */
  const handleLogin = () => {
    if (!email || !password) {
      return toast.error(
        lang === "hi"
          ? "कृपया ईमेल और पासवर्ड दर्ज करें"
          : "Please enter email and password"
      );
    }

    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      toast.success(lang === "hi" ? "लॉगिन सफल" : "Login successful");

      setTimeout(() => {
        navigate("/admin-dashboard", { replace: true });
      }, 1200);
    } else {
      toast.error(
        lang === "hi" ? "गलत ईमेल या पासवर्ड" : "Invalid email or password"
      );
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
              {lang === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
            </h1>

            <label style={label}>
              {lang === "hi" ? "ईमेल" : "Email"}
            </label>
            <input
              style={input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label style={label}>
              {lang === "hi" ? "पासवर्ड" : "Password"}
            </label>
            <input
              style={input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button style={loginBtn} onClick={handleLogin}>
              {lang === "hi" ? "लॉगिन करें" : "Login"}
            </button>
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

const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "6px 10px",
  zIndex: 1000,
};

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

const rightSection = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
};

const loginBox = {
  width: "100%",
  maxWidth: 380,
  background: "#ffffff",
  padding: 26,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

const title = {
  textAlign: "center",
  marginBottom: 18,
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#000",
};

const label = {
  marginBottom: 4,
  fontWeight: 500,
  fontSize: "0.85rem",
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
