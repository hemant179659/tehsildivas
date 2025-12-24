import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      return toast.error("Please enter email and password");
    }

    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      toast.success("Admin login successful");

      setTimeout(() => {
        navigate("/admin-dashboard", { replace: true });
      }, 1200);
    } else {
      toast.error("Invalid email or password");
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
          <BackButton onClick={() => navigate("/", { replace: true })} />
        </div>
      )}

      {/* RIGHT FORM */}
      <div style={rightSection}>
        <div style={loginBox}>
          <h2 style={title}>Admin Login</h2>

          <input
            style={input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={loginBtn} onClick={handleLogin}>
            Login
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
  backgroundColor: "rgba(0,0,0,0.35)", // only background faded
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
