import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * useAuth — access auth state and actions anywhere in the app.
 *
 * Returns: { user, loading, login, logout, refreshUser }
 *
 * user shape:
 *   { id, email, name, picture, role, status, token }
 *   role:   "admin" | "user"
 *   status: "approved" | "pending" | "rejected"
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}