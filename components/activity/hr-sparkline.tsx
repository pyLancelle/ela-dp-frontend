"use client";

import { motion } from "motion/react";

interface HrSparklineProps {
  /** Normalized points 0-1, length ≥ 2 */
  points?: number[];
  color?: string;
  width?: number;
  height?: number;
}

const DEFAULT_PTS = [0.45, 0.50, 0.52, 0.60, 0.63, 0.68, 0.72, 0.70, 0.65, 0.62, 0.58, 0.60, 0.55, 0.50];

export function HrSparkline({
  points = DEFAULT_PTS,
  color = "#38bdf8",
  width = 300,
  height = 48,
}: HrSparklineProps) {
  const pad = 2;
  const step = (width - pad * 2) / (points.length - 1);

  const coords = points.map((v, i): [number, number] => [
    pad + i * step,
    pad + (1 - v) * (height - pad * 2),
  ]);

  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1][0]},${height} L${coords[0][0]},${height} Z`;

  const gradId = `hrGrad-${color.replace("#", "")}`;
  // Approximate total path length
  const pathLen = coords.reduce((acc, [x, y], i) => {
    if (i === 0) return 0;
    const [px, py] = coords[i - 1];
    return acc + Math.hypot(x - px, y - py);
  }, 0);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Animated line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen}
        initial={{ strokeDashoffset: pathLen }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}
