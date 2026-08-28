import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps admin pages.
 * If the user hasn't authenticated this session, redirects to /admin/login.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
