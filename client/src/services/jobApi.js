import API from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        headers: {
          Authorization: token,
        },
      }
    : {};
};

export const getJobs = () => API.get("/jobs");
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post("/jobs", data, getAuthHeaders());
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data, getAuthHeaders());
export const deleteJob = (id) => API.delete(`/jobs/${id}`, getAuthHeaders());
