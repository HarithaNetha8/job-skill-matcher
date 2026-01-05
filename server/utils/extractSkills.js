const skillMap = require("./skillList");

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = (text = "") => {
  const foundSkills = new Set();
  const lowerText = text.toLowerCase();

  Object.values(skillMap).flat().forEach(skill => {
    const safeSkill = escapeRegex(skill.toLowerCase());
    const pattern = new RegExp(`\\b${safeSkill}\\b`, "i");

    if (pattern.test(lowerText)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
};
