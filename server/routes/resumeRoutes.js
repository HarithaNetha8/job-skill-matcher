const express = require("express");
const router = express.Router();
const fs = require("fs");
const pdfParse = require("pdf-parse");

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const extractSkills = require("../utils/extractSkills");
const matchSkills = require("../utils/matchSkills");
const Job = require("../models/Job"); // DB jobs
const User = require("../models/User");

// ==============================
// 📄 Upload Resume Route
// ==============================
router.post(
  "/upload",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      // ❌ No file uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No resume uploaded" });
      }

      // 1️⃣ Read PDF
      const filePath = req.file.path;
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const resumeText = pdfData.text || "";

      // ✅ DEBUG: Resume text
      console.log("📄 Resume text sample:", resumeText.slice(0, 300));

      // 2️⃣ Extract skills
      const resumeSkills = extractSkills(resumeText);
      console.log("🧠 Extracted Resume Skills:", resumeSkills);

      // 2.5️⃣ Persist extracted skills to user profile
      try {
        if (req.user) {
          await User.findByIdAndUpdate(req.user, { skills: resumeSkills });
        }
      } catch (e) {
        console.warn("Failed to update user skills:", e.message);
      }

      // 3️⃣ Fetch jobs
      const jobs = await Job.find();

      // 4️⃣ Match skills
      const results = jobs.map((job) => {
        const match = matchSkills(
          resumeSkills,
          job.skills || [],
          resumeText
        );

        return {
          job: job.title,
          company: job.company,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          jobSkills: job.skills || []
        };
      });

      // 5️⃣ Sort by best match
      results.sort((a, b) => b.matchScore - a.matchScore);

      // return resumeSkills + results so client can analyze gaps
      return res.json({ resumeSkills, results });
    } catch (err) {
      console.error("❌ Resume Error:", err);

      return res.status(500).json({
        error: "Resume processing failed",
        details: err.message
      });
    }
  }
);

module.exports = router;
