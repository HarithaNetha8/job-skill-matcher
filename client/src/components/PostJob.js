import React, { useState, useContext } from "react";
import { addJob } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function PostJob() {
  const { token, role } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [msg, setMsg] = useState("");

  const handlePost = async () => {
    if (!token) return setMsg("Please login as recruiter to post jobs");
    if (role !== "recruiter" && role !== "admin") return setMsg("Insufficient role");

    try {
      const payload = { title, company, skills: skills.split(",").map(s=>s.trim()) };
      const res = await addJob(payload, token);
      setMsg(res.data.msg || "Job added");
      setTitle(""); setCompany(""); setSkills("");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Failed to add job");
    }
  };

  return (
    <div className="auth-card">
      <h2>Post Job</h2>
      <div className="input-row"><input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} /></div>
      <div className="input-row"><input placeholder="Company" value={company} onChange={(e)=>setCompany(e.target.value)} /></div>
      <div className="input-row"><input placeholder="Skills (comma separated)" value={skills} onChange={(e)=>setSkills(e.target.value)} /></div>
      <div className="button-row">
        <button className="btn" onClick={handlePost}>Post Job</button>
        {msg && <p className="text-sm" style={{marginLeft:8}}>{msg}</p>}
      </div>
    </div>
  );
}
