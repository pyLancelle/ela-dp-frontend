"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Vo2maxCardProps {
  data?: {
    currentVo2max: number;
    weeklyVo2maxArray: number[];
    vo2maxDelta6Months: number;
  } | null;
  loading?: boolean;
  className?: string;
}

const mockData = {
  currentVo2max: 54.2,
  weeklyVo2maxArray: [51.0, 51.5, 52.0, 51.8, 52.5, 53.0, 52.8, 53.5, 54.0, 54.2],
  vo2maxDelta6Months: 3.2,
};

export function Vo2maxCard({ data, loading, className }: Vo2maxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const d = data ?? mockData;
  const delta = d.vo2maxDelta6Months;
  const isUp = delta > 0;
  const isDown = delta < 0;
  const deltaColor = isUp ? "#22c55e" : isDown ? "#ef4444" : "#6b7280";
  const lineColor = isUp ? "#22c55e" : isDown ? "#ef4444" : "#6366f1";

  const pts = d.weeklyVo2maxArray;
  const minY = Math.min(...pts);
  const maxY = Math.max(...pts);
  const rangeY = maxY - minY || 1;

  // SVG path
  const W = 200;
  const H = 48;
  const padX = 4;
  const padY = 4;
  const toX = (i: number) => padX + (i / (pts.length - 1)) * (W - padX * 2);
  const toY = (v: number) => H - padY - ((v - minY) / rangeY) * (H - padY * 2);

  const pathD = pts
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`)
    .join(" ");

  const areaD = `${pathD} L ${toX(pts.length - 1).toFixed(1)} ${H} L ${toX(0).toFixed(1)} ${H} Z`;

  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              VO2 Max
            </p>
            <span className="text-[10px] text-muted-foreground">6 derniers mois</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums leading-none">
            {d.currentVo2max.toFixed(1)}
          </span>
          <p className="text-[10px] text-muted-foreground">ml/kg/min</p>
          <div
            className="flex items-center gap-0.5 justify-end mt-0.5"
            style={{ color: deltaColor }}
          >
            {isUp && <ArrowUpRight className="h-3 w-3" />}
            {isDown && <ArrowDownRight className="h-3 w-3" />}
            <span className="text-[11px] font-semibold">
              {isUp ? "+" : ""}{delta.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex-1 min-h-0 flex items-end">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="vo2-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
            <clipPath id="vo2-clip">
              <motion.rect
                x="0" y="0" height={H}
                initial={{ width: 0 }}
                animate={inView ? { width: W } : { width: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              />
            </clipPath>
          </defs>

          {/* Area fill */}
          <path
            d={areaD}
            fill="url(#vo2-area-grad)"
            clipPath="url(#vo2-clip)"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath="url(#vo2-clip)"
          />

          {/* Dot final */}
          <motion.circle
            cx={toX(pts.length - 1)}
            cy={toY(pts[pts.length - 1])}
            r="3"
            fill={lineColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ delay: 1.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </svg>
      </div>
    </div>
  );
}
