import React, { useState, useContext } from "react";
import { uploadResume, skillGap } from "../api";
import { AuthContext } from "../context/AuthContext"; // note the ../ to go up one folder

export default function ResumeUpload() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [resultResumeSkills, setResultResumeSkills] = useState([]);
  const [gap, setGap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    if (!token) return setError("Please login first");

    setLoading(true);
    setError("");
    setResult([]);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await uploadResume(formData, token);
      // server returns { resumeSkills, results }
      const resumeSkills = res.data.resumeSkills || [];
      const resultsArr = res.data.results || [];
      setResultResumeSkills(resumeSkills);
      setResult(resultsArr);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  const analyzeGap = async (job) => {
    setGap(null);
    try {
      // Ask backend for missing skills (jobSkills vs resumeSkills)
      const payload = { resumeSkills: resultResumeSkills || [], jobId: null, jobSkills: job.jobSkills || job.matchedSkills || [] };
      const res = await skillGap(payload);
      setGap(res.data);
    } catch (err) {
      console.error(err);
      setError("Skill gap analysis failed");
    }
  };

  return (

    <div>
      <div className="auth-card">
        <h2>Upload Resume</h2>
        <div className="input-row">
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <div className="button-row">
          <button className="btn primary" onClick={handleUpload} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
          {error && <div className="error">{error}</div>}
        </div>

        {resultResumeSkills.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <strong>Extracted skills:</strong> {resultResumeSkills.join(", ")}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Job Match Results:</h3>
        {result.map((r, i) => (
          <div key={i} className="job-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4>{r.job} <span style={{ color: '#64748b' }}>- {r.company}</span></h4>
                <p>Match Score: {r.matchScore}%</p>
              </div>
              <div>
                <button className="btn" onClick={() => analyzeGap(r)}>Analyze Gap</button>
              </div>
            </div>
            {r.matchedSkills.length > 0 && (
              <div style={{ marginTop: 8 }}>Matched Skills: {r.matchedSkills.join(", ")}</div>
            )}
          </div>
        ))}

        {gap && (
          <div className="job-card" style={{ marginTop: 12 }}>
            <h4>Skill Gap Analysis</h4>
            <p>Missing skills: {gap.missingSkills && gap.missingSkills.length > 0 ? gap.missingSkills.join(", ") : "None"}</p>
            <p>Total required: {gap.totalRequired}</p>
          </div>
        )}
      </div>
    </div>
  );
}
