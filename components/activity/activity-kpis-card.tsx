"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Timer, Route, Heart, TrendingUp, Mountain, ChartBarStacked } from "lucide-react";
import type { ActivitySummary, PerformanceScores } from "@/types/activity-detail";

interface ActivityKpisCardProps {
  summary: ActivitySummary;
  scores: PerformanceScores;
}

export function ActivityKpisCard({ summary, scores }: ActivityKpisCardProps) {
  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, "0")}"`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:00`;
  };

  const kpis = [
    {
      icon: Route,
      label: "Distance",
      value: summary.distance.toFixed(2),
      unit: "km",
      color: "text-blue-500",
    },
    {
      icon: Timer,
      label: "Temps",
      value: formatDuration(summary.duration),
      unit: "",
      color: "text-purple-500",
    },
    {
      icon: Activity,
      label: "Allure moy",
      value: formatPace(summary.avgPace),
      unit: "/km",
      color: "text-green-500",
    },
    {
      icon: Mountain,
      label: "Dénivelé +",
      value: summary.elevationGain.toString(),
      unit: "m",
      color: "text-amber-600",
    },
    {
      icon: Heart,
      label: "FC moyenne",
      value: summary.avgHeartRate.toString(),
      unit: "bpm",
      color: "text-red-500",
    },
    {
      icon: Heart,
      label: "FC max",
      value: summary.maxHeartRate.toString(),
      unit: "bpm",
      color: "text-orange-500",
    },
    {
      icon: TrendingUp,
      label: "Aérobie",
      value: scores.aerobicScore.toFixed(1),
      unit: "",
      color: "text-cyan-500",
    },
    {
      icon: TrendingUp,
      label: "Anaérobie",
      value: scores.anaerobicScore.toFixed(1),
      unit: "",
      color: "text-pink-500",
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-3">
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <div className="grid grid-cols-2 grid-rows-4 gap-x-4 gap-y-5 h-full">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="flex flex-col gap-0.5"
              >
                <div className="flex items-center gap-1">
                  <Icon className={`h-3 w-3 ${kpi.color}`} />
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
                    {kpi.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">
                    {kpi.value}
                  </span>
                  {kpi.unit && (
                    <span className="text-[10px] text-muted-foreground">
                      {kpi.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
