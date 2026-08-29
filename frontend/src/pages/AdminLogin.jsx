import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        sessionStorage.setItem("admin_token", data.token);
        navigate("/admin");
      } else {
        setError(data.error || `Login failed (${res.status}). Please check your password.`);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setPassword("");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Connection error: ${err.message || "Failed to reach server"}.`);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className={`admin-login-card ${isShaking ? "shake" : ""}`}>
        <div className="admin-login-icon">🔐</div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-subtitle">Enter your password to continue</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrapper">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="admin-login-input"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="admin-login-back">
          <a href="/">← Back to Website</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
