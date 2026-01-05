# Job Skill Matcher - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm package manager

## Installation & Setup

### 1. **Server Setup**

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

**Environment Variables:**
Create/verify a `server/.env` file with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/jobdb?retryWrites=true&w=majority
JWT_SECRET=supersecretkey
```

Replace `your-username` and `your-password` with your actual MongoDB Atlas credentials.

**Start Server (Development):**

```bash
npm run dev
```

You should see:
```
MONGO_URI = mongodb+srv://...
MongoDB Connected
Server running on port 5000
```

### 2. **Client Setup**

In a new terminal, navigate to the client directory:

```bash
cd client
npm install
```

**Start Client (Development):**

```bash
npm start
```

The app will open at `http://localhost:3000` (or `3001` if 3000 is in use).

## Features

### User Authentication
- **Register:** Create new account as "Seeker" (job applicant) or "Recruiter"
- **Login:** Sign in with email and password
- **Profile:** View and edit your profile, manage skills

### For Job Seekers
1. **Upload Resume:** PDF upload with automatic skill extraction
2. **View Jobs:** Browse all available job postings
3. **Job Matching:** See which jobs match your extracted skills with match scores
4. **Skill Gap:** Identify missing skills for target jobs

### For Recruiters
1. **Post Jobs:** Create job listings with required skills
2. **View Jobs:** See all posted jobs
3. **Manage Jobs:** Edit or delete your job postings

### Admin Dashboard
- View all registered users
- View all job postings
- Monitor platform activity

**Access:** Admin users can access the admin dashboard from the top navigation.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `PUT /api/auth/profile` - Update user profile (auth required)

### Jobs
- `GET /api/jobs/all` - Get all jobs
- `POST /api/jobs/add` - Create job (recruiter/admin only)
- `POST /api/jobs/match` - Match jobs to skills
- `POST /api/jobs/skillgap` - Calculate skill gaps

### Resume
- `POST /api/resume/upload` - Upload and parse resume (auth required)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/jobs` - Get all jobs (admin only)

## Troubleshooting

### "Registration failed" error
- **Check:** Is MongoDB connected? Look for "MongoDB Connected" in server logs
- **Check:** Is email already registered? Try a different email
- **Check:** Is password at least 6 characters long?
- **Verify:** Server is running on port 5000, client can reach it

### MongoDB Connection Error
- Verify `MONGO_URI` in `server/.env` is correct
- Check if MongoDB Atlas cluster is active
- Ensure whitelist includes your IP address (in MongoDB Atlas: Network Access)

### CORS Error
- Ensure client is accessing `http://localhost:5000/api` endpoints
- Verify server's CORS setting allows `http://localhost:3000`

### Port Already in Use
- Server: Change `PORT` in `.env` to a different port
- Client: npm will auto-select 3001 if 3000 is in use

## Development Tips

### File Structure
- **Backend:** `server/` - Express app with MongoDB models and routes
- **Frontend:** `client/` - React app with components and API helpers
- **Uploads:** `server/uploads/` - Temporary storage for resume files

### Key Files to Edit
- Auth logic: `server/routes/authRoutes.js`
- Database models: `server/models/User.js`, `server/models/Job.js`
- Client API: `client/src/api.js`
- Auth context: `client/src/context/AuthContext.js`
- Styling: `client/src/App.css`

### Running in Production

**Server:**
```bash
cd server
npm install
npm start
```

**Client:**
```bash
cd client
npm install
npm run build
# Serve the build/ folder
```

## Test Accounts

After registration, you can use these to test different roles:

1. **Job Seeker:**
   - Email: seeker@example.com
   - Password: password (after registration)
   - Role: Seeker

2. **Recruiter:**
   - Email: recruiter@example.com
   - Password: password (after registration)
   - Role: Recruiter

## Support

For database issues, check MongoDB Atlas dashboard. For client/server communication issues, check browser console (F12) and server terminal output.
