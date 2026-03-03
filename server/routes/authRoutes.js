const express = require("express");
const { signup, login, forgotPasswordController } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

//forget password
router.post("/forgot-password", forgotPasswordController);

module.exports = router;
