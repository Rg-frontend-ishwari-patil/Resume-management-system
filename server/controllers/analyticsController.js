// controllers/analyticsController.js
const Job = require("../models/Job");
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");

// Get overview statistics
exports.getOverviewStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalCandidates = await User.countDocuments({ role: "candidate" });
        const totalApplications = await JobApplication.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                totalCandidates,
                totalApplications,
            },
        });
    } catch (error) {
        console.error("Error fetching overview stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch overview statistics",
        });
    }
};

// Get applications grouped by status
exports.getApplicationsByStatus = async (req, res) => {
    try {
        const statusCounts = await JobApplication.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Convert array to object for easier frontend consumption
        const statusData = {
            Pending: 0,
            Shortlisted: 0,
            Rejected: 0,
        };

        statusCounts.forEach((item) => {
            if (statusData.hasOwnProperty(item._id)) {
                statusData[item._id] = item.count;
            }
        });

        res.status(200).json({
            success: true,
            data: statusData,
        });
    } catch (error) {
        console.error("Error fetching applications by status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications by status",
        });
    }
};

// Get monthly applications for the current year
exports.getMonthlyApplications = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1); // January 1st
        const endDate = new Date(currentYear, 11, 31, 23, 59, 59); // December 31st

        const monthlyData = await JobApplication.aggregate([
            {
                $match: {
                    appliedAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$appliedAt" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        // Create array with all 12 months initialized to 0
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyApplications = monthNames.map((month, index) => {
            const found = monthlyData.find((item) => item._id === index + 1);
            return {
                month,
                count: found ? found.count : 0,
            };
        });

        res.status(200).json({
            success: true,
            data: monthlyApplications,
        });
    } catch (error) {
        console.error("Error fetching monthly applications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly applications",
        });
    }
};

// Get aptitude test statistics (pass vs fail)
exports.getAptitudeTestStats = async (req, res) => {
    try {
        const aptitudeStats = await JobApplication.aggregate([
            {
                $match: {
                    aptitudePassed: { $ne: null }, // Only include applications with aptitude results
                },
            },
            {
                $group: {
                    _id: "$aptitudePassed",
                    count: { $sum: 1 },
                },
            },
        ]);

        const stats = {
            passed: 0,
            failed: 0,
        };

        aptitudeStats.forEach((item) => {
            if (item._id === true) {
                stats.passed = item.count;
            } else if (item._id === false) {
                stats.failed = item.count;
            }
        });

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Error fetching aptitude test stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch aptitude test statistics",
        });
    }
};
