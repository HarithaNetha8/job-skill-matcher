import React, { useEffect, useState, useContext } from "react";
import { getAllJobs } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Jobs() {
  const { role } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs");
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>Jobs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {jobs.map((j) => (
          <div key={j._id} className="job-card">
            <h4>{j.title} <span style={{ color: '#64748b' }}>- {j.company}</span></h4>
            {j.skills && <p>Skills: {j.skills.join(", ")}</p>}
          </div>
        ))}
      </div>
      {role === "recruiter" && <p style={{ marginTop: 10 }}>You can post jobs from the Post Job tab.</p>}
    </div>
  );
}
