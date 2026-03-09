"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyDataPoint {
  month: string;
  plays: number;
  minutes: number;
}

interface AccentColor {
  r: number;
  g: number;
  b: number;
}

interface ArtistListeningChartProps {
  data: MonthlyDataPoint[];
  title?: string;
  accentColor?: AccentColor | null;
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Array<any>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div className="liquid-glass-filter rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-0.5 font-medium">{label}</p>
      <p className="text-foreground font-semibold">{value} min</p>
    </div>
  );
}

export function ArtistListeningChart({ data, title = "Évolution d'écoute", accentColor }: ArtistListeningChartProps) {
  const strokeColor = accentColor
    ? `rgb(${accentColor.r},${accentColor.g},${accentColor.b})`
    : "#06b6d4";

  const gradientId = useMemo(() => `artistChartGrad-${Math.random().toString(36).slice(2, 8)}`, []);

  // N'afficher que le nom du mois à la première semaine de chaque mois
  const monthTicks = useMemo(() => {
    const seen = new Set<string>();
    return data.map((d) => {
      // "month" field looks like "2 oct." — extract month part
      const parts = d.month.trim().split(/\s+/);
      const monthLabel = parts.slice(1).join(" "); // "oct.", "nov.", etc.
      if (!seen.has(monthLabel)) {
        seen.add(monthLabel);
        return monthLabel;
      }
      return "";
    });
  }, [data]);

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        {title}
      </p>

      <div className="flex-1 min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.5} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(_, index) => monthTicks[index] ?? ""}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={({ active, payload, label }) => (
              <CustomTooltip active={active} payload={payload} label={label} />
            )} />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
