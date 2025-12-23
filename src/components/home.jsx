import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import backgroundImage from "../assets/work.jpeg";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 400);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 400);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={containerStyle}>
      {/* BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
          zIndex: 1,
        }}
      />

      {/* CONTENT */}
      <div style={contentStyle}>
        <h1 style={titleStyle(isMobile, isSmallMobile)}>
          District Administration Portal
        </h1>

        <div style={divider}></div>

        <div style={buttonWrapper(isMobile)}>
          {/* ✅ DEPARTMENT LOGIN (ADMIN BUTTON REPLACED) */}
          <Link to="/dept-login" style={govButton("#0056b3", isMobile)}>
            DEPARTMENT LOGIN
          </Link>

          {/* OPERATOR LOGIN */}
          <Link to="/operator-login" style={govButton("#28a745", isMobile)}>
            OPERATOR LOGIN
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={footerStyle}>
        <p style={{ margin: 0, fontWeight: "bold" }}>
          District Administration
        </p>
        <p style={{ margin: 0, fontSize: "0.65rem" }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </div>
  );
}

/* ---------- STYLES ---------- */

const containerStyle = {
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#001529",
  overflow: "hidden",
};

const contentStyle = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "#fff",
  width: "90%",
  maxWidth: "800px",
};

const titleStyle = (isMobile, isSmall) => ({
  fontSize: isSmall ? "1.4rem" : isMobile ? "1.8rem" : "3rem",
  textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
  textTransform: "uppercase",
});

const divider = {
  width: "80px",
  height: "4px",
  backgroundColor: "#ff9933",
  margin: "20px auto",
};

const buttonWrapper = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "20px",
  justifyContent: "center",
});

const govButton = (bg, isMobile) => ({
  padding: "14px 24px",
  backgroundColor: bg,
  color: "#fff",
  textDecoration: "none",
  borderRadius: "4px",
  fontWeight: "600",
  width: isMobile ? "80%" : "240px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
});

const footerStyle = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  textAlign: "center",
  backgroundColor: "#f8f9fa",
  padding: "8px",
  borderTop: "3px solid #0056b3",
};
