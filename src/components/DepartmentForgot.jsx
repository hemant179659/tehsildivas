import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= RESET ================= */
  const handleReset = async () => {
    if (!email) return toast.error("कृपया ईमेल दर्ज करें");

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/department/forgot-password`, {
        email,
      });

      toast.success("रीसेट लिंक आपके ईमेल पर भेज दिया गया है");
      setTimeout(() => navigate("/dept-login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "कुछ त्रुटि हुई");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <ToastContainer autoClose={2000} position="top-right" />

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
          <h2 style={title}>पासवर्ड भूल गए</h2>

          <p style={infoText}>
            अपना ईमेल दर्ज करें, रीसेट लिंक आपके ईमेल पर भेजा जाएगा।
          </p>

          <input
            style={input}
            type="email"
            placeholder="ईमेल दर्ज करें"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button style={loginBtn} onClick={handleReset} disabled={loading}>
            {loading ? "भेजा जा रहा है..." : "रीसेट लिंक भेजें"}
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
  backgroundColor: "rgba(0,0,0,0.35)", // only image dark
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
  marginBottom: 12,
  fontWeight: 900,
  color: "#000",
};

const infoText = {
  fontSize: "0.9rem",
  marginBottom: 16,
  textAlign: "center",
  color: "#333",
  fontWeight: 500,
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
