import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // hydrate from localStorage
    const t = localStorage.getItem("token") || "";
    const r = localStorage.getItem("role") || "";
    setToken(t);
    setRole(r);
  }, []);

  const login = (jwtToken, userRole) => {
    setToken(jwtToken);
    setRole(userRole || "");
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole || "");
  };

  const logout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
