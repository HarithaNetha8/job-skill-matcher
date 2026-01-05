// const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
// const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please provide a valid email" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ msg: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    console.log("New user created:", user._id, user.email);

    // create token and return
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Email already registered" });
    }
    
    // Handle validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: messages.join(", ") });
    }

    res.status(500).json({ msg: "Registration failed: " + err.message });
  }
});

/* PROTECTED ROUTE EXAMPLE */
const auth = require("../middleware/authMiddleware");

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to load profile" });
  }
});

// Update profile (name, skills)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, skills } = req.body;
    const update = {};
    if (name) update.name = name;
    if (skills) update.skills = Array.isArray(skills) ? skills : skills.split(",").map(s=>s.trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(req.user, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // include role in token
    const tokenWithRole = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token: tokenWithRole, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed: " + err.message });
  }
});

module.exports = router;
