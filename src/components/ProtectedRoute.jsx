import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0a0a0a",
    }}>
      <span style={{
        fontFamily: "JetBrains Mono, monospace",
        color: "#2a2a2a", fontSize: 11, letterSpacing: 3,
      }}>
        LOADING...
      </span>
    </div>
  );
}

/** Requires signed-in + approved user. Redirects otherwise. */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)                      return <LoadingScreen />;
  if (!user)                        return <Navigate to="/login"    replace />;
  if (user.status === "pending")    return <Navigate to="/pending"  replace />;
  if (user.status === "rejected")   return <Navigate to="/rejected" replace />;
  return children;
}

/** Requires signed-in + approved + role === "admin". */
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)                return <LoadingScreen />;
  if (!user)                  return <Navigate to="/login" replace />;
  if (user.status !== "approved") return <Navigate to="/pending" replace />;
  if (user.role !== "admin")  return <Navigate to="/"      replace />;
  return children;
}