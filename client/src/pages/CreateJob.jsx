import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

const CreateJob = () => {
  const [job, setJob] = useState({
    title: "",
    description: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post("/jobs", job, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Job created successfully!");
      setJob({ title: "", description: "", requirements: "" });
    } catch (err) {
      console.error("Create Job Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to create job");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Requirements</label>
          <textarea
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
