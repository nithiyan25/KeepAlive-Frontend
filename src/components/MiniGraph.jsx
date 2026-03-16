const W = 90;
const H = 28;

export default function MiniGraph({ history = [], status }) {
  if (!history.length) {
    return <span style={{ color: "#222", fontSize: 10 }}>no data</span>;
  }

  const arr  = history.slice(-14);
  const max  = Math.max(...arr.map((h) => h.time ?? 0), 1);
  const last = arr[arr.length - 1];

  const points = arr.map((item, i) => {
    const x = arr.length === 1 ? W / 2 : (i / (arr.length - 1)) * W;
    const y = H - ((item.time ?? 0) / max) * (H - 5);
    return [x, y];
  });

  const polyline  = points.map((p) => p.join(",")).join(" ");
  const lineColor = status === "up" ? "#00ff88" : status === "down" ? "#ff3b3b" : "#444";

  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline
        points={polyline}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={arr[i]?.ok ? "#00ff88" : "#ff3b3b"} />
      ))}
    </svg>
  );
}