import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= HOME ================= */
import Home from "./components/home";

/* ================= OPERATOR ================= */
import DataEntryLogin from "./components/operatorlogin";
import ComplaintRegister from "./components/operatordashboard";
import RegisteredComplaints from "./components/RegisteredComplaints";

/* ================= ADMIN ================= */
import AdminDashboard from "./components/AdminDashboard";
import AdminProjectList from "./components/AdminProjectList";
import DepartmentStatus from "./components/DepartmentStatus";
import Completed from "./components/Completed";
import Pending from "./components/Pending";
import ProjectPhotoAdmin from "./components/ProjectPhotoAdmin";

/* ================= DEPARTMENT AUTH ================= */
import DepartmentLogin from "./components/DepartmentLogin";
import DepartmentSignup from "./components/DepartmentSignup";
import DepartmentForgot from "./components/DepartmentForgot";
import Verification from "./components/verification";
import DeptResetPassword from "./components/DeptResetPassword";

/* ================= DEPARTMENT MAIN ================= */
import DepartmentDashboard from "./components/DepartmentDashboard";
import DepartmentAction from "./components/DepartmentAction";

/* ================= DEPARTMENT SIDEBAR PAGES ================= */
import DeptPending from "./components/DeptPending";
import DeptInProgress from "./components/DeptInProgress";
import DeptResolved from "./components/DeptResolved";
import DeptOverall from "./components/DeptOverall";

/* ================= OTHER ================= */
import ProjectList from "./components/ProjectList";
import DailyReporting from "./components/DailyReporting";
import ProjectRecentPhoto from "./components/ProjectRecentPhoto";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= HOME ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= OPERATOR ================= */}
        <Route path="/operator-login" element={<DataEntryLogin />} />
        <Route path="/operator-dashboard" element={<ComplaintRegister />} />
        <Route
          path="/registered-complaints"
          element={<RegisteredComplaints />}
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-project-list" element={<AdminProjectList />} />
        <Route path="/department-status" element={<DepartmentStatus />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/pending" element={<Pending />} />
        <Route
          path="/projectrecentphotoadmin"
          element={<ProjectPhotoAdmin />}
        />

        {/* ================= DEPARTMENT AUTH ================= */}
        <Route path="/dept-login" element={<DepartmentLogin />} />
        <Route path="/dept-signup" element={<DepartmentSignup />} />
        <Route path="/dept-forgot" element={<DepartmentForgot />} />
        <Route path="/dept-verify" element={<Verification />} />
        <Route
          path="/dept-reset-password"
          element={<DeptResetPassword />}
        />

        {/* ================= DEPARTMENT DASHBOARD ================= */}
        <Route path="/dept-dashboard" element={<DepartmentDashboard />} />

        {/* MAIN ACTION PAGE (remark + update) */}
        <Route
          path="/department-complaints"
          element={<DepartmentAction />}
        />

        {/* ================= DEPARTMENT SIDEBAR TABS ================= */}
        {/* ================= DEPARTMENT SIDEBAR TABS ================= */}
<Route path="/dept/pending" element={<DeptPending />} />
<Route path="/dept/in-progress" element={<DeptInProgress />} />
<Route path="/dept/resolved" element={<DeptResolved />} />
<Route path="/dept/overall" element={<DeptOverall />} />


        {/* ================= OTHER ================= */}
        <Route path="/project-list" element={<ProjectList />} />
        <Route path="/daily-reporting" element={<DailyReporting />} />
        <Route path="/project-photos" element={<ProjectRecentPhoto />} />
      </Routes>
    </Router>
  );
}
