// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const {
    getOverviewStats,
    getApplicationsByStatus,
    getMonthlyApplications,
    getAptitudeTestStats,
} = require("../controllers/analyticsController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

// All analytics routes require admin authentication
router.get("/test", (req, res) => res.json({ message: "Analytics routes working!" }));
router.get("/overview", requireSignIn, isAdmin, getOverviewStats);
router.get("/applications-by-status", requireSignIn, isAdmin, getApplicationsByStatus);
router.get("/monthly-applications", requireSignIn, isAdmin, getMonthlyApplications);
router.get("/aptitude-stats", requireSignIn, isAdmin, getAptitudeTestStats);

module.exports = router;
