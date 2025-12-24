import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function DeptResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= VALIDATE LINK ================= */
  useEffect(() => {
    if (!token || !email) {
      alert("अमान्य या समाप्त लिंक");
      navigate("/dept-login", { replace: true });
    }
  }, [token, email, navigate]);

  /* ================= RESET ================= */
  const handleReset = async () => {
    if (!newPassword || !confirmPassword)
      return alert("कृपया सभी फ़ील्ड भरें");

    if (newPassword !== confirmPassword)
      return alert("पासवर्ड मेल नहीं खा रहे");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/department/reset-password",
        { email, token, newPassword }
      );

      alert(res.data.message || "पासवर्ड सफलतापूर्वक बदला गया");
      navigate("/dept-login", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "कुछ त्रुटि हुई");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      {/* LEFT IMAGE (DESKTOP ONLY) */}
      {!isMobile && (
        <div style={leftSection}>
          <div style={leftImage} />
          <div style={overlay} />
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>
      )}

      {/* RIGHT FORM */}
      <div style={rightSection}>
        <div style={loginBox}>
          <h2 style={title}>पासवर्ड रीसेट करें</h2>

          <input
            style={input}
            type="password"
            placeholder="नया पासवर्ड"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="पासवर्ड पुनः दर्ज करें"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button style={primaryBtn} onClick={handleReset} disabled={loading}>
            {loading ? "रीसेट हो रहा है..." : "पासवर्ड रीसेट करें"}
          </button>

          <button
            style={secondaryBtn}
            onClick={() => navigate("/dept-login")}
          >
            लॉगिन पर वापस जाएँ
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
  backgroundColor: "rgba(0,0,0,0.35)", // ONLY IMAGE DARK
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

const primaryBtn = {
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
