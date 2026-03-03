// models/JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: String, // path to uploaded resume
    required: true,
  },
  status: {
    type: String,
    default: "Pending", // can be Accepted, Rejected later
  },
  aptitudeScore: {
    type: Number,
    default: null,
  },
  aptitudePassed: {
    type: Boolean,
    default: null,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
