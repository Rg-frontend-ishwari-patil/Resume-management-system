import React from "react";
import { useNavigate } from "react-router-dom";

const TemporaryLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.clear(); // clear all auth info
  navigate("/login");
};


  return (
    <div className="d-flex justify-content-end p-3">
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default TemporaryLogout;
