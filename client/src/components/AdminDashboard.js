import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, role } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role !== "admin") return;
    const fetch = async () => {
      try {
        const u = await axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
        setUsers(u.data);
        const j = await axios.get("http://localhost:5000/api/admin/jobs", { headers: { Authorization: `Bearer ${token}` } });
        setJobs(j.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data");
      }
    };
    fetch();
  }, [role, token]);

  if (role !== "admin") return <div style={{ padding: 20 }}><h3>Admin area - access denied</h3></div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Users</h3>
      {users.map(u => (
        <div key={u._id} style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
          <b>{u.name}</b> ({u.email}) - {u.role}
          {u.skills && <div>Skills: {u.skills.join(', ')}</div>}
        </div>
      ))}

      <h3>Jobs</h3>
      {jobs.map(j => (
        <div key={j._id} style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
          <b>{j.title}</b> - {j.company}
          {j.skills && <div>Skills: {j.skills.join(', ')}</div>}
        </div>
      ))}
    </div>
  );
}
