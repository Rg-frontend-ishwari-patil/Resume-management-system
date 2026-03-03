const cloudinary = require("../config/cloudinary");

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Cloudinary stream upload
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "resume",
                    resource_type: "raw", // for pdf, docx
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // send buffer to cloudinary
            stream.end(req.file.buffer);
        });

        // Cloudinary URL
        const resumeUrl = result.secure_url;

        return res.json({
            success: true,
            message: "Resume uploaded to Cloudinary successfully",
            url: resumeUrl,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Error uploading resume to Cloudinary",
        });
    }
};
