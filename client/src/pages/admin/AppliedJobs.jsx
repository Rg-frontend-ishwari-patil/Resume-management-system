import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);

  // Fetch all job titles
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Token:", token);

      const { data } = await API.get("/jobs/admin/jobs", {
        headers: {
          Authorization: token,
        },
      });

      console.log("📦 Jobs Response:", data.jobs);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(
        "❌ Error loading jobs:",
        err?.response?.data || err.message
      );
      toast.error("Failed to load job titles");
    }
  };

  // Fetch applications for selected job
  const fetchApplications = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get(
        `/jobapplication/admin/applications/job/${jobId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setApplications(data.applications || []);
    } catch (err) {
      console.error(
        "❌ Error loading applications:",
        err?.response?.data || err.message
      );
      toast.error("Failed to load applications");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.put(
        `/jobapplication/admin/update-status/${applicationId}`,
        { status },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(data.message);
      fetchApplications(selectedJobId);
    } catch (err) {
      console.error(
        "❌ Status update failed:",
        err?.response?.data || err.message
      );
      toast.error("Failed to update application status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (jobId) {
      fetchApplications(jobId);
    } else {
      setApplications([]);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back
        </button>
        <h2 className="mb-0">Applications By Job</h2>
      </div>

      {/* Job Dropdown */}
      <div className="mb-3">
        <label className="form-label">Select Job Position:</label>
        <select
          className="form-select"
          value={selectedJobId}
          onChange={handleJobChange}
        >
          <option value="">-- Select a Job --</option>
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))
          ) : (
            <option disabled>No job positions found</option>
          )}
        </select>
      </div>

      {/* Applications Cards */}
      {applications.length > 0 ? (
        <div className="row g-3 mt-4">
          {applications.map((app) => (
            <div className="col-md-6 col-lg-4" key={app._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{app.candidate?.name}</h5>
                  <p className="card-text mb-1 small text-muted">
                    {app.candidate?.email}
                  </p>

                  <p className="card-text mb-1 small">
                    <span className="fw-semibold">Aptitude Score: </span>
                    {app.aptitudeScore != null
                      ? `${app.aptitudeScore} / 10`
                      : "Not taken"}
                  </p>

                  <p className="card-text mb-1 small">
                    <span className="fw-semibold">Aptitude Result: </span>
                    {app.aptitudePassed == null && (
                      <span className="badge bg-secondary">Pending</span>
                    )}
                    {app.aptitudePassed === true && (
                      <span className="badge bg-success">Passed</span>
                    )}
                    {app.aptitudePassed === false && (
                      <span className="badge bg-danger">Failed</span>
                    )}
                  </p>

                  <p className="card-text mb-2 small">
                    <span className="fw-semibold">Status: </span>
                    <span
                      className={`badge bg-${app.status === "Shortlisted"
                        ? "success"
                        : app.status === "Rejected"
                          ? "danger"
                          : "secondary"
                        }`}
                    >
                      {app.status}
                    </span>
                  </p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <a
                        href={app.resume || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        View Resume
                      </a>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-success me-2 flex-grow-1"
                        onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                      >
                        Shortlist
                      </button>
                      <button
                        className="btn btn-sm btn-danger flex-grow-1"
                        onClick={() => handleStatusUpdate(app._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : selectedJobId ? (
        <p className="text-muted">No applications found for this job.</p>
      ) : null}
    </div>
  );
};

export default AppliedJobs;
