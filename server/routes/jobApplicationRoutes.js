// routes/jobApplicationRoutes.js
const express = require("express");
const {
  applyJobController,
  getApplicationsByCandidate,
  getApplicationsByJob,
  updateApplicationStatus,
  updateAptitudeResult,
} = require("../controllers/jobApplicationController.js");
const { uploadResume } = require("../utils/cloudinary.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/upload.js");

const router = express.Router();

// Candidate applies for a job
router.post(
  "/apply/:jobId",
  requireSignIn,
  upload.single("resume"),
  applyJobController
);

// Get candidate's applications
router.get("/my-applications", requireSignIn, getApplicationsByCandidate);

router.get("/admin/applications/job/:jobId", requireSignIn, isAdmin, getApplicationsByJob);

router.put("/admin/update-status/:applicationId", requireSignIn, isAdmin, updateApplicationStatus);

// Standalone resume upload endpoint
router.post("/upload-resume", upload.single("resume"), uploadResume);

// Candidate submits aptitude test result
router.put(
  "/candidate/aptitude-result/:jobId",
  requireSignIn,
  updateAptitudeResult
);

module.exports = router;
