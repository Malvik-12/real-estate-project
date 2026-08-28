import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      navigate("/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword("");
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
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-btn">
            Login to Dashboard
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
