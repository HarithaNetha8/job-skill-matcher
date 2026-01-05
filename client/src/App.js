import React, { useContext, useState } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import ResumeUpload from "./components/ResumeUpload";
import Jobs from "./components/Jobs";
import PostJob from "./components/PostJob";
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import "./App.css";

function AppContent() {
  const { token, logout, role } = useContext(AuthContext);
  const [view, setView] = useState("jobs");

  if (!token) return <Login />;

  // Role-based navigation items
  const navItems = [
    { id: "jobs", label: "🔍 Browse Jobs", show: true },
    { id: "upload", label: "📄 Upload Resume", show: true },
    { id: "profile", label: "👤 Profile", show: true },
    { id: "post", label: "✏️ Post Job", show: role === "recruiter" || role === "admin" },
    { id: "admin", label: "⚙️ Admin", show: role === "admin" }
  ];

  const getRoleDisplay = () => {
    const roleMap = {
      seeker: "👨‍💼 Job Seeker",
      recruiter: "👔 Recruiter",
      admin: "🔐 Administrator"
    };
    return roleMap[role] || role;
  };

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="app-title">
            <h1>💼 Job Skill Matcher</h1>
            <span className="role-badge">{getRoleDisplay()}</span>
          </div>
        </div>

        <div className="nav-middle">
          {navItems.map(
            (item) =>
              item.show && (
                <button
                  key={item.id}
                  className={`btn nav-btn ${view === item.id ? "active" : ""}`}
                  onClick={() => setView(item.id)}
                  title={item.label}
                >
                  {item.label}
                </button>
              )
          )}
        </div>

        <div className="nav-right">
          <button className="btn danger" onClick={logout} title="Logout">
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {view === "upload" && <ResumeUpload />}
        {view === "jobs" && <Jobs />}
        {view === "profile" && <Profile />}
        {view === "post" && <PostJob />}
        {view === "admin" && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Job Skill Matcher | Match your skills with perfect jobs</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
