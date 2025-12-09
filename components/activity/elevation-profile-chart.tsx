"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import type { TimeSeriesPoint } from "@/types/activity-detail";
import { Mountain } from "lucide-react";

interface ElevationProfileChartProps {
  timeSeries: TimeSeriesPoint[];
  elevationGain: number;
  elevationLoss: number;
}

export function ElevationProfileChart({
  timeSeries,
  elevationGain,
  elevationLoss,
}: ElevationProfileChartProps) {
  // Sample every 10 points for smoother chart
  const chartData = timeSeries.filter((_, index) => index % 10 === 0).map((point) => ({
    distance: point.distance.toFixed(2),
    altitude: point.altitude,
  }));

  const chartConfig = {
    altitude: {
      label: "Altitude",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-green-500" />
            Elevation
          </div>
          <div className="flex gap-2 text-xs font-normal text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <span className="text-green-600">▲</span>
              <span>{elevationGain}m</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-red-600">▼</span>
              <span>{elevationLoss}m</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pt-0 px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="fillAltitude" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              width={30}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    return (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">elevation: {value} m</span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="altitude"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              fill="url(#fillAltitude)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
