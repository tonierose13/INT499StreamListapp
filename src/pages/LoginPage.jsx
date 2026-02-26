// src/pages/LoginPage.jsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSuccess = (credentialResponse) => {
    setErrorMsg("");

    if (!credentialResponse?.credential) {
      setErrorMsg("Google login did not return a credential.");
      return;
    }

    // For now, keep it simple and mark user as authenticated.
    // We can decode the token later once everything is working.
    login({
      name: "Google User",
      provider: "google",
    });

    navigate(from, { replace: true });
  };

  const handleGoogleError = () => {
    setErrorMsg("Google login failed. Please try again.");
  };

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading...</div>;
  }

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
          maxWidth: "460px",
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

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {errorMsg ? (
          <p style={{ marginTop: "0.75rem", color: "#b91c1c", fontSize: "0.9rem" }}>
            {errorMsg}
          </p>
        ) : null}
      </div>
    </div>
  );
}