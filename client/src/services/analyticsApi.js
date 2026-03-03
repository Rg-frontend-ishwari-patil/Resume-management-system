// services/analyticsApi.js
import axios from "axios";

const API_URL = "http://localhost:7878/api/v1/analytics";

// Get authentication token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getOverviewStats = async () => {
    return await axios.get(`${API_URL}/overview`, getAuthHeaders());
};

export const getApplicationsByStatus = async () => {
    return await axios.get(`${API_URL}/applications-by-status`, getAuthHeaders());
};

export const getMonthlyApplications = async () => {
    return await axios.get(`${API_URL}/monthly-applications`, getAuthHeaders());
};

export const getAptitudeTestStats = async () => {
    return await axios.get(`${API_URL}/aptitude-stats`, getAuthHeaders());
};
