import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import backgroundImage from "../assets/work.jpeg";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lang, setLang] = useState("hi"); // hi | en

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={pageWrapper} lang={lang}>
      {/* ================= SKIP TO CONTENT ================= */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= BACKGROUND ================= */}
      <div style={backgroundStyle(backgroundImage)} aria-hidden="true" />

      {/* ================= LANGUAGE TOGGLE ================= */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>
          हिंदी
        </button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>
          English
        </button>
      </div>

      {/* ================= HEADER ================= */}
      <header style={headerStyle} role="banner">
        <h1 style={titleStyle(isMobile)}>
          {lang === "hi" ? "तहसील दिवस" : "Tehsil Diwas"}
        </h1>
        <p style={subtitleStyle(isMobile)}>
          {lang === "hi"
            ? "शिकायत निवारण पोर्टल"
            : "Grievance Redressal Portal"}
        </p>
      </header>

      {/* ================= MAIN ================= */}
      <main id="main-content" style={mainStyle} role="main">
        <div style={buttonContainer}>
          {/* ---------- TOP ROW ---------- */}
          <div style={buttonRow(isMobile)}>
            <Link to="/dept-login" style={govButton("#0d6efd", isMobile)}>
              {lang === "hi" ? "विभाग लॉगिन" : "Department Login"}
            </Link>

            <Link to="/operator-login" style={govButton("#198754", isMobile)}>
              {lang === "hi" ? "ऑपरेटर लॉगिन" : "Operator Login"}
            </Link>
          </div>

          {/* ---------- BOTTOM ROW ---------- */}
          <div style={buttonRow(isMobile)}>
            <Link to="/complaint-status" style={govButton("#fd7e14", isMobile)}>
              {lang === "hi"
                ? "शिकायत की स्थिति देखें"
                : "Check Complaint Status"}
            </Link>

            <Link to="/admin-login" style={govButton("#6f42c1", isMobile)}>
              {lang === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
            </Link>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
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
  backgroundColor: "#001529",
  position: "relative",
};

const skipLink = {
  position: "absolute",
  top: "-40px",
  left: "10px",
  background: "#000",
  color: "#fff",
  padding: "8px 12px",
  zIndex: 1000,
  textDecoration: "none",
};

const backgroundStyle = (img) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.15,
  zIndex: 0,
});

/* Language toggle */
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
  border: "1px solid #fff",
  backgroundColor: active ? "#fff" : "transparent",
  color: active ? "#000" : "#fff",
  cursor: "pointer",
  fontWeight: 600,
});

const headerStyle = {
  textAlign: "center",
  padding: "50px 16px 20px",
  color: "#ffffff",
  zIndex: 1,
};

const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.8rem" : "2.8rem",
  fontWeight: 800,
  marginBottom: "6px",
});

const subtitleStyle = (isMobile) => ({
  fontSize: isMobile ? "1rem" : "1.3rem",
  fontWeight: 500,
});

const mainStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 1,
};

const buttonContainer = {
  width: "100%",
  maxWidth: "900px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const buttonRow = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "16px",
  justifyContent: "center",
});

const govButton = (bg, isMobile) => ({
  backgroundColor: bg,
  color: "#ffffff",
  textDecoration: "none",
  padding: "14px",
  fontSize: "1rem",
  fontWeight: 600,
  borderRadius: "4px",
  textAlign: "center",
  width: isMobile ? "100%" : "240px",
  minHeight: "48px",
});

const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 1,
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
