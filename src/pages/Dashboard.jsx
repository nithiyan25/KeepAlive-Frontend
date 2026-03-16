import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useServices } from "../hooks/useServices";
import AddServiceForm from "../components/AddServiceForm";
import ServiceCard    from "../components/ServiceCard";
import ActivityLog    from "../components/ActivityLog";

export default function Dashboard() {
  const { user, logout }  = useAuth();
  const navigate           = useNavigate();
  const {
    services, log, loading, error,
    addService, updateService, deleteService, pingNow, toggleService,
  } = useServices();

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const upCount   = services.filter(s => s.status === "up").length;
  const downCount = services.filter(s => s.status === "down").length;

  const handleSave = async (data) => {
    if (editData) await updateService(editData.id, data);
    else          await addService(data);
    setShowForm(false);
    setEditData(null);
  };

  const handleEdit   = (svc) => { setEditData(svc); setShowForm(true); };
  const handleCancel = ()    => { setShowForm(false); setEditData(null); };
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this service?")) return;
    await deleteService(id);
  };

  const mono = { fontFamily: "JetBrains Mono, monospace" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e1e", padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#0d0d0d", position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.5px" }}>
              KEEP<span style={{ color: "#00ff88" }}>ALIVE</span>
            </div>
            <div style={{ fontSize: 9, color: "#2a2a2a", letterSpacing: 3, marginTop: 2, ...mono }}>FREE TIER PINGER</div>
          </div>
          <div style={{ width: 1, height: 32, background: "#1e1e1e" }} />
          <div style={{ display: "flex", gap: 20, fontSize: 11, ...mono }}>
            <span><span style={{ color: "#00ff88", fontWeight: 700 }}>{upCount}</span>   <span style={{ color: "#2a2a2a" }}>UP</span></span>
            <span><span style={{ color: "#ff3b3b", fontWeight: 700 }}>{downCount}</span> <span style={{ color: "#2a2a2a" }}>DOWN</span></span>
            <span><span style={{ color: "#333" }}>{services.length}</span>               <span style={{ color: "#1e1e1e" }}>TOTAL</span></span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, ...mono }}>
          {/* User pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#111", border: "1px solid #1e1e1e", borderRadius: 20, padding: "4px 12px 4px 4px" }}>
            {user?.picture && (
              <img src={user.picture} alt="" style={{ width: 24, height: 24, borderRadius: "50%" }} />
            )}
            <span style={{ fontSize: 11, color: "#555" }}>{user?.name}</span>
          </div>

          {/* Admin link (admin only) */}
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} style={headerBtn}>
              ADMIN ↗
            </button>
          )}

          {/* Add service */}
          <button
            onClick={() => { if (showForm) { setShowForm(false); setEditData(null); } else { setEditData(null); setShowForm(true); } }}
            style={{
              background: showForm ? "none" : "#00ff88",
              color:      showForm ? "#555" : "#000",
              border:     showForm ? "1px solid #2a2a2a" : "none",
              padding: "8px 18px", fontSize: 11, fontFamily: "inherit",
              fontWeight: 700, letterSpacing: 1.5, cursor: "pointer",
              borderRadius: 3, transition: "all 0.2s",
            }}>
            {showForm ? "✕ CANCEL" : "+ ADD SERVICE"}
          </button>

          {/* Sign out */}
          <button onClick={() => { logout(); navigate("/login"); }} style={headerBtn}>
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", minHeight: "calc(100vh - 73px)" }}>

        <main style={{ padding: "24px 32px", borderRight: "1px solid #1a1a1a" }}>

          {/* Error */}
          {error && (
            <div style={{ background: "#2a0f0f", border: "1px solid #ff3b3b44", borderRadius: 4, padding: "10px 16px", marginBottom: 20, fontSize: 12, color: "#ff6b6b", ...mono }}>
              ⚠ {error}
            </div>
          )}

          {/* Add / Edit form */}
          {showForm && (
            <AddServiceForm onSave={handleSave} onCancel={handleCancel} editData={editData} />
          )}

          {/* Service list */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#2a2a2a", fontSize: 11, letterSpacing: 2, ...mono }}>
              LOADING...
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#2a2a2a", ...mono }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 12, letterSpacing: 2 }}>NO SERVICES YET</div>
              <div style={{ fontSize: 10, color: "#1e1e1e", marginTop: 8 }}>
                Click "+ ADD SERVICE" to register your first backend
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map(svc => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  onPing={pingNow}
                  onToggle={toggleService}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <p style={{ marginTop: 8, fontSize: 10, color: "#1e1e1e", letterSpacing: 1.5, textAlign: "center", ...mono }}>
                TIP — Set interval to 14 min for Render.com (spins down after 15 min of inactivity)
              </p>
            </div>
          )}
        </main>

        <ActivityLog log={log} />
      </div>
    </div>
  );
}

const headerBtn = {
  background: "none", border: "1px solid #1e1e1e", color: "#444",
  padding: "6px 14px", fontSize: 10, fontFamily: "JetBrains Mono, monospace",
  cursor: "pointer", borderRadius: 3, letterSpacing: 1.5, transition: "all 0.15s",
};