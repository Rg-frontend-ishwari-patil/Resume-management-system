import axios from "axios";

const token = localStorage.getItem("token");

const API = axios.create({
  baseURL: 'http://localhost:7878/api/v1/jobs',
  headers: {
    Authorization: token, // ✅ Send token directly
  },
});

export const getJobs = () => API.get("/");
export const getJob = (id) => API.get(`/${id}`);
export const createJob = (data) => API.post("", data);
export const updateJob = (id, data) => API.put(`/${id}`, data);
export const deleteJob = (id) => API.delete(`/${id}`);
