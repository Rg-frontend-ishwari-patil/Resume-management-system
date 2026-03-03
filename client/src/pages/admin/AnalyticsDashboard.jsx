import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from "chart.js";
import { Doughnut, Pie, Line } from "react-chartjs-2";
import {
    getOverviewStats,
    getApplicationsByStatus,
    getMonthlyApplications,
    getAptitudeTestStats,
} from "../../services/analyticsApi";
import { toast } from "react-toastify";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [overviewStats, setOverviewStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        totalApplications: 0,
    });
    const [statusData, setStatusData] = useState({
        Pending: 0,
        Shortlisted: 0,
        Rejected: 0,
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [aptitudeData, setAptitudeData] = useState({
        passed: 0,
        failed: 0,
    });

    useEffect(() => {
        fetchAllAnalytics();
    }, []);

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);

            // Fetch all analytics data in parallel
            const [overviewRes, statusRes, monthlyRes, aptitudeRes] = await Promise.all([
                getOverviewStats(),
                getApplicationsByStatus(),
                getMonthlyApplications(),
                getAptitudeTestStats(),
            ]);

            setOverviewStats(overviewRes.data.data);
            setStatusData(statusRes.data.data);
            setMonthlyData(monthlyRes.data.data);
            setAptitudeData(aptitudeRes.data.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            toast.error("Failed to load analytics data");
            setLoading(false);
        }
    };

    // Chart configurations
    const statusChartData = {
        labels: ["Pending", "Shortlisted", "Rejected"],
        datasets: [
            {
                label: "Applications by Status",
                data: [statusData.Pending, statusData.Shortlisted, statusData.Rejected],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(255, 99, 132, 0.8)",
                ],
                borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const aptitudeChartData = {
        labels: ["Passed", "Failed"],
        datasets: [
            {
                label: "Aptitude Test Results",
                data: [aptitudeData.passed, aptitudeData.failed],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(255, 99, 132, 0.8)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 2,
            },
        ],
    };

    const monthlyChartData = {
        labels: monthlyData.map((item) => item.month),
        datasets: [
            {
                label: "Applications per Month",
                data: monthlyData.map((item) => item.count),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Monthly Application Trends",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading analytics...</p>
            </div>
        );
    }

    const totalApplications = overviewStats.totalApplications || 1; // Avoid division by zero

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Back
                    </button>
                    <h2 className="fw-bold mb-0">📊 Analytics Dashboard</h2>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchAllAnalytics}>
                    🔄 Refresh
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                        <div className="card-body text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50 mb-1">Total Jobs</h6>
                                    <h2 className="fw-bold mb-0">{overviewStats.totalJobs}</h2>
                                </div>
                                <div className="fs-1">💼</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                        <div className="card-body text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50 mb-1">Total Candidates</h6>
                                    <h2 className="fw-bold mb-0">{overviewStats.totalCandidates}</h2>
                                </div>
                                <div className="fs-1">👥</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                        <div className="card-body text-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-white-50 mb-1">Total Applications</h6>
                                    <h2 className="fw-bold mb-0">{overviewStats.totalApplications}</h2>
                                </div>
                                <div className="fs-1">📝</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Status Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-1">Shortlisted</h6>
                                    <h3 className="fw-bold text-success mb-0">{statusData.Shortlisted}</h3>
                                    <small className="text-muted">
                                        {((statusData.Shortlisted / totalApplications) * 100).toFixed(1)}%
                                    </small>
                                </div>
                                <div className="fs-2">✅</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-1">Rejected</h6>
                                    <h3 className="fw-bold text-danger mb-0">{statusData.Rejected}</h3>
                                    <small className="text-muted">
                                        {((statusData.Rejected / totalApplications) * 100).toFixed(1)}%
                                    </small>
                                </div>
                                <div className="fs-2">❌</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted mb-1">Pending</h6>
                                    <h3 className="fw-bold text-primary mb-0">{statusData.Pending}</h3>
                                    <small className="text-muted">
                                        {((statusData.Pending / totalApplications) * 100).toFixed(1)}%
                                    </small>
                                </div>
                                <div className="fs-2">⏳</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="row g-4 mb-4">
                {/* Monthly Applications Line Chart */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-3">📈 Monthly Application Trends</h5>
                            <Line data={monthlyChartData} options={lineChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Aptitude Test Pie Chart */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-3">🎯 Aptitude Test Results</h5>
                            <Pie data={aptitudeChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Status Doughnut Chart */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6 mx-auto">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title fw-semibold mb-3">📊 Application Status Breakdown</h5>
                            <Doughnut data={statusChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
