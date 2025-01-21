const express = require("express");
const {
  register,
  verifyEmail,
  resendVerificationEmail,
} = require("../../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmail);

module.exports = router;
