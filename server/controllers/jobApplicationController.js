// controllers/jobApplicationController.js
const JobApplication = require("../models/JobApplication");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.applyJobController = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId);

    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "Resume file is required" });
    }

    // Upload resume buffer to Cloudinary manually using the configured client
    console.log("📤 Starting Cloudinary upload...");
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "resume",
          resource_type: "raw", // allow doc, pdf, etc.
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            return reject(error);
          }
          console.log("✅ Cloudinary upload success:", result.secure_url);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const application = new JobApplication({
      job: jobId,
      candidate: req.user._id,
      resume: uploadResult.secure_url,
    });

    await application.save();

    // Send email notification to candidate
    try {
      // Populate job and candidate details for email
      await application.populate("job", "title");
      await application.populate("candidate", "name email");

      const subject = "Application Submitted - Aptitude Test Round";
      const emailText = `Hi ${application.candidate.name},\n\n` +
        `Thank you for applying for the position of ${application.job.title}.\n\n` +
        `We are pleased to inform you that you have been selected for the Aptitude Test Round. ` +
        `Please check your dashboard to take the aptitude test.\n\n` +
        `Best of luck!\n\n` +
        `Best regards,\n` +
        `ResumeSystem Team`;

      await sendEmail(application.candidate.email, subject, emailText);
      console.log(`Application confirmation email sent to ${application.candidate.email}`);
    } catch (emailError) {
      console.error("Error sending application confirmation email:", emailError.message || emailError);
      // Don't fail the application if email fails
    }

    res.status(201).send({ success: true, message: "Applied successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Application failed" });
  }
};

exports.getApplicationsByCandidate = async (req, res) => {
  try {
    const apps = await JobApplication.find({
      candidate: req.user._id,
    }).populate("job");
    res.status(200).send({ success: true, applications: apps });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch applications" });
  }
};


exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ job: jobId })
      .populate("candidate", "name email")
      .populate("job", "title");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications by job",
    });
  }
};




exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await JobApplication.findById(applicationId)
      .populate("candidate", "name email")
      .populate("job", "title");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // optional: send email to candidate, but don't fail the API if email sending breaks
    try {
      let subject = `Application ${status}`;
      let emailText;

      if (status === "Shortlisted") {
        subject = "You are shortlisted for the next round";
        emailText = `Hi ${application.candidate.name},\n\n` +
          `Congratulations! You have been *shortlisted* for the next round ` +
          `for the position of ${application.job.title}. Our team will contact you soon with further details.\n\n` +
          `Best regards,\n` +
          `ResumeSystem Team`;
      } else if (status === "Rejected") {
        subject = "Update on your job application";
        emailText = `Hi ${application.candidate.name},\n\n` +
          `Thank you for applying for the position of ${application.job.title}. ` +
          `After careful consideration, we regret to inform you that you have not been selected to move forward at this time.\n\n` +
          `We appreciate your interest and encourage you to apply again in the future.\n\n` +
          `Best regards,\n` +
          `ResumeSystem Team`;
      } else {
        emailText = `Hi ${application.candidate.name},\n\nYour application for ${application.job.title} has been ${status}.`;
      }

      await sendEmail(application.candidate.email, subject, emailText);
      console.log(
        `Status email sent successfully to ${application.candidate.email} with status ${status}`
      );
    } catch (emailError) {
      console.error("Error sending status update email:", emailError.message || emailError);
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully updated.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// Save aptitude test result for candidate's latest application for a job
exports.updateAptitudeResult = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { score, total } = req.body;

    if (typeof score !== "number" || typeof total !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Score and total must be numbers" });
    }

    const passed = score >= 7; // business rule: 7 or more is pass

    const application = await JobApplication.findOne({
      job: jobId,
      candidate: req.user._id,
    })
      .sort({ appliedAt: -1 })
      .exec();

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found for this job" });
    }

    application.aptitudeScore = score;
    application.aptitudePassed = passed;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Aptitude result saved successfully",
      passed,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save aptitude result" });
  }
};


