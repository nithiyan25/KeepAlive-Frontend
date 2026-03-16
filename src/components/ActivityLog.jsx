const STATUS_STYLE = {
  up:       { border: "#00ff88", text: "#4cff9e",  icon: "✓" },
  down:     { border: "#ff3b3b", text: "#ff6b6b",  icon: "✗" },
  timeout:  { border: "#f5c518", text: "#f5c518",  icon: "⏱" },
  degraded: { border: "#ff8800", text: "#ff8800",  icon: "~" },
};

const DEFAULT_STYLE = { border: "#333", text: "#888", icon: "·" };

export default function ActivityLog({ log = [] }) {
  return (
    <aside style={{
      padding: "24px 20px",
      background: "#080808",
      overflowY: "auto",
      maxHeight: "calc(100vh - 73px)",
      borderLeft: "1px solid #1a1a1a",
    }}>
      <div style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: 3, marginBottom: 14 }}>
        ACTIVITY LOG
      </div>

      {!log.length ? (
        <p style={{ fontSize: 11, color: "#1e1e1e", letterSpacing: 1 }}>Waiting for pings...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {log.slice(0, 50).map((entry) => {
            const style = STATUS_STYLE[entry.status] ?? DEFAULT_STYLE;
            const ts    = new Date(entry.timestamp).toLocaleTimeString();

            return (
              <div
                key={entry.id}
                style={{ borderLeft: `2px solid ${style.border}`, paddingLeft: 8, animation: "fadeIn 0.15s ease" }}>
                <div style={{ fontSize: 9, color: "#333" }}>{ts}</div>
                <div style={{ fontSize: 11, color: style.text, lineHeight: 1.4, marginTop: 1 }}>
                  {entry.name} — {style.icon} {entry.status.toUpperCase()} — {entry.response_time}ms
                </div>
                {entry.error && (
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{entry.error}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}