"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TimeSeriesPoint } from "@/types/activity-detail";
import { Mountain } from "lucide-react";

interface ElevationProfileChartProps {
  timeSeries: TimeSeriesPoint[];
  elevationGain: number;
  elevationLoss: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="liquid-glass-filter rounded-xl px-3 py-2 text-xs">
      <span className="font-medium">elevation: {payload[0].value} m</span>
    </div>
  );
}

export function ElevationProfileChart({
  timeSeries,
  elevationGain,
  elevationLoss,
}: ElevationProfileChartProps) {
  const chartData = timeSeries.filter((_, index) => index % 10 === 0).map((point) => ({
    distance: point.distance.toFixed(2),
    altitude: point.altitude,
  }));

  return (
    <div className="liquid-glass-card rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Shimmer top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Header */}
      <div className="px-3 pt-3 pb-1 flex items-center gap-2 flex-wrap">
        <div className="p-1.5 rounded-lg bg-green-500/20 ring-1 ring-green-400/30">
          <Mountain className="h-3.5 w-3.5 text-green-400" />
        </div>
        <span className="text-xs font-semibold tracking-tight">Elevation</span>
        <div className="flex gap-2 text-[10px] font-normal text-muted-foreground ml-1">
          <span className="text-green-500">▲ {elevationGain}m</span>
          <span className="text-red-500">▼ {elevationLoss}m</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="fillAltitude" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={30}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fill="url(#fillAltitude)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
