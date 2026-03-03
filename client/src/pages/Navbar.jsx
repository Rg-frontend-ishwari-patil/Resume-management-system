import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" or "candidate"
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout successful");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2 shadow-sm border-bottom border-primary">
      <Link className="navbar-brand fw-semibold" to="/">
        <span className="text-primary">Resume</span>System
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center">
          {!token ? (
            <>
              <li className="nav-item me-2">
                <Link
                  className={`btn btn-sm px-3 ${
                    location.pathname === "/login"
                      ? "btn-primary"
                      : "btn-outline-light"
                  }`}
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`btn btn-sm px-3 ${
                    location.pathname === "/signup"
                      ? "btn-primary"
                      : "btn-outline-light"
                  }`}
                  to="/signup"
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <>
              {role === "admin" && (
                <>
                  <li className="nav-item me-2">
                    <Link
                      className="btn btn-sm btn-primary px-3 py-1"
                      to="/admin/applied-jobs"
                    >
                      Applied Job List
                    </Link>
                  </li>
                  <li className="nav-item me-2">
                    <span className="badge bg-primary">Admin</span>
                  </li>
                </>
              )}

              {role === "candidate" && (
                <li className="nav-item me-2">
                  <span className="badge bg-secondary">
                    {name || "Candidate"}
                  </span>
                </li>
              )}

              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
