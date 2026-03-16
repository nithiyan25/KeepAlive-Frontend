import { useState, useEffect } from "react";

export default function AddServiceForm({ onSave, onCancel, editData = null }) {
  const [name,     setName]     = useState("");
  const [url,      setUrl]      = useState("");
  const [interval, setInterval] = useState("10");

  // Populate fields when editing an existing service
  useEffect(() => {
    if (editData) {
      setName(editData.name ?? "");
      setUrl(editData.url ?? "");
      setInterval(String(editData.interval ?? 10));
    } else {
      setName(""); setUrl(""); setInterval("10");
    }
  }, [editData]);

  const handleSave = () => {
    if (!url.trim()) return alert("URL is required");
    onSave({ name: name.trim() || url.trim(), url: url.trim(), interval: Number(interval) });
  };

  const input = {
    background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#ccc",
    padding: "8px 12px", fontSize: 12, fontFamily: "inherit",
    borderRadius: 3, outline: "none", width: "100%",
  };

  const label = { fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 5, display: "block" };

  return (
    <div style={{
      background: "#111", border: "1px solid #2a2a2a", borderRadius: 6,
      padding: "20px 24px", marginBottom: 24, animation: "slideDown 0.2s ease",
    }}>
      <div style={{ fontSize: 10, color: "#444", letterSpacing: 3, marginBottom: 16 }}>
        {editData ? "EDIT SERVICE" : "NEW SERVICE"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 120px", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={label}>NAME</label>
          <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="My Backend" />
        </div>
        <div>
          <label style={label}>URL</label>
          <input style={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-app.onrender.com/health" />
        </div>
        <div>
          <label style={label}>PING INTERVAL</label>
          <select style={{ ...input, cursor: "pointer" }} value={interval} onChange={(e) => setInterval(e.target.value)}>
            <option value="1">Every 1 min</option>
            <option value="2">Every 2 min</option>
            <option value="5">Every 5 min</option>
            <option value="10">Every 10 min</option>
            <option value="14">Every 14 min</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          style={{ background: "#00ff88", color: "#000", border: "none", padding: "8px 20px", fontSize: 11, fontFamily: "inherit", fontWeight: 700, letterSpacing: 1.5, cursor: "pointer", borderRadius: 3 }}>
          {editData ? "UPDATE" : "SAVE & PING"}
        </button>
        <button
          onClick={onCancel}
          style={{ background: "none", color: "#555", border: "1px solid #2a2a2a", padding: "8px 14px", fontSize: 11, fontFamily: "inherit", cursor: "pointer", borderRadius: 3 }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}