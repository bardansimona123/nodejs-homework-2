const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const Joi = require("joi");

const User = require("../../models/user");

const router = express.Router();

const tmpDir = path.join(__dirname, "../../tmp");
const avatarsDir = path.join(__dirname, "../../public/avatars");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, "your_secret_key");
    const user = await User.findById(id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

// Endpoint de înregistrare
router.post("/signup", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const user = new User({ email, password });
    await user.save();
    console.log('User saved:', user);

    res.status(201).json({
      message: "Registration successful", 
      user: { id: user._id, email: user.email, avatarURL: user.avatarURL },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint de login
router.post("/login", async (req, res) => {
  console.log("Login attempt:", req.body);

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password entered by user:', password);
    console.log('Hashed password from DB:', user.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });
    user.token = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, avatarURL: user.avatarURL },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Rute protejate
router.use(authenticate);

// Ruta pentru a actualiza avatarul utilizatorului
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Avatar file is required" });
      }

      const { path: tempUpload, filename } = req.file;
      const avatarPath = path.join(avatarsDir, filename);
      const avatarURL = `/avatars/${filename}`;

      const image = await Jimp.read(tempUpload);
      image.resize(250, 250).write(avatarPath);

      await fs.unlink(tempUpload);

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatarURL },
        { new: true }
      );

      res.json({ avatarURL: user.avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
