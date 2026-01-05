const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Job = require("../models/Job");

// All admin routes require auth and admin role
router.use(auth);
router.use((req, res, next) => {
  if (req.role !== "admin") return res.status(403).json({ msg: "Admin only" });
  next();
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("name email role skills");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// Get all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch jobs" });
  }
});

module.exports = router;
