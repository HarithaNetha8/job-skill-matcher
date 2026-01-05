const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Support both raw token or "Bearer <token>"
  const parts = authHeader.split(" ");
  const token = parts.length === 1 ? parts[0] : parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    req.role = decoded.role; // role added to token payload
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
