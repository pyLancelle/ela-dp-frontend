"use client";

import { motion } from "motion/react";

interface RouteTraceProps {
  /** Raw GPS points as [lat, lng] or [x, y] — will be normalized to SVG coords */
  points?: [number, number][];
  color?: string;
  /** Used to generate a deterministic mock if no points provided */
  seed?: string;
}

const W = 480;
const H = 140;
const PAD = 16;

function mockRoute(seed: string, n = 120): [number, number][] {
  let s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  const pts: [number, number][] = [[0, 0]];
  for (let i = 1; i < n; i++) {
    pts.push([pts[i - 1][0] + (rng() - 0.47) * 5, pts[i - 1][1] + (rng() - 0.5) * 4]);
  }
  return pts;
}

function normalize(pts: [number, number][]): [number, number][] {
  const xs = pts.map(p => p[0]);
  const ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const sc = (v: number, lo: number, hi: number, a: number, b: number) =>
    lo === hi ? (a + b) / 2 : a + ((v - lo) / (hi - lo)) * (b - a);
  return pts.map(([x, y]) => [
    sc(x, minX, maxX, PAD, W - PAD),
    sc(y, minY, maxY, H - PAD, PAD),
  ]);
}

// Approximate total path length
function pathLength(pts: [number, number][]) {
  return pts.reduce((acc, p, i) => {
    if (i === 0) return 0;
    return acc + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
  }, 0);
}

// Evenly-spaced km marker indices
function kmMarkers(pts: [number, number][], total: number): number[] {
  if (total <= 0) return [];
  const count = Math.floor(total) - 1;
  const indices: number[] = [];
  for (let k = 1; k <= count; k++) {
    indices.push(Math.round((k / total) * (pts.length - 1)));
  }
  return indices;
}

export function RouteTrace({ points, color = "#38bdf8", seed = "default" }: RouteTraceProps) {
  const raw = points && points.length >= 2 ? points : mockRoute(seed);
  const pts = normalize(raw);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const len = pathLength(pts);
  const gradId = `routeGrad-${seed.slice(0, 6)}`;

  // For mock data, pretend ~12 km — so show markers at thirds
  const markerIndices = [
    Math.round(pts.length * 0.33),
    Math.round(pts.length * 0.66),
  ];

  return (
    <div className="relative w-full h-full">
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="mapgrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* Route SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>

        {/* Glow halo */}
        <path d={d} fill="none" stroke={color} strokeWidth="6" strokeOpacity="0.12" strokeLinecap="round" strokeLinejoin="round" />

        {/* Animated route */}
        <motion.path
          d={d}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Start dot */}
        <circle cx={pts[0][0]} cy={pts[0][1]} r="5" fill="#4ade80" />
        <circle cx={pts[0][0]} cy={pts[0][1]} r="9" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Km markers */}
        {markerIndices.map((idx, i) => {
          const [cx, cy] = pts[idx] ?? [0, 0];
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.15 }}
            >
              <circle cx={cx} cy={cy} r="3" fill="#0f172a" stroke={color} strokeWidth="1.5" />
              <text x={cx + 7} y={cy - 4} fontSize="8" fill={color} fontFamily="monospace" opacity="0.8">
                {i + 1 === 1 ? "~4km" : "~8km"}
              </text>
            </motion.g>
          );
        })}

        {/* End dot */}
        <motion.circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="5"
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.3 }}
        />
      </svg>
    </div>
  );
}
