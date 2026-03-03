const express = require("express");
const router = express.Router();

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getAllJobTitles,
} = require("../controllers/jobController");

// ✅ SPECIAL routes FIRST
router.get("/admin/jobs", requireSignIn, isAdmin, getAllJobTitles);

// 🔽 then generic routes
router.post("/", requireSignIn, isAdmin, createJob);
router.get("/", getJobs);
router.get("/:id", getJob);
router.put("/:id", requireSignIn, isAdmin, updateJob);
router.delete("/:id", requireSignIn, isAdmin, deleteJob);

module.exports = router;
