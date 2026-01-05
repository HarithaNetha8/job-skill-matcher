const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const matchSkills = require("../utils/matchSkills");
const auth = require("../middleware/authMiddleware");

// Add job (only recruiter or admin)
router.post("/add", auth, async (req, res) => {
  try {
    if (!["recruiter", "admin"].includes(req.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }

    const job = new Job(req.body);
    await job.save();
    res.json({ msg: "Job added successfully", job });
  } catch (err) {
    res.status(500).json({ msg: "Failed to add job" });
  }
});

// Get all jobs (public)
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch jobs" });
  }
});

router.post("/match", auth, async (req, res) => {
  try {
    const { resumeSkills, resumeText } = req.body;

    if (!resumeSkills || !resumeText) {
      return res.status(400).json({ msg: "Resume data missing" });
    }

    const jobs = await Job.find();

    const results = jobs.map(job => {
      const match = matchSkills(resumeSkills, job.skills, resumeText);

      return {
        job: job.title,
        company: job.company,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills
      };
    });

    // SORT BY MATCH SCORE
    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Job matching failed" });
  }
});

// Skill gap analysis: POST { resumeSkills, jobId } or { resumeSkills, jobSkills }
router.post("/skillgap", async (req, res) => {
  try {
    const { resumeSkills = [], jobId, jobSkills = [] } = req.body;

    let targetSkills = jobSkills;
    if (jobId) {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ msg: "Job not found" });
      targetSkills = job.skills || [];
    }

    const missing = targetSkills.filter(s => !resumeSkills.some(rs => rs.toLowerCase() === s.toLowerCase()));

    res.json({ missingSkills: missing, totalRequired: targetSkills.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Skill gap analysis failed" });
  }
});

module.exports = router;
