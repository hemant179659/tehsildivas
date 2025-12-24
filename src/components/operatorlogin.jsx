import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DataEntryLogin() {
  const navigate = useNavigate();

  const [tehsil, setTehsil] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const TEHSIL_USERS = {
    "Tehsil Rudrapur": {
      email: "rudrapur@deo.in",
      password: "rudrapur@123",
      operatorName: "Data Entry Operator",
    },
    "Tehsil Sitarganj": {
      email: "sitarganj@deo.in",
      password: "sitarganj@123",
      operatorName: "Data Entry Operator",
    },
    "Tehsil Khatima": {
      email: "khatima@deo.in",
      password: "khatima@123",
      operatorName: "Data Entry Operator",
    },
    "Tehsil Kashipur": {
      email: "kashipur@deo.in",
      password: "kashipur@123",
      operatorName: "Data Entry Operator",
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    if (!tehsil || !email || !password) {
      alert("कृपया सभी जानकारी भरें");
      return;
    }

    const user = TEHSIL_USERS[tehsil];
    if (!user) {
      alert("अमान्य तहसील");
      return;
    }

    if (email === user.email && password === user.password) {
      localStorage.setItem("dataEntryOperator", user.operatorName);
      localStorage.setItem("loggedTehsil", tehsil);
      navigate("/operator-dashboard", { replace: true });
    } else {
      alert("गलत ईमेल या पासवर्ड");
    }
  };

  return (
    <div style={pageWrapper}>
      {/* LEFT IMAGE */}
      {!isMobile && (
        <div style={leftSection}>
          <div style={leftImage} />
          <div style={overlay} />
          <BackButton onClick={() => navigate("/")} />
        </div>
      )}

      {/* RIGHT FORM */}
      <div style={rightSection}>
        <div style={loginBox}>
          <h2 style={title}>डेटा एंट्री ऑपरेटर लॉगिन</h2>

          <select style={input} value={tehsil} onChange={(e) => setTehsil(e.target.value)}>
            <option value="">-- तहसील चुनें --</option>
            {Object.keys(TEHSIL_USERS).map((t) => (
              <option key={t} value={t}>
                {t}
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

          <button style={loginBtn} onClick={handleLogin}>
            लॉगिन करें
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </div>
  );
}

/* ================= STYLES ================= */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "row",
  position: "relative",
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
  backgroundColor: "rgba(0,0,0,0.35)", // ✅ ONLY overlay has opacity
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
  maxWidth: 380,
  background: "#fff",
  padding: 30,
  borderRadius: 10,
  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  marginBottom: 20,
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
