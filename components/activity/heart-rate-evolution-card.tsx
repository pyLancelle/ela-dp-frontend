"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceArea } from "recharts";
import type { TimeSeriesPoint, HeartRateZone } from "@/types/activity-detail";
import { Activity } from "lucide-react";

interface HeartRateEvolutionCardProps {
  timeSeries: TimeSeriesPoint[];
  zones: HeartRateZone[];
  avgHeartRate: number;
  maxHeartRate: number;
}

export function HeartRateEvolutionCard({
  timeSeries,
  zones,
  avgHeartRate,
  maxHeartRate,
}: HeartRateEvolutionCardProps) {
  // Sample every 5 points for performance while keeping good resolution
  const chartData = timeSeries.filter((_, index) => index % 5 === 0).map((point) => {
    const minutes = Math.floor(point.timestamp / 60);
    const seconds = point.timestamp % 60;
    return {
      time: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      heartRate: point.heartRate,
      timestamp: point.timestamp,
    };
  });

  const chartConfig = {
    heartRate: {
      label: "Fréquence cardiaque",
      color: "hsl(var(--chart-1))",
    },
  };

  // Sort zones by minHR for proper layering
  const sortedZones = [...zones].sort((a, b) => a.minHR - b.minHR);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            Évolution de la fréquence cardiaque
          </div>
          <div className="flex gap-4 text-sm font-normal text-muted-foreground">
            <div>Moyenne : {Math.round(avgHeartRate)} bpm</div>
            <div>Max : {Math.round(maxHeartRate)} bpm</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {/* Background zones with colored areas */}
            {sortedZones.map((zone) => (
              <ReferenceArea
                key={`zone-${zone.zone}`}
                y1={zone.minHR}
                y2={zone.maxHR}
                fill={zone.color}
                fillOpacity={0.2}
                strokeOpacity={0}
              />
            ))}

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={80}
              label={{ value: "Temps (mm:ss)", position: "insideBottom", offset: -5, fontSize: 12 }}
            />
            <YAxis
              domain={["dataMin - 10", "dataMax + 10"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => Math.round(value).toString()}
              label={{ value: "FC (bpm)", angle: -90, position: "insideLeft", fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    // Find which zone the heart rate belongs to
                    const hr = value as number;
                    const zone = sortedZones.find(
                      (z) => hr >= z.minHR && hr <= z.maxHR
                    );

                    return (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          Temps : {props.payload.time}
                        </div>
                        <div className="font-medium text-red-500">
                          {Math.round(value as number)} bpm
                        </div>
                        {zone && (
                          <div
                            className="text-xs font-medium"
                            style={{ color: zone.color }}
                          >
                            Zone {zone.zone} - {zone.name}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
