"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import type { TimeSeriesPoint } from "@/types/activity-detail";
import { Gauge } from "lucide-react";

interface PaceLineChartProps {
  timeSeries: TimeSeriesPoint[];
  avgPace: number;
}

export function PaceLineChart({ timeSeries, avgPace }: PaceLineChartProps) {
  // Sample every 5 points for performance
  const chartData = timeSeries.filter((_, index) => index % 5 === 0).map((point) => ({
    distance: point.distance.toFixed(2),
    pace: point.pace,
  }));

  const chartConfig = {
    pace: {
      label: "Allure",
      color: "hsl(var(--chart-2))",
    },
  };

  const formatPace = (value: number) => {
    const min = Math.floor(value);
    const sec = Math.round((value - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-500" />
            Allure de course
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            Moyenne : {formatPace(avgPace)}/km
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
              reversed
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={formatPace}
              label={{ value: "Allure (min/km)", angle: -90, position: "insideLeft" }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    return (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Distance : {props.payload.distance} km
                        </div>
                        <div className="font-medium text-blue-500">
                          {formatPace(Number(value))}/km
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <ReferenceLine
              y={avgPace}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              label={{
                value: "Moyenne",
                position: "right",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="pace"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
