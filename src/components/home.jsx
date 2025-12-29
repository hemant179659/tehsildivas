// Import Link component for client-side routing
import { Link } from "react-router-dom";

// Import React hooks
import { useState, useEffect } from "react";

// Import background image asset
import backgroundImage from "../assets/work.jpeg";

// Home page component
export default function Home() {
  // Detect mobile screen on initial load
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Language state (Hindi / English)
  const [lang, setLang] = useState("hi"); // hi | en

  // Effect to update layout on window resize
  useEffect(() => {
    // Resize handler
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    // Attach resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // Page wrapper with language attribute for accessibility
    <div style={pageWrapper} lang={lang}>
      {/* ================= SKIP TO CONTENT ================= */}
      {/* Accessibility link for keyboard/screen-reader users */}
      <a href="#main-content" style={skipLink}>
        {lang === "hi" ? "मुख्य सामग्री पर जाएँ" : "Skip to main content"}
      </a>

      {/* ================= BACKGROUND ================= */}
      {/* Decorative background image */}
      <div style={backgroundStyle(backgroundImage)} aria-hidden="true" />

      {/* ================= LANGUAGE TOGGLE ================= */}
      {/* Switch UI language */}
      <div style={langToggle}>
        <button onClick={() => setLang("hi")} style={langBtn(lang === "hi")}>
          हिंदी
        </button>
        <button onClick={() => setLang("en")} style={langBtn(lang === "en")}>
          English
        </button>
      </div>

      {/* ================= HEADER ================= */}
      {/* Page header */}
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
      {/* Main content section */}
      <main id="main-content" style={mainStyle} role="main">
        <div style={buttonContainer}>
          {/* ---------- TOP ROW ---------- */}
          <div style={buttonRow(isMobile)}>
            {/* Department login */}
            <Link to="/dept-login" style={govButton("#0d6efd", isMobile)}>
              {lang === "hi" ? "विभाग लॉगिन" : "Department Login"}
            </Link>

            {/* Operator login */}
            <Link to="/operator-login" style={govButton("#198754", isMobile)}>
              {lang === "hi" ? "ऑपरेटर लॉगिन" : "Operator Login"}
            </Link>
          </div>

          {/* ---------- BOTTOM ROW ---------- */}
          <div style={buttonRow(isMobile)}>
            {/* Public complaint tracking */}
            <Link to="/complaint-status" style={govButton("#fd7e14", isMobile)}>
              {lang === "hi"
                ? "शिकायत की स्थिति देखें"
                : "Check Complaint Status"}
            </Link>

            {/* Admin login */}
            <Link to="/admin-login" style={govButton("#6f42c1", isMobile)}>
              {lang === "hi" ? "एडमिन लॉगिन" : "Admin Login"}
            </Link>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      {/* Footer with links and credits */}
      <footer style={footerStyle} role="contentinfo">
        <p style={{ margin: 0, fontWeight: 700 }}>
          {lang === "hi"
            ? "जिला प्रशासन, उत्तराखंड"
            : "District Administration, Uttarakhand"}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem" }}>
          Designed & Developed by District Administration
        </p>

        {/* Footer navigation links */}
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

// Overall page wrapper
const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#001529",
  position: "relative",
};

// Skip-to-content link styling
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

// Background image overlay
const backgroundStyle = (img) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.15,
  zIndex: 0,
});

/* Language toggle container */
const langToggle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  zIndex: 5,
  display: "flex",
  gap: "6px",
};

// Language button style
const langBtn = (active) => ({
  padding: "6px 10px",
  border: "1px solid #fff",
  backgroundColor: active ? "#fff" : "transparent",
  color: active ? "#000" : "#fff",
  cursor: "pointer",
  fontWeight: 600,
});

// Header styles
const headerStyle = {
  textAlign: "center",
  padding: "50px 16px 20px",
  color: "#ffffff",
  zIndex: 1,
};

// Main title style
const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.8rem" : "2.8rem",
  fontWeight: 800,
  marginBottom: "6px",
});

// Subtitle style
const subtitleStyle = (isMobile) => ({
  fontSize: isMobile ? "1rem" : "1.3rem",
  fontWeight: 500,
});

// Main content wrapper
const mainStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  zIndex: 1,
};

// Button layout container
const buttonContainer = {
  width: "100%",
  maxWidth: "900px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

// Row layout for buttons
const buttonRow = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "16px",
  justifyContent: "center",
});

// Government-style button
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

// Footer styling
const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "14px 10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 1,
};

// Footer link list
const footerLinks = {
  listStyle: "none",
  padding: 0,
  margin: "8px 0 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  justifyContent: "center",
};
