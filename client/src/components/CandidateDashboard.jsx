import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../services/jobApi";

import { toast } from "react-toastify";
import API from "../services/api";
import TemporaryLogout from "../pages/TemporaryLogout";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        setJobs(res.data.jobs);
      } catch (error) {
        toast.error("Failed to load jobs");
      }
    };
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApply = async (jobId) => {
    // toast.success(jobId)
    if (!resumeFile) {
      return toast.warning("Please select a resume file first");
    }

    // console.log("before",formData);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const token = localStorage.getItem("token");

    try {
      console.log(formData);
      await API.post(
        `/jobApplication/apply/${jobId}`,
        formData,
        {
          headers: {
            // Axios will set correct multipart/form-data with boundary
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        "You have successfully applied. Your aptitude test is scheduled for the next date."
      );
      setSelectedJobId(null);
      setResumeFile(null);
      navigate("/aptitude-test", { state: { jobId } });
    } catch (error) {
      console.log("Axios status:", error.response?.status);
      console.log("Axios data:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to apply. Try again.");
    }
  };

  return (
    <div className="container mt-4">
      <TemporaryLogout />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Available Jobs</h2>
        <span className="text-muted small">
          {jobs.length > 0 ? `${jobs.length} job(s) found` : "No jobs available"}
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center text-muted py-5 border rounded">
          No jobs found. Please check back later.
        </div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div className="col-md-6 col-lg-4" key={job._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold">{job.title}</h5>
                  <p className="card-text mb-2" style={{ minHeight: "60px" }}>
                    {job.description}
                  </p>
                  <p className="card-text small text-muted" style={{ minHeight: "60px" }}>
                    <span className="fw-semibold">Requirements: </span>
                    {job.requirements}
                  </p>

                  <div className="mt-auto">
                    {selectedJobId === job._id ? (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="form-control form-control-sm mb-2"
                          onChange={handleFileChange}
                        />
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-sm btn-success me-2 flex-grow-1"
                            onClick={() => handleApply(job._id)}
                          >
                            Submit Application
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary flex-grow-1"
                            onClick={() => setSelectedJobId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => setSelectedJobId(job._id)}
                      >
                        Apply for this Job
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
