import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminProjectDashboard() {
  const navigate = useNavigate();

  const [deptData, setDeptData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ================= RESIZE ================= */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ================= ADMIN AUTH ================= */
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      toast.warning("Please login first");
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get(
          "/api/department/department-complaints?all=true"
        );

        const complaints = res.data.complaints || [];

        const total = complaints.length;
        const pending = complaints.filter(c => c.status === "लंबित").length;
        const progress = complaints.filter(c => c.status === "प्रक्रिया में").length;
        const resolved = complaints.filter(c => c.status === "निस्तारित").length;

        setStats({ total, pending, progress, resolved });

        const deptMap = {};
        complaints.forEach(c => {
          if (!deptMap[c.department]) {
            deptMap[c.department] = {
              department: c.department,
              लंबित: 0,
              प्रक्रिया_में: 0,
              निस्तारित: 0,
              कुल: 0,
            };
          }
          deptMap[c.department].कुल++;
          if (c.status === "लंबित") deptMap[c.department].लंबित++;
          if (c.status === "प्रक्रिया में") deptMap[c.department].प्रक्रिया_में++;
          if (c.status === "निस्तारित") deptMap[c.department].निस्तारित++;
        });

        setDeptData(Object.values(deptMap));
      } catch {
        toast.error("डेटा लोड नहीं हो सका");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const COLORS = ["#dc3545", "#ffc107", "#198754", "#0d6efd", "#6f42c1"];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login", { replace: true });
  };

  return (
    <>
      <ToastContainer autoClose={2000} />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: isMobile ? "column" : "row",
          paddingBottom: "80px",
          background: "#fff",
          color: "#000",
        }}
      >
        {/* ================= SIDEBAR ================= */}
        <aside style={{ ...sidebar, width: isMobile ? "100%" : 260 }}>
          <FaUserCircle size={48} />
          <h3 style={{ marginTop: 10, color: "#fff" }}>Admin</h3>

          <div style={sideItem}><FaTachometerAlt /> Dashboard</div>
          <div style={sideItem}onClick={() => navigate("/admin/pending")}>🟥 लंबित
           
          </div>
          <div style={sideItem}onClick={() => navigate("/admin/in-progress")}>🟨 प्रक्रिया में</div>
          <div style={sideItem}onClick={() => navigate("/admin/completed")}>🟩 निस्तारित</div>
          <div style={sideItem}onClick={() => navigate("/admin/overall")}>📊 Overall Status</div>

          <div onClick={handleLogout} style={{ cursor: "pointer", marginTop: 30 }}>
            <FaSignOutAlt /> Logout
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={{ flex: 1, padding: isMobile ? 15 : 30, color: "#000" }}>
          <h1 style={title}>Admin Dashboard</h1>

          {loading ? (
            <p style={centerText}>लोड हो रहा है...</p>
          ) : (
            <>
              {/* ================= TOP CARDS ================= */}
              <div style={cards}>
                <div style={card}>
                  <h3>कुल शिकायतें</h3>
                  <p>{stats.total}</p>
                </div>
                <div style={card}>
                  <h3>लंबित</h3>
                  <p style={{ color: "#dc3545" }}>{stats.pending}</p>
                </div>
                <div style={card}>
                  <h3>प्रक्रिया में</h3>
                  <p style={{ color: "#ffc107" }}>{stats.progress}</p>
                </div>
                <div style={card}>
                  <h3>निस्तारित</h3>
                  <p style={{ color: "#198754" }}>{stats.resolved}</p>
                </div>
              </div>

              {/* ================= PIE CHARTS ================= */}
              <div style={pieGrid}>
                {[
                  { key: "लंबित", title: "लंबित (Department-wise)" },
                  { key: "प्रक्रिया_में", title: "प्रक्रिया में (Department-wise)" },
                  { key: "निस्तारित", title: "निस्तारित (Department-wise)" },
                  { key: "कुल", title: "Overall (Department-wise)" },
                ].map((item, idx) => (
                  <div key={idx} style={chartBox}>
                    <h3 style={chartTitle}>{item.title}</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={deptData}
                          dataKey={item.key}
                          nameKey="department"
                          outerRadius={90}
                          label={{ fill: "#000", fontSize: 12, fontWeight: 700 }}
                        >
                          {deptData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ color: "#000", fontWeight: 700 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* ================= BAR CHART ================= */}
             
              
            </>
          )}
        </main>
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={footer}>
        <p style={{ margin: 0, fontWeight: 800 }}>जिला प्रशासन</p>
        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700 }}>
          Designed & Developed by District Administration
        </p>
      </footer>
    </>
  );
}

/* ================= STYLES ================= */

const sidebar = {
  background: "#002147",
  color: "#fff",
  padding: 20,
};

const sideItem = {
  marginTop: 14,
  cursor: "pointer",
  fontWeight: 700,
};

const title = {
  textAlign: "center",
  fontWeight: 900,
  color: "#000",
};

const chartTitle = {
  textAlign: "center",
  color: "#000",
  fontWeight: 800,
  marginBottom: 10,
};

const centerText = {
  textAlign: "center",
  fontWeight: 700,
  color: "#000",
};

const cards = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: 40,
};

const card = {
  background: "#f8f9fa",
  padding: 20,
  borderRadius: 10,
  minWidth: 180,
  textAlign: "center",
  fontWeight: 800,
  color: "#000",
};

const pieGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 30,
};

const chartBox = {
  background: "#f8f9fa",
  padding: 15,
  borderRadius: 10,
};

const footer = {
  position: "fixed",
  bottom: 0,
  width: "100%",
  background: "#fff",
  borderTop: "4px solid #0056b3",
  textAlign: "center",
  padding: 10,
  color: "#000",
};
