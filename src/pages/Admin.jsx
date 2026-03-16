import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../Api";

const S_COLOR = { approved: "#00ff88", pending: "#f5c518", rejected: "#ff3b3b" };
const S_BG    = { approved: "#0f2a1a", pending: "#2a1f00", rejected: "#2a0f0f" };

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();

  const [users,    setUsers]   = useState([]);
  const [stats,    setStats]   = useState(null);
  const [tab,      setTab]     = useState("pending");
  const [loading,  setLoading] = useState(true);
  const [busy,     setBusy]    = useState(null); // id of user being actioned
  const [toast,    setToast]   = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const [u, s] = await Promise.all([api.getAdminUsers(), api.getAdminStats()]);
      setUsers(u);
      setStats(s);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    setBusy(id);
    try {
      await api.approveUser(id);
      showToast("User approved — email sent ✓");
      load();
    } catch {
      showToast("Failed to approve", "error");
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this user? They'll receive a notification email.")) return;
    setBusy(id);
    try {
      await api.rejectUser(id);
      showToast("User rejected — notification sent");
      load();
    } catch {
      showToast("Failed to reject", "error");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      await api.deleteUser(id);
      showToast("User deleted");
      load();
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const filtered = users.filter(u => tab === "all" || u.status === tab);

  const mono = { fontFamily: "JetBrains Mono, monospace" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", ...mono }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "error" ? "#2a0f0f" : "#0f2a1a",
          border: `1px solid ${toast.type === "error" ? "#ff3b3b" : "#00ff88"}`,
          color:  toast.type === "error" ? "#ff6b6b" : "#4cff9e",
          padding: "10px 18px", borderRadius: 4, fontSize: 12,
          animation: "slideDown 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e1e", padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0d0d0d", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#fff" }}>
            KEEP<span style={{ color: "#00ff88" }}>ALIVE</span>
            <span style={{ color: "#2a2a2a", marginLeft: 10, fontSize: 11, fontFamily: "inherit" }}>/ ADMIN</span>
          </div>
          <div style={{ width: 1, height: 28, background: "#1e1e1e" }} />
          <button onClick={() => navigate("/")} style={ghostBtn}>← DASHBOARD</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {user?.picture && (
            <img src={user.picture} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #2a2a2a" }} />
          )}
          <span style={{ fontSize: 11, color: "#444" }}>{user?.email}</span>
          <button onClick={() => { logout(); navigate("/login"); }} style={ghostBtn}>SIGN OUT</button>
        </div>
      </header>

      <div style={{ padding: "28px 32px" }}>

        {/* Stat cards */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "TOTAL USERS",    value: stats.total,    color: "#888" },
              { label: "PENDING",        value: stats.pending,  color: "#f5c518" },
              { label: "APPROVED",       value: stats.approved, color: "#00ff88" },
              { label: "ACTIVE SERVICES",value: stats.services, color: "#00ff88" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 6, padding: "16px 20px" }}>
                <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 2, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1a1a1a" }}>
          {["pending", "approved", "rejected", "all"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none",
              border: "none",
              borderBottom: tab === t ? "2px solid #00ff88" : "2px solid transparent",
              color: tab === t ? "#00ff88" : "#333",
              padding: "8px 18px", fontSize: 10, fontFamily: "inherit",
              letterSpacing: 2, cursor: "pointer", transition: "color 0.15s",
              marginBottom: -1,
            }}>
              {t.toUpperCase()}
              {stats && t !== "all" && (
                <span style={{ marginLeft: 6, color: tab === t ? "#00ff88" : "#2a2a2a" }}>
                  ({stats[t] ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User rows */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#2a2a2a", fontSize: 11, letterSpacing: 2 }}>LOADING...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#1e1e1e", fontSize: 12, letterSpacing: 2 }}>
            NO {tab.toUpperCase()} USERS
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(u => (
              <div key={u.id} style={{
                background: "#0d0d0d",
                border: `1px solid ${u.status === "pending" ? "#2a1f00" : u.status === "approved" ? "#0f2a1a" : "#2a0f0f"}`,
                borderRadius: 6, padding: "16px 20px",
                display: "grid",
                gridTemplateColumns: "36px 1fr auto",
                gap: 16, alignItems: "center",
                animation: "fadeIn 0.2s ease",
              }}>
                {/* Avatar */}
                {u.picture
                  ? <img src={u.picture} alt="" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #1e1e1e" }} />
                  : <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>?</div>
                }

                {/* Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "#e0e0e0", fontSize: 13 }}>{u.name}</span>
                    <Badge color={S_COLOR[u.status]} bg={S_BG[u.status]}>{u.status.toUpperCase()}</Badge>
                    {u.role === "admin" && <Badge color="#8888ff" bg="#16163a">ADMIN</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 3 }}>{u.email}</div>
                  <div style={{ fontSize: 10, color: "#2a2a2a", marginTop: 2 }}>
                    Joined {new Date(u.created_at).toLocaleDateString()}
                    {u.approved_at && ` · Approved ${new Date(u.approved_at).toLocaleDateString()}`}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {u.status === "pending" && (
                    <>
                      <ActionBtn color="#00ff88" bg="#0f2a1a" disabled={busy === u.id} onClick={() => handleApprove(u.id)}>
                        ✓ APPROVE
                      </ActionBtn>
                      <ActionBtn color="#ff3b3b" bg="#2a0f0f" disabled={busy === u.id} onClick={() => handleReject(u.id)}>
                        ✕ REJECT
                      </ActionBtn>
                    </>
                  )}
                  {u.status === "rejected" && u.role !== "admin" && (
                    <ActionBtn color="#00ff88" bg="#0f2a1a" disabled={busy === u.id} onClick={() => handleApprove(u.id)}>
                      ✓ APPROVE
                    </ActionBtn>
                  )}
                  {u.role !== "admin" && (
                    <ActionBtn color="#555" bg="none" border="#1e1e1e" onClick={() => handleDelete(u.id)}>
                      🗑
                    </ActionBtn>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function Badge({ color, bg, children }) {
  return (
    <span style={{
      fontSize: 9, color, background: bg,
      padding: "2px 7px", borderRadius: 2, letterSpacing: 1,
    }}>
      {children}
    </span>
  );
}

function ActionBtn({ onClick, disabled, color, bg, border, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg,
      border: `1px solid ${border ?? color + "44"}`,
      color,
      padding: "6px 14px", fontSize: 10,
      fontFamily: "JetBrains Mono, monospace",
      fontWeight: 700, letterSpacing: 1.5,
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: 3, opacity: disabled ? 0.5 : 1,
      transition: "opacity 0.15s",
    }}>
      {disabled ? "..." : children}
    </button>
  );
}

const ghostBtn = {
  background: "none", border: "1px solid #1e1e1e", color: "#444",
  padding: "5px 12px", fontSize: 10, fontFamily: "JetBrains Mono, monospace",
  cursor: "pointer", borderRadius: 3, letterSpacing: 1.5,
};