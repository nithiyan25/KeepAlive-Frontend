import { useState } from "react";
import StatusDot from "./StatusDot";
import MiniGraph from "./MiniGraph";

const BORDER = {
  up: "#0f2a1a", down: "#2a0f0f", timeout: "#2a1f00",
  degraded: "#2a1500", idle: "#1e1e1e", pinging: "#1e1e1e",
};

function ResponseTime({ ms, status }) {
  if (ms == null || status === "idle") {
    return <span style={{ color: "#2a2a2a", fontSize: 12 }}>—</span>;
  }
  const color = ms < 500 ? "#00ff88" : ms < 2000 ? "#f5c518" : "#ff3b3b";
  return <span style={{ color, fontWeight: 700, fontSize: 14 }}>{ms}ms</span>;
}

function IconBtn({ onClick, title, children, hoverColor = "#aaa" }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: `1px solid ${hover ? hoverColor : "#1e1e1e"}`,
        color: hover ? hoverColor : "#444",
        padding: "5px 9px",
        fontSize: 12,
        cursor: "pointer",
        borderRadius: 3,
        fontFamily: "inherit",
        transition: "all 0.15s",
      }}>
      {children}
    </button>
  );
}

export default function ServiceCard({ service, onPing, onToggle, onEdit, onDelete }) {
  const lastPinged = service.last_pinged
    ? new Date(service.last_pinged).toLocaleTimeString()
    : "Never";

  return (
    <div style={{
      background: "#0d0d0d",
      border: `1px solid ${BORDER[service.status] ?? BORDER.idle}`,
      borderRadius: 6,
      padding: "16px 20px",
      display: "grid",
      gridTemplateColumns: "12px 1fr 90px 80px auto",
      gap: 16,
      alignItems: "center",
      transition: "border-color 0.4s",
      animation: "fadeIn 0.2s ease",
    }}>

      {/* Status dot */}
      <StatusDot status={service.status} />

      {/* Name / URL / meta */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, color: "#e0e0e0", fontSize: 13 }}>
            {service.name}
          </span>
          <span style={{ fontSize: 9, color: "#444", background: "#161616", padding: "2px 7px", borderRadius: 2, letterSpacing: 1 }}>
            every {service.interval}m
          </span>
          {!service.enabled && (
            <span style={{ fontSize: 9, color: "#555", background: "#161616", padding: "2px 7px", borderRadius: 2, letterSpacing: 1 }}>
              PAUSED
            </span>
          )}
          {service.status === "pinging" && (
            <span style={{ fontSize: 9, color: "#f5c518", letterSpacing: 1.5, animation: "pulse 0.8s infinite" }}>
              PINGING...
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#3a3a3a", marginTop: 3, wordBreak: "break-all" }}>
          {service.url}
        </div>
        <div style={{ fontSize: 10, color: "#2a2a2a", marginTop: 4 }}>
          Last ping: {lastPinged}
        </div>
      </div>

      {/* Sparkline graph */}
      <div style={{ textAlign: "right" }}>
        <MiniGraph history={service.history} status={service.status} />
      </div>

      {/* Response time */}
      <div style={{ textAlign: "right" }}>
        <ResponseTime ms={service.response_time} status={service.status} />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 6 }}>
        <IconBtn onClick={() => onPing(service.id)}               title="Ping now"                     hoverColor="#00ff88">↺</IconBtn>
        <IconBtn onClick={() => onToggle(service.id, !service.enabled)} title={service.enabled ? "Pause" : "Resume"} hoverColor="#888">
          {service.enabled ? "⏸" : "▶"}
        </IconBtn>
        <IconBtn onClick={() => onEdit(service)}                  title="Edit"                         hoverColor="#aaa">✎</IconBtn>
        <IconBtn onClick={() => onDelete(service.id)}             title="Delete"                       hoverColor="#ff3b3b">✕</IconBtn>
      </div>
    </div>
  );
}