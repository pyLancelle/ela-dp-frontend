"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";
import type { HeartRateZone } from "@/types/activity-detail";
import { Heart } from "lucide-react";

interface HeartRateZonesChartProps {
  zones: HeartRateZone[];
}

export function HeartRateZonesChart({ zones }: HeartRateZonesChartProps) {
  // Filter out zones with 0 time
  const activeZones = zones.filter((zone) => zone.timeInZone > 0);

  const chartData = activeZones.map((zone) => ({
    name: `Z${zone.zone} - ${zone.name}`,
    value: zone.percentage,
    timeInZone: zone.timeInZone,
    color: zone.color,
  }));

  const chartConfig = activeZones.reduce((acc, zone) => {
    acc[`Z${zone.zone}`] = {
      label: zone.name,
      color: zone.color,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}min ${secs}s`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          Zones FC
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pt-0 px-2 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={50}
              cornerRadius="50%"
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    const payload = props.payload;
                    return (
                      <div className="space-y-1">
                        <div className="font-medium text-xs">{payload.name}</div>
                        <div className="text-xs space-y-0.5">
                          <div>Temps : {formatTime(payload.timeInZone)}</div>
                          <div>{payload.value.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Legend
              verticalAlign="bottom"
              height={24}
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-[10px]">
                  {payload?.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-muted-foreground">Z{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
