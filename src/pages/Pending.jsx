import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function StatusPage({ icon, color, title, message, showLogout = true, showCheckStatus = false }) {
  const { logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "JetBrains Mono, monospace",
    }}>
      <div style={{
        background: "#0d0d0d", border: "1px solid #1e1e1e",
        borderRadius: 8, padding: "48px 40px", width: 400, textAlign: "center",
        animation: "slideDown 0.3s ease",
      }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>{icon}</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color }}>
          {title}
        </div>
        <p style={{ color: "#555", fontSize: 12, lineHeight: 1.7, marginTop: 16, marginBottom: 32 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {showLogout && (
            <button onClick={handleLogout} style={{
              background: "none", border: "1px solid #2a2a2a", color: "#555",
              padding: "8px 18px", fontSize: 11, fontFamily: "inherit",
              fontWeight: 700, letterSpacing: 1.5, cursor: "pointer", borderRadius: 3,
            }}>
              SIGN OUT
            </button>
          )}
          {showCheckStatus && (
            <button onClick={refreshUser} style={{
              background: "#00ff8822", border: "1px solid #00ff8844", color: "#00ff88",
              padding: "8px 18px", fontSize: 11, fontFamily: "inherit",
              fontWeight: 700, letterSpacing: 1.5, cursor: "pointer", borderRadius: 3,
            }}>
              CHECK STATUS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PendingPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if approved while waiting
  useEffect(() => {
    const id = setInterval(async () => {
      await refreshUser();
    }, 10000);
    return () => clearInterval(id);
  }, [refreshUser]);

  useEffect(() => {
    if (user?.status === "approved") {
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <StatusPage
      icon="⏳"
      color="#f5c518"
      title="PENDING APPROVAL"
      message="Your account is waiting for admin approval. You'll receive an email once you're approved. This page checks automatically every 10 seconds."
      showCheckStatus={true}
    />
  );
}

export function RejectedPage() {
  return (
    <StatusPage
      icon="✕"
      color="#ff3b3b"
      title="ACCESS DENIED"
      message="Your access request was not approved. If you believe this is a mistake, please contact the administrator."
      showLogout={true}
    />
  );
}