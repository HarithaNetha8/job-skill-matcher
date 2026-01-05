import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add error interceptor to catch network errors
API.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error - server not reachable
      console.error("❌ NETWORK ERROR - Server is not reachable at http://localhost:5000");
      console.error("   Make sure to run: cd server && npm run dev");
      error.message = "Cannot connect to server. Is it running on port 5000?";
    }
    return Promise.reject(error);
  }
);

// Login
export const loginUser = async (email, password) => {
  return API.post("/auth/login", { email, password });
};

export const registerUser = async (name, email, password, role = "seeker") => {
  return API.post("/auth/register", { name, email, password, role });
};

export const getAllJobs = async () => {
  return API.get("/jobs/all");
};

export const addJob = async (jobData, token) => {
  return API.post("/jobs/add", jobData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Resume upload
export const uploadResume = async (formData, token) => {
  return API.post("/resume/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const skillGap = async (payload) => {
  return API.post("/jobs/skillgap", payload);
};

export const getProfile = async (token) => {
  return API.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
};

export const updateProfile = async (payload, token) => {
  return API.put("/auth/profile", payload, { headers: { Authorization: `Bearer ${token}` } });
};
