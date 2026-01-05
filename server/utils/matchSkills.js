// Escape regex special characters
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = (resumeSkills = [], jobSkills = [], resumeText = "") => {
  if (!Array.isArray(resumeSkills) || !Array.isArray(jobSkills)) {
    return { matchScore: 0, matchedSkills: [] };
  }

  // Match exact skills
  const matchedSkills = resumeSkills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        new RegExp(`\\b${escapeRegex(jobSkill)}\\b`, "i").test(skill)
    )
  );

  // Skill score (70%)
  const skillScore =
    jobSkills.length === 0 ? 0 : (matchedSkills.length / jobSkills.length) * 70;

  // Keyword bonus (20%)
  const keywords = ["ai", "machine learning", "deep learning", "nlp"];
  let keywordHits = 0;
  keywords.forEach((word) => {
    if (resumeText.toLowerCase().includes(word)) keywordHits++;
  });
  const keywordScore = (keywordHits / keywords.length) * 20;

  // Experience bonus (10%)
  const experienceScore = resumeText.includes("year") ? 10 : 0;

  return {
    matchScore: Math.round(skillScore + keywordScore + experienceScore),
    matchedSkills,
  };
};
