const Job = require("../models/Job");


exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;

    // Validate fields
    if (!title || !description || !requirements) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const job = new Job({
      title,
      description,
      requirements,
      createdBy: req.user._id, // ✅ pulled from JWT middleware
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    console.log(err);
    console.error("❌ Job creation error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};


exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email role");
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    })
  }
};


exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};


exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};


exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};


exports.getAllJobTitles = async (req, res) => {
  try {
    const jobs = await Job.find().select("_id title"); // only fetch _id and title
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job titles",
    });
  }
};
