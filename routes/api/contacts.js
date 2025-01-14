const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const router = express.Router();

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

router.use(authenticate);

// Exemplu de rută protejată
router.get("/", (req, res) => {
  res.status(200).json({ message: "Contacts retrieved successfully" });
});

module.exports = router;
