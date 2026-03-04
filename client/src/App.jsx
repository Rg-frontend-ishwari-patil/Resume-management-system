import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AptitudeTest from "./pages/AptitudeTest";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./components/AdminDashboard";
import CandidateDashboard from "./components/CandidateDashboard";
import ApplicationsByJob from "./pages/admin/AppliedJobs";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import CreateJob from "./pages/CreateJob";
import Navbar from "./pages/Navbar";

function App() {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="/admin/applied-jobs" element={<ApplicationsByJob />} />
        <Route
          path="/admin/analytics"
          element={role === "admin" ? <AnalyticsDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/createJob"
          element={role === "admin" ? <CreateJob /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
