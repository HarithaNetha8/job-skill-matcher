import React, { useEffect, useState, useContext } from "react";
import { getProfile, updateProfile } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const res = await getProfile(token);
        setProfile(res.data);
        setName(res.data.name || "");
        setSkills((res.data.skills || []).join(", "));
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [token]);

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      const payload = { name, skills };
      const res = await updateProfile(payload, token);
      setProfile(res.data);
      setSkills((res.data.skills || []).join(", "));
      setMsg("Saved");
    } catch (err) {
      console.error(err);
      setMsg("Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div style={{ padding: 20 }}>Please login to view profile.</div>;

  return (
    <div>
      <h2>My Profile</h2>
      {profile && (
        <div className="auth-card">
          <div className="input-row">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-row">
            <label>Email</label>
            <input value={profile.email} disabled />
          </div>
          <div className="input-row">
            <label>Role</label>
            <input value={profile.role} disabled />
          </div>
          <div className="input-row">
            <label>Skills (comma separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div className="button-row">
            <button className="btn primary" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            {msg && <div style={{ marginLeft: 8 }}>{msg}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
