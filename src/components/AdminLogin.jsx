import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill email and password");
      return;
    }

    if (email === "diousn@nic.in" && password === "diousn@123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        paddingBottom: "80px", // footer space
      }}
    >
      <div
        className={styles.loginPage}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT SECTION */}
        <div
          className={styles.leftSection}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: isMobile ? "cover" : "115%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 20%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingTop: "20px",
            height: isMobile ? "250px" : "calc(100vh - 50px)",
            borderRight: isMobile ? "none" : "1px solid #eee",
          }}
        >
          <BackButton onClick={() => navigate("/")} />
        </div>

        {/* RIGHT SECTION */}
        <div
          className={styles.rightSection}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: isMobile ? "40px" : "0",
            height: isMobile ? "auto" : "calc(100vh - 50px)",
            paddingTop: isMobile ? "40px" : "0",
          }}
        >
          <div
            className={styles.loginBox}
            style={isMobile ? { width: "85%", maxWidth: "400px" } : {}}
          >
            <h2 className={styles.loginTitle}>Admin Login</h2>

            <input
              className={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>

      {/* ===== SAME FIXED FOOTER (AS OTHER PAGES) ===== */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: 700 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </div>
  );
}

/* ================= FOOTER STYLE ================= */

const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 999,
};
