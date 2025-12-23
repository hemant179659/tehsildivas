import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles.module.css";
import BackButton from "./BackButton";
import backgroundImage from "../assets/login.jpg";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   DEPARTMENTS + VERIFICATION CODES
   (SAME AS OPERATOR DASHBOARD)
========================= */
const DEPARTMENT_CODES = {
  "राजस्व विभाग": "11111",
  "पुलिस विभाग": "22222",
  "स्वास्थ्य विभाग": "33333",
  "शिक्षा विभाग": "44444",
};

export default function DepartmentSignup() {
  const navigate = useNavigate();

  const [deptName, setDeptName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* =========================
     RESPONSIVE
  ========================= */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     REDIRECT IF LOGGED IN
  ========================= */
  useEffect(() => {
    const loggedInDept = localStorage.getItem("loggedInDepartment");
    if (loggedInDept) {
      navigate("/department-complaints", { replace: true });
    }
  }, [navigate]);

  /* =========================
     BACK NAVIGATION CONTROL
  ========================= */
  useEffect(() => {
    const handlePopState = () => navigate("/dept-login");
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  /* =========================
     SIGNUP HANDLER
  ========================= */
  const handleSignup = async () => {
    if (
      !deptName ||
      !email ||
      !password ||
      !confirmPassword ||
      !verificationCode
    ) {
      return toast.error("कृपया सभी फ़ील्ड भरें");
    }

    if (password !== confirmPassword) {
      return toast.error("पासवर्ड मेल नहीं खा रहा");
    }

    // ✅ DEPARTMENT-WISE VERIFICATION
    if (DEPARTMENT_CODES[deptName] !== verificationCode) {
      return toast.error("गलत Verification Code");
    }

    try {
      await axios.post("http://localhost:8000/api/department/signup", {
        deptName,
        email,
        password,
      });

      toast.success("विभाग सफलतापूर्वक पंजीकृत हो गया");

      setTimeout(() => {
        navigate("/dept-login", { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
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
        {/* ================= LEFT ================= */}
        <div
          className={styles.leftSection}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: isMobile ? "100%" : "50%",
            height: isMobile ? "220px" : "100%",
          }}
        >
          <BackButton onClick={() => navigate("/dept-login")} />
        </div>

        {/* ================= RIGHT ================= */}
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
            <h2 style={{ textAlign: "center" }}>
              Department Signup
            </h2>

            {/* DEPARTMENT */}
            <select
              className={styles.inputField}
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            >
              <option value="">विभाग चुनें</option>
              {Object.keys(DEPARTMENT_CODES).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* EMAIL */}
            <input
              className={styles.inputField}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <input
              className={styles.inputField}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* CONFIRM PASSWORD */}
            <input
              className={styles.inputField}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* VERIFICATION CODE */}
            <input
              className={styles.inputField}
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            <button className={styles.loginBtn} onClick={handleSignup}>
              Signup
            </button>

            <button
              className={styles.loginBtn}
              style={{ marginTop: 10, backgroundColor: "#6c757d" }}
              onClick={() => navigate("/dept-login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          position: isMobile ? "relative" : "fixed",
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
