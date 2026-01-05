const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["seeker", "recruiter", "admin"],
    default: "seeker"
  },
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Drop and recreate unique index
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);

