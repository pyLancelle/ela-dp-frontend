"use client";

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

interface ArtistListeningChartProps {
  data: MonthlyDataPoint[];
  title?: string;
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

export function ArtistListeningChart({ data, title = "Évolution d'écoute" }: ArtistListeningChartProps) {
  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
        {title}
      </p>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="artistChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={1}
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
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#artistChartGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }}
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
