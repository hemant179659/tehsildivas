import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";
import axios from "axios";

export default function DataEntryLogin() {
  const navigate = useNavigate();

  const [tehsil, setTehsil] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("hi");

  /* 🔹 ONLY FOR DROPDOWN (NO PASSWORD HERE) */
  const TEHSIL_LIST = [
    "Tehsil Rudrapur",
    "Tehsil Sitarganj",
    "Tehsil Khatima",
    "Tehsil Kashipur",
    "Tehsil Jaspur",
    "Tehsil Gadarpur",
    "Tehsil Bajpur",
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= LOGIN (DB BASED) ================= */
  const handleLogin = async () => {
    if (!tehsil || !email || !password) {
      alert(lang === "hi" ? "कृपया सभी जानकारी भरें" : "Please fill all details");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/department/operatorlogin`, {
        tehsil,
        email,
        password,
      });

      if (res.data?.success) {
        localStorage.setItem("dataEntryOperator", res.data.operatorName);
        localStorage.setItem("loggedTehsil", res.data.tehsil);

        navigate("/operator-dashboard", { replace: true });
      }
    } catch (err) {
      alert(lang === "hi" ? "गलत ईमेल या पासवर्ड" : "Invalid email or password");
    }
  };

  return (
    <div style={pageWrapper} lang={lang}>
      {/* ---------- LANGUAGE TOGGLE ---------- */}
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
        {!isMobile && (
          <aside style={leftSection} aria-hidden="true">
            <div style={leftImage} />
            <div style={overlay} />
            <BackButton onClick={() => navigate("/")} />
          </aside>
        )}

        <main style={rightSection} role="main">
          <section style={loginBox}>
            <h2 style={title}>
              {lang === "hi"
                ? "डेटा एंट्री ऑपरेटर लॉगिन"
                : "Data Entry Operator Login"}
            </h2>

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
              {TEHSIL_LIST.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label style={label}>{lang === "hi" ? "ईमेल" : "Email"}</label>
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

      {/* ---------- FOOTER ---------- */}
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

const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 5,
  display: "flex",
  gap: "6px",
};

const langBtn = (active) => ({
  padding: "6px 10px",
  border: "1px solid #0056b3",
  backgroundColor: active ? "#0056b3" : "#ffffff",
  color: active ? "#ffffff" : "#0056b3",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.8rem",
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
  background: "rgba(0,0,0,0.25)",
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
  maxWidth: 360,
  background: "#ffffff",
  padding: 24,
  borderRadius: 8,
  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
};

const title = {
  textAlign: "center",
  marginBottom: 16,
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#000",
};

const label = {
  fontWeight: 600,
  fontSize: "0.85rem",
  color: "#000",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  border: "1px solid #000",
  color: "#000",
};

const loginBtn = {
  width: "100%",
  padding: 12,
  background: "#0056b3",
  color: "#fff",
  border: "none",
  borderRadius: 4,
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
