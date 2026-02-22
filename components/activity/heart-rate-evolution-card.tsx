"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { TimeSeriesPoint, HeartRateZone } from "@/types/activity-detail";
import { Heart, Mountain, Gauge } from "lucide-react";

interface HeartRateEvolutionCardProps {
  timeSeries: TimeSeriesPoint[];
  zones: HeartRateZone[];
  avgHeartRate: number;
  maxHeartRate: number;
}

type MetricKey = "heartRate" | "altitude" | "pace";

const METRICS: Record<MetricKey, {
  label: string;
  unit: string;
  color: string;
  icon: React.ElementType;
  format: (v: number) => string;
  yAxisId: string;
}> = {
  heartRate: {
    label: "FC",
    unit: "bpm",
    color: "#f43f5e",
    icon: Heart,
    format: (v) => `${Math.round(v)}`,
    yAxisId: "hr",
  },
  altitude: {
    label: "Élévation",
    unit: "m",
    color: "#4ade80",
    icon: Mountain,
    format: (v) => `${Math.round(v)}`,
    yAxisId: "alt",
  },
  pace: {
    label: "Allure",
    unit: "/km",
    color: "#38bdf8",
    icon: Gauge,
    format: (v) => {
      if (v <= 0 || v > 20) return "—";
      const min = Math.floor(v);
      const sec = Math.round((v - min) * 60);
      return `${min}'${String(sec).padStart(2, "0")}"`;
    },
    yAxisId: "pace",
  },
};

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2, "0")}`;
  return `${m}min`;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const time = payload[0]?.payload?.time ?? "";

  return (
    <div className="liquid-glass-filter rounded-xl px-3 py-2 space-y-1.5 pointer-events-none">
      <div className="text-[10px] text-muted-foreground border-b border-white/10 pb-1">{time}</div>
      {payload.filter((entry: any, idx: number, arr: any[]) =>
        arr.findIndex((e) => e.dataKey === entry.dataKey) === idx
      ).map((entry: any, idx: number) => {
        const metricKey = entry.dataKey as MetricKey;
        const cfg = METRICS[metricKey];
        if (!cfg) return null;
        const Icon = cfg.icon;
        return (
          <div key={`${metricKey}_${idx}`} className="flex items-center gap-1.5">
            <Icon style={{ width: 10, height: 10, color: cfg.color, flexShrink: 0 }} />
            <span className="text-[12px] font-bold tabular-nums" style={{ color: cfg.color }}>
              {cfg.format(entry.value)}
            </span>
            <span className="text-[9px] text-muted-foreground">{cfg.unit}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HeartRateEvolutionCard({
  timeSeries,
  zones,
  avgHeartRate,
  maxHeartRate,
}: HeartRateEvolutionCardProps) {
  const [active, setActive] = useState<Set<MetricKey>>(new Set(["heartRate"]));

  const toggleMetric = (key: MetricKey) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key) && next.size === 1) return next;
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Sous-échantillonnage + formatage
  const data = useMemo(() => {
    if (!timeSeries.length) return [];
    const t0 = timeSeries[0].timestamp; // Unix ms du premier point
    return timeSeries
      .filter((_, i) => i % 5 === 0)
      .map((p, idx) => ({
        idx,
        offsetSec: Math.round((p.timestamp - t0) / 1000),
        time: formatDuration(Math.round((p.timestamp - t0) / 1000)),
        heartRate: p.heartRate,
        altitude: p.altitude,
        pace: p.pace != null && p.pace > 0 && p.pace < 20 ? p.pace : null,
      }));
  }, [timeSeries]);

  // Ticks X — index dans data[] toutes les ~10-15min
  const tickIndices = useMemo(() => {
    if (!data.length) return [];
    const totalSec = data[data.length - 1]?.offsetSec ?? 0;
    const stepSec = totalSec > 3600 ? 15 * 60 : 10 * 60;
    const indices: number[] = [];
    for (let t = stepSec; t < totalSec; t += stepSec) {
      const idx = data.findIndex((p) => p.offsetSec >= t);
      if (idx >= 0 && !indices.includes(idx)) indices.push(idx);
    }
    return indices;
  }, [data]);

  const tickStyle = { fontSize: 10, fill: "rgba(255,255,255,0.25)" };

  return (
    <div className="liquid-glass-card rounded-2xl h-full overflow-hidden relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent absolute top-0 left-0 z-10" />

      {/* Légende overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Activité</span>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {(Object.entries(METRICS) as [MetricKey, typeof METRICS[MetricKey]][]).map(([key, cfg]) => {
            const isOn = active.has(key);
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => toggleMetric(key)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-150 cursor-pointer"
                style={{
                  background: isOn ? `${cfg.color}22` : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isOn ? cfg.color + "55" : "rgba(255,255,255,0.08)"}`,
                  color: isOn ? cfg.color : "rgba(255,255,255,0.28)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon style={{ width: 10, height: 10 }} strokeWidth={isOn ? 2.5 : 1.5} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart — pleine hauteur */}
      <div className="absolute inset-0 pt-9 pb-1 px-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 12 }}>
            <defs>
              {(Object.entries(METRICS) as [MetricKey, typeof METRICS[MetricKey]][]).map(([key, cfg]) => (
                <linearGradient key={key} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cfg.color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={cfg.color} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            {/* Axes Y cachés, un par métrique pour le scaling indépendant */}
            <YAxis yAxisId="hr"   hide domain={["dataMin - 8", "dataMax + 8"]} />
            <YAxis yAxisId="alt"  hide domain={["dataMin - 5", "dataMax + 5"]} />
            <YAxis yAxisId="pace" hide domain={["dataMin - 0.2", "dataMax + 0.2"]} reversed />

            <XAxis
              dataKey="idx"
              type="number"
              domain={[0, data.length - 1]}
              ticks={tickIndices}
              tickFormatter={(idx) => data[idx]?.time ?? ""}
              tickLine={false}
              axisLine={false}
              tick={tickStyle}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1, strokeDasharray: "4 3" }}
            />

            {/* Areas + Lines par métrique */}
            {(Object.entries(METRICS) as [MetricKey, typeof METRICS[MetricKey]][]).map(([key, cfg]) => {
              if (!active.has(key)) return null;
              return [
                <Area
                  key={`area_${key}`}
                  yAxisId={cfg.yAxisId}
                  dataKey={key}
                  fill={`url(#grad_${key})`}
                  stroke="none"
                  connectNulls
                  isAnimationActive={false}
                />,
                <Line
                  key={`line_${key}`}
                  yAxisId={cfg.yAxisId}
                  type="monotoneX"
                  dataKey={key}
                  stroke={cfg.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                  style={{ filter: `drop-shadow(0 0 4px ${cfg.color}70)` }}
                />,
              ];
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
