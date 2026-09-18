import { PricePoint } from "@/data/price-history";

/**
 * رسم مصغّر لتاريخ السعر — SVG خالص بدون أي مكتبة
 * (Server Component: بيطلع كامل في الـ HTML، جوجل والمستخدم يشوفوه فورًا)
 */
export function PriceSparkline({
  points,
  trend,
  width = 96,
  height = 28
}: {
  points: PricePoint[];
  trend: "up" | "down" | "same" | "new";
  width?: number;
  height?: number;
}) {
  if (!points.length) return null;

  const stroke =
    trend === "up" ? "#ef4444" : trend === "down" ? "#10b981" : "#94a3b8";

  if (points.length === 1) {
    return (
      <svg width={width} height={height} aria-hidden="true">
        <circle cx={width / 2} cy={height / 2} r="3" fill={stroke} />
      </svg>
    );
  }

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = 4;

  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (width - pad * 2);
    // السعر الأعلى = نقطة أعلى في الرسم (y أصغر)
    const y = pad + (1 - (p.price - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const last = coords[coords.length - 1].split(",");

  return (
    <svg width={width} height={height} aria-hidden="true" className="overflow-visible">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill={stroke} />
    </svg>
  );
}
