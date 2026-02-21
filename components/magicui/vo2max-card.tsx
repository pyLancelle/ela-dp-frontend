"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

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
  const gradientId = `vo2-gradient-${isUp ? "up" : isDown ? "down" : "flat"}`;

  const chartData = d.weeklyVo2maxArray.map((v, i) => ({ i, v }));

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

      {/* Recharts Area */}
      <motion.div
        className="flex-1 min-h-0"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                <stop offset="75%" stopColor={lineColor} stopOpacity={0.08} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} hide />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                fontSize: "11px",
                color: "var(--foreground)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
              itemStyle={{ color: lineColor }}
              formatter={(value: number) => [`${value.toFixed(1)} ml/kg/min`, "VO2Max"]}
              labelFormatter={() => ""}
              cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: lineColor,
                stroke: "rgba(255,255,255,0.6)",
                strokeWidth: 1.5,
              }}
              isAnimationActive={inView}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
