import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps admin pages.
 * Checks for a valid JWT token in sessionStorage.
 * If no token exists, redirects to /admin/login.
 */
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
