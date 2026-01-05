# Job Skill Matcher - Deployment Guide

## 🚀 Quick Deployment Options

### **Server Deployment** (Backend)
Best options: **Railway**, **Render**, **Heroku**, **DigitalOcean**

### **Client Deployment** (Frontend)
Best options: **Vercel**, **Netlify**, **GitHub Pages**

---

## **Option 1: Deploy to Railway (RECOMMENDED - Easiest)**

### **Server on Railway:**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/job-skill-matcher.git
   git push -u origin main
   ```

2. **Go to https://railway.app**
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `server` as root directory

3. **Add Environment Variables**
   - Click on Project → Variables
   - Add:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_secret_key
     ```

4. **Deploy!**
   - Railway automatically deploys on every push
   - Your server URL: `https://your-project.railway.app`

### **Client on Vercel:**

1. **Go to https://vercel.com**
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository
   - Root Directory: `client`

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Add Environment Variables**
   - Click Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-server.railway.app/api
     ```

4. **Deploy!**
   - Vercel automatically deploys on every push
   - Your app URL: `https://your-project.vercel.app`

5. **Update Client API**
   Edit `client/src/api.js`:
   ```javascript
   const API = axios.create({
     baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
   });
   ```

---

## **Option 2: Deploy Both to Heroku**

### **Prerequisites:**
- Heroku account (https://heroku.com)
- Heroku CLI installed

### **Server on Heroku:**

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd server
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret_key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Server runs at:** `https://your-app-name.herokuapp.com`

### **Client on Heroku or Netlify:**

**Recommended: Use Netlify (easier for React)**

1. **Go to https://netlify.com**
   - Sign up with GitHub
   - New Site from Git
   - Select repository
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Add environment variable**
   - Go to Site Settings → Build & Deploy → Environment
   - Add `REACT_APP_API_URL=https://your-server.herokuapp.com/api`

3. **Deploy!**

---

## **Option 3: Deploy to AWS (Advanced)**

### **Server: EC2 + RDS (MongoDB Atlas)**

1. **Create EC2 Instance**
   - Launch Ubuntu 20.04 instance
   - SSH into instance
   - Install Node.js:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

2. **Deploy Server**
   ```bash
   git clone your-repo
   cd job-skill-matcher/server
   npm install
   npm start
   ```

3. **Use PM2 to keep server running**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### **Client: CloudFront + S3**

1. **Build React app**
   ```bash
   cd client
   npm run build
   ```

2. **Upload to S3**
   - Create S3 bucket
   - Upload `build/` folder contents
   - Enable static website hosting

3. **Setup CloudFront**
   - Create distribution pointing to S3
   - Add custom domain

---

## **Environment Variables by Platform**

### **MongoDB URI (for all platforms):**
```
mongodb+srv://username:password@cluster.mongodb.net/jobdb?retryWrites=true&w=majority
```

Get from MongoDB Atlas:
1. Go to MongoDB Atlas dashboard
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your actual password

### **JWT Secret:**
Generate a random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## **Step-by-Step: Railway Deployment (Simplest)**

### **Step 1: Create GitHub Repository**
```bash
cd c:\Users\user\Desktop\job-skill-matcher
git init
git add .
git commit -m "Job Skill Matcher App"
git remote add origin https://github.com/YOUR_USERNAME/job-skill-matcher.git
git branch -M main
git push -u origin main
```

### **Step 2: Deploy Server**
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Select `server` as root directory
6. In Variables, add:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB URI
   - `JWT_SECRET`: A random secret key

7. Railway auto-deploys!
8. Copy your server URL from the Railway dashboard

### **Step 3: Deploy Client**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `client`
5. Add environment variable:
   - `REACT_APP_API_URL`: Your Railway server URL + `/api`
   - Example: `https://job-skill-matcher-production.railway.app/api`

6. Vercel auto-deploys!

### **Step 4: Update Client Code**
Update `client/src/api.js`:
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});
```

### **Step 5: Test Live App**
- Click Vercel deployment link
- Register, login, upload resume, post jobs!

---

## **Troubleshooting Deployment**

| Problem | Solution |
|---------|----------|
| "Cannot reach server" | Check MONGO_URI is correct, server is running |
| "Port already in use" | Cloud platforms assign PORT automatically, remove hardcoded 5000 |
| "Cannot find module" | Run `npm install` before deploying |
| "CORS errors" | Update CORS in `server/server.js` with client URL |
| "Database connection failed" | Verify MONGO_URI, check MongoDB Atlas whitelist |

---

## **Production Checklist**

- [ ] Environment variables set correctly
- [ ] MongoDB URI working
- [ ] Server running without errors
- [ ] Client can reach server API
- [ ] Registration works
- [ ] Resume upload works
- [ ] Jobs can be posted and viewed
- [ ] Admin dashboard accessible

---

## **Recommended Production Setup**

```
Frontend: Vercel (auto-scaling, free tier generous)
Backend: Railway (simple, good free tier)
Database: MongoDB Atlas (free tier: 512MB storage)
```

**Total Cost:** FREE (with free tiers)

---

## **Next Steps**

1. Create GitHub repository
2. Deploy server to Railway (5 min)
3. Deploy client to Vercel (5 min)
4. Test live application (5 min)

**Total time: ~15 minutes to go live!** 🚀
