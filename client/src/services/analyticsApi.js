// services/analyticsApi.js
import API from "./api";

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
    return await API.get("/analytics/overview", getAuthHeaders());
};

export const getApplicationsByStatus = async () => {
    return await API.get("/analytics/applications-by-status", getAuthHeaders());
};

export const getMonthlyApplications = async () => {
    return await API.get("/analytics/monthly-applications", getAuthHeaders());
};

export const getAptitudeTestStats = async () => {
    return await API.get("/analytics/aptitude-stats", getAuthHeaders());
};
