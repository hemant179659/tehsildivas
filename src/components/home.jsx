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
    <div style={pageWrapper}>
      {/* BACKGROUND */}
      <div style={backgroundStyle(backgroundImage)} />

      {/* MAIN CONTENT */}
      <main style={contentWrapper}>
        <div style={contentStyle}>
          <h1 style={titleStyle(isMobile, isSmallMobile)}>तहसील दिवस</h1>

          <h2 style={subTitleStyle(isMobile)}>शिकायत निवारण पोर्टल</h2>

          <div style={divider}></div>

          <div style={buttonWrapper(isMobile)}>
            <Link to="/dept-login" style={govButton("#0d6efd", isMobile)}>
              विभाग लॉगिन
            </Link>

            <Link to="/operator-login" style={govButton("#198754", isMobile)}>
              ऑपरेटर लॉगिन
            </Link>

            <Link to="/complaint-status" style={govButton("#fd7e14", isMobile)}>
              शिकायत की स्थिति देखें
            </Link>

            <Link to="/admin-login" style={govButton("#6f42c1", isMobile)}>
              एडमिन लॉगिन
            </Link>
          </div>
        </div>
      </main>

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
  flexDirection: "column",
  position: "relative",
  backgroundColor: "#001529",
};

const backgroundStyle = (img) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: 0.25,
  zIndex: 1,
});

const contentWrapper = {
  flex: 1,                 // ✅ pushes footer to bottom
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  overflowY: "auto",       // ✅ mobile scroll works
  zIndex: 2,
};

const contentStyle = {
  textAlign: "center",
  color: "#fff",
  width: "100%",
  maxWidth: "900px",
  marginTop: "-20px",
};

const titleStyle = (isMobile, isSmall) => ({
  fontSize: isSmall ? "1.6rem" : isMobile ? "2rem" : "3.2rem",
  fontWeight: 900,
  marginBottom: "6px",
  letterSpacing: "1px",
  textShadow: "2px 2px 6px rgba(0,0,0,0.85)",
  textTransform: "uppercase",
});

const subTitleStyle = (isMobile) => ({
  fontSize: isMobile ? "1rem" : "1.4rem",
  fontWeight: 600,
  marginBottom: "16px",
  color: "#f8f9fa",
  textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
});

const divider = {
  width: "90px",
  height: "4px",
  backgroundColor: "#ff9933",
  margin: "18px auto 28px",
};

const buttonWrapper = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "18px",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
});

const govButton = (bg, isMobile) => ({
  padding: "14px 22px",
  backgroundColor: bg,
  color: "#fff",
  textDecoration: "none",
  borderRadius: "4px",
  fontWeight: 700,
  width: isMobile ? "100%" : "240px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
});

const footerStyle = {
  backgroundColor: "#ffffff",
  textAlign: "center",
  padding: "10px",
  borderTop: "4px solid #0056b3",
  color: "#000",
  zIndex: 3,
};
