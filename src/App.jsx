import { Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import { PendingPage, RejectedPage } from "./pages/Pending";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

const BASE = import.meta.env.VITE_API_URL || "";

// ── Auth callback (handles redirect from backend after Google OAuth) ───────────
function AuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token  = params.get("token");
    const status = params.get("status");

    if (!token) { navigate("/login?error=no_token", { replace: true }); return; }

    fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(user => {
        login(token, user);
        if (status === "pending") navigate("/pending", { replace: true });
        else if (status === "rejected") navigate("/rejected", { replace: true });
        else if (user.role === "admin") navigate("/admin", { replace: true });
        else navigate("/", { replace: true });
      })
      .catch(() => navigate("/login?error=auth_failed", { replace: true }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs once on mount to process the OAuth callback

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 28, height: 28, margin: "0 auto 14px",
          border: "2px solid #00ff88", borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 0.7s linear infinite",
        }} />
        <div style={{ color: "#333", fontFamily: "JetBrains Mono, monospace", fontSize: 10, letterSpacing: 3 }}>
          SIGNING IN...
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#1e1e1e", fontSize: 11, letterSpacing: 3 }}>
          LOADING...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/pending" element={<PendingPage />} />
      <Route path="/rejected" element={<RejectedPage />} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}