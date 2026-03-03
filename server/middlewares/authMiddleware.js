const JWT = require("jsonwebtoken");
const userModel = require("../models/User");

// Middleware to check JWT token

exports.requireSignIn = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token === null || token === undefined) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied. No token provided." });
    }

    // Support both "Bearer <token>" and raw "<token>" formats
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    // Set correct user info for isAdmin check
    req.user = { _id: decoded.id, role: decoded.role };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking admin",
    });
  }
};
