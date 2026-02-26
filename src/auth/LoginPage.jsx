// src/pages/LoginPage.jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the user after login:
  // - back to the page they originally tried to visit
  // - otherwise to the main app interface ("/")
  const from = location.state?.from?.pathname || "/";

  const handleLogin = () => {
    // Temporary login for Step 1
    // Replace this in Step 2 with real OAuth success data
    login({
      name: "Student User",
      email: "student@example.com",
    });

    navigate(from, { replace: true });
  };

  // Prevent UI flicker while auth state is loading
  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }

  // If already logged in, skip login page and go to app
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Login</h1>
        <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
          Sign in to access the Security and Credit Card Management System.
        </p>

        <button
          type="button"
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: "#111827",
            color: "#fff",
          }}
        >
          Login (Temporary)
        </button>

        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#6b7280" }}>
          *We’ll replace this button with OAuth in Step 2.
        </p>
      </div>
    </div>
  );
}