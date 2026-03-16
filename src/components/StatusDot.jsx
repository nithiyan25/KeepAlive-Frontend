const COLOR = {
  up:       "#00ff88",
  down:     "#ff3b3b",
  idle:     "#333333",
  pinging:  "#f5c518",
  timeout:  "#f5c518",
  degraded: "#ff8800",
};

const ANIMATION = {
  up:      "breathe 2.5s infinite",
  pinging: "pulse 0.7s infinite",
};

export default function StatusDot({ status = "idle" }) {
  const color = COLOR[status] ?? COLOR.idle;
  const glow  = status === "up" || status === "pinging";

  return (
    <span
      style={{
        display:      "inline-block",
        width:        10,
        height:       10,
        borderRadius: "50%",
        flexShrink:   0,
        background:   color,
        boxShadow:    glow ? `0 0 8px ${color}` : "none",
        animation:    ANIMATION[status] ?? "none",
      }}
    />
  );
}