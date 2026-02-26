// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Prevent redirect flicker while auth state is loading from localStorage
  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }

  // If not logged in, send user to login page
  // Save the page they tried to visit so we can send them back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If logged in, render the protected route(s)
  return <Outlet />;
}