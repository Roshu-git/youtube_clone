import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const { isAuthenticated } = useAuth();

  return isAuthenticated
    ? children
    : <Navigate to="/signin" replace />;
}

export default ProtectedRoute;