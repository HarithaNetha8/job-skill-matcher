const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
console.log("JWT SECRET FROM ENV:", process.env.JWT_SECRET);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
