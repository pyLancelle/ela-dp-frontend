"use client";

import { motion } from "motion/react";

interface CircularZoneProgressProps {
  value: number;     // percentage 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;     // e.g. "32%"
  sublabel: string;  // e.g. "Z2"
  delay?: number;
}

export function CircularZoneProgress({
  value,
  color,
  size = 72,
  strokeWidth = 7,
  label,
  sublabel,
  delay = 0,
}: CircularZoneProgressProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(100, value) / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </svg>
      {/* Center labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold leading-none" style={{ color }}>
          {label}
        </span>
        <span className="text-[9px] text-muted-foreground mt-0.5">{sublabel}</span>
      </div>
    </div>
  );
}
