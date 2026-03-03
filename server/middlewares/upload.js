const multer = require("multer");

// Use memory storage; we'll upload the buffer to Cloudinary manually
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
