import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DepartmentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/department-complaints", { replace: true });
    }
  }, [navigate]);

  // 🚫 Prevent back navigation
  useEffect(() => {
    window.history.replaceState({ page: "login" }, "", window.location.href);
    window.history.pushState({ page: "login_dummy" }, "", window.location.href);
    const handlePopState = () => navigate("/", { replace: true });
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("कृपया ईमेल और पासवर्ड दर्ज करें");
    }

    try {
      const res = await axios.post("http://localhost:8000/api/department/login", {
        email,
        password,
      });

      localStorage.setItem("loggedInDepartment", res.data.deptName);
      toast.success("लॉगिन सफल!");

      setTimeout(() => {
        navigate("/department-complaints", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "लॉगिन विफल");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />

      <div
        className={styles.loginPage}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT */}
        <div
          className={styles.leftSection}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: isMobile ? "100%" : "50%",
            height: isMobile ? "250px" : "100%",
          }}
        >
          <BackButton onClick={() => navigate("/", { replace: true })} />
        </div>

        {/* RIGHT */}
        <div
          className={styles.rightSection}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "120px",
          }}
        >
          <div className={styles.loginBox} style={{ maxWidth: 400 }}>
            <h2>Department Login</h2>

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

            <div className={styles.linkGroup}>
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/dept-signup")}
              >
                Signup
              </button>

              <button
                className={styles.loginBtn}
                onClick={() => navigate("/dept-forgot")}
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#f8f9fa",
          borderTop: "3px solid #0056b3",
          padding: "8px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#002147" }}>
          District Administration
        </p>
        <p style={{ margin: 0, fontSize: "0.7rem" }}>
          Designed and Developed by <strong>District Administration</strong>
        </p>
      </footer>
    </div>
  );
}
