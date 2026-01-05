import React, { useState, useContext } from "react";
import { loginUser, registerUser } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setMessage("");
      setIsLoading(true);
      
      if (!email) return setError("Please enter your email");
      if (!password) return setError("Please enter your password");
      
      const res = await loginUser(email, password);
      setMessage("Login successful!");
      setTimeout(() => {
        login(res.data.token, res.data.role);
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.msg || err.message || "Login failed";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError("");
      setMessage("");
      setIsLoading(true);
      
      if (!name) return setError("Please enter your name");
      if (!email) return setError("Please enter your email");
      if (!password) return setError("Please enter your password");
      if (password.length < 6) return setError("Password must be at least 6 characters");
      
      const res = await registerUser(name, email, password, role);
      setMessage("Registration successful! Logging you in...");
      setName("");
      setEmail("");
      setPassword("");
      
      setTimeout(() => {
        login(res.data.token, res.data.role);
      }, 800);
    } catch (err) {
      console.error("Registration error:", err);
      
      // Detailed error messages
      let errorMsg = "Registration failed";
      if (!err.response) {
        errorMsg = "⚠️ Cannot reach server. Make sure to run: cd server && npm run dev";
      } else if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign in / Register</h2>

      <div className="input-row">
        <label>Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Full name"
          disabled={isLoading}
        />
      </div>

      <div className="input-row">
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="you@example.com"
          disabled={isLoading}
        />
      </div>

      <div className="input-row">
        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="password"
          disabled={isLoading}
        />
      </div>

      <div className="input-row">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isLoading}>
          <option value="seeker">Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </div>

      <div className="button-row">
        <button className="btn primary" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
        <button className="btn" onClick={handleRegister} disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p style={{ color: "green", fontSize: "14px", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
