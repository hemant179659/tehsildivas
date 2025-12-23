import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles.module.css";
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
      alert("Please fill all fields");
      return;
    }

    const user = TEHSIL_USERS[tehsil];
    if (!user) {
      alert("Invalid Tehsil");
      return;
    }

    if (email === user.email && password === user.password) {
      // ✅ STORE PROPER VALUES (NO BOOLEAN)
      localStorage.setItem(
        "dataEntryOperator",
        user.operatorName
      );
      localStorage.setItem("loggedTehsil", tehsil);

      navigate("/operator-dashboard", { replace: true });
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div
        className={styles.leftSection}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: isMobile ? "220px" : "100vh",
        }}
      >
        <BackButton onClick={() => navigate("/")} />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <h2>Data Entry Operator Login</h2>

          <select
            className={styles.inputField}
            value={tehsil}
            onChange={(e) => setTehsil(e.target.value)}
          >
            <option value="">-- Select Tehsil --</option>
            {Object.keys(TEHSIL_USERS).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

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
  );
}
