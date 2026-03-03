const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  console.log("✅ Signup route hit");
  try {
    const { name, email, password, role, answer } = req.body;

    if (!name || !email || !password || !role || !answer) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, role and security answer.",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        // 409 = Conflict
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPassword, role, answer });
    await user.save();

    return res.status(201).json({
      // 201 = Created
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({
      // 500 = Internal Server Error
      success: false,
      message: "Server error during signup.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        // 400 = Bad Request
        success: false,
        message: "Please provide email and password.",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        // 404 = Not Found
        success: false,
        message: "Email is not registered.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        // 401 = Unauthorized
        success: false,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      // 200 = OK
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
};

//forgot password code
// exports.forgotPasswordController = async (req, res) => {
//   try {
//     const { email, answer, newPassword } = req.body;

//     // Input validations
//     if (!email) {
//       return res.status(400).send({
//         success: false,
//         message: "Email is required.",
//       });
//     }
//     if (!answer) {
//       return res.status(400).send({
//         success: false,
//         message: "Security answer is required.",
//       });
//     }
//     if (!newPassword) {
//       return res.status(400).send({
//         success: false,
//         message: "New password is required.",
//       });
//     }

//     // Find user by email and answer
//     const user = await UserModel.findOne({ email, answer });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Invalid email or security answer.",
//       });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword);

//     // Update password in DB
//     await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

//     return res.status(200).send({
//       success: true,
//       message: "Password reset successfully.",
//     });

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     return res.status(500).send({
//       success: false,
//       message: "Something went wrong during password reset.",
//       error: error.message,
//     });
//   }
// };

exports.forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Email, security answer, and new password are required.",
      });
    }

    const user = await UserModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or security answer.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while resetting the password.",
      error: error.message,
    });
  }
};
