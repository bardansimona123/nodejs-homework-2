const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = uuidv4();

  const user = new User({ email, password, verificationToken });
  await user.save();

  await sendEmail(email, verificationToken);

  res.status(201).json({ message: "User created. Verification email sent." });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: "Verification successful" });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res.status(400).json({ message: "Verification has already been passed" });
  }

  await sendEmail(email, user.verificationToken);

  res.status(200).json({ message: "Verification email resent" });
};

module.exports = { register, verifyEmail, resendVerificationEmail };
